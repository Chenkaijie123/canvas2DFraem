export default class StringUtil{
    /**获取字符串字符长度 中文占1字节 */
    static calcStringByte(str:string):number{
        let idx = 0;
        let byteLen:number = 0;
        let temp:string,code:number
        while(temp = str[idx++]){
            code = temp.charCodeAt(0)
            if(code >= 32 && code <= 126) byteLen += .5
            else byteLen++;
        }
        return byteLen;
    }
}