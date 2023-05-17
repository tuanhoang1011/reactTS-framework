import i18next from 'i18next';
import { addLocale, locale } from 'primereact/api';

import { StorageKey } from '../../constants/storage-key.const';
import useCommonFunc from '../../hooks/common-func.hook';
import useHttpBase from '../../hooks/http-base.hook';
import useLocalStorage from '../../hooks/local-storage.hook';
import { MenuItem } from '../../models/item.model';
import { GlobalVariables } from '../../utils/global-variables.util';

const root = '../json/';
const headerJSON = `${root}items/header.json`;
const languagesJSON = `${root}items/languages.json`;

const useHeader = () => {
    const localStorageHook = useLocalStorage();
    const httpBaseHook = useHttpBase();
    const commonFuncHook = useCommonFunc();

    const getNavMenu = async () => {
        try {
            return await httpBaseHook.getLocalFile<{ menu: MenuItem[] }>(headerJSON);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const getLanguages = async () => {
        try {
            return await httpBaseHook.getLocalFile<{ menu: MenuItem[] }>(languagesJSON);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const setTheme = (oldTheme: string, newTheme: string) => {
        try {
            if (oldTheme) {
                document.body.classList.remove(`theme-${oldTheme}`);
            }

            localStorageHook.set(StorageKey.Theme, newTheme);
            document.body.classList.add(`theme-${newTheme}`);
            GlobalVariables.theme = newTheme;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const setLanguage = (lang: string) => {
        try {
            if ((i18next.getDataByLanguage(lang) as any)['translation']['prime']) {
                // set locale for primereact lib
                addLocale(lang, {
                    ...(i18next.getDataByLanguage(lang) as any)['translation']['prime']
                });
                locale(lang);
            }

            localStorageHook.set(StorageKey.Language, lang);
            i18next.changeLanguage(lang);
            GlobalVariables.language = lang;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        getNavMenu,
        getLanguages,
        setTheme,
        setLanguage
    };
};

export default useHeader;
