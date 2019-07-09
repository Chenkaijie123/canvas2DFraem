import Matrix from "./Matrix"
import {DOMStyleBase} from "../DOM/DOMBase"
const anglePI = Math.PI * 180;
function sin(r:number){
    let angle = r == 0?0:anglePI / r
    return Math.sin(angle);
}

function cos(r:number){
    let angle = r == 0?0:anglePI / r
    return Math.cos(angle);
}

function tan(r:number){
    let angle = r == 0?0:anglePI / r
    return Math.tan(angle);
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
let pool:Array<TransformMatrix> = []
export default class TransformMatrix extends Matrix{
    public scaleX:number
    public scaleY:number
    public skewX:number
    public skewY:number
    public offsetX:number
    public offsetY:number
    private constructor(scaleX = 1,skewX = 0,skewY = 0,scaleY = 1,offsetX = 0,offsetY = 0){
        super(scaleX,skewX,skewY,scaleY,offsetX,offsetY);
    }
    public setTransformMatrix(scaleX:number,scaleY:number,skewX:number,skewY:number,offsetX:number,offsetY:number):void{
        this.setMatrix(scaleX,skewX,skewY,scaleY,offsetX,offsetY);
    }

    public setByStyle(style:DOMStyleBase):void{
        this.translate(style.x + style.anchorX,style.y + style.anchorY)
            .scale(style.scaleX,style.scaleY)
            .rotate(style.rotate)
            .skew(style.skewX,style.skewY)
    }

    public value():[number,number,number,number,number,number]{
        return this.data;
    }

    /**
     * 旋转
     * @param r 弧度
     */
    public rotate(r:number):this{
        var c = cos(r),
            s = sin(r),
            mx = this.data,
            a = mx[0] * c + mx[2] * s,
            b = mx[1] * c + mx[3] * s,
            c = -mx[0] * s + mx[2] * c,
            d = -mx[1] * s + mx[3] * c;
            mx[0] = a;
            mx[1] = b;
            mx[2] = c;
            mx[3] = d;
        return this;
    }

    public skew(x:number,y:number):this{
        var tanX=tan(x),
        tanY=tan(y),
        mx = this.data,
        mx0=mx[0],
        mx1=mx[1];
        mx[0] += tanY*mx[2]; 
        mx[1] += tanY*mx[3]; 
        mx[2] += tanX*mx0; 
        mx[3] += tanX*mx1;
        return this;
    }

    public translate(x:number,y:number):this{
        let mx = this.data;
        mx[4] += mx[0] * x + mx[2] * y;
        mx[5] += mx[1] * x + mx[3] * y;
        return this;
    }

    public scale(x:number,y:number):this{
        var mx = this.data;
        mx[0] *= x;
        mx[1] *= x;
        mx[2] *= y;
        mx[3] *= y;
        return this;
    }

    public static createTransFormMatrix(scaleX = 1,skewX = 0,skewY = 0,scaleY = 1,offsetX = 0,offsetY = 0):TransformMatrix{
        let Matrix :TransformMatrix= pool.pop() || new TransformMatrix();
        Matrix.setTransformMatrix(scaleX,skewX,skewY,scaleY,offsetX,offsetY);
        return Matrix;
    }

}