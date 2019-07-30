import { PlugC } from "./Event";
let pool:TapEvent[] = [];
export class TapEvent extends PlugC.Event {
    public clientX:number
    public clientY:number
    constructor(type:"tapBegin"|"tapEnd"|"tapCancel"|"tapMove",usecapture:boolean = false,clientX = 0,clientY = 0){
        super(type,usecapture);
        this.clientX = clientX;
        this.clientY = clientY;
    }
    public static create<T extends keyof TapEventMap>(type:TapEventMap[T],usecapture:boolean = false,clientX = 0,clientY = 0):TapEvent{
        let e = pool.pop() ;
        if(e){
            e.type = type;
            e.usecapture = usecapture;
            e.stopPro = false;
        }else e = new TapEvent(type,usecapture,clientX,clientY);
        return e;
    }
}

export interface TapEventMap{
    TAP_BEGIN:"tapBegin"
    TAP_END:"tapEnd"
    TAP_CANCEL:"tapCancel"
    TAP_MOVE:"tapMove"
}

