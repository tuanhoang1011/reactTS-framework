export interface BaseItem {
    id: string;
    label?: string;
    icon?: string;
    imgIcon?: string;
    imgIconAlt?: string;
    imgIconStyleClass?: string;
    disabled?: boolean;
}

export interface SortInfo {
    sortOrder: 'asc' | 'desc';
    sortField: string;
}

export interface DialogInfo {
    dialogId: string;
    component: any;
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
