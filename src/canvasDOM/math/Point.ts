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

    public setPoint(x:number = 0,y :number = 0):this{
        this.setMatrix(x,y); 
        return this;
    }

    /**回收进对象池 */
    public release():void{
        this.setMatrix();
        pool.push(this);
    }

    
    public copy(p:Point):this{
        this.data[0] = p.x;
        this.data[1] = p.y;
        return this;
    }
    /**
     * 两点叠加，可实现平移或者坐标系转化
     * @param point 
     */
    public add(point:Point):this{
        this.data[0] += point.x;
        this.data[1] += point.y;
        return this;
    }

    /**创建点对象 */
    public static createPiont(x:number = 0,y :number = 0):Point{
        let point = pool.pop() || new Point();
        point.setMatrix(x,y);
        return point;
    }

}