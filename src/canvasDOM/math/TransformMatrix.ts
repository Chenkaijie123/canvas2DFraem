import Matrix from "./Matrix"
import { DOMStyleBase } from "../DOM/DOMBase"
const anglePI = Math.PI / 180;
function sin(r: number) {
    // let angle = r == 0 ? 0 : r / anglePI
    return Math.sin(r);
}

function cos(r: number) {
    // let angle = r == 0 ? 0 : r / anglePI
    return Math.cos(r);
}

function tan(r: number) {
    // let angle = r == 0 ? 0 : r / anglePI
    return Math.tan(r);
}
/**
 * 装换矩阵
 * a 水平缩放绘图
 * b 水平倾斜绘图
 * c 垂直倾斜绘图
 * d 垂直缩放绘图
 * e 水平移动绘图
 * f 垂直移动绘图
 */
let pool: Array<TransformMatrix> = []
export default class TransformMatrix extends Matrix {
    public scaleX: number
    public scaleY: number
    public skewX: number
    public skewY: number
    public offsetX: number
    public offsetY: number
    private constructor(scaleX = 1, skewX = 0, skewY = 0, scaleY = 1, offsetX = 0, offsetY = 0) {
        super(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
    }
    public setTransformMatrix(scaleX: number, skewX: number, skewY: number, scaleY: number, offsetX: number, offsetY: number): void {
        this.setMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
    }

    public setByStyle(style: DOMStyleBase): void {
        let { rotate, scaleX, scaleY, anchorX, anchorY, x, y, width, height } = style;
        let rotateC = cos(rotate);
        let rotateS = sin(rotate);
        let tx = (x + anchorX) * scaleX;
        let ty = (y + anchorY) * scaleY;
        let a = rotateC * scaleX;
        let b = rotateS * scaleX;
        let c = -rotateS*scaleY;
        let d = rotateC * scaleY;
        this.setMatrix(a,b,c,d,tx,ty);
    }

    public value(): [number, number, number, number, number, number] {
        return this.data;
    }

    /**
     * 旋转
     * @param r 弧度
     */
    // public rotate(r:number):this{
    //     var co = cos(r),
    //     si = sin(r),
    //     mx = this.data,
    //     a = mx[0] * co + mx[2] * si,
    //     b = mx[1] * co + mx[3] * si,
    //     c = -mx[0] * si + mx[2] * co,
    //     d = -mx[1] * si + mx[3] * co;
    //     mx[0] = a;
    //     mx[1] = b;
    //     mx[2] = c;
    //     mx[3] = d;
    //     return this;
    // }

    // public skew(x:number,y:number):this{
    //     var tanX=tan(x),
    //     tanY=tan(y),
    //     mx = this.data,
    //     mx0=mx[0],
    //     mx1=mx[1];
    //     mx[0] += tanY*mx[2]; 
    //     mx[1] += tanY*mx[3]; 
    //     mx[2] += tanX*mx0; 
    //     mx[3] += tanX*mx1;
    //     return this;
    // }

    // public translate(x:number,y:number):this{
    //     let mx = this.data;
    //     mx[4] += x;
    //     mx[5] += y;
    //     return this;
    // }

    // public scale(x:number,y:number):this{
    //     var mx = this.data;
    //     if(x != 1){
    //         mx[0] *= x;
    //         mx[2] *= x;
    //         mx[4] *= x;
    //     }
    //     if(y != 1){
    //         mx[1] *= y;
    //         mx[3] *= y;
    //         mx[5] *= y;
    //     }
    //     return this;
    // }

    public static createTransFormMatrix(scaleX = 1, skewX = 0, skewY = 0, scaleY = 1, offsetX = 0, offsetY = 0): TransformMatrix {
        let Matrix: TransformMatrix = pool.pop() || new TransformMatrix();
        Matrix.setTransformMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
        return Matrix;
    }

}