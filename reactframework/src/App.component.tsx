import './App.component.scss';

import { useEventListener } from 'primereact/hooks';
import { memo, Suspense, useEffect, useRef } from 'react';
import { Routes } from 'react-router';

import useHeader from './core/components/header/header.hook';
import LoadingComponent from './core/components/loading/loading.component';
import useLoading from './core/components/loading/loading.hook';
import MessageDialogComponent from './core/components/message-dialog/message-dialog.component';
import MessageToastComponent from './core/components/message-toast/message-toast.component';
import SplashScreenComponent from './core/components/splash-screen/splash-screen.component';
import useSplashScreen from './core/components/splash-screen/splash-screen.hook';
import { StorageKey } from './core/constants/storage-key.const';
import useAuth from './core/hooks/auth.hook';
import useAutoSignOut from './core/hooks/auto-signout.hook';
import useCommonFunc from './core/hooks/common-func.hook';
import useConfig from './core/hooks/config.hook';
import useLocalStorage from './core/hooks/local-storage.hook';
import { AppRouting } from './core/routing/app.routing';
import { GlobalVariables } from './core/utils/global-variables.util';
import withBaseComponent from './shared/base-component/base.component';

const AppComponent = () => {
    const localStorageHook = useLocalStorage();
    const splashScreenHook = useSplashScreen();
    const loadingHook = useLoading();
    const headerHook = useHeader();
    const configHook = useConfig();
    const authHook = useAuth();
    const autoSignOutHook = useAutoSignOut();
    const commonFuncHook = useCommonFunc();

    const [bindKeyDown, unbindKeydown] = useEventListener({
        type: 'keydown',
        listener: (e: KeyboardEvent) => {
            // prevent input when loading is showing
            if (loadingHook.isOn) {
                e.preventDefault();
            }
        }
    });
    const [bindStorage, unbindStorage] = useEventListener({
        type: 'storage',
        listener: (e: StorageEvent) => onStorageChange
    });
    const appRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            configHook.loadConfig().then(() => {
                applyConfig();

                bindKeyDown();
                autoSignOutHook.init();

                // user signed out at other tab (same browser) -> will sign out at current tab
                bindStorage();

                // already signed in
                if (authHook.isSignedInSession()) {
                    authHook.setSignedOutSession(false);
                    authHook.signedOutCurrentTab = false;
                }
            });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }

        return () => {
            unbindKeydown();
            unbindStorage();
        };
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
            commonFuncHook.handleError(error);
            throw error;
        }
    }, [splashScreenHook.isOn]);

    const onStorageChange = async (e: StorageEvent) => {
        try {
            if (e.newValue) {
                // user signed out at other tab (same browser) -> will sign out at current tab
                const isDiffSignedOut = authHook.isSignedOutSession() !== authHook.signedOutCurrentTab;

                if (authHook.isSignedInSession() && !authHook.signedOutCurrentTab && isDiffSignedOut) {
                    await authHook.signOut();

                    return;
                }
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

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
            commonFuncHook.handleError(error);
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

export default withBaseComponent(memo(AppComponent))({});
