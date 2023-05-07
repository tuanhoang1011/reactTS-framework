import './app.component.scss';

import { memo, Suspense, useEffect } from 'react';
import { Routes } from 'react-router';

import useHeader from './core/components/header/header.hook';
import LoadingComponent from './core/components/loading/loading.component';
import MessageToastComponent from './core/components/message-toast/message-toast.component';
import SplashScreenComponent from './core/components/splash-screen/splash-screen.component';
import useSplashScreen from './core/components/splash-screen/splash-screen.hook';
import { StorageKey } from './core/constants/storage-key.const';
import { AppRouting } from './core/routing/app.routing';
import { ConfigService } from './core/services/common/config.service';
import { LocalStorageService } from './core/services/storage/local-storage.service';
import { GlobalVariables } from './core/utils/global-variables.ultility';

const localStorageService = LocalStorageService.getInstance();

const AppComponent = () => {
    const splashScreenHook = useSplashScreen();
    const headerHook = useHeader();

    useEffect(() => {
        try {
            ConfigService.getInstance()
                .loadConfig()
                .then(() => applyConfig());
        } catch (error) {
            throw error;
        }
    }, []);

    const applyConfig = () => {
        try {
            setTimeout(() => {
                splashScreenHook.hide();
            }, GlobalVariables.splashScreenDurationMilSecond);

            let language = localStorageService.get(StorageKey.Language);
            let theme = localStorageService.get(StorageKey.Theme);

            if (language === '') {
                localStorageService.set(StorageKey.Language, GlobalVariables.defaultLanguage);
                language = GlobalVariables.defaultLanguage;
            }

            if (theme === '') {
                localStorageService.set(StorageKey.Theme, GlobalVariables.defaultTheme);
                theme = GlobalVariables.defaultTheme;
            }

            headerHook.setLanguage(language);
            headerHook.setTheme('', theme);
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="app-container">
            {/* splash screen  */}
            <SplashScreenComponent />

            {/* loading  */}
            <LoadingComponent />

            {/* message dialog  */}

            {/* message toast  */}
            <MessageToastComponent />

            {/* dialog management  */}

            <Suspense fallback={<></>}>
                <Routes>{AppRouting}</Routes>
            </Suspense>
        </div>
    );
};

export default memo(AppComponent);
