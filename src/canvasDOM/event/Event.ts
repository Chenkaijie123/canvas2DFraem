export namespace PlugC{
    let pool:PlugC.Event[] = []
    export class Event{
        public type:string = ""
        public target:any;
        public currentTarget:any;
        public data:any;
        // public bubbles:boolean
        public usecapture:boolean
        public stopPro :boolean = false;
        constructor(type:string,usecapture = false){
            this.type = type;
            this.usecapture = usecapture;
            // this.bubbles = !usecapture;
        }

        public stopPropagation():void{
            this.stopPro = true;
        }

        public release():void{
            pool.push(this);
        }
        public static create(type:string,usecapture:boolean = false):PlugC.Event{
            let e = pool.pop() ;
            if(e){
                e.type = type;
                e.usecapture = usecapture;
                // e.bubbles = !usecapture;
                e.stopPro = false;
            }else e = new PlugC.Event(type,usecapture);
            return e;
        }

        public static factoty<T extends PlugC.Event>(type:string,usecapture:boolean = false,clientX = 0,clientY = 0,EventClass?:new(...args:any[])=>T):T{
            let t:any = EventClass? EventClass:this;
            return t.create(type,usecapture,clientX,clientY)
        }
    }
}
