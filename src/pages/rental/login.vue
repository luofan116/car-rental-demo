<script setup>
import { ref } from 'vue'
import { t } from '@/locale'
import { platformLogin, api } from '@/services/rental'
definePage({style:{navigationStyle:'default',navigationBarTitleText:'授权登录'}})
const agreed=ref(false),loading=ref(false)
const enableDemo=import.meta.env.DEV && import.meta.env.VITE_DEMO_AUTH_ENABLED !== 'false'
async function demoLogin(){
 if(!agreed.value)return uni.showToast({title:t('rental.agreementNeeded'),icon:'none'})
 loading.value=true
 try{
  const result=await api('/auth/demo/login','POST',{})
  if(!result.token)throw new Error('服务器未返回 Token')
  uni.setStorageSync('rental_token',result.token)
  uni.setStorageSync('rental_user',result.user||{})
  uni.showToast({title:'演示登录成功',icon:'success'})
  setTimeout(()=>uni.navigateBack(),400)
 }catch(e){uni.showModal({title:'演示登录失败',content:e.message||String(e),showCancel:false})}
 finally{loading.value=false}
}
async function login(){
 if(!agreed.value)return uni.showToast({title:t('rental.agreementNeeded'),icon:'none'})
 loading.value=true
 try{await platformLogin();uni.showToast({title:t('rental.loginSuccess')});setTimeout(()=>uni.navigateBack(),400)}
 catch(e){uni.showModal({title:t('rental.loginFailed'),content:e.message||String(e),showCancel:false})}
 finally{loading.value=false}
}
</script>
<template><view class="p-8 pt-28 text-center"><view class="text-6xl font-bold text-emerald-500">优骑</view><view class="mt-5 text-gray-500">{{t('rental.loginText')}}</view><button class="mt-16" type="primary" :loading="loading" @click="login">{{t('rental.authorize')}}</button><button v-if="enableDemo" class="mt-5" :loading="loading" @click="demoLogin">体验 Demo 登录（非平台实名）</button><view class="mt-8 text-sm" @click="agreed=!agreed">{{agreed?'☑':'□'}} {{t('rental.agreement')}}</view></view></template>