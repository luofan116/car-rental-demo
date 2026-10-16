<script setup>
import { ref, onMounted } from 'vue'
import { t } from '@/locale'
import { api } from '@/services/rental'
import { getDemoShops, mapShopMarkers } from '@/mock/shops'
import { useMiniNav } from '@/composables/miniNav'
definePage({type:'home',style:{navigationStyle:'custom'}})
const mode=ref('rent'), latitude=ref(22.5431),longitude=ref(114.0579),shops=ref([])
const markers=ref([])
const { navBottom } = useMiniNav()
function go(path){const url='/pages/rental/'+path;if(['map','rent','mall'].includes(path))uni.switchTab({url});else uni.navigateTo({url})}
function switchMode(v){mode.value=v;load()}
function locate(){uni.getLocation({type:'gcj02',success:r=>{latitude.value=r.latitude;longitude.value=r.longitude},fail:()=>uni.showToast({title:t('rental.locationFail'),icon:'none'})})}
async function load(){
  const fallback=()=>{shops.value=getDemoShops(mode.value);markers.value=mapShopMarkers(shops.value)}
  if (!import.meta.env.VITE_RENTAL_API_BASE) {fallback();return}
  try {
    const result=await api('/shops?mode='+mode.value)
    shops.value=Array.isArray(result)?result:(result.items||[])
    markers.value=mapShopMarkers(shops.value.filter(s=>s.latitude&&s.longitude))
  } catch(error) {
    console.warn('门店接口失败，显示演示数据:',error.message)
    fallback()
  }
}
function onMarkerTap(event){
 const shop=shops.value.find(s=>Number(s.id)===Number(event.detail.markerId))
 if(shop)uni.showModal({title:shop.name,content:shop.address+'\\n'+(shop.type==='rent'?'可租车辆：'+(shop.vehicles??0):'可用电池：'+(shop.batteries??0)),showCancel:false})
}
onMounted(()=>{locate();load()})
</script>
<template>
 <view class="rental">
  <view class="head" :style="{paddingTop: navBottom + 'px'}"><view class="brand">优骑 <text class="sub">BIKE RENTAL</text></view><view class="lang" @click="go('settings')">⚙</view></view>
  <view class="switch" :style="{top: `calc(${navBottom}px + 88rpx)`}"><view :class="mode==='rent'?'active':''" @click="switchMode('rent');load()">{{ t('rental.rent') }}</view><view :class="mode==='swap'?'active':''" @click="switchMode('swap');load()">{{ t('rental.swap') }}</view></view>
  <map class="map" :latitude="latitude" :longitude="longitude" :markers="markers" :show-location="true" @markertap="onMarkerTap" />
  <view class="locate" @click="locate">◎</view>
  <view class="panel">
   <view class="line"><text class="section">{{ t('rental.nearby') }}</text><text class="muted">{{ shops.length }} {{ t('rental.stores') }}</text></view>
   <view v-if="shops.length" class="shop" v-for="s in shops" :key="s.id" @click="go('shops')">{{s.name}} <text class="muted">›</text></view>
   <view v-else class="empty">{{ t('rental.noShops') }}</view>
   <view class="actions"><view @click="go('reserve')">▣ {{ t('rental.reserve') }}</view><view @click="go('orders')">▤ {{ t('rental.orders') }}</view><view @click="go('mall')">▦ {{ t('rental.mall') }}</view></view>
   <button class="primary" @click="go('rent')">{{ t('rental.start') }}</button>
  </view>
 </view>
</template>
<style scoped>
.rental{height:100vh;background:#f4f6f7;position:relative;color:#202b29}.head{position:absolute;top:0;left:0;right:0;z-index:2;padding:0 36rpx 24rpx;display:flex;justify-content:space-between;background:linear-gradient(#fff,rgba(255,255,255,.85))}.brand{font-size:44rpx;font-weight:800;color:#08aa81}.sub{font-size:17rpx;color:#888;letter-spacing:2px}.lang{font-size:36rpx}.switch{position:absolute;top:170rpx;left:50%;transform:translateX(-50%);z-index:2;background:white;border-radius:48rpx;display:flex;padding:8rpx;box-shadow:0 6rpx 20rpx #0001}.switch view{padding:15rpx 46rpx;font-size:27rpx;border-radius:40rpx}.switch .active{background:#0cba91;color:#fff}.map{width:100%;height:72vh}.locate{position:absolute;right:30rpx;top:49vh;background:white;border-radius:50%;padding:24rpx;font-size:42rpx;box-shadow:0 6rpx 20rpx #0002}.panel{position:absolute;bottom:0;width:100%;box-sizing:border-box;border-radius:42rpx 42rpx 0 0;background:white;padding:32rpx 36rpx 70rpx;box-shadow:0 -8rpx 36rpx #0001}.line{display:flex;justify-content:space-between}.section{font-size:35rpx;font-weight:700}.muted{color:#999;font-size:24rpx}.shop{padding:20rpx;border-bottom:1px solid #eee;display:flex;justify-content:space-between}.empty{color:#aaa;text-align:center;padding:33rpx}.actions{display:flex;justify-content:space-around;margin:20rpx 0 28rpx;font-size:26rpx}.primary{background:#12bd91;color:white;border-radius:50rpx;font-size:32rpx}
</style>