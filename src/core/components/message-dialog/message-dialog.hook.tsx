import { cloneDeep } from 'lodash';

import useCommonFunc from '../../hooks/common-func.hook';
import { ActionItem } from '../../models/item.model';
import { MessageItem, MessageOptions } from '../../models/message.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setPropsMsgDialog } from './message-dialog.reducer';

const YES_BUTTON: ActionItem = {
    label: 'BTN_0001',
    className: 'btn-primary',
    isDefault: true
};
const NO_BUTTON: ActionItem = {
    label: 'BTN_0002',
    className: 'btn-danger'
};

const CLOSE_BUTTON: ActionItem = {
    label: 'BTN_0003',
    className: 'btn-secondary',
    isDefault: true
};

const CANCEL_BUTTON: ActionItem = {
    label: 'BTN_0004',
    className: 'btn-secondary'
};

const useMessageDialog = () => {
    const [messages] = useAppSelector((state) => [state.msgDialog.messages ?? []]);
    const dispatch = useAppDispatch();

    const commonFuncHook = useCommonFunc();

    const clearAll = () => {
        dispatch(
            setPropsMsgDialog({
                messages: []
            })
        );
    };

    const clear = (id: string) => {
        dispatch(
            setPropsMsgDialog({
                messages: messages.filter((message) => message.id !== id)
            })
        );
    };

    const custom = (key: string, options?: MessageOptions) => show(key, options);

    const success = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            className: options?.className ? `${options?.className} dlg-success` : 'dlg-success',
            header: options?.header ?? 'MSG.TITLE_001'
        };

        setMessageParams(key, options, closeAction);
    };

    const info = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            className: options?.className ? `${options?.className} dlg-info` : 'dlg-info',
            header: options?.header ?? 'MSG.TITLE_005'
        };

        setMessageParams(key, options, closeAction);
    };

    const error = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            className: options?.className ? `${options?.className} dlg-error` : 'dlg-error',
            header: options?.header ?? 'MSG.TITLE_002'
        };

        setMessageParams(key, options, closeAction);
    };

    const warn = (key: string, options?: MessageOptions, closeAction?: () => void) => {
        options = {
            ...options,
            className: options?.className ? `${options?.className} dlg-warn` : 'dlg-warn',
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
            className: options?.className ? `${options?.className} dlg-confirm` : 'dlg-confirm',
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
                setPropsMsgDialog({
                    messages: clonedMsg
                })
            );
        } catch (error) {
            commonFuncHook.handleError(error);
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
