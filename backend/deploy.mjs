import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import console from 'node:console';
import { parse } from 'jsonc-parser';

const ROOT = fileURLToPath(new URL('./', import.meta.url));
const EMPTY_DATABASE = '00000000-0000-0000-0000-000000000000';
const WORKFLOWS = [
  { binding: 'BACKGROUND_JOBS', class_name: 'BackgroundReplyWorkflow', suffix: 'replies' },
  { binding: 'GROUP_AUTONOMY', class_name: 'GroupAutonomyWorkflow', suffix: 'autonomy' },
];

export function prepareConfiguration(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)
    || typeof config.name !== 'string' || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(config.name)) {
    throw new Error('Worker 名称无效。请在 Cloudflare 安装页选择只含小写字母、数字和中划线的名称。');
  }
  if (config.main !== 'runtime.js' || config.env || config.build || config.assets
    || config.preview_urls !== false || config.observability?.enabled !== false
    || !config.compatibility_flags?.includes('global_fetch_strictly_public')) {
    throw new Error('部署配置与后台成品不匹配。请恢复本成品附带的配置，并保留你自己的 Worker 名称和数据库信息。');
  }
  if (Object.keys(config.vars ?? {}).some((name) => /^(?:INSTALL_CONFIG|PAIRING_SECRET|PAYLOAD_ENCRYPTION_KEY|VAPID_PRIVATE_JWK)$/.test(name))) {
    throw new Error('安装秘密不能写在 wrangler.jsonc 的普通变量中。请删除该明文变量，并只在 Cloudflare 的秘密输入框或 Worker 秘密设置中填写。');
  }
  const databases = config.d1_databases;
  if (!Array.isArray(databases) || databases.length !== 1 || databases[0].binding !== 'DB'
    || databases[0].migrations_dir !== 'migrations' || typeof databases[0].database_name !== 'string') {
    throw new Error('数据库绑定不完整。请保留 DB 绑定与 migrations 迁移目录。');
  }
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(databases[0].database_id ?? '') || databases[0].database_id === EMPTY_DATABASE) {
    throw new Error('Cloudflare 尚未填入你的数据库。请返回安装页面完成新建数据库；若已建好，请将其 database_id 填入 wrangler.jsonc 的 DB 绑定后重新部署。不要使用其他应用的数据库。');
  }
  if (!Array.isArray(config.workflows) || config.workflows.length !== WORKFLOWS.length
    || WORKFLOWS.some((expected) => config.workflows.filter((value) => value.binding === expected.binding && value.class_name === expected.class_name && !value.script_name).length !== 1)) {
    throw new Error('持久任务绑定不完整。请恢复 BACKGROUND_JOBS 与 GROUP_AUTONOMY 的成品配置后重新部署。');
  }
  if (JSON.stringify(config.triggers?.crons) !== JSON.stringify(['* * * * *'])) {
    throw new Error('后台定时检查配置不完整。请恢复成品附带的每分钟检查配置。');
  }
  const digest = createHash('sha256').update(config.name).digest('hex').slice(0, 12);
  return { ...config, keep_vars: true, send_metrics: false, workflows: WORKFLOWS.map(({ binding, class_name, suffix }) => ({
    binding, class_name, name: `${config.name.slice(0, 40)}-${digest}-${suffix}`,
  })) };
}

export function readConfiguration(directory = ROOT) {
  const errors = [];
  const filename = path.join(directory, 'wrangler.jsonc');
  if (!existsSync(filename) || !lstatSync(filename).isFile() || lstatSync(filename).isSymbolicLink()) throw new Error('缺少 wrangler.jsonc 配置文件。请使用完整后台成品。');
  const config = parse(readFileSync(filename, 'utf8'), errors, { allowTrailingComma: true, disallowComments: false });
  if (errors.length) throw new Error('wrangler.jsonc 格式不正确。请恢复有效的 JSON 配置，不要把安装秘密粘贴到这个文件。');
  return prepareConfiguration(config);
}

function requireArtifacts(directory) {
  for (const name of ['runtime.js', 'THIRD_PARTY_NOTICES.txt', 'migrations']) {
    const filename = path.join(directory, name);
    if (!existsSync(filename) || lstatSync(filename).isSymbolicLink()
      || (name === 'migrations' ? !lstatSync(filename).isDirectory() : !lstatSync(filename).isFile())) throw new Error('后台成品不完整。请重新取得包含 runtime.js 和 migrations 的完整发行包。');
  }
  const migrations = readdirSync(path.join(directory, 'migrations')).sort();
  if (!migrations.length || migrations.some((name) => !/^\d{4}_[a-z_]+\.sql$/.test(name))) throw new Error('数据库迁移文件不完整。请重新取得完整发行包。');
}

export function deploy({ directory = ROOT, mode = 'deploy', run = spawnSync } = {}) {
  if (!['deploy', 'check', 'dry-run'].includes(mode)) throw new Error('不支持这个部署选项。');
  const config = readConfiguration(directory);
  requireArtifacts(directory);
  if (mode === 'check') return { checked: true, deployed: false };
  const executable = path.join(directory, 'node_modules/wrangler/bin/wrangler.js');
  if (!existsSync(executable)) throw new Error('Cloudflare 尚未安装部署依赖。请确认已完成依赖安装，再运行默认部署命令。');
  // Cloudflare has already provisioned DB and updated this file. Keep that ID
  // and all other settings; only derive installation-specific Workflow names.
  writeFileSync(path.join(directory, 'wrangler.jsonc'), `${JSON.stringify(config, null, 2)}\n`);
  const execute = (args, message) => {
    const result = run(process.execPath, [executable, ...args, '--config', 'wrangler.jsonc'], {
      cwd: directory, stdio: 'inherit', shell: false,
      env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false', CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: 'false' },
    });
    if (result.error || result.status !== 0) throw new Error(message);
  };
  if (mode === 'dry-run') {
    execute(['deploy', '--dry-run', '--no-bundle', '--outdir', '.wrangler/dry-run'], '本地部署检查失败，尚未发布后台。请查看上方 Cloudflare 提示。');
    return { checked: true, deployed: false };
  }
  execute(['d1', 'migrations', 'apply', 'DB', '--remote'], '数据库初始化或升级未完成，本次没有继续发布。请检查 Cloudflare 数据库权限和额度后重试。');
  execute(['deploy', '--no-bundle', '--keep-vars'], '后台发布未完成。已完成的数据库迁移会保留，可修正 Cloudflare 报错后重新部署；不要更换数据库或重新生成安装配置。');
  return { checked: true, deployed: true };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || (args.length && !['--check', '--dry-run'].includes(args[0]))) throw new Error('只支持默认部署、--check 或 --dry-run。');
    const result = deploy({ mode: args[0] === '--check' ? 'check' : args[0] === '--dry-run' ? 'dry-run' : 'deploy' });
    console.log(result.deployed ? '个人后台已完成部署。请复制上方 Worker 网址，回应用的“设置 → 个人后台”完成配对。' : '本地配置检查通过；没有发布或修改云端资源。');
  } catch (error) {
    console.error(error instanceof Error ? error.message : '部署未完成。请查看 Cloudflare 安装页面的失败步骤。');
    process.exitCode = 1;
  }
}
