export interface WebSocketRequestResponse<T = any> {
    event?: number;
    data?: T;
}
