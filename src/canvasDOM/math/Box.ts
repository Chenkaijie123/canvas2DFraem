
import Matrix from "./Matrix"
import Point from "./Point"
/**
 * 矩形盒子模型
 * [x,y,width,height]
 */
let pool: Array<Box> = [];
export default class Box extends Matrix {
    public get width(): number {
        return this.c;
    }

    public set width(v: number) {
        this.c = v;
    }

    public get height(): number {
        return this.d;
    }

    public set height(v: number) {
        this.d = v;
    }

    public get x(): number {
        return this.a;
    }

    public set x(v: number) {
        this.a = v;
    }

    public get y(): number {
        return this.b;
    }

    public set y(v: number) {
        this.b = v;
    }

    public get value(): [number, number, number, number] {
        return [this.a, this.b, this.c, this.d];
    }
    private constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y, width, height)
    }

    public setBox(x: number = 0, y: number = 0, width: number = 0, height: number = 0): void {
        this.setMatrix(x, y, width, height);
    }
    /**回收 */
    public release(): void {
        this.setMatrix();
        pool.push(this);
    }

    /**
     * 获取两个盒子相交的部分
     * @returns [x,y,width,height]
     */
    public intersect(box: Box): Box {
        if (!Box.isCover(this, box)) return null;
        //取靠右的为基准
        let referenceIdx = this.x >= box.x ? 0 : 1;
        let boxArr = [this, box];
        let [right, left] = [boxArr[referenceIdx], boxArr[1 - referenceIdx]];
        let [x0, y0, x1, y1] = [0, 0, 0, 0];
        x0 = right.x;
        y0 = Math.max(right.y, left.y);
        x1 = Math.min(right.x + right.width, left.x + left.width);
        y1 = Math.min(right.y + right.height, left.y + left.height);
        return Box.createBox(x0, y0, x1 - x0, y1 - y0);
    }

    /**
     * 获取刚好包围两个盒子的盒子
     * @param box 
     */
    public dirtyRect(box: Box): Box {
        return Box.dirtyRect(this, box);
    }

    /**判断两个矩形是否有相交(碰撞) */
    public static isCover(Box1: Box, Box2: Box): boolean {
        return Box1.x + Box1.width > Box2.x &&
            Box2.x + Box2.width > Box1.x &&
            Box1.y + Box1.height > Box2.y &&
            Box2.y + Box2.height > Box1.y;
    }

    /**判断点是否在改矩形中 */
    public static pointInside(box: Box, point: Point): boolean {
        return box.x <= point.x &&
            box.y <= point.y &&
            box.x + box.width >= point.x &&
            box.y + box.height >= point.y;
    }

    /**工厂函数 */
    public static createBox(x: number = 0, y: number = 0, width: number = 0, height: number = 0): Box {
        let box = pool.pop() || new Box();
        box.setBox(x, y, width, height);
        return box;
    }

    /**获取刚好包围多个盒子的大盒子 */
    public static dirtyRect(...box: Box[]): Box {
        let x0: number = Math.min(...box.map((v) => v.x));
        let y0: number = Math.min(...box.map((v) => v.y));
        let x1: number = Math.max(...box.map((v) => v.x + v.width));
        let y1: number = Math.max(...box.map((v) => v.y + v.height));
        return Box.createBox(x0, y0, x1 - x0, y1 - y0);
    }
}