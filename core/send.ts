import { isObjOverLimit, sendByXML, sendByBeacon, sendByImg } from "../utils/index";
import { AnyObj } from '../types/index';
import { Options, afterSend } from './options'
import { clearEvents } from './event';

export default class SendData {
  private eventList: AnyObj[] = []
  private timer:NodeJS.Timeout | number | undefined

  // 选择合适的请求发送方式
  private send() {
    if (!this.eventList.length) return;
    return new Promise((resolve, reject) => {
      let sendType = undefined;
      const baseInfo = new Options();
      if (isObjOverLimit(this.eventList, 60)) sendType = 'xml';
      else if(!isObjOverLimit(this.eventList, 60) && navigator) sendType = 'sendBeacon';
      else sendType = isObjOverLimit(this.eventList, 2) ? 'xml': 'img';

      const sendData = { eventInfo:this.eventList, baseInfo: baseInfo.getPageInfo() };
      const sendUrl = baseInfo.getSendUrl();
      switch(sendType) {
        case 'xml':
          sendByXML(sendUrl, sendData).then(() => resolve({ sendType, success: true }));
          break;
        case 'sendBeacon':
          resolve({ sendType, success: sendByBeacon(sendUrl, sendData) });
          break;
        case 'img':
          sendByImg(sendUrl, sendData).then(() => resolve({ sendType, success: true }));
          break;
      }
    })
  }
  // 将需要发送的请求进行合并处理
  public emit(events: AnyObj[], isImmediate = false) {
    if (!events.length) return;
    this.eventList = events;
    if (this.timer) clearTimeout(this.timer);
    if (this.eventList.length >= 5 || isImmediate) {
      this.send()?.then(() => {
        clearEvents();
        this.eventList = [];
        afterSend();
      });
    } else {
      const fun = this.send.bind(this);
      this.timer = setTimeout(() => {
        fun()?.then(() => {
          clearEvents();
          this.eventList = [];
          afterSend();
        })
      }, 5000);
    }
  }
}