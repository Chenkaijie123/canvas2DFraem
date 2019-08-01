import EventDispatch from "../../canvasDOM/event/EventDispatch";
import { SysTem } from "../../canvasDOM/global/PlugC";

export class FileLoader extends EventDispatch {
    static LOAD_COMPLETE: string = "LOAD_COMPLETE";
    public responseType: FileLoaderType;
    public response: ArrayBuffer | Blob | Document | string;//数据
    public status: number;
    public readyState: number;

    public load(url: string): void {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", this.onReadystatechange);
        xhr.addEventListener("error", this.onError);
        xhr.open("get", url);
        xhr.send();
    }

    public loadAsync(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.load(url);
            this.once(SysTem.LOAD_COMPLETE, () => {
                this.removeAllEvent();
                resolve(this.response);
            }, this);
            this.once(SysTem.LOAD_ERROR, (e) => {
                this.removeAllEvent()
                reject(e.data);
            }, this)
        })
    }

    private onReadystatechange: (e: Event) => any = function (e: Event) {
        let xhr = e.currentTarget as XMLHttpRequest;
        let loader: FileLoader = this;
        let status = loader.status = xhr.status;
        let readyState = loader.readyState = xhr.readyState;
        if (status == 200 && readyState == 4) {
            loader.dispatch(SysTem.LOAD_COMPLETE, this.response = xhr.response);
            xhr.removeEventListener("readystatechange", this.onReadystatechange);
            xhr.removeEventListener("error", this.onError);
        }
        loader.dispatch(SysTem.READY_STATE_CHANGE, readyState)
    }.bind(this);

    private onError: (e: Event) => any = function (e: Event) {
        let xhr = e.currentTarget as XMLHttpRequest;
        let loader: FileLoader = this;
        xhr.removeEventListener("readystatechange", this.onReadystatechange);
        xhr.removeEventListener("error", this.onError);
        loader.dispatch(SysTem.LOAD_ERROR, xhr.responseURL);
    }.bind(this);


}

/**加载文件类型 */
export enum FileLoaderType {
    ARRAYBUFFER = "arraybuffer",
    TEXT = "text",
    BLOB = "blob",
    DOCUMENT = "document",
    JSON = "json",
}