import {HashMap} from "./mapUtil/HashMap"
import {ObjPool} from "./object/ObjPool"
import {TextParser} from "./parser/TextParser"
import CImage from "./canvasDOM/DOM/CImage"
import Box from "./canvasDOM/math/Box"
class Main{
    constructor(){
        let b0 = Box.createBox(0,0,100,100)
        let b1 = Box.createBox(0,0,100,100)
        let b2 = Box.createBox(100,100,100,100)
        let b3 = Box.createBox(50,50,100,100)
        let b4 = Box.createBox(-50,-50,300,100)
        console.log(b0.dirtyRect(b2))
    }
}


new Main()