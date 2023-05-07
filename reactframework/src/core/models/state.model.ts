import { BreadcrumbItemList } from './breadcrumb.model';
import { ToastMessage } from 'primereact/toast';

export interface LoadingState {
    apiReqCount?: number;
    isPendingAPI?: boolean;
    isOn?: boolean;
}

export interface SplashScreenState {
    isOn?: boolean;
}

export interface LayoutState {
    expandSidebar?: boolean;
    breadcrumbs?: BreadcrumbItemList;
}

export interface MessageState {
    messages?: ToastMessage | ToastMessage[];
    clearAll?: boolean;
}
