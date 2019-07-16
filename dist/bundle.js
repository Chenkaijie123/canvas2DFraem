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
const Point_1 = __webpack_require__(/*! ../math/Point */ "./src/canvasDOM/math/Point.ts");
/**虚拟文本 */
class CDocument extends CDOMContainer_1.default {
    constructor() {
        super();
        this.parent = this;
    }
    initCanvas() {
        let canvas = document.createElement("canvas");
        this.canvas = canvas;
        canvas.width = 1000;
        canvas.height = 600;
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
                let p = Point_1.default.createPiont(style.x, style.y);
                p.add(e.parent.position);
                e.position.copy(p);
                p.release();
                e.matrix.setByStyle(style); //转换矩阵
                e.matrix.changeCoordinate(e.position, style.scaleX, style.scaleY);
                e.reRender = false;
            }
            e.render(this.context);
        };
        let t = Date.now();
        this.iterator(loot, fn);
        console.log(Date.now() - t);
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
class CImage extends DOMBase_1.DOMBase {
    get src() {
        return this._src;
    }
    set src(url) {
        if (this._src != url) {
            this._src = url;
            this.treasure.src = url;
            let _t = this;
            function load() {
                _t.style.width = this.width;
                _t.style.height = this.height;
                _t.treasure.removeEventListener("load", load);
                _t.treasure.removeEventListener("error", err);
                !_t.reRender && (_t.reRender = true);
            }
            function err(e) {
                console.error(e);
                _t.treasure.removeEventListener("load", load);
                _t.treasure.removeEventListener("error", err);
            }
            this.treasure.addEventListener("load", load);
            this.treasure.addEventListener("error", err);
        }
    }
    constructor() {
        super();
        this.type = "CImage";
        this.treasure = new Image();
    }
    render(ctx) {
        ctx.setTransform(...this.matrix.value());
        ctx.drawImage(this.treasure, -this.style.anchorX, -this.style.anchorY);
    }
}
exports.default = CImage;


/***/ }),

/***/ "./src/canvasDOM/DOM/CText.ts":
/*!************************************!*\
  !*** ./src/canvasDOM/DOM/CText.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DOMBase_1 = __webpack_require__(/*! ./DOMBase */ "./src/canvasDOM/DOM/DOMBase.ts");
const TransformMatrix_1 = __webpack_require__(/*! ../math/TransformMatrix */ "./src/canvasDOM/math/TransformMatrix.ts");
const Point_1 = __webpack_require__(/*! ../math/Point */ "./src/canvasDOM/math/Point.ts");
class CText extends DOMBase_1.DOMBase {
    get style() {
        return this.proxy;
    }
    set style(v) {
        this._style = v;
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
            fontSize: 24,
            fontFamily: "微软雅黑",
            textColor: 0xffffff,
            border: 0,
            borderColor: null,
            bold: false,
            text: "",
            textAlign: "left",
            fontStyle: "normal",
        };
        this.reRender = true;
        this.listenerMap = {};
        this.matrix = TransformMatrix_1.default.createTransFormMatrix();
        this.position = Point_1.default.createPiont();
    }
    render(ctx) {
        ctx.setTransform(...this.matrix.value());
        let style = `${this.style.fontStyle} normal ${this.style.bold ? "bold" : "normal"} ${this.style.fontSize}px ${this.style.fontFamily}`;
        if (ctx.font != style)
            ctx.font = style;
        let color = `#${this.style.textColor.toString(16)}`;
        if (ctx.fillStyle != color)
            ctx.fillStyle = color;
        ctx.fillText(this.style.text, this.style.anchorX, this.style.anchorY);
        if (this.style.border > 0) {
            color = `#${this.style.borderColor.toString(16)}`;
            if (ctx.strokeStyle != color)
                ctx.strokeStyle = color;
            ctx.strokeText(this.style.text, this.style.anchorX, this.style.anchorY);
        }
        // console.log(ctx.measureText(this.style.text))
    }
}
exports.default = CText;


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
/**
 * 基础DOM
 */
class DOMBase {
    constructor() {
        //留下的扩展接口
        this.proxyHandle = (target, key, newData, proxy) => { };
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
    once(type, listener, caller) {
        function fn() {
            listener.call(caller);
            this.removeEventListener(type, fn, caller);
        }
        this.addEventListener(type, fn, caller);
    }
    addEventListener(type, listener, caller) {
        if (!this.hasEvent(type, listener, caller)) {
            if (!this.listenerMap[type])
                this.listenerMap[type] = [];
            this.listenerMap[type].push([listener, caller]);
        }
    }
    removeEventListener(type, listener, caller) {
        this.hasEvent(type, listener, caller, true);
    }
    hasEvent(type, listener, caller, remove = false) {
        let map = this.listenerMap[type];
        let idx = 0;
        for (let i of map) {
            if (i[0] == listener && i[1] == caller) {
                if (remove)
                    map.splice(idx, 1);
                return true;
            }
            idx++;
        }
        return false;
    }
    emit(type) {
        let map = this.listenerMap[type];
        for (let i of map) {
            i[0].call(i[1]);
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
        };
        this.reRender = true;
        this.listenerMap = {};
        this.matrix = TransformMatrix_1.default.createTransFormMatrix();
        this.position = Point_1.default.createPiont();
    }
    reset() {
    }
    render(ctx) { }
}
exports.DOMBase = DOMBase;


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
function sin(r) {
    let angle = r == 0 ? 0 : r * anglePI;
    return Math.sin(angle);
}
function cos(r) {
    let angle = r == 0 ? 0 : r * anglePI;
    return Math.cos(angle);
}
function tan(r) {
    let angle = r == 0 ? 0 : r * anglePI;
    return Math.tan(angle);
}
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
        let { rotate, scaleX, scaleY, anchorX, anchorY, x, y } = style;
        let rotateC = cos(rotate);
        let rotateS = sin(rotate);
        let tx = (x + anchorX) * scaleX;
        let ty = (y + anchorY) * scaleY;
        let a = rotateC * scaleX;
        let b = rotateS * scaleX;
        let c = -rotateS * scaleY;
        let d = rotateC * scaleY;
        this.setMatrix(a, b, c, d, tx, ty);
    }
    //转换坐标系
    changeCoordinate(point, scaleX = 1, scaleY = 1) {
        this.data[4] += point.x * scaleX;
        this.data[5] += point.y * scaleY;
    }
    value() {
        return this.data;
    }
    static createTransFormMatrix(scaleX = 1, skewX = 0, skewY = 0, scaleY = 1, offsetX = 0, offsetY = 0) {
        let Matrix = pool.pop() || new TransformMatrix();
        Matrix.setTransformMatrix(scaleX, skewX, skewY, scaleY, offsetX, offsetY);
        return Matrix;
    }
}
exports.default = TransformMatrix;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CImage_1 = __webpack_require__(/*! ./canvasDOM/DOM/CImage */ "./src/canvasDOM/DOM/CImage.ts");
const CDocument_1 = __webpack_require__(/*! ./canvasDOM/DOM/CDocument */ "./src/canvasDOM/DOM/CDocument.ts");
const CDOMContainer_1 = __webpack_require__(/*! ./canvasDOM/DOM/CDOMContainer */ "./src/canvasDOM/DOM/CDOMContainer.ts");
const CText_1 = __webpack_require__(/*! ./canvasDOM/DOM/CText */ "./src/canvasDOM/DOM/CText.ts");
class Main {
    constructor() {
        this.stage = new CDocument_1.default();
        this.start();
        this.test();
    }
    start() {
        let requestAnimationFrame = window.requestAnimationFrame;
        let loop = () => {
            this.stage.sysRender();
            requestAnimationFrame(loop);
        };
        loop();
    }
    test() {
        let g = new CDOMContainer_1.default();
        g.style.x = 50;
        g.style.y = 50;
        this.stage.appendChild(g);
        let i = new CImage_1.default();
        i.src = "./test1.jpeg";
        i.style.x = 0;
        i.style.y = 0;
        i.style.rotate = 45;
        i.style.anchorX = 112;
        i.style.anchorY = 84;
        this.stage.appendChild(i);
        let p = new CImage_1.default();
        p.src = "./test.png";
        g.appendChild(p);
        let t = new CText_1.default();
        t.style.text = "你好";
        t.style.fontFamily = "Arial";
        t.style.x = 300;
        t.style.textColor = 0xFFF9E2;
        t.style.border = 2;
        t.style.borderColor = 0x000000;
        t.style.rotate = 30;
        t.style.fontSize = 30;
        t.style.anchorX = 30;
        t.style.anchorY = 15;
        setInterval(() => {
            t.style.rotate++;
        }, 10);
        g.appendChild(t);
        let temp = 0;
        for (let k = 0; k < 100; k++) {
            let img = new CText_1.default();
            img.style.text = `text${k}`;
            img.style.x = temp + k * 1;
            img.style.y = temp + k * 3;
            g.appendChild(img);
        }
    }
}
new Main();


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map