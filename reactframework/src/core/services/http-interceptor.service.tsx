import axios, { AxiosError, AxiosHeaders, AxiosResponse, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { switchMap } from 'rxjs';

import useAuthAPI from '../../network-services/api/auth-api.hook';
import { useErrorPage } from '../components/error-page/error-page.hook';
import useLoading from '../components/loading/loading.hook';
import useMessageToast from '../components/message-toast/message-toast.hook';
import { LogMessage, LogSubType, LogType } from '../constants/log.const';
import useAuth from '../hooks/auth.hook';
import useCommonFunc from '../hooks/common-func.hook';
import useHttpBase from '../hooks/http-base.hook';
import useLog from '../hooks/log.hook';
import { ErrorResponse, HttpErrorResponse } from '../models/http-response.model';
import { LogContent } from '../models/log.model';
import { GlobalVariables } from '../utils/global-variables.util';

const HTTPInterceptor = ({ children }) => {
    const loadingHook = useLoading();
    const msgToastHook = useMessageToast();
    const authHook = useAuth();
    const logHook = useLog();
    const errorPageHook = useErrorPage();
    const httpBaseHook = useHttpBase();
    const commonFuncHook = useCommonFunc();

    // API hooks
    const authAPIHook = useAuthAPI();

    useEffect(() =>
        // request
        {
            // defaul config for axios
            axios.defaults = {
                ...axios.defaults,
                timeout: GlobalVariables.requestHTTPTimeoutMilSecond,
                cancelToken: httpBaseHook.cancelTokenSource.token
            };

            // REQUEST
            axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
                const reqUrl = ((request as any)._lowerCaseUrl = request.url?.toLowerCase() ?? '');

                if (
                    reqUrl.includes(
                        `${process.env['REACT_APP_API_HOST']}/${process.env['REACT_APP_API_PREFIX']}`.toLowerCase()
                    )
                ) {
                    loadingHook.apiReqCount++;
                    request.headers = addHeaders(request.headers, reqUrl);
                }

                // process API name for log writting
                if (request.data && request.data.apiName) {
                    (request as any)._apiName = request.data.apiName;
                    delete request.data.apiName;

                    if (isEmpty(request.data)) {
                        (request.data as any) = null!;
                    }
                }

                return request;
            });

            // RESPONSE
            axios.interceptors.response.use(
                (response: AxiosResponse) => {
                    if (loadingHook.isPendingAPI) {
                        loadingHook.hideByZeroCount((response.config as any)._lowerCaseUrl);
                    }

                    return response.data;
                },
                (err: AxiosError) => {
                    try {
                        const responseErr = new HttpErrorResponse(
                            err.name,
                            err.message,
                            (err.response?.data as any).error,
                            err.response?.status as HttpStatusCode,
                            false
                        );

                        // write log
                        logHook.error(LogType.Error, {
                            subType: LogSubType.APIError,
                            apiName: (err.config as any)._apiName ?? '',
                            errorContent: responseErr.error.hasOwnProperty('error')
                                ? responseErr.error.error
                                : responseErr.error.hasOwnProperty('message')
                                ? responseErr.error
                                : navigator.onLine
                                ? LogMessage.Unknown
                                : LogMessage.NoNetwork
                        } as LogContent);

                        switch (responseErr.statusCode) {
                            case HttpStatusCode.Unauthorized:
                                // refresh token and then sent request again
                                if (err.config) {
                                    authAPIHook.refreshToken(authHook.refreshToken()).pipe(
                                        switchMap((res) => {
                                            try {
                                                authHook.setIdToken(res.idToken ?? '');
                                                authHook.setRefreshToken(res.refreshToken ?? '');

                                                err.config!.headers = addHeaders(
                                                    err.config!.headers,
                                                    (err.config as any)._lowerCaseUrl
                                                );

                                                return axios(err.config!);
                                            } catch (error) {
                                                return Promise.reject(responseErr);
                                            }
                                        })
                                    );
                                }

                                break;

                            case HttpStatusCode.BadRequest:
                            case HttpStatusCode.Forbidden:
                            case HttpStatusCode.NotFound:
                            case HttpStatusCode.InternalServerError:
                                errorPageHook.setErrorPage(responseErr.statusCode);
                                break;

                            default:
                                const msgKey = getMessageKey(responseErr);
                                showMessage(msgKey);
                                break;
                        }

                        if (loadingHook.isPendingAPI) {
                            loadingHook.hideByZeroCount((err.config as any)._lowerCaseUrl);
                        }

                        return Promise.reject(responseErr);
                    } catch (error) {
                        commonFuncHook.handleError(error);
                        throw error;
                    }
                }
            );
        }, []);

    const addHeaders = (headers: AxiosHeaders, reqUrl: string): AxiosHeaders => {
        try {
            const noHeaderRoutes = [];

            if (noHeaderRoutes.some((url: string) => reqUrl.includes(url.toLowerCase()))) {
                return headers;
            }

            return (headers = headers.set('Authorization', `Bearer ${authHook.idToken()}`));
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const getMessageKey = (err: HttpErrorResponse): string => {
        try {
            let key = '';

            if (!navigator.onLine) {
                key = 'MSG.APP_ERR0002';
            } else if (err.error.hasOwnProperty('error')) {
                const errorRes = err.error.error as ErrorResponse;

                key = 'MSG.APP_ERR0001';
            }

            return key;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const showMessage = (key: string) => {
        try {
            msgToastHook.error(key);

            const forceLogout: string[] = [];
            /*
                    force sign out when
                    + user already signed in
                */
            if (authHook.isSignedInSession() && forceLogout.includes(key)) {
                loadingHook.show();
                authHook.signOut();
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return children;
};

export default HTTPInterceptor;
