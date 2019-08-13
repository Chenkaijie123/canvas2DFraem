import Matrix from "./Matrix"
import { DOMStyleBase } from "../DOM/DOMBase"
import Point from "./Point";
const anglePI = Math.PI / 180;
const sinMap: { [rotate: number]: number } = {};
const cosMap: { [rotate: number]: number } = {};
for (let i = 0; i < 360; i++) {
    sinMap[i] = Math.sin(i * anglePI)
}

for (let i = 0; i < 360; i++) {
    cosMap[i] = Math.cos(i * anglePI)
}



function sin(r: number) {
    let index: number = r < 0 ? -r : r;
    if (index >= 360) index %= 360;
    return r > 0 ? sinMap[index >> 0] : -sinMap[index >> 0]

    // let angle = r == 0 ? 0 : r * anglePI
    // return Math.sin(angle);
}

function cos(r: number) {
    if (r < 0) r *= -1;
    if (r >= 360) r %= 360;
    return cosMap[r >> 0]
    // let angle = r == 0 ? 0 : r * anglePI
    // return Math.cos(angle);
}

// function tan(r: number) {
//     let angle = r == 0 ? 0 : r * anglePI
//     return Math.tan(angle);
// }
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
        let { rotate, scaleX, scaleY, anchorX, anchorY, x, y ,scrollerX,scrollerY} = style;
        let rotateC = cos(rotate);
        let rotateS = sin(rotate);
        let tx = (x + scrollerX) * scaleX;
        let ty = (y + scrollerY) * scaleY;
        let a = rotateC * scaleX;
        let b = rotateS * scaleX;
        let c = -rotateS * scaleY;
        let d = rotateC * scaleY;
        //锚点实现，设置锚点不影响x,y位置，只是固定相对于显示对象（0，0）点，用于旋转
        if (anchorX != 0 || anchorY != 0) {
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

    public scaleMatrix(sx: number, sy: number): TransformMatrix {
        let matrix = TransformMatrix.createTransFormMatrix(sx, 0, 0, sy, 0, 0);
        return matrix;
    }



    public translateMatrix(dx: number, dy: number): TransformMatrix {
        let matrix = TransformMatrix.createTransFormMatrix(1, 0, 0, 1, dx, dy);
        return matrix;
    }


    /**矩阵求逆 */
    public invertMartix(): void {
        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        let tx = this.e;
        let ty = this.f;
        if (b == 0 && c == 0) {
            this.b = this.c = 0;
            if (a == 0 || d == 0) {
                this.a = this.d = this.e = this.f = 0;
            }
            else {
                a = this.a = 1 / a;
                d = this.d = 1 / d;
                this.e = -a * tx;
                this.f = -d * ty;
            }

            return;
        }
        let determinant = a * d - b * c;
        if (determinant == 0) {
            this.setMatrix(1, 0, 0, 1, 0, 0);
            return;
        }
        determinant = 1 / determinant;
        let k = this.a = d * determinant;
        b = this.b = -b * determinant;
        c = this.c = -c * determinant;
        d = this.d = a * determinant;
        this.e = -(k * tx + c * ty);
        this.f = -(b * tx + d * ty);
    }

    /**把传入的点传化成当前矩阵变化后的点，直接改变目标点 */
    public transFormPoint(p: Point): Point {
        let [a, b, c, d, e, f] = this.data;
        let { x, y } = p;
        p.x = a * x + c * y + e;
        p.y = b * x + d * y + f;
        return p;
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