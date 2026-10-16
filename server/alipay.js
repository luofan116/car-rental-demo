import { readFileSync } from 'node:fs'
import { AlipaySdk } from 'alipay-sdk'

let sdk
export function getAlipayClient() {
  if (sdk) return sdk
  const appId = process.env.ALIPAY_APP_ID
  const privateKeyPath = process.env.ALIPAY_PRIVATE_KEY_PATH
  const publicKeyPath = process.env.ALIPAY_PUBLIC_KEY_PATH
  if (!appId || !privateKeyPath || !publicKeyPath)
    throw Object.assign(new Error('请配置 ALIPAY_APP_ID、ALIPAY_PRIVATE_KEY_PATH、ALIPAY_PUBLIC_KEY_PATH'), { status: 503 })
  sdk = new AlipaySdk({
    appId,
    privateKey: readFileSync(privateKeyPath, 'utf8'),
    alipayPublicKey: readFileSync(publicKeyPath, 'utf8'),
    gateway: 'https://openapi.alipay.com/gateway.do',
    keyType: 'PKCS8',
  })
  return sdk
}
export async function exchangeAlipayCode(code) {
  if (typeof code !== 'string' || code.length < 6 || code.length > 2048)
    throw Object.assign(new Error('无效的支付宝授权码'), { status: 400 })
  try {
    const result = await getAlipayClient().exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code,
    }, { validateSign: true })
    const userId = result.userId || result.user_id
    if (!userId) throw Error('支付宝未返回 user_id')
    return { userId: String(userId) }
  } catch (error) {
    if (error.status === 503) throw error
    console.error('支付宝授权码交换失败:', error?.message || error)
    throw Object.assign(new Error('支付宝授权验证失败，请重新授权并检查服务端密钥配置'), { status: 401 })
  }
}
