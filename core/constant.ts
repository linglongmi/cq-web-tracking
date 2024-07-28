/**
 * 事件类型
 */
export enum EventTypes {
  ERROR = 'error',
  RESOURCESERROR = 'resourcesError',
  UNHANDLEDREJECTION = 'unhandledrejection',
  CLICK = 'click',
  LOAD = 'load',
  CUSTOM = 'custom',
  BEFOREUNLOAD = 'beforeunload',
  HASHCHANGE = 'hashchange',
  HISTORYPUSHSTATE = 'history-pushState',
  HISTORYREPLACESTATE = 'history-replaceState',
  POPSTATE = 'popstate',
}

// eventType
export enum ReportType {
  PV = 'pv', // 路由跳转
  EVENT = 'event', // 交互事件触发
  ERROR = 'error', // 报错捕获
  CUSTOM = 'custom', // 用在组件内用户主动进行上报
  PVDURATION = 'pv-duration', // 页面停留事件
};

/**
 * 网页的几种加载方式
 */
export const LOAD: Record<number, string> = {
  0: 'navigate', // 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
  1: 'reload', // 网页通过“重新加载”按钮或者location.reload()方法加载
  2: 'back_forward', // 网页通过“前进”或“后退”按钮加载
  255: 'reserved' // 任何其他来源的加载
}
