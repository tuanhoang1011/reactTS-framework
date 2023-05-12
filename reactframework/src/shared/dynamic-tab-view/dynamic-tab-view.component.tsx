import './dynamic-tab-view.component.scss';

import { TabPanel, TabPanelHeaderTemplateOptions, TabView, TabViewTabChangeEvent } from 'primereact/tabview';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { sprintf } from 'sprintf-js';

import { LogIdentiferFormat, LogSubType, LogType } from '../../core/constants/log.const';
import useLog from '../../core/hooks/log.hook';
import { CommonProps } from '../../core/models/common-props.model';
import { TabItem } from '../../core/models/item.model';

interface Props extends CommonProps {
    items: TabItem[];
    queryParamKey?: string;
    styleClass?: string;
    layout?: 'horizontal' | 'vertical';
    isWriteLog?: boolean;
    onClickTab: (tab: TabItem) => void;
    onReady: (ready: boolean) => void;
}

const DynamicTabViewComponent = (props: Props) => {
    const logHook = useLog();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeIdx, setActiveIdx] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (props.queryParamKey && location.search.includes(props.queryParamKey)) {
            // after redirect completely, set actived tab by url
            activeTab();
            props.onReady(true);
        }
    }, [location.search, props.items]);

    const clickTab = (event: TabViewTabChangeEvent) => {
        const tab = props.items[event.index];

        if (tab.disabled) return;

        // write log
        if (props.isWriteLog) {
            logHook.operation(LogType.Action, {
                subType: LogSubType.ScreenTransition,
                identifier: tab.label ? sprintf(LogIdentiferFormat.Tab, t(tab.label)) : undefined,
                destinationScreen: tab.screen
            });
        }

        setActiveIdx(event.index);
        props.items.forEach((x) => (x.activated = false));
        tab.activated = true;
        tab.rendered = true;
        props.onClickTab(tab);

        searchParams.set('tab', tab.id);
        setSearchParams(searchParams);
    };

    const activeTab = () => {
        props.items.forEach((tab, idx) => {
            if (props.queryParamKey && searchParams.get(props.queryParamKey) === tab.id) {
                setActiveIdx(idx);
                tab.activated = true;
                tab.rendered = true;
            } else {
                tab.activated = false;
            }
        });

        // default
        if (props.items.length > 0 && props.items.every((x) => !x.activated)) {
            props.items[0].activated = true;
            props.items[0].rendered = true;
            setActiveIdx(0);
        }
    };

    const generateHeader = (opt: TabPanelHeaderTemplateOptions, tab: TabItem) => {
        return (
            <div
                className="p-tabview-nav-link"
                onClick={opt.onClick}
            >
                {tab.imgIcon && (
                    <img
                        className={tab.imgIconStyleClass}
                        src={tab.imgIcon}
                        width="20"
                        height="0"
                        alt={tab.imgIconAlt ?? ''}
                    />
                )}
                {tab.icon && <i className={`pi ${tab.icon}`}></i>}
                <span>{t(tab.label ?? '')}</span>
            </div>
        );
    };

    return (
        <div className="tabview-container">
            {useMemo(() => {
                return (
                    <TabView
                        activeIndex={activeIdx}
                        className={`${props.styleClass} ${props.layout}`}
                        scrollable={false}
                        renderActiveOnly={false}
                        onTabChange={($event: TabViewTabChangeEvent) => clickTab($event)}
                    >
                        {props.items.map((tab) => (
                            <TabPanel
                                key={tab.id}
                                closable={tab.closable ?? false}
                                headerClassName={tab.headerStyleClass ?? ''}
                                disabled={tab.disabled ?? false}
                                headerTemplate={(opt) => generateHeader(opt, tab)}
                            >
                                {(tab.rendered &&
                                    props.children &&
                                    (props.children as any[]).find((child) => {
                                        if (child.key === tab.id) {
                                            return child;
                                        }
                                    })) ?? <></>}
                            </TabPanel>
                        ))}
                    </TabView>
                );
            }, [props.items, activeIdx])}
        </div>
    );
};

DynamicTabViewComponent.defaultProps = {
    items: [],
    queryParamKey: 'tab',
    styleClass: '',
    layout: 'horizontal',
    isWriteLog: true,
    onClickTab: () => {},
    onReady: () => {}
};

export default memo(DynamicTabViewComponent);
