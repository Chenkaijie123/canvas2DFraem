import CDOMContainer from "./CDOMContainer"
import { DOMBase } from "./DOMBase"
import DOMEvent from "../event/DOMEvent";
/**虚拟文本 */
export default class CDocument extends CDOMContainer {
    private reRenderDeep: number;//需要重新渲染的深度
    public canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D;
    constructor() {
        super();
        this.parent = null;
    }

    private initCanvas(): void {
        let canvas = document.createElement("canvas");
        this.canvas = canvas
        canvas.width = 1000;
        canvas.height = 600;
        canvas.id = "canvas"
        new DOMEvent(this);
        document.body.appendChild(canvas);
        this.context = canvas.getContext("2d");
    }

    public init(): void {
        super.init();
        this.initCanvas();
        this.deep = 1;
    }

    public iterator<T>(loot: Array<DOMBase>, fn: (e: DOMBase) => T): T[] {
        let res = [];
        for (let i: number = 0, e: any; e = loot[i]; i++) {
            res.push(fn(e))
            if (e["children"]) {
                res.push(...this.iterator(e["children"], fn));
            }
        }
        return res;
    }



    public getElementById(id: string): DOMBase {
        let loop = this.children;
        return (this.iterator<DOMBase>(loop, (e) => { return e })[0])
    }

    public getElementsByClassName(id: string): DOMBase[] {
        return
    }

    //判断重新渲染深度
    public changeReRenderDeep(deep: number): void {
        this.reRenderDeep = this.reRenderDeep > deep ? deep : this.reRenderDeep;
    }

    //内部计算并且渲染
    public sysRender(): void {
        //todo
        this.context.setTransform(1, 0, 0, 1, 0, 0)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        let loot = this.children;
        let fn = (e: DOMBase) => {
            //重新计算需要重绘的数据
            if (e.reRender) {
                let style = e.style
                e.matrix.setByStyle(style);//转换矩阵
                e.reRender = false;
            }
            if (e.parent instanceof CDocument) {
                this.context.setTransform(...e.matrix.value());
            } else {
                this.context.transform(...e.matrix.value());
            }
            e.render(this.context);
        }
        // let t = Date.now()
        this.iterator(loot, fn);
        // console.log(Date.now() - t)
    }

    public renderElement():void{
        let ctx = this.context;
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.renderList( this.children)
    }

    public renderList(nodes: DOMBase[]): void {
        let ctx = this.context;
        for (let i of nodes) {
            if (i.reRender) {
                let style = i.style
                i.matrix.setByStyle(style);//转换矩阵
                i.reRender = false;
            }
            if (!i.style.visible || !i.style.alpha || i.matrix.a == 0 && i.matrix.b == 0 || i.matrix.c == 0 && i.matrix.d == 0) continue;
            if (i.parent instanceof CDocument) {
                ctx.setTransform.apply(ctx,i.matrix.value())
            } else {
                ctx.transform.apply(ctx,i.matrix.value())
            }
            if (i.style.clip) {
                let clip = i.style.clip
                if (clip.width <= 0 || clip.height <= 0) continue;
                ctx.save();
                ctx.beginPath();
                ctx.rect(clip.x,clip.y,clip.width,clip.height);
                ctx.clip();
                i.render(ctx);
                if(i["children"]){
                    this.renderList(i["children"])
                }
                ctx.restore();
            }else{
                i.render(ctx);
                if(i["children"]){
                    this.renderList(i["children"])
                }
            }
        }
    }
}