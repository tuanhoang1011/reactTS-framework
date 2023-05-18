import './dialog.component.scss';

import { Dialog } from 'primereact/dialog';
import React, { memo, MouseEvent, ReactElement, useRef } from 'react';
import { Translation } from 'react-i18next';

import { CommonProps } from '../../core/models/common-props.model';

interface Props extends CommonProps {
    dialogId: string;
    styleClass?: string;
    headerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    headerTitle?: string;
    closable?: boolean;
    closeOnEscape?: boolean;
    draggable?: boolean;
    keepInViewport?: boolean;
    maximizable?: boolean;
    maximized?: boolean;
    minX?: number;
    minY?: number;
    position?:
        | 'center'
        | 'left'
        | 'top'
        | 'bottom'
        | 'right'
        | 'bottom-right'
        | 'bottom-left'
        | 'top-right'
        | 'top-left';
    resizable?: boolean;
    showHeader?: boolean;
    modal?: boolean;
    onClick?: (e: MouseEvent) => void;
    onHide?: () => void;
    onShow?: () => void;
    onMaskClick?: (e: MouseEvent) => void;
}

const DialogComponent = (props: Props) => {
    const ref = useRef<Dialog>(null);

    const generateHeaderIcon = () => {
        return props.closable || props.maximizable ? (
            <div className="dl-h-icons">
                {props.maximizable && (
                    <div
                        className="dl-h-icon"
                        tabIndex={0}
                        onClick={() =>
                            (
                                ref.current
                                    ?.getHeader()
                                    .getElementsByClassName('p-dialog-header-maximize')[0] as HTMLButtonElement
                            ).click()
                        }
                    >
                        <i className="pi pi-window-maximize"></i>
                    </div>
                )}
                {props.closable && (
                    <div
                        className="dl-h-icon"
                        tabIndex={0}
                        onClick={() => props.onHide!()}
                    >
                        <i className="pi pi-times"></i>
                    </div>
                )}
            </div>
        ) : (
            <></>
        );
    };

    const generateHeader = () => {
        const header =
            props.children &&
            (React.Children.toArray(props.children) as ReactElement[]).find((child) => child.key === '.$header');

        return (
            <div className={`dl-header ${props.headerClassName}`}>
                {header ?? (
                    <span className="dl-h-title">
                        <Translation>{(t) => t(props.headerTitle ?? '')}</Translation>
                    </span>
                )}
            </div>
        );
    };

    const generateFooter = () => {
        const footer =
            props.children &&
            (React.Children.toArray(props.children) as ReactElement[]).find((child) => child.key === '.$footer');
        return <div className={`dl-footer ${props.footerClassName}`}>{footer}</div>;
    };

    return (
        <Dialog
            ref={ref}
            key={props.dialogId ?? ''}
            className={`dialog-container ${props.styleClass}`}
            headerClassName="border-bottom"
            baseZIndex={99999}
            visible={true}
            closable={false}
            modal={props.modal}
            blockScroll={props.modal}
            closeOnEscape={props.closeOnEscape}
            draggable={props.draggable}
            keepInViewport={props.keepInViewport}
            maximizable={props.maximizable}
            maximized={props.maximized}
            minX={props.minX}
            minY={props.minY}
            position={props.position}
            resizable={props.resizable}
            showHeader={props.showHeader}
            icons={generateHeaderIcon()}
            header={generateHeader()}
            footer={generateFooter()}
            onClick={(e) => props.onClick!(e)}
            onShow={() => props.onShow!()}
            onHide={() => props.onHide!()}
            onMaskClick={(e) => props.onMaskClick!(e)}
        >
            <div className={`dl-content ${props.contentClassName}`}>
                {(React.Children.toArray(props.children) as ReactElement[]).find((child) => child.key === '.$content')}
            </div>
        </Dialog>
    );
};

DialogComponent.defaultProps = {
    closable: true,
    closeOnEscape: false,
    draggable: true,
    keepInViewport: true,
    maximizable: false,
    maximized: false,
    minX: 0,
    minY: 0,
    position: 'center',
    resizable: false,
    showHeader: true,
    modal: true,
    onClick: (e: MouseEvent<HTMLElement, MouseEvent>) => {},
    onHide: () => {},
    onShow: () => {},
    onMaskClick: (e: MouseEvent<HTMLElement, MouseEvent>) => {}
};

export default memo(DialogComponent);
