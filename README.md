# Mind Universe

你的角色、聊天和日常，放进属于自己的小宇宙。

Mind Universe 是一款可以添加到手机主屏幕的网页应用。聊天记录主要保存在你的设备上，AI 服务使用你自己的密钥，个人后台运行在你自己的 Cloudflare 账号中。

> 内测预览：目前尚无公开发布的安装包，手机一键安装入口尚未开放。请暂勿按下方教程开始安装；可下载版本和适用步骤以本页及 Releases 后续实际发布为准。

[下载安装包](https://github.com/richzorya/mind-universe-release/releases) · [开始安装](docs/INSTALL.md) · [常见问题](docs/FAQ.md) · [更新记录](CHANGELOG.md)

## 怎么开始？

**首次用电脑完成安装，之后用手机打开网页即可。** 不需要编写代码；安装后台时需要按教程复制几段命令，电脑不用一直开着。

1. **下载两个包**：一个网页包，加一个 Cloudflare 后台包。
2. **上传网页包**：Cloudflare Pages 和 Netlify 二选一，得到你自己的网页地址。
3. **安装个人后台**：在电脑上登录自己的 Cloudflare，按教程安装，取得后台地址和配对码。
4. **连接并填写密钥**：打开网页，在“设置 → 个人后台”连接，再到“设置 → API Keys”填写模型、语音密钥。
5. **开始使用**：先发一条测试消息，再把网页添加到手机主屏幕。

已有本版本可用的网页地址？可以跳过网页部署，只安装并连接自己的后台。完整步骤见[安装教程](docs/INSTALL.md)。

## 我该下载哪个包？

在 [Releases](https://github.com/richzorya/mind-universe-release/releases) 打开同一版本的 **Assets（附件）**：

| 你要做什么 | 下载文件 |
| --- | --- |
| 用 Cloudflare Pages 放网页 | `mind-universe-cloudflare-pages.zip` |
| 用 Netlify 放网页 | `mind-universe-netlify-static.zip` |
| 安装自己的后台，两种网页都需要 | `mind-universe-cloudflare-backend.zip` |

前两个包只选一个。不要下载 GitHub 自动生成的 **Source code (zip)** 或 **Code → Download ZIP** 来安装，它们不是应用安装包。

## 安装前准备

- 一台电脑：当前命令教程面向 macOS / Linux；Windows 原生安装尚不支持。
- 一个 Cloudflare 账号；只有选择 Netlify 放网页时，才另需 Netlify 账号。
- 你自己的模型 API Key；要使用语音，再准备对应的语音服务密钥。
- 能打开网页和连接 Cloudflare 后台的网络。

个人部署版处于内测阶段，请先阅读[本版使用限制](CHANGELOG.md#使用限制)。软件可供个人非商业使用；云平台、模型和语音服务可能收费，不保证在任何地区始终可用。费用与数据说明见[常见问题](docs/FAQ.md)和[隐私说明](PRIVACY.md)。

## 许可与帮助

本仓库提供成品下载和使用文档，不提供完整工程源码。未经书面授权禁止商用、销售或有偿代部署；完整范围与例外见[使用许可](LICENSE.txt)，第三方内容按[各自许可](THIRD_PARTY_NOTICES.md)使用。

遇到使用问题可[提交 Issue](https://github.com/richzorya/mind-universe-release/issues/new/choose)，请勿上传密钥或私人聊天；安全问题请看[安全说明](SECURITY.md)。

喜欢这个项目，可以 **Star** 收藏，也可以 **Fork** 保存一份仓库副本。两者都是自愿的，不影响下载和使用。
