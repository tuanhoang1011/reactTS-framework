import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import breadcrumbReducer from '../../components/breadcrumb/breadcrumb.reducer';
import loadingReducer from '../../components/loading/loading.reducer';
import messageToastReducer from '../../components/message-toast/message-toast.reducer';
import sidebarReducer from '../../components/sidebar/sidebar.reducer';
import splashScreenReducer from '../../components/splash-screen/splash-screen.reducer';

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const Store = configureStore({
    reducer: {
        loading: loadingReducer,
        splashScreen: splashScreenReducer,
        sidebar: sidebarReducer,
        breadrumb: breadcrumbReducer,
        msgToast: messageToastReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
export default Store;
