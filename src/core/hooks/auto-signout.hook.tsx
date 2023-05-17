import { addMilliseconds } from 'date-fns';

import { StorageKey } from '../constants/storage-key.const';
import { GlobalVariables } from '../utils/global-variables.util';
import useAuth from './auth.hook';
import useCommonFunc from './common-func.hook';
import useLocalStorage from './local-storage.hook';

let interval: any;

const useAutoSignOut = () => {
    const authHook = useAuth();
    const localStorageHook = useLocalStorage();
    const commonFuncHook = useCommonFunc();

    const init = () => {
        tracker();
        startInterval();
    };

    const startInterval = () => {
        updateExpiredTime();
        interval = setInterval(async () => {
            try {
                const expiredTime = +localStorageHook.get(StorageKey.AutoSignoutTime) ?? 0;

                // pending auto signing out when needed
                if (GlobalVariables.pendingAutoSignOut) {
                    updateExpiredTime();
                } else if (expiredTime < Date.now() && authHook.isSignedInSession()) {
                    const isSuccess = await authHook.signOut();

                    if (isSuccess) {
                        cleanUp();
                    }
                }
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, GlobalVariables.autoSignOutIntervalMilSecond);
    };

    const updateExpiredTime = () => {
        try {
            const newExpiredTime = addMilliseconds(Date.now(), GlobalVariables.autoSignOutDurationMinute * 60 * 1000)
                .getTime()
                .toString();

            localStorageHook.set(StorageKey.AutoSignoutTime, newExpiredTime);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const tracker = () => {
        try {
            window.addEventListener('click', () => updateExpiredTime());
            window.addEventListener('mouseover', () => updateExpiredTime());
            window.addEventListener('mouseout', () => updateExpiredTime());

            window.addEventListener('keydown', () => updateExpiredTime());
            window.addEventListener('keyup', () => updateExpiredTime());
            window.addEventListener('keypress', () => updateExpiredTime());

            window.addEventListener('touchstart', () => updateExpiredTime());
            window.addEventListener('touchmove', () => updateExpiredTime());
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const cleanUp = () => {
        try {
            clearInterval(interval);
            localStorageHook.remove(StorageKey.AutoSignoutTime);

            window.removeEventListener('click', () => updateExpiredTime());
            window.removeEventListener('mouseover', () => updateExpiredTime());
            window.removeEventListener('mouseout', () => updateExpiredTime());

            window.removeEventListener('keydown', () => updateExpiredTime());
            window.removeEventListener('keyup', () => updateExpiredTime());
            window.removeEventListener('keypress', () => updateExpiredTime());

            window.removeEventListener('touchstart', () => updateExpiredTime());
            window.removeEventListener('touchmove', () => updateExpiredTime());
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        init
    };
};

export default useAutoSignOut;
