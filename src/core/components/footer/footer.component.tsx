import './footer.component.scss';

import { memo, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import MenuComponent from '../../../shared/menu/menu.component';
import { CommonConstant } from '../../constants/common.const';
import useCommonFunc from '../../hooks/common-func.hook';
import { MenuItem } from '../../models/item.model';
import useFooter from './footer.hook';

const FooterComponent = () => {
    const footerHook = useFooter();
    const commonFuncHook = useCommonFunc();

    const [navMenu, setNavMenu] = useState([] as MenuItem[]);

    useEffect(() => {
        try {
            const getNavMenu = async () => {
                const menu = await footerHook.getNavMenu();
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
            if (selectedItem.url) {
                Navigate({ to: selectedItem.url });
            }
        } catch (error) {
            commonFuncHook.handleError(error);
            throw error;
        }
    };

    return (
        <div className="footer-container">
            {/* Navigation */}
            <div className="footer-nav">
                <MenuComponent
                    menuItems={navMenu}
                    type="panel"
                    onClickMenu={($event) => clickMenu($event)}
                />
            </div>
            {/* Website information */}
            <div className="footer-info">
                <span className="gradient-1">{CommonConstant.WebSite} © 2023</span>
            </div>
        </div>
    );
};

export default memo(FooterComponent);
