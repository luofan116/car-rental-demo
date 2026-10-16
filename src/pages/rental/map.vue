<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/rental'
import { t } from '@/locale'
definePage({ style: { navigationStyle: 'custom' } })
const latitude=ref(22.5431),longitude=ref(114.0579),markers=ref([])
const mode=ref('rent')
const message=ref('')
// Vite 环境变量须在 script 中读取，模板只引用普通变量。
const hasMapKey = Boolean(import.meta.env.VITE_MAP_KEY)
async function load(){
  if(!import.meta.env.VITE_RENTAL_API_BASE){message.value='演示模式：尚未配置门店后端';return}
  try{
    const r=await api('/shops?mode='+mode.value)
    const items=Array.isArray(r)?r:r.items||[]
    markers.value=items.filter(x=>x.latitude&&x.longitude).map((x,i)=>({id:i+1,latitude:Number(x.latitude),longitude:Number(x.longitude),title:x.name,width:28,height:28}))
  }catch(e){message.value='门店加载失败：'+e.message}
}
function locate(){uni.getLocation({type:'gcj02',success:r=>{latitude.value=r.latitude;longitude.value=r.longitude},fail:()=>uni.showToast({title:t('rental.locationFail'),icon:'none'})})}
function change(v){mode.value=v;load()}
function openRentalActions(){
  uni.showActionSheet({
    itemList:['扫码租车','输入编号租车','预约租车'],
    success({tapIndex}){
      if(tapIndex===0)uni.scanCode({onlyFromCamera:true,success:r=>uni.navigateTo({url:'/pages/rental/rent?code='+encodeURIComponent(r.result||'')})})
      else if(tapIndex===1)uni.navigateTo({url:'/pages/rental/rent'})
      else if(tapIndex===2)uni.navigateTo({url:'/pages/rental/reserve'})
    },
  })
}
onMounted(()=>{load();locate()})
</script>
<template>
<view class="map-page">
  <map class="map-view" :latitude="latitude" :longitude="longitude" :markers="markers" :show-location="true" />
  <view class="top">
    <view class="home" @click="uni.switchTab({url:'/pages/index/index'})">⌂</view>
    <view class="modes"><text :class="{active:mode==='rent'}" @click="change('rent')">{{t('rental.rent')}}</text><text :class="{active:mode==='swap'}" @click="change('swap')">{{t('rental.swap')}}</text></view>
  </view>
  <view class="tools"><view @click="locate">◎ 定位</view><view @click="uni.navigateTo({url:'/pages/rental/shops'})">▣ 门店</view></view>
  <!-- #ifdef H5 -->
  <view v-if="!hasMapKey" class="notice">H5 地图未配置 Map Key，请在项目环境变量和地图服务控制台完成配置。</view>
  <!-- #endif -->
  <view v-if="message" class="hint">{{message}}</view>
  <view class="rent-button" @click="openRentalActions">{{t('rental.start')}}</view>
</view>
</template>
<style scoped>
.map-page{height:100vh;position:relative;background:#e6ebec}.map-view{width:100%;height:100%}.top{position:absolute;left:30rpx;top:120rpx;display:flex;gap:24rpx}.home{background:#fff;padding:12rpx 30rpx;border-radius:30rpx;font-size:42rpx}.modes{border-radius:40rpx;background:#fff;overflow:hidden;display:flex}.modes text{padding:20rpx 55rpx}.modes .active{background:#416cdb;color:white}.tools{position:absolute;top:30%;left:30rpx}.tools view{background:#fff;padding:18rpx;border-radius:18rpx;margin-bottom:18rpx}.notice{position:absolute;top:42%;left:7%;width:80%;padding:3%;background:#fffffff0;border-radius:24rpx;color:#444;font-size:26rpx}.hint{position:absolute;top:58%;left:7%;background:#fff9;padding:18rpx;border-radius:20rpx;font-size:24rpx}.rent-button{position:absolute;bottom:155rpx;left:17%;width:66%;padding:22rpx 0;background:#416cdb;color:#fff;text-align:center;border-radius:50rpx}
</style>