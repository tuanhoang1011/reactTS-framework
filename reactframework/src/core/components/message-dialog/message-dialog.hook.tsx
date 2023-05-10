import { cloneDeep } from 'lodash';
import { useState } from 'react';

import { MessageAction, MessageItem, MessageOptions } from '../../models/message.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setProps } from './message-dialog.reducer';

const YES_BUTTON: MessageAction = {
    label: 'BTN_0001',
    styleClass: 'btn-primary',
    isDefault: true
};
const NO_BUTTON: MessageAction = {
    label: 'BTN_0002',
    styleClass: 'btn-danger'
};

const CLOSE_BUTTON: MessageAction = {
    label: 'BTN_0003',
    styleClass: 'btn-secondary',
    isDefault: true
};

const CANCEL_BUTTON: MessageAction = {
    label: 'BTN_0004',
    styleClass: 'btn-secondary'
};

const useMessageDialog = () => {
    const [messages] = useAppSelector((state) => [state.msgDialog.messages ?? []]);
    const dispatch = useAppDispatch();

    const clearAll = () => {
        dispatch(
            setProps({
                messages: []
            })
        );
    };

    const clear = (id: string) => {
        dispatch(
            setProps({
                messages: messages.filter((message) => message.id !== id)
            })
        );
    };

    const custom = (key: string, options?: MessageOptions) => show(key, options);

    const success = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            styleClass: options?.styleClass ? `${options?.styleClass} dlg-success` : 'dlg-success',
            header: options?.header ?? 'MSG.TITLE_001'
        };

        setMessageParams(key, options, closeAction);
    };

    const info = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            styleClass: options?.styleClass ? `${options?.styleClass} dlg-info` : 'dlg-info',
            header: options?.header ?? 'MSG.TITLE_005'
        };

        setMessageParams(key, options, closeAction);
    };

    const error = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            styleClass: options?.styleClass ? `${options?.styleClass} dlg-error` : 'dlg-error',
            header: options?.header ?? 'MSG.TITLE_002'
        };

        setMessageParams(key, options, closeAction);
    };

    const warn = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            styleClass: options?.styleClass ? `${options?.styleClass} dlg-warn` : 'dlg-warn',
            header: options?.header ?? 'MSG.TITLE_003'
        };

        setMessageParams(key, options, closeAction);
    };

    const confirm = (
        key: string,
        options: MessageOptions = {},
        acceptAction?: () => void,
        rejectAction?: () => void,
        cancelAction?: () => void
    ): void => {
        options = {
            ...options,
            styleClass: options?.styleClass ? `${options?.styleClass} dlg-confirm` : 'dlg-confirm',
            header: options?.header ?? 'MSG.TITLE_004',
            actions: [
                { ...CANCEL_BUTTON, click: cancelAction },
                { ...NO_BUTTON, click: rejectAction },
                { ...YES_BUTTON, click: acceptAction }
            ]
        };

        show(key, options);
    };

    const setMessageParams = (key: string, options: MessageOptions = {}, closeAction?: () => void) => {
        // in case confirm message does not has any actions
        options = {
            ...options,
            actions: [{ ...CLOSE_BUTTON, click: closeAction }]
        };

        show(key, options);
    };

    const show = (key: string, options: MessageOptions = {}) => {
        try {
            const clonedMsg = cloneDeep(messages);
            clonedMsg.push(new MessageItem(key, options));

            dispatch(
                setProps({
                    messages: clonedMsg
                })
            );
        } catch (error) {
            throw error;
        }
    };

    return {
        messages,
        clearAll,
        clear,
        custom,
        success,
        info,
        error,
        warn,
        confirm
    };
};

export default useMessageDialog;
