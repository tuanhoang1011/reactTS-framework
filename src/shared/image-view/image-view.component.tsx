import './image-view.component.scss';

import { memo, useEffect, useRef, useState } from 'react';

import { CommonConstant } from '../../core/constants/common.const';
import { LogSubType, LogType } from '../../core/constants/log.const';
import useCommonFunc from '../../core/hooks/common-func.hook';
import useImageSize from '../../core/hooks/image-size.hook';
import useLog from '../../core/hooks/log.hook';
import { CommonProps } from '../../core/models/common-props.model';
import ButtonComponent from '../button/button.component';

interface Props extends CommonProps {
    src?: string;
    alt: string;
    styleClass?: string;
    height: number;
    width: number;
    previewMode: boolean;
    transformMode: boolean;
    onClickImageView?: (isClickThumb: boolean) => void;
}

const ImageViewComponent = (props: Props) => {
    const commonFuncHook = useCommonFunc();
    const logHook = useLog();

    const [thumbRef] = useImageSize<HTMLImageElement>();
    const [previewImgRef] = useImageSize<HTMLImageElement>({
        imgRatio: CommonConstant.ImageRatio.Preview.ratio
    });
    const previewDivRef = useRef<HTMLDivElement>(null);

    const [isShowingPreview, setShowingPreview] = useState(false);

    let degree = 0;
    let zoomRatio = 1;

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDownEvent);

        return () => {
            document.removeEventListener('keydown', handleKeyDownEvent);
        };
    }, []);

    const handleKeyDownEvent = (event: KeyboardEvent) => {
        // 27: escapse
        if (event.keyCode === 27) {
            offPreviewMode();
        }
    };

    const clickImage = () => {
        try {
            if (props.previewMode) {
                document.body.style.overflow = 'hidden';
                setShowingPreview(true);
            }

            props.onClickImageView!(true);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const clickOutside = (event) => {
        try {
            if (event.target.id === 'img-preview') {
                offPreviewMode();
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const offPreviewMode = () => {
        try {
            document.body.style.overflow = 'auto';

            // write log
            logHook.operation(LogType.Action, {
                subType: LogSubType.Button,
                identifier: 'Turn-off-image-preview-mode-button'
            });

            setShowingPreview(false);
            degree = 0;
            zoomRatio = 1;

            props.onClickImageView!(false);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const rotate = (isRight: boolean) => {
        try {
            degree = degree + (isRight ? 90 : -90);
            setTransform();

            // write log
            logHook.operation(LogType.Action, {
                subType: LogSubType.Button,
                identifier: `Rotate-${isRight ? 'right' : 'left'}-image-preview-mode-button`
            });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const zoom = (isZoomOut: boolean) => {
        try {
            if ((isZoomOut && zoomRatio <= 0.5) || (!isZoomOut && zoomRatio >= 1.5)) return;

            zoomRatio = zoomRatio + (isZoomOut ? -0.1 : 0.1);
            setTransform();

            // write log
            logHook.operation(LogType.Action, {
                subType: LogSubType.Button,
                identifier: `Zoom-${isZoomOut ? 'out' : 'in'}-image-preview-mode-button`
            });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const setTransform = () => {
        try {
            previewDivRef.current!.style.transform = `scale(${zoomRatio}) rotate(${degree}deg)`;
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <>
            <div
                className={`img-thumbnail-container ${props.styleClass} ${props.previewMode ? 'cursor-pointer' : ''}`}
                onClick={() => clickImage()}
            >
                <img
                    ref={thumbRef}
                    src={props.src}
                    className="rounded-default"
                    width={props.width}
                    height={props.height}
                    alt={props.alt}
                />
            </div>

            {isShowingPreview && (
                <div
                    id="img-preview"
                    className="img-preview-container"
                    onClick={($event) => clickOutside($event)}
                >
                    <div
                        ref={previewDivRef}
                        className="preview-img"
                    >
                        <img
                            ref={previewImgRef}
                            className="rounded-default as"
                            src={props.src}
                            width={CommonConstant.ImageRatio.Preview.width}
                            height={CommonConstant.ImageRatio.Preview.height}
                            alt={props.alt}
                        />
                    </div>

                    <div className="preview-btn">
                        {props.transformMode && (
                            <>
                                <ButtonComponent
                                    styleClass="btn-icon"
                                    isWriteLog={false}
                                    onClickAction={() => rotate(true)}
                                >
                                    <i className="pi pi-refresh"></i>
                                </ButtonComponent>
                                <ButtonComponent
                                    styleClass="btn-icon"
                                    isWriteLog={false}
                                    onClickAction={() => rotate(false)}
                                >
                                    <i className="pi pi-replay"></i>
                                </ButtonComponent>
                                <ButtonComponent
                                    styleClass="btn-icon"
                                    isWriteLog={false}
                                    onClickAction={() => zoom(true)}
                                >
                                    <i className="pi pi-search-minus"></i>
                                </ButtonComponent>
                                <ButtonComponent
                                    styleClass="btn-icon"
                                    isWriteLog={false}
                                    onClickAction={() => zoom(false)}
                                >
                                    <i className="pi pi-search-plus"></i>
                                </ButtonComponent>
                            </>
                        )}

                        <ButtonComponent
                            styleClass="btn-icon"
                            isWriteLog={false}
                            onClickAction={() => offPreviewMode()}
                        >
                            <i className="pi pi-times"></i>
                        </ButtonComponent>
                    </div>
                </div>
            )}
        </>
    );
};

ImageViewComponent.defaultProps = {
    alt: '',
    height: CommonConstant.ImageRatio.Thumbnail.height,
    width: CommonConstant.ImageRatio.Thumbnail.width,
    previewMode: true,
    transformMode: true,
    onClickImageView: (isClickThumb: boolean) => {}
};

export default memo(ImageViewComponent);
