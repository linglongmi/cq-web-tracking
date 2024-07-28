import { AnyObj, EventT } from '../types/index';
import { uuid } from "../utils/index";
import SendData from './send';

let events: EventT[] = [];
export class EventCollect {
  private send = new SendData();
  public addEvent(data: AnyObj) {
    const { eventType } = data;
    events.push({
      type: eventType,
      eventId: uuid(),
      callback: (e) => {
        console.log(e);
      },
      ...data,
    })
    this.send.emit(events);
  }
}

export const clearEvents = () => events = [];