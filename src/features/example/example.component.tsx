import './example.component.scss';

import * as wjPdf from '@grapecity/wijmo.pdf';
import { HttpStatusCode } from 'axios';
import { cloneDeep } from 'lodash';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BreadcrumbComponent from '../../core/components/breadcrumb/breadcrumb.component';
import useBreadcrumb from '../../core/components/breadcrumb/breadcrumb.hook';
import useDialogManager from '../../core/components/dialog-manager/dialog-manager.hook';
import { useErrorPage } from '../../core/components/error-page/error-page.hook';
import useLoading from '../../core/components/loading/loading.hook';
import useMessageDialog from '../../core/components/message-dialog/message-dialog.hook';
import useMessageToast from '../../core/components/message-toast/message-toast.hook';
import useSplashScreen from '../../core/components/splash-screen/splash-screen.hook';
import { Breadcrumb, BreadcrumbRoutes } from '../../core/constants/breadcrumb.const';
import { CommonConstant } from '../../core/constants/common.const';
import useCanvas from '../../core/hooks/canvas.hook';
import useCommonFunc from '../../core/hooks/common-func.hook';
import useHttpBase from '../../core/hooks/http-base.hook';
import useIndexedDB from '../../core/hooks/indexed-db.hook';
import { DialogInfo } from '../../core/models/common.model';
import { ImageItem, TabItem } from '../../core/models/item.model';
import { GlobalVariables } from '../../core/utils/global-variables.util';
import useExampleAPI from '../../network-services/api/example-api.hook';
import withBaseComponent, { BaseProps } from '../../shared/base-component/base.component';
import ButtonComponent from '../../shared/button/button.component';
import RangeDateSelectorComponent from '../../shared/calendar-range-selector/range-date-selector.component';
import DynamicTabViewComponent from '../../shared/dynamic-tab-view/dynamic-tab-view.component';
import HyperlinkComponent from '../../shared/hyperlink/hyperlink.component';
import ImageCarouselComponent from '../../shared/image-carousel/image-carousel.component';
import ImageViewComponent from '../../shared/image-view/image-view.component';
import Component1Component from './components/component1.component';
import Component2Component from './components/component2.component';
import Component3Component from './components/component3.component';
import DialogAComponent from './components/dialog-a.component';
import DialogBComponent from './components/dialog-b.component';

const ExampleComponent = (props: BaseProps) => {
    const loadingHook = useLoading();
    const splashScreenHook = useSplashScreen();
    const errorPagehook = useErrorPage();
    const breadcrumbHook = useBreadcrumb();
    const msgToastHook = useMessageToast();
    const msgDialogHook = useMessageDialog();
    const indexedDBHook = useIndexedDB();
    const httpBaseHook = useHttpBase();
    const canvasHook = useCanvas();
    const dialogManagerHook = useDialogManager();
    const commonFuncHook = useCommonFunc();

    // API hooks
    const exampleAPIHook = useExampleAPI();

    const [tabItems, setTabItems] = useState([] as TabItem[]);
    const [thumbnailImages, setThumbnailImages] = useState([] as ImageItem[]);

    const { t } = useTranslation();

    useEffect(() => {
        try {
            generateImages();
            buildBreadcrumbData();
            getTabItem();
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, []);

    const lineModule = () => {
        try {
            return (
                <img
                    className="module-line"
                    alt=""
                    src="../images/dummy-line.svg"
                />
            );
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const generateImages = () => {
        try {
            const imgs: ImageItem[] = [];

            for (let i = 0; i < 10; i++) {
                imgs.push({
                    src: '../images/dummy-angular.png',
                    width: CommonConstant.ImageRatio.Thumbnail.width,
                    height: CommonConstant.ImageRatio.Thumbnail.width
                });
            }

            setThumbnailImages(imgs);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const buildBreadcrumbData = () => {
        try {
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
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const getTabItem = async () => {
        try {
            const res = (await httpBaseHook.getLocalFile<{ menu: TabItem[] }>('../json/items/tab-example.json')).menu;
            setTabItems(res);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const clickButton = (type: 'Primary' | 'Secondary' | 'Danger') =>
        useCallback(() => {
            try {
                alert(`Click ${type} button`);
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, []);

    const clickHyperlink = () =>
        useCallback(() => {
            try {
                window.open('https://www.google.com/', '_blank');
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, []);

    const openDialogA = () =>
        useCallback(() => {
            try {
                const dialog: DialogInfo = {
                    dialogId: 'Dialog A',
                    component: (
                        <DialogAComponent
                            dialogId="Dialog A"
                            propA={'Prop A'}
                            propB={100}
                            propC={{ a: 'a in PropC', b: 'b in PropC' }}
                            clickFunc1={() => console.log('clickFunc1')}
                            clickFunc2={() => console.log('clickFunc2')}
                        />
                    )
                };
                dialogManagerHook.open(dialog);
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [dialogManagerHook.open]);

    const openDialogB = () =>
        useCallback(() => {
            try {
                const dialog: DialogInfo = {
                    dialogId: 'Dialog B',
                    component: (
                        <DialogBComponent
                            dialogId="Dialog B"
                            propA={'Prop A'}
                            propB={50}
                            propC={{ a: 'a in PropC', b: 'b in PropC' }}
                        />
                    )
                };
                dialogManagerHook.open(dialog);
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [dialogManagerHook.open]);

    const removeDialogA = () =>
        useCallback(() => {
            try {
                dialogManagerHook.close('Dialog A');
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [dialogManagerHook.close]);

    const redirectErrorPage = (code: HttpStatusCode) => {
        try {
            errorPagehook.setErrorPage(code);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const showMessageToast = (type: string) =>
        useCallback(() => {
            try {
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
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [msgToastHook]);

    const showMessageDialog = (type: string) =>
        useCallback(() => {
            try {
                switch (type) {
                    case 'success':
                        msgDialogHook.success(
                            'MSG.EXAMPLE_ERR0001',
                            {
                                variables: ['Angular', 'ReactJS']
                            },
                            () => {
                                alert('Click Close');
                            }
                        );
                        break;

                    case 'error':
                        msgDialogHook.error(
                            'MSG.EXAMPLE_ERR0001',
                            {
                                variables: ['Angular', 'ReactJS']
                            },
                            () => {
                                alert('Click Close');
                            }
                        );
                        break;

                    case 'info':
                        msgDialogHook.info(
                            'MSG.EXAMPLE_ERR0001',
                            {
                                variables: ['Angular', 'ReactJS']
                            },
                            () => {
                                alert('Click Close');
                            }
                        );
                        break;

                    case 'warn':
                        msgDialogHook.warn(
                            'MSG.EXAMPLE_ERR0001',
                            {
                                variables: ['Angular', 'ReactJS']
                            },
                            () => {
                                alert('Click Close');
                            }
                        );
                        break;

                    case 'confirm':
                        msgDialogHook.confirm(
                            'MSG.EXAMPLE_ERR0001',
                            {
                                variables: ['Angular', 'ReactJS']
                            },
                            () => {
                                alert('Click Yes');
                            },
                            () => {
                                alert('Click No');
                            },
                            () => {
                                alert('Click Cancel');
                            }
                        );
                        break;

                    case 'custom':
                        msgDialogHook.custom('MSG.EXAMPLE_ERR0001', {
                            header: 'MSG.TITLE_001',
                            variables: ['Angular', 'ReactJS'],
                            actions: [
                                {
                                    label: 'BTN_0005',
                                    styleClass: 'btn-secondary',
                                    click: () => {
                                        alert(`Click ${t('BTN_0005')}`);
                                    }
                                },
                                {
                                    label: 'BTN_0006',
                                    styleClass: 'btn-danger',
                                    click: () => {
                                        alert(`Click ${t('BTN_0006')}`);
                                    }
                                },
                                {
                                    label: 'BTN_0001',
                                    styleClass: 'btn-primary',
                                    isDefault: true,
                                    click: () => {
                                        alert(`Click ${t('BTN_0001')}`);
                                    }
                                }
                            ]
                        });
                        break;
                }
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [msgDialogHook]);

    const showLoadingSplashScreen = (isLoading: boolean) =>
        useCallback(() => {
            try {
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
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [loadingHook, splashScreenHook]);

    const processLog = (type: 'write' | 'push' | 'clear') =>
        useCallback(() => {
            try {
                switch (type) {
                    case 'write':
                        {
                            let msg = 'Log function has:\n';
                            msg += '+ 7 levels: All, Error, Operation, Info, Warn, Debug, Off\n';
                            msg += '+ 2 type: Action, Error\n';
                            msg +=
                                '+ 7 sub type: Hyperlink, Button, Table Item Selection, Menu, Screen Transittion, API Error, Exception\n';
                            msg +=
                                '+ Logs will write to indexed db of browser (Open Developer Tools -> Application -> Indexed DB)\n';
                            msg +=
                                '+ Example: If you click on any button. A log information includes Operation (Level), Action (Type), Button (Sub type) will be saved into Indexed DB.\n';
                            msg +=
                                '+ If you want more information. Please check source code: LogService (log.service.ts)';
                            msgDialogHook.info(msg);
                        }
                        break;

                    case 'push':
                        msgDialogHook.info('The time that you push log to server will depend on your requirements.');
                        break;

                    case 'clear':
                        indexedDBHook.clear(process.env['REACT_APP_INDEXEDDB_OBJSTORE_LOG'] ?? '');
                        msgDialogHook.info('Current logs are cleared. Please check Indexed DB.');
                        break;
                }
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [msgDialogHook, indexedDBHook]);

    const exportPDF = () =>
        useCallback(async () => {
            try {
                loadingHook.show(false);
                const doc = new wjPdf.PdfDocument({
                    footer: CommonConstant.PDFCommon.Footer,
                    pageSettings: CommonConstant.PDFCommon.PageSetting.Default,
                    ended: (sender: wjPdf.PdfDocument, args: wjPdf.PdfDocumentEndedEventArgs) => {
                        // revert after exporting successfully
                        wjPdf.saveBlob(new Blob([args.blob], { type: 'application/octet-stream' }), 'example.pdf');
                        loadingHook.hide(true);
                    }
                });
                // draw img from canvas for pdf
                const drawImg = (canvas: HTMLCanvasElement, width?: number, height?: number) => {
                    const img = canvas.toDataURL();
                    doc.drawImage(img, undefined, undefined, {
                        width: width ? width : doc.width,
                        height: height ? height : doc.height,
                        stretchProportionally: true,
                        align: wjPdf.PdfImageHorizontalAlign.Center
                    });
                };
                const el = document.body.getElementsByClassName('ex-container')[0]! as HTMLCanvasElement;
                el.style.maxWidth = el.clientWidth + 'px';
                const canvas = await canvasHook.toCanvas(
                    document.body.getElementsByClassName('ex-container')[0]! as HTMLCanvasElement,
                    {
                        pixelRatio: 4
                    }
                );
                drawImg(canvas);
                canvas.remove();
                doc.end();
            } catch (error) {
                commonFuncHook.handleError(error);
                throw error;
            }
        }, [loadingHook, canvasHook]);

    const executeRequestServer = (type: 'restfulAPI' | 'graphQL' | 'websocket') =>
        useCallback(() => {
            switch (type) {
                case 'graphQL':
                    exampleAPIHook.createCommentSubscription('').subscribe({
                        next: (res) => {
                            console.log(res);
                        },
                        error: (err) => console.log(err)
                    });
                    break;
            }
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

                <img
                    src="../images/dummy-logo-react.svg"
                    width="60"
                    height="60"
                    className="h-[60px]"
                    alt=""
                />
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
                        />
                        <ButtonComponent
                            content="Primary"
                            styleClass="btn-primary"
                            onClickAction={clickButton('Primary')}
                        />
                        <ButtonComponent
                            content="Danger"
                            styleClass="btn-danger"
                            onClickAction={clickButton('Danger')}
                        />
                        <HyperlinkComponent
                            content="Hyperlink"
                            onClickAction={clickHyperlink()}
                        />
                    </div>

                    <p className="module-info mt-4">Disabled</p>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Secondary"
                            styleClass="btn-secondary"
                            disabled={true}
                            onClickAction={clickButton('Secondary')}
                        />
                        <ButtonComponent
                            content="Primary"
                            styleClass="btn-primary"
                            disabled={true}
                            onClickAction={clickButton('Primary')}
                        />
                        <ButtonComponent
                            content="Danger"
                            styleClass="btn-danger"
                            disabled={true}
                            onClickAction={clickButton('Danger')}
                        />
                        <HyperlinkComponent
                            content="Hyperlink"
                            disabled={true}
                            onClickAction={clickHyperlink()}
                        />
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
                            onClickAction={openDialogA()}
                        />
                        <ButtonComponent
                            content="Open Dialog B"
                            styleClass="btn-primary"
                            onClickAction={openDialogB()}
                        />
                        <ButtonComponent
                            content="Remove Dialog A"
                            styleClass="btn-danger"
                            onClickAction={removeDialogA()}
                        />
                    </div>
                </div>

                {lineModule()}

                {/* ERROR PAGE */}
                <div className="module err-page-module">
                    <h1 className="module-title">Error Page</h1>
                    <p className="module-info">Click on image to redirect to error page</p>
                    <div className="module-img">
                        <ImageViewComponent
                            src="../images/dummy-error-400.png"
                            width={CommonConstant.ImageRatio.Thumbnail.width}
                            height={CommonConstant.ImageRatio.Thumbnail.height}
                            previewMode={false}
                            onClickImageView={(isClickThumb) => isClickThumb && redirectErrorPage(400)}
                        />
                        <ImageViewComponent
                            src="../images/dummy-error-403.png"
                            width={CommonConstant.ImageRatio.Thumbnail.width}
                            height={CommonConstant.ImageRatio.Thumbnail.height}
                            previewMode={false}
                            onClickImageView={(isClickThumb) => isClickThumb && redirectErrorPage(403)}
                        />
                        <ImageViewComponent
                            src="../images/dummy-error-404.png"
                            width={CommonConstant.ImageRatio.Thumbnail.width}
                            height={CommonConstant.ImageRatio.Thumbnail.height}
                            previewMode={false}
                            onClickImageView={(isClickThumb) => isClickThumb && redirectErrorPage(404)}
                        />
                        <ImageViewComponent
                            src="../images/dummy-error-500.png"
                            width={CommonConstant.ImageRatio.Thumbnail.width}
                            height={CommonConstant.ImageRatio.Thumbnail.height}
                            previewMode={false}
                            onClickImageView={(isClickThumb) => isClickThumb && redirectErrorPage(500)}
                        />
                    </div>
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
                        />
                        <ButtonComponent
                            content="Error"
                            styleClass="btn-danger"
                            onClickAction={showMessageToast('error')}
                        />
                        <ButtonComponent
                            content="Info"
                            styleClass="btn-primary !bg-info !border-[#696cff]"
                            onClickAction={showMessageToast('info')}
                        />
                        <ButtonComponent
                            content="Warn"
                            styleClass="btn-primary !bg-warn !border-warn"
                            onClickAction={showMessageToast('warn')}
                        />
                        <ButtonComponent
                            content="Close All"
                            styleClass="btn-danger"
                            onClickAction={showMessageToast('')}
                        />
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
                            onClickAction={showMessageDialog('success')}
                        />
                        <ButtonComponent
                            content="Error"
                            styleClass="btn-danger"
                            onClickAction={showMessageDialog('error')}
                        />
                        <ButtonComponent
                            content="Info"
                            styleClass="btn-primary !bg-info !border-info"
                            onClickAction={showMessageDialog('info')}
                        />
                        <ButtonComponent
                            content="Warn"
                            styleClass="btn-primary !bg-warn !border-warn"
                            onClickAction={showMessageDialog('warn')}
                        />
                        <ButtonComponent
                            content="Confirm"
                            styleClass="btn-primary !bg-confirm !border-confirm"
                            onClickAction={showMessageDialog('confirm')}
                        />
                        <ButtonComponent
                            content="Custom"
                            styleClass="btn-primary !bg-bg-primary !border-bg-primary"
                            onClickAction={showMessageDialog('custom')}
                        />
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
                        />
                        <ButtonComponent
                            content="Splash Screen"
                            styleClass="btn-primary"
                            onClickAction={showLoadingSplashScreen(false)}
                        />
                    </div>
                </div>

                {lineModule()}

                {/* IMAGE THUMBNAIL/ PREVIEW MODE */}
                <div className="module">
                    <h1 className="module-title">Image Thumbnail/ Preview Mode</h1>
                    <p className="module-info">You can view image at preview mode by clicking on image.</p>
                    <div className="module-img">
                        <ImageViewComponent
                            src="../images/dummy-angular.png"
                            width={CommonConstant.ImageRatio.Thumbnail.width}
                            height={CommonConstant.ImageRatio.Thumbnail.height}
                        />
                        <ImageViewComponent
                            src="../images/dummy-angular.png"
                            width={CommonConstant.ImageRatio.Thumbnail.width}
                            height={CommonConstant.ImageRatio.Thumbnail.height}
                        />
                    </div>
                </div>

                {/* IMAGE CAROUSEL */}
                <div className="module">
                    <h1 className="module-title">Image Carousel</h1>
                    <div className="module-img">
                        <ImageCarouselComponent
                            images={thumbnailImages}
                            numVisible={2}
                            numScroll={1}
                            circular={false}
                        />
                    </div>
                </div>

                {lineModule()}

                {/* WRITE LOG */}
                <div className="module">
                    <h1 className="module-title">Write/ Push Log</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Write Log"
                            styleClass="btn-primary"
                            onClickAction={processLog('write')}
                        />
                        <ButtonComponent
                            content="Push Logs"
                            styleClass="btn-primary"
                            onClickAction={processLog('push')}
                        />
                        <ButtonComponent
                            content="Clear Logs"
                            styleClass="btn-danger"
                            onClickAction={processLog('clear')}
                        />
                    </div>
                </div>

                {lineModule()}

                {/* DYNAMIC TAB */}
                <div className="module">
                    <h1 className="module-title">Dynamic Tab</h1>
                    <div className="module-btn">
                        <DynamicTabViewComponent
                            items={tabItems}
                            queryParamKey="tab"
                            layout="horizontal"
                            styleClass="dynamic-tab"
                        >
                            <Component1Component key={'tab1'} />
                            <Component2Component key={'tab2'} />
                            <Component3Component key={'tab3'} />
                        </DynamicTabViewComponent>

                        <DynamicTabViewComponent
                            items={tabItems}
                            queryParamKey="tab"
                            layout="vertical"
                            styleClass="dynamic-tab"
                        >
                            <Component1Component key={'tab1'} />
                            <Component2Component key={'tab2'} />
                            <Component3Component key={'tab3'} />
                        </DynamicTabViewComponent>
                    </div>
                </div>

                {lineModule()}

                {/* EXPORT PDF */}
                <div className="module">
                    <h1 className="module-title">Export PDF</h1>
                    <div className="module-btn">
                        <ButtonComponent
                            content="Export"
                            styleClass="btn-primary"
                            onClickAction={exportPDF()}
                        />
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
                            onClickAction={executeRequestServer('restfulAPI')}
                        />
                        <ButtonComponent
                            content="GraphQL"
                            styleClass="btn-primary"
                            disabled={true}
                            onClickAction={executeRequestServer('graphQL')}
                        />
                        <ButtonComponent
                            content="WebSocket"
                            styleClass="btn-primary"
                            disabled={true}
                            onClickAction={executeRequestServer('websocket')}
                        />
                    </div>
                </div>

                {lineModule()}

                {/* RANGE DATE SELECTOR */}
                <div className="module">
                    <h1 className="module-title">Range Date Selector</h1>
                    <div className="module-btn">
                        <RangeDateSelectorComponent />
                    </div>
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
                        />
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
                        />
                        <ButtonComponent
                            content="Editable Table"
                            styleClass="btn-primary"
                            disabled={true}
                        />
                    </div>
                </div>

                {lineModule()}
            </div>
        </div>
    );
};

export default withBaseComponent(memo(ExampleComponent))({ activeScreen: 'Example-screen' });
