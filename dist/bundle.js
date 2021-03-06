/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/DataStruct/Oberserve/FnHandle.ts":
/*!**********************************************!*\
  !*** ./src/DataStruct/Oberserve/FnHandle.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
let pool = [];
class FnHandle {
    constructor(fn, caller, ...args) {
        this.init(fn, caller, ...args);
    }
    init(fn, caller, ...args) {
        if (!fn && !caller)
            return;
        this.action = fn;
        this.caller = caller;
        this.args = args;
    }
    release() {
        this.action = this.caller = this.args = null;
        pool.push(this);
    }
    run(...args) {
        return this.action.apply(this.caller, this.args.concat(args));
    }
    static create(fn, caller, ...args) {
        let handle = pool.pop() || new FnHandle();
        if (fn && caller)
            handle.init(fn, caller, ...args);
        return handle;
    }
}
exports.default = FnHandle;


/***/ }),

/***/ "./src/DataStruct/Oberserve/Oberserve.ts":
/*!***********************************************!*\
  !*** ./src/DataStruct/Oberserve/Oberserve.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Observe {
    static watch(o) {
        let w;
        w = Observe.createObserveProxy(o);
        for (let k in o) {
            if (typeof o[k] == "object") {
                w[k] = Observe.ProxyMap[o[k]["ObserveID"]] || Observe.watch(o[k]);
                if (w[k]["parents"] && w[k]["parents"].indexOf(w) != -1) {
                    w[k]["parents"].push(w);
                }
            }
        }
        return w;
    }
    static bindAction(observe, actfn, caller, key, ...args) {
        let ObserveID = observe["ObserveID"];
        let proxyMap = Observe.ProxyMap[ObserveID];
        let keys = key ? key.split(".") : [];
        for (let k in keys) {
            proxyMap = proxyMap[k];
        }
        let actMap;
        if (!keys.length) {
            actMap = Observe.actionMap[ObserveID]["defaultCall"];
        }
        else if (proxyMap) {
            actMap = Observe.actionMap[proxyMap["ObserveID"]][keys[keys.length - 1]];
        }
    }
    static createObserveProxy(o) {
        if (typeof o != "object")
            return null;
        if (o["ObserveID"] != void 0)
            return Observe.ProxyMap[o["ObserveID"]];
        let onlyID = getID();
        Observe.actionMap[onlyID] = {};
        let w = new Proxy(o, {
            set(target, key, value, proxy) {
                if (Reflect.set(target, key, value)) {
                    Observe.run(proxy["ObserveID"], key);
                    return true;
                }
                return false;
            },
            get(target, key, proxy) {
                if (!target || !proxy)
                    return null;
                return Reflect.get(target, key);
            }
        });
        Observe.ProxyMap[onlyID] = w;
        w["ObserveID"] = o["ObserveID"] = onlyID;
        return w;
    }
    /**执行事件 */
    static run(ObserveID, key) {
        let actMap = Observe.actionMap[ObserveID][key];
        if (actMap) {
            for (let i of actMap) {
                i.run();
            }
        }
        actMap = Observe.actionMap[ObserveID]["defaultCall"];
        if (actMap) {
            for (let i of actMap) {
                i.run();
            }
        }
        let parents = Observe.ProxyMap[ObserveID]["parents"];
        if (parents) {
            for (let i of parents) {
                let parActMap = Observe.actionMap[i["ObserveID"]];
                for (let k in parActMap) {
                    for (let i of parActMap[k]) {
                        i.run();
                    }
                }
            }
        }
    }
}
Observe.ProxyMap = {};
Observe.actionMap = {};
exports.default = Observe;
function getID() {
    let id = 0;
    return (() => id++)();
}


/***/ }),

/***/ "./src/canvasDOM/DOM/CDOMContainer.ts":
/*!********************************************!*\
  !*** ./src/canvasDOM/DOM/CDOMContainer.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DOMBase_1 = __webpack_require__(/*! ./DOMBase */ "./src/canvasDOM/DOM/DOMBase.ts");
const Box_1 = __webpack_require__(/*! ../math/Box */ "./src/canvasDOM/math/Box.ts");
const PlugC_1 = __webpack_require__(/*! ../global/PlugC */ "./src/canvasDOM/global/PlugC.ts");
const Global_1 = __webpack_require__(/*! ../global/Global */ "./src/canvasDOM/global/Global.ts");
/**容器类 */
class CDOMContainer extends DOMBase_1.DOMBase {
    appendChild(child) {
        if (child.parent == this)
            return this;
        child.removeSelf();
        this.children.push(child);
        child.parent = this;
        this.dispatch(PlugC_1.SysTem.CHILD_ADD, child);
        return this;
    }
    removeChild(child) {
        if (child.parent == void 0)
            return this;
        let index = this.children.indexOf(child);
        this.children.splice(index, 1);
        child.parent = null;
        this.dispatch(PlugC_1.SysTem.CHILD_REMOVE, child);
        return this;
    }
    /**
     * 获取子内容边界
     * 该方法会忽略孙对象及更深对象的边界，仅仅是子对象的宽度边界
     * @returns Box对象，参考系是全局
     */
    getContentBox() {
        let box;
        let boxs = [];
        for (let i of this.children) {
            boxs.push(i.getBoundBox());
        }
        if (!boxs.length)
            box = Box_1.default.createBox();
        else {
            box = Box_1.default.dirtyRect.apply(Box_1.default, boxs);
            while (boxs.length) {
                boxs.pop().release();
            }
        }
        return box;
    }
    init() {
        super.init();
        this.children = [];
        //监听子对象大小改变
        this.observeChildSizeChange();
        //添加子显示对象要重新监听新添加的对象大小改变
        this.addEventListener(PlugC_1.SysTem.CHILD_ADD, (e) => {
            e.data.addEventListener(PlugC_1.SysTem.DOM_COMPLETE, this.debounceSize, this);
        }, this);
        this.addEventListener(PlugC_1.SysTem.CHILD_REMOVE, (e) => {
            e.data.removeEventListener(PlugC_1.SysTem.DOM_COMPLETE, this.debounceSize, this);
        }, this);
    }
    /**给子集显示对象添加大小改变监听 */
    observeChildSizeChange() {
        for (let i of this.children) {
            i.addEventListener(PlugC_1.SysTem.DOM_COMPLETE, this.debounceSize, this);
        }
    }
    childSizeChange() {
        //TODO可以做大小改变要执行的操作
        this.onResize();
        this.dispatch(PlugC_1.SysTem.RESIZE);
    }
    //节省性能
    debounceSize() {
        Global_1.debounce(this.childSizeChange, 50, this);
    }
}
exports.default = CDOMContainer;


/***/ }),

/***/ "./src/canvasDOM/DOM/CDocument.ts":
/*!****************************************!*\
  !*** ./src/canvasDOM/DOM/CDocument.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CDOMContainer_1 = __webpack_require__(/*! ./CDOMContainer */ "./src/canvasDOM/DOM/CDOMContainer.ts");
const DOMEvent_1 = __webpack_require__(/*! ../event/DOMEvent */ "./src/canvasDOM/event/DOMEvent.ts");
/**虚拟文本 */
class CDocument extends CDOMContainer_1.default {
    constructor() {
        super();
        this.parent = null;
    }
    initCanvas() {
        let canvas = document.createElement("canvas");
        this.canvas = canvas;
        canvas.width = 1000;
        canvas.height = 600;
        canvas.id = "canvas";
        new DOMEvent_1.default(this);
        document.body.appendChild(canvas);
        this.context = canvas.getContext("2d");
        this.context.textBaseline = "hanging";
    }
    init() {
        super.init();
        this.initCanvas();
        this.deep = 1;
    }
    iterator(loot, fn) {
        let res = [];
        for (let i = 0, e; e = loot[i]; i++) {
            res.push(fn(e));
            if (e["children"]) {
                res.push(...this.iterator(e["children"], fn));
            }
        }
        return res;
    }
    getElementById(id) {
        let loop = this.children;
        return (this.iterator(loop, (e) => { return e; })[0]);
    }
    getElementsByClassName(id) {
        return;
    }
    //判断重新渲染深度
    changeReRenderDeep(deep) {
        this.reRenderDeep = this.reRenderDeep > deep ? deep : this.reRenderDeep;
    }
    //内部计算并且渲染
    // public sysRender(): void {
    //     //todo
    //     this.context.setTransform(1, 0, 0, 1, 0, 0)
    //     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    //     let loot = this.children;
    //     let fn = (e: DOMBase) => {
    //         //重新计算需要重绘的数据
    //         if (e.reRender) {
    //             let style = e.style
    //             e.matrix.setByStyle(style);//转换矩阵
    //             e.reRender = false;
    //         }
    //         if (e.parent instanceof CDocument) {
    //             this.context.setTransform(...e.matrix.value());
    //         } else {
    //             this.context.transform(...e.matrix.value());
    //         }
    //         e.render(this.context);
    //     }
    //     // let t = Date.now()
    //     this.iterator(loot, fn);
    //     // console.log(Date.now() - t)
    // }
    renderElement() {
        let ctx = this.context;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderList(this.children);
    }
    renderList(nodes) {
        let ctx = this.context;
        for (let i of nodes) {
            if (i.reRender) {
                let style = i.style;
                i.matrix.setByStyle(style); //转换矩阵
                i.reRender = false;
            }
            if (!i.style.visible || !i.style.alpha || i.matrix.a == 0 && i.matrix.b == 0 || i.matrix.c == 0 && i.matrix.d == 0)
                continue;
            ctx.save();
            if (i.parent instanceof CDocument) {
                ctx.setTransform.apply(ctx, i.matrix.value());
            }
            else {
                ctx.transform.apply(ctx, i.matrix.value());
            }
            if (i.style.clip) {
                let clip = i.style.clip;
                if (clip.width <= 0 || clip.height <= 0) {
                    ctx.restore();
                    continue;
                }
                ctx.save();
                ctx.beginPath();
                ctx.rect(clip.x, clip.y, clip.width, clip.height);
                ctx.stroke();
                ctx.clip();
                i.render(ctx);
                if (i["children"]) {
                    this.renderList(i["children"]);
                }
                ctx.restore();
            }
            else {
                i.render(ctx);
                if (i["children"]) {
                    this.renderList(i["children"]);
                }
            }
            ctx.restore();
        }
    }
}
exports.default = CDocument;


/***/ }),

/***/ "./src/canvasDOM/DOM/CImage.ts":
/*!*************************************!*\
  !*** ./src/canvasDOM/DOM/CImage.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DOMBase_1 = __webpack_require__(/*! ./DOMBase */ "./src/canvasDOM/DOM/DOMBase.ts");
const ImgLoader_1 = __webpack_require__(/*! ../../sourceModel/loader/ImgLoader */ "./src/sourceModel/loader/ImgLoader.ts");
const PlugC_1 = __webpack_require__(/*! ../global/PlugC */ "./src/canvasDOM/global/PlugC.ts");
class CImage extends DOMBase_1.DOMBase {
    get src() {
        return this._src;
    }
    set src(url) {
        if (this._src != url) {
            this.treasure = null;
            this.complete = false;
            let loader = ImgLoader_1.ImgLoader.create();
            loader.once(ImgLoader_1.ImgLoader.LOAD_COMPLETE, (e) => {
                this.treasure = e.data;
                this.style.width = this.treasure.width;
                this.style.height = this.treasure.height;
                this.complete = true;
                this.dispatch(PlugC_1.SysTem.DOM_COMPLETE);
                loader.release();
            }, this);
            loader.load(url);
        }
    }
    constructor() {
        super();
        this.type = "CImage";
        // this.treasure = new Image();
    }
    render(ctx) {
        super.render(ctx);
        let img = this.treasure;
        if (!img)
            return;
        ctx.drawImage(img, 0, 0);
        // console.log(this.hashCode,this.style.x,this.style.y,this.style.width,this.style.height,this.style.scrollerX,this.style.scrollerY)
    }
}
exports.default = CImage;


/***/ }),

/***/ "./src/canvasDOM/DOM/DOMBase.ts":
/*!**************************************!*\
  !*** ./src/canvasDOM/DOM/DOMBase.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TransformMatrix_1 = __webpack_require__(/*! ../math/TransformMatrix */ "./src/canvasDOM/math/TransformMatrix.ts");
const Point_1 = __webpack_require__(/*! ../math/Point */ "./src/canvasDOM/math/Point.ts");
const EventDispatch_1 = __webpack_require__(/*! ../event/EventDispatch */ "./src/canvasDOM/event/EventDispatch.ts");
const Box_1 = __webpack_require__(/*! ../math/Box */ "./src/canvasDOM/math/Box.ts");
const PlugC_1 = __webpack_require__(/*! ../global/PlugC */ "./src/canvasDOM/global/PlugC.ts");
/**
 * 基础DOM
 */
let hashCode = 0;
class DOMBase extends EventDispatch_1.default {
    constructor() {
        super();
        //留下的扩展接口
        this.proxyHandle = (target, key, newData, proxy) => { };
        this.hashCode = hashCode++;
        this.init();
        let self = this;
        this.proxy = new Proxy(this._style, {
            set(target, key, newData, proxy) {
                if (target[key] != newData) {
                    target[key] = newData;
                    if (!self.reRender)
                        self.reRender = true;
                    if (key == "width" || key == "height" || key == "scaleX" || key == "scaleY" || key == "x" || key == "y")
                        self.onResize();
                    self.proxyHandle(target, key, newData, proxy);
                }
                return true;
            }
        });
    }
    get style() {
        return this.proxy;
    }
    set style(v) {
        this._style = v;
    }
    appendTo(parent) {
        parent.appendChild(this);
        return this;
    }
    removeSelf() {
        if (this.parent) {
            this.parent.removeChild(this);
            return this;
        }
    }
    //判断是否重绘
    checkReRender() {
        return this.reRender = true;
    }
    init() {
        this.style = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            visible: true,
            alpha: 1,
            width: 0,
            height: 0,
            anchorX: 0,
            anchorY: 0,
            rotate: 0,
            skewX: 0,
            skewY: 0,
            scrollerX: 0,
            scrollerY: 0,
            scrollerWidth: 0,
            scrollerheight: 0,
            clip: null
        };
        this.reRender = true;
        this.complete = false;
        this.matrix = TransformMatrix_1.default.createTransFormMatrix();
    }
    reset() {
    }
    render(ctx) {
        this.dispatch(PlugC_1.SysTem.RENDER);
    }
    /**
     * 把处于全局的坐标的point点装换为当前坐标系
     * @param point
     */
    toLocal(point) {
        let matrix = this.getMatrixMul();
        matrix.invertMartix();
        matrix.transFormPoint(point);
        matrix.release();
        return point;
    }
    /**
     * 把处于当前坐标系的point点装换为全局的坐标
     * @param point
     */
    // public toGlobals(point: Point[]): Point[]{
    //     let matrix = this.getMatrixMul();
    //     matrix.invertMartix();
    //     for(let i of point){
    //         matrix.transFormPoint(i);
    //     }
    //     matrix.release();
    //     return point;
    // }
    contain(_x, _y) {
        let { width, height } = this.style;
        return _x >= 0 && width >= _x && _y >= 0 && height >= _y;
    }
    /**
     * 获取该对象当前的转化矩阵
     */
    getMatrixMul() {
        let temp = [this.matrix];
        let t = this;
        while (t.parent) {
            t = t.parent;
            if (t.reRender) {
                t.matrix.setByStyle(t.style); //转换矩阵
                t.reRender = false;
            }
            temp.push(t.matrix);
        }
        let matrix = temp.pop().clone();
        let m;
        while (m = temp.pop()) {
            matrix.MatrixMulti(m);
        }
        return matrix;
    }
    //大小改变要执行的操作
    onResize() {
        this.dispatch(PlugC_1.SysTem.DOM_COMPLETE);
    }
    /**获取刚好包裹该显示对象的盒子 */
    getBoundBox() {
        let { x, y, width, height, clip } = this.style;
        //裁剪区域按照原大小算，故注释掉
        // if(clip){
        //     x += clip.x;
        //     y += clip.y;
        //     width = clip.width;
        //     height = clip.height;
        // }
        let topPoint = [
            Point_1.default.createPiont(x, y),
            Point_1.default.createPiont(x + width, y),
            Point_1.default.createPiont(x, y + height),
            Point_1.default.createPiont(x + width, y + height),
        ];
        // this.toGlobals(topPoint)
        let maxX = Math.max(topPoint[0].x, topPoint[1].x, topPoint[2].x, topPoint[3].x);
        let minX = Math.min(topPoint[0].x, topPoint[1].x, topPoint[2].x, topPoint[3].x);
        let maxY = Math.max(topPoint[0].y, topPoint[1].y, topPoint[2].y, topPoint[3].y);
        let minY = Math.min(topPoint[0].y, topPoint[1].y, topPoint[2].y, topPoint[3].y);
        while (topPoint.length) {
            topPoint.pop().release();
        }
        return Box_1.default.createBox(minX, minY, maxX - minX, maxY - minY);
    }
}
exports.DOMBase = DOMBase;


