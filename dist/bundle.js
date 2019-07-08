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
    pushIntoPool() {
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
        // let letf = Point.createPiont(
        //     Math.min(this.x, box.x),
        //     Math.min(this.y, box.y)
        // );
        // let right = Point.createPiont(
        //     Math.max(this.x + this.width, box.x + box.width),
        //     Math.max(this.y + this.height, box.y + box.height)
        // )
        // let resBox = Box.createBox(
        //     letf.x,
        //     letf.y,
        //     right.x - letf.x,
        //     right.y - letf.y
        // );
        // letf.pushIntoPool();
        // right.pushIntoPool();
        return Box.dirtyRect(this, box);
    }
    /**判断两个矩形是否有相交(碰撞) */
    static isCover(Box1, Box2) {
        return Box1.x + Box1.width > Box2.x &&
            Box2.x + Box2.width > Box1.x &&
            Box1.y + Box1.height > Box2.y &&
            Box2.y + Box2.height > Box1.y;
    }
    /**工厂函数 */
    static createBox(x = 0, y = 0, width = 0, height = 0) {
        let box = pool.pop() || new Box();
        box.setBox(x, y, width, height);
        return box;
    }
    /**获取刚好包围两个盒子的盒子 */
    static dirtyRect(...box) {
        let x0 = Math.min.apply(undefined, box.map((v) => v.x));
        let y0 = Math.min.apply(undefined, box.map((v) => v.y));
        let x1 = Math.max.apply(undefined, box.map((v) => v.x + v.width));
        let y1 = Math.max.apply(undefined, box.map((v) => v.y + v.height));
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
/**矩阵数据结构 */
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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Box_1 = __webpack_require__(/*! ./canvasDOM/math/Box */ "./src/canvasDOM/math/Box.ts");
class Main {
    constructor() {
        let b0 = Box_1.default.createBox(0, 0, 100, 100);
        let b1 = Box_1.default.createBox(0, 0, 100, 100);
        let b2 = Box_1.default.createBox(100, 100, 100, 100);
        let b3 = Box_1.default.createBox(50, 50, 100, 100);
        let b4 = Box_1.default.createBox(-50, -50, 300, 100);
        console.log(b0.dirtyRect(b2));
    }
}
new Main();


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map