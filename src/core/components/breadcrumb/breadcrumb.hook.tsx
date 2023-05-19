import { BreadcrumbItemList } from '../../models/breadcrumb.model';
import { LayoutState } from '../../models/state.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setPropsBreadcrumb } from './breadcrumb.reducer';

const useBreadcrumb = () => {
    const dispatch = useAppDispatch();
    const { breadcrumbs } = useAppSelector((state) => state.breadrumb);

    const setBreadcrumb = (breadcrumbs: BreadcrumbItemList) => {
        const state: LayoutState = {
            breadcrumbs: breadcrumbs
        };

        dispatch(
            setPropsBreadcrumb({
                ...state
            })
        );
    };

    return { breadcrumbs, setBreadcrumb };
};

export default useBreadcrumb;
