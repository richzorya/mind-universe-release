# 安装后台

这是已编译的 Mind Universe 后台成品。手机安装从[安装准备页](https://mu-beta.pages.dev/install.html)开始，先 Fork 官方发行仓库，再让 Cloudflare 连接自己的 Fork。

**仅供个人学习和技术交流使用。禁止未经作者事先明确书面授权的商业化行为，包括售卖链接、收费代部署、配置、维护或托管个人后台。** 安装前请阅读[学习交流使用条款](LICENSE.txt)与[免责声明](DISCLAIMER.md)；授权事宜请先[联系作者](https://github.com/mind-universe-studio/mind-universe-release#联系作者)。

[完整安装教程](https://github.com/mind-universe-studio/mind-universe-release/blob/main/docs/INSTALL.md) · [找回后台地址](https://github.com/mind-universe-studio/mind-universe-release/blob/main/docs/INSTALL.md#找回后台地址) · [找回配对码](https://github.com/mind-universe-studio/mind-universe-release/blob/main/docs/INSTALL.md#找回配对码)

## 首次安装

1. 在[安装准备页](https://mu-beta.pages.dev/install.html)完成官方仓库 Fork 核验，生成安装资料并保存安装备份。已有安装应恢复原备份，不要重新生成配置。
2. 在自己的 Cloudflare 账号中新建一个专门用于本后台的 D1 数据库，复制它的数据库 ID（UUID）。不要使用其他应用的数据库。
3. 进入 [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)，创建 Worker 并导入自己的 GitHub Fork。项目名称可保持默认或自定义（1–63 个字符，仅小写字母、数字和中划线，不能以中划线开头或结尾，例如 `mu-personal`，重名时换一个），根目录填写 `backend`（新建页面在“高级设置”中叫“路径”），构建命令留空，部署命令填写 `npm run deploy`。只连接需要部署的分支；本安装流程不使用非生产分支预览构建。
4. 在“高级设置”中先选好 API 令牌（可先保持默认或新建），最后在构建变量中添加普通变量 `MU_D1_DATABASE_ID`，值填写第 2 步复制的 UUID；切换令牌后已填变量可能被重置，部署前核对一次。D1 权限以本次令牌的实际配置为准；若 Cloudflare 日志明确提示 D1 权限不足，在 **My Profile → API Tokens** 为该令牌增加 **Account → D1 → Edit**，保留原权限并确认账号范围包含本次安装账号。其他初始化失败先检查日志中的数据库 ID、额度或具体错误。
5. 开始部署。脚本先核验实际连接的仓库为官方 Fork，再初始化数据库并发布代码；它不会按名称寻找或新建数据库。若构建提示数据库权限不足，补齐权限后重试原构建，无需再建库。
6. 代码部署成功后，进入这个 Worker 的 **Settings → Variables & Secrets**，新增类型为 **Secret**、名称为 `INSTALL_CONFIG` 的秘密，将准备页复制的整段 `MUINSTALL1.…` 安装配置粘贴为值，并按页面提示部署使其生效。**构建变量和构建秘密不会自动成为 Worker 的运行时秘密。** 不要把安装配置写到 `wrangler.jsonc` 或 GitHub。
7. 在 Worker 的 **Domains** 页复制 `workers.dev` 的 HTTPS 网址；旧版界面在 **Settings → Domains & Routes**。打开[聊天网页](https://mu-beta.pages.dev/)，在“设置 → 个人后台 → 连接后台”填写该网址，再从原准备页复制配对码连接。

**数据库 ID** 用来指定存储位置；**安装配置**是保存在 Cloudflare 的整套秘密；**后台地址**是 Worker 的访问网址；**配对码**是允许设备连接后台的口令。Cloudflare 不会另发配对码，管理页面的网址也不是后台地址。

准备页关闭后，可恢复原 `MU-installation` 备份找回配对码。模型 API Keys 继续在应用中填写，不需要放到仓库。

## 中断、更新与旧安装

- **Fork 核验失败：** 在 Cloudflare 确认选中了自己的公开 Fork，根目录为 `backend`。独立复制的仓库不符合新安装流程；GitHub 临时限流或连接失败时，稍后重试原构建即可。
- **数据库 ID 未填写或无效：** 将已经创建的专用数据库 UUID 填入 `MU_D1_DATABASE_ID`，再重试。没有必要重复创建数据库。
- **数据库迁移失败：** 本次不会继续发布后台。检查构建令牌的 D1 编辑权限、数据库 ID 和额度后重试；已完成的迁移会保留。
- **发布失败：** 修正 Cloudflare 提示后重试原构建，继续使用同一个数据库和原安装配置。
- **代码发布成功但配对失败：** 确认后台网址正确，并检查 Worker 的运行时 `INSTALL_CONFIG` Secret 已保存且部署生效。更新已有后台时不要重新生成安装配置，否则旧任务可能无法解密。
- **更新自己的 Fork：** 保留构建变量中的数据库 ID、Worker 名称及运行时 `INSTALL_CONFIG`，再同步 Fork 并重新构建。作者更新官方仓库不会直接替你更新自己的 Fork。
- **已有独立副本或手动安装：** 不需要为继续使用而重装。配置文件已保存真实数据库 ID 的旧安装仍可更新，脚本保留其数据库、两条 Workflow 的原名称及秘密；若构建变量另填了不同数据库 ID，脚本会停止。Release 中的后台 ZIP 仍可用于手动维护原安装。

本模板不读取或修改 `INSTALL_CONFIG`，也不执行秘密上传、轮换或删除。`wrangler.jsonc` 中的数据库占位值用于新 Fork；构建时只采用你明确填写的 UUID。旧安装自定义过 Worker 名称时，保留配置文件中的名称，并让 Cloudflare 项目名称与它一致。

首次安装需要 GitHub/Cloudflare 账号、相应资源权限和可用额度。云平台、域名、模型、语音等费用由使用者按实际选择承担。关闭应用中的后台功能后，云资源仍会保留；停用时请按[更新、迁移与停用](https://github.com/mind-universe-studio/mind-universe-release/blob/main/docs/FAQ.md#更新迁移与停用)处理并核对平台账单。

[学习交流使用条款](LICENSE.txt) · [免责声明](DISCLAIMER.md) · [第三方声明](THIRD_PARTY_NOTICES.md) · [安全问题](SECURITY.md)

参考：[Workers Builds 配置与权限](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)、[数据库迁移](https://developers.cloudflare.com/d1/reference/migrations/)、[Worker 秘密](https://developers.cloudflare.com/workers/configuration/secrets/)。
