import './range-date-selector.component.scss';

import { differenceInCalendarDays, endOfDay, endOfToday, startOfDay } from 'date-fns';
import { Calendar, CalendarSelectEvent } from 'primereact/calendar';
import { memo, useCallback, useEffect, useState } from 'react';
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
    const { t } = useTranslation();

    useEffect(() => {
        try {
            if (!props.from || !props.to) {
                props.to = endOfToday();
                props.from = generateDateToBefore(props.to, 1, 'month').from!;
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

    const initRangeDay = () => {
        try {
            setRangeDay(differenceInCalendarDays(startOfNextDay(props.to!), props.from!));
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const selectDate = (selectedDate: CalendarSelectEvent, type: 'from' | 'to') => {
        try {
            if (type === 'from') {
                props.from = startOfDay(selectedDate.value as Date);

                if (props.from > props.to!) {
                    props.to = undefined!;
                }
            } else {
                props.to = endOfDay(selectedDate.value as Date);

                if (props.to < props.from!) {
                    props.from = undefined!;
                }
            }
            initRangeDay();

            props.onSelectDate({
                from: props.from,
                to: props.to
            });
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
                        value={props.from}
                        minDate={props.min}
                        maxDate={props.max}
                        showIcon={true}
                        showButtonBar
                        onSelect={useCallback(() => ($event: CalendarSelectEvent) => selectDate($event, 'from'), [])}
                    ></Calendar>
                }
            </div>
            <div className="rd-calendar rd-to">
                <span>{t('LBL_0009')}</span>
                <Calendar
                    value={props.to}
                    minDate={props.min}
                    maxDate={props.max}
                    showIcon={true}
                    showButtonBar
                    onSelect={useCallback(() => ($event: CalendarSelectEvent) => selectDate($event, 'to'), [])}
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
    hasChangeDate: false,
    onSelectDate: (rangeDate: RangeDate) => {}
};

export default memo(RangeDateSelectorComponent);
