import useCommonFunc from '../../hooks/common-func.hook';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setPropsLoading } from './loading.reducer';

let apiReqCount = 0;
let isPendingAPI = false;

const useLoading = () => {
    const isOn = useAppSelector((state) => state.loading.isOn);
    const dispatch = useAppDispatch();
    const commonFuncHook = useCommonFunc();

    const show = (pendingAPI = true) => {
        try {
            dispatch(setPropsLoading({ isOn: true }));

            if (!pendingAPI) {
                apiReqCount = 0;
                isPendingAPI = false;
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const hide = (pendingAPI = true) => {
        try {
            if (apiReqCount === 0) {
                dispatch(setPropsLoading({ isOn: false }));
            }

            if (pendingAPI) {
                isPendingAPI = true;
            }
        } catch (error) {
            commonFuncHook.handleError(error);
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
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const incrementAPIReqCount = () => {
        apiReqCount++;
    };

    return {
        isOn,
        apiReqCount,
        isPendingAPI,
        show,
        hide,
        hideByZeroCount,
        incrementAPIReqCount
    };
};

export default useLoading;
