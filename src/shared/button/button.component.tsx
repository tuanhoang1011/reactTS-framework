import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { sprintf } from 'sprintf-js';

import { LogIdentiferFormat, LogSubType, LogType } from '../../core/constants/log.const';
import useCommonFunc from '../../core/hooks/common-func.hook';
import useLog from '../../core/hooks/log.hook';
import { CommonProps } from '../../core/models/common-props.model';
import withBaseComponent from '../base-component/base.component';

interface Props extends CommonProps {
    content?: string;
    className?: string;
    disabled?: boolean;
    isWriteLog?: boolean;
    onClickAction?: () => void;
}

const ButtonComponent = (props: Props) => {
    const logHook = useLog();
    const commonFuncHook = useCommonFunc();
    const { t } = useTranslation();

    const clickAction = (e: any) => {
        try {
            if (props.disabled) return;

            const writeLog = () => {
                if (props.isWriteLog && props.content) {
                    // write log
                    logHook.operation(LogType.Action, {
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
                        props.onClickAction!();
                    }
                    break;
                case 'keyup':
                    // 13: enter/return key
                    if (e.keyCode === 13) {
                        writeLog();
                        props.onClickAction!();
                    }
                    break;
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <button
            className={`btn ${props.className}${props.disabled ? ' app-disabled' : ''}`}
            disabled={props.disabled}
            onPointerDown={($event) => clickAction($event)}
            onKeyUp={($event) => clickAction($event)}
        >
            {t(props.content ?? '')}
            {props.children}
        </button>
    );
};

ButtonComponent.defaultProps = {
    isWriteLog: true,
    onClickAction: () => {}
};

// export default memo(ButtonComponent);
export default withBaseComponent<Props>(memo(ButtonComponent))({ activeScreen: 'Example-screen' });
