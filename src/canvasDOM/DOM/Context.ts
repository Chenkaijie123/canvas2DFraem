import { textAlignType } from "./CText";

export default class Context{
    public fontSize:number
    public fontFamily:string
    public textColor:number
    public border:number
    public borderColor:number
    public bold:boolean
    public text:string
    public textAlign:textAlignType
    private _ctx:CanvasRenderingContext2D

    get ctx():CanvasRenderingContext2D{
        return this._ctx;
    }

    public init(ctx:CanvasRenderingContext2D):void{
        this._ctx = ctx;
   
    }

}