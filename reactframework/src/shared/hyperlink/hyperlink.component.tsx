// import './hyperlink.component.scss';
import './hyperlink.component.scss';
import { sprintf } from 'sprintf-js';

import { memo } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { compose } from 'redux';

import { CommonProps } from '../../core/models/common-props.model';
import { LogIdentiferFormat, LogSubType, LogType } from '../../core/constants/log.const';
import { LogService } from '../../core/services/log/log.service';

interface Props extends CommonProps {
    content?: string;
    styleClass?: string;
    disabled?: boolean;
    isWriteLog?: boolean;
    onClickAction: () => void;
}

const logService = LogService.getInstance();

const HyperlinkComponent = (props: Props) => {
    const { t } = useTranslation();

    const onClick = (event: any) => {
        try {
            if (props.disabled) return;

            if (props.isWriteLog) {
                // write log
                logService.operation(LogType.Action, {
                    subType: LogSubType.HyperLink,
                    identifier: sprintf(LogIdentiferFormat.Hyperlink, t(props.content ?? ''))
                });
            }

            props.onClickAction();
        } catch (error) {
            throw error;
        }
    };

    return (
        <a
            className={`${props.styleClass} hyper-link${props.disabled ? ' app-disabled' : ''}`}
            aria-current="page"
            tabIndex={0}
            href="!#"
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

export default compose(withTranslation())(memo(HyperlinkComponent));
