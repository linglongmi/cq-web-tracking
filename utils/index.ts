export const SDKVersion = '1.1.0';
export const wrap = <T extends keyof History>(event: T) => {
  const fun = history[event];
  return function(this:any) {
    const res = fun.apply(this, arguments);
    const e = new Event(event);
    window.dispatchEvent(e);
    return res;
  }
}


// export const objectCreate = (oldObj:any) => {
//   function Fun() {}
//   Fun.prototype = oldObj;
//   return new Fun();
// }