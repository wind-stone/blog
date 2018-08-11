// 浏览器环境
export const inBrowser = typeof window !== 'undefined'

// 安卓系统 / iOS 系统
export const isAndroid = /Android/i.test(UA)
export const isIOS = /iphone|ipad|ipod|ios/i.test(UA)
