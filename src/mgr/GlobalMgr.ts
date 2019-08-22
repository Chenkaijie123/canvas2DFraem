import { SourceMgr } from "../sourceModel/SourceMgr";
import EventDispatch from "../canvasDOM/event/EventDispatch";

export const sysEventDispatch = new EventDispatch();

export let resource:SourceMgr
//全局管理器
export class GlobalMgr{
    constructor(){
        this.init();
    }
    public init():void{
        resource = new SourceMgr();
    }
}