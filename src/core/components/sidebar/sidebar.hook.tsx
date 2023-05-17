import useCommonFunc from '../../hooks/common-func.hook';
import useHttpBase from '../../hooks/http-base.hook';
import { MenuItem } from '../../models/item.model';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setProps } from './sidebar.reducer';

const root = '../json/';
const sidebarJSON = `${root}items/sidebar.json`;

const useSidebar = () => {
    const state = useAppSelector((state) => state.sidebar.expandSidebar);
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
            dispatch(setProps({ expandSidebar: val ?? true }));
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return {
        expandSidebar: state,
        getNavMenu,
        setSidebarStatus
    };
};

export default useSidebar;
