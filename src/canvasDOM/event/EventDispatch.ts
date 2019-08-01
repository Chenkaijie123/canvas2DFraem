import { PlugC } from "./Event";
import { TapEvent, TapEventMap } from "./TouchEvent";
let id:number = 0;
export default class EventDispatch {
    /**只有内置点击事件才有冒泡和捕获 */
    private bubblingMap: { [key: string]: Array<[(e?: PlugC.Event) => any, any]> } = {};//冒泡阶段触发
    private captureMap: { [key: string]: Array<[(e?: PlugC.Event) => any, any]> } = {};//捕获阶段触发
    public eventCount:number = 0;
    public tapCount:number = 0;//当前对象监听的点击事件个数
    public hashCode:number
    constructor() {
        this.hashCode = id++;
     }
    public emit(type: string, useCapture = false,target:any = undefined,clientX :number= undefined,clientY:number = undefined):PlugC.Event{
        let map = useCapture ? this.captureMap[type] : this.bubblingMap[type];
        let e = this.createEvent(type,useCapture,clientX,clientY);
        e.currentTarget = this;
        e.target = target;
        if(map){
            let index = 0,item:[(e?: PlugC.Event) => any, any];
            while(item = map[index++]){
                item[0].call(item[1],e)
                if(e.stopPro) break;
            }
        }
        return e;
    }

    /**触发非内置点击事件的事件 */
    public dispatch(type:string,data?:any):void{
        let map = this.bubblingMap[type];
        if(!map) return;
        let e = PlugC.Event.create(type);
        let index = 0,item:[(e?: PlugC.Event) => any, any];
        e.currentTarget = this;
        e.data = data;
        while(item = map[index++]){
            item[0].call(item[1],e)
            if(e.stopPro) break;
        }
    
    }

    private createEvent(type: string, useCapture = false,clientX = 0,clientY = 0):PlugC.Event{
        let e:PlugC.Event;
        if(this.checkIsTapEvt(type)) e = TapEvent.create(type as "tapBegin" | "tapEnd" | "tapCancel" | "tapMove",useCapture,clientX,clientY)
        else e = PlugC.Event.create(type, useCapture);
        return e;
    }


    private checkIsTapEvt(type:string):boolean{
        return type == "tapBegin" || type == "tapEnd" || type == "tapCancel" || type == "tapMove";
    }

    public addEventListener(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false): void {
        if (this.hasEvent(type, fn, caller)) return;
        this.eventCount++;
        let map = this.bubblingMap;
        if (!map[type]) map[type] = [[fn, caller]];
        else map[type].push([fn, caller]);
        if(useCapture && this.checkIsTapEvt(type)){
            map = this.captureMap;
            if (!map[type]) map[type] = [[fn, caller]];
            else map[type].push([fn, caller]);
            this.tapCount++;
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
            if(this.checkIsTapEvt(type)) this.tapCount--;
        }
    }

    public once(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false):void{
        let func = (e: PlugC.Event)=>{
            fn(e);
            this.removeEventListener(type,func,caller,useCapture)
        }
        this.addEventListener(type,func,caller);
    }

    public on(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false): void { 
        this.addEventListener(type, fn, caller, useCapture)
    }

    public off(type: string, fn: (e?: PlugC.Event) => any, caller: any, useCapture: boolean = false): void { 
        this.removeEventListener(type, fn, caller, useCapture)
    }

    public removeAllEvent():void{
        let map = this.bubblingMap
        for(let key in map){
            delete map[key]
        }
        map = this.captureMap;
        for(let key in map){
            delete map[key]
        }
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