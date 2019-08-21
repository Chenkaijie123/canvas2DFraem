import FnHandle from "./FnHandle";

export default class Observe {
    private static ProxyMap: { [id: number]: any } = {};
    private static actionMap: { [id: number]: { [key: string]: FnHandle[] } } = {};
    public static watch<T extends Object>(o: T): T {
        let w: any;
        w = Observe.createObserveProxy(o);
        for (let k in o) {
            if (typeof o[k] == "object") {
                w[k] = Observe.ProxyMap[o[k]["ObserveID"]] || Observe.watch(o[k]);
                if (w[k]["parents"] && (w[k]["parents"] as any[]).indexOf(w) != -1) {
                    (w[k]["parents"] as any[]).push(w)
                }
            }
        }
        return w;
    }

    public static bindAction(observe:any,actfn:Function,caller:any,key?:string,...args:any[]): void {
        let ObserveID = observe["ObserveID"];
        let proxyMap = Observe.ProxyMap[ObserveID]
        let keys = key?key.split(".") : [];
        for(let k in keys){
            proxyMap = proxyMap[k];
        }
        let actMap:FnHandle[]
        if(!keys.length){
            actMap = Observe.actionMap[ObserveID]["defaultCall"]
        }else if(proxyMap){
            actMap = Observe.actionMap[proxyMap["ObserveID"]][keys[keys.length - 1]]
        }
    }

    private static createObserveProxy<T extends Object>(o: T) {
        if (typeof o != "object") return null;
        if(o["ObserveID"] != void 0) return  Observe.ProxyMap[o["ObserveID"]];
        let onlyID = getID();
        Observe.actionMap[onlyID] = {};
        let w = new Proxy(o, {
            set(target, key, value, proxy) {
                if (Reflect.set(target, key, value)) {
                    Observe.run(proxy["ObserveID"], key as string)
                    return true;
                }
                return false;
            },
            get(target,key,proxy){
                if(!target || !proxy) return null;
                return Reflect.get(target,key);
            }
        })
        Observe.ProxyMap[onlyID] = w;
        w["ObserveID"] = o["ObserveID"] = onlyID;
        return w;
    }

    /**执行事件 */
    private static run(ObserveID: number, key: string): void {
        let actMap = Observe.actionMap[ObserveID][key];
        if (actMap) {
            for (let i of actMap) {
                i.run();
            }
        }
        actMap = Observe.actionMap[ObserveID]["defaultCall"];
        if(actMap){
            for (let i of actMap) {
                i.run();
            }
        }
        let parents:any[] = Observe.ProxyMap[ObserveID]["parents"];
        if(parents){
            for(let i of parents){
                let parActMap =  Observe.actionMap[i["ObserveID"]];
                for(let k in parActMap){
                    for(let i of parActMap[k]){
                        i.run()
                    }
                }
            }
        }
    }


}
function getID(): number {
    let id = 0;
    return (() => id++)();
}