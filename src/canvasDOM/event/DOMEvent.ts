import { DOMBase } from "../DOM/DOMBase";
import { PlugC } from "./Event";
import CDocument from "../DOM/CDocument";
import Point from "../math/Point";
/**canvas内部元素点击事件的实现 */
export default class DOMEvent {
    private document: CDocument
    private beginList: DOMBase[];
    constructor(document: CDocument) {
        this.document = document;
        this.init();
    }

    public init(): void {
        let canvas = this.document.canvas;
        canvas.addEventListener("mousedown", this.onTapBegin);
        canvas.addEventListener("mouseup", this.onTapEnd);
    }

    private onTapBegin:(E:MouseEvent)=>any = function(e:MouseEvent){
        let t :DOMEvent= this;
        let canvas = t.document.canvas;
        canvas.removeEventListener("mousemove",t.onMove);
        canvas.addEventListener("mousemove",t.onMove);
        let list = t.getDOM(e);
        t.beginList = list;
        let item: DOMBase, evt: PlugC.Event, index: number = list.length - 1;
        //捕获
        for (; item = list[index]; index--) {
            evt = item.emit("tapBegin", true, item);
            if (evt.stopPro) {
                evt.release();
                return;
            }
        }
        //冒泡
        for (index = 0; item = list[index]; index++) {
            evt = item.emit("tapBegin", false, item);
            if (evt.stopPro) {
                evt.release();
                return;
            }
        }
    }.bind(this);

    private onTapEnd:(e:MouseEvent)=>any = function(e:MouseEvent){
        let t :DOMEvent= this;
        let canvas = t.document.canvas;
        canvas.removeEventListener("mousemove",t.onMove);
        let list = t.getDOM(e);
        let beginList = t.beginList;
        let index: number = list.length - 1;
        //抬起事件捕获
        for (let DOM: DOMBase, evt: PlugC.Event; DOM = list[index]; index--) {
            evt = DOM.emit("tapEnd", true, DOM)
            if (beginList.indexOf(DOM) != -1) {
                DOM.emit("tap", true, DOM);
            }
            if (evt.stopPro) {
                evt.release();
                return;
            }
        }
        //抬起事件冒泡
        for (let DOM: DOMBase, evt: PlugC.Event,index = 0; DOM = list[index]; index++) {
            evt = DOM.emit("tapEnd", false, DOM)
            if (beginList.indexOf(DOM) != -1) {
                DOM.emit("tap", false, DOM);
            }
            if (evt.stopPro) {
                evt.release();
                return;
            }
        }
        //取消事件捕获
        for(let DOM:DOMBase,evt: PlugC.Event,index = beginList.length - 1; DOM = beginList[index]; index--){
            if(list.indexOf(DOM) == -1){
                evt = DOM.emit("tapCancel", true, DOM);
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
        }
        //取消事件冒泡
        for(let DOM:DOMBase,evt: PlugC.Event,index = 0; DOM = beginList[index]; index++){
            if(list.indexOf(DOM) == -1){
                evt = DOM.emit("tapCancel", false, DOM);
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
        }
    }.bind(this);

    private onMove:(e:MouseEvent)=>any = function(e:MouseEvent){
        let t :DOMEvent= this;
        let list = t.getDOM(e);
        let index: number = list.length - 1;
        let beginList = t.beginList;
        //捕获
        for (let DOM: DOMBase, evt: PlugC.Event; DOM = list[index]; index--) {
            if(beginList.indexOf(DOM) == -1) continue;
            evt = DOM.emit("tapMove", true, DOM)
            if (evt.stopPro) {
                evt.release();
                return;
            }
        }
        //冒泡
        for (let DOM: DOMBase, evt: PlugC.Event,index = 0; DOM = list[index]; index++) {
            if(beginList.indexOf(DOM) == -1) continue;
            evt = DOM.emit("tapMove", false, DOM)
            if (evt.stopPro) {
                evt.release();
                return;
            }
        }
    }.bind(this);

    /**获取点击的节点列表 */
    public getDOM(e: MouseEvent): DOMBase[] {
        let x = e.clientX
        let y = e.clientY
        let p = Point.createPiont(x, y);
        let list: DOMBase[] = [];
        this.document.iterator(this.document.children, (v) => {
            if (v.eventCount == 0) return;
            v.toGlobal(p.setPoint(x, y))
            let res = v.contain(p.x, p.y)
            if (res) {
                list.push(v)
            }
        });
        p.release();
        return list;
    }
}