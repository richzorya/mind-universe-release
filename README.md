# Mind Universe

你的角色、聊天和日常，放进属于自己的小宇宙。

Mind Universe 是可以添加到手机主屏幕的网页应用。聊天记录主要留在你的设备上，AI 使用你自己的密钥，个人后台运行在你自己的 Cloudflare 账号中。

**本产品仅供个人学习和技术交流使用。禁止未经作者事先明确书面授权的任何商业化或盈利行为，包括售卖产品链接、收费代部署个人后台、付费托管及其他变相收费。** 使用前请阅读[学习交流使用条款](LICENSE.txt)与[免责声明](DISCLAIMER.md)。

[打开聊天网页](https://mu-beta.pages.dev/) · [Netlify 聊天网页](https://mu-beta.netlify.app/) · [开始安装](docs/INSTALL.md) · [常见问题](docs/FAQ.md)

**已经部署过？** [找回后台地址](docs/INSTALL.md#找回后台地址) · [找回配对码](docs/INSTALL.md#找回配对码) · [打开 Cloudflare 项目列表](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

日常聊天用上面的网页；自己部署的**个人后台**负责连接 AI、执行后台任务，不是另一个聊天网页。**后台地址**是它的网址，**配对码**是允许你的设备连接它的口令。下面会分别说明去哪里复制，二者不在同一个页面里。

## 怎么开始？

**用手机或电脑的浏览器操作，不需要编写代码或复制终端命令。** 请先准备自己的 GitHub、Cloudflare 账号；模型 API Key 是你向 AI 服务商申请的调用密钥，已有设置可继续用。

1. **准备资料：** 打开[安装准备页](https://mu-beta.pages.dev/install.html)（[备用入口](https://mu-beta.netlify.app/install.html)），生成并保存 `MU-installation-….json` 安装备份。
2. **Fork 仓库：** 在准备页打开 [Fork 官方仓库](https://github.com/mind-universe-studio/mind-universe-release/fork)，完成 GitHub 的 **Create fork**，粘贴自己仓库的网址并点“核验 Fork 仓库”。通过后进入下一步。
3. **安装到 Cloudflare：** 新建专用 D1 数据库，复制 Database ID；创建 Worker 并连接刚才的 Fork，按[安装教程](docs/INSTALL.md#第三步安装到-cloudflare)填写构建配置、数据库编号与权限。部署成功后，在 Worker 的 **Settings → Variables and Secrets** 添加 `INSTALL_CONFIG` **Secret**，粘贴原安装配置并保存部署。
4. **连接后台：** 复制 Worker 的 `workers.dev` 地址，再从准备页“4. 连接后台”复制配对码，填入应用“设置 → 个人后台 → 连接后台”。看到绿色对勾“已连接”后，沿用原 API Keys 与模型设置，发一条测试消息，再添加到手机主屏幕。

应用中的“安装后台”用于部署服务，“连接后台”用于连接已有服务；详细解释可在“设置 → 个人后台 → 功能说明”查看。已保存的连接需要修改时，点“已配对”旁的“编辑”；本机已保存的配对码默认隐藏，可查看和复制。旧记录没有配对码时，可导入原安装备份验证恢复，无需重新安装后台。

安装配置和配对码由 **Mind Universe 在你的设备上生成**，不是账号密码。不要把文件或秘密上传到 GitHub、Issue 或聊天。每项内容的含义、复制位置和粘贴位置见[安装教程对照表](docs/INSTALL.md#先认清要用的内容)。

## 需要自己部署网页吗？

不必。可以使用上面的统一网页，只部署自己的后台；使用统一 Netlify 网页也不需要注册 Netlify。

当前提供内测网页和个人后台安装模板，网页 ZIP 暂未开放下载。安装后台请使用[安装教程](docs/INSTALL.md)；[Release](https://github.com/mind-universe-studio/mind-universe-release/releases) 中的 `mind-universe-cloudflare-backend.zip` 用于手动部署或维护本人使用的后台。GitHub 自动生成的 **Source code (zip)** 是本发行仓库的文件快照，安装请按教程操作。

## 使用前

公开内测网页按门厅显示的版本使用，**BUILD 222 系统伙伴目前先交付 Preview**，请先用测试资料体验，功能与使用条件见[更新记录](CHANGELOG.md#使用说明)。云平台、域名、模型和语音可能收费；网页与后台在你所在网络中的可达性需要分别确认。

你可以管理当前可进入的群与可见内容，群设置和自主聊天不再要求当前本人是群主。群信息中提供“清空聊天记录”；编辑消息、朋友圈或豆吧帖子会保留原作者。[管理与清空说明](docs/FAQ.md#群设置和内容管理需要群主或原作者吗)

从旧网址迁移时，先在旧网页导出备份，再到新网页导入；不同网址、浏览器与设备不会自动共享聊天或密钥。

## 使用范围

本仓库提供 Mind Universe 成品、个人后台安装模板与使用文档，完整工程源码由作者私有维护。仅开放本人学习和技术交流所需的安装、部署与体验，未授予开源、商业使用、再分发或再许可权利。

- 可以免费分享官方网页、仓库和教程链接，交流使用体验。
- 禁止售卖产品链接、下载地址、配对码或使用资格，以及将其放入付费群、付费资料或其他收费服务。
- 禁止通过帮助他人安装、部署、配置、维护或托管个人后台牟利。
- 禁止利用本产品从事订阅、广告、商业引流、捆绑销售或其他直接、间接盈利与商业化活动。
- 未经作者事先明确书面授权，禁止利用产品链接、下载文件、接口或相关资源，对专有程序进行逆向工程、反编译、源码还原或代码提取，禁止传播或另行使用由此取得的专有代码。

以上约定及适用范围详见[学习交流使用条款](LICENSE.txt)。第三方组件、字体及素材按[各自许可](THIRD_PARTY_NOTICES.md)使用。

## 联系作者

任何商业化、授权或超出学习交流范围的使用，均须先与作者本人沟通，取得针对具体用途的明确书面授权后方可开展。

作者：[richzorya](https://github.com/richzorya)。请使用作者主页公开的联系方式；如无合适的私密渠道，可在仓库[提交“授权联系”请求](https://github.com/mind-universe-studio/mind-universe-release/issues/new?template=contact_request.md)，仅说明拟议用途，等作者提供联系方式后再沟通详情。请勿在公开页面留下个人资料或商业秘密。

## 问题反馈

功能问题与建议可[提交 Issue](https://github.com/mind-universe-studio/mind-universe-release/issues/new/choose)，请提供版本、设备和发生问题的步骤，并删除密钥及私人聊天。涉及安全或隐私的问题，请按[安全说明](SECURITY.md)私密联系。

BUILD 222 Preview 的系统伙伴入口：手机助手 → 系统伙伴。公开内测入口本次尚未同步这项功能。可从五个模板创建或自定义，使用已选 API 模型连续对话，保存和修订共同记忆，并绑定准备好的平行世界故事。切换人格会保留旧对话；任务判定、道具执行与 MCP 尚未接入。
