export interface SortInfo {
    sortOrder: 'asc' | 'desc';
    sortField: string;
}

export interface DialogInfo {
    dialogId: string;
    component: JSX.Element;
}

export interface CanvasOptions {
    width?: number;
    height?: number;
    pixelRatio?: number;
    increaseWidth?: number;
    increaseHeight?: number;
    imageType?: string;
}

export interface RangeDate {
    from?: Date;
    to?: Date;
}

export interface ErrorPage {
    code: number;
    title: string;
    msg: string;
    isShowBackBtn?: boolean;
    isShowHomeBtn?: boolean;
}
