import { SourceMgr } from "../sourceModel/SourceMgr";
import EventDispatch from "../canvasDOM/event/EventDispatch";
import Ticker from "./Ticker";
import Tween from "../tween/Tween";

export let sysEventDispatch :EventDispatch;

export let TickerIns:Ticker;
export let resource:SourceMgr
let TweenIns:Tween
//全局管理器
export class GlobalMgr{
    constructor(){
        this.init();
    }
    public init():void{
        sysEventDispatch = new EventDispatch();
        resource = new SourceMgr();
        TickerIns = new Ticker();
        TweenIns = new Tween()
    }
}