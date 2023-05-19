import { format, fromUnixTime } from 'date-fns';
import { find, floor, replace } from 'lodash';
import { Translation } from 'react-i18next';
import { sprintf } from 'sprintf-js';

import { CommonConstant } from '../constants/common.const';
import { FormatTextType } from '../constants/format-text.const';
import { FormBase } from '../models/form-basic.model';
import { isNullOrUndefined } from './common-func.util';

export const formatText = (data: any, config: FormBase) => {
    const parseDateByType = (data: Date | number) => {
        if (data instanceof Date) {
            data = data as Date;
        } else if (typeof data === 'number' && data !== 0) {
            data = fromUnixTime(data);
        } else if (data === 0) {
            data = undefined!;
        }

        return data;
    };

    if (isNullOrUndefined(data)) {
        return data;
    }

    switch (config?.formatTextType) {
        case FormatTextType.PhoneNumber:
            return data ? data.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '$1-$2-$3') : data;

        case FormatTextType.DateTime:
            try {
                if (!data && config.dateDefault) {
                    return format(CommonConstant.DefaultDate, 'yyyy-MM-dd HH:mm');
                } else if (data) {
                    return format(parseDateByType(data), 'yyyy-MM-dd HH:mm');
                } else {
                    return '';
                }
            } catch (error) {
                return '';
            }

        case FormatTextType.Date:
            try {
                if (!data && config.dateDefault) {
                    return format(CommonConstant.DefaultDate, 'yyyy-MM-dd');
                } else if (data) {
                    return format(parseDateByType(data), 'yyyy-MM-dd');
                } else {
                    return '';
                }
            } catch (error) {
                return '';
            }

        case FormatTextType.Time:
            try {
                if (!data && config.dateDefault) {
                    return format(CommonConstant.DefaultDate, 'HH:mm');
                } else if (data) {
                    return format(parseDateByType(data), 'yyyy-MM-dd');
                } else {
                    return '';
                }
            } catch (error) {
                return '';
            }

        case FormatTextType.Gender:
            try {
                return (
                    <Translation>
                        {(t) =>
                            t(
                                !isNullOrUndefined(data)
                                    ? find(CommonConstant.Gender, (gender) => gender.value === +data)?.label ??
                                          CommonConstant.Gender.Undefined.label
                                    : CommonConstant.Gender.Undefined.label
                            )
                        }
                    </Translation>
                );
            } catch (error) {
                return '';
            }

        case FormatTextType.ShortNumber:
            try {
                if (data < 1000) {
                    return data.toString();
                } else if (data >= 1000) {
                    return sprintf('%sK', replace(floor(data! / 1000, 1).toString(), '.', ','));
                } else if (data >= 1000000) {
                    return sprintf('%sM', replace(floor(data! / 1000000, 1).toString(), '.', ','));
                } else if (data >= 1000000000) {
                    return sprintf('%sB', replace(floor(data! / 1000000000, 1).toString(), '.', ','));
                }

                return '0';
            } catch (error) {
                return '';
            }

        case FormatTextType.Language:
            try {
                return data.toUpperCase();
            } catch (error) {
                return '';
            }

        default:
            return data;
    }
};
