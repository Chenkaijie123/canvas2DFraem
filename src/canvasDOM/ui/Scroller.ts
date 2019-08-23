import CDOMContainer from "../DOM/CDOMContainer";
import { SysTem } from "../global/PlugC";
import { TapEvent } from "../event/TouchEvent";
import Box from "../math/Box";
import { sysEventDispatch } from "../../mgr/GlobalMgr";
import {  debounce } from "../global/Global";

export default class scroller {
    public horizontal: boolean = true//是否允许水平滚动
    public vertical: boolean = true//是否允许垂直滚动
    private _scrollerV: number = 0//距离顶部的距离
    private _scrollerH: number = 0//距离左边的距离
    private scrollerObject: CDOMContainer
    private boundWidth:number = 0;//容器边界宽度
    private boundHeight:number = 0;//容器边界高度
    private scrollerwidth:number = 0;//滚动内容宽度
    private scrollerHeight:number = 0;//滚动内容高度

    private inAnimate:boolean = false;//是否处于滚动动画中
    private touchTime:number = 0;//接触滚动列表的时长
    private sign: { x?: number, y?: number } = {};
    /**垂直滚动 */
    public set scrollerV(v: number) {
        if (this.vertical) {
            this._scrollerV = v;
            if (this.scrollerObject.children) {
                for (let i of this.scrollerObject.children) {
                    i.style.scrollerY = v;
                }
            }
        }
    }
    public get scrollerV() {
        return this._scrollerV;
    }

    /**水平滚动 */
    public set scrollerH(v: number) {
        if (this.horizontal) {
            this._scrollerH = v;
            if (this.scrollerObject.children) {
                for (let i of this.scrollerObject.children) {
                    i.style.scrollerX = v;
                }
            }
        }
    }

    public get scrollerH() {
        return this._scrollerH;
    }
    /**初始化滚动对象 */
    public init(c: CDOMContainer): void {
        this.scrollerObject = c;
        this.calcBasic();
    }

    private debounce():void{
        debounce(this.calcBasic,100,this);
    }

    private calcBasic():void{
        let c = this.scrollerObject;
        if(!c) return;
        let {width, height ,scrollerWidth,scrollerheight} = c.style;
        let contentBox:Box;
        if(scrollerWidth == 0) {
            contentBox = c.getContentBox();
            scrollerWidth = contentBox.x + contentBox.width;
        }
        if(scrollerheight == 0) {
            if(!contentBox) contentBox = c.getContentBox();
            scrollerheight = contentBox.y + contentBox.height;
        }
        this.boundWidth = width;
        this.boundHeight = height;
        this.scrollerwidth = scrollerWidth;
        this.scrollerHeight = scrollerheight;
        //默认整个容器作为滚动单位
        c.style.clip = Box.createBox(0, 0, width, height);
        this.initEvent();
    }

    private initEvent(): void {
        let obj = this.scrollerObject;
        obj.on(SysTem.TAP_BEGIN, this.onBegin, this);
        obj.on(SysTem.TAP_MOVE, this.onMove, this);
        obj.on(SysTem.TAP_CANCEL, this.onCancel, this);
        //内容大小改变
        this.scrollerObject.addEventListener(SysTem.RESIZE,this.debounce,this);
    }

    private onMove(e: TapEvent): void {
        let [offX, offY] = [e.clientX - this.sign.x, e.clientY - this.sign.y];
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
        if (this.scrollerwidth > this.boundWidth && this.horizontal && offX != 0 ) {
            this.scrollerH += offX;
        }
        if (this.scrollerHeight > this.boundHeight && this.vertical && offY != 0) {
            this.scrollerV += offY;
        }
    }

    private onBegin(e: TapEvent): void {
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
        this.inAnimate = true;
        this.touchTime = Date.now();
    }

    private onCancel(e: TapEvent): void {
        this.sign.x = 0;
        this.sign.y = 0;
        this.inAnimate = false;
        this.touchTime = Date.now() - this.touchTime;
        //TODO 实现回弹或者快速滚动
    }
}