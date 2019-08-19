let hashcode = 0;
export default class Oberserve {
    private static map: { [id: number]: { [key: string]: FunctionHandle[] } } = {}
    public static watch<T extends Object>(o: T): T {
        let w = new Proxy(o, {
            set(target: T, key: string, value, proxy) {
                if (Reflect.set(target, key, value)) {
                    let target = Oberserve.map[proxy["$hashcode"]];
                    let targerCall = target[key]
                    let defaultCall = target["defaultCall"];
                    if (targerCall) {
                        for (let i of targerCall)
                            i.fn.call(i.caller, key, value, ...i.args);
                    }
                    if (defaultCall) {
                        for (let i of defaultCall)
                            i.fn.call(i.caller, key, value, ...i.args);
                    }
                    return true;
                }
                return false;
            }
        })
        let onlyKey = hashcode++
        Oberserve.map[onlyKey] = {};
        w["$hashcode"] = onlyKey;
        return w;
    }

    /**
     * 绑定行为
     * @param proxy 
     */
    public static bindAction(proxy: any, fns: FunctionHandle, key?: string): void {

    }

    private basicDataWatch(v) {
        let o = {
            value: v,
        };
        let w = new Proxy(o, {
            get(key) { },
            set(target, key, value) {
                if (Reflect.set(target, key, value)) {
                    return true;
                }
                return false;
            }
        })
        w["$hashcode"] = hashcode++;
        return w;

    }

    private static watchDeep<T extends Object>(o: T): T {
        let w = Oberserve.createProxy(o);
        for (let k in o) {
            if (o[k] instanceof Object) {
                let p = Oberserve.createProxy(o[k]);
                w[k] = p;
            }
        }
        return w;
    }

    private static createProxy<T extends Object>(o: T): T{
        let w = new Proxy(o, {
            set(target: T, key: string, value, proxy) {
                if (Reflect.set(target, key, value)) {
                    let target = Oberserve.map[proxy["$hashcode"]];
                    let targerCall = target[key]
                    let defaultCall = target["defaultCall"];
                    if (targerCall) {
                        for (let i of targerCall)
                            i.fn.call(i.caller, key, value, ...i.args);
                    }
                    if (defaultCall) {
                        for (let i of defaultCall)
                            i.fn.call(i.caller, key, value, ...i.args);
                    }
                    return true;
                }
                return false;
            }
        })
        let onlyKey = hashcode++
        Oberserve.map[onlyKey] = {};
        w["$hashcode"] = onlyKey;
        return w;
    }
}

interface FunctionHandle {
    fn: Function, caller: object, args: any[]
}
