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
        this.parent = null;
    }
    initCanvas() {
        let canvas = document.createElement("canvas");
        this.canvas = canvas;
        canvas.width = 1000;
        canvas.height = 600;
        canvas.id = "canvas";
        canvas.addEventListener("mousedown", (e) => {
            //简易实现点击效果
            let x = e.clientX;
            let y = e.clientY;
            let list = this.iterator(this.children, (v) => {
                let p = v.toGlobal(Point_1.default.createPiont(x, y));
                let res = v.contain(p.x, p.y);
                p.release();
                if (res) {
                    return v;
                }
            });
            console.log(list);
        });
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
        let anc = 0;
        let fn = (e) => {
            //重新计算需要重绘的数据
            if (e.reRender) {
                let style = e.style;
                e.matrix.setByStyle(style); //转换矩阵
                e.reRender = false;
            }
            ///-------test------------
            // e.matrix.setMatrix(2,0,0,1,112,100)
            //-----------------------
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
        let { width, height, x, y, anchorX, anchorY } = this.style;
        ctx.drawImage(this.treasure, 0, 0);
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
/**
 * 基础DOM
 */
let hashCode = 0;
class DOMBase {
    constructor() {
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
        // this.position = Point.createPiont();
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
        let { x, y } = point;
        let { a, b, c, d, e, f } = matrix;
        matrix.release();
        // let tempY = y;
        // y = ((x - e)/a - (tempY - f)/b)/(c/a - d/b)
        // x = (tempY - f  - d*y)/b
        let res = this.calc(a, b, c, d, e, f, x, y);
        point.x = res[0];
        point.y = res[1];
        return point;
    }
    /**计算矩阵方程 */
    calc(a, b, c, d, e, f, x, y) {
        let [_x, _y] = [-1, -1];
        if (a == 0) {
            if (b == 0 || c == 0) { //一般为不可能事件
            }
            else {
                _y = (x - e) / c;
                _x = (y - f - c * _y) / b;
            }
        }
        else {
            _y = (y - a * (b * x - b * e) - f) / (d - b * c / a);
            _x = (x - e - c * _y) / a;
        }
        return [_x, _y];
    }
    contain(_x, _y) {
        let { scaleX, scaleY, width, height, anchorX, anchorY } = this.style;
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
        let { rotate, scaleX, scaleY, anchorX, anchorY, x, y, width, height } = style;
        let rotateC = cos(rotate);
        let rotateS = sin(rotate);
        let tx = x * scaleX; //(x - anchorX) * scaleX;
        let ty = y * scaleY; //(y - anchorY) * scaleY;
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
        // let g = new CDOMContainer();
        // g.style.x = 50
        // g.style.y = 50
        // g.style.width = g.style.height = 600
        // this.stage.appendChild(g);
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
        this.stage.appendChild(i);
        // setInterval(()=>{
        //     i.style.rotate ++
        // },50)
        // let p = new CImage();
        // p.src = "./test.png"
        // p.style.anchorX = 50;
        // p.style.anchorY = 50
        // g.appendChild(p);
        // let t = new CText()
        // t.style.text = "你好"
        // t.style.fontFamily = "Arial"
        // t.style.x = 300
        // t.style.textColor = 0xFFF9E2
        // t.style.border = 2;
        // t.style.borderColor = 0x000000
        // t.style.rotate = 30
        // t.style.fontSize = 30;
        // t.style.anchorX = 30
        // t.style.anchorY = 15
        // setInterval(()=>{
        //     g.style.rotate++
        // },10)
        // g.appendChild(t)
        // let g1 = new CDOMContainer();
        // g.appendChild(g1)
        // let i2 = new CImage
        // i2.src = "./test.png"
        // g1.appendChild(i2)
        // i2.style.scaleX = .5;
        // setInterval(()=>{
        //     i2.style.x++
        // },10)
    }
}
new Main();


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map