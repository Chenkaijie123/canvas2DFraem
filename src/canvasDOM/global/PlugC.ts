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
}