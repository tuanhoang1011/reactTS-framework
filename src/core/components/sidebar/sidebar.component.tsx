import './sidebar.component.scss';

import { memo, useEffect, useState } from 'react';

import useCommonFunc from '../../hooks/common-func.hook';
import { MenuItem } from '../../models/item.model';
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

    return (
        <div className={`sidebar-container${sidebarHook.expandSidebar ? ' expanded' : ''}`}>
            <div className="sidebar-nav">
                {/* check later */}
                {/* <app-menu [menus]="navMenu"
                styleClass="sidebar-nav-menu"
                subMenuStyleClass="sidebar-nav-submenu">
            </app-menu>  */}
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
