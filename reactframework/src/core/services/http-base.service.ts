import axios, { AxiosRequestConfig } from 'axios';
import { keys } from 'lodash';
import { BehaviorSubject } from 'rxjs';

export type HttpMethod = 'DELETE' | 'GET' | 'HEAD' | 'JSONP' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';

export default class HttpBaseService {
    cancelPendingRequestsSource = new BehaviorSubject<void>(undefined!);
    cancelPendingRequests$ = this.cancelPendingRequestsSource.asObservable();

    private static instance?: HttpBaseService;

    constructor() {
        if (HttpBaseService.instance) return;
    }

    static getInstance() {
        try {
            if (!this.instance) {
                this.instance = new HttpBaseService();
            }

            return this.instance;
        } catch (error) {
            throw error;
        }
    }

    cancelPendingRequests() {
        this.cancelPendingRequestsSource.next();
    }

    request<ResponseType>(
        method: HttpMethod,
        url: string,
        apiName: string,
        options?: AxiosRequestConfig
    ): Promise<ResponseType> {
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

            return axios<undefined, ResponseType>({
                method,
                url: this.getURL(url),
                data: options.data,
                params: options.params
            });
        } catch (error) {
            throw error;
        }
    }

    get<RequestType, ResponseType>(url: string, apiName: string, params?: RequestType): Promise<ResponseType> {
        if (params) {
            this.enCodeURI<RequestType>(params);
        }

        return this.request<ResponseType>('GET', url, apiName, {
            params
        });
    }

    delete<RequestType, ResponseType>(url: string, apiName: string, params?: RequestType): Promise<ResponseType> {
        if (params) {
            this.enCodeURI<RequestType>(params);
        }

        return this.request<ResponseType>('DELETE', url, apiName, {
            params
        });
    }

    options<RequestType, ResponseType>(url: string, apiName: string, params?: RequestType): Promise<ResponseType> {
        if (params) {
            this.enCodeURI<RequestType>(params);
        }

        return this.request<ResponseType>('OPTIONS', url, apiName, {
            params
        });
    }

    post<RequestType, ResponseType>(url: string, apiName: string, data?: RequestType): Promise<ResponseType> {
        return this.request<ResponseType>('POST', url, apiName, {
            data
        });
    }

    put<RequestType, ResponseType>(url: string, apiName: string, data?: RequestType): Promise<ResponseType> {
        return this.request<ResponseType>('PUT', url, apiName, {
            data
        });
    }

    patch<RequestType, ResponseType>(url: string, apiName: string, data?: RequestType): Promise<ResponseType> {
        return this.request<ResponseType>('PATCH', url, apiName, {
            data
        });
    }

    public getLocalFile<ResponseType>(url: string): Promise<ResponseType> {
        return axios.get<undefined, ResponseType>(url, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    }

    private enCodeURI<T>(params: T) {
        try {
            keys(params).map((key) => (params[key] = encodeURIComponent(params[key])));

            return params;
        } catch (error) {
            throw error;
        }
    }

    private getURL(apiRoute: string): string {
        try {
            const result = new URL(
                `${process.env['REACT_APP_API_HOST']}${apiRoute}`,
                process.env['REACT_APP_API_HOST']
            );

            return result.href;
        } catch (error) {
            throw error;
        }
    }
}
