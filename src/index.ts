
import CImage from "./canvasDOM/DOM/CImage"
import Box from "./canvasDOM/math/Box"
import CDocument from "./canvasDOM/DOM/CDocument";
import CDOMContainer from "./canvasDOM/DOM/CDOMContainer";
import { GlobalMgr } from "./mgr/GlobalMgr";
import { FileLoader } from "./sourceModel/loader/FileLoader";
import scroller from "./canvasDOM/ui/Scroller";
import Observe from "./DataStruct/Oberserve/Oberserve";


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
            k.style.x =  100;
            k.style.y = i *100;
            g.appendChild(k)
        }


        // let i = new CImage();
        // i.src = "./test1.jpeg"
        // i.style.x = 300;
        // i.style.y = 300;
        // i.style.rotate = 45;
        // i.style.anchorX = 112;
        // i.style.anchorY = 84
        // i.style.clip = Box.createBox(10,10,100,100)
        // g.appendChild(i);
        // setInterval(()=>{
        //     i.style.x++
        // },50)
        // i.addEventListener("tapBegin",(e)=>{console.log(e);e.stopPropagation()},this,true)
        // i.addEventListener("tap",(e)=>{console.log("tap")},this)
        // i.addEventListener("tapMove",(e)=>{console.log("tapMove")},this)
        this.loadTest()
        let a = {name:{firstName:"a",lastName:"b"}}
        let w = Observe.watch(a)
        w.name.firstName = "ccc"
        console.log(w.name)
       

    }

    private async loadTest():Promise<any>{
        let loader = new FileLoader();
        let data = await loader.loadAsync("./package.json");
        console.log(data)
    }
}

new Main();