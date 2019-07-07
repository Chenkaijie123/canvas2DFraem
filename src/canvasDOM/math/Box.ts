
import Matrix  from "./Matrix"
/**
 * 矩形盒子模型
 */
export default class Box extends Matrix{
    public get width():number{
        return this.c;
    }

    public set width(v:number){
        this.c = v;
    }

    public get height():number{
        return this.d;
    }

    public set height(v:number){
        this.d = v;
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
    constructor(x:number,y:number,width:number,height:number){
        super(x,y,width,height)
    }
    /**获取两个盒子相交的部分 */
    public intersect(box:Box):Box{
        //TODO
        if(!Box.isCover(this,box))return null;
        //取靠右的为基准
        let referenceIdx = this.x >= box.x?0:1;
        let boxArr = [this,box];

        return this;
    }

    /**判断两个矩形是否有相交(碰撞) */
    public static isCover(Box1:Box,Box2:Box):boolean{
        return Box1.x + Box1.width > Box2.x &&
               Box2.x + Box2.width > Box1.x &&
               Box1.y + Box1.height > Box2.y &&
               Box2.y + Box2.height > Box1.y;
    }
}