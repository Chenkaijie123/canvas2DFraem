export class HashMap<T>{
    //所有源数据
    private source: Array<T> = [];
    //保存源数据的映射关系
    private indexMap: Array<string | number> = [];
    //映射表
    private map: { [key: string]: T } = {};
    constructor() { }

    /**
     * 获取所有哈希表所有key
     */
    public Keys(): Array<string | number> {
        return this.indexMap;
    }

    public add(key: string | number, value: T): this {
        let map = this.map;
        if (map[key] != void 0) {
            let index = this.source.indexOf(map[key]);
            this.source.splice(index, 1, map[key]);
            this.indexMap.splice(index, 1, key);
        } else {
            this.indexMap.push(key);
            this.source.push(value);
        }
        map[key] = value;
        return this;
    }

    public remove(value: T): T {
        let index = this.source.indexOf(value);
        if (index >= 0) {
            this.source.splice(index, 1);
            let keys = this.indexMap.splice(index, 1);
            delete this.map[keys[0]];
            return value;
        }
        return null;
    }

    public get lenght(): number {
        return this.source.length;
    }

    /**
     * 函数执行结果为true会被清除
     * @param fn 迭代函数
     */
    public clear(fn: (value: T) => boolean) {
        let source = this.source;
        let temp:T;
        let index = 0;
        while ((temp = source[index]) != void 0) {
            let resault = fn.call(temp,temp)
            if (resault) this.remove(source[index])
            else index++;
        }
    }

    /**
     * 暴力清除所有
     */
    public clearAll(): void {
        let source = this.source;
        let index = 0;
        while (source[index]) {
            this.remove(source[index++])
        }
    }

    public getItem(key:string|number):T{
        return this.map[key]
    }
}