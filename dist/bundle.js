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

/***/ "./src/canvasDOM/DOM/CDOMContainer.ts":
/*!********************************************!*\
  !*** ./src/canvasDOM/DOM/CDOMContainer.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DOMBase_1 = __webpack_require__(/*! ./DOMBase */ "./src/canvasDOM/DOM/DOMBase.ts");
/**容器类 */
class CDOMContainer extends DOMBase_1.DOMBase {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    appendChild(child) {
        if (child.parent == this)
            return this;
        child.removeSelf();
        this.children.push(child);
        child.parent = this;
        return this;
    }
    removeChild(child) {
        if (child.parent == void 0)
            return this;
        let index = this.children.indexOf(child);
        this.children.splice(index, 1);
        child.parent = null;
        return this;
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
    sysRender() {
        //todo
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let loot = this.children;
        let fn = (e) => {
            //重新计算需要重绘的数据
            if (e.reRender) {
                let style = e.style;
                e.matrix.setByStyle(style); //转换矩阵
                e.reRender = false;
            }
            if (e.parent instanceof CDocument) {
                this.context.setTransform(...e.matrix.value());
            }
            else {
                this.context.transform(...e.matrix.value());
            }
            e.render(this.context);
        };
        // let t = Date.now()
        this.iterator(loot, fn);
        // console.log(Date.now() - t)
    }
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
            if (i.parent instanceof CDocument) {
                ctx.setTransform.apply(ctx, i.matrix.value());
            }
            else {
                ctx.transform.apply(ctx, i.matrix.value());
            }
            if (i.style.clip) {
                let clip = i.style.clip;
                if (clip.width <= 0 || clip.height <= 0)
                    continue;
                ctx.save();
                ctx.beginPath();
                ctx.rect(clip.x, clip.y, clip.width, clip.height);
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
class CImage extends DOMBase_1.DOMBase {
    get src() {
        return this._src;
    }
    set src(url) {
        if (this._src != url) {
            this.treasure = null;
            let loader = ImgLoader_1.ImgLoader.create();
            loader.once(ImgLoader_1.ImgLoader.LOAD_COMPLETE, (e) => {
                this.treasure = e.data;
                this.style.width = this.treasure.width;
                this.style.height = this.treasure.height;
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
        let img = this.treasure;
        if (!img)
            return;
        ctx.drawImage(img, 0, 0);
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
const EventDispatch_1 = __webpack_require__(/*! ../event/EventDispatch */ "./src/canvasDOM/event/EventDispatch.ts");
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
            clip: null
        };
        this.reRender = true;
        this.matrix = TransformMatrix_1.default.createTransFormMatrix();
    }
    reset() {
    }
    render(ctx) { }
    /**
     * 把处于当前坐标系的point点装换为全局的坐标
     * @param point
     */
    toGlobal(point) {
        let matrix = this.getMatrixMul();
        matrix.invertMartix();
        matrix.transFormPoint(point);
        matrix.release();
        return point;
    }
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
            v.toGlobal(p.setPoint(x, y));
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
        return type == "tapBegin" || type == "tapEnd" || type == "tapCancel" || type == "tapMove";
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
        // let matrix = this.translateMatrix(x - anchorX,y - anchorY);
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
class scroller {
    constructor() {
        this.horizontal = true; //是否允许水平滚动
        this.vertical = true; //是否允许垂直滚动
        this._scrollerV = 0; //距离顶部的距离
        this._scrollerH = 0; //距离左边的距离
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
                    i.style.scrollerY = v;
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
        let { x, y, width, height } = c.style;
        c.style.clip = Box_1.default.createBox(x, y, width, height);
        this.initEvent();
    }
    initEvent() {
        let obj = this.scrollerObject;
        obj.on(PlugC_1.SysTem.TAP_BEGIN, this.onBegin, this);
        obj.on(PlugC_1.SysTem.TAP_MOVE, this.onMove, this);
        obj.on(PlugC_1.SysTem.TAP_CANCEL, this.onCancel, this);
    }
    onMove(e) {
        let [offX, offY] = [e.clientX - this.sign.x, e.clientY - this.sign.y];
        console.log(offX, offY);
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
        if (this.horizontal && offX != 0) {
            this.scrollerH += offX;
        }
        if (this.vertical && offY != 0) {
            this.scrollerH += offY;
        }
    }
    onBegin(e) {
        this.sign.x = e.clientX;
        this.sign.y = e.clientY;
    }
    onCancel(e) {
        this.sign.x = null;
        this.sign.y = null;
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
class Main {
    constructor() {
        this.stage = new CDocument_1.default();
        this.globalMgr = new GlobalMgr_1.GlobalMgr();
        this.start();
        this.test();
    }
    start() {
        let requestAnimationFrame = window.requestAnimationFrame;
        let loop = () => {
            // this.stage.sysRender();
            this.stage.renderElement();
            requestAnimationFrame(loop);
        };
        loop();
    }
    test() {
        let g = new CDOMContainer_1.default();
        let sc = new Scroller_1.default();
        g.style.x = 50;
        g.style.y = 50;
        g.style.width = g.style.height = 600;
        sc.init(g);
        this.stage.appendChild(g);
        for (let i = 0; i < 5; i++) {
            let k = new CImage_1.default();
            k.src = "./test1.jpeg";
            k.style.x = i * 10;
            k.style.y = i * 10;
            g.appendChild(k);
        }
        // g.addEventListener("click",(e)=>{e.stopPropagation()},this)
        // let i1 = new CImage();
        // i1.src = "./test1.jpeg"
        // i1.style.x = 300;
        // i1.style.y = 300;
        // this.stage.appendChild(i1);
        let i = new CImage_1.default();
        i.src = "./test1.jpeg";
        i.style.x = 300;
        i.style.y = 300;
        // i.style.scaleX = .5
        i.style.rotate = 45;
        i.style.anchorX = 112;
        i.style.anchorY = 84;
        i.style.clip = Box_1.default.createBox(10, 10, 100, 100);
        g.appendChild(i);
        setInterval(() => {
            i.style.rotate++;
        }, 50);
        i.addEventListener("tapBegin", (e) => { console.log(e); e.stopPropagation(); }, this, true);
        i.addEventListener("tap", (e) => { console.log("tap"); }, this);
        i.addEventListener("tapMove", (e) => { console.log("tapMove"); }, this);
        this.loadTest();
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
//全局管理器
class GlobalMgr {
    constructor() {
        this.init();
    }
    init() {
        exports.resource = new SourceMgr_1.SourceMgr();
    }
}
exports.GlobalMgr = GlobalMgr;


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
        if (pool.length > 50)
            return; //最大缓存51个图片加载器
        this.clearLoader();
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
exports.ImgLoader = ImgLoader;


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map