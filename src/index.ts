import { HashMap } from "./mapUtil/HashMap"
import { ObjPool } from "./object/ObjPool"
import { TextParser } from "./parser/TextParser"
import CImage from "./canvasDOM/DOM/CImage"
import Box from "./canvasDOM/math/Box"
import TransformMatrix from "./canvasDOM/math/TransformMatrix";
import CDocument from "./canvasDOM/DOM/CDocument";
import CDOMContainer from "./canvasDOM/DOM/CDOMContainer";
import CText from "./canvasDOM/DOM/CText";

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
        let t = new CText()
        t.style.text = "你好"
        t.style.fontFamily = "Arial"
        t.style.x = 300
        t.style.textColor = 0xFFF9E2
        t.style.border = 2;
        t.style.borderColor = 0x000000
        t.style.rotate = 30
        t.style.fontSize = 30;
        t.style.anchorX = 30
        t.style.anchorY = 15
        setInterval(()=>{
            t.style.rotate++
        },10)
        g.appendChild(t)
        let temp = 0;
        for(let k:number = 0 ; k < 100;k++){
            let img = new CText()
            img.style.text = `text${k}`
            img.style.x = temp + k *1
            img.style.y = temp + k *3
            g.appendChild(img)
        }

    }
}

new Main();