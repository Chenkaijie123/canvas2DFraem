import { HashMap } from "./mapUtil/HashMap"
import { ObjPool } from "./object/ObjPool"
import { TextParser } from "./parser/TextParser"
import CImage from "./canvasDOM/DOM/CImage"
import Box from "./canvasDOM/math/Box"
import TransformMatrix from "./canvasDOM/math/TransformMatrix";
import CDocument from "./canvasDOM/DOM/CDocument";
import CDOMContainer from "./canvasDOM/DOM/CDOMContainer";
import CText from "./canvasDOM/DOM/CText";
import { throttle } from "./canvasDOM/global/Global";
import { PlugC } from "./canvasDOM/event/Event";
import { TapEvent } from "./canvasDOM/event/TouchEvent";
import { GlobalMgr } from "./mgr/GlobalMgr";
import { FileLoader } from "./sourceModel/loader/FileLoader";
import CArray from "./DataStruct/CArray";
import scroller from "./canvasDOM/ui/Scroller";
import Oberserve from "./DataStruct/Oberserve";

class Main {
    private stage: CDocument
    public globalMgr:GlobalMgr
    constructor() {
        this.stage = new CDocument();
        this.globalMgr = new GlobalMgr();
        this.start();
        this.test()
    }

    private start():void{
        let requestAnimationFrame = window.requestAnimationFrame;
        let loop = ()=>{
            // this.stage.sysRender();
            this.stage.renderElement();
            requestAnimationFrame(loop);
        }
        loop();
    }

    private test(): void {

        let g = new CDOMContainer();
        let sc = new scroller()
        g.style.x = 50
        g.style.y = 50
        g.style.width = g.style.height = 600
        sc.init(g)
        this.stage.appendChild(g);
        for(let i = 0 ;i < 5;i++){
            let k = new CImage();
            k.src = "./test1.jpeg"
            k.style.x = i * 10;
            k.style.y = i *10;
            g.appendChild(k)
        }
        // g.addEventListener("click",(e)=>{e.stopPropagation()},this)

        // let i1 = new CImage();
        // i1.src = "./test1.jpeg"
        // i1.style.x = 300;
        // i1.style.y = 300;
        // this.stage.appendChild(i1);

        let i = new CImage();
        i.src = "./test1.jpeg"
        i.style.x = 300;
        i.style.y = 300;
        // i.style.scaleX = .5
        i.style.rotate = 45;
        i.style.anchorX = 112;
        i.style.anchorY = 84
        i.style.clip = Box.createBox(10,10,100,100)
        g.appendChild(i);
        setInterval(()=>{
            i.style.rotate ++
        },50)
        i.addEventListener("tapBegin",(e)=>{console.log(e);e.stopPropagation()},this,true)
        i.addEventListener("tap",(e)=>{console.log("tap")},this)
        i.addEventListener("tapMove",(e)=>{console.log("tapMove")},this)
        this.loadTest()
        let a = []
        let w = Oberserve.watch(a)
        w[0] = 12
        console.log(w)
    }

    private async loadTest():Promise<any>{
        let loader = new FileLoader();
        let data = await loader.loadAsync("./package.json");
        console.log(data)
    }
}

new Main();