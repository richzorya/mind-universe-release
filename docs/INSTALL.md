# 安装教程

[返回首页](../README.md) · [遇到问题](FAQ.md)

网页是你使用的界面，个人后台负责连接 AI 和处理后台任务。可以直接使用统一网页，只把后台部署到自己的 Cloudflare。手机、Windows、macOS 或 Linux 的浏览器均可按下面的流程操作，不需要终端命令；实际平台和手机验收范围见[更新记录](../CHANGELOG.md#使用限制)。

## 安装前准备

- 自己的 GitHub 和 Cloudflare 账号；验证码、双重验证与授权提示由你本人完成。
- 自己的模型 API Key；需要语音时再准备相应服务的凭据和权限。
- 手机“文件”或其他本人独占的保存位置，用于保管安装配置。
- 能连接所选网页、GitHub、Cloudflare 及后台的网络。

首次使用 Cloudflare 时，按官方页面完成账号验证、Workers 开通和 workers.dev 子域名设置。创建资源会占用你自己的云平台额度；出现付费升级或付款提示时，先确认费用，不要为了继续而盲目接受。

## 第一步：在本机生成并保存配置

打开[安装准备页](https://mu-beta.pages.dev/install.html)，备用地址是 [Netlify 准备页](https://mu-beta.netlify.app/install.html)。

1. 选择准备使用的网页来源。自行托管时，填写真实 HTTPS 网页地址，只保留协议和域名，不带末尾斜杠、路径、参数或通配符。
2. 首次安装选择生成配置。随机配对码、后台身份、加密和通知密钥均由 Mind Universe 在你的设备上生成，不需要提交给作者后台。
3. 保存页面提供的 `MU-installation` JSON 文件到手机“文件”等私有位置，确认文件确实保存成功。
4. 复制页面中的完整 `INSTALL_CONFIG`。这是一个以 `MUINSTALL1.` 开头的长字符串，不是整个 JSON 文件，也不是配对码。

**先保存，再离开页面。** 不要只依赖剪贴板或临时页面：后面复制后台地址会覆盖剪贴板；刷新、清网站数据或切换浏览器可能使临时内容丢失。已有安装要恢复原文件，不要重新生成。

## 第二步：部署到自己的 Cloudflare

点击准备页的官方部署按钮，或使用[部署个人后台](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Frichzorya%2Fmind-universe-release%2Ftree%2Fmain%2Fbackend)。

1. 在 Cloudflare 官方页面登录自己的账号，连接 GitHub。
2. 按页面提示授权 Cloudflare GitHub App；尽量只选择安装仓库，不要授权不相关的私有源码仓库。
3. 确认目标 Cloudflare 账号、安装仓库及资源名称。按钮会复制安装模板到你的 GitHub 账号，再部署成品，不需要取得完整工程源码。
4. 在 `INSTALL_CONFIG` 的 Secret 输入框粘贴第一步复制的完整字符串。不要把它填成普通公开变量，也不要提交到仓库文件。
5. 确认部署。模板负责创建和连接 D1 数据库、应用迁移、部署 Worker、两个 Workflow 和定时任务；不要自行删去其中一项。

账号已有有效登录或授权时，不必重新登录。验证码、双重验证、仓库授权和付款确认仍由你本人处理。界面差异可对照[Cloudflare 官方部署按钮说明](https://developers.cloudflare.com/workers/platform/deploy-buttons/)。

### 没有出现 INSTALL_CONFIG 输入框？

不要把配置粘贴进代码或构建日志。可在 Worker 部署完成后，打开该 Worker 的 **Settings → Variables and Secrets**，新增名为 `INSTALL_CONFIG`、类型为 **Secret** 的值，粘贴原配置并保存部署。

配置未完成或无效时，业务接口会拒绝请求。不要为排错关闭鉴权或重新生成安装配置。若 Cloudflare GitHub App 授权或创建资源失败，先按页面错误处理，不要连续新建多套后台。

## 第三步：复制后台地址，回到应用配对

部署完成后，复制 Cloudflare 显示的 `https://你的后台.你的子域.workers.dev` 地址，确认它属于刚才的 Worker。

直接打开后台地址时，看到个人后台说明页是正常的：这里不是聊天网页，也不是所有人共用的公共服务；页面不展示配对码或安装配置。

1. 回到[Cloudflare 网页](https://mu-beta.pages.dev/)或[Netlify 网页](https://mu-beta.netlify.app/)，也可以打开自己部署的网页。
2. 进入 **设置 → 个人后台**，填写后台地址和第一步生成的配对码。
3. 配对码可从仍打开的准备页复制；页面内容丢失时，用保存的 `MU-installation` JSON 恢复原配置后复制。不要误填完整 `INSTALL_CONFIG`。
4. 连接并执行连接检查。成功后，应用保存设备凭据；配对码不是日常聊天密钥。
5. 进入原 **API Keys** 页面保存模型或语音密钥，在模型设置中绑定并选择模型，再发一条不含隐私的测试消息。

Cloudflare 管理令牌、账号密码不填进应用。模型 API Key、配对码和 `INSTALL_CONFIG` 是三种不同的值。

## 第四步：添加到主屏幕

- iPhone：在 Safari 分享菜单中选择 **添加到主屏幕**。
- Android：使用支持网页应用安装的浏览器，选择 **安装应用 / 添加到主屏幕**。

从主屏幕图标打开后，再确认个人后台和模型设置。不同浏览器、网址以及主屏幕应用不一定共享存储，必要时重新配对；聊天记录需通过备份导入，不会因登录同一个 Cloudflare 自动出现。电脑不需要保持开机。

## 多个后台与更新

可以保存多个后台并选择当前使用的一个。切换前先关闭原后台回复和自主聊天，确认云端停止、收取在途结果；无法确认时保留原连接，先恢复旧后台。保存列表不代表多套后台会同时为当前页面执行任务。

更新自己的后台时，沿用原 Worker、D1、两个 Workflow 和原 `INSTALL_CONFIG`。作者更新发行仓库后，你自己账号中的副本不会自动获得更新；按对应版本说明更新副本并重新部署。不要再次按首次安装生成新配置或创建替代数据库。

完整说明见[更新、迁移与停用](FAQ.md#更新迁移与停用)。

## 可选：自己部署网页

当前网页 ZIP 尚未开放下载，请先使用本文顶部的两个内测网页。以下是开放下载后的可选操作；后台安装不需要等待网页 ZIP。

开放后，从同一个 [Release](https://github.com/richzorya/mind-universe-release/releases) 下载一个网页成品包。只想用统一网页时可跳过此节。

### Cloudflare Pages

在自己的 Cloudflare **Workers & Pages → Pages → 直接上传 / Drag and drop** 中创建站点，上传 `mind-universe-cloudflare-pages.zip` 或其解压目录。第一层应有 `index.html`。这是 Pages 网页上传，不是后台 Worker，也不需要连接源码仓库。[官方直接上传教程](https://developers.cloudflare.com/pages/get-started/direct-upload/)

### Netlify

下载并解压 `mind-universe-netlify-static.zip`，在自己的 Netlify **Deploy manually** 或 [Netlify Drop](https://app.netlify.com/drop) 上传第一层包含 `index.html` 的目录；手动拖拽方式用电脑更方便。[官方部署说明](https://docs.netlify.com/deploy/create-deploys/)

取得新网页地址后，首次生成配置时选择该精确来源。已有后台换域名时先保留旧配置和数据，按恢复流程调整允许来源，不要生成一套新密钥。

## 可选：旧电脑命令行安装器

后台 ZIP 中的 `install.mjs` 仍是面向 macOS / Linux 的独立命令行工具，采用本机私有安装目录。它不是上面的浏览器安装流程，不支持把 Windows 原生文件权限视为 POSIX 权限。普通用户无需运行它；已有这种安装应继续保留原目录和密钥，不要与新生成的手机配置混用。
