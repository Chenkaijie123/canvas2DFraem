let pool: Array<FnHandle> = [];
export default class FnHandle {
    public action: Function
    public caller: any
    public args: any[]
    constructor(fn?: Function, caller?: any, ...args: any[]) {
        this.init(fn, caller, ...args)
    }

    public init(fn: Function, caller: any, ...args: any[]): void {
        if (!fn && !caller) return;
        this.action = fn;
        this.caller = caller;
        this.args = args;
    }

    public release(): void {
        this.action = this.caller = this.args = null;
        pool.push(this);
    }

    public run(): void {
        this.action.apply(this.caller, this.args)
    }

    static create(fn?: Function, caller?: any, ...args: any[]): FnHandle {
        let handle = pool.pop() || new FnHandle();
        if (fn && caller) handle.init(fn, caller, ...args);
        return handle;
    }
}