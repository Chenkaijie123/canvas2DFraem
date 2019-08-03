/**
 * 数组
 */
export default class CArray<T> extends Array{

    public constructor(args?:T[]){
        super(args as any)
 
        let p = new Proxy(this,{
            get(target,key){
                console.log(target,key)
                new Array()[1]
                return target[key as any]
            },
            set(target,key,value){
                target[key as any] = value 
                console.log(target)
                return true
            }
        })

    }

}