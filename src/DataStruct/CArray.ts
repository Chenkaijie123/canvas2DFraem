/**
 * 数组
 */
export default class CArray<T> extends Array{

    constructor(...element: T[]) {
        super(...element as any);
        let t = this;
        return new Proxy(t, {
            get(target, key) {
                let hash = t.parseKey(key as any);
                return target[hash];
            },
            set(target, key, value) {
                let hash = t.parseKey(key as any);
                target[hash] = value;
                return true
            },

        })
    }

    slice(start?:number,end?:number):CArray<T>{
        return this.toCArray.call(super.slice(start,end))
    }
    shift():T{
        return super.shift();
    }

    pop():T{
        return super.pop();
    }

    push(...item:T[]):number{
        return super.push(...item);
    }

    unshift(...item:T[]):number{
        return super.unshift(...item)
    }

    concat(...items: (T | ConcatArray<T>)[]):CArray<T>{
        
        let res = super.concat(...items)
        return this.toCArray.call(res)
    }

    reverse(): CArray<T>{
        return this.toCArray.call(super.reverse())
    }

    splice(start: number, deleteCount?: number,...items: T[]): CArray<T>{
        return this.toCArray.call(super.splice(start,deleteCount,...items))
    }

    map<U>(fn:(value:T,index:number,arr:this)=>U,...args:any[]):CArray<U>{
        let res = [];
        for(let i:number = 0,len = this.length;i< len;i++){
            res.push(fn.call(this,this[i],i,this,...args))
        }
        return this.toCArray.call(res)
    }


    private parseKey(key: string | number): number | string {
        if(typeof key == "symbol") return key;
        let _key: number | string = Number(key);
        if (_key != _key) {
            _key = key;
        } else {
            if (_key < 0) {
                _key = this.length + _key > 0 ? this.length + _key : 0;
            }
        }
        return _key;
    }

    private toCArray():CArray<T>{
        let t = this;
        this["__proto__"] = proto;
        return new Proxy(t, {
            get(target, key) {
                let hash = t.parseKey(key as any);
                return target[hash];
            },
            set(target, key, value) {
                let hash = t.parseKey(key as any);
                target[hash] = value;
                return true
            },

        })
    }
}

let proto = new CArray()