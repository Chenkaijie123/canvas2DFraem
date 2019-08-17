let hashcode = 0;
export default class Oberserve{
    private static map:{[id:number]:{value:any,get:()=>any,set:(v:any)=>any}} = {}
    public static watch<T extends Object>(o:T):T{
        let w = 
        new Proxy(o,{
            set(target:T,key:string,value){
                console.log(value)
                return Reflect.set(target,key,value);
            }
        })
        w["$hashcode"] = hashcode++;
        return w
    }

    private basicDataWatch<T>(v:T):{value:T,get:()=>T,set:(v:T)=>any}{
        let o = {
            value:v,
            get(){return this.value},
            set(v:T){this.value = v},
            $hashcode:hashcode
        };
        
        Oberserve.map[hashcode++] = o;
        return o;
    }

    // private static watchDeep<T extends Object>(o:T):T{
        
    // }
}