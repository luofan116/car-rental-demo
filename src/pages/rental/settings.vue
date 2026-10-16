<script setup>
import { ref } from 'vue'
import { t } from '@/locale'
definePage({style:{navigationBarTitleText:'设置'}})
const items=['privacy','terms','disclaimer']
const langs=['zh-Hans','en'];const locale=ref(uni.getLocale())
function changeLang(e){const value=langs[e.detail.value];locale.value=value;uni.setLocale(value);uni.showToast({title:'OK'})}
function openPolicy(kind){uni.showModal({title:t('rental.'+kind),content:t('rental.policyPending'),showCancel:false})}
function logout(){uni.removeStorageSync('rental_token');uni.removeStorageSync('rental_user');uni.showToast({title:t('rental.loggedOut')})}
</script>
<template><view class="p-5"><view class="bg-white rounded-2xl overflow-hidden"><view v-for="i in items" :key="i" class="p-5 border-b border-gray-100" @click="openPolicy(i)">{{t('rental.'+i)}} <text class="float-right">›</text></view><picker :range="['简体中文','English']" @change="changeLang"><view class="p-5">{{t('rental.language')}} · {{locale}}</view></picker></view><button class="mt-10" @click="logout">{{t('rental.logout')}}</button><view class="text-center text-xs text-gray-400 mt-8">{{t('rental.deleteAccountHint')}}</view></view></template>