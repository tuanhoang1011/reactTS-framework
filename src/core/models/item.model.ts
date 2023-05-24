export interface BaseItem {
    id: string;
    label?: string;
    icon?: string;
    imgIcon?: string;
    imgIconAlt?: string;
    imgIconClassName?: string;
    disabled?: boolean;
}

export interface StorageItem {
    key?: string;
    value?: string;
}

export interface MenuItem extends BaseItem {
    url?: string;
    className?: string;
    subMenuClassName?: string;
    expanded?: boolean;
    visible?: boolean;
    items?: MenuItem[] | MenuItem[][];
    formatTextType?: string;
    click?: (item?: MenuItem) => void;
}

export interface TabItem extends BaseItem {
    url?: string;
    activated?: boolean;
    templateRef?: any;
    className?: string;
    screen?: string;
    rendered?: boolean;
    closable?: boolean;
    headerClassName?: string;
}

export interface ImageItem {
    src?: string;
    alt?: string;
    className?: string;
    height?: number;
    width?: number;
    previewMode?: boolean;
    transformMode?: boolean;
}

export interface ActionItem {
    label: string;
    className?: string;
    isDefault?: boolean;
    click?: () => void;
}
