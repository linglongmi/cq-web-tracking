import { wrap } from "../utils/index";
import { Options, AnyObj } from '../types/index';
import { ReportType, EventTypes } from './constant';
import { EventCollect } from './event';
import { initOptions } from './options'


export default class Tracking {
  [x: string]: any;
  private eventList = ['click', 'mouseover'];
  private duration = { startTime: 0, value: 0 };

  private event = new EventCollect();
  constructor(options: Options) {
    const afterSend = options.afterSend || (() => {});
    initOptions(options.appid, options.reportUrl, afterSend);

    window.history.pushState = wrap('pushState');
    window.history.replaceState = wrap('replaceState');
    // 初始化事件收集
    this.initEventHandler();
    // PV
    this.initPage();
    // 页面停留时间收集
    this.initPageDuration();
    // 异常数据收集
    this.initErrorInfo();
  }
  // 主动触发
  public customSend(data: AnyObj) {
    this.event.addEvent({
      reportType: ReportType.CUSTOM,
      eventType: EventTypes.CUSTOM,
      ...data,
    });
  }
  private initPage() {
    window.addEventListener('pushState', (e) => {
      this.event.addEvent({
        reportType: ReportType.PV,
        eventType: EventTypes.HISTORYPUSHSTATE
      });
    })

    window.addEventListener('replaceState', (e) => {
      this.event.addEvent({
        reportType: ReportType.PV,
        eventType: EventTypes.HISTORYREPLACESTATE
      });
    })
    // 单页面应用页面hash模式，hash值改变记录上报信息
    window.addEventListener('hashchange', (e) => {
      this.event.addEvent({
        reportType: ReportType.PV,
        eventType: EventTypes.HASHCHANGE
      });
    })
  }
  private initEventHandler() {
    // 事件数据收集
    this.eventList.forEach((event) => {
        window.addEventListener(event, (e) => {
            const target = e.target as HTMLElement;
            const reportKey = target.getAttribute('report-key');
            if (reportKey)  {
              this.event.addEvent({
                event, target,
                tagName: target.nodeName,
                tagText: target.innerText,
                reportType: ReportType.EVENT,
                eventType: EventTypes.CLICK,
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
      this.event.addEvent({
        reportType: ReportType.PVDURATION,
        eventType: EventTypes.BEFOREUNLOAD,
        duration: this.duration,
      });
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
    let self = this;
    window.onerror = function(event) {
      self.event.addEvent({
        event,
        reportType: ReportType.ERROR,
        eventType: EventTypes.RESOURCESERROR,
      });
    }
    // 监听promise抛出的错误
    window.addEventListener("unhandledrejection", (e) => {
      this.event.addEvent({
        reportType: ReportType.ERROR,
        eventType: EventTypes.UNHANDLEDREJECTION,
        msg: e.reason,
      });
    });
    // 监听静态资源报错
    window.addEventListener("error", (e) => {
      this.event.addEvent({
        reportType: ReportType.ERROR,
        eventType: EventTypes.ERROR,
        msg: e.message,
      });
    }, { capture: true });
  }
}