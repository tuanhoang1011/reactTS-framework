import './header.component.scss';

import { OverlayPanel } from 'primereact/overlaypanel';
import { memo, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router';

import MenuComponent from '../../../shared/menu/menu.component';
import { CommonConstant } from '../../constants/common.const';
import { MenuItem } from '../../models/item.model';
import { GlobalVariables } from '../../utils/global-variables.ultility';
import useSidebar from '../sidebar/sidebar.hook';
import useHeader from './header.hook';

const HeaderComponent = () => {
    const usr = useRef<OverlayPanel>(null);
    const lang = useRef<OverlayPanel>(null);
    const headerHook = useHeader();
    const sidebarHook = useSidebar();
    const [theme, setTheme] = useState(GlobalVariables.theme);
    const [navMenu, setNavMenu] = useState([] as MenuItem[]);
    const [userMenu, setUserMenu] = useState([] as MenuItem[]);
    const [languages, setLanguages] = useState([] as MenuItem[]);
    const [language, setLanguage] = useState(GlobalVariables.language);

    useEffect(() => {
        getNavMenu();
        getUserMenu();
        getLanguages();
    }, []);

    const getNavMenu = async () => {
        const items = (await headerHook.getNavMenu()).menu;
        setNavMenu(items);
    };

    const getUserMenu = async () => {
        const items = [
            {
                id: 'profile',
                label: 'LBL_0005',
                click: () => {
                    // check later
                    // view user profile
                    console.log('View profile');
                }
            },
            {
                id: 'signout',
                label: 'LBL_0007',
                click: () => {
                    // check later
                    // sign out
                    console.log('Sign out');
                }
            }
        ];
        setUserMenu(items);
    };

    const getLanguages = async () => {
        const items = (await headerHook.getLanguages()).menu;
        setLanguages(items);
    };

    const changeTheme = () => {
        let newTheme;
        if (GlobalVariables.theme === CommonConstant.Theme.Light.label) {
            newTheme = CommonConstant.Theme.Dark.label;
        } else {
            newTheme = CommonConstant.Theme.Light.label;
        }

        headerHook.setTheme(GlobalVariables.theme, newTheme);
        setTheme(newTheme);
    };

    const clickMenu = (selectedItem: MenuItem | { menu: MenuItem; subMenu: MenuItem }) => {
        // select menu
        if (!(selectedItem as any).menu && (selectedItem as MenuItem).url) {
            Navigate({ to: (selectedItem as MenuItem).url! });
        }

        // select submenu
        if ((selectedItem as any).menu && (selectedItem as any).subMenu.url) {
            Navigate({ to: (selectedItem as any).subMenu.url! });
        }
    };

    const changeLanguage = (langOpt: MenuItem) => {
        if (langOpt && langOpt.id) {
            headerHook.setLanguage(langOpt.id);
            setLanguage(langOpt.id);
        }

        lang.current?.hide();
    };

    const clickSidebarMenu = () => {
        sidebarHook.setSidebarStatus(!sidebarHook.expandSidebar);
    };

    return (
        <div className="header-container">
            {/* Menu Sidebar */}
            <div className="header-sidebar-hamburger">
                <input
                    type="checkbox"
                    id="hamburger"
                />
                <i
                    data-for="hamburger"
                    className={`hamburger pi text-hover${sidebarHook.expandSidebar ? ' pi-arrow-left' : ' pi-bars'}`}
                    onClick={() => clickSidebarMenu()}
                ></i>
            </div>

            {/* Logo */}
            <div className="header-logo">
                <img
                    src="../images/fw-logo.svg"
                    width="60"
                    height="0"
                    alt=""
                />
            </div>

            {/* Navigation menu */}
            <div className="header-left">
                <div className="h-line-item !h-7"></div>
                <nav className="h-navbar">
                    <MenuComponent
                        menus={navMenu}
                        styleClass="h-nav-menu"
                        onClickMenu={($event) => clickMenu($event)}
                        onClickSubMenu={($event) => clickMenu($event)}
                    />
                </nav>
            </div>

            <div className="header-right">
                {/* User */}
                <div className="h-line-item"></div>
                {/* Check later  */}
                <div
                    className="h-user text-hover"
                    onClick={($event) => usr.current?.toggle($event)}
                    onKeyUp={($event) => usr.current?.toggle($event)}
                >
                    <i className="pi pi-user"></i>
                    <div className="h-username">{'Pham Hoang Tuan'}</div>
                </div>
                <OverlayPanel
                    className="w-[180px]"
                    ref={usr}
                >
                    <MenuComponent
                        menus={userMenu}
                        styleClass="h-menu"
                    />
                </OverlayPanel>
                {/* Language */}
                <div className="h-line-item"></div>
                <div
                    className="h-lang text-hover"
                    onClick={($event) => lang.current?.toggle($event)}
                    onKeyUp={($event) => lang.current?.toggle($event)}
                >
                    <i className="pi pi-globe"></i>
                    <span className="h-lang-main">{language}</span>
                </div>
                <OverlayPanel ref={lang}>
                    <MenuComponent
                        menus={languages}
                        styleClass="h-menu"
                        onClickMenu={($event) => changeLanguage($event)}
                    />
                </OverlayPanel>

                {/* Theme */}
                <div className="h-line-item"></div>
                <i
                    className={`h-theme text-hover pi${
                        theme === 'light' ? ' pi-sun' : theme === 'dark' ? ' pi-moon' : ''
                    }`}
                    onClick={() => changeTheme()}
                ></i>
                {/* Version */}
                <div className="h-line-item"></div>
                <p className="h-verion gradient-1">{process.env['REACT_APP_VERSION']}</p>
            </div>
        </div>
    );
};

export default memo(HeaderComponent);