/***/ }),

/***/ "./src/canvasDOM/event/DOMEvent.ts":
/*!*****************************************!*\
  !*** ./src/canvasDOM/event/DOMEvent.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = __webpack_require__(/*! ../math/Point */ "./src/canvasDOM/math/Point.ts");
/**canvas内部元素点击事件的实现 */
class DOMEvent {
    constructor(document) {
        this.onTapBegin = function (e) {
            let t = this;
            let canvas = t.document.canvas;
            canvas.removeEventListener("mousemove", t.onMove);
            canvas.addEventListener("mousemove", t.onMove);
            let list = t.getDOM(e);
            let { clientX, clientY } = e;
            t.beginList = list;
            let item, evt, index = list.length - 1;
            //捕获
            for (; item = list[index]; index--) {
                evt = item.emit("tapBegin", true, item, clientX, clientY);
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
            //冒泡
            for (index = 0; item = list[index]; index++) {
                evt = item.emit("tapBegin", false, item, clientX, clientY);
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
        }.bind(this);
        this.onTapEnd = function (e) {
            let t = this;
            let canvas = t.document.canvas;
            canvas.removeEventListener("mousemove", t.onMove);
            let list = t.getDOM(e);
            let { clientX, clientY } = e;
            let beginList = t.beginList;
            let index = list.length - 1;
            //抬起事件捕获
            for (let DOM, evt; DOM = list[index]; index--) {
                evt = DOM.emit("tapEnd", true, DOM, clientX, clientY);
                if (beginList.indexOf(DOM) != -1) {
                    DOM.emit("tap", true, DOM);
                }
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
            //抬起事件冒泡
            for (let DOM, evt, index = 0; DOM = list[index]; index++) {
                evt = DOM.emit("tapEnd", false, DOM, clientX, clientY);
                if (beginList.indexOf(DOM) != -1) {
                    DOM.emit("tap", false, DOM);
                }
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
            //取消事件捕获
            for (let DOM, evt, index = beginList.length - 1; DOM = beginList[index]; index--) {
                if (list.indexOf(DOM) == -1) {
                    evt = DOM.emit("tapCancel", true, DOM, clientX, clientY);
                    if (evt.stopPro) {
                        evt.release();
                        return;
                    }
                }
            }
            //取消事件冒泡
            for (let DOM, evt, index = 0; DOM = beginList[index]; index++) {
                if (list.indexOf(DOM) == -1) {
                    evt = DOM.emit("tapCancel", false, DOM, clientX, clientY);
                    if (evt.stopPro) {
                        evt.release();
                        return;
                    }
                }
            }
        }.bind(this);
        this.onMove = function (e) {
            if (!e.buttons) {
                this.onTapEnd(e);
                return;
            }
            let t = this;
            let list = t.getDOM(e);
            let index = list.length - 1;
            let beginList = t.beginList;
            let { clientX, clientY } = e;
            //捕获
            for (let DOM, evt; DOM = list[index]; index--) {
                if (beginList.indexOf(DOM) == -1)
                    continue;
                evt = DOM.emit("tapMove", true, DOM, clientX, clientY);
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
            //冒泡
            for (let DOM, evt, index = 0; DOM = list[index]; index++) {
                if (beginList.indexOf(DOM) == -1)
                    continue;
                evt = DOM.emit("tapMove", false, DOM, clientX, clientY);
                if (evt.stopPro) {
                    evt.release();
                    return;
                }
            }
        }.bind(this);
        this.document = document;
        this.init();
    }
    init() {
        let canvas = this.document.canvas;
        canvas.addEventListener("mousedown", this.onTapBegin);
        canvas.addEventListener("mouseup", this.onTapEnd);
    }
    /**获取点击的节点列表 */
    getDOM(e) {
        let x = e.clientX;
        let y = e.clientY;
        let p = Point_1.default.createPiont(x, y);
        let list = [];
        this.document.iterator(this.document.children, (v) => {
            if (v.tapCount == 0 || !v.style.visible || !v.style.alpha)
                return;
            v.toLocal(p.setPoint(x, y));
            let res = v.contain(p.x, p.y);
            if (res) {
                list.push(v);
            }
        });
        p.release();
        return list;
    }
}
exports.default = DOMEvent;


/***/ }),

/***/ "./src/canvasDOM/event/Event.ts":
/*!**************************************!*\
  !*** ./src/canvasDOM/event/Event.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PlugC;
(function (PlugC) {
    let pool = [];
    class Event {
        constructor(type, usecapture = false) {
            this.type = "";
            this.stopPro = false;
            this.type = type;
            this.usecapture = usecapture;
            // this.bubbles = !usecapture;
        }
        stopPropagation() {
            this.stopPro = true;
        }
        release() {
            pool.push(this);
        }
        static create(type, usecapture = false) {
            let e = pool.pop();
            if (e) {
                e.type = type;
                e.usecapture = usecapture;
                // e.bubbles = !usecapture;
                e.stopPro = false;
            }
            else
                e = new PlugC.Event(type, usecapture);
            return e;
        }
        static factoty(type, usecapture = false, clientX = 0, clientY = 0, EventClass) {
            let t = EventClass ? EventClass : this;
            return t.create(type, usecapture, clientX, clientY);
        }
    }
    PlugC.Event = Event;
})(PlugC = exports.PlugC || (exports.PlugC = {}));


/***/ }),

/***/ "./src/canvasDOM/event/EventDispatch.ts":
/*!**********************************************!*\
  !*** ./src/canvasDOM/event/EventDispatch.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __webpack_require__(/*! ./Event */ "./src/canvasDOM/event/Event.ts");
const TouchEvent_1 = __webpack_require__(/*! ./TouchEvent */ "./src/canvasDOM/event/TouchEvent.ts");
let id = 0;
class EventDispatch {
    constructor() {
        /**只有内置点击事件才有冒泡和捕获 */
        this.bubblingMap = {}; //冒泡阶段触发
        this.captureMap = {}; //捕获阶段触发
        this.eventCount = 0;
        this.tapCount = 0; //当前对象监听的点击事件个数
        this.hashCode = id++;
    }
    emit(type, useCapture = false, target = undefined, clientX = undefined, clientY = undefined) {
        let map = useCapture ? this.captureMap[type] : this.bubblingMap[type];
        let e = this.createEvent(type, useCapture, clientX, clientY);
        e.currentTarget = this;
        e.target = target;
        if (map) {
            let index = 0, item;
            while (item = map[index++]) {
                item[0].call(item[1], e);
                if (e.stopPro)
                    break;
            }
        }
        return e;
    }
    /**触发非内置点击事件的事件 */
    dispatch(type, data) {
        let map = this.bubblingMap[type];
        if (!map)
            return;
        let e = Event_1.PlugC.Event.create(type);
        let index = 0, item;
        e.currentTarget = this;
        e.data = data;
        while (item = map[index++]) {
            item[0].call(item[1], e);
            if (e.stopPro)
                break;
        }
    }
    createEvent(type, useCapture = false, clientX = 0, clientY = 0) {
        let e;
        if (this.checkIsTapEvt(type))
            e = TouchEvent_1.TapEvent.create(type, useCapture, clientX, clientY);
        else
            e = Event_1.PlugC.Event.create(type, useCapture);
        return e;
    }
    checkIsTapEvt(type) {
        return type == "tapBegin" || type == "tapEnd" || type == "tapCancel" || type == "tapMove" || type == "tap";
    }
    addEventListener(type, fn, caller, useCapture = false) {
        if (this.hasEvent(type, fn, caller))
            return;
        this.eventCount++;
        let map = this.bubblingMap;
        if (!map[type])
            map[type] = [[fn, caller]];
        else
            map[type].push([fn, caller]);
        if (this.checkIsTapEvt(type)) { //useCapture && 
            map = this.captureMap;
            if (!map[type])
                map[type] = [[fn, caller]];
            else
                map[type].push([fn, caller]);
            this.tapCount++;
        }
    }
    removeEventListener(type, fn, caller, useCapture = false) {
        let index = this.indexOfEvent(fn, caller, this.bubblingMap[type]);
        if (index != -1) {
            this.bubblingMap[type].splice(index, 1);
            this.eventCount--;
        }
        index = this.indexOfEvent(fn, caller, this.captureMap[type]);
        if (index != -1) {
            this.captureMap[type].splice(index, 1);
            if (this.checkIsTapEvt(type))
                this.tapCount--;
        }
    }
    once(type, fn, caller, useCapture = false) {
        let func = (e) => {
            fn(e);
            this.removeEventListener(type, func, caller, useCapture);
        };
        this.addEventListener(type, func, caller);
    }
    on(type, fn, caller, useCapture = false) {
        this.addEventListener(type, fn, caller, useCapture);
    }
    off(type, fn, caller, useCapture = false) {
        this.removeEventListener(type, fn, caller, useCapture);
    }
    removeAllEvent() {
        let map = this.bubblingMap;
        for (let key in map) {
            delete map[key];
        }
        map = this.captureMap;
        for (let key in map) {
            delete map[key];
        }
    }
    /**
     * 判断是否有监听目标事件
     * @param type 事件标识符
     * @param fn 监听函数
     * @param caller 调用者
     */
    hasEvent(type, fn, caller) {
        let index = this.indexOfEvent(fn, caller, this.bubblingMap[type]);
        return index != -1;
    }
    indexOfEvent(fn, caller, list) {
        if (!list || !list.length)
            return -1;
        for (let item, index = 0; item = list[index]; index++) {
            if (item[0] == fn && item[1] == caller)
                return index;
        }
        return -1;
    }
}
exports.default = EventDispatch;


