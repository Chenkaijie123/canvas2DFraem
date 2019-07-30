
/**资源管理 */
export class SourceMgr{
    private imgMap:{[url:string]:HTMLImageElement} = {};
    private JSONMap:{[url:string]:JSON} = {};
    private TEXTMap:{[url:string]:string} = {};
    private getMap(type:sourceType):{[url:string]:any}{
        let map = {} ;
        switch(type){
            case sourceType.image:
                map = this.imgMap;
                break;
            case sourceType.json:
                map = this.JSONMap;
                break;
            case sourceType.text:
                map = this.TEXTMap;
                break;
        }
        return map;
    }
    //判断文件类型
    private checkFileType(url:string):sourceType{
        let index = url.lastIndexOf(".")
        if(index == -1) return sourceType.none;
        let excName = url.substr(url.lastIndexOf(".")+ 1);
        if(excName == "json") return sourceType.json;
        else if(excName == "txt") return sourceType.text;
        else if(excName == "png" || excName == "jpg" || excName == "jepg") return sourceType.image;
        return sourceType.none;
    }

    public hasRES(url:string):boolean{
        return !!this.getRES(url);
    }

    public getRES(url:string):HTMLImageElement|JSON|string{
        let map = this.getMap(this.checkFileType(url));
        return map[url];
    }

    //添加资源
    public add(type:sourceType,data:HTMLImageElement|JSON|string,url:string):void{
        let map = this.getMap(type)
        map[url] = data;
    }

    public remove(type:sourceType,url:string):void{
        let map = this.getMap(type)
        delete map[url];
    }
}

export enum sourceType {
    none,
    image,
    json,
    text,
}