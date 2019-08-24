import { CubicBezierIns, CubicBezierType, PointOnCubicBezier } from "./CubicBezier";
import FnHandle from "../DataStruct/Oberserve/FnHandle";
import { TickerIns, sysEventDispatch } from "../mgr/GlobalMgr";
import { SysTem } from "../canvasDOM/global/PlugC";

let pool :TweenProxy[] = [];
export default class TweenProxy{
    public target:any;//渐变对象
    // public influence:(t:number) => number;//影响函数
    private start:number//开始时间戳
    private end:number
    private prevent:boolean = false;
    public get(target:any):this{
        this.target = target;
        return this;
    }

    public to<k extends keyof CubicBezierType>(props:{[key:string]:number},time:number,type:CubicBezierType[k]):this{
        for(let k in props){
            let start = this.target[k];
            let end = props[k];
            let args = CubicBezierIns.getBezierargument(start,end,time,type);
            let fn = FnHandle.create((t:number)=>{
                if(this.start == void 0) {
                    this.start = t;
                    this.end = t + time;
                }
                let p = PointOnCubicBezier(args,t);

                if(this.prevent || t >= this.end){
                    this.release();
                    return false;
                }
                this.target[k] = p.y;
                return true;
            },this)
            TickerIns.add(fn);
        }
        return this;
    }

    public stop():void{
        this.prevent = true;
    }

    public release():void{
        this.prevent = false;
        this.target = this.start = this.end = void 0;
        sysEventDispatch.dispatch(SysTem.TWEEN_REMOVE,this);
        pool.push(this);
    }

    static create():TweenProxy{
        return pool.pop() || new TweenProxy();
    }
}