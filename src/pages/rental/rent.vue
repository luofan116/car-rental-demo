<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { t } from '@/locale'
import { api, scanRental, requireLogin } from '@/services/rental'
definePage({style:{navigationBarTitleText:'立即租赁'}})
const vehicle=ref(''),busy=ref(false)
onLoad(options => { if(options?.code)vehicle.value=decodeURIComponent(options.code) })
async function scan(){try{const r=await scanRental();vehicle.value=r.result||''}catch(e){uni.showToast({title:e.message||'扫码取消',icon:'none'})}}
async function submit(){if(!requireLogin())return;if(!vehicle.value.trim())return uni.showToast({title:t('rental.enterVehicle'),icon:'none'});busy.value=true;try{await api('/rentals','POST',{vehicleCode:vehicle.value});uni.showToast({title:t('rental.success')})}catch(e){uni.showModal({title:t('rental.failed'),content:e.message,showCancel:false})}finally{busy.value=false}}
</script>
<template><view class="p-6"><view class="my-14 text-center text-3xl font-bold">{{t('rental.start')}}</view><button class="mb-7" type="primary" @click="scan">{{t('rental.scan')}}</button><view class="text-gray-500 mb-3">{{t('rental.vehicleCode')}}</view><input class="bg-white rounded-xl p-4 mb-8" v-model="vehicle" :placeholder="t('rental.enterVehicle')" /><button type="primary" :loading="busy" @click="submit">{{t('rental.confirmRent')}}</button><view class="text-center mt-10 text-gray-500" @click="uni.navigateTo({url:'/pages/rental/reserve'})">{{t('rental.reserve')}} ›</view></view></template>