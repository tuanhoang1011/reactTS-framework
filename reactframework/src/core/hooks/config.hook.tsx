import { isEmpty, keys } from 'lodash';

import { Configuration } from '../models/config.model';
import HttpBaseService from '../services/http-base.service';
import { isNullOrUndefined } from '../utils/common-func.ultility';
import { GlobalVariables } from '../utils/global-variables.ultility';

const useConfig = () => {
    const loadConfig = (): Promise<Configuration> => {
        return new Promise((resolve) => {
            HttpBaseService.getInstance()
                .getLocalFile<Configuration>(`../configurations/config.${process.env['REACT_APP_ENV']}.json`)
                .then((res) => {
                    try {
                        if (!res || isEmpty(res)) return;

                        keys(res).forEach((key) => {
                            if (!isNullOrUndefined(res[key])) GlobalVariables[key] = res[key];
                        });

                        resolve({});
                    } catch (error) {
                        throw error;
                    }
                });
        });
    };

    return { loadConfig };
};

export default useConfig;
