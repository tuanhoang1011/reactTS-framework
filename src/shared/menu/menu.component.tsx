import './menu.component.scss';

import { memo, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { MenuItem } from '../../core/models/item.model';

interface Props {
    menus?: MenuItem[];
    styleClass?: string;
    subMenuStyleClass?: string;
    onClickMenu: (item: MenuItem) => void;
    onClickSubMenu: (item: { menu: MenuItem; subMenu: MenuItem }) => void;
}

const MenuComponent = (props: Props) => {
    const { t } = useTranslation();

    const clickMenu = (menu: MenuItem) => {
        props.onClickMenu(menu);
    };

    const clickSubMenu = (menu: MenuItem, subMenu: MenuItem) => {
        props.onClickSubMenu({ menu, subMenu });
    };

    return (
        <ul className={`menu ${props.styleClass}`}>
            {useMemo(
                () =>
                    props.menus?.map((menu) => {
                        return (
                            <li
                                key={menu.id}
                                id={menu.id}
                                className={`text-hover ${menu.styleClass}${
                                    menu.disabled
                                        ? ' app-disabled'
                                        : menu.subMenu && menu.subMenu.length > 0
                                        ? ' submenu'
                                        : ''
                                }`}
                                onClick={() => (menu.click ? menu.click() : clickMenu(menu))}
                            >
                                {menu.imgIcon && (
                                    <img
                                        src={menu.imgIcon}
                                        width="20"
                                        height="0"
                                        alt={menu.imgIconAlt ?? ''}
                                    />
                                )}
                                {menu.icon && <i className={`pi ${menu.icon}`}></i>}
                                <span>{t(menu.label ?? '')}</span>

                                {menu.subMenu && menu.subMenu.length > 0 && (
                                    <ul className={`submenu-dropdown ${props.subMenuStyleClass}`}>
                                        {menu.subMenu.map((sub) => (
                                            <li
                                                key={sub.id}
                                                id={sub.id}
                                                className={`text-hover ${sub.styleClass}${
                                                    sub.disabled ? ' app-disabled' : ''
                                                }`}
                                                onClick={() => (sub.click ? sub.click() : clickSubMenu(menu, sub))}
                                            >
                                                {sub.imgIcon && (
                                                    <img
                                                        src={sub.imgIcon}
                                                        width="20"
                                                        height="0"
                                                        alt={sub.imgIconAlt ?? ''}
                                                    />
                                                )}
                                                {sub.icon && <i className={`pi ${sub.icon}`}></i>}
                                                <span>{t(sub.label ?? '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    }),
                [props.menus]
            )}
        </ul>
    );
};

MenuComponent.defaultProps = {
    menus: [],
    onClickMenu: () => {},
    onClickSubMenu: () => {}
};

export default memo(MenuComponent);
