namespace PlugC{
    export class Event{
        public type:string = ""
        public target:any;
        public currentTarget:any;
        public data:any;
        public bubbles:boolean
        constructor(){
    
        }

        public stopPropagation():void{
            
        }
    }
}
