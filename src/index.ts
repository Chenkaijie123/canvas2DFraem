import {HashMap} from "./mapUtil/HashMap"
import {ObjPool} from "./object/ObjPool"
import {TextParser} from "./parser/TextParser"
import CImage from "./canvasDOM/DOM/CImage"
import Box from "./canvasDOM/math/Box"
import TransformMatrix from "./canvasDOM/math/TransformMatrix";

class Main{
    constructor(){
        // let b0 = Box.createBox(0,0,100,100)
        // let b1 = Box.createBox(0,0,100,100)
        // let b2 = Box.createBox(100,100,100,100)
        // let b3 = Box.createBox(50,50,100,100)
        // let b4 = Box.createBox(-50,-50,300,100)
        // console.log(b0.dirtyRect(b2))
        let s = "./test1.jpeg"
        let ma:TransformMatrix = TransformMatrix.createTransFormMatrix()
        let a = {
            x:0,
            y:0,
            scaleX:2,
            scaleY:1,
            visible:true,
            alpha:1,
            width:0,
            height:0,
            anchorX:0,
            anchorY:0,
            rotate:0,
            skewX:0,
            skewY:0,
        }
        ma.setByStyle(a)
        abc(ma.value())

    }
}
let img = new Image()
function load(){
    return new Promise((resolve,reject)=>{
        img.src =  "./test1.jpeg"
        img.onload = function(){resolve()}
    })
}

async function abc(a:any){
    let c = document.createElement("canvas")
    c.width = c.height = 1000
    document.body.appendChild(c)
    let ctx = c.getContext("2d")
    await load();
    ctx.setTransform(...a)
    ctx.drawImage(img,0,0)
}

window.onload = function(){

    new Main()
}