import { HashMap } from "./mapUtil/HashMap"
import { ObjPool } from "./object/ObjPool"
import { TextParser } from "./parser/TextParser"
import CImage from "./canvasDOM/DOM/CImage"
import Box from "./canvasDOM/math/Box"
import TransformMatrix from "./canvasDOM/math/TransformMatrix";
import CDocument from "./canvasDOM/DOM/CDocument";
import CDOMContainer from "./canvasDOM/DOM/CDOMContainer";

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
        let g = new CDOMContainer();
        g.style.x = 50
        g.style.y = 50
        this.stage.appendChild(g);
        let i = new CImage();
        i.src = "./test1.jpeg"
        i.style.x = 0;
        i.style.y = 0;
        i.style.rotate = 45;
        i.style.anchorX = 112;
        i.style.anchorY = 84
        this.stage.appendChild(i);
        let p = new CImage();
        p.src = "./test.png"
        g.appendChild(p);
    }
}

new Main();