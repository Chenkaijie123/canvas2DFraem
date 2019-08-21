export default class Iterator {
    /**
     * 遍历数组
     * @param operator 操作数组
     * @param fn 执行函数
     * @returns fn执行后返回值组成的数组
     */
    static mapArray<T, U>(operator: T[], fn: (v: T, index: number, arr: T[]) => U): U[] {
        let arr = []
        for (let i: number = 0, len = operator.length; i < len; i++) {
            arr.push(fn(operator[i], i, operator));
        }
        return arr;
    }

    /**
     * 遍历对象
     * @param operator 操作对象
     * @param fn 执行函数
     * @returns 对应key值为执行函数结果
     */
    static mapObject<T extends Object, U, k extends keyof T>(operator: T, fn: (v: T[k], index: string, arr: T) => U): { [key: string]: U } {
        let res = {};
        let keys: string
        for (let key in operator) {
            keys = key;
            res[keys] = fn(operator[keys], keys, operator);
        }
        return res;
    }

    /**
     * 遍历可以遍历的对象
     * @param o 遍历对象
     * @param fn 执行函数，返回值则不继续执行
     */
    static operator(o: Object, fn: (v: any, key: string, o: Object) => boolean): void {
        for(let k in o){
            if(fn(o[k],k,o)) return;
        }
    }


}