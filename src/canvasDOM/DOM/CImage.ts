import {DOMBase,DOMStyleBase} from "./DOMBase"
export default class CImage extends DOMBase{
    private _src:string
    public treasure:HTMLImageElement;
    public get src():string{
        return this._src;
    }

    public set src(url:string){
        if(this._src != url){
            this._src = url;
            this.treasure.src = url;
            let _t = this;
            function load(){
                _t.style.width = this.width;
                _t.style.height = this.height;
                _t.treasure.removeEventListener("load",load);
                _t.treasure.removeEventListener("error",err);
                !_t.reRender && (_t.reRender = true);
            }
            function err(e:Event){
                console.error(e);
                _t.treasure.removeEventListener("load",load);
                _t.treasure.removeEventListener("error",err);
            }
            this.treasure.addEventListener("load",load);
            this.treasure.addEventListener("error",err);
        }
    }

    constructor(){
        super();
        this.type = "CImage";
        this.treasure = new Image();
    }
    public render(ctx:CanvasRenderingContext2D):void{
        ctx.setTransform(...this.matrix.value())
        ctx.drawImage(this.treasure,-this.style.anchorX,-this.style.anchorY);
        
    }


}

