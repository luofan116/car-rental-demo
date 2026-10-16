// 所有后端请求走统一网关；不要在小程序端保存平台密钥。
const BASE = import.meta.env.VITE_RENTAL_API_BASE || ''
export function api(path, method='GET', data) {
  if (!BASE) return Promise.reject(new Error('请先配置 VITE_RENTAL_API_BASE'))
  return new Promise((resolve,reject)=>uni.request({
    url: BASE + path, method, data,
    header:{Authorization: uni.getStorageSync('rental_token') ? 'Bearer '+uni.getStorageSync('rental_token') : ''},
    success:res=>res.statusCode>=200&&res.statusCode<300?resolve(res.data):reject(new Error(res.data?.message||'HTTP '+res.statusCode)),
    fail:reject,
  }))
}
export async function platformLogin(){
  let platform, code
  // #ifdef MP-WEIXIN
  platform='wechat'
  const r=await new Promise((resolve,reject)=>wx.login({success:resolve,fail:reject}))
  code=r.code
  // #endif
  // #ifdef MP-ALIPAY
  platform='alipay'
  const r=await new Promise((resolve,reject)=>my.getAuthCode({scopes:['auth_base'],success:resolve,fail:reject}))
  code=r.authCode
  // #endif
  if(!platform||!code) throw new Error('无法获得平台授权码')
  const session=await api('/auth/'+platform+'/login','POST',{code})
  if(!session?.token) throw new Error('登录接口没有返回 token')
  uni.setStorageSync('rental_token',session.token)
  uni.setStorageSync('rental_user',session.user||{})
  return session
}
export function scanRental(){
  return new Promise((resolve,reject)=>uni.scanCode({onlyFromCamera:true,success:resolve,fail:reject}))
}
export function requireLogin(){
  if(uni.getStorageSync('rental_token')) return true
  uni.navigateTo({url:'/pages/rental/login'})
  return false
}
