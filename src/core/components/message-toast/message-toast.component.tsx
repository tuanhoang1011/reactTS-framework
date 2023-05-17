import './message-toast.component.scss';

import { isEmpty } from 'lodash';
import { Toast } from 'primereact/toast';
import { memo, useEffect, useRef } from 'react';

import useCommonFunc from '../../hooks/common-func.hook';
import { useAppDispatch } from '../../store/stores/store';
import useMessageToast from './message-toast.hook';
import { setProps } from './message-toast.reducer';

const MessageToastComponent = () => {
    const dispatch = useAppDispatch();
    const msgToastHook = useMessageToast();
    const commonFuncHook = useCommonFunc();

    const toast = useRef<Toast>(null);

    const position = 'bottom-right';
    const styleClass = '';

    useEffect(() => {
        try {
            if (!isEmpty(msgToastHook.messages)) {
                toast.current?.show(msgToastHook.messages);
                // clear message state
                dispatch(
                    setProps({
                        messages: []
                    })
                );
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, [msgToastHook.messages]);

    useEffect(() => {
        try {
            if (msgToastHook.isClearAll) {
                toast.current?.clear();
                // clear message state
                dispatch(
                    setProps({
                        clearAll: false
                    })
                );
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, [msgToastHook.isClearAll]);

    return (
        <Toast
            ref={toast}
            position={position}
            className={styleClass}
        ></Toast>
    );
};

export default memo(MessageToastComponent);