/***/ }),

/***/ "./src/canvasDOM/event/TouchEvent.ts":
/*!*******************************************!*\
  !*** ./src/canvasDOM/event/TouchEvent.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __webpack_require__(/*! ./Event */ "./src/canvasDOM/event/Event.ts");
let pool = [];
class TapEvent extends Event_1.PlugC.Event {
    constructor(type, usecapture = false, clientX = 0, clientY = 0) {
        super(type, usecapture);
        this.clientX = clientX;
        this.clientY = clientY;
    }
    static create(type, usecapture = false, clientX = 0, clientY = 0) {
        let e = pool.pop();
        if (e) {
            e.type = type;
            e.usecapture = usecapture;
            e.stopPro = false;
        }
        else
            e = new TapEvent(type, usecapture, clientX, clientY);
        return e;
    }
}
exports.TapEvent = TapEvent;


/***/ }),

/***/ "./src/canvasDOM/global/Global.ts":
/*!****************************************!*\
  !*** ./src/canvasDOM/global/Global.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// import CDocument from "../DOM/CDocument";
Object.defineProperty(exports, "__esModule", { value: true });
/**const */
// export const Document = new CDocument()
/**
 * 防抖，延迟一段时间后调用一次
 * @param fn 执行函数
 * @param timeout 第一次调用后延迟时间
 * @param callObj 调用对象
 * @param args 函数参数
 */
let debounceArr = [];
function debounce(fn, timeout, callObj, ...args) {
    let index = debounceArr.indexOf(fn);
    if (index >= 0)
        return;
    index = findFirstVoid(debounceArr);
    debounceArr[index] = fn;
    setTimeout(() => {
        fn.call(callObj, ...args);
        delete debounceArr[index];
    }, timeout);
}
exports.debounce = debounce;
/**
 * 防抖，立即调用一次（在规定的时间内只调用一次）
 * @param fn 执行函数
 * @param timeout 延迟时间
 * @param callObj 调用对象
 * @param args 函数参数
 */
let throttleArr = [];
function throttle(fn, timeout, callObj, ...args) {
    let index = throttleArr.indexOf(fn);
    if (index >= 0)
        return;
    index = findFirstVoid(throttleArr);
    throttleArr[index] = fn;
    fn.call(callObj, ...args);
    setTimeout(() => {
        delete throttleArr[index];
    }, timeout);
}
exports.throttle = throttle;
/**
 * 获取数组第一个空的或者值为false或者0的下标
 * @param arr 检查数组
 */
function findFirstVoid(arr) {
    let index = 0;
    while (arr[index++])
        ;
    return --index;
}
exports.findFirstVoid = findFirstVoid;


/***/ }),

/***/ "./src/canvasDOM/global/PlugC.ts":
/*!***************************************!*\
  !*** ./src/canvasDOM/global/PlugC.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SysTem;
(function (SysTem) {
    /**文件加载成功 */
    SysTem["LOAD_COMPLETE"] = "LOAD_COMPLETE";
    /**文件加载失败 */
    SysTem["LOAD_ERROR"] = "LOAD_ERROR";
    /**文件下载状态改变 */
    SysTem["READY_STATE_CHANGE"] = "READY_STATE_CHANGE";
    /**开始点击 */
    SysTem["TAP_BEGIN"] = "tapBegin";
    /**抬起 */
    SysTem["TAP_END"] = "tapEnd";
    /**点击取消 */
    SysTem["TAP_CANCEL"] = "tapCancel";
    /**移动 */
    SysTem["TAP_MOVE"] = "tapMove";
    /**点击 */
    SysTem["TAP"] = "tap";
    /**显示对象添加到节点 */
    SysTem["CHILD_ADD"] = "CHILD_ADD";
    /**显示子对象从显示列表移除 */
    SysTem["CHILD_REMOVE"] = "CHILD_REMOVE";
    /**显示对象完成，加载并且正确显示 */
    SysTem["DOM_COMPLETE"] = "DOM_COMPLETE";
    /**大小改变 */
    SysTem["RESIZE"] = "RESIZE";
    /**帧前事件 */
    SysTem["RENDER"] = "RENDER";
    /**缓动动画移除 */
    SysTem["TWEEN_REMOVE"] = "TWEEN_REMOVE";
})(SysTem = exports.SysTem || (exports.SysTem = {}));


/***/ }),

/***/ "./src/canvasDOM/math/Box.ts":
/*!***********************************!*\
  !*** ./src/canvasDOM/math/Box.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(/*! ./Matrix */ "./src/canvasDOM/math/Matrix.ts");
/**
 * 矩形盒子模型
 * [x,y,width,height]
 */
let pool = [];
class Box extends Matrix_1.default {
    get width() {
        return this.c;
    }
    set width(v) {
        this.c = v;
    }
    get height() {
        return this.d;
    }
    set height(v) {
        this.d = v;
    }
    get x() {
        return this.a;
    }
    set x(v) {
        this.a = v;
    }
    get y() {
        return this.b;
    }
    set y(v) {
        this.b = v;
    }
    get value() {
        return [this.a, this.b, this.c, this.d];
    }
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(x, y, width, height);
    }
    setBox(x = 0, y = 0, width = 0, height = 0) {
        this.setMatrix(x, y, width, height);
    }
    /**回收 */
    release() {
        this.setMatrix();
        pool.push(this);
    }
    /**
     * 获取两个盒子相交的部分
     * @returns [x,y,width,height]
     */
    intersect(box) {
        if (!Box.isCover(this, box))
            return null;
        //取靠右的为基准
        let referenceIdx = this.x >= box.x ? 0 : 1;
        let boxArr = [this, box];
        let [right, left] = [boxArr[referenceIdx], boxArr[1 - referenceIdx]];
        let [x0, y0, x1, y1] = [0, 0, 0, 0];
        x0 = right.x;
        y0 = Math.max(right.y, left.y);
        x1 = Math.min(right.x + right.width, left.x + left.width);
        y1 = Math.min(right.y + right.height, left.y + left.height);
        return Box.createBox(x0, y0, x1 - x0, y1 - y0);
    }
    /**
     * 获取刚好包围两个盒子的盒子
     * @param box
     */
    dirtyRect(box) {
        return Box.dirtyRect(this, box);
    }
    /**判断两个矩形是否有相交(碰撞) */
    static isCover(Box1, Box2) {
        return Box1.x + Box1.width > Box2.x &&
            Box2.x + Box2.width > Box1.x &&
            Box1.y + Box1.height > Box2.y &&
            Box2.y + Box2.height > Box1.y;
    }
    /**判断点是否在改矩形中 */
    static pointInside(box, point) {
        return box.x <= point.x &&
            box.y <= point.y &&
            box.x + box.width >= point.x &&
            box.y + box.height >= point.y;
    }
    /**工厂函数 */
    static createBox(x = 0, y = 0, width = 0, height = 0) {
        let box = pool.pop() || new Box();
        box.setBox(x, y, width, height);
        return box;
    }
    /**获取刚好包围多个盒子的大盒子 */
    static dirtyRect(...box) {
        let x0 = Math.min(...box.map((v) => v.x));
        let y0 = Math.min(...box.map((v) => v.y));
        let x1 = Math.max(...box.map((v) => v.x + v.width));
        let y1 = Math.max(...box.map((v) => v.y + v.height));
        return Box.createBox(x0, y0, x1 - x0, y1 - y0);
    }
    toString() {
        return `[${this.x},${this.y},${this.width},${this.height}]`;
    }
}
exports.default = Box;


