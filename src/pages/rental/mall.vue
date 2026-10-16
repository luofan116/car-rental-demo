<script setup>
import { ref,onMounted,computed } from 'vue'
import { t } from '@/locale'
import { api } from '@/services/rental'
definePage({style:{navigationBarTitleText:'商城'}})
const keyword=ref(''),items=ref([])
const filtered=computed(()=>items.value.filter(x=>!keyword.value||x.name?.includes(keyword.value)))
onMounted(async()=>{try{const r=await api('/products');items.value=Array.isArray(r)?r:r.items||[]}catch(e){console.warn(e.message)}})
</script>
<template><view class="p-5"><input v-model="keyword" class="bg-white rounded-full p-4 mb-7" :placeholder="t('rental.searchMall')"/><view v-if="!filtered.length" class="text-center text-gray-400 py-28">{{t('rental.noProducts')}}</view><view v-for="p in filtered" :key="p.id" class="bg-white rounded-xl p-5 mb-4"><image v-if="p.image" :src="p.image" mode="aspectFill" class="w-full h-36"/><view class="font-bold mt-2">{{p.name}}</view><view class="text-emerald-500 mt-2">¥ {{p.price}}</view></view></view></template>