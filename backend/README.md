# 安装后台

这是已编译的 Mind Universe 后台成品，不需要下载原工程或在手机上运行命令。

**仅供个人学习和技术交流使用。禁止未经作者事先明确书面授权的商业化行为，包括售卖链接、收费代部署、配置、维护或托管个人后台。** 安装前请阅读[学习交流使用条款](LICENSE.txt)与[免责声明](DISCLAIMER.md)；授权事宜请先[联系作者](https://github.com/richzorya/mind-universe-release#联系作者)。

[完整安装教程](https://github.com/richzorya/mind-universe-release/blob/main/docs/INSTALL.md) · [找回后台地址](https://github.com/richzorya/mind-universe-release/blob/main/docs/INSTALL.md#找回后台地址) · [找回配对码](https://github.com/richzorya/mind-universe-release/blob/main/docs/INSTALL.md#找回配对码) · [Cloudflare 项目列表](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

安装时要用三样内容：**安装配置**是给 Cloudflare 保存的整套秘密；**后台地址**是部署出来的访问网址；**配对码**是允许设备连接后台的口令。它们不能混填，Cloudflare 不会另发配对码。

1. 打开[安装准备页](https://mu-beta.pages.dev/install.html)；首次安装点“生成安装资料”→“保存安装备份”，保存 `MU-installation-….json` 文件，确认下载完成后点“我已保存，下一步”。已有安装应选择“恢复已有安装备份”，不要重新生成。
2. 点“复制安装配置”，复制以 `MUINSTALL1.` 开头的整段文字。这是 **INSTALL_CONFIG 的值**，不是配对码；保留原准备页。
3. 点“打开 Cloudflare 安装”或下方按钮，登录自己的 Cloudflare 和 GitHub，按提示授权安装仓库。记住创建的 Worker（后台项目）名称，保持默认部署命令 `npm run deploy`。
4. 在 `INSTALL_CONFIG` Secret（秘密）字段中粘贴第 2 项的整段文字，按提示确认资源并部署。没有输入框时按[补填安装配置的步骤](https://github.com/richzorya/mind-universe-release/blob/main/docs/INSTALL.md#没有出现-install_config-输入框)操作，不要把秘密提交到仓库。
5. 部署成功后，进入原 Worker 的“Settings（设置）→ Domains & Routes（域名和路由）”，复制 `workers.dev` 的 HTTPS 访问网址。它是**后台地址**，不是浏览器地址栏里的 Cloudflare 管理页面链接。
6. 打开[聊天网页](https://mu-beta.pages.dev/)，“设置 → 个人后台 → 连接后台”，先将网址粘贴到“后台地址”。再切回原准备页，点“3. 连接后台”→“复制配对码”，返回表单粘贴到“配对码”。可用小眼睛核对输入，再点“连接”，操作旁会显示绿色对勾和“已连接”；“检查连接”可重新检查。

以后需要修改连接名称或后台地址，可在应用“已配对”旁点“编辑”；更换地址须填写对应配对码并通过验证，失败保留原连接。[修改已保存后台](https://github.com/richzorya/mind-universe-release/blob/main/docs/FAQ.md#已保存的后台怎样修改)

准备页关闭后，可用“恢复已有安装备份”选择原文件，再进入第 3 步复制配对码；文件不包含后台网址，网址要从 Cloudflare 项目找回。原 API 密钥与模型设置继续使用，不需要因配对重新填写。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Frichzorya%2Fmind-universe-release%2Ftree%2Fmain%2Fbackend)

安装配置包含私密信息，只粘贴到 Cloudflare 的秘密输入框，不要提交到 GitHub、截图公开或发给其他人。模型 API Keys 仍在应用设置中填写，不需要放到这个仓库。

[学习交流使用条款](LICENSE.txt) · [免责声明](DISCLAIMER.md) · [第三方声明](THIRD_PARTY_NOTICES.md) · [安全问题](SECURITY.md)

## 如果安装中断

- **提示数据库尚未配置：** 返回 Cloudflare 安装页面完成新建数据库。若已建好，在自己副本的 `wrangler.jsonc` 中填入该数据库的 `database_id`，保留绑定名 `DB`，再重新部署；不要填其他应用的数据库。
- **数据库迁移失败：** 本次不会继续发布后台。到 Cloudflare 查看失败步骤，确认数据库权限和剩余额度后再重试；已经应用的迁移不会重复执行。
- **部署成功但配对失败：** 确认网址属于刚安装的 Worker，检查其设置中是否存在 `INSTALL_CONFIG` 秘密。若首次输入有误，可从安装页复制同一份配置更新该秘密；更新已有后台前不要重新生成配置，以免失去旧任务的解密信息。
- **更新这个后台：** 保留自己的 Worker 名称、数据库和 `INSTALL_CONFIG`。部署脚本不会生成、读取或删除这些秘密，也不会替换数据库。

首次安装需要 Cloudflare/GitHub 账号、相应资源权限和可用额度；请按平台页面提示操作，核对可能产生的费用。本模板用于部署个人后台，日常聊天请打开上方聊天网页。

后台会创建数据库和任务资源。关闭应用中的后台功能后，云资源仍会保留；停用时请按[更新、迁移与停用](https://github.com/richzorya/mind-universe-release/blob/main/docs/FAQ.md#更新迁移与停用)处理，并核对平台账单。

参考：[Cloudflare 部署按钮](https://developers.cloudflare.com/workers/platform/deploy-buttons/)、[数据库迁移](https://developers.cloudflare.com/d1/reference/migrations/)、[Wrangler 配置与秘密保留](https://developers.cloudflare.com/workers/wrangler/configuration/#source-of-truth)。
