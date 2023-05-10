import { isEmpty, keys } from 'lodash';
import { Configuration } from '../../models/config.model';
import { isNullOrUndefined } from '../../utils/common-func.ultility';
import { GlobalVariables } from '../../utils/global-variables.ultility';
import HttpBaseService from '../communicate-server/http-base.service';

export class ConfigService {
    private static instance?: ConfigService;

    constructor() {
        if (ConfigService.instance) return;
    }

    static getInstance() {
        try {
            if (!this.instance) {
                this.instance = new ConfigService();
            }

            return this.instance;
        } catch (error) {
            throw error;
        }
    }

    loadConfig(): Promise<Configuration> {
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
    }
}
