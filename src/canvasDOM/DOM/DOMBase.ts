
/**
 * 基础DOM
 */
export abstract class DOMBase {
    public type:string
    public style:DOMStyleBase
    public className:string
    public id:string
    public parent:DOMContainer
    private listenerMap:{[key:string]:[Function,any][]}
    public reRender:boolean;//重绘标志
    protected proxy:DOMStyleBase
    protected deep:number
    //留下的扩展接口
    protected proxyHandle:Function = <k extends keyof DOMStyleBase>(target:DOMStyleBase,key:k,newData:DOMStyleBase[k],proxy:DOMStyleBase)=>{}
    constructor(){
        this.init();
        this.proxy = new Proxy(this.style,{
            set<k extends keyof DOMStyleBase>(target:DOMStyleBase,key:k,newData:DOMStyleBase[k],proxy:DOMStyleBase):any{
                if(target[key] != newData){
                    target[key] = newData;
                    if(!this.reRender) this.reRender = true;
                    this.proxyHandle(target,key,newData,proxy);
                }
            }
        })
        
    }
    public appendTo(parent:DOMContainer):this{
        parent.appendChild(this);
        return this;
    }
    public removeSelf():this{
        if(this.parent){
            this.parent.removeChild(this);
            return this;
        }
    }

    public once(type:string,listener:Function,caller:any):void{
        function fn(){
            listener.call(caller);
            this.removeEventListener(type,fn,caller);
        }
        this.addEventListener(type,fn,caller);
    }

    public addEventListener(type:string,listener:Function,caller:any):void{
        if(!this.hasEvent(type,listener,caller)){
            if(!this.listenerMap[type])this.listenerMap[type] = [];
            this.listenerMap[type].push([listener,caller])
        }
    }
    public removeEventListener(type:string ,listener:Function,caller:any):void{
        this.hasEvent(type,listener,caller,true)
    }

    private hasEvent(type:string,listener:Function,caller:any,remove:boolean = false):boolean{
        let map = this.listenerMap[type];
        let idx:number = 0;
        for(let i of map){
            if(i[0] == listener && i[1] == caller) {
                if(remove) map.splice(idx,1)
                return true
            }
            idx++
        }
        return false
    }

    public emit(type:string):void{
        let map = this.listenerMap[type];
        for(let i of map){
            i[0].call(i[1]);
        }
    }

    //判断是否重绘
    public checkReRender():boolean{
        return this.reRender = true;
    }

    protected init():void{
        this.style = {
            x:0,
            y:0,
            scaleX:1,
            scaleY:1,
            visible:true,
            alpha:1,
            width:0,
            height:0,
        }
        this.reRender = true;
        this.listenerMap = {};
    }

    protected reset():void{

    }
}

interface DOMType{
    CDocument:string
    DOMBase:string
    CImage:string
}


export interface DOMStyleBase{
    x:number
    y:number
    scaleX:number
    scaleY:number
    visible:boolean
    alpha:number
    width:number
    height:number
}

// interface DOMStyleBaseKeyOf{
//     "x":number
//     "y":number
//     "scaleX":number
//     "scaleY":number
//     "visible":boolean
//     "alpha":number
//     "width":number
//     "height":number
// }

/**可以添加其上的DOM节点 */
export interface DOMContainer extends DOMBase{
    parent:DOMContainer
    children:DOMBase[]
    appendChild(child:DOMBase):this
    removeChild(child:DOMBase):this
}