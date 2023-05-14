import { interval, Observable, Subscription, takeWhile } from 'rxjs';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

import useMessageToast from '../components/message-toast/message-toast.hook';
import { WSReceiveEvent } from '../enums/web-socket.enum';
import { WebSocketRequestResponse } from '../models/web-socket.model';
import { showMessageDebug } from '../utils/common-func.util';
import { GlobalVariables } from '../utils/global-variables.util';
import useCommonFunc from './common-func.hook';

let excuteReconnect = true;
let isConnected = false;
let isShownMsg = false;
let sub: Subscription = new Subscription();
let webSocket$: WebSocketSubject<WebSocketRequestResponse>;
let reconnect$: Observable<number>;

const useWebSocket = () => {
    const msgToastHook = useMessageToast();
    const commonFuncHook = useCommonFunc();

    const wsSubjectConfig: WebSocketSubjectConfig<WebSocketRequestResponse> = {
        url: process.env['REACT_APP_WS_URL'] ?? '',
        openObserver: {
            next: (e) => {
                isConnected = true;
                reconnect$ = undefined!;
            }
        },
        closeObserver: {
            next: async (e) => {
                try {
                    isConnected = false;

                    if (excuteReconnect && !reconnect$) {
                        showMessageDebug('WS is closed. It will be reconnected.');
                        reconnect();
                    } else if (!excuteReconnect) {
                        showMessageDebug('WS is closed.');
                        await cleanWebSocket();
                    }
                } catch (error) {
                    commonFuncHook.handleError(error);
                    throw error;
                }
            }
        },
        serializer: (req) => {
            try {
                return JSON.stringify(req);
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        },
        deserializer: ({ data }) => {
            try {
                if (data instanceof ArrayBuffer) {
                    // convert bson -> json
                    // return deserialize(decompressSync(new Uint8Array(data)));
                } else {
                    return JSON.parse(data);
                }
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }
    };

    const initWebSocket = async (isExcuteReconnect = true) => {
        excuteReconnect = isExcuteReconnect;

        // firstly, clean all subscription and observable
        await cleanWebSocket();
        // connect to ws server
        showMessageDebug('Connecting to web socket...');
        await connect();
    };

    const connect = () => {
        try {
            if (webSocket$) return;

            webSocket$ = webSocket<WebSocketRequestResponse>(wsSubjectConfig);

            sub.add(
                webSocket$.subscribe({
                    next: (res: WebSocketRequestResponse) => {
                        if (res.event === WSReceiveEvent.Connected) {
                            showMessageDebug('Connect to web socket successfully.');
                            isConnected = true;
                            reconnect$ = undefined!;
                        }
                    },
                    error: (err) => {
                        console.error(err);
                    }
                })
            );
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const reconnect = () => {
        try {
            if (reconnect$) return;

            reconnect$ = interval(GlobalVariables.wsConfig.reconnectInterval).pipe(
                takeWhile((v, index) => !isConnected && index < GlobalVariables.wsConfig.reconnectAttempts)
            );

            sub.add(
                reconnect$.subscribe({
                    next: () => {
                        showMessageDebug('Reconnecting to web socket...');
                        webSocket$ = undefined!;
                        connect();
                    },
                    error: (err) => {
                        showMessageDebug('Reconnect to web socket failed.');
                        console.error(err);
                        showMessage();
                        reconnect$ = undefined!;
                    },
                    complete: () => {
                        // after reconnectAttempts -> stop and show message
                        if (!isConnected) {
                            excuteReconnect = false;
                            showMessageDebug('Stop reconnecting to web socket.');
                            showMessage();
                        } else {
                            excuteReconnect = true;
                        }

                        reconnect$ = undefined!;
                    }
                })
            );
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const cleanWebSocket = () => {
        try {
            return new Promise((resolve) => {
                if (sub) {
                    sub.unsubscribe();
                    sub = new Subscription();
                }

                if (webSocket$) {
                    webSocket$.complete();
                    webSocket$ = undefined!;
                }

                reconnect$ = undefined!;

                resolve({});
            });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const disconnect = () => {
        try {
            return new Promise((resolve) => {
                excuteReconnect = false;

                if (webSocket$) {
                    webSocket$.complete();
                    webSocket$ = undefined!;
                }

                resolve({});
            });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const receive = <T,>() => {
        try {
            return webSocket$ as Observable<WebSocketRequestResponse<T>>;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const send = <T,>(req: WebSocketRequestResponse<T>) => {
        try {
            if (isConnected) {
                webSocket$.next(req);
            } else {
                console.error('Connection is not opened.');
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const showMessage = () => {
        if (!isShownMsg) {
            msgToastHook.error('MSG.MSG_0001');
            isShownMsg = true;
        }
    };

    return { initWebSocket, connect, disconnect, cleanWebSocket, receive, send };
};

export default useWebSocket;
