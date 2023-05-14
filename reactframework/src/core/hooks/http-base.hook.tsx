import axios, { AxiosRequestConfig } from 'axios';
import { keys } from 'lodash';
import { from, Observable } from 'rxjs';

import useCommonFunc from './common-func.hook';

type HttpMethod = 'DELETE' | 'GET' | 'HEAD' | 'JSONP' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';
const cancelTokenSource = axios.CancelToken.source();

const useHttpBase = () => {
    const commonFuncHook = useCommonFunc();

    const cancel = () => {
        cancelTokenSource.cancel();
    };

    const request = <RequestType, ResponseType>(
        method: HttpMethod,
        url: string,
        apiName: string,
        options?: AxiosRequestConfig
    ): Observable<ResponseType> => {
        try {
            // set API name for write log function
            options = {
                ...options,
                data: {
                    apiName: apiName
                } as any
            };

            // remove params which are undefined
            if (options?.params) {
                Object.keys(options?.params).forEach((x) => {
                    if (options?.params[x] === 'undefined') {
                        delete options?.params[x];
                    }
                });
            }

            return from(
                axios<RequestType, ResponseType>({
                    method,
                    url: url,
                    data: options.data,
                    params: options.params
                })
            );
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const get = <RequestType, ResponseType>(
        url: string,
        apiName: string,
        params?: RequestType
    ): Observable<ResponseType> => {
        if (params) {
            enCodeURI<RequestType>(params);
        }

        return request<RequestType, ResponseType>('GET', url, apiName, {
            params
        });
    };

    const remove = <RequestType, ResponseType>(
        url: string,
        apiName: string,
        params?: RequestType
    ): Observable<ResponseType> => {
        if (params) {
            enCodeURI<RequestType>(params);
        }

        return request<RequestType, ResponseType>('DELETE', url, apiName, {
            params
        });
    };

    const options = <RequestType, ResponseType>(
        url: string,
        apiName: string,
        params?: RequestType
    ): Observable<ResponseType> => {
        if (params) {
            enCodeURI<RequestType>(params);
        }

        return request<RequestType, ResponseType>('OPTIONS', url, apiName, {
            params
        });
    };

    const post = <RequestType, ResponseType>(
        url: string,
        apiName: string,
        data?: RequestType
    ): Observable<ResponseType> => {
        return request<RequestType, ResponseType>('POST', url, apiName, {
            data
        });
    };

    const put = <RequestType, ResponseType>(
        url: string,
        apiName: string,
        data?: RequestType
    ): Observable<ResponseType> => {
        return request<RequestType, ResponseType>('PUT', url, apiName, {
            data
        });
    };

    const patch = <RequestType, ResponseType>(
        url: string,
        apiName: string,
        data?: RequestType
    ): Observable<ResponseType> => {
        return request<RequestType, ResponseType>('PATCH', url, apiName, {
            data
        });
    };

    const getLocalFile = <ResponseType,>(url: string): Promise<ResponseType> => {
        return axios.get<undefined, ResponseType>(url, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    };

    const enCodeURI = <T,>(params: T) => {
        try {
            keys(params).map((key) => (params[key] = encodeURIComponent(params[key])));

            return params;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const getURL = (apiRoute: string): string => {
        try {
            const result = new URL(
                `${process.env['REACT_APP_API_PREFIX']}${apiRoute}`,
                process.env['REACT_APP_API_HOST']
            );

            return result.href;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        cancelTokenSource,
        cancel,
        get,
        remove,
        options,
        post,
        put,
        patch,
        getLocalFile,
        getURL
    };
};

export default useHttpBase;
