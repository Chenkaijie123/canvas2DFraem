import {DOMBase,DOMContainer} from "./DOMBase"
/**容器类 */
export default class CDOMContainer extends DOMBase implements DOMContainer{
    public parent:DOMContainer
    public children:DOMBase[]
    public appendChild(child:DOMBase):this{
        if(child.parent == this) return this;
        child.removeSelf();
        this.children.push(child);
        child.parent = this;
        return this;
    }
    public removeChild(child:DOMBase):this{
        if(child.parent == void 0) return this;
        let index = this.children.indexOf(child)
        this.children.splice(index,1);
        child.parent = null;
        return this;
    }
}