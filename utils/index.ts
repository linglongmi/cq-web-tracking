import { AnyFun } from '../types'
export const SDKVersion = '1.1.0';

/**
 * sendBeacon方式发送数据
 */
export function sendByBeacon(url: string, data: any) {
  return navigator.sendBeacon(url, JSON.stringify(data))
}


/**
 * image方式发送数据
 */
export const sendBeaconImgList: any[] = []
export function sendByImg(url: string, data: any): Promise<void> {
  return new Promise(resolve => {
    const img = new Image()
    img.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`
    sendBeaconImgList.push(img)
    img.onload = () => resolve()
    img.onerror = () => resolve()
  })
}

/**
 * xml方式发送数据
 */
export function sendByXML(url: string, data: any): Promise<void> {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open('post', url)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.send(JSON.stringify(data))
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) resolve()
    }
  })
}

/**
 * 判断对象大小是否超过指定kb大小
 * @param object 源对象
 * @param limit 最大kb
 */
export function isObjOverLimit(obj: object, limit: number): boolean {
  const serializedOb = JSON.stringify(obj)
  const Bytes = new TextEncoder().encode(serializedOb).length
  const KB = Bytes / 1024
  return KB > limit
}

/**
 * 补全字符
 * @param {*} num 初始值
 * @param {*} len 需要补全的位数
 * @param {*} placeholder 补全的值
 * @returns 补全后的值
 */
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

/**
 * 补全字符
 * @param {*} num 初始值
 * @param {*} len 需要补全的位数
 * @param {*} placeholder 补全的值
 * @returns 补全后的值
 */
export function pad(num: number, len: number, placeholder = '0') {
  const str = String(num)
  if (str.length < len) {
    let result = str
    for (let i = 0; i < len - str.length; i += 1) {
      result = placeholder + result
    }
    return result
  }
  return str
}


/**
 * 获取一个随机字符串
 */
export function uuid() {
  const date = new Date()

  // yyyy-MM-dd的16进制表示,7位数字
  const hexDate = parseInt(
    `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(
      date.getDate(),
      2
    )}`,
    10
  ).toString(16)

  // hh-mm-ss-ms的16进制表示，最大也是7位
  const hexTime = parseInt(
    `${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(
      date.getSeconds(),
      2
    )}${pad(date.getMilliseconds(), 3)}`,
    10
  ).toString(16)

  // 第8位数字表示后面的time字符串的长度
  let guid = hexDate + hexTime.length + hexTime

  // 补充随机数，补足32位的16进制数
  while (guid.length < 32) {
    guid += Math.floor(Math.random() * 16).toString(16)
  }

  // 分为三段，前两段包含时间戳信息
  return `${guid.slice(0, 8)}-${guid.slice(8, 16)}-${guid.slice(16)}`
}

/**
 * @param fn 真正执行的函数，
 * @param delay 时间间隔
 * @param [immediate=false] 每次开始时是否先立即执行一次
 * @param callback 处理真实函数返回值的回调函数
 * **/
export function debounce(fn: AnyFun, delay: number, immediate = false, callback: AnyFun) {
	let timer: NodeJS.Timeout | null = null;
	let isInvoke = false;
	const _debounce = function(this:any, ...args: any[]) {
		if (timer) clearTimeout(timer);
		if (immediate && !isInvoke) {
			const result = fn.apply(this, args);
			if (callback) callback(result);
			isInvoke = true;
		} else {
			timer = setTimeout(() => {
				const result = fn.apply(this, args);
				if (callback) callback(result);
				isInvoke = false;
				timer = null;
			}, delay)
		}
	}
	_debounce.cancel = function() {
		if (timer) clearTimeout(timer);
		timer = null;
		isInvoke = false;
	}
	return _debounce;
}

/**
 * @param fn 真正执行的函数
 * @param interval 时间间隔
 * @param [options={
 *  leading: true, // 是否开启每次头部执行
 *  trailing: false // 是否开启尾部执行
 * }] 
 * @param callback 处理真实函数返回值的回调函数
 * **/
export function throttle(fn: AnyFun, interval: number, options = { leading: true, trailing: false }, callback: AnyFun) {
	const { leading, trailing } = options;
	let lastTime: number = 0;
	let timer: NodeJS.Timeout | null = null;
	const _throttle = function(this:any,...args:any[]) {
		const nowTime = new Date().getTime();
		// 是否开启第一次执行
		if (!lastTime && !leading) lastTime = nowTime;
		
		const remainTime = interval - (nowTime - lastTime);
		if (remainTime <= 0) {	
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			const result = fn.apply(this, args);
			if (callback) callback(result);
			lastTime = nowTime;
			return;
		}
		if (trailing && !timer) {
			timer = setTimeout(() => {
				timer = null;
				lastTime = !leading ? 0 : new Date().getTime();
				const result = fn.apply(this, args);
				if (callback) callback(result);
			}, remainTime)
		}
	}
	_throttle.cancel = function() {
		if (timer) clearTimeout(timer);
		timer = null;
	}
	return _throttle;
}

/**
 * 判断是否是对象类型
 * @param originVal 源值
 * **/
export function isObject<T>(originVal:T) {
	const value = typeof originVal;
	return value !== null && (value === 'object' || value === 'function')
}

/**
 * 判断对象中是否包含该属性
 * @param key 键
 * @param object 对象
 * @returns 是否包含
 */
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}
type obj<T> = Extract<keyof T, string>;
type newObjT<T extends string | number | symbol> = {
  [key in T]: T | newObjT<T>;
};
/**
 * 深拷贝
 * @param originVal 需要拷贝的对象
 * @param [map=new WeakMap()] 记录初次拷贝的对象，将要拷贝的原始值和新值进行链接
 * **/
export function deepClone<T>(originVal: T, map = new WeakMap()) {
	if (typeof originVal === 'function') return originVal;
	
	if (!isObject(originVal)) return originVal;
	
	if (typeof originVal === 'symbol') return Symbol(originVal.description);
	
	if (originVal instanceof Set) return new Set([...originVal]);
	
	if (originVal instanceof Map) return new Map([...originVal]);
	
	if (map.has(originVal as WeakKey)) return map.get(originVal as WeakKey);
	
	const newObj: newObjT<any> = Array.isArray(originVal) ? [] : {};
	
	map.set(originVal as WeakKey, newObj);
	
	for (const key in originVal) {
    if (isValidKey(key, originVal as object)) {
      newObj[key] = deepClone<T>(originVal[key], map);
    }
	}
	
	const keys:symbol[] = Object.getOwnPropertySymbols(originVal);
	if (keys.length) {
		for (const key of keys) {
      // newObj[key.toString()] = deepClone<T>(originVal[key] as T, map);
		}
	}
	return newObj;
}
