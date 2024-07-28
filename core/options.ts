import type { PageInfo } from '../types/index'
import { uuid, SDKVersion } from "../utils/index";

let appid:string = '';
let sendUrl: string = '';
 // 数据发送后的生命周期
export let afterSend: () => void = () => {};
export const initOptions = (id: string, url: string, fn?: () => void) => {
  appid = id;
  sendUrl = url;
  afterSend = fn || (() => {});
}

export class Options {
  public getPageInfo(): PageInfo {
    const { width, height } = window.screen;
    const { userAgent } = navigator;
    return {
      appid,
      appName: document.title,
      userAgent,
      uid: uuid(),
      sdk: SDKVersion,
      url: window.location.href,
      time: new Date().getTime(),
      screen: `${width}x${height}`,
    }
  }
  public getSendUrl = () => sendUrl;
}
