import { MenuItem } from '../../models/item.model';
import HttpBaseService from '../../services/communicate-server/http-base.service';
import { useAppDispatch, useAppSelector } from '../../store/stores/store';
import { setProps } from './sidebar.reducer';

const root = '../json/';
const sidebarJSON = `${root}items/sidebar.json`;
const httpBaseService = HttpBaseService.getInstance();

const useSidebar = () => {
    const state = useAppSelector((state) => state.sidebar.expandSidebar);
    const dispatch = useAppDispatch();

    const getNavMenu = async () => {
        try {
            return await httpBaseService.getLocalFile<{ menu: MenuItem[] }>(sidebarJSON);
        } catch (error) {
            throw error;
        }
    };

    const setSidebarStatus = (val: boolean) => {
        try {
            dispatch(setProps({ expandSidebar: val ?? true }));
        } catch (error) {
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
