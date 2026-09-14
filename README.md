# Mind Universe

你的角色、聊天和日常，放进属于自己的小宇宙。

Mind Universe 是可以添加到手机主屏幕的网页应用。聊天记录主要留在你的设备上，AI 使用你自己的密钥，个人后台运行在你自己的 Cloudflare 账号中。

[打开聊天网页](https://mu-beta.pages.dev/) · [Netlify 聊天网页](https://mu-beta.netlify.app/) · [开始安装](docs/INSTALL.md) · [常见问题](docs/FAQ.md)

**已经部署过？** [找回后台地址](docs/INSTALL.md#找回后台地址) · [找回配对码](docs/INSTALL.md#找回配对码) · [打开 Cloudflare 项目列表](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

日常聊天用上面的网页；自己部署的**个人后台**负责连接 AI、执行后台任务，不是另一个聊天网页。**后台地址**是它的网址，**配对码**是允许你的设备连接它的口令。下面会分别说明去哪里复制，二者不在同一个页面里。

## 怎么开始？

**用手机或电脑的浏览器操作，不需要编写代码或复制终端命令。** 请先准备自己的 GitHub、Cloudflare 账号；模型 API Key 是你向 AI 服务商申请的调用密钥，已有设置可继续用。

1. 打开[安装准备页](https://mu-beta.pages.dev/install.html)；打不开时使用 [Netlify 准备页](https://mu-beta.netlify.app/install.html)。
2. 点“生成安装资料”→“保存安装备份”，保存 `MU-installation-….json` 文件。这是找回安装资料的备份，不是聊天备份，也不是要上传的安装包。确认保存后点“我已保存，下一步”。
3. 点“复制安装配置”。复制的是以 `MUINSTALL1.` 开头的整段文字，供 Cloudflare 配置后台使用；点“打开 Cloudflare 安装”，登录并授权安装仓库，将这段文字粘贴到名为 `INSTALL_CONFIG` 的 Secret（秘密）字段后部署。[完整操作](docs/INSTALL.md#第二步安装到-cloudflare)
4. 从 Cloudflare 的原项目“Settings（设置）→ Domains & Routes（域名和路由）”复制 `workers.dev` 访问地址。这是**后台地址**；打开聊天网页的“设置 → 个人后台 → 连接已有后台”，先将它粘贴到“后台地址”，不要复制管理页面链接。[找地址的步骤](docs/INSTALL.md#找回后台地址)
5. 回到原安装准备页，点“3. 回到网页配对”→“复制配对码”。这是**连接口令**，不是刚才那整段安装配置；Cloudflare 不会另给你一个配对码。[页面关了怎么找回](docs/INSTALL.md#找回配对码)
6. 切回刚才的连接表单，将口令粘贴到“配对码”，点“连接并保存”再“检查连接”。两次复制之间先粘贴好前一项，避免剪贴板内容被覆盖。
7. 原来的 API 密钥和模型设置继续使用；首次使用且尚未配置的人，再到“API Keys”和模型设置中填写。发一条测试消息，确认正常后添加到手机主屏幕。

安装配置和配对码由 **Mind Universe 在你的设备上生成**，不是账号密码。不要把文件或秘密上传到 GitHub、Issue 或聊天。每项内容的含义、复制位置和粘贴位置见[安装教程对照表](docs/INSTALL.md#先认清要用的内容)。

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
