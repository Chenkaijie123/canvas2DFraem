// import {Stack} from "./Stack"
const ATTRIBUTE = ["color", "fontSize", "fontFamily", "underLine"]
const TAGNAME = ["font", "b", "u"]
export class TextParser {
    private parseStr: string

    constructor() { }


    /**
     * 解析标签
     * @param str 
     */
    public parse(str: string) {
        this.parseStr = str = str.replace(/(^\s*)|(\s*$)|(^\n*)|(\n*$)/g, "");
        let [start, end, contentStart] = [0, 0, 0]
        let len = str.length;
        let type: TAGTYPE
        let res: richTextDate[] = [];
        let temp: richTextDate[] = [];
        let content: string;
        let startFlag:boolean = true;
        //处理标签外的内容
        start = str.indexOf(CHAR_TYPE.LEFT);
        if(start > 0) temp.push({text:str.substring(0,start)});
        while (len > start) {
            start = str.indexOf(CHAR_TYPE.LEFT, end);
            end = str.indexOf(CHAR_TYPE.RIGHT, start);
            if (start > contentStart) {
                content = str.substring(contentStart, start);
                if (startFlag) temp.push({ text: "" }) && (startFlag = false);
                temp[temp.length - 1].text = content;
            }
            if (start < 0 || end < 0) {//后面没有标签
                content = str.substring(contentStart);
                if (content != "") {
                    if (temp.length) (temp[temp.length - 1].text = content);
                    else temp.push({ text: content });
                }
                return res.concat(temp);
            }
            type = this.getTagType(start);
            switch (type) {
                case TAGTYPE.FONT:
                    temp.push(this.parseAttrbute(str.substring(start, end)))
                    break;
                case TAGTYPE.B:
                    temp.push(this.parseAttrbute(str.substring(start, end),"italic"))
                    break;
                case TAGTYPE.U:
                    temp.push(this.parseAttrbute(str.substring(start, end),"underLine"))
                    break;
                case TAGTYPE.CLOSE:
                    res.push(temp.pop())
                    break;
                case TAGTYPE.NONE://内容
                    break;
            }
            contentStart = start = end;
            contentStart += 1;
        }
    }




    /**
     * 获取标签类型
     * @param index 标签 < 的下标
     */
    private getTagType(index: number): TAGTYPE {
        let len = this.parseStr.length;
        let contentBegin: boolean = false;
        let begin: number, end: number;
        //获取标签里面第一个单词，以此判断标签类型
        while (index < len) {
            if (!contentBegin && this.parseStr[index] == CHAR_TYPE.SPACE) {
                index++;
                continue;
            } else if (!contentBegin && this.parseStr[index] != CHAR_TYPE.SPACE) {
                begin = index++;
                contentBegin = true;
                continue;
            }
            if (contentBegin && this.parseStr[index] == CHAR_TYPE.SPACE || this.parseStr[index] == CHAR_TYPE.RIGHT) {
                end = index;
                break;
            }
            index++
        }
        //标签的第一个单词
        let tagName = this.parseStr.substring(begin + 1, end);
        let res: TAGTYPE;
        let idx: number;
        if ((idx = TAGNAME.indexOf(tagName)) >= 0) {
            let eKey: any = TAGTYPE[idx + 1];
            let tagType: any = TAGTYPE[eKey]
            res = tagType;
        } else {//如果是/则表示是闭标签
            res = this.parseStr[begin + 1] == CHAR_TYPE.OBLIQUE ? TAGTYPE.CLOSE : TAGTYPE.NONE
        }
        return res;
    }

    /**
     * 把标签的属性格式化成json格式
     * 参数格式 <font color = "0xffffff" underLine fontSize = 16> || font color = "0xffffff" underLine fontSize = 16
     * @param tagHead 要解析的标签
     * @param addAttr  值类型为布尔的属性
     */
    private parseAttrbute<T extends keyof richTextStyle>(tagHead: string,...addAttr:T[]): richTextDate {
        let start: number = tagHead[0] == CHAR_TYPE.LEFT ? 1 : 0;
        let end: number = tagHead[tagHead.length - 1] == CHAR_TYPE.RIGHT ? tagHead.length - 1 : tagHead.length;
        tagHead = tagHead.substring(start, end);
        let sourceArr = tagHead.split(" ");
        let style: richTextDate = { text: "", style: {} };
        let value: any
        let key: T
        for (let i: number = 0, len = sourceArr.length; i < len; i++) {
            key = (sourceArr[i]) as T;
            if (ATTRIBUTE.indexOf(sourceArr[i]) >= 0) {
                if (sourceArr[i + 1] == CHAR_TYPE.EQUAL) {
                    value = this.parseValue(sourceArr[i += 2])
                } else {
                    value = true;
                }
                style.style[key] = value;
            }
        }
        //处理设置为true的属性
        for(let key of addAttr){
            (style.style[key] as any) = true;
        }
        return style;
    }

    /**
     * 格式化值
     * "xxx"返回字符串 xxx返回数 boolean返回布尔值
     * @param value 
     */
    private parseValue(value: string = "") {
        let start = value[0] == CHAR_TYPE.SINGLE_QUOTATION || value[0] == CHAR_TYPE.QUOTATION ? 1 : 0;
        let end = value[value.length - 1] == CHAR_TYPE.SINGLE_QUOTATION || value[value.length - 1] == CHAR_TYPE.QUOTATION ?
            value.length - 1 : value.length;
        value = value.substring(start, end);
        value.trim()
        if (value == "true") return true;
        if (value == "false") return false;
        if (start == 1) {
            return value;
        }
        return Number(value);
    }





}

enum CHAR_TYPE {
    LEFT = "<",
    RIGHT = ">",
    SPACE = " ",
    OBLIQUE = "/",
    EQUAL = "=",
    SINGLE_QUOTATION = '"',
    QUOTATION = "'"
}


enum TAGTYPE {
    /**非标签 */
    NONE,
    /**font标签 */
    FONT,
    /**b标签  */
    B,
    /**u标签  */
    U,
    /**标签闭合 */
    CLOSE,
}

interface richTextDate {
    text: string
    style?: richTextStyle
}

interface richTextStyle {
    fontSize?: number
    color?: number
    fontFamily?: string
    underLine?: boolean
    italic?:boolean
}

