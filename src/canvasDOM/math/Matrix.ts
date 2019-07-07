/**矩阵数据结构 */
export default class Matrix{
    private data:[number,number,number,number,number,number]
    constructor(a:number = 0,b:number = 0,c:number = 0,d:number = 0,e:number = 0,f:number = 0){
        this.data = [a,b,c,d,e,f];
    }
    public get a():number{
        return this.data[0]
    }
    public set a(v:number){
         this.data[0] = v;
    }

    public get b():number{
        return this.data[1]
    }
    public set b(v:number){
         this.data[1] = v;
    }
    public get c():number{
        return this.data[2]
    }
    public set c(v:number){
         this.data[2] = v;
    }
    public get d():number{
        return this.data[3]
    }
    public set d(v:number){
         this.data[3] = v;
    }
    public get e():number{
        return this.data[4]
    }
    public set e(v:number){
         this.data[4] = v;
    }
    public get f():number{
        return this.data[5]
    }
    public set f(v:number){
         this.data[5] = v;
    }

    public setMatrix(a:number = 0,b:number = 0,c:number = 0,d:number = 0,e:number = 0,f:number = 0):void{
        this.data = [a,b,c,d,e,f];
    }

    public getMartrix():[number,number,number,number,number,number]{
        return this.data;
    }
}