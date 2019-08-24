import TweenProxy from "./TweenProxy";
import { findFirstVoid } from "../canvasDOM/global/Global";
import EventDispatch from "../canvasDOM/event/EventDispatch";
import { sysEventDispatch } from "../mgr/GlobalMgr";
import { SysTem } from "../canvasDOM/global/PlugC";

export default class Tween{
    static TweenList:TweenProxy[] = [];
    constructor(){
        sysEventDispatch.addEventListener(SysTem.TWEEN_REMOVE,(e)=>{
            let index = Tween.TweenList.indexOf(e.data);
            if(index >= 0) delete Tween.TweenList[index];
        },this)
    }
    static get(o:any):TweenProxy{
        let t = TweenProxy.create().get(o);
        Tween.TweenList[findFirstVoid(Tween.TweenList)] = t;
        return t;
    }
}