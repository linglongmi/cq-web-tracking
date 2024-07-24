export interface Options {
  reportUrl: string
  uid: string
}

export enum ReportType {
  PV = 'pv',
  EVENT = 'event',
  ERROR = 'error',
  // 用户主动上报，常用在组件内上报错误
  CUSTOM = 'custom',
  DURATION = 'duration',
};

export interface PageInfo {
  uid: string
  appName: string
  url: string
  time: number
  screen: string
  userAgent: string
}

export interface ReportData {
  data: any,
  type: ReportType,
  sdk: string,
}

export enum RouteType {
  PUSH = 'pushState',
  REPLACE = 'replaceState',
  HASH = 'hashchange'
}