import EventDispatch from "../../canvasDOM/event/EventDispatch";
import { resource } from "../../mgr/GlobalMgr"
import { sourceType } from "../SourceMgr";
let pool: Array<ImgLoader> = [];
export class ImgLoader extends EventDispatch {
    static awaitAndPrevent: { [url: string]: ImgLoader[] } = {};//正在加载的资源，避免重复加载
    static LOAD_COMPLETE: string = "LOAD_COMPLETE";
    static LOAD_ERROR: string = "LOAD_ERROR"
    public data: HTMLImageElement = null;//加载完成会将结果存放在此
    public loadURL: string = null;
    private loadingElement: HTMLImageElement = null
    public loadAsync(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            this.once(ImgLoader.LOAD_COMPLETE, (e) => {
                this.removeAllEvent();
                resolve(e.data);
            }, this);
            this.once(ImgLoader.LOAD_ERROR, (e) => {
                this.removeAllEvent();
                reject(e.data);
            }, this)
            this.load(url);
        })
    }


    public load(url: string): void {
        let data: HTMLImageElement
        if (data = resource.getRES(url) as HTMLImageElement) {//已经加载
            this.dispatch(ImgLoader.LOAD_COMPLETE, data);
            return;
        } else if (ImgLoader.awaitAndPrevent[url]) {//正在加载
            ImgLoader.awaitAndPrevent[url].push(this);
            return;
        }
        ImgLoader.awaitAndPrevent[url] = [];
        let img = this.loadingElement = new Image();
        this.loadURL = img.src = url;
        img.addEventListener("load", this.loadComplete);
        img.addEventListener("error", this.loadError);
        img = null;
    }

    private loadComplete: (e: Event) => void = function (e: Event) {
        let data = this.data = this.loadingElement;
        let url:string = this.loadURL;
        this.loadingElement.removeEventListener("load", this.loadComplete);
        this.loadingElement.removeEventListener("error", this.loadError);
        resource.add(sourceType.image, this.data, this.loadURL);//资源添加到资源管理器
        this.dispatch(ImgLoader.LOAD_COMPLETE, this.data);//通知外部资源加载完成
        let loaders = ImgLoader.awaitAndPrevent[url];
        if (loaders) {
            let loader;
            while (loader = loaders.pop()) {
                loader.data = data
                loader.dispatch(ImgLoader.LOAD_COMPLETE, data);
            }
        }
        this.loadingElement = null;
    }.bind(this)

    private loadError: (e: Event) => void = function (e: Event) {
        this.loadingElement.removeEventListener("load", this.loadComplete);
        this.loadingElement.removeEventListener("error", this.loadError);
        this.dispatch(ImgLoader.LOAD_ERROR, "fail load img " + this.loadURL);
        this.loadingElement = null;
    }.bind(this);

    public clearLoader(): void {
        this.data && (this.data = null);
        this.loadURL && (this.loadURL = null);
        if (this.loadingElement) {
            this.loadingElement.removeEventListener("load", this.loadComplete);
            this.loadingElement.removeEventListener("error", this.loadError);
            this.loadingElement = null;
        }
    }

    public release(): void {
        if(pool.length > 50) return;//最大缓存51个图片加载器
        this.clearLoader();
        pool.push(this);
    }

    public static create(): ImgLoader {
        let loader = pool.pop() || new ImgLoader();
        return loader;
    }
}