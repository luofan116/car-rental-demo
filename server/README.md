# car-rental-demo：Node.js 演示后端

Node.js 22+，无第三方运行依赖，所有数据均为模拟数据。

## 启动

在项目根目录打开两个终端：

```bash
# 终端一
pnpm demo:server

# 终端二（支付宝）
pnpm dev:mp-alipay
# 或 pnpm dev:mp-weixin
```

访问 http://127.0.0.1:3100/health，应返回 `{"ok":true,"demo":true}`。

前端开发环境文件 `env/.env.development` 默认设置 `VITE_RENTAL_API_BASE=http://127.0.0.1:3100`，覆盖 `env/.env` 中的同名值。

## 支付宝小程序调试

支付宝开发者工具 → 详情/项目配置 → **忽略 HTTP 请求域名合法性检查**（只用于本地开发）。重新运行 `pnpm dev:mp-alipay` 并确保已关联正确小程序。

如果支付宝小程序运行在真机上，手机中的 `127.0.0.1` 指向手机自己，不能连到 Mac。请将 `VITE_RENTAL_API_BASE` 改成 Mac 所在局域网 IP，如 `http://192.168.1.20:3100`；电脑与手机需要同网段、检查防火墙；平台可能还会限制明文 HTTP，真机调试如仍不通请通过 HTTPS 开发测试服务器或隧道暴露后端，正式发布必须 HTTPS 和合法域名。

## 演示登录

登录页面点选协议并点击 **体验 Demo 登录（非平台实名）**。演示接口 `POST /auth/demo/login` 返回自己的 HMAC Token，不代表微信或支付宝认证通过；真正的 `POST /auth/wechat/login` 与 `POST /auth/alipay/login` 返回 501，待接入官方平台密钥和服务端校验后实现。

## 接口合同（Java 重构时保持一致）

| 请求 | 用途 |
|---|---|
| GET /health | 服务可用性 |
| GET /shops?mode=rent 或 swap | 返回 {items:[]} |
| GET /products | 商品列表 |
| POST /auth/demo/login | 返回 {token,user} |
| GET /auth/me | 需要 Bearer Token |
| GET /orders | 需要 Bearer Token |
| POST /rentals {vehicleCode} | 模拟创建租赁订单 |
| POST /reservations {vehicleCode,date} | 模拟预约订单 |

订单只存储在进程内存，重启会清零。禁止将演示环境直接公开部署，也不要用于实际付款、开锁或实名验证。可以用 `DEMO_AUTH_ENABLED=false pnpm demo:server` 关闭演示登录。后续 Java 端替换为相同接口和字段即可。

## 支付宝真实授权登录

前端 `my.getAuthCode({scopes:['auth_base']})` 获取一次性授权码，再调用 `POST /auth/alipay/login {code}`。Node 通过官方 `alipay-sdk` 调用 `alipay.system.oauth.token`、验证响应签名、取回 `user_id`，以 `alipay:user_id` 作为主体生成自己系统的登录 Token。此授权不自动提供头像、昵称、手机号；平台昵称在前端仅显示为通用的“支付宝用户”。

配置方法：

1. 支付宝开放平台中确认小程序已关联、AppID、应用接口加签方式为 RSA2/公钥模式并上传应用公钥，取得支付宝公钥。配置需与你选择的签名模式一致；当前 Demo 使用公钥模式，不适用于证书模式。
2. 将应用私钥保存为本地 `server/keys/app-private.pem`，支付宝公钥保存为 `server/keys/alipay-public.pem`（均为 PEM 格式）。**切勿提交或发送私钥**。
3. `cp server/.env.example server/.env`，按实际 AppID 修改路径。前端 `env/.env` 内的 `VITE_ALIPAY_APPID` 也需为同一个 AppID。
4. 首次安装：`pnpm --dir server install`；服务端运行：`pnpm demo:server`；支付宝端运行 `pnpm dev:mp-alipay`，点 **支付宝授权登录**。
5. 开发者工具还需允许本地 `http://127.0.0.1:3100` 调试。真机不能请求手机自身 localhost，需 HTTPS 测试域名并加入支付宝请求域名白名单。

真实用户身份**必须**由支付宝网关返回的 `user_id` 决定，而不是客户端传入的任意用户 ID。本实现使用本地内存订单和重启即失效的业务 Token，仅作为集成验证 Demo；正式环境还需要持久化用户、固定且安全的签名密钥、数据库、限流、完整验签/异常告警，并根据平台所需权限与配置做真机联调。

如果返回 `503`，检查服务端私钥/公钥路径与 AppID；`401` 说明授权码交换或验签失败，需核对关联应用、RSA2 密钥、授权码时效及平台接口权限。**不要把授权码、access_token、私钥粘贴到公开日志或聊天中**。
