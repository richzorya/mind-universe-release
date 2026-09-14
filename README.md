# Mind Universe

你的角色、聊天和日常，放进属于自己的小宇宙。

Mind Universe 是可以添加到手机主屏幕的网页应用。聊天记录主要留在你的设备上，AI 使用你自己的密钥，个人后台运行在你自己的 Cloudflare 账号中。

[开始安装](docs/INSTALL.md) · [打开网页](https://mu-beta.pages.dev/) · [Netlify 备用网页](https://mu-beta.netlify.app/) · [下载安装包](https://github.com/richzorya/mind-universe-release/releases) · [常见问题](docs/FAQ.md)

## 怎么开始？

**用手机或电脑的浏览器完成安装，不需要编写代码或复制终端命令。** 请先准备自己的 GitHub、Cloudflare 账号和模型 API Key。

1. 打开[安装准备页](https://mu-beta.pages.dev/install.html)；打不开时使用 [Netlify 准备页](https://mu-beta.netlify.app/install.html)。
2. 选择要使用的网页，在本机生成安装配置，保存 `MU-installation` JSON 文件，再复制 `INSTALL_CONFIG`。
3. 点击准备页中的 Cloudflare 官方部署按钮，登录并确认授权，只选择安装仓库，把配置粘贴到 `INSTALL_CONFIG` Secret 后部署。
4. 复制 Cloudflare 给出的后台地址，回到应用的“设置 → 个人后台”，填写地址和保存的配对码，连接并检查。
5. 在原“API Keys”和模型设置中配置自己的服务，发一条测试消息，再添加到手机主屏幕。

安装配置和配对码由 **Mind Universe 在你的设备上生成**，不是 Cloudflare 生成，也不是账号密码。保存的文件含有秘密，请勿上传到 GitHub、Issue 或聊天。完整步骤和失败处理见[安装教程](docs/INSTALL.md)。

## 需要自己部署网页吗？

不必。可以使用上面的统一网页，只部署自己的后台；使用统一 Netlify 网页也不需要注册 Netlify。

当前先使用上面的内测网页；网页 ZIP 尚未开放下载，正在核对其中字体和图片的分发许可。后台模板已作为独立的 `backend/` 目录提供，不受网页 ZIP 开放时间影响。

后续开放网页下载时，文件用途如下：

| 用途 | 文件 |
| --- | --- |
| 自行上传到 Cloudflare Pages | `mind-universe-cloudflare-pages.zip` |
| 自行上传到 Netlify | `mind-universe-netlify-static.zip` |
| 保留后台成品、手动部署或维护 | `mind-universe-cloudflare-backend.zip` |

网页包开放后任选其一，上传方法见[可选：自己部署网页](docs/INSTALL.md#可选自己部署网页)。GitHub 自动生成的 **Source code (zip)** 是发行仓库快照，不是直接上传即可运行的网页安装包。

## 使用前

当前是内测版，手机完整安装、平台授权和设备体验的验证范围见[更新记录](CHANGELOG.md#使用限制)。云平台、域名、模型和语音可能收费；网页与后台在你所在网络中的可达性需要分别确认。

从旧网址迁移时，先在旧网页导出备份，再到新网页导入；不同网址、浏览器与设备不会自动共享聊天或密钥。

## 许可与帮助

这是公开的成品发行仓库，完整工程源码仍为私有。压缩后的 JavaScript 可以被查看和分析，不等于不可逆向。个人非商业使用及其他约定见[使用许可](LICENSE.txt)，第三方内容按[各自许可](THIRD_PARTY_NOTICES.md)使用。

遇到问题可[提交 Issue](https://github.com/richzorya/mind-universe-release/issues/new/choose)，请勿附上秘密或私人聊天；安全问题请看[安全说明](SECURITY.md)。

Star 和 Fork 都是自愿的，不影响使用。Cloudflare 官方按钮会在你的账号中复制安装仓库，不应把这一步理解为必定产生 GitHub 的原生 Fork。
