import {DOMBase} from "./DOMBase"
import { resource } from "../../mgr/GlobalMgr";
import { ImgLoader } from "../../sourceModel/loader/ImgLoader";
export default class CImage extends DOMBase{
    private _src:string
    public treasure:HTMLImageElement;
    public get src():string{
        return this._src;
    }

    public set src(url:string){
        if(this._src != url){
            this.treasure = null;
            let loader = ImgLoader.create();
            loader.once(ImgLoader.LOAD_COMPLETE,(e)=>{
                this.treasure = e.data;
                this.style.width = this.treasure.width;
                this.style.height = this.treasure.height;
                loader.release();
            },this)
            loader.load(url);
        }
    }

    constructor(){
        super();
        this.type = "CImage";
        // this.treasure = new Image();
    }
    public render(ctx:CanvasRenderingContext2D):void{
        let img = this.treasure;
        if(!img) return;
        ctx.drawImage(img,0,0);
        
    }


}

