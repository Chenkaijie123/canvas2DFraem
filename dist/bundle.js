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
    // let angle = r == 0 ? 0 : r / anglePI
    return Math.sin(r);
}
function cos(r) {
    // let angle = r == 0 ? 0 : r / anglePI
    return Math.cos(r);
}
function tan(r) {
    // let angle = r == 0 ? 0 : r / anglePI
    return Math.tan(r);
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
        let tx = (x + anchorX) * scaleX;
        let ty = (y + anchorY) * scaleY;
        let a = rotateC * scaleX;
        let b = rotateS * scaleX;
        let c = -rotateS * scaleY;
        let d = rotateC * scaleY;
        this.setMatrix(a, b, c, d, tx, ty);
    }
    value() {
        return this.data;
    }
    /**
     * 旋转
     * @param r 弧度
     */
    // public rotate(r:number):this{
    //     var co = cos(r),
    //     si = sin(r),
    //     mx = this.data,
    //     a = mx[0] * co + mx[2] * si,
    //     b = mx[1] * co + mx[3] * si,
    //     c = -mx[0] * si + mx[2] * co,
    //     d = -mx[1] * si + mx[3] * co;
    //     mx[0] = a;
    //     mx[1] = b;
    //     mx[2] = c;
    //     mx[3] = d;
    //     return this;
    // }
    // public skew(x:number,y:number):this{
    //     var tanX=tan(x),
    //     tanY=tan(y),
    //     mx = this.data,
    //     mx0=mx[0],
    //     mx1=mx[1];
    //     mx[0] += tanY*mx[2]; 
    //     mx[1] += tanY*mx[3]; 
    //     mx[2] += tanX*mx0; 
    //     mx[3] += tanX*mx1;
    //     return this;
    // }
    // public translate(x:number,y:number):this{
    //     let mx = this.data;
    //     mx[4] += x;
    //     mx[5] += y;
    //     return this;
    // }
    // public scale(x:number,y:number):this{
    //     var mx = this.data;
    //     if(x != 1){
    //         mx[0] *= x;
    //         mx[2] *= x;
    //         mx[4] *= x;
    //     }
    //     if(y != 1){
    //         mx[1] *= y;
    //         mx[3] *= y;
    //         mx[5] *= y;
    //     }
    //     return this;
    // }
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransformMatrix_1 = __webpack_require__(/*! ./canvasDOM/math/TransformMatrix */ "./src/canvasDOM/math/TransformMatrix.ts");
class Main {
    constructor() {
        // let b0 = Box.createBox(0,0,100,100)
        // let b1 = Box.createBox(0,0,100,100)
        // let b2 = Box.createBox(100,100,100,100)
        // let b3 = Box.createBox(50,50,100,100)
        // let b4 = Box.createBox(-50,-50,300,100)
        // console.log(b0.dirtyRect(b2))
        let s = "./test1.jpeg";
        let ma = TransformMatrix_1.default.createTransFormMatrix();
        let a = {
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
            rotate: 90,
            skewX: 0,
            skewY: 0,
        };
        ma.setByStyle(a);
        abc(ma.value());
    }
}
let img = new Image();
function load() {
    return new Promise((resolve, reject) => {
        img.src = "./test1.jpeg";
        img.onload = function () { resolve(); };
    });
}
function abc(a) {
    return __awaiter(this, void 0, void 0, function* () {
        let c = document.createElement("canvas");
        c.width = c.height = 2000;
        document.body.appendChild(c);
        let ctx = c.getContext("2d");
        yield load();
        ctx.setTransform(...a);
        // let t = 2
        // ctx.setTransform(
        //     t*Math.cos(45),
        //     t*Math.sin(45),
        //     -Math.sin(45),
        //     Math.cos(45),
        //     112,84)
        ctx.drawImage(img, 300, 300);
    });
}
window.onload = function () {
    new Main();
};


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map