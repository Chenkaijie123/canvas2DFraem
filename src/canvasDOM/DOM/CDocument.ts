import CDOMContainer from "./CDOMContainer"
import { DOMBase } from "./DOMBase"
import Point from "../math/Point";
/**虚拟文本 */
export default class CDocument extends CDOMContainer {
    private reRenderDeep: number;//需要重新渲染的深度
    private canvas:HTMLCanvasElement 
    private context:CanvasRenderingContext2D;
    constructor() {
        super();
        this.parent = this;
    }

    private initCanvas():void{
        let canvas = document.createElement("canvas");
        this.canvas = canvas
        canvas.width = 1000;
        canvas.height = 600;
        document.body.appendChild(canvas);
        this.context = canvas.getContext("2d");
    }

    public init(): void {
        super.init();
        this.initCanvas();
        this.deep = 1;
    }

    private iterator<T>(loot:Array<DOMBase>,fn:(e:DOMBase)=>T):T[]{
        let res = [];
        for(let i:number = 0, e :any ;e = loot[i];i++){
            res.push(fn(e))
            if(e["children"]){
                res.push(...this.iterator(e["children"],fn));
            }
        }
        return res;
    }

    

    public getElementById(id: string): DOMBase {
        let loop = this.children;
        return (this.iterator<DOMBase>(loop,(e)=>{return e})[0])
    }

    public getElementsByClassName(id: string): DOMBase[] {
        return
    }

    //判断重新渲染深度
    public changeReRenderDeep(deep: number): void {
        this.reRenderDeep = this.reRenderDeep > deep ? deep : this.reRenderDeep;
    }

    //内部计算并且渲染
    public sysRender():void{
        //todo
        this.context.setTransform(1,0,0,1,0,0)
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        let loot = this.children;
        let fn = (e:DOMBase)=>{
            //重新计算需要重绘的数据
            if(e.reRender) {
                let style = e.style
                let p = Point.createPiont(style.x,style.y);
                p.add(e.parent.position);
                e.position.copy(p);
                p.release();
                e.matrix.setByStyle(style);//转换矩阵
                e.matrix.changeCoordinate(e.position,style.scaleX,style.scaleY);
                e.reRender = false;
            }
            e.render(this.context);
        }
        let t = Date.now()
        this.iterator(loot,fn);
        console.log(Date.now() - t)
    }
}