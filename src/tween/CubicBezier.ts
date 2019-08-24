export const easeOutQuart :bezierPoint[]= [{ x: 0, y: 0 },{ x: 0.165, y: 0.84 },{ x: 0.44, y: 1 },{ x: 1, y: 1 }]
class CubicBezier {
    /**
     * 获取贝塞尔参数
     * @param begin 开始值
     * @param end 结束值
     * @param time 变化时间
     * @param type 变化类型，控制贝塞尔曲线
     */
    getBezierargument<k extends keyof CubicBezierType>(begin: number, end: number, time: number, type: CubicBezierType[k]): bezierPoint[] {
        switch (type) {
            case "easeOutQuart":
                return easeOutQuart;
        }
        // return easeOutQuart;
    }
}

/**
 * 计算贝塞尔曲线
 * @param cp 贝塞尔控制点
 * @param t 时间
 */
export function PointOnCubicBezier(cp: bezierPoint[], t: number): bezierPoint {
    var ax: number, bx: number, cx: number;
    var ay: number, by: number, cy: number;
    var tSquared: number, tCubed: number;
    var result = {} as bezierPoint;
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
export const CubicBezierIns = new CubicBezier();

export interface CubicBezierType {
    easeOutQuart: "easeOutQuart"
}

type bezierPoint = {
    x: number, y: number
}