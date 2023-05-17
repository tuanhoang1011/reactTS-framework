import { BreadcrumbItemList } from '../../models/breadcrumb.model';
import { LayoutState } from '../../models/state.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setProps } from './breadcrumb.reducer';

const useBreadcrumb = () => {
    const dispatch = useAppDispatch();
    const breadcrumbs = useAppSelector((state) => state.breadrumb.breadcrumbs);

    const setBreadcrumb = (breadcrumbs: BreadcrumbItemList) => {
        const state: LayoutState = {
            breadcrumbs: breadcrumbs
        };

        dispatch(
            setProps({
                ...state
            })
        );
    };

    return { breadcrumbs, setBreadcrumb };
};

export default useBreadcrumb;
