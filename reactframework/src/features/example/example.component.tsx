import './example.component.scss';

import { cloneDeep } from 'lodash';
import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import BreadcrumbComponent from '../../core/components/breadcrumb/breadcrumb.component';
import useBreadcrumb from '../../core/components/breadcrumb/breadcrumb.hook';
import useLoading from '../../core/components/loading/loading.hook';
import useMessageToast from '../../core/components/message-toast/message-toast.hook';
import useSplashScreen from '../../core/components/splash-screen/splash-screen.hook';
import { Breadcrumb, BreadcrumbRoutes } from '../../core/constants/breadcrumb.const';
import { GlobalVariables } from '../../core/utils/global-variables.ultility';
import ButtonComponent from '../../shared/button/button.component';
import HyperlinkComponent from '../../shared/hyperlink/hyperlink.component';

const ExampleComponent = () => {
    const loadingHook = useLoading();
    const splashScreenHook = useSplashScreen();
    const breadcrumbHook = useBreadcrumb();
    const msgToastHook = useMessageToast();
    const { t } = useTranslation();

    useEffect(() => {
        buildBreadcrumbData();
    }, []);

    const lineModule = () => {
        return (
            <img
                className="module-line"
                alt=""
                src="../images/dummy-line.svg"
            />
        );
    };

    const buildBreadcrumbData = () => {
        const bc = cloneDeep(BreadcrumbRoutes).find((x) => x.id === Breadcrumb.Screen1.Id);

        if (bc) {
            bc.items = bc.items.filter((item) => {
                switch (item.id) {
                    case Breadcrumb.Screen1.Child.ScreenList1:
                        item.url = item.id;
                        break;

                    case Breadcrumb.Screen1.Child.ScreenDetail1:
                        item.url = item.id;
                        break;

                    case Breadcrumb.Screen1.Child.ScreenList2:
                        item.url = item.id;
                        break;

                    case Breadcrumb.Screen1.Child.ScreenDetail2:
                        item.url = item.id;
                        break;
                }
                return [
                    Breadcrumb.Screen1.Child.ScreenList1,
                    Breadcrumb.Screen1.Child.ScreenDetail1,
                    Breadcrumb.Screen1.Child.ScreenList2,
                    Breadcrumb.Screen1.Child.ScreenDetail2
                ].includes(item.id);
            });

            breadcrumbHook.setBreadcrumb(cloneDeep(bc));
        }
    };

    const clickButton = (type: 'Primary' | 'Secondary' | 'Danger') =>
        useCallback(() => {
            alert(`Click ${type} button`);
        }, []);

    const clickHyperlink = () =>
        useCallback(() => {
            window.open('https://www.google.com/', '_blank');
        }, []);

    const showMessageToast = (type: string) =>
        useCallback(() => {
            switch (type) {
                case 'success':
                    msgToastHook.success('MSG.EXAMPLE_ERR0001', {
                        variables: ['Angular', 'ReactJS']
                    });
                    break;

                case 'error':
                    msgToastHook.error('MSG.EXAMPLE_ERR0001', {
                        variables: ['Angular', 'ReactJS']
                    });
                    break;

                case 'info':
                    msgToastHook.info('MSG.EXAMPLE_ERR0001', {
                        variables: ['Angular', 'ReactJS']
                    });
                    break;

                case 'warn':
                    msgToastHook.warn('MSG.EXAMPLE_ERR0001', {
                        variables: ['Angular', 'ReactJS']
                    });
                    break;

                default:
                    msgToastHook.clearAll();
                    break;
            }
        }, []);

    const showLoadingSplashScreen = (isLoading: boolean) =>
        useCallback(() => {
            if (isLoading) {
                loadingHook.show();
            } else {
                splashScreenHook.show();
            }

            setTimeout(() => {
                if (isLoading) {
                    loadingHook.hide();
                } else {
                    splashScreenHook.hide();
                }
            }, GlobalVariables.splashScreenDurationMilSecond);
        }, []);

    return (
        <div className="ex-container animation-zoom-in">
            <div className="flex flex-col p-5 items-center">
                <div className="relative w-fit">
                    <img
                        src="../images/fw-logo.svg"
                        width="200"
                        height="0"
                        className="self-center"
                        alt=""
                    />
                    <img
                        src="../images/dummy-star.png"
                        width="50"
                        height="0"
                        className="logo-sticker top-[-8%] left-[-12%]"
                        style={{ rotate: '-20deg' }}
                        alt=""
                    />
                    <img
                        src="../images/dummy-star.png"
                        width="50"
                        height="0"
                        className="logo-sticker top-[13%] left-[49%]"
                        alt=""
                    />
                </div>

                <h1 className="header header-title gradient-1">ReactJS</h1>
                <h1 className="header header-title gradient-1">Base Project Framework</h1>
                <h3 className="header header-info gradient-1">{t('EXAMPLE_0001')}</h3>
            </div>

            {lineModule()}

            <div className="flex flex-col gap-y-6">
                {/* BUTTON/HYPERLINK */}
                <div className="module">
                    <h1 className="module-title">Breadcrumb</h1>
                    <div className="module-btn">
                        <BreadcrumbComponent />
                    </div>
                </div>

                {lineModule()}

                {/* BUTTON/HYPERLINK */}
                <div className="module">
                    <h1 className="module-title">Button/ Hyperlink</h1>
                    <p className="module-info">Normal</p>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Secondary"
                            styleClass="btn-secondary"
                            onClickAction={clickButton('Secondary')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Primary"
                            styleClass="btn-primary"
                            onClickAction={clickButton('Primary')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Danger"
                            styleClass="btn-danger"
                            onClickAction={clickButton('Danger')}
                        ></ButtonComponent>
                        <HyperlinkComponent
                            content="Hyperlink"
                            onClickAction={clickHyperlink()}
                        ></HyperlinkComponent>
                    </div>

                    <p className="module-info mt-4">Disabled</p>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Secondary"
                            styleClass="btn-secondary"
                            disabled={true}
                            onClickAction={clickButton('Secondary')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Primary"
                            styleClass="btn-primary"
                            disabled={true}
                            onClickAction={clickButton('Primary')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Danger"
                            styleClass="btn-danger"
                            disabled={true}
                            onClickAction={clickButton('Danger')}
                        ></ButtonComponent>
                        <HyperlinkComponent
                            content="Hyperlink"
                            disabled={true}
                            onClickAction={clickHyperlink()}
                        ></HyperlinkComponent>
                    </div>
                </div>

                {lineModule()}

                {/* DYNAMIC DIALOG */}
                <div className="module">
                    <h1 className="module-title">Dynamic Dialog</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Open Dialog A"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Open Dialog B"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Update Dialog A"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Remove Dialog A"
                            styleClass="btn-danger"
                            disabled={true}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* ERROR PAGE */}
                <div className="module err-page-module">
                    <h1 className="module-title">Error Page</h1>
                    <p className="module-info">Click on image to redirect to error page</p>
                    <div className="module-img"></div>
                </div>

                {lineModule()}

                {/* TOAST MESSAGE */}
                <div className="module">
                    <h1 className="module-title">Toast Message</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Success"
                            styleClass="btn-primary"
                            onClickAction={showMessageToast('success')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Error"
                            styleClass="btn-danger"
                            onClickAction={showMessageToast('error')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Info"
                            styleClass="btn-primary !bg-info !border-[#696cff]"
                            onClickAction={showMessageToast('info')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Warn"
                            styleClass="btn-primary !bg-warn !border-warn"
                            onClickAction={showMessageToast('warn')}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Close All"
                            styleClass="btn-danger"
                            onClickAction={showMessageToast('')}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* DIALOG MESSAGE */}
                <div className="module">
                    <h1 className="module-title">Dialog Message</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Success"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Error"
                            styleClass="btn-danger"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Info"
                            styleClass="btn-primary !bg-info !border-info"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Warn"
                            styleClass="btn-primary !bg-warn !border-warn"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Confirm"
                            styleClass="btn-primary !bg-confirm !border-confirm"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Custom"
                            styleClass="btn-primary !bg-bg-secondary !border-bg-secondary"
                            disabled={true}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* LOADING/ SPLASH SCREEN */}
                <div className="module">
                    <h1 className="module-title">Loading/ Splash Screen</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Loading"
                            styleClass="btn-primary"
                            onClickAction={showLoadingSplashScreen(true)}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Splash Screen"
                            styleClass="btn-primary"
                            onClickAction={showLoadingSplashScreen(false)}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* IMAGE THUMBNAIL/ PREVIEW MODE */}
                <div className="module">
                    <h1 className="module-title">Image Thumbnail/ Preview Mode</h1>
                    <p className="module-info">You can view image at preview mode by clicking on image.</p>
                    <div className="module-img"></div>
                </div>

                {lineModule()}

                {/* WRITE LOG */}
                <div className="module">
                    <h1 className="module-title">Write/ Push Log</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Write Log"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Push Logs"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Clear Logs"
                            styleClass="btn-danger"
                            disabled={true}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* DYNAMIC TAB */}
                <div className="module">
                    <h1 className="module-title">Dynamic Tab</h1>
                    <div className="module-btn"></div>
                </div>

                {lineModule()}

                {/* EXPORT PDF */}
                <div className="module">
                    <h1 className="module-title">Export PDF</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Export"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* COMMUNICATE SERVER */}
                <div className="module">
                    <h1 className="module-title">Communicate Server</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="API"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="GraphQL"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="WebSocket"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* RANGE DATE SELECTOR */}
                <div className="module">
                    <h1 className="module-title">Range Date Selector</h1>
                    <div className="module-btn"></div>
                </div>

                {lineModule()}

                {/* CREATE FORM */}
                <div className="module">
                    <h1 className="module-title">Create Form</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Create Form"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}

                {/* DYNAMIC TABLE */}
                <div className="module">
                    <h1 className="module-title">Dynamic Table</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Static Table"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                        <ButtonComponent
                            content="Editable Table"
                            styleClass="btn-primary"
                            disabled={true}
                        ></ButtonComponent>
                    </div>
                </div>

                {lineModule()}
            </div>
        </div>
    );
};

export default memo(ExampleComponent);
