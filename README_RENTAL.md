# Car rental mini-app demo

This is an extension of the official unibest v4.4.1 scaffold with --i18n. Business pages and services use JavaScript. Official scaffold configuration remains TypeScript.

## Run
pnpm install
pnpm dev:mp-weixin
pnpm dev:mp-alipay

Configure VITE_RENTAL_API_BASE in env/.env.development (or the appropriate unibest environment file) to a deployed HTTPS backend. Configure both mini-app AppIDs in manifest.config.ts and allowlist your backend domain in each platform console.

## Real platform login
src/services/rental.js invokes wx.login on WeChat and my.getAuthCode({scopes:'auth_base'}) on Alipay. POST /auth/wechat/login {code} and POST /auth/alipay/login {code} MUST be implemented on a secure backend. Backend MUST exchange the code with the respective platform (wechat jscode2session / alipay system.oauth.token), look up or create an account, and sign a first-party token. Never return or store app secrets on clients. This repo does not include credentials or a deployed auth service; true end-to-end authorization therefore requires backend configuration and real-device validation.

Other backend contracts: GET /shops?mode=rent|swap, GET /products, GET /orders, POST /rentals {vehicleCode}, POST /reservations {vehicleCode,date}. Responses may be arrays or {items:[]}. Unauthorized calls should return 401.

## Limitations
This is a functional frontend integration baseline, not an operational rental platform. Real vehicle locking, payments, account deletion, legal policies, and production data need backend integrations. Maps/location require platform permission and production AppID. Cross-platform compilation and real-device authorization have not been validated in this environment.


## 地图和后端配置（2026-10）

本项目在官方 unibest 环境变量目录 `env/` 中读取 `VITE_MAP_KEY`、`VITE_RENTAL_API_BASE`。

- 在腾讯位置服务申请供 H5 使用的 JavaScript SDK Key，配置允许访问的域名（开发时检查本机 localhost 的允许规则）。
- 在 `env/.env.development` 中添加 `VITE_MAP_KEY=你的腾讯地图JavaScriptKey`。
- `manifest.config.ts` 的 `h5.sdkConfigs.maps.tencent.key` 已接入该变量。修改后停止并重新启动 `pnpm dev:h5`。小程序地图服务分别按微信、支付宝平台规范配置，不可以仅用这个 H5 Key 替代全部平台的授权。
- 有正式后端时设置 `VITE_RENTAL_API_BASE=https://你的后端域名`；该服务需要实现文档前述端点，并且小程序管理后台要配置合法 request 域名。
- 没有后端时，首页、商城、门店等采用明确的空状态/提示，并不会生成虚假的可租车辆或订单。登录、开锁和支付不能在没有合法服务端时模拟为真实交易。

底部五个业务导航为：首页、地图、立即租赁、商城、我的。中间按钮进入真实租车业务页面而不是测试 Toast。**开发阶段仍需双端编译、真机地图、授权和后端联调验证**。


## 微信与支付宝双端开发工具配置

此工程使用官方 unibest 4.4.1 的 `manifest.config.ts` 自动生成 `src/manifest.json`，**不要将小程序 AppSecret、支付宝私钥提交到仓库**。

1. 在 `env/.env.development` （本地配置，确认不要提交真实密钥）补充：
   ```dotenv
   VITE_WX_APPID=wx你的小程序AppID
   VITE_ALIPAY_APPID=你的小程序支付宝AppID
   VITE_MAP_KEY=你的腾讯位置服务H5 JavaScript SDK Key
   VITE_RENTAL_API_BASE=https://你的API合法域名
   ```
2. 登录 [微信公众平台](https://mp.weixin.qq.com/) 创建/选择小程序，获取 AppID；通过 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开 `dist/dev/mp-weixin`。执行 `pnpm dev:mp-weixin` 编译。
3. 登录 [支付宝开放平台](https://open.alipay.com/) 创建小程序并获取 AppID，使用支付宝小程序开发者工具打开 `dist/dev/mp-alipay`。执行 `pnpm dev:mp-alipay` 编译。
4. H5 端执行 `pnpm dev:h5`。项目同时兼容 `h5.sdkConfigs.maps.tencent` / `qqmap` 配置名（由实际 CLI 编译器版本决定）。在腾讯位置服务后台为 H5 Key 开启 JavaScript SDK 功能并设置对应的域名白名单；本地 `localhost` 也需要按平台规则处理。
5. 小程序端 `<map>` 底图由平台 SDK 提供，不是读取 `VITE_MAP_KEY` 的同一套 H5 逻辑。微信/支付宝请分别核对地图、位置权限和隐私声明；真实位置定位需要用户允许相关权限。
6. 真实微信登录：前端 `wx.login`，服务端 `code2Session`；真实支付宝登录：前端 `my.getAuthCode`，服务端 `alipay.system.oauth.token`；两个服务端流程都需平台侧的 AppID/密钥并签发自己的 Token。当前仓库只有前端适配层，并不自带可上线的授权后端。

温馨提示：修改环境变量、manifest 或 tabbar 后请**完全退出并重新执行** dev 命令，而不只依靠热更新。如果 `dist/dev/mp-*` 不存在，请先检查 unibest 当前版本的实际构建输出路径。中间租车按钮现在先进入地图页再使用平台原生 ActionSheet 展示扫码、编号、预约三种操作；这在 H5/微信/支付宝中的样式因平台而异，正式 1:1 自定义弹层尚未验收。
