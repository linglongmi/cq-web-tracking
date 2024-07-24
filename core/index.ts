import { wrap, SDKVersion } from "../utils/index";
import { Options, ReportType, ReportData, RouteType, PageInfo } from '../types/index';

export default class Tracking {
  private reportUrl = '';
  private uid = '';
  private eventList = ['click', 'dblclick'];
  private duration = {
    startTime: 0,
    value: 0,
  }
  constructor(options: Options) {
    window.history.pushState = wrap('pushState');
    window.history.replaceState = wrap('replaceState');
    this.reportUrl = options.reportUrl || '';
    this.uid = options.uid || '';
    // 初始化事件收集
    this.initEventHandler();
    // PV
    this.initPage();
    // 页面停留时间收集
    this.initPageDuration();
    // 异常数据收集
    this.initErrorInfo();
  }
  private initPage() {
    window.addEventListener('pushState', (e) => {
      this.reportInfo(ReportType.PV, { type: RouteType.PUSH, referrer: document.location.href })
    })

    window.addEventListener('replaceState', (e) => {
      this.reportInfo(ReportType.PV, { type: RouteType.REPLACE, referrer: document.location.href })
    })
    // 单页面应用页面hash模式，hash值改变记录上报信息
    window.addEventListener('hashchange', (e) => {
      this.reportInfo(ReportType.PV, { type: RouteType.HASH, referrer: document.location.href })
    })
  }
  private initEventHandler() {
    // 事件数据收集
    this.eventList.forEach((event) => {
        window.addEventListener(event, (e) => {
            const target = e.target as HTMLElement;
            const reportKey = target.getAttribute('report-key');
            if (reportKey)  {
              this.reportInfo(ReportType.EVENT, {
                tagName: target.nodeName,
                tagText: target.innerText,
                event,
              });
            }
        })
    })
  }
  private initPageDuration() {
    const initDuration = (): void => {
      const currentTime = new Date().getTime();
      this.duration.value = currentTime - this.duration.startTime;
      // 信息上报
      this.reportInfo(ReportType.DURATION, this.duration);
      this.duration = { startTime: currentTime, value: 0 };
    }
    window.addEventListener('load', () => {
      const time = new Date().getTime();
      this.duration.startTime = time;
    })
    window.addEventListener('pushState', initDuration)
    window.addEventListener('replaceState', initDuration)
    window.addEventListener('popState', initDuration)
    window.addEventListener('beforeunload', initDuration)
  }
  private initErrorInfo() {
    // 监听一般的语法错误或者运行错误
    window.addEventListener("error", (e) => {
      this.reportInfo(ReportType.ERROR, { msg: e.message });
    });
    // 监听promise抛出的错误
    window.addEventListener("unhandledrejection", (e) => {
      this.reportInfo(ReportType.ERROR, { msg: e.reason });
    });
  }
  private getPageInfo(): PageInfo {
    const { width, height } = window.screen;
    const { userAgent } = navigator;
    return {
      uid: this.uid,
      appName: document.title,
      url: window.location.href,
      time: new Date().getTime(),
      userAgent,
      screen: `${width}x${height}`,
    }
  }
  report(data: any) {
    this.reportInfo(ReportType.CUSTOM, data);
  }
  // 数据上报
  private reportInfo(type:ReportType, data: any) {
    const reportData: ReportData = {
      ...this.getPageInfo(),
      data, type, sdk: SDKVersion,
    }
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.reportUrl, JSON.stringify(reportData));
    } else {
      const image = new Image();
      const currentTime = new Date().getTime();
      image.src = `${this.reportUrl}?params=${JSON.stringify(reportData)}&t=${currentTime}`
    }
  }
}