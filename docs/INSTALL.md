# 安装教程

[返回首页](../README.md) · [遇到问题](FAQ.md)

安装分两部分：**网页是你打开的界面，后台负责连接 AI 和处理后台任务。** 两者都装好后，电脑就可以关机，日常在手机上使用。

本教程面向 macOS / Linux。请先阅读[本版使用限制](../CHANGELOG.md#使用限制)。Windows 原生安装不在当前支持范围内；只有手机暂时无法完成首次安装。

## 第一步：下载安装包

打开 [Releases 下载页](https://github.com/richzorya/mind-universe-release/releases)，在同一个版本的 **Assets（附件）** 中下载：

1. 一个网页包：Cloudflare 选 `mind-universe-cloudflare-pages.zip`，Netlify 选 `mind-universe-netlify-static.zip`。
2. 一个后台包：`mind-universe-cloudflare-backend.zip`。

把两个 ZIP 分别解压，不要混在同一文件夹。网页文件夹第一层应有 `index.html`，后台文件夹第一层应有 `install.mjs`。

如果你已有本版本可用且可信的网页地址，只需要下载后台包，直接从第三步开始。

## 第二步：把网页放上线

下面两种方式**只选一种**。不需要连接 GitHub 仓库，也不需要填写构建命令。

### 方式 A：Cloudflare Pages

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，进入 **Workers & Pages**。
2. 选择创建应用，找到 **Pages → 直接上传 / Drag and drop**。
3. 填写你喜欢的站点名称，上传 `mind-universe-cloudflare-pages.zip` 或它的解压文件夹，然后部署。
4. 打开平台给你的 `https://站点名称.pages.dev` 地址，确认能看到应用。

找不到相同按钮时，可对照 [Cloudflare 官方上传教程](https://developers.cloudflare.com/pages/get-started/direct-upload/)。请选择 Pages 网页上传，不是新建后台 Worker。

### 方式 B：Netlify

1. 登录 [Netlify](https://app.netlify.com/)，找到 **Add new project → Deploy manually（手动部署）**，也可打开 [Netlify Drop](https://app.netlify.com/drop)。
2. 把 `mind-universe-netlify-static.zip` **解压后的文件夹**拖进上传区。确认这个文件夹第一层就是 `index.html`，不是再套一层文件夹。
3. 部署完成后，打开平台给你的 `https://站点名称.netlify.app` 地址，确认能看到应用。

详细界面见 [Netlify 官方手动部署说明](https://docs.netlify.com/deploy/create-deploys/)。

**记下这个网页地址，下一步要用。** 网页刚上线时还不能调用 AI，需要继续安装后台；无需在托管平台填写模型密钥。

## 第三步：安装自己的 Cloudflare 后台

先准备两个值：

- **网页地址**：上一步的 HTTPS 地址，只保留协议和域名，不带末尾 `/`、页面路径或参数。
- **Cloudflare Account ID（账号 ID）**：自己的 Cloudflare 账号编号，不是邮箱、Zone ID 或 API Key。下面登录后可用 `whoami` 查看。

以下命令在**同一个终端窗口**中依次执行。macOS 打开“终端”；Linux 打开系统终端。只复制代码框中的内容。

### 3.1 安装工具并登录

从 [Node.js 官方网站](https://nodejs.org/en/download) 安装 Node.js **24.20.0**，重开终端，运行 `node -v` 确认版本。

复制执行下面三行，安装并启动 Cloudflare 官方登录工具 Wrangler：

```sh
npm install --prefix "$HOME/.local/share/mind-universe-tools" wrangler@4.129.0
MU_WRANGLER_JS="$HOME/.local/share/mind-universe-tools/node_modules/wrangler/bin/wrangler.js"
node "$MU_WRANGLER_JS" login
```

浏览器会打开 Cloudflare 的授权页面。确认是你自己的账号后授权，再回到终端执行：

```sh
node "$MU_WRANGLER_JS" whoami
```

从结果中找到要安装后台的 **Account ID**。如果显示多个账号，只选你有权使用的那个；不要把登录凭据发给他人。

首次使用 Workers 的账号，还需要在 Cloudflare 控制台的 **Workers & Pages** 完成开通，按提示设置自己的 **workers.dev 子域名**。无需手工创建示例 Worker。已有子域名则跳过；安装工具不会代你完成这个首次设置。

### 3.2 进入后台文件夹并检查

在终端输入 `cd `（后面留一个空格），把第一步解压出的**后台文件夹**拖进终端，按回车。确认当前文件夹中有 `install.mjs`，然后执行：

```sh
node check-package.mjs
```

检查通过后再继续；失败时重新从同一 Release 下载，不要删文件或跳过检查。

### 3.3 填入自己的信息

将下方前两行的中文替换为你自己的值，保留英文引号，然后复制执行。下面只是占位文字，不是可用账号或网址。

```sh
MU_ACCOUNT_ID="替换为你的Cloudflare账号ID"
MU_WEB_ORIGIN="替换为你的HTTPS网页地址"
MU_STATE_DIR="$HOME/.config/mind-universe-personal"
node install.mjs --prepare --package-dir "$PWD" --state-dir "$MU_STATE_DIR" --account-id "$MU_ACCOUNT_ID" --origins "$MU_WEB_ORIGIN"
```

这一步只在电脑保存安装信息，不创建云资源。`mind-universe-personal` 目录用于保存后台的安装记录和密钥，请保留在本机，不放进 GitHub、网页上传目录或公开同步盘；升级还需要它。成功后不再重复执行 `--prepare`。

### 3.4 确认账号和费用，执行安装

下一条命令会在刚才指定的 Cloudflare 账号里创建后台程序、数据库和定时任务（Worker、D1、两个 Workflows 及 Cron）。用量计入你自己的账号，具体额度和费用以 Cloudflare 为准；不要为了继续安装而盲目开通付费套餐。

确认后执行：

```sh
node install.mjs --apply --package-dir "$PWD" --state-dir "$MU_STATE_DIR" --wrangler-js "$MU_WRANGLER_JS"
```

等命令完成。不要重复新建安装目录来重试；报错时先看[安装失败怎么办](FAQ.md#安装失败怎么办)。

### 3.5 找到后台地址与配对码

安装成功后，用电脑的文本编辑器打开：

```text
~/.config/mind-universe-personal/pairing-result.json
```

macOS 可在 Finder 按 `⌘⇧G`，粘贴上面的路径后打开；Linux 可在文件管理器的地址栏输入该路径。`~` 表示你的用户主目录。

只需从文件里复制两个值：

- `backendUrl`：填到网页的“后台地址”。
- `pairingCode`：填到网页的“配对码”。

不要复制字段名或两边的引号。配对码由安装工具生成，**不是** Cloudflare 密码，也不是模型 API Key；不要截图分享这个文件。

## 第四步：在网页连接并开始聊天

1. 打开第二步的网页，进入 **设置 → 个人后台**。
2. 输入后台地址和配对码，按页面提示连接，确认显示连接成功。
3. 进入 **设置 → API Keys** 保存自己的密钥，再到 **设置 → 模型** 绑定密钥并选择模型。需要语音时，在“声音和实时通话”中配置语音预设。
4. 发一条不含隐私的测试消息，确认收到回复。连接失败时先排查，不会自动使用作者的后台。

不要把 Cloudflare 账号管理令牌填进 API Keys，也不要把配对码当成模型密钥。

## 第五步：添加到手机主屏幕

用手机打开**同一个网页地址**，完成个人后台连接和 API Keys 配置。电脑上的记录与密钥不会自动同步到手机；需要已有内容时，先备份再导入。

- iPhone：用 Safari 打开，选择分享菜单中的 **添加到主屏幕**。
- Android：用支持网页应用安装的浏览器，选择菜单中的 **安装应用 / 添加到主屏幕**。

从主屏幕图标打开后，确认后台连接和模型设置；若系统使用了独立的数据空间，重新配对并导入备份即可。之后不需要让安装用的电脑一直开着。

下一步：[费用与常见问题](FAQ.md) · [备份、更新和停用](FAQ.md#更新迁移与停用)
