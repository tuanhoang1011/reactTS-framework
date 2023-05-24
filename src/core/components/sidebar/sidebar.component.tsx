import './sidebar.component.scss';

import { memo, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import MenuComponent from '../../../shared/menu/menu.component';
import useCommonFunc from '../../hooks/common-func.hook';
import { MenuItem } from '../../models/item.model';
import { GlobalVariables } from '../../utils/global-variables.util';
import useSidebar from './sidebar.hook';

const SidebarComponent = () => {
    const sidebarHook = useSidebar();
    const commonFuncHook = useCommonFunc();

    const [navMenu, setNavMenu] = useState([] as MenuItem[]);

    useEffect(() => {
        try {
            const getNavMenu = async () => {
                const menu = (await sidebarHook.getNavMenu()).menu;
                setNavMenu(menu);
            };

            getNavMenu();
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    }, []);

    const clickMenu = (selectedItem: MenuItem) => {
        try {
            if (window.innerWidth < GlobalVariables.standardSize.lg) {
                sidebarHook.setSidebarStatus(false);
            }

            if (selectedItem.url) {
                Navigate({ to: selectedItem.url });
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <div className={`sidebar-container ${sidebarHook.expandSidebar ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-nav">
                <MenuComponent
                    menuItems={navMenu}
                    type={sidebarHook.expandSidebar ? 'panel' : 'dropdown'}
                    onClickMenu={($event) => clickMenu($event)}
                />
            </div>
            {sidebarHook.expandSidebar && (
                <div className="sidebar-info">
                    <span className="gradient-1">{process.env['REACT_APP_VERSION']}</span>
                </div>
            )}
        </div>
    );
};

export default memo(SidebarComponent);