/***/ }),

/***/ "./src/canvasDOM/math/Matrix.ts":
/*!**************************************!*\
  !*** ./src/canvasDOM/math/Matrix.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 矩阵数据结构
 * 用于模拟多种数据
 */
class Matrix {
    constructor(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0) {
        this.data = [a, b, c, d, e, f];
    }
    get a() {
        return this.data[0];
    }
    set a(v) {
        this.data[0] = v;
    }
    get b() {
        return this.data[1];
    }
    set b(v) {
        this.data[1] = v;
    }
    get c() {
        return this.data[2];
    }
    set c(v) {
        this.data[2] = v;
    }
    get d() {
        return this.data[3];
    }
    set d(v) {
        this.data[3] = v;
    }
    get e() {
        return this.data[4];
    }
    set e(v) {
        this.data[4] = v;
    }
    get f() {
        return this.data[5];
    }
    set f(v) {
        this.data[5] = v;
    }
    setMatrix(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0) {
        this.data = [a, b, c, d, e, f];
    }
    getMartrix() {
        return this.data;
    }
}
exports.default = Matrix;


/***/ }),

/***/ "./src/canvasDOM/math/Point.ts":
/*!*************************************!*\
  !*** ./src/canvasDOM/math/Point.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(/*! ./Matrix */ "./src/canvasDOM/math/Matrix.ts");
let pool = [];
class Point extends Matrix_1.default {
    constructor(x = 0, y = 0) {
        super(x, y);
    }
    get x() {
        return this.a;
    }
    set x(v) {
        this.a = v;
    }
    get y() {
        return this.b;
    }
    set y(v) {
        this.b = v;
    }
    get value() {
        return [this.a, this.b];
    }
    setPoint(x = 0, y = 0) {
        this.setMatrix(x, y);
        return this;
    }
    /**回收进对象池 */
    release() {
        this.setMatrix();
        pool.push(this);
    }
    copy(p) {
        this.data[0] = p.x;
        this.data[1] = p.y;
        return this;
    }
    /**
     * 两点叠加，可实现平移或者坐标系转化
     * @param point
     */
    add(point) {
        this.data[0] += point.x;
        this.data[1] += point.y;
        return this;
    }
    /**创建点对象 */
    static createPiont(x = 0, y = 0) {
        let point = pool.pop() || new Point();
        point.setMatrix(x, y);
        return point;
    }
}
exports.default = Point;


/***/ }),

/***/ "./src/canvasDOM/math/TransformMatrix.ts":
/*!***********************************************!*\
  !*** ./src/canvasDOM/math/TransformMatrix.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(/*! ./Matrix */ "./src/canvasDOM/math/Matrix.ts");
const anglePI = Math.PI / 180;
const sinMap = {};
const cosMap = {};
for (let i = 0; i < 360; i++) {
    sinMap[i] = Math.sin(i * anglePI);
}
for (let i = 0; i < 360; i++) {
    cosMap[i] = Math.cos(i * anglePI);
}
function sin(r) {
    let index = r < 0 ? -r : r;
    if (index >= 360)
        index %= 360;
    return r > 0 ? sinMap[index >> 0] : -sinMap[index >> 0];
    // let angle = r == 0 ? 0 : r * anglePI
    // return Math.sin(angle);
}
function cos(r) {
    if (r < 0)
        r *= -1;
    if (r >= 360)
        r %= 360;
    return cosMap[r >> 0];
    // let angle = r == 0 ? 0 : r * anglePI
    // return Math.cos(angle);
}
// function tan(r: number) {
//     let angle = r == 0 ? 0 : r * anglePI
//     return Math.tan(angle);
// }
/**
 * 装换矩阵
 * a 水平缩放绘图
 * b 水平倾斜绘图
 * c 垂直倾斜绘图
 * d 垂直缩放绘图
 * e 水平移动绘图
 * f 垂直移动绘图
 */
let pool = [];
class TransformMatrix extends Matrix_1.default {
    constructor(scaleX = 1, skewX = 0, skewY = 0, scaleY = 1, offsetX = 0, offsetY = 0) {
        super(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
    }
    setTransformMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY) {
        this.setMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
    }
    setByStyle(style) {
        let { rotate, scaleX, scaleY, anchorX, anchorY, x, y, scrollerX, scrollerY } = style;
        let rotateC = cos(rotate);
        let rotateS = sin(rotate);
        let tx = (x + scrollerX) * scaleX;
        let ty = (y + scrollerY) * scaleY;
        let a = rotateC * scaleX;
        let b = rotateS * scaleX;
        let c = -rotateS * scaleY;
        let d = rotateC * scaleY;
        //锚点实现，设置锚点不影响x,y位置，只是固定相对于显示对象（0，0）点，用于旋转
        if (anchorX != 0 || anchorY != 0) {
            let ancX = anchorX;
            let ancY = anchorY;
            let sx = ancX * a + c * ancY + tx; //不设锚点会移动到的位置
            let sy = ancX * b + d * ancY + ty;
            tx = tx + tx - (sx - ancX * scaleX);
            ty = ty + ty - (sy - ancY * scaleY);
        }
        this.setMatrix(a, b, c, d, tx, ty);
        //---------------------------------利用矩阵叠加实现-----------------------------------------
        // let matrix = this.translateMatrix(x - anchorX + scrollerX,y - anchorY + scrollerY);
        // if(rotate != 0) matrix.MatrixMulti(this.rotateMatrix(rotate));
        // if(scaleX != 1 || scaleY != 1) matrix.MatrixMulti(this.scaleMatrix(scaleX,scaleY));
        // this.setMatrix(...matrix.value());
    }
    /**
     * 矩阵乘法，物理意义，实现物体的矩阵的叠加变换
     * 直接改变当前矩阵
     * @param target 叠加的矩阵
     */
    MatrixMulti(target) {
        let [a2, b2, c2, d2, e2, f2] = [
            this.a * target.a + this.c * target.b,
            this.b * target.a + this.d * target.b,
            this.a * target.c + this.c * target.d,
            this.b * target.c + this.d * target.d,
            this.a * target.e + this.c * target.f + this.e,
            this.b * target.e + this.d * target.f + this.f
        ];
        this.setMatrix(a2, b2, c2, d2, e2, f2);
        return this;
    }
    //转换坐标系
    changeCoordinate(point, scaleX = 1, scaleY = 1) {
        this.data[4] += point.x * scaleX;
        this.data[5] += point.y * scaleY;
    }
    value() {
        return this.data;
    }
    rotateMatrix(angle) {
        angle = +angle;
        let [s, c] = angle !== 0 ? [cos(angle), sin(angle)] : [0, 1];
        let matrix = TransformMatrix.createTransFormMatrix(c, s, -s, c, 0, 0);
        return matrix;
    }
    scaleMatrix(sx, sy) {
        let matrix = TransformMatrix.createTransFormMatrix(sx, 0, 0, sy, 0, 0);
        return matrix;
    }
    translateMatrix(dx, dy) {
        let matrix = TransformMatrix.createTransFormMatrix(1, 0, 0, 1, dx, dy);
        return matrix;
    }
    /**矩阵求逆 */
    invertMartix() {
        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        let tx = this.e;
        let ty = this.f;
        if (b == 0 && c == 0) {
            this.b = this.c = 0;
            if (a == 0 || d == 0) {
                this.a = this.d = this.e = this.f = 0;
            }
            else {
                a = this.a = 1 / a;
                d = this.d = 1 / d;
                this.e = -a * tx;
                this.f = -d * ty;
            }
            return;
        }
        let determinant = a * d - b * c;
        if (determinant == 0) {
            this.setMatrix(1, 0, 0, 1, 0, 0);
            return;
        }
        determinant = 1 / determinant;
        let k = this.a = d * determinant;
        b = this.b = -b * determinant;
        c = this.c = -c * determinant;
        d = this.d = a * determinant;
        this.e = -(k * tx + c * ty);
        this.f = -(b * tx + d * ty);
    }
    /**把传入的点传化成当前矩阵变化后的点，直接改变目标点 */
    transFormPoint(p) {
        let [a, b, c, d, e, f] = this.data;
        let { x, y } = p;
        p.x = a * x + c * y + e;
        p.y = b * x + d * y + f;
        return p;
    }
    copy(m) {
        this.setMatrix(...m.value());
        return this;
    }
    clone() {
        return TransformMatrix.createTransFormMatrix(...this.value());
    }
    release() {
        this.setMatrix();
        pool.push(this);
    }
    static createTransFormMatrix(scaleX = 1, skewX = 0, skewY = 0, scaleY = 1, offsetX = 0, offsetY = 0) {
        let Matrix = pool.pop() || new TransformMatrix();
        Matrix.setTransformMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
        return Matrix;
    }
}
exports.default = TransformMatrix;


