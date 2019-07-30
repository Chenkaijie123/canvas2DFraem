import { SourceMgr } from "../sourceModel/SourceMgr";

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