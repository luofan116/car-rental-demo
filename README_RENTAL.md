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
