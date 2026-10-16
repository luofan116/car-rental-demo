<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/rental'
import { getDemoShops } from '@/mock/shops'
definePage({style:{navigationStyle:'default',navigationBarTitleText:'附近门店'}})
const shops=ref([])
const demo=ref(false)
async function load(){
  const fallback=()=>{shops.value=getDemoShops();demo.value=true}
  if(!import.meta.env.VITE_RENTAL_API_BASE){fallback();return}
  try{const result=await api('/shops');shops.value=Array.isArray(result)?result:result.items||[];demo.value=false}
  catch(e){console.warn('门店服务不可用:',e.message);fallback()}
}
onMounted(load)
function details(shop){
 uni.showModal({title:shop.name,content:shop.address+'\n'+(shop.type==='swap'?'可用电池：'+(shop.batteries??0):'可租车辆：'+(shop.vehicles??0)),showCancel:false})
}
</script>
<template>
<view class="shop-page">
 <view v-if="demo" class="demo-label">当前显示模拟门店数据，仅用于功能演示</view>
 <view v-if="!shops.length" class="empty">附近暂无门店</view>
 <view v-for="shop in shops" :key="shop.id" class="shop-card" @click="details(shop)">
  <view class="shop-name">{{shop.name}} <text class="tag">{{shop.type==='swap'?'换电站':'租车门店'}}</text></view>
  <view class="address">{{shop.address}}</view>
  <view class="foot"><text>{{shop.type==='swap'?'可用电池':'可租车辆'}}：{{shop.type==='swap'?shop.batteries:shop.vehicles}}</text><text>查看详情 ›</text></view>
 </view>
</view>
</template>
<style scoped>
.shop-page{min-height:100vh;background:#f4f6fa;padding:24rpx}.demo-label{padding:16rpx;color:#667085;font-size:24rpx}.shop-card{background:#fff;border-radius:22rpx;padding:28rpx;margin-bottom:22rpx;box-shadow:0 4rpx 18rpx #00000008}.shop-name{font-size:32rpx;font-weight:600;color:#23365b}.tag{float:right;background:#eaf1ff;color:#416cda;font-size:22rpx;padding:8rpx 12rpx;border-radius:10rpx}.address{margin-top:20rpx;color:#888;font-size:25rpx}.foot{display:flex;justify-content:space-between;margin-top:24rpx;color:#416cda;font-size:25rpx}.empty{text-align:center;padding:100rpx;color:#999}
</style>