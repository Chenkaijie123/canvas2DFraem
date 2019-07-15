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
        let { rotate, scaleX, scaleY, anchorX, anchorY, x, y, width, height } = style;
        let rotateC = cos(rotate);
        let rotateS = sin(rotate);
        let tx = (x + anchorX) * scaleX;
        let ty = (y + anchorY) * scaleY;
        let a = rotateC * scaleX;
        let b = rotateS * scaleX;
        let c = -rotateS * scaleY;
        let d = rotateC * scaleY;
        this.setMatrix(a, b, c, d, tx, ty);
    }

    //转换坐标系
    public changeCoordinate(point: Point,scaleX:number = 1,scaleY :number = 1): void {
        this.data[4] += point.x * scaleX;
        this.data[5] += point.y * scaleY;
    }

    public value(): [number, number, number, number, number, number] {
        return this.data;
    }

    public static createTransFormMatrix(scaleX = 1, skewX = 0, skewY = 0, scaleY = 1, offsetX = 0, offsetY = 0): TransformMatrix {
        let Matrix: TransformMatrix = pool.pop() || new TransformMatrix();
        Matrix.setTransformMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
        return Matrix;
    }

}