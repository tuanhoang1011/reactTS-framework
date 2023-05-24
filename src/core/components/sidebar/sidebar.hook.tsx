import useCommonFunc from '../../hooks/common-func.hook';
import useHttpBase from '../../hooks/http-base.hook';
import { MenuItem } from '../../models/item.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setPropsSidebar } from './sidebar.reducer';

const root = '../json/';
const sidebarJSON = `${root}items/sidebar.json`;

const useSidebar = () => {
    const { expandSidebar } = useAppSelector((state) => state.sidebar);
    const dispatch = useAppDispatch();

    const commonFuncHook = useCommonFunc();
    const httpBaseHook = useHttpBase();

    const getNavMenu = async () => {
        try {
            return await httpBaseHook.getLocalFile<{ menu: MenuItem[] }>(sidebarJSON);
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    const setSidebarStatus = (val: boolean) => {
        try {
            dispatch(setPropsSidebar({ expandSidebar: val ?? true }));
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        expandSidebar,
        getNavMenu,
        setSidebarStatus
    };
};

export default useSidebar;
