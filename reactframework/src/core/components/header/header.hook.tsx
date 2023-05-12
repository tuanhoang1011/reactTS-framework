import i18next from 'i18next';
import { addLocale, locale } from 'primereact/api';

import { StorageKey } from '../../constants/storage-key.const';
import useLocalStorage from '../../hooks/local-storage.hook';
import { MenuItem } from '../../models/item.model';
import HttpBaseService from '../../services/http-base.service';
import { GlobalVariables } from '../../utils/global-variables.ultility';

const root = '../json/';
const headerJSON = `${root}items/header.json`;
const languagesJSON = `${root}items/languages.json`;
const httpBaseService = HttpBaseService.getInstance();

const useHeader = () => {
    const localStorageHook = useLocalStorage();

    const getNavMenu = async () => {
        try {
            return await httpBaseService.getLocalFile<{ menu: MenuItem[] }>(headerJSON);
        } catch (error) {
            throw error;
        }
    };

    const getLanguages = async () => {
        try {
            return await httpBaseService.getLocalFile<{ menu: MenuItem[] }>(languagesJSON);
        } catch (error) {
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