/***/ }),

/***/ "./src/canvasDOM/ui/Scroller.ts":
/*!**************************************!*\
  !*** ./src/canvasDOM/ui/Scroller.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const PlugC_1 = __webpack_require__(/*! ../global/PlugC */ "./src/canvasDOM/global/PlugC.ts");
const Box_1 = __webpack_require__(/*! ../math/Box */ "./src/canvasDOM/math/Box.ts");
const Global_1 = __webpack_require__(/*! ../global/Global */ "./src/canvasDOM/global/Global.ts");
class scroller {
    constructor() {
        this.horizontal = true; //是否允许水平滚动
        this.vertical = true; //是否允许垂直滚动
        this._scrollerV = 0; //距离顶部的距离
        this._scrollerH = 0; //距离左边的距离
        this.boundWidth = 0; //容器边界宽度
        this.boundHeight = 0; //容器边界高度
        this.scrollerwidth = 0; //滚动内容宽度
        this.scrollerHeight = 0; //滚动内容高度
        this.inAnimate = false; //是否处于滚动动画中
        this.touchTime = 0; //接触滚动列表的时长
        this.sign = {};
    }
    /**垂直滚动 */
    set scrollerV(v) {
        if (this.vertical) {
            this._scrollerV = v;
            if (this.scrollerObject.children) {
                for (let i of this.scrollerObject.children) {
                    i.style.scrollerY = v;
                }
            }
        }
    }
    get scrollerV() {
        return this._scrollerV;
    }
    /**水平滚动 */
    set scrollerH(v) {
        if (this.horizontal) {
            this._scrollerH = v;
            if (this.scrollerObject.children) {
                for (let i of this.scrollerObject.children) {
                    i.style.scrollerX = v;
                }
            }
        }
    }
    get scrollerH() {
        return this._scrollerH;
    }
    /**初始化滚动对象 */
    init(c) {
        this.scrollerObject = c;
        this.calcBasic();
    }
    debounce() {
        Global_1.debounce(this.calcBasic, 100, this);
    }
    calcBasic() {
        let c = this.scrollerObject;
        if (!c)
            return;
        let { width, height, scrollerWidth, scrollerheight } = c.style;
        let contentBox;
        if (scrollerWidth == 0) {
            contentBox = c.getContentBox();
            scrollerWidth = contentBox.x + contentBox.width;
        }
        if (scrollerheight == 0) {
            if (!contentBox)
                contentBox = c.getContentBox();
            scrollerheight = contentBox.y + contentBox.height;
        }
        this.boundWidth = width;
        this.boundHeight = height;
        this.scrollerwidth = scrollerWidth;
        this.scrollerHeight = scrollerheight;
        //默认整个容器作为滚动单位
        c.style.clip = Box_1.default.createBox(0, 0, width, height);
        this.initEvent();
    }
    initEvent() {
        let obj = this.scrollerObject;
        obj.on(PlugC_1.SysTem.TAP_BEGIN, this.onBegin, this);
        obj.on(PlugC_1.SysTem.TAP_MOVE, this.onMove, this);
        obj.on(PlugC_1.SysTem.TAP_CANCEL, this.onCancel, this);
        //内容大小改变
        this.scrollerObject.addEventListener(PlugC_1.SysTem.RESIZE, this.debounce, this);
    }
    onMove(e) {
        let [offX, offY] = [e.clientX - this.sign.x, e.clientY - this.sign.y];
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
        if (this.scrollerwidth > this.boundWidth && this.horizontal && offX != 0) {
            this.scrollerH += offX;
        }
        if (this.scrollerHeight > this.boundHeight && this.vertical && offY != 0) {
            this.scrollerV += offY;
        }
    }
    onBegin(e) {
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
        this.inAnimate = true;
        this.touchTime = Date.now();
    }
    onCancel(e) {
        this.sign.x = 0;
        this.sign.y = 0;
        this.inAnimate = false;
        this.touchTime = Date.now() - this.touchTime;
        //TODO 实现回弹或者快速滚动
    }
}
exports.default = scroller;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CImage_1 = __webpack_require__(/*! ./canvasDOM/DOM/CImage */ "./src/canvasDOM/DOM/CImage.ts");
const Box_1 = __webpack_require__(/*! ./canvasDOM/math/Box */ "./src/canvasDOM/math/Box.ts");
const CDocument_1 = __webpack_require__(/*! ./canvasDOM/DOM/CDocument */ "./src/canvasDOM/DOM/CDocument.ts");
const CDOMContainer_1 = __webpack_require__(/*! ./canvasDOM/DOM/CDOMContainer */ "./src/canvasDOM/DOM/CDOMContainer.ts");
const GlobalMgr_1 = __webpack_require__(/*! ./mgr/GlobalMgr */ "./src/mgr/GlobalMgr.ts");
const FileLoader_1 = __webpack_require__(/*! ./sourceModel/loader/FileLoader */ "./src/sourceModel/loader/FileLoader.ts");
const Scroller_1 = __webpack_require__(/*! ./canvasDOM/ui/Scroller */ "./src/canvasDOM/ui/Scroller.ts");
const Oberserve_1 = __webpack_require__(/*! ./DataStruct/Oberserve/Oberserve */ "./src/DataStruct/Oberserve/Oberserve.ts");
const Tween_1 = __webpack_require__(/*! ./tween/Tween */ "./src/tween/Tween.ts");
class Main {
    constructor() {
        this.stage = new CDocument_1.default();
        this.globalMgr = new GlobalMgr_1.GlobalMgr();
        this.start();
        this.test();
    }
    start() {
        let requestAnimationFrame = window.requestAnimationFrame;
        let loop = (t) => {
            GlobalMgr_1.TickerIns.run(t);
            this.stage.renderElement();
            requestAnimationFrame(loop);
        };
        loop(0);
    }
    test() {
        let g = new CDOMContainer_1.default();
        let sc = new Scroller_1.default();
        g.style.x = 50;
        g.style.y = 50;
        g.style.width = g.style.height = 600;
        sc.init(g);
        this.stage.appendChild(g);
        for (let i = 0; i < 10; i++) {
            let k = new CImage_1.default();
            k.src = "./test1.jpeg";
            k.style.x = 0;
            k.style.y = i * 100;
            g.appendChild(k);
        }
        let i = new CImage_1.default();
        i.src = "./test1.jpeg";
        i.style.x = 0;
        i.style.y = 0;
        i.style.rotate = 45;
        i.style.anchorX = 112;
        i.style.anchorY = 84;
        i.style.clip = Box_1.default.createBox(10, 10, 100, 100);
        this.stage.appendChild(i);
        Tween_1.default.get(i.style).to({ x: 500, y: 500 }, 5000, "easeOutQuart");
        // setInterval(()=>{
        //     i.style.x++
        // },50)
        // i.addEventListener("tapBegin",(e)=>{console.log(e);e.stopPropagation()},this,true)
        // i.addEventListener("tap",(e)=>{console.log("tap")},this)
        // i.addEventListener("tapMove",(e)=>{console.log("tapMove")},this)
        this.loadTest();
        let a = { name: { firstName: "a", lastName: "b" } };
        let w = Oberserve_1.default.watch(a);
        w.name.firstName = "ccc";
        console.log(w.name);
    }
    loadTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let loader = new FileLoader_1.FileLoader();
            let data = yield loader.loadAsync("./package.json");
            console.log(data);
        });
    }
}
new Main();


