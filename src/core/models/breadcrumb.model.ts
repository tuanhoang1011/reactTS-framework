import { BaseItem } from './common.model';

export interface BreadcrumbItemList {
    id: string;
    items: BreadcrumbItem[];
}

export interface BreadcrumbItem extends BaseItem {
    destinationScreen?: string;
    url?: string;
    style?: { width: number; height: number };
}
