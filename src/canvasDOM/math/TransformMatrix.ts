import Matrix from "./Matrix"
import { DOMStyleBase } from "../DOM/DOMBase"
import Point from "./Point";
const anglePI = Math.PI / 180;
function sin(r: number) {
    let angle = r == 0 ? 0 : r * anglePI
    return Math.sin(angle);
}

function cos(r: number) {
    let angle = r == 0 ? 0 : r * anglePI
    return Math.cos(angle);
}

function tan(r: number) {
    let angle = r == 0 ? 0 : r * anglePI
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
        let { rotate, scaleX, scaleY, anchorX, anchorY, x, y ,width,height} = style;
        let rotateC = cos(rotate);
        let rotateS = sin(rotate);
        let tx = x*scaleX;
        let ty = y*scaleY;
        let a = rotateC * scaleX;
        let b = rotateS * scaleX;
        let c = -rotateS * scaleY;
        let d = rotateC * scaleY;
        //锚点实现，设置锚点不影响x,y位置，只是固定相对于显示对象（0，0）点，用于旋转
        if(anchorX != 0 || anchorY != 0){
            let ancX = anchorX;
            let ancY = anchorY;
            let sx = ancX * a + c * ancY + tx//不设锚点会移动到的位置
            let sy = ancX * b + d * ancY + ty
            tx = tx + tx - (sx - ancX * scaleX) 
            ty = ty + ty - (sy - ancY * scaleY)
        }
        this.setMatrix(a, b, c, d, tx, ty);




        //---------------------------------利用矩阵叠加实现-----------------------------------------
        // let matrix = this.translateMatrix(x - anchorX,y - anchorY);
        // if(rotate != 0) matrix.MatrixMulti(this.rotateMatrix(rotate));
        // if(scaleX != 1 || scaleY != 1) matrix.MatrixMulti(this.scaleMatrix(scaleX,scaleY));
        // this.setMatrix(...matrix.value());
    }

    /**
     * 矩阵乘法，物理意义，实现物体的矩阵的叠加变换
     * 直接改变当前矩阵
     * @param target 叠加的矩阵
     */
    public MatrixMulti(target: Matrix): this {
        let [a2, b2, c2, d2, e2, f2] = [
            this.a * target.a + this.c * target.b,
            this.b * target.a + this.d * target.b,
            this.a * target.c + this.c * target.d,
            this.b * target.c + this.d * target.d,
            this.a * target.e + this.c * target.f + this.e,
            this.b * target.e + this.d * target.f + this.f
        ]
        this.setMatrix(a2, b2, c2, d2, e2, f2)
        return this;
    }

    //转换坐标系
    public changeCoordinate(point: Point, scaleX: number = 1, scaleY: number = 1): void {
        this.data[4] += point.x * scaleX;
        this.data[5] += point.y * scaleY;
    }

    public value(): [number, number, number, number, number, number] {
        return this.data;
    }

    public rotateMatrix(angle: number): TransformMatrix {
        angle = +angle;
        let [s, c] = angle !== 0 ? [cos(angle), sin(angle)] : [0, 1];
        let matrix = TransformMatrix.createTransFormMatrix(c, s, -s, c, 0, 0);
        return matrix;
    }

    public scaleMatrix(sx:number,sy:number):TransformMatrix{
        let matrix = TransformMatrix.createTransFormMatrix(sx, 0,0, sy, 0, 0);
        return matrix;
    }



    public translateMatrix(dx: number, dy: number): TransformMatrix {
        let matrix = TransformMatrix.createTransFormMatrix(1, 0,0, 1, dx, dy);
        return matrix;
    }

    public copy(m: TransformMatrix): this {
        this.setMatrix(...m.value());
        return this;
    }
    public clone(): TransformMatrix {
        return TransformMatrix.createTransFormMatrix(...this.value())
    }

    public release(): void {
        this.setMatrix();
        pool.push(this);
    }
    public static createTransFormMatrix(scaleX = 1, skewX = 0, skewY = 0, scaleY = 1, offsetX = 0, offsetY = 0): TransformMatrix {
        let Matrix: TransformMatrix = pool.pop() || new TransformMatrix();
        Matrix.setTransformMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
        return Matrix;
    }

}