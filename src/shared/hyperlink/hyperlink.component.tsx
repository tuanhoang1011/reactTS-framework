import './hyperlink.component.scss';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { sprintf } from 'sprintf-js';

import { LogIdentiferFormat, LogSubType, LogType } from '../../core/constants/log.const';
import useCommonFunc from '../../core/hooks/common-func.hook';
import useLog from '../../core/hooks/log.hook';
import { CommonProps } from '../../core/models/common-props.model';

interface Props extends CommonProps {
    content?: string;
    className?: string;
    disabled?: boolean;
    isWriteLog?: boolean;
    onClickAction: () => void;
}

const HyperlinkComponent = (props: Props) => {
    const commonFuncHook = useCommonFunc();
    const logHook = useLog();
    const { t } = useTranslation();

    const onClick = (event: any) => {
        try {
            if (props.disabled) return;

            if (props.isWriteLog) {
                // write log
                logHook.operation(LogType.Action, {
                    subType: LogSubType.HyperLink,
                    identifier: sprintf(LogIdentiferFormat.Hyperlink, t(props.content ?? ''))
                });
            }

            props.onClickAction();
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <a
            className={`${props.className} hyper-link${props.disabled ? ' app-disabled' : ''}`}
            aria-current="page"
            tabIndex={0}
            onKeyUp={($event) => onClick($event)}
            onClick={($event) => onClick($event)}
        >
            {t(props.content || '')}
        </a>
    );
};

HyperlinkComponent.defaultProps = {
    isWriteLog: true,
    onClickAction: () => {}
};

export default memo(HyperlinkComponent);
