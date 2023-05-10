import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setProps } from './loading.reducer';

let apiReqCount = 0;
let isPendingAPI = false;

const useLoading = () => {
    const isOn = useAppSelector((state) => state.loading.isOn);
    const dispatch = useAppDispatch();

    const show = (pendingAPI = true) => {
        try {
            dispatch(setProps({ isOn: true }));

            if (!pendingAPI) {
                apiReqCount = 0;
                isPendingAPI = false;
            }
        } catch (error) {
            throw error;
        }
    };

    const hide = (pendingAPI = true) => {
        try {
            if (apiReqCount === 0) {
                dispatch(setProps({ isOn: false }));
            }

            if (pendingAPI) {
                isPendingAPI = true;
            }
        } catch (error) {
            throw error;
        }
    };

    const hideByZeroCount = (reqUrl?: string) => {
        try {
            // if reqURL is not API route => stop
            if (
                reqUrl?.includes(
                    `${process.env['REACT_APP_API_HOST']}${process.env['REACT_APP_API_PREFIX']}`.toLowerCase()
                )
            ) {
                if (apiReqCount && apiReqCount > 0) {
                    apiReqCount--;
                }

                if (apiReqCount === 0) {
                    hide();
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const incrementAPIReqCount = () => {
        apiReqCount++;
    };

    return {
        isOn,
        isPendingAPI,
        show,
        hide,
        hideByZeroCount,
        incrementAPIReqCount
    };
};

export default useLoading;
