import { Translation } from 'react-i18next';
import { sprintf } from 'sprintf-js';

import { MessageOptions } from '../../models/message.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { GlobalVariables } from '../../utils/global-variables.util';
import { setPropsMsgToast } from './message-toast.reducer';

const useMessageToast = () => {
    const [messages, isClearAll] = useAppSelector((state) => [state.msgToast.messages ?? [], state.msgToast.clearAll]);
    const dispatch = useAppDispatch();

    const show = (id: string, type: 'success' | 'info' | 'warn' | 'error', options?: MessageOptions) => {
        dispatch(
            setPropsMsgToast({
                messages: [
                    {
                        summary: options?.header,
                        severity: type,
                        icon: options?.icon,
                        life: GlobalVariables.messageLifeTimeMilSecond,
                        closable: options?.closable ?? true,
                        sticky: type === 'success' ? false : options?.sticky ?? true,
                        className: options?.contentStyleClass,
                        contentClassName: options?.contentStyleClass,
                        content: (
                            <div className="flex flex-col w-full gap-y-4">
                                <div className="flex items-center gap-x-2">
                                    <i className={`text-[2rem] pi ${options?.icon}`}></i>
                                    <p className="text-fs-msg font-bold">
                                        <Translation>{(t) => t(options?.header ?? '')}</Translation>
                                    </p>
                                </div>
                                <div className={`flex text-fs-msg ${options?.detailStyleClass}`}>
                                    <Translation>
                                        {(t) => sprintf(t(id || ''), ...(options?.variables ?? []))}
                                    </Translation>
                                </div>
                            </div>
                        )
                    }
                ]
            })
        );
    };

    const success = (id: string, options?: MessageOptions): void => {
        options = {
            ...options,
            header: options?.header ?? 'MSG.TITLE_001',
            icon: options?.icon ?? 'pi-check-circle'
        };

        show(id, 'success', options);
    };

    const info = (id: string, options?: MessageOptions): void => {
        options = {
            ...options,
            header: options?.header ?? 'MSG.TITLE_005',
            icon: options?.icon ?? 'pi-info-circle'
        };

        show(id, 'info', options);
    };

    const error = (id: string, options?: MessageOptions): void => {
        options = {
            ...options,
            header: options?.header ?? 'MSG.TITLE_002',
            icon: options?.icon ?? 'pi-times-circle'
        };

        show(id, 'error', options);
    };

    const warn = (id: string, options?: MessageOptions): void => {
        options = {
            ...options,
            header: options?.header ?? 'MSG.TITLE_003',
            icon: options?.icon ?? 'pi-exclamation-triangle'
        };

        show(id, 'warn', options);
    };

    const clearAll = () => {
        dispatch(setPropsMsgToast({ clearAll: true }));
    };

    return {
        messages,
        isClearAll,
        show,
        success,
        info,
        error,
        warn,
        clearAll
    };
};

export default useMessageToast;
