import CDOMContainer from "../DOM/CDOMContainer";
import { SysTem } from "../global/PlugC";
import { TapEvent } from "../event/TouchEvent";
import Box from "../math/Box";

export default class scroller {
    public horizontal: boolean = true//是否允许水平滚动
    public vertical: boolean = true//是否允许垂直滚动
    private _scrollerV: number = 0//距离顶部的距离
    private _scrollerH: number = 0//距离左边的距离
    private scrollerObject: CDOMContainer
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
                    i.style.scrollerY = v;
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
        let { x, y, width, height } = c.style;
        c.style.clip = Box.createBox(x, y, width, height);
        this.initEvent();
    }

    private initEvent(): void {
        let obj = this.scrollerObject;
        obj.on(SysTem.TAP_BEGIN, this.onBegin, this);
        obj.on(SysTem.TAP_MOVE, this.onMove, this);
        obj.on(SysTem.TAP_CANCEL, this.onCancel, this);
    }

    private onMove(e: TapEvent): void {
        let [offX, offY] = [e.clientX - this.sign.x, e.clientY - this.sign.y];
        console.log(offX, offY)
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
        if (this.horizontal && offX != 0) {
            this.scrollerH += offX;
        }
        if (this.vertical && offY != 0) {
            this.scrollerH += offY;
        }

    }

    private onBegin(e: TapEvent): void {
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
    }

    private onCancel(e: TapEvent): void {
        this.sign.x = null
        this.sign.y = null
    }
}