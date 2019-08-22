import { DOMBase, DOMStyleBase } from "./DOMBase";
import TransformMatrix from "../math/TransformMatrix";
import { SysTem } from "../global/PlugC";

export default class CText extends DOMBase{
    public _style: TextStyle
    public proxy:TextStyle
    public get style() {
        return this.proxy;
    }
    public set style(v) {
        this._style = v;
        this.complete = true;
        this.dispatch(SysTem.DOM_COMPLETE);
    }
    protected init(): void {
        this.style = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            visible: true,
            alpha: 1,
            width: 0,
            height: 0,
            anchorX: 0,
            anchorY: 0,
            rotate: 0,
            skewX: 0,
            skewY: 0,
            fontSize:24,
            scrollerX:0,
            scrollerY:0,
            fontFamily:"微软雅黑",
            textColor:0xffffff,
            border:0,
            borderColor:null,
            bold:false,
            text:"",
            textAlign:"left",
            fontStyle:"normal",
            scrollerWidth:0,
            scrollerheight:0,
            clip:null
        }
        this.reRender = true;
        this.matrix = TransformMatrix.createTransFormMatrix();
    }
    public render(ctx:CanvasRenderingContext2D):void{
        super.render(ctx);
        let style = `${this.style.fontStyle} normal ${this.style.bold?"bold":"normal"} ${this.style.fontSize}px ${this.style.fontFamily}`
        if(ctx.font != style)ctx.font = style;
        let color = `#${this.style.textColor.toString(16)}`;
        if(ctx.fillStyle != color)ctx.fillStyle = color;
        ctx.fillText(this.style.text,this.style.anchorX,this.style.anchorY)
        if(this.style.border > 0){
            color =  `#${this.style.borderColor.toString(16)}`;
            if(ctx.strokeStyle != color) ctx.strokeStyle = color;
            ctx.strokeText(this.style.text,this.style.anchorX,this.style.anchorY)
        }
        
    }
}

interface TextStyle extends DOMStyleBase{
    fontSize:number
    fontFamily:string
    textColor:number
    border:number
    borderColor:number
    bold:boolean
    text:string
    textAlign:textAlignType
    fontStyle:fontStyle
}

export type textAlignType = "start"|"end"|"left"|"center"|"right"
export type fontStyle = "normal"|"italic"|"oblique"