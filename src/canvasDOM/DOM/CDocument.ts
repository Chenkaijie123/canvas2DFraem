import CDOMContainer from "./CDOMContainer"
import { DOMBase } from "./DOMBase"
/**虚拟文本 */
export default class CDocument extends CDOMContainer {
    private reRenderDeep: number;//需要重新渲染的深度
    constructor() {
        super();
        this.parent = this;
    }

    public init(): void {
        super.init();
        this.deep = 1;
    }

    private iterator<T>(loop:Array<DOMBase>,fn:(e:DOMBase)=>T):T[]{
        let res = [];
        for(let i:number = 0, e :any ;e = loop[i];i++){
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
}