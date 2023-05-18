import './range-date-selector.component.scss';

import { differenceInCalendarDays, endOfDay, endOfToday, startOfDay } from 'date-fns';
import { Calendar, CalendarSelectEvent } from 'primereact/calendar';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CommonConstant } from '../../core/constants/common.const';
import useCommonFunc from '../../core/hooks/common-func.hook';
import { CommonProps } from '../../core/models/common-props.model';
import { RangeDate } from '../../core/models/common.model';
import { isNullOrUndefined } from '../../core/utils/common-func.util';
import { generateDateToBefore, startOfNextDay } from '../../core/utils/date.util';

interface Props extends CommonProps {
    hasChangeDate?: boolean;
    min: Date;
    max: Date;
    from?: Date;
    to?: Date;
    onSelectDate: (rangeDate: RangeDate) => void;
}

const RangeDateSelectorComponent = (props: Props) => {
    const commonFuncHook = useCommonFunc();
    const [rangeDay, setRangeDay] = useState(0);
    const [from, setFrom] = useState(props.from);
    const [to, setTo] = useState(props.to);
    const { t } = useTranslation();

    useEffect(() => {
        try {
            if (!from || !to) {
                setTo(endOfToday());
                setFrom(generateDateToBefore(to!, 1, 'month').from!);
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, []);

    useEffect(() => {
        try {
            if (!isNullOrUndefined(props.hasChangeDate)) {
                initRangeDay();
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, [props.hasChangeDate]);

    useEffect(() => {
        try {
            initRangeDay();

            props.onSelectDate({
                from: from,
                to: to
            });
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, [from, to]);

    const initRangeDay = () => {
        try {
            const _rangeDate = differenceInCalendarDays(startOfNextDay(to!), from!);

            if (isNaN(_rangeDate)) {
                setRangeDay(undefined!);
            } else {
                setRangeDay(differenceInCalendarDays(startOfNextDay(to!), from!));
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const selectDate = (selectedDate: CalendarSelectEvent, type: 'from' | 'to') => {
        try {
            if (type === 'from') {
                const _from = startOfDay(selectedDate.value as Date);
                setFrom(_from);

                if (_from! > to!) {
                    setTo(undefined);
                }
            } else {
                const _to = endOfDay(selectedDate.value as Date);
                setTo(_to);

                if (_to! < from!) {
                    setFrom(undefined);
                }
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <div className="range-date-container">
            <div className="rd-calendar rd-from">
                <span>{t('LBL_0008')}</span>
                {
                    <Calendar
                        value={from}
                        minDate={props.min}
                        maxDate={props.max}
                        showIcon={true}
                        showButtonBar
                        onSelect={($event: CalendarSelectEvent) => selectDate($event, 'from')}
                    ></Calendar>
                }
            </div>
            <div className="rd-calendar rd-to">
                <span>{t('LBL_0009')}</span>
                <Calendar
                    value={to}
                    minDate={props.min}
                    maxDate={props.max}
                    showIcon={true}
                    showButtonBar
                    onSelect={($event: CalendarSelectEvent) => selectDate($event, 'to')}
                ></Calendar>
            </div>
            {rangeDay && (
                <div className="rd-range">
                    <span>~ {t('LBL_0010', { day: rangeDay })}</span>
                </div>
            )}
        </div>
    );
};

RangeDateSelectorComponent.defaultProps = {
    min: CommonConstant.CalendarConstant.MinDate,
    max: CommonConstant.CalendarConstant.MaxDate,
    from: generateDateToBefore(new Date(), 1, 'month').from!,
    to: new Date(),
    hasChangeDate: false,
    onSelectDate: (rangeDate: RangeDate) => {}
};

export default memo(RangeDateSelectorComponent);