/***/ }),

/***/ "./src/mgr/GlobalMgr.ts":
/*!******************************!*\
  !*** ./src/mgr/GlobalMgr.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SourceMgr_1 = __webpack_require__(/*! ../sourceModel/SourceMgr */ "./src/sourceModel/SourceMgr.ts");
const EventDispatch_1 = __webpack_require__(/*! ../canvasDOM/event/EventDispatch */ "./src/canvasDOM/event/EventDispatch.ts");
const Ticker_1 = __webpack_require__(/*! ./Ticker */ "./src/mgr/Ticker.ts");
const Tween_1 = __webpack_require__(/*! ../tween/Tween */ "./src/tween/Tween.ts");
let TweenIns;
//全局管理器
class GlobalMgr {
    constructor() {
        this.init();
    }
    init() {
        exports.sysEventDispatch = new EventDispatch_1.default();
        exports.resource = new SourceMgr_1.SourceMgr();
        exports.TickerIns = new Ticker_1.default();
        TweenIns = new Tween_1.default();
    }
}
exports.GlobalMgr = GlobalMgr;


/***/ }),

/***/ "./src/mgr/Ticker.ts":
/*!***************************!*\
  !*** ./src/mgr/Ticker.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const FnHandle_1 = __webpack_require__(/*! ../DataStruct/Oberserve/FnHandle */ "./src/DataStruct/Oberserve/FnHandle.ts");
const Global_1 = __webpack_require__(/*! ../canvasDOM/global/Global */ "./src/canvasDOM/global/Global.ts");
/**
 * 添加帧执行事假
 * 当添加的执行函数返回值为false时，该函数会移除出循环执行队列
 */
class Ticker {
    constructor() {
        this._callMap = [];
        this.callMap = new Proxy(this._callMap, {
            deleteProperty(target, key) {
                target[key].release();
                delete target[key];
                return true;
            }
        });
    }
    /**
     * 添加循环执行函数
     * 返回该函数在循环队列中的id
     * @param fn
     * @returns number
     */
    add(fn) {
        if (this.has(fn))
            return;
        let id = Global_1.findFirstVoid(this.callMap);
        this.callMap[id] = fn;
        return id;
    }
    /**
     * 移除循环执行函数
     * @param target
     */
    remove(target) {
        if (target instanceof FnHandle_1.default) {
            let id = this.callMap.indexOf(target);
            if (id >= 0)
                delete this.callMap[id];
        }
        else if (typeof target == "number") {
            if (target >= 0)
                delete this.callMap[target];
        }
        else {
            throw "the remove target is not a right value!";
        }
    }
    /**
     * @private
     */
    run(t) {
        let idx = 0;
        for (let i of this.callMap) {
            if (i && i.run(t) == false)
                delete this.callMap[idx];
            idx++;
        }
    }
    has(fn) {
        return this.callMap.indexOf(fn) >= 0;
    }
}
exports.default = Ticker;


/***/ }),

/***/ "./src/sourceModel/SourceMgr.ts":
/*!**************************************!*\
  !*** ./src/sourceModel/SourceMgr.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**资源管理 */
class SourceMgr {
    constructor() {
        this.imgMap = {};
        this.JSONMap = {};
        this.TEXTMap = {};
    }
    getMap(type) {
        let map = {};
        switch (type) {
            case sourceType.image:
                map = this.imgMap;
                break;
            case sourceType.json:
                map = this.JSONMap;
                break;
            case sourceType.text:
                map = this.TEXTMap;
                break;
        }
        return map;
    }
    //判断文件类型
    checkFileType(url) {
        let index = url.lastIndexOf(".");
        if (index == -1)
            return sourceType.none;
        let excName = url.substr(url.lastIndexOf(".") + 1);
        if (excName == "json")
            return sourceType.json;
        else if (excName == "txt")
            return sourceType.text;
        else if (excName == "png" || excName == "jpg" || excName == "jepg")
            return sourceType.image;
        return sourceType.none;
    }
    hasRES(url) {
        return !!this.getRES(url);
    }
    getRES(url) {
        let map = this.getMap(this.checkFileType(url));
        return map[url];
    }
    //添加资源
    add(type, data, url) {
        let map = this.getMap(type);
        map[url] = data;
    }
    remove(type, url) {
        let map = this.getMap(type);
        delete map[url];
    }
}
exports.SourceMgr = SourceMgr;
var sourceType;
(function (sourceType) {
    sourceType[sourceType["none"] = 0] = "none";
    sourceType[sourceType["image"] = 1] = "image";
    sourceType[sourceType["json"] = 2] = "json";
    sourceType[sourceType["text"] = 3] = "text";
})(sourceType = exports.sourceType || (exports.sourceType = {}));


/***/ }),

/***/ "./src/sourceModel/loader/FileLoader.ts":
/*!**********************************************!*\
  !*** ./src/sourceModel/loader/FileLoader.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const EventDispatch_1 = __webpack_require__(/*! ../../canvasDOM/event/EventDispatch */ "./src/canvasDOM/event/EventDispatch.ts");
const PlugC_1 = __webpack_require__(/*! ../../canvasDOM/global/PlugC */ "./src/canvasDOM/global/PlugC.ts");
/**文件加载 */
class FileLoader extends EventDispatch_1.default {
    constructor() {
        super(...arguments);
        this.onReadystatechange = function (e) {
            let xhr = e.currentTarget;
            let loader = this;
            let status = loader.status = xhr.status;
            let readyState = loader.readyState = xhr.readyState;
            if (status == 200 && readyState == 4) {
                loader.dispatch(PlugC_1.SysTem.LOAD_COMPLETE, this.response = xhr.response);
                xhr.removeEventListener("readystatechange", this.onReadystatechange);
                xhr.removeEventListener("error", this.onError);
            }
            loader.dispatch(PlugC_1.SysTem.READY_STATE_CHANGE, readyState);
        }.bind(this);
        this.onError = function (e) {
            let xhr = e.currentTarget;
            let loader = this;
            xhr.removeEventListener("readystatechange", this.onReadystatechange);
            xhr.removeEventListener("error", this.onError);
            loader.dispatch(PlugC_1.SysTem.LOAD_ERROR, xhr.responseURL);
        }.bind(this);
    }
    /**
     * 同步加载方法
     * @param url 加载地址
     */
    load(url) {
        let xhr = new XMLHttpRequest();
        //不设置文件样式默认以二进制加载文件
        xhr.responseType = this.responseType || FileLoaderType.ARRAYBUFFER;
        xhr.addEventListener("readystatechange", this.onReadystatechange);
        xhr.addEventListener("error", this.onError);
        xhr.open("get", url);
        xhr.send();
    }
    /**
     * 异步加载方法
     * @param url 加载地址
     */
    loadAsync(url) {
        return new Promise((resolve, reject) => {
            this.load(url);
            this.once(PlugC_1.SysTem.LOAD_COMPLETE, () => {
                this.removeAllEvent();
                resolve(this.response);
            }, this);
            this.once(PlugC_1.SysTem.LOAD_ERROR, (e) => {
                this.removeAllEvent();
                reject(e.data);
            }, this);
        });
    }
}
exports.FileLoader = FileLoader;
/**加载文件类型 */
var FileLoaderType;
(function (FileLoaderType) {
    FileLoaderType["ARRAYBUFFER"] = "arraybuffer";
    FileLoaderType["TEXT"] = "text";
    FileLoaderType["BLOB"] = "blob";
    FileLoaderType["DOCUMENT"] = "document";
    FileLoaderType["JSON"] = "json";
})(FileLoaderType = exports.FileLoaderType || (exports.FileLoaderType = {}));


/***/ }),

