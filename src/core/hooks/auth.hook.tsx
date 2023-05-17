import { differenceInCalendarDays } from 'date-fns';
import { assignIn, cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { Subject, takeUntil } from 'rxjs';

import useAuthAPI from '../../network-services/api/auth-api.hook';
import useLoading from '../components/loading/loading.hook';
import useMessageToast from '../components/message-toast/message-toast.hook';
import { AppRoutes } from '../constants/router.const';
import { StorageKey } from '../constants/storage-key.const';
import { ErrorCode } from '../enums/server-error-code.enum';
import { SignInRequest, SignInResponse, UserProfileResponse } from '../models/auth.model';
import { ErrorResponse, HttpErrorResponse } from '../models/http-response.model';
import useCommonFunc from './common-func.hook';
import useLocalStorage from './local-storage.hook';

let signedOutCurrentTab = true;

const useAuth = () => {
    const localStorageHook = useLocalStorage();
    const loadingHook = useLoading();
    const msgToastHook = useMessageToast();
    const commonFuncHook = useCommonFunc();

    // API hook
    const authAPIHook = useAuthAPI();

    // signed in session
    const isSignedInSession = (): boolean => {
        return localStorageHook.get(StorageKey.SignInState) === '1';
    };
    const [getSignedInSession, setSignedInSession] = useState(isSignedInSession());
    useEffect(() => {
        localStorageHook.set(StorageKey.SignInState, getSignedInSession ? '1' : '0');
    }, [getSignedInSession]);

    // signed out session
    const isSignedOutSession = (): boolean => {
        return localStorageHook.get(StorageKey.SignOutState) === '1';
    };
    const [getSignedOutSession, setSignedOutSession] = useState(isSignedOutSession());
    useEffect(() => {
        localStorageHook.set(StorageKey.SignOutState, getSignedOutSession ? '1' : '0');
    }, [getSignedOutSession]);

    // expired sign in
    const expiresIn = (): number => {
        try {
            if (!isSignedInSession()) {
                return 0;
            }

            return parseInt(localStorageHook.get(StorageKey.AuthExpiredTime), 10);
        } catch (error) {
            console.error(error);
            return 0;
        }
    };
    const [getExpiresIn, setExpiresIn] = useState(expiresIn());
    useEffect(() => {
        localStorageHook.set(StorageKey.AuthExpiredTime, getExpiresIn.toString());
    }, [getExpiresIn]);

    // user profile
    const userProfile = (): UserProfileResponse => {
        try {
            if (!isSignedInSession()) {
                return { profile: {} };
            }

            return JSON.parse(localStorageHook.get(StorageKey.UserProfile));
        } catch (error) {
            console.error(error);
            return { profile: {} };
        }
    };
    const [getUserProfile, setUserProfile] = useState(userProfile());
    useEffect(() => {
        localStorageHook.set(StorageKey.UserProfile, JSON.stringify(getUserProfile));
    }, [getUserProfile]);

    // id token
    const idToken = (): string => {
        if (!isSignedInSession()) {
            return '';
        }

        return localStorageHook.get(StorageKey.IdToken);
    };
    const [getIdToken, setIdToken] = useState(idToken());
    useEffect(() => {
        localStorageHook.set(StorageKey.IdToken, getIdToken);
    }, [getIdToken]);

    // refresh token
    const refreshToken = (): string => {
        if (!isSignedInSession()) {
            return '';
        }

        return localStorageHook.get(StorageKey.RefreshToken);
    };
    const [getRefreshToken, setRefreshToken] = useState(refreshToken());
    useEffect(() => {
        localStorageHook.set(StorageKey.RefreshToken, getRefreshToken);
    }, [getRefreshToken]);

    // expired password
    const isExpiredPassword = (): boolean => {
        return localStorageHook.get(StorageKey.ExpiredPasswordState) === '1';
    };
    const [getExpiredPassword, setExpiredPassword] = useState(isExpiredPassword());
    useEffect(() => {
        localStorageHook.set(StorageKey.ExpiredPasswordState, getExpiredPassword ? '1' : '0');
    }, [getExpiredPassword]);

    // auto sign out
    const isAutoSignOut = (): boolean => {
        return localStorageHook.get(StorageKey.AutoSignOutState) === '1';
    };
    const [getAutoSignOut, setAutoSignOut] = useState(isAutoSignOut());
    useEffect(() => {
        localStorageHook.set(StorageKey.AutoSignOutState, getAutoSignOut ? '1' : '0');
    }, [getAutoSignOut]);

    const fetchUserProfile = () => authAPIHook.getUserProfile;

    const signIn = async (model: SignInRequest, destroy$: Subject<void>) => {
        try {
            authAPIHook
                .signIn(model)
                .pipe(takeUntil(destroy$))
                .subscribe({
                    next: async (res) => {
                        // clear auto sign out state in local storage
                        setAutoSignOut(false);

                        const isDone = await processAfterSignIn(res, model.username);

                        if (isDone) {
                            const dayDuration = differenceInCalendarDays(res.passwordExpireDate as Date, new Date());

                            // case real password is about to expire or expired
                            if (dayDuration <= 15) {
                                const isExprired = dayDuration <= 0;

                                setExpiredPassword(true);

                                // case real password is about to expire
                                if (isExprired) {
                                    clearDataAfterSignOut();
                                } else {
                                    // check later
                                }

                                return;
                            }
                        }
                    },
                    error: (err: any) => {
                        if (err instanceof HttpErrorResponse) {
                            let msg = 'MSG.APP_ERR0001';

                            if (err.error.hasOwnProperty('error')) {
                                const errorRes = err.error.error as ErrorResponse;

                                // wrong user name or password
                                if (errorRes.code === ErrorCode.UserNamePasswordWrong) {
                                    msg = 'MSG.APP_ERR0004';
                                }
                            }

                            msgToastHook.error(msg);
                        }
                    }
                });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const processAfterSignIn = (res: SignInResponse, username?: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const expiresIn = new Date().getTime() / 1000 + res.expiresIn!;

            setIdToken(res.idToken ?? '');
            setRefreshToken(res.refreshToken ?? '');
            setExpiresIn(parseInt(expiresIn, 10));
            setSignedInSession(true);
            setSignedOutSession(false);
            signedOutCurrentTab = false;

            resolve(true);
        });
    };

    const setProfileData = (res: UserProfileResponse) => {
        const profile = userProfile();

        assignIn(profile, res);
        setUserProfile(profile);
    };

    const signOut = (): Promise<boolean> => {
        try {
            return new Promise((resolve) => {
                loadingHook.show(true);
                authAPIHook.signOut().subscribe({
                    next: () => {
                        clearDataAfterSignOut();
                        loadingHook.hide(true);
                        resolve(true);

                        window.location.href = `/${AppRoutes.Public}`;
                    },
                    error: () => {
                        loadingHook.hide(true);
                        resolve(false);
                    }
                });
            });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const clearDataAfterSignOut = (): void => {
        const unclearItems = [
            {
                key: StorageKey.CurrentRoute,
                value: cloneDeep(localStorageHook.get(StorageKey.CurrentRoute))
            }
        ];
        localStorageHook.clear();
        unclearItems.forEach((x) => localStorageHook.set(x.key, x.value));

        signedOutCurrentTab = true;
        setSignedOutSession(true);
        setSignedInSession(false);
        setExpiredPassword(false);
    };

    return {
        signedOutCurrentTab,
        isSignedInSession,
        setSignedInSession,
        isSignedOutSession,
        setSignedOutSession,
        expiresIn,
        setExpiresIn,
        userProfile,
        setUserProfile,
        idToken,
        setIdToken,
        refreshToken,
        setRefreshToken,
        isExpiredPassword,
        setExpiredPassword,
        isAutoSignOut,
        setAutoSignOut,
        fetchUserProfile,
        signIn,
        signOut,
        setProfileData
    };
};

export default useAuth;
