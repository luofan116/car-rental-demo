<script setup>
import {ref,onMounted} from 'vue'
import {api} from '@/services/rental'
import {t} from '@/locale'
definePage({style:{navigationBarTitleText:'附近门店'}})
const shops=ref([])
onMounted(async()=>{try{const r=await api('/shops');shops.value=Array.isArray(r)?r:r.items||[]}catch(e){console.warn(e.message)}})
</script>
<template><view class="p-5"><view v-if="!shops.length" class="text-center text-gray-400 py-28">{{t('rental.noShops')}}</view><view v-for="s in shops" :key="s.id" class="bg-white rounded-xl p-5 mb-4"><view class="font-bold">{{s.name}}</view><view class="text-gray-500 text-sm mt-3">{{s.address}}</view></view></view></template>