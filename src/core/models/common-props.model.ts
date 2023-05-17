import { i18n } from 'i18next';
import { ReactElement, ReactNode } from 'react';

export interface CommonProps {
    children?: ReactNode | ReactNode[] | ReactElement | ReactElement[];
    i18n?: i18n;
    t?: i18n['t'];
}
