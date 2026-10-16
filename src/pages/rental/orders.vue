<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { t } from '@/locale'
import { api,requireLogin } from '@/services/rental'
definePage({style:{navigationBarTitleText:'我的订单'}})
const orders=ref([])
onShow(async()=>{if(!requireLogin())return;try{const r=await api('/orders');orders.value=Array.isArray(r)?r:r.items||[]}catch(e){console.warn(e.message)}})
</script>
<template><view class="p-5"><view v-if="!orders.length" class="text-center text-gray-400 py-28">{{t('rental.noOrders')}}</view><view v-for="o in orders" :key="o.id" class="bg-white p-5 rounded-xl mb-4">{{o.number||o.id}} · {{o.status}}</view></view></template>