import './message-dialog.component.scss';

import { Dialog } from 'primereact/dialog';
import { memo, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { sprintf } from 'sprintf-js';

import ButtonComponent from '../../../shared/button/button.component';
import { LogIdentiferFormat, LogSubType, LogType } from '../../constants/log.const';
import useCommonFunc from '../../hooks/common-func.hook';
import useLog from '../../hooks/log.hook';
import { Message, MessageAction } from '../../models/message.model';
import useMessageDialog from './message-dialog.hook';

const MessageDialogComponent = () => {
    const msgDialogHook = useMessageDialog();
    const logHook = useLog();
    const commonFuncHook = useCommonFunc();
    const { t } = useTranslation();

    const clickAction = (msgItem: Message, action: MessageAction) => {
        try {
            msgDialogHook.clear(msgItem.id);

            // write log
            logHook.operation(LogType.Action, {
                subType: LogSubType.Button,
                identifier: sprintf(LogIdentiferFormat.MessageButton, t(msgItem.key), t(action.label))
            });

            if (action.click) {
                action.click();
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const closeMessage = (msgItem: Message) => {
        try {
            msgDialogHook.clear(msgItem.id);

            // write log
            logHook.operation(LogType.Action, {
                subType: LogSubType.Button,
                identifier: sprintf(LogIdentiferFormat.MessageButton, 'X', t(msgItem.key))
            });

            if (msgItem.options?.clickX) msgItem.options.clickX();
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const generateHeader = (msgItem: Message) => {
        return (
            <>
                {msgItem.options?.header && (
                    <div className="dlg-header">
                        <h1 className="dlg-header-content">
                            <Translation>{(t) => t(msgItem.options?.header || '')}</Translation>
                        </h1>
                    </div>
                )}
            </>
        );
    };

    const generateFooter = (msgItem: Message) => {
        return (
            <>
                <div className={`dlg-footer ${msgItem.options?.footerStyleClass}`}>
                    {msgItem.options?.actions?.map((action) => {
                        if (action.isDefault) {
                            return (
                                <ButtonComponent
                                    key={action.label}
                                    content={action.label}
                                    styleClass={`dlg-btn ${action.styleClass}`}
                                    isWriteLog={false}
                                    onClickAction={() => clickAction(msgItem, action)}
                                ></ButtonComponent>
                            );
                        } else {
                            return (
                                <ButtonComponent
                                    key={action.label}
                                    content={action.label}
                                    styleClass={`dlg-btn ${action.styleClass}`}
                                    isWriteLog={false}
                                    onClickAction={() => clickAction(msgItem, action)}
                                ></ButtonComponent>
                            );
                        }
                    })}
                </div>
            </>
        );
    };

    return (
        <>
            {useMemo(
                () =>
                    msgDialogHook.messages.map((msgItem) => {
                        return (
                            <Dialog
                                key={msgItem.key}
                                visible={true}
                                focusOnShow={false}
                                modal={true}
                                closeOnEscape={false}
                                showHeader={!!msgItem.options?.header}
                                className={msgItem.options?.styleClass ?? ''}
                                contentClassName={`rounded-b-none ${
                                    msgItem.options?.header ? '' : 'rounded-t-default'
                                }`}
                                draggable={false}
                                resizable={false}
                                blockScroll={false}
                                closable={msgItem.options?.closable ?? true}
                                style={{
                                    minWidth: '600px',
                                    maxWidth: '800px',
                                    minHeight: '200px',
                                    maxHeight: '350px'
                                }}
                                header={generateHeader(msgItem)}
                                footer={generateFooter(msgItem)}
                                onHide={() => closeMessage(msgItem)}
                            >
                                <div className={`dlg-content ${msgItem.options?.contentStyleClass}`}>
                                    <div className={`msg-icon ${msgItem.options?.iconStyleClass}`}></div>
                                    <div className={`msg-content ${msgItem.options?.detailStyleClass}`}>
                                        <p>
                                            <Translation>
                                                {(t) => sprintf(t(msgItem.key), ...(msgItem.options?.variables ?? ''))}
                                            </Translation>
                                        </p>
                                    </div>
                                </div>
                            </Dialog>
                        );
                    }),
                [msgDialogHook.messages]
            )}
        </>
    );
};

export default memo(MessageDialogComponent);
