import { uniqueId } from 'lodash';

import { ActionItem } from './item.model';

export interface Message {
    id: string;
    key: string;
    detail?: string;
    options?: MessageOptions;
}

export interface MessageOptions {
    header?: string;
    icon?: string;
    closable?: boolean;
    sticky?: boolean;
    styleClass?: string;
    contentStyleClass?: string;
    iconStyleClass?: string;
    detailStyleClass?: string;
    footerStyleClass?: string;
    screenName?: string;
    variables?: any[];
    actions?: ActionItem[];
    clickX?: () => void;
}

export class MessageItem implements Message {
    content?: string;
    id: string;

    constructor(public key: string, public options: MessageOptions = {}) {
        this.id = uniqueId();
    }
}
