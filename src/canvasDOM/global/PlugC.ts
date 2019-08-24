export enum SysTem{
    /**文件加载成功 */
    LOAD_COMPLETE = "LOAD_COMPLETE",
    /**文件加载失败 */
    LOAD_ERROR = "LOAD_ERROR",
    /**文件下载状态改变 */
    READY_STATE_CHANGE = "READY_STATE_CHANGE",
    /**开始点击 */
    TAP_BEGIN = "tapBegin",
    /**抬起 */
    TAP_END = "tapEnd",
    /**点击取消 */
    TAP_CANCEL = "tapCancel",
    /**移动 */
    TAP_MOVE = "tapMove",
    /**点击 */
    TAP = "tap",


     /**显示对象添加到节点 */
    CHILD_ADD = "CHILD_ADD",
    /**显示子对象从显示列表移除 */
    CHILD_REMOVE = "CHILD_REMOVE",
    /**显示对象完成，加载并且正确显示 */
    DOM_COMPLETE = "DOM_COMPLETE",
    /**大小改变 */
    RESIZE = "RESIZE",
    /**帧前事件 */
    RENDER = "RENDER",


    /**缓动动画移除 */
    TWEEN_REMOVE = "TWEEN_REMOVE",
}