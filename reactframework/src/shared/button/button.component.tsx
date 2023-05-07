import { memo } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { sprintf } from 'sprintf-js';
import { LogIdentiferFormat, LogSubType, LogType } from '../../core/constants/log.const';

import { CommonProps } from '../../core/models/common-props.model';
import { LogService } from '../../core/services/log/log.service';

interface Props extends CommonProps {
    content?: string;
    styleClass?: string;
    disabled?: boolean;
    isWriteLog?: boolean;
    onClickAction: () => void;
}

const logService = LogService.getInstance();

const ButtonComponent = (props: Props) => {
    const { t } = useTranslation();

    const clickAction = (e: any) => {
        try {
            if (props.disabled) return;

            const writeLog = () => {
                if (props.isWriteLog && props.content) {
                    // write log
                    logService.operation(LogType.Action, {
                        subType: LogSubType.Button,
                        identifier: sprintf(LogIdentiferFormat.Button, t(props.content ?? ''))
                    });
                }
            };

            switch (e.type) {
                case 'pointerdown':
                    // 0 | 1: left click/touch
                    if (e.which === 1 || e.button === 0) {
                        writeLog();
                        props.onClickAction();
                    }
                    break;
                case 'keyup':
                    // 13: enter/return key
                    if (e.keyCode === 13) {
                        writeLog();
                        props.onClickAction();
                    }
                    break;
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <button
            className={`btn ${props.styleClass}${props.disabled ? ' app-disabled' : ''}`}
            disabled={props.disabled}
            onPointerDown={($event) => clickAction($event)}
            onKeyUp={($event) => clickAction($event)}
        >
            {t(props.content ?? '')}
        </button>
    );
};

ButtonComponent.defaultProps = {
    isWriteLog: true,
    onClickAction: () => {}
};

export default compose(withTranslation())(memo(ButtonComponent));
