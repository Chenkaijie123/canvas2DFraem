export class Stack<T>{
    private stackList:Array<{value:T}> = [];
    private target:number;
    constructor(){}
    public init():void{
        this.stackList.length = 0;
        this.target = -1;
    }
    public push(value:T){
        this.stackList.push({value:value});
        this.target++;
    }

    public pop(){
        if(this.target < 0) return;
        this.target--
    }

    private getStack():{value:T}{
        return this.stackList[this.target]
    }

    public getContent():T{
        return this.getStack().value;
    }

    public changeContent(value:T):void{
        this.getStack().value = value;
    }
}