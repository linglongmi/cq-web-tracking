import { EventTypes } from '../core/constant'

export interface Options {
  reportUrl: string
  appid: string
  afterSend?:() => void
}

export interface PageInfo {
  userAgent: string
  uid: string
  appid: string
  appName: string
  sdk: string,
  url: string
  time: number
  screen: string
}

export interface EventT {
  data?: any,
  type: EventTypes,
  eventId: string,
  callback?: (e: Event) => void
}

export type AnyObj<T = any> = {
  [key: string]: T
}

export type AnyFun = (...args: any[]) => any;