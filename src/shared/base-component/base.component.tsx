import { orderBy } from 'lodash';
import { useEffect } from 'react';
import { Subject } from 'rxjs';

import { SortInfo } from '../../core/models/common.model';
import { setPropsGlobal } from '../../core/store/reducers/global.reducer';
import { useAppDispatch } from '../../core/store/stores/store';

export interface BaseProps {
    activeScreen?: string;
    activeDialog?: string;
    tableID?: string;
    destroy$?: Subject<void>;
    sortInfo?: SortInfo;
    tableValue?: any;
    executeSort?: () => void;
    onSort?: (event: any) => void;
    scrollTableToTop?: () => void;
}

const withBaseComponent =
    <T,>(WrappedComponent) =>
    (baseProps: BaseProps) => {
        const BaseComponent = (childProps: T) => {
            const dispatch = useAppDispatch();

            useEffect(() => {
                baseProps.destroy$ = new Subject<void>();

                if (baseProps.activeScreen) {
                    dispatch(
                        setPropsGlobal({
                            activeScreen: baseProps.activeScreen
                        })
                    );
                }

                if (baseProps.activeDialog) {
                    setTimeout(() => {
                        dispatch(
                            setPropsGlobal({
                                activeDialog: baseProps.activeDialog
                            })
                        );
                    }, 200);
                }

                return () => {
                    baseProps.destroy$!.next();
                };
            }, []);

            const onSort = (event: any) => {
                try {
                    baseProps.sortInfo = {
                        sortOrder: event.orderStr,
                        sortField: event.field
                    };

                    executeSort();
                } catch (error) {
                    throw error;
                }
            };

            const executeSort = () => {
                try {
                    baseProps.tableValue = orderBy(
                        baseProps.tableValue,
                        [baseProps.sortInfo?.sortField],
                        [baseProps.sortInfo?.sortOrder ?? 'asc']
                    );
                } catch (error) {
                    throw error;
                }
            };

            const scrollTableToTop = () => {
                try {
                    const tableWrapper = document.querySelectorAll(`#${baseProps.tableID} .p-datatable-wrapper`);

                    if (tableWrapper && tableWrapper.length > 0) {
                        // scroll table to top
                        tableWrapper[0].scrollTop = 0;
                    }
                } catch (error) {
                    throw error;
                }
            };

            return (
                <WrappedComponent
                    {...childProps}
                    {...baseProps}
                    executeSort={executeSort}
                    onSort={onSort}
                    scrollTableToTop={scrollTableToTop}
                />
            );
        };

        return BaseComponent;
    };

export default withBaseComponent;
