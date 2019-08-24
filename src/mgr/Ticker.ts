import FnHandle from "../DataStruct/Oberserve/FnHandle";
import { findFirstVoid } from "../canvasDOM/global/Global";

/**
 * 添加帧执行事假
 * 当添加的执行函数返回值为false时，该函数会移除出循环执行队列
 */
export default class Ticker {
    private _callMap: FnHandle[];
    private callMap: FnHandle[];
    constructor() {
        this._callMap = [];
        this.callMap = new Proxy(this._callMap, {
            deleteProperty(target, key) {
                target[key].release();
                delete target[key]
                return true
            }
        })
    }

    /**
     * 添加循环执行函数
     * 返回该函数在循环队列中的id
     * @param fn 
     * @returns number
     */
    public add(fn: FnHandle): number {
        if (this.has(fn)) return;
        let id = findFirstVoid(this.callMap);
        this.callMap[id] = fn;
        return id;
    }

    /**
     * 移除循环执行函数
     * @param target 
     */
    public remove(target: FnHandle | number): void {
        if (target instanceof FnHandle) {
            let id = this.callMap.indexOf(target);
            if (id >= 0) delete this.callMap[id];
        } else if (typeof target == "number") {
            if (target >= 0) delete this.callMap[target];
        } else {
            throw "the remove target is not a right value!";
        }
    }

    /**
     * @private
     */
    public run(t:number): void {
        let idx: number = 0;
        for (let i of this.callMap) {
            if (i && i.run(t) == false) delete this.callMap[idx];
            idx++;
        }
    }

    private has(fn: FnHandle): boolean {
        return this.callMap.indexOf(fn) >= 0;
    }
}

