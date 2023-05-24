import './breadcrumb.component.scss';

import { cloneDeep } from 'lodash';
import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import sprintf from 'sprintf-js';

import { LogIdentiferFormat, LogSubType, LogType } from '../../constants/log.const';
import useCommonFunc from '../../hooks/common-func.hook';
import useLog from '../../hooks/log.hook';
import { BreadcrumbItem } from '../../models/breadcrumb.model';
import { isNullOrUndefined } from '../../utils/common-func.util';
import useBreadcrumb from './breadcrumb.hook';

const BreadcrumbComponent = () => {
    const logHook = useLog();
    const breadcrumbHook = useBreadcrumb();
    const commonFuncHook = useCommonFunc();

    const [items, setItems] = useState([] as BreadcrumbItem[]);
    const { t } = useTranslation();

    useEffect(() => {
        try {
            if (!isNullOrUndefined(breadcrumbHook.breadcrumbs?.items)) {
                setItems(cloneDeep(breadcrumbHook.breadcrumbs?.items) ?? []);
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, [breadcrumbHook.breadcrumbs?.items]);

    const redirectPage = (item: BreadcrumbItem) => {
        try {
            if (item.url) {
                // write log
                logHook.operation(LogType.Action, {
                    subType: LogSubType.ScreenTransition,
                    identifier: sprintf(LogIdentiferFormat.Breadcrumb, t(item.label ?? '')),
                    destinationScreen: item.destinationScreen
                });

                Navigate({ to: item.url });
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <nav className="breadcrumb-container">
            {useMemo(
                () =>
                    items.map((item, index) => {
                        const first = index === 0;
                        const last = items.length - 1;

                        if (item.url && !last) {
                            return (
                                <Fragment key={item.id}>
                                    {!first && <i className="pi pi-angle-right"></i>}
                                    <a
                                        className="bc-item bc-anchor"
                                        onClick={() => redirectPage(item)}
                                    >
                                        {item.imgIcon && (
                                            <img
                                                className={item.imgIconClassName}
                                                src={item.imgIcon}
                                                alt={item.imgIconAlt}
                                                width={item.style?.width || 12}
                                                height={item.style?.height || 16}
                                            />
                                        )}
                                        {item.icon && <i className={`pi ${item.icon}`}></i>}

                                        {t(item.label ?? '')}
                                    </a>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={item.id}>
                                    {!first && <i className="pi pi-angle-right"></i>}
                                    <div className="bc-item">
                                        {item.imgIcon && (
                                            <img
                                                className={item.imgIconClassName}
                                                src={item.imgIcon}
                                                alt={item.imgIconAlt}
                                                width={item.style?.width || 12}
                                                height={item.style?.height || 16}
                                            />
                                        )}
                                        {item.icon && <i className={`pi ${item.icon}`}></i>}

                                        <span className="active">{t(item.label ?? '')}</span>
                                    </div>
                                </Fragment>
                            );
                        }
                    }),
                [items]
            )}
        </nav>
    );
};

export default memo(BreadcrumbComponent);
