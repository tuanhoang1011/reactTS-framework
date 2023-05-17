import { isEmpty } from 'lodash';

import { StorageItem } from '../models/item.model';
import useCommonFunc from './common-func.hook';

const mainKey = process.env['REACT_APP_LOCAL_STORAGE_KEY'] ?? '';

const useLocalStorage = () => {
    const commonFuncHook = useCommonFunc();

    const getAppCache = () => {
        try {
            return localStorage.getItem(mainKey) || '';
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const get = (key: string): string => {
        try {
            const storageItems: string = getAppCache();
            let val = '';

            if (isEmpty(storageItems)) {
                return val;
            } else {
                const items: Array<StorageItem> = JSON.parse(storageItems);
                const existedItem = items.find((x) => x.key === key);

                if (existedItem) {
                    val = existedItem.value!;
                }

                return val;
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const set = (key: string, value: string) => {
        try {
            const item: StorageItem = {
                key: key,
                value: value
            };

            let objItems: Array<StorageItem> = new Array<StorageItem>();
            const storageItems: string = getAppCache() || '';
            if (!isEmpty(storageItems)) {
                objItems = JSON.parse(storageItems);
            }

            const existedItem = objItems.find((x) => x.key === key);
            if (existedItem) {
                // update value
                existedItem.value = value;
            } else {
                // add new
                objItems.push(item);
            }

            localStorage.setItem(mainKey, JSON.stringify(objItems));
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const remove = (key: string) => {
        try {
            const storageItems: string = getAppCache();

            if (!isEmpty(storageItems)) {
                const objItems: Array<StorageItem> = JSON.parse(storageItems);
                const remainItems = objItems.filter((x) => x.key !== key);

                localStorage.setItem(mainKey, JSON.stringify(remainItems));
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const removeMulti = (keys: Array<string>) => {
        try {
            const storageItems: string = getAppCache();

            if (!isEmpty(storageItems)) {
                const objItems: Array<StorageItem> = JSON.parse(storageItems);
                const remainItems = objItems.filter((x) => keys.indexOf(x.key!) === -1);

                localStorage.setItem(mainKey, JSON.stringify(remainItems));
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const clear = () => {
        try {
            localStorage.clear();
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        get,
        set,
        remove,
        removeMulti,
        clear
    };
};

export default useLocalStorage;
