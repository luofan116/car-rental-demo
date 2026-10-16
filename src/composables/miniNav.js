import { ref } from 'vue'

/**
 * 小程序导航胶囊安全区（单位 px）。
 * 使用平台提供的胶囊矩形，不用固定 iPhone 状态栏高度。
 */
export function useMiniNav() {
  const navBottom = ref(12)
  const navTop = ref(8)
  const capsuleLeft = ref(0)
  const capsuleRight = ref(0)

  function refresh() {
    // #ifdef MP-WEIXIN || MP-ALIPAY
    const sys = uni.getSystemInfoSync()
    const status = Number(sys.statusBarHeight) || 20
    let rect
    try {
      if (typeof uni.getMenuButtonBoundingClientRect === 'function')
        rect = uni.getMenuButtonBoundingClientRect()
      // #ifdef MP-WEIXIN
      if (!rect && typeof wx !== 'undefined' && wx.getMenuButtonBoundingClientRect)
        rect = wx.getMenuButtonBoundingClientRect()
      // #endif
      // #ifdef MP-ALIPAY
      if (!rect && typeof my !== 'undefined' && my.getMenuButtonBoundingClientRect)
        rect = my.getMenuButtonBoundingClientRect()
      // #endif
    } catch (e) { console.warn('获取小程序胶囊位置失败', e) }
    const valid = rect && rect.height > 0 && rect.top >= 0
    navTop.value = valid ? rect.top : status + 6
    navBottom.value = valid ? rect.bottom + 12 : status + 56
    capsuleLeft.value = valid ? rect.left : 0
    capsuleRight.value = valid ? (sys.windowWidth - rect.right) : 0
    // #endif
    // #ifdef H5
    navTop.value = 8
    navBottom.value = 18
    // #endif
  }

  refresh()
  return { navTop, navBottom, capsuleLeft, capsuleRight, refresh }
}
