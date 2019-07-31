import EventDispatch from "../../canvasDOM/event/EventDispatch";

export class FileLoader extends EventDispatch{
    public load(url:string):void{
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load",this.onComplete)
        xhr.open("get",url);
        xhr.send();
    }

    private onComplete:(e:Event)=>any = function(e:Event){
        console.log((e.currentTarget as any).response)
    }.bind(this)
}