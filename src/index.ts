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

class Main {
    private stage: CDocument
    constructor() {
        this.stage = new CDocument();
        this.start();
        this.test()
    }

    private start():void{
        let requestAnimationFrame = window.requestAnimationFrame;
        let loop = ()=>{
            this.stage.sysRender();
            requestAnimationFrame(loop);
        }
        loop();
    }

    private test(): void {
        // let g = new CDOMContainer();
        // g.style.x = 50
        // g.style.y = 50
        // this.stage.appendChild(g);
        let i = new CImage();
        i.src = "./test1.jpeg"
        i.style.x = 0;
        i.style.y = 0;
        i.style.rotate = 45;
        i.style.anchorX = 112;
        i.style.anchorY = 84
        this.stage.appendChild(i);
        // let p = new CImage();
        // p.src = "./test.png"
        // p.style.anchorX = 50;
        // p.style.anchorY = 50
        // g.appendChild(p);
        // let t = new CText()
        // t.style.text = "你好"
        // t.style.fontFamily = "Arial"
        // t.style.x = 300
        // t.style.textColor = 0xFFF9E2
        // t.style.border = 2;
        // t.style.borderColor = 0x000000
        // t.style.rotate = 30
        // t.style.fontSize = 30;
        // t.style.anchorX = 30
        // t.style.anchorY = 15
        // setInterval(()=>{
        //     g.style.rotate++
        // },10)
        // g.appendChild(t)
        // let g1 = new CDOMContainer();
        // g.appendChild(g1)
        // let i2 = new CImage
        // i2.src = "./test.png"
        // g1.appendChild(i2)
        // i2.style.scaleX = .5;
        // setInterval(()=>{
        //     i2.style.x++
        // },10)
  

    }
}

new Main();