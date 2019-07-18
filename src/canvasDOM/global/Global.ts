/**
 * 防抖，延迟一段时间后调用一次
 * @param fn 执行函数
 * @param timeout 第一次调用后延迟时间
 * @param callObj 调用对象
 * @param args 函数参数
 */
let debounceArr:Array<Function> = [];
export function debounce(fn:Function,timeout:number,callObj:any,...args:any[]):void{
    let index = debounceArr.indexOf(fn);
    if(index >= 0) return;
    index = findFirstVoid(debounceArr);
    debounceArr[index] = fn;
    setTimeout(() => {
        fn.call(callObj,...args);
        delete debounceArr[index];
    }, timeout);
}

/**
 * 防抖，立即调用一次（在规定的时间内只调用一次）
 * @param fn 执行函数
 * @param timeout 延迟时间
 * @param callObj 调用对象
 * @param args 函数参数
 */
let throttleArr:Array<Function> = [];
export function throttle(fn:Function,timeout:number,callObj:any,...args:any[]):void{
    let index = throttleArr.indexOf(fn);
    if(index >= 0) return;
    index = findFirstVoid(throttleArr);
    throttleArr[index] = fn;
    fn.call(callObj,...args);
    setTimeout(()=>{
        delete throttleArr[index];
    },timeout);
}

/**
 * 获取数组第一个空的或者值为false或者0的下标
 * @param arr 检查数组
 */
export function findFirstVoid(arr:any[]):number{
    let index = 0;
    while (arr[index++]);
    return --index;
}