import Matrix  from "./Matrix"
let pool:Array<Point> = [];
export default class Point extends Matrix{
    private constructor(x:number = 0,y:number = 0){
        super(x,y);
    }

    public get x():number{
        return this.a;
    }

    public set x(v:number){
        this.a = v;
    }

    public get y():number{
        return this.b;
    }

    public set y(v:number){
        this.b = v;
    }

    public get value():[number,number]{
        return [this.a,this.b];
    }

    public setPoint(x:number = 0,y :number = 0):void{
        this.setMatrix(x,y); 
    }

    /**回收进对象池 */
    public release():void{
        this.setMatrix();
        pool.push(this);
    }

    /**
     * 两点叠加，可实现平移或者坐标系转化
     * @param point 
     */
    public add(point:Point):this{
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    /**创建点对象 */
    public static createPiont(x:number = 0,y :number = 0):Point{
        let point = pool.pop() || new Point();
        point.setMatrix(x,y);
        return point;
    }
}