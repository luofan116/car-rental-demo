<script setup>
import { ref } from 'vue'
import { t } from '@/locale'
import { api,requireLogin } from '@/services/rental'
definePage({style:{navigationBarTitleText:'预约租车'}})
const date=ref('2026-10-17'),code=ref('')
async function save(){if(!requireLogin())return;try{await api('/reservations','POST',{vehicleCode:code.value,date:date.value});uni.showToast({title:t('rental.success')})}catch(e){uni.showModal({title:t('rental.failed'),content:e.message,showCancel:false})}}
</script>
<template><view class="p-6"><view class="font-bold text-xl mb-6">{{t('rental.reserve')}}</view><input v-model="code" class="bg-white p-4 rounded-xl mb-6" :placeholder="t('rental.vehicleCode')"/><picker mode="date" :value="date" @change="date=$event.detail.value"><view class="bg-white rounded-xl p-4 mb-8">{{t('rental.chooseDate')}}：{{date}} ›</view></picker><button type="primary" @click="save">{{t('rental.submit')}}</button></view></template>