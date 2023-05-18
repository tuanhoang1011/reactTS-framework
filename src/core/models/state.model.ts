import { HttpStatusCode } from 'axios';
import { ToastMessage } from 'primereact/toast';

import { BreadcrumbItemList } from './breadcrumb.model';
import { DialogInfo } from './common.model';
import { MessageItem } from './message.model';

export interface GlobalState {
    errorPage?: HttpStatusCode;
    activeScreen?: string;
    activeDialog?: string;
}

export interface LoadingState {
    isOn?: boolean;
}

export interface SplashScreenState {
    isOn?: boolean;
}

export interface LayoutState {
    expandSidebar?: boolean;
    breadcrumbs?: BreadcrumbItemList;
}

export interface MessageToastState {
    messages?: ToastMessage[];
    clearAll?: boolean;
}

export interface MessageDialogState {
    messages?: MessageItem[];
}

export interface DialogManagerState {
    dialogs?: DialogInfo[];
}
