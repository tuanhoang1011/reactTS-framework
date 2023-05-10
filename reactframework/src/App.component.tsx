import './app.component.scss';

import { memo, Suspense, useEffect, useRef } from 'react';
import { Routes } from 'react-router';

import useHeader from './core/components/header/header.hook';
import LoadingComponent from './core/components/loading/loading.component';
import MessageDialogComponent from './core/components/message-dialog/message-dialog.component';
import MessageToastComponent from './core/components/message-toast/message-toast.component';
import SplashScreenComponent from './core/components/splash-screen/splash-screen.component';
import useSplashScreen from './core/components/splash-screen/splash-screen.hook';
import { StorageKey } from './core/constants/storage-key.const';
import useConfig from './core/hooks/config.hook';
import useLocalStorage from './core/hooks/local-storage.hook';
import { AppRouting } from './core/routing/app.routing';
import { GlobalVariables } from './core/utils/global-variables.ultility';

const AppComponent = () => {
    const localStorageHook = useLocalStorage();
    const splashScreenHook = useSplashScreen();
    const headerHook = useHeader();
    const configHook = useConfig();
    const appRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            configHook.loadConfig().then(() => applyConfig());
        } catch (error) {
            throw error;
        }
    }, []);

    // remove later
    useEffect(() => {
        try {
            if (!splashScreenHook.isOn) {
                const timer = setInterval(() => {
                    appRef.current?.scrollTo(0, 0);
                }, 50);
                setTimeout(() => {
                    clearInterval(timer);
                }, 500);
            }
        } catch (error) {
            throw error;
        }
    }, [splashScreenHook.isOn]);

    const applyConfig = () => {
        try {
            setTimeout(() => {
                splashScreenHook.hide();
            }, GlobalVariables.splashScreenDurationMilSecond);

            let language = localStorageHook.get(StorageKey.Language);
            let theme = localStorageHook.get(StorageKey.Theme);

            if (language === '') {
                localStorageHook.set(StorageKey.Language, GlobalVariables.defaultLanguage);
                language = GlobalVariables.defaultLanguage;
            }

            if (theme === '') {
                localStorageHook.set(StorageKey.Theme, GlobalVariables.defaultTheme);
                theme = GlobalVariables.defaultTheme;
            }

            headerHook.setLanguage(language);
            headerHook.setTheme('', theme);
        } catch (error) {
            throw error;
        }
    };

    return (
        <div
            ref={appRef}
            className="app-container"
        >
            {/* splash screen  */}
            <SplashScreenComponent />

            {/* loading  */}
            <LoadingComponent />

            {/* message dialog  */}
            <MessageDialogComponent />

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
