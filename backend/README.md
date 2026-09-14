# 安装你的个人后台

这是已编译的 Mind Universe 后台成品，不需要下载原工程或在手机上运行命令。

1. 用准备使用 Mind Universe 的浏览器打开[安装页](https://mu-beta.pages.dev/install.html)，生成并保留安装配置。
2. 点击下面的 Cloudflare 按钮，登录自己的 Cloudflare 和 GitHub 账号，按页面提示授权创建成品仓库副本。
3. 使用一个未被自己其他应用占用的 Worker 名称，接受新建数据库；在 `INSTALL_CONFIG` 秘密输入框粘贴刚复制的完整配置。保持默认部署命令 `npm run deploy`。
4. 等 Cloudflare 显示部署成功，复制这个 Worker 的 `https://…workers.dev` 网址，回到应用的“设置 → 个人后台”，填写后台网址和已保存的配对码，完成连接与检查。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Frichzorya%2Fmind-universe-release%2Ftree%2Fmain%2Fbackend)

安装配置包含私密信息，只粘贴到 Cloudflare 的秘密输入框，不要提交到 GitHub、截图公开或发给其他人。模型 API Keys 仍在应用设置中填写，不需要放到这个仓库。

[使用许可](LICENSE.txt) · [第三方声明](THIRD_PARTY_NOTICES.md) · [安全问题](SECURITY.md)

## 如果安装中断

- **提示数据库尚未配置：** 返回 Cloudflare 安装页面完成新建数据库。若已建好，在自己副本的 `wrangler.jsonc` 中填入该数据库的 `database_id`，保留绑定名 `DB`，再重新部署；不要填其他应用的数据库。
- **数据库迁移失败：** 本次不会继续发布后台。到 Cloudflare 查看失败步骤，确认数据库权限和剩余额度后再重试；已经应用的迁移不会重复执行。
- **部署成功但配对失败：** 确认网址属于刚安装的 Worker，检查其设置中是否存在 `INSTALL_CONFIG` 秘密。若首次输入有误，可从安装页复制同一份配置更新该秘密；更新已有后台前不要重新生成配置，以免失去旧任务的解密信息。
- **更新这个后台：** 保留自己的 Worker 名称、数据库和 `INSTALL_CONFIG`。部署脚本不会生成、读取或删除这些秘密，也不会替换数据库。

首次安装需要 Cloudflare/GitHub 账号、相应资源权限和可用额度；这些由平台页面确认。手机浏览器可完成上述网页流程，不代表所有手机与账号组合都已验收。此处不是 Pages 静态 ZIP 上传入口。

模板会先以 `DB` 绑定应用数据库迁移，再部署两个持久任务流程与每分钟检查任务；流程名称根据你的 Worker 名称生成，避免不同安装共用同一流程名。关闭应用中的后台功能后，定时检查不会因此自动删除。

参考：[Cloudflare 部署按钮](https://developers.cloudflare.com/workers/platform/deploy-buttons/)、[数据库迁移](https://developers.cloudflare.com/d1/reference/migrations/)、[Wrangler 配置与秘密保留](https://developers.cloudflare.com/workers/wrangler/configuration/#source-of-truth)。
