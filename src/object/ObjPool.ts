import { HashMap } from "../mapUtil/HashMap"
export class ObjPool {
    private pool: HashMap<Array<any>> = new HashMap()
    constructor() { }

    public pop<T>(c: new () => T): T {
        let pool: Array<any>
        if (pool = this.pool.getItem(c.name)) return pool.pop();
        return new c();
    }

    public push(v: any): void {
        let key = ObjPool.getClassName(v);
        if (key) {
            let target = this.pool.getItem(key)
            if (target) {
                target.push(v)
            } else {
                this.pool.add(key, [v]);
            }
        }
    }

    public static getClassName<T>(obj: T): string {
        if (obj && obj.constructor && obj.constructor.toString()) {
            /*
             * for browsers which have name property in the constructor
             * of the object,such as chrome 
             */
            if (obj.constructor.name) {
                return obj.constructor.name;
            }
            var str = obj.constructor.toString();
            /*
             * executed if the return of object.constructor.toString() is 
             * "[object objectClass]"
             */
            if (str.charAt(0) == '[') {
                var arr = str.match(/\[\w+\s*(\w+)\]/);
            } else {
                /*
                 * executed if the return of object.constructor.toString() is 
                 * "function objectClass () {}"
                 * for IE Firefox
                 */
                var arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length == 2) {
                return arr[1];
            }
        }
        return undefined;
    };
}

