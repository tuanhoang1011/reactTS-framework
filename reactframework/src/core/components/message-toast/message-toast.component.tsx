import './message-toast.component.scss';

import { isEmpty } from 'lodash';
import { Toast } from 'primereact/toast';
import { memo, useEffect, useRef } from 'react';

import { useAppDispatch } from '../../store/stores/store';
import useMessageToast from './message-toast.hook';
import { setProps } from './message-toast.reducer';

const MessageToastComponent = () => {
    const dispatch = useAppDispatch();
    const msgToastHook = useMessageToast();
    const toast = useRef<Toast>(null);

    const position = 'bottom-right';
    const styleClass = '';

    useEffect(() => {
        if (!isEmpty(msgToastHook.messages)) {
            toast.current?.show(msgToastHook.messages);

            // clear message state
            dispatch(
                setProps({
                    messages: []
                })
            );
        }
    }, [msgToastHook.messages]);

    useEffect(() => {
        if (msgToastHook.isClearAll) {
            toast.current?.clear();
            // clear message state
            dispatch(
                setProps({
                    clearAll: false
                })
            );
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