/***/ "./src/sourceModel/loader/ImgLoader.ts":
/*!*********************************************!*\
  !*** ./src/sourceModel/loader/ImgLoader.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const EventDispatch_1 = __webpack_require__(/*! ../../canvasDOM/event/EventDispatch */ "./src/canvasDOM/event/EventDispatch.ts");
const GlobalMgr_1 = __webpack_require__(/*! ../../mgr/GlobalMgr */ "./src/mgr/GlobalMgr.ts");
const SourceMgr_1 = __webpack_require__(/*! ../SourceMgr */ "./src/sourceModel/SourceMgr.ts");
let pool = [];
class ImgLoader extends EventDispatch_1.default {
    constructor() {
        super(...arguments);
        this.data = null; //加载完成会将结果存放在此
        this.loadURL = null;
        this.loadingElement = null;
        this.loadComplete = function (e) {
            let data = this.data = this.loadingElement;
            let url = this.loadURL;
            this.loadingElement.removeEventListener("load", this.loadComplete);
            this.loadingElement.removeEventListener("error", this.loadError);
            GlobalMgr_1.resource.add(SourceMgr_1.sourceType.image, this.data, this.loadURL); //资源添加到资源管理器
            this.dispatch(ImgLoader.LOAD_COMPLETE, this.data); //通知外部资源加载完成
            let loaders = ImgLoader.awaitAndPrevent[url];
            if (loaders) {
                let loader;
                while (loader = loaders.pop()) {
                    loader.data = data;
                    loader.dispatch(ImgLoader.LOAD_COMPLETE, data);
                }
            }
            this.loadingElement = null;
        }.bind(this);
        this.loadError = function (e) {
            this.loadingElement.removeEventListener("load", this.loadComplete);
            this.loadingElement.removeEventListener("error", this.loadError);
            this.dispatch(ImgLoader.LOAD_ERROR, "fail load img " + this.loadURL);
            this.loadingElement = null;
        }.bind(this);
    }
    loadAsync(url) {
        return new Promise((resolve, reject) => {
            this.once(ImgLoader.LOAD_COMPLETE, (e) => {
                this.removeAllEvent();
                resolve(e.data);
            }, this);
            this.once(ImgLoader.LOAD_ERROR, (e) => {
                this.removeAllEvent();
                reject(e.data);
            }, this);
            this.load(url);
        });
    }
    load(url) {
        let data;
        if (data = GlobalMgr_1.resource.getRES(url)) { //已经加载
            this.dispatch(ImgLoader.LOAD_COMPLETE, data);
            return;
        }
        else if (ImgLoader.awaitAndPrevent[url]) { //正在加载
            ImgLoader.awaitAndPrevent[url].push(this);
            return;
        }
        ImgLoader.awaitAndPrevent[url] = [];
        let img = this.loadingElement = new Image();
        this.loadURL = img.src = url;
        img.addEventListener("load", this.loadComplete);
        img.addEventListener("error", this.loadError);
        img = null;
    }
    clearLoader() {
        this.data && (this.data = null);
        this.loadURL && (this.loadURL = null);
        if (this.loadingElement) {
            this.loadingElement.removeEventListener("load", this.loadComplete);
            this.loadingElement.removeEventListener("error", this.loadError);
            this.loadingElement = null;
        }
    }
    release() {
        this.clearLoader();
        if (pool.length >= ImgLoader.MAX_CACHE_COUNT)
            return; //最大缓存图片加载器
        pool.push(this);
    }
    static create() {
        let loader = pool.pop() || new ImgLoader();
        return loader;
    }
}
ImgLoader.awaitAndPrevent = {}; //正在加载的资源，避免重复加载
ImgLoader.LOAD_COMPLETE = "LOAD_COMPLETE";
ImgLoader.LOAD_ERROR = "LOAD_ERROR";
ImgLoader.MAX_CACHE_COUNT = 50; //最大缓存加载器个数
exports.ImgLoader = ImgLoader;


/***/ }),

/***/ "./src/tween/CubicBezier.ts":
/*!**********************************!*\
  !*** ./src/tween/CubicBezier.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.easeOutQuart = [0.165, 0.84, 0.44, 1];
class CubicBezier {
    /**
     * 获取贝塞尔参数
     * @param begin 开始值
     * @param end 结束值
     * @param time 变化时间
     * @param type 变化类型，控制贝塞尔曲线
     */
    getBezierargument(begin, end, time, type) {
        let args;
        switch (type) {
            case "easeOutQuart":
                args = exports.easeOutQuart;
                break;
        }
        let diff = end - begin;
        return [
            { x: 0, y: 0 },
            { x: args[0] * time, y: args[1] * diff },
            { x: args[2] * time, y: args[3] * diff },
            { x: time, y: diff }
        ];
    }
}
/**
 * 计算贝塞尔曲线
 * @param cp 贝塞尔控制点
 * @param t 时间
 */
function PointOnCubicBezier(cp, t) {
    var ax, bx, cx;
    var ay, by, cy;
    var tSquared, tCubed;
    var result = {};
    /*計算多項式係數*/
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;
    /*計算位於參數值t的曲線點*/
    tSquared = t * t;
    tCubed = tSquared * t;
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
}
exports.PointOnCubicBezier = PointOnCubicBezier;
exports.CubicBezierIns = new CubicBezier();


/***/ }),

/***/ "./src/tween/Tween.ts":
/*!****************************!*\
  !*** ./src/tween/Tween.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TweenProxy_1 = __webpack_require__(/*! ./TweenProxy */ "./src/tween/TweenProxy.ts");
const Global_1 = __webpack_require__(/*! ../canvasDOM/global/Global */ "./src/canvasDOM/global/Global.ts");
const GlobalMgr_1 = __webpack_require__(/*! ../mgr/GlobalMgr */ "./src/mgr/GlobalMgr.ts");
const PlugC_1 = __webpack_require__(/*! ../canvasDOM/global/PlugC */ "./src/canvasDOM/global/PlugC.ts");
class Tween {
    constructor() {
        GlobalMgr_1.sysEventDispatch.addEventListener(PlugC_1.SysTem.TWEEN_REMOVE, (e) => {
            let index = Tween.TweenList.indexOf(e.data);
            if (index >= 0)
                delete Tween.TweenList[index];
        }, this);
    }
    static get(o) {
        let t = TweenProxy_1.default.create().get(o);
        Tween.TweenList[Global_1.findFirstVoid(Tween.TweenList)] = t;
        return t;
    }
}
Tween.TweenList = [];
exports.default = Tween;


/***/ }),

/***/ "./src/tween/TweenProxy.ts":
/*!*********************************!*\
  !*** ./src/tween/TweenProxy.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CubicBezier_1 = __webpack_require__(/*! ./CubicBezier */ "./src/tween/CubicBezier.ts");
const FnHandle_1 = __webpack_require__(/*! ../DataStruct/Oberserve/FnHandle */ "./src/DataStruct/Oberserve/FnHandle.ts");
const GlobalMgr_1 = __webpack_require__(/*! ../mgr/GlobalMgr */ "./src/mgr/GlobalMgr.ts");
const PlugC_1 = __webpack_require__(/*! ../canvasDOM/global/PlugC */ "./src/canvasDOM/global/PlugC.ts");
let pool = [];
class TweenProxy {
    constructor() {
        this.prevent = false;
    }
    get(target) {
        this.target = target;
        return this;
    }
    to(props, time, type) {
        for (let k in props) {
            let start = this.target[k];
            let end = props[k];
            let args = CubicBezier_1.CubicBezierIns.getBezierargument(start, end, time, type);
            let fn = FnHandle_1.default.create((t) => {
                if (this.start == void 0) {
                    this.start = t;
                    this.end = t + time;
                }
                let p = CubicBezier_1.PointOnCubicBezier(args, t);
                if (this.prevent || p.x >= this.end) {
                    this.release();
                    return false;
                }
                this.target[k] = p.y;
                return true;
            }, this);
            GlobalMgr_1.TickerIns.add(fn);
        }
        return this;
    }
    stop() {
        this.prevent = true;
    }
    release() {
        this.prevent = false;
        this.target = this.start = this.end = void 0;
        GlobalMgr_1.sysEventDispatch.dispatch(PlugC_1.SysTem.TWEEN_REMOVE, this);
        pool.push(this);
    }
    static create() {
        return pool.pop() || new TweenProxy();
    }
}
exports.default = TweenProxy;


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map