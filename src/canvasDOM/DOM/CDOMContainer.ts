import { DOMBase, DOMContainer } from "./DOMBase"
import Box from "../math/Box";
import { SysTem } from "../global/PlugC";
import { debounce } from "../global/Global";
/**容器类 */
export default class CDOMContainer extends DOMBase implements DOMContainer {
    public parent: DOMContainer
    public children: DOMBase[] //= [];
    public appendChild(child: DOMBase): this {
        if (child.parent == this) return this;
        child.removeSelf();
        this.children.push(child);
        child.parent = this;
        this.dispatch(SysTem.CHILD_ADD,child);
        return this;
    }
    public removeChild(child: DOMBase): this {
        if (child.parent == void 0) return this;
        let index = this.children.indexOf(child)
        this.children.splice(index, 1);
        child.parent = null;
        this.dispatch(SysTem.CHILD_REMOVE,child);
        return this;
    }

    /**
     * 获取子内容边界
     * 该方法会忽略孙对象及更深对象的边界，仅仅是子对象的宽度边界
     */
    public getContentBox(): Box {
        let box: Box;
        let boxs :Box[]= [];
        for (let i of this.children) {
            let { x, y, width, height } = i.style;
            boxs.push(Box.createBox(x, y, width, height));
        }
        if (!boxs.length) box = Box.createBox();
        else{
            box = Box.dirtyRect.apply(Box,boxs);
            while(boxs.length){
                boxs.pop().release();
            }
        }
        return box;
    }

    protected init():void{
        super.init();
        this.children = [];
        //监听子对象大小改变
        this.observeChildSizeChange();
        //添加子显示对象要重新监听新添加的对象大小改变
        this.addEventListener(SysTem.CHILD_ADD,(e)=>{
            (e.data as DOMBase).addEventListener(SysTem.DOM_COMPLETE,this.debounceSize,this); 
        },this);
        this.addEventListener(SysTem.CHILD_REMOVE,(e)=>{
            (e.data as DOMBase).removeEventListener(SysTem.DOM_COMPLETE,this.debounceSize,this); 
        },this)
    }

    /**给子集显示对象添加大小改变监听 */
    private observeChildSizeChange():void{
        for(let i of this.children){
            i.addEventListener(SysTem.DOM_COMPLETE,this.debounceSize,this);
        }
    }

    private childSizeChange():void{
        //TODO可以做大小改变要执行的操作
        this.onResize();
        this.dispatch(SysTem.RESIZE);
    }

    //节省性能
    private debounceSize():void{
        debounce(this.childSizeChange,50,this);
    }
}