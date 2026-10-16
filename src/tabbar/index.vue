<script setup lang="ts">
// i-carbon-code
import { customTabbarEnable, needHideNativeTabbar, tabbarCacheEnable } from './config'
import { setTabbarItem } from './i18n'
import { tabbarList, tabbarStore } from './store'
import TabbarItem from './TabbarItem.vue'

// #ifdef MP-WEIXIN
// 将自定义节点设置成虚拟的（去掉自定义组件包裹层），更加接近Vue组件的表现，能更好的使用flex属性
defineOptions({
  virtualHost: true,
})
// #endif

/**
 * 中间的鼓包tabbarItem的点击事件
 */
function showRentMenu() {
  uni.showActionSheet({
    itemList: ['扫码租车', '输入编号租车', '预约租车'],
    success({ tapIndex }) {
      if (tapIndex === 0) {
        uni.scanCode({
          onlyFromCamera: true,
          success(result) {
            uni.navigateTo({ url: '/pages/rental/rent?code=' + encodeURIComponent(result.result || '') })
          },
          fail(error) {
            if (!String(error?.errMsg || '').includes('cancel'))
              uni.showToast({ title: '扫码失败，请检查相机权限', icon: 'none' })
          },
        })
      }
      else if (tapIndex === 1) uni.navigateTo({ url: '/pages/rental/rent' })
      else if (tapIndex === 2) uni.navigateTo({ url: '/pages/rental/reserve' })
    },
  })
}
function handleClickBulge() {
  // 不切换到租车独立 Tab；先确保地图在弹层后方。
  const current = getCurrentPages()
  const route = current[current.length - 1]?.route
  if (route === 'pages/rental/map') showRentMenu()
  else uni.switchTab({
    url: '/pages/rental/map',
    success: () => setTimeout(showRentMenu, 180),
  })
}

function handleClick(index: number) {
  // 点击原来的不做操作
  if (index === tabbarStore.curIdx && !tabbarList.value[index]?.isBulge) {
    return
  }
  const list = tabbarList.value
  if (!list[index]) {
    return
  }
  if (list[index].isBulge) {
    handleClickBulge()
    return
  }
  const url = list[index].pagePath
  tabbarStore.setCurIdx(index)
  if (tabbarCacheEnable) {
    uni.switchTab({ url })
  }
  else {
    uni.navigateTo({ url })
  }
}
// #ifndef MP-WEIXIN || MP-ALIPAY
// 因为有了 custom:true， 微信里面不需要多余的hide操作
onLoad(() => {
  // 解决原生 tabBar 未隐藏导致有2个 tabBar 的问题
  needHideNativeTabbar
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif

// #ifdef MP-ALIPAY
onMounted(() => {
  // 解决支付宝自定义tabbar 未隐藏导致有2个 tabBar 的问题; 注意支付宝很特别，需要在 onMounted 钩子调用
  customTabbarEnable // 另外，支付宝里面，只要是 customTabbar 都需要隐藏
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif
const activeColor = 'var(--wot-color-theme, #1890ff)'
const inactiveColor = '#666'
function getColorByIndex(index: number) {
  return tabbarStore.curIdx === index ? activeColor : inactiveColor
}

// 注意，上面处理的是自定义tabbar，下面处理的是原生tabbar，参考：https://unibest.tech/base/10-i18n
onShow(() => {
  setTabbarItem()
})
</script>

<template>
  <view v-if="customTabbarEnable" class="h-50px pb-safe">
    <view class="border-and-fixed bg-white" @touchmove.stop.prevent>
      <view class="h-50px flex items-center">
        <view
          v-for="(item, index) in tabbarList" :key="index"
          class="flex flex-1 flex-col items-center justify-center"
          :style="{ color: getColorByIndex(index) }"
          @click="handleClick(index)"
        >
          <view v-if="item.isBulge" class="relative">
            <!-- 中间一个鼓包tabbarItem的处理 -->
            <view class="bulge"><text class="bulge-text">立即\n租赁</text></view>
          </view>
          <TabbarItem v-else :item="item" :index="index" class="relative px-3 text-center" />
        </view>
      </view>

      <view class="pb-safe" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.border-and-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-top: 1px solid #eee;
  box-sizing: border-box;
}
// 中间鼓包的样式
.bulge {
  position: absolute;
  left: 50%;
  bottom: -26px;
  transform: translateX(-50%);
  width: 126rpx;
  height: 126rpx;
  border-radius: 50%;
  background: #416cda;
  color: #fff;
  box-shadow: 0 5rpx 18rpx rgba(52,102,218,.16);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
}
.bulge-text {
  display: block;
  white-space: pre-line;
  text-align: center;
  font-size: 29rpx;
  font-weight: 600;
  line-height: 36rpx;
}

</style>
