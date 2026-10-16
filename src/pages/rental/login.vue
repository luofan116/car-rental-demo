<script setup>
import { ref } from 'vue'
import { t } from '@/locale'
import { platformLogin } from '@/services/rental'
definePage({style:{navigationBarTitleText:'授权登录'}})
const agreed=ref(false),loading=ref(false)
async function login(){
 if(!agreed.value)return uni.showToast({title:t('rental.agreementNeeded'),icon:'none'})
 loading.value=true
 try{await platformLogin();uni.showToast({title:t('rental.loginSuccess')});setTimeout(()=>uni.navigateBack(),400)}
 catch(e){uni.showModal({title:t('rental.loginFailed'),content:e.message||String(e),showCancel:false})}
 finally{loading.value=false}
}
</script>
<template><view class="p-8 pt-28 text-center"><view class="text-6xl font-bold text-emerald-500">优骑</view><view class="mt-5 text-gray-500">{{t('rental.loginText')}}</view><button class="mt-16" type="primary" :loading="loading" @click="login">{{t('rental.authorize')}}</button><view class="mt-8 text-sm" @click="agreed=!agreed">{{agreed?'☑':'□'}} {{t('rental.agreement')}}</view></view></template>