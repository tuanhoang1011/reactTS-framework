import { i18n } from 'i18next';

export interface CommonProps {
    children?: React.ReactNode;
    i18n?: i18n;
    t?: i18n['t'];
}
