import { AxiosResponse } from 'axios';
import { isEmpty, keys } from 'lodash';

import { Configuration } from '../models/config.model';
import { isNullOrUndefined } from '../utils/common-func.util';
import { GlobalVariables } from '../utils/global-variables.util';
import useCommonFunc from './common-func.hook';
import useHttpBase from './http-base.hook';

const useConfig = () => {
    const httpBaseHook = useHttpBase();
    const commonFuncHook = useCommonFunc();

    const loadConfig = (): Promise<Configuration> => {
        return new Promise((resolve) => {
            httpBaseHook
                .getLocalFile<Configuration>(`../configurations/config.${process.env['REACT_APP_ENV']}.json`)
                .then((res) => {
                    try {
                        if (
                            !res ||
                            isEmpty(res) ||
                            ('headers' in res && 'request' in res && isEmpty((res as AxiosResponse).data))
                        ) {
                            resolve({});
                        }

                        const resData = (res as AxiosResponse).data || res;

                        keys(resData).forEach((key) => {
                            if (!isNullOrUndefined(resData[key])) GlobalVariables[key] = resData[key];
                        });

                        resolve({});
                    } catch (error) {
                        resolve({});
                        commonFuncHook.handleError(error);
                        throw error;
                    }
                });
        });
    };

    return { loadConfig };
};

export default useConfig;
