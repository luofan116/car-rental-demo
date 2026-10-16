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
