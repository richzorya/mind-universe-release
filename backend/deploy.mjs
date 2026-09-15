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
const OFFICIAL_REPOSITORY_ID = 1369827859;
const validDatabaseId = (value) => typeof value === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value) && value !== EMPTY_DATABASE;
const WORKFLOWS = [
  { binding: 'BACKGROUND_JOBS', class_name: 'BackgroundReplyWorkflow', suffix: 'replies' },
  { binding: 'GROUP_AUTONOMY', class_name: 'GroupAutonomyWorkflow', suffix: 'autonomy' },
];

export function prepareConfiguration(config, environment = {}) {
  const originalName = config?.name;
  const existingDatabase = validDatabaseId(config?.d1_databases?.[0]?.database_id);
  const platformName = environment.WRANGLER_CI_OVERRIDE_NAME;
  if (platformName !== undefined) {
    if (typeof platformName !== 'string' || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(platformName)) throw new Error('Cloudflare 提供的 Worker 名称无效。请检查项目名称后重试。');
    if (existingDatabase && platformName !== originalName) throw new Error('Cloudflare 项目名称与旧配置不一致。请连接原 Worker，保留原名称、数据库和任务资源后重试。');
    config = { ...config, name: platformName };
  }
  if (!config || typeof config !== 'object' || Array.isArray(config)
    || typeof config.name !== 'string' || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(config.name)) {
    throw new Error('Worker 名称无效。请使用只含小写字母、数字和中划线的名称，并让 Cloudflare 项目名称与 wrangler.jsonc 的 name 保持一致。');
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
  const suppliedId = environment.MU_D1_DATABASE_ID;
  if (suppliedId !== undefined && typeof suppliedId !== 'string') throw new Error('MU_D1_DATABASE_ID 必须填写数据库 UUID。');
  const selectedId = suppliedId?.trim() || databases[0].database_id;
  if (!validDatabaseId(selectedId)) {
    throw new Error('尚未填入你的数据库。请先在 Cloudflare 新建专用 D1 数据库，将 UUID 填入构建变量 MU_D1_DATABASE_ID 后重试；不要使用其他应用的数据库。');
  }
  if (suppliedId?.trim() && validDatabaseId(databases[0].database_id)
    && selectedId.toLowerCase() !== databases[0].database_id.toLowerCase()) {
    throw new Error('MU_D1_DATABASE_ID 与已保存的数据库不一致。请保留原数据库；本次没有修改配置或云端资源。');
  }
  config = { ...config, d1_databases: [{ ...databases[0], database_id: selectedId }] };
  if (!Array.isArray(config.workflows) || config.workflows.length !== WORKFLOWS.length
    || WORKFLOWS.some((expected) => config.workflows.filter((value) => value?.binding === expected.binding && value.class_name === expected.class_name && !value.script_name
      && typeof value.name === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(value.name)).length !== 1)) {
    throw new Error('持久任务绑定不完整。请恢复 BACKGROUND_JOBS 与 GROUP_AUTONOMY 的成品配置后重新部署。');
  }
  if (JSON.stringify(config.triggers?.crons) !== JSON.stringify(['* * * * *'])) {
    throw new Error('后台定时检查配置不完整。请恢复成品附带的每分钟检查配置。');
  }
  const digest = createHash('sha256').update(config.name).digest('hex').slice(0, 12);
  return { ...config, keep_vars: true, send_metrics: false, workflows: existingDatabase ? config.workflows.map((workflow) => ({ ...workflow })) : WORKFLOWS.map(({ binding, class_name, suffix }) => ({
    binding, class_name, name: `${config.name.slice(0, 40)}-${digest}-${suffix}`,
  })) };
}

function readRawConfiguration(directory) {
  const errors = [];
  const filename = path.join(directory, 'wrangler.jsonc');
  if (!existsSync(filename) || !lstatSync(filename).isFile() || lstatSync(filename).isSymbolicLink()) throw new Error('缺少 wrangler.jsonc 配置文件。请使用完整后台成品。');
  const config = parse(readFileSync(filename, 'utf8'), errors, { allowTrailingComma: true, disallowComments: false });
  if (errors.length) throw new Error('wrangler.jsonc 格式不正确。请恢复有效的 JSON 配置，不要把安装秘密粘贴到这个文件。');
  return config;
}

export function readConfiguration(directory = ROOT, environment = {}) {
  return prepareConfiguration(readRawConfiguration(directory), environment);
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

export function githubRepositoryFromRemote(remote) {
  if (typeof remote !== 'string') throw new Error('无法确认实际连接的 GitHub 仓库。请通过 Cloudflare 导入自己的官方 Fork。');
  const value = remote.trim();
  let url;
  try { url = new URL(value.startsWith('git@github.com:') ? `ssh://git@github.com/${value.slice('git@github.com:'.length)}` : value); }
  catch { throw new Error('实际连接的仓库不是有效的 GitHub 仓库地址。请重新选择自己的官方 Fork。'); }
  if (!['https:', 'ssh:'].includes(url.protocol) || url.hostname !== 'github.com' || url.port || url.search || url.hash) {
    throw new Error('实际连接的仓库不是 github.com 上的官方 Fork。请重新选择仓库。');
  }
  const match = url.pathname.match(/^\/([A-Za-z0-9][A-Za-z0-9-]{0,38})\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);
  if (!match || ['.', '..'].includes(match[2])) throw new Error('GitHub 仓库路径无效。请重新选择自己的官方 Fork。');
  // Credentials sometimes appear in the checkout remote; never forward or print them.
  return `${match[1]}/${match[2]}`;
}

export async function verifyInstallationFork({ directory, git = spawnSync, request = globalThis.fetch }) {
  const result = git('git', ['remote', 'get-url', 'origin'], { cwd: directory, encoding: 'utf8', shell: false, stdio: ['ignore', 'pipe', 'pipe'], timeout: 10000, maxBuffer: 16384 });
  if (result.error || result.status !== 0) throw new Error('无法读取实际连接的仓库。首次安装请在 Cloudflare 导入自己的官方 Fork，根目录填写 backend。');
  const repository = githubRepositoryFromRemote(result.stdout);
  let response;
  try {
    response = await request(`https://api.github.com/repos/${repository}`, {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      redirect: 'follow', signal: globalThis.AbortSignal.timeout(15000),
    });
  } catch { throw new Error('GitHub 仓库验证暂时无法连接，本次没有部署。稍后在 Cloudflare 重试原构建。'); }
  if (!response.ok) throw new Error('GitHub 仓库验证未完成，请确认 Fork 为公开仓库；若遇到访问限流，稍后重试原构建。');
  let finalUrl;
  try { finalUrl = new URL(response.url); } catch { throw new Error('GitHub 仓库验证响应地址无效，本次没有部署。请重试原构建。'); }
  if (finalUrl.protocol !== 'https:' || finalUrl.hostname !== 'api.github.com' || finalUrl.port) throw new Error('GitHub 仓库验证跳转到了非官方地址，本次没有部署。');
  let repositoryInfo;
  try { repositoryInfo = await response.json(); }
  catch { throw new Error('GitHub 仓库验证响应无效，本次没有部署。稍后重试原构建。'); }
  if (!repositoryInfo || typeof repositoryInfo !== 'object' || Array.isArray(repositoryInfo)
    || repositoryInfo.fork !== true || repositoryInfo.source?.id !== OFFICIAL_REPOSITORY_ID) {
    throw new Error('实际连接的仓库不是 Mind Universe 官方仓库的 Fork。请回安装准备页完成 Fork，再在 Cloudflare 选择该仓库。');
  }
  return { repository, sourceId: OFFICIAL_REPOSITORY_ID };
}

export async function deploy({ directory = ROOT, mode = 'deploy', run = spawnSync, environment = process.env, git = spawnSync, request = globalThis.fetch } = {}) {
  if (!['deploy', 'check', 'dry-run'].includes(mode)) throw new Error('不支持这个部署选项。');
  const rawConfig = readRawConfiguration(directory);
  const config = prepareConfiguration(rawConfig, environment);
  requireArtifacts(directory);
  if (mode === 'check') return { checked: true, deployed: false };
  const executable = path.join(directory, 'node_modules/wrangler/bin/wrangler.js');
  if (!existsSync(executable)) throw new Error('Cloudflare 尚未安装部署依赖。请确认已完成依赖安装，再运行默认部署命令。');
  // Existing configured installations retain their database and do not need a new Fork.
  if (mode === 'deploy' && !validDatabaseId(rawConfig.d1_databases[0].database_id)) {
    await verifyInstallationFork({ directory, git, request });
  }
  // Bind only the explicit database ID; never search for or create a database by name.
  writeFileSync(path.join(directory, 'wrangler.jsonc'), `${JSON.stringify(config, null, 2)}\n`);
  const execute = (args, message) => {
    const result = run(process.execPath, [executable, ...args, '--config', 'wrangler.jsonc'], {
      cwd: directory, stdio: 'inherit', shell: false,
      env: { ...environment, CI: 'true', WRANGLER_SEND_METRICS: 'false', CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: 'false' },
    });
    if (result.error || result.status !== 0) throw new Error(message);
  };
  if (mode === 'dry-run') {
    execute(['deploy', '--dry-run', '--no-bundle', '--no-x-provision', '--outdir', '.wrangler/dry-run'], '本地部署检查失败，尚未发布后台。请查看上方 Cloudflare 提示。');
    return { checked: true, deployed: false };
  }
  execute(['d1', 'migrations', 'apply', 'DB', '--remote', '--no-x-provision'], '数据库初始化或升级未完成，本次没有继续发布。请为本次构建 API 令牌添加 D1 编辑权限，确认数据库 ID 和额度后重试。');
  execute(['deploy', '--no-bundle', '--keep-vars', '--no-x-provision'], '后台发布未完成。已完成的数据库迁移会保留，可修正 Cloudflare 报错后重新部署；不要更换数据库或重新生成安装配置。');
  return { checked: true, deployed: true };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || (args.length && !['--check', '--dry-run'].includes(args[0]))) throw new Error('只支持默认部署、--check 或 --dry-run。');
    const result = await deploy({ mode: args[0] === '--check' ? 'check' : args[0] === '--dry-run' ? 'dry-run' : 'deploy' });
    console.log(result.deployed ? '个人后台代码已部署。首次安装请在 Worker 的 Settings → Variables & Secrets 中添加 INSTALL_CONFIG Secret 并部署，再回应用连接后台。已有安装继续保留原秘密。' : '本地配置检查通过；没有发布或修改云端资源。');
  } catch (error) {
    console.error(error instanceof Error ? error.message : '部署未完成。请查看 Cloudflare 安装页面的失败步骤。');
    process.exitCode = 1;
  }
}
