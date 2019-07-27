import { HashMap } from "../mapUtil/HashMap";

export class SourceMgr{
    //图片
    private imageMap:HashMap<HTMLImageElement> 
    constructor(){
        this.imageMap = new HashMap()
    }
    private getMapByType(type:sourceType):HashMap<HTMLImageElement>{
        switch(type){
            case sourceType.image:
                return this.imageMap
        }
    }
    public add(key:string ,source:any ,type:sourceType):void{
        let map = this.getMapByType(type);
        map.add(key,source);
    }

    public remove(key:string ,type:sourceType):void{
        let map = this.getMapByType(type);
        map.removeByKey(key);
    }
}

enum sourceType {
    image,
    json,
    text,
}