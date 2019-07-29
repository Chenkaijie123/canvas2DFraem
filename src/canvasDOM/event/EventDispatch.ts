import { PlugC } from "./Event";

export default class EventDispatch {
    private bubblingMap: { [key: string]: Array<[(e?: PlugC.Event) => any, any]> } = {};//冒泡阶段触发
    private captureMap: { [key: string]: Array<[(e?: PlugC.Event) => any, any]> } = {};//捕获阶段触发
    public eventCount:number = 0;
    constructor() { }
    public emit(type: string, useCapture = false,target:any = undefined):PlugC.Event{
        let map = useCapture ? this.captureMap[type] : this.bubblingMap[type];
        let e = PlugC.Event.create(type, useCapture);
        e.target = target;
        if(map){
            let index = 0,item:[(e?: PlugC.Event) => any, any];
            while(item = map[index++]){
                e.currentTarget = this;
                item[0].call(item[1],e)
                if(e.stopPro) break;
            }
        }
        return e;
    }

    public addEventListener(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false): void {
        if (this.hasEvent(type, fn, caller)) return;
        this.eventCount++;
        let map = this.bubblingMap;
        if (!map[type]) map[type] = [[fn, caller]];
        else map[type].push([fn, caller]);
        if(useCapture){
            map = this.captureMap;
            if (!map[type]) map[type] = [[fn, caller]];
            else map[type].push([fn, caller]);
        }
    }

    public removeEventListener(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false): void {
        let index = this.indexOfEvent(fn,caller,this.bubblingMap[type]);
        if(index != -1){
            this.bubblingMap[type].splice(index,1);
            this.eventCount--;
        }
        index = this.indexOfEvent(fn,caller,this.captureMap[type]);
        if(index != -1){
            this.captureMap[type].splice(index,1);
        }
    }

    public on(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false): void { 
        this.addEventListener(type, fn, caller, useCapture)
    }

    public off(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false): void { 
        this.removeEventListener(type, fn, caller, useCapture)
    }

    /**
     * 判断是否有监听目标事件
     * @param type 事件标识符
     * @param fn 监听函数
     * @param caller 调用者
     */
    public hasEvent(type: string, fn: (e?: PlugC.Event) => any, caller: any): boolean {
        let index = this.indexOfEvent(fn,caller,this.bubblingMap[type]);
        return index != -1;
    }

    private indexOfEvent(fn: (e?: PlugC.Event) => any, caller: any,list:Array<[(e?: PlugC.Event) => any, any]>):number{
        if(!list || !list.length) return -1;
        for(let item :[(e?: PlugC.Event) => any, any],index = 0;item = list[index];index++){
            if(item[0] == fn && item[1] == caller) return index;
        }
        return -1;
    }
}