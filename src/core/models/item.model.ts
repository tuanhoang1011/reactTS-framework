import { BaseItem } from './common.model';

export interface StorageItem {
    key?: string;
    value?: string;
}

export interface MenuItem extends BaseItem {
    url?: string;
    styleClass?: string;
    subMenu?: MenuItem[];
    click?: () => void;
}

export interface TabItem extends BaseItem {
    url?: string;
    activated?: boolean;
    templateRef?: any;
    styleClass?: string;
    screen?: string;
    rendered?: boolean;
    closable?: boolean;
    headerStyleClass?: string;
}

export interface ImageItem {
    src?: string;
    alt?: string;
    styleClass?: string;
    height?: number;
    width?: number;
    previewMode?: boolean;
    transformMode?: boolean;
}
