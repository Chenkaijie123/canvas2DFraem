import TransformMatrix from "../math/TransformMatrix";
import Point from "../math/Point";
import EventDispatch from "../event/EventDispatch";
import Box from "../math/Box";
import { SysTem } from "../global/PlugC";

/**
 * 基础DOM
 */
let hashCode: number = 0;
export abstract class DOMBase extends EventDispatch{
    //是否完成，包括图片的加载
    public complete:boolean
    public type: string
    public _style: DOMStyleBase
    public className: string
    public id: string
    public parent: DOMContainer

    public reRender: boolean;//重绘标志
    protected proxy: DOMStyleBase
    protected deep: number
    public matrix: TransformMatrix
    public hashCode: number
    public get style() {
        return this.proxy;
    }
    public set style(v) {
        this._style = v;
    }
    //留下的扩展接口
    protected proxyHandle: Function = <k extends keyof DOMStyleBase>(target: DOMStyleBase, key: k, newData: DOMStyleBase[k], proxy: DOMStyleBase) => { }
    constructor() {
        super();
        this.hashCode = hashCode++
        this.init();
        let self = this;
        this.proxy = new Proxy(this._style, {
            set<k extends keyof DOMStyleBase>(target: DOMStyleBase, key: k, newData: DOMStyleBase[k], proxy: DOMStyleBase): any {
                if (target[key] != newData) {
                    target[key] = newData;
                    if (!self.reRender) self.reRender = true;
                    if(key == "width" || key == "height" || key == "scaleX" || key == "scaleY") self.onResize();
                    self.proxyHandle(target, key, newData, proxy);

                }
                return true
            }
        })

    }


    public appendTo(parent: DOMContainer): this {
        parent.appendChild(this);
        return this;
    }
    public removeSelf(): this {
        if (this.parent) {
            this.parent.removeChild(this);
            return this;
        }
    }



    //判断是否重绘
    public checkReRender(): boolean {
        return this.reRender = true;
    }

    protected init(): void {
        this.style = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            visible: true,
            alpha: 1,
            width: 0,
            height: 0,
            anchorX: 0,
            anchorY: 0,
            rotate: 0,
            skewX: 0,
            skewY: 0,
            scrollerX:0,
            scrollerY:0,
            scrollerWidth:0,
            scrollerheight:0,
            clip:null
        }
        this.reRender = true;
        this.complete = false;
        this.matrix = TransformMatrix.createTransFormMatrix();
    }

    protected reset(): void {

    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.dispatch(SysTem.RENDER);
     }

    /**
     * 把处于当前坐标系的point点装换为全局的坐标
     * @param point 
     */
    public toGlobal(point: Point): Point {
        let matrix = this.getMatrixMul();
        matrix.invertMartix();
        matrix.transFormPoint(point);
        matrix.release();
        return point;
    }



    public contain(_x: number, _y: number): boolean {
        let { width, height } = this.style
        return _x >= 0 && width >= _x && _y >= 0 && height >= _y
    }

    /**
     * 获取该对象当前的转化矩阵
     */
    public getMatrixMul(): TransformMatrix {
        let temp: TransformMatrix[] = [this.matrix]
        let t: DOMBase = this;
        while (t.parent) {
            t = t.parent;
            if (t.reRender) {
                t.matrix.setByStyle(t.style);//转换矩阵
                t.reRender = false;
            }
            temp.push(t.matrix)
        }
        let matrix = temp.pop().clone();
        let m: TransformMatrix;
        while (m = temp.pop()) {
            matrix.MatrixMulti(m)
        }
        return matrix;
    }

    //大小改变要执行的操作
    protected onResize():void{}
}



export interface DOMStyleBase {
    x: number
    y: number
    scaleX: number
    scaleY: number
    visible: boolean
    alpha: number
    width: number
    height: number
    anchorX: number
    anchorY: number
    rotate: number
    skewX: number
    skewY: number
    scrollerX:number//滚动实现
    scrollerY:number//滚动实现
    scrollerWidth:number
    scrollerheight:number
    clip:Box
}

/**可以添加其上的DOM节点 */
export interface DOMContainer extends DOMBase {
    parent: DOMContainer
    children: DOMBase[]
    appendChild(child: DOMBase): this
    removeChild(child: DOMBase): this
}