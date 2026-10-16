<script setup>
import { ref,onShow } from 'vue'
import { t } from '@/locale'
definePage({style:{navigationBarTitleText:'我的'}})
const user=ref(null)
onShow(()=>user.value=uni.getStorageSync('rental_user')||null)
const menu=[['orders','▤'],['mall','▦'],['reserve','▣'],['settings','⚙']]
function go(p){uni.navigateTo({url:'/pages/rental/'+p})}
</script>
<template><view class="min-h-screen bg-gray-50"><view class="bg-emerald-500 text-white p-8 pt-16 rounded-b-3xl"><view class="text-2xl font-bold" @click="go('login')">{{user?.nickname||user?.name||t('rental.loginText')}} ›</view><view class="mt-9 flex justify-around text-center"><view>¥ 0.00<view class="text-sm mt-2">{{t('rental.balance')}}</view></view><view>¥ 0.00<view class="text-sm mt-2">{{t('rental.deposit')}}</view></view><view>0<view class="text-sm mt-2">{{t('rental.coupons')}}</view></view></view></view><view class="bg-white rounded-2xl m-5 p-5"><view v-for="m in menu" :key="m[0]" class="py-5 border-b border-gray-100" @click="go(m[0])">{{m[1]}}　{{t('rental.'+m[0])}} <text class="float-right">›</text></view></view></view></template>