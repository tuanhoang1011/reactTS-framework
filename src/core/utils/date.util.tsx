import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    endOfDay,
    setHours,
    startOfDay,
    subDays,
    subMonths,
    subWeeks,
    subYears
} from 'date-fns';

import { RangeDate } from '../models/common.model';

export const startOfNextDay = (endDate: Date) => {
    return setHours(startOfDay(endDate), 24);
};

export const generateDateToBefore = (to: Date, amount = 1, dateType: 'day' | 'week' | 'month' | 'year') => {
    to = endOfDay(to);
    let before;

    switch (dateType) {
        case 'day':
            before = startOfDay(subDays(to, amount));
            break;

        case 'week':
            before = startOfDay(subWeeks(to, amount));
            break;

        case 'month':
            before = startOfDay(subMonths(to, amount));
            break;

        case 'year':
            before = startOfDay(subYears(to, amount));
            break;
    }

    return {
        from: startOfDay(addDays(before, 1)),
        to: endOfDay(to)
    } as RangeDate;
};

export const generateDateToAfter = (from: Date, amount = 1, dateType: 'day' | 'week' | 'month' | 'year') => {
    from = startOfDay(from);
    let after;

    switch (dateType) {
        case 'day':
            after = endOfDay(addDays(from, amount));
            break;

        case 'week':
            after = endOfDay(addWeeks(from, amount));
            break;

        case 'month':
            after = endOfDay(addMonths(from, amount));
            break;

        case 'year':
            after = endOfDay(addYears(from, amount));
            break;
    }

    return {
        from: startOfDay(from),
        to: endOfDay(from.getDate() === after.getDate() ? subDays(after, 1) : after)
    } as RangeDate;
};
