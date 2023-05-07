import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setProps } from './loading.reducer';

const useLoading = () => {
    const state = useAppSelector((state) => state.loading);
    const dispatch = useAppDispatch();

    const show = (isPendingAPI = true) => {
        try {
            dispatch(setProps({ isOn: true }));

            if (!isPendingAPI) {
                dispatch(
                    setProps({
                        apiReqCount: 0,
                        isPendingAPI: false
                    })
                );
            }
        } catch (error) {
            throw error;
        }
    };

    const hide = (isPendingAPI = true) => {
        try {
            if (state.apiReqCount === 0) {
                dispatch(setProps({ isOn: false }));
            }

            if (isPendingAPI) {
                dispatch(
                    setProps({
                        isPendingAPI: true
                    })
                );
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
                if (state.apiReqCount && state.apiReqCount > 0) {
                    state.apiReqCount--;
                }

                if (state.apiReqCount === 0) {
                    hide();
                }
            }
        } catch (error) {
            throw error;
        }
    };

    return {
        ...state,
        show,
        hide,
        hideByZeroCount
    };
};

export default useLoading;
