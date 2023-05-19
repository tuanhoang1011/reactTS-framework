import './message-dialog.component.scss';

import { Fragment, memo, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { sprintf } from 'sprintf-js';

import ButtonComponent from '../../../shared/button/button.component';
import DialogComponent from '../../../shared/dialog/dialog.component';
import { LogIdentiferFormat, LogSubType, LogType } from '../../constants/log.const';
import useCommonFunc from '../../hooks/common-func.hook';
import useLog from '../../hooks/log.hook';
import { ActionItem } from '../../models/item.model';
import { Message } from '../../models/message.model';
import useMessageDialog from './message-dialog.hook';

const MessageDialogComponent = () => {
    const msgDialogHook = useMessageDialog();
    const logHook = useLog();
    const commonFuncHook = useCommonFunc();
    const { t } = useTranslation();

    const clickAction = (msgItem: Message, action: ActionItem) => {
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

    return (
        <>
            {useMemo(
                () =>
                    msgDialogHook.messages.map((msgItem) => {
                        return (
                            <DialogComponent
                                key={msgItem.id}
                                dialogId={msgItem.id}
                                className={`msg-dialog-container ${msgItem.options?.className}`}
                                contentClassName={`rounded-b-none ${msgItem.options?.contentClassName} ${
                                    msgItem.options?.header ? '' : 'rounded-t-default'
                                }`}
                                footerClassName={msgItem.options?.footerClassName}
                                showHeader={!!msgItem.options?.header}
                                draggable={false}
                                closable={msgItem.options?.closable ?? true}
                                closeOnEscape={false}
                                maximizable={false}
                                headerTitle={msgItem.options?.header}
                                onHide={() => closeMessage(msgItem)}
                            >
                                <Fragment key="content">
                                    <div className={`msg-icon ${msgItem.options?.iconClassName}`}></div>
                                    <div className={`msg-content ${msgItem.options?.detailClassName}`}>
                                        <p>
                                            <Translation>
                                                {(t) => sprintf(t(msgItem.key), ...(msgItem.options?.variables ?? ''))}
                                            </Translation>
                                        </p>
                                    </div>
                                </Fragment>

                                <Fragment key="footer">
                                    {msgItem.options?.actions?.map((action) => {
                                        if (action.isDefault) {
                                            return (
                                                <ButtonComponent
                                                    key={action.label}
                                                    content={action.label}
                                                    className={`dl-f-btn ${action.className}`}
                                                    isWriteLog={false}
                                                    onClickAction={() => clickAction(msgItem, action)}
                                                ></ButtonComponent>
                                            );
                                        } else {
                                            return (
                                                <ButtonComponent
                                                    key={action.label}
                                                    content={action.label}
                                                    className={`dl-f-btn ${action.className}`}
                                                    isWriteLog={false}
                                                    onClickAction={() => clickAction(msgItem, action)}
                                                ></ButtonComponent>
                                            );
                                        }
                                    })}
                                </Fragment>
                            </DialogComponent>
                        );
                    }),
                [msgDialogHook.messages]
            )}
        </>
    );
};

export default memo(MessageDialogComponent);
