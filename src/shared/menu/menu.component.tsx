import './menu.component.scss';

import { isEmpty } from 'lodash';
import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MenuItem } from '../../core/models/item.model';
import { isNullOrUndefined } from '../../core/utils/common-func.util';
import { formatText } from '../../core/utils/format-text.util';

interface Props {
    menuItems: MenuItem[];
    type?: 'panel' | 'dropdown';
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    onClickMenu: (item: MenuItem) => void;
}

const MenuComponent = (props: Props) => {
    const { t } = useTranslation();
    const [menuItems, setMenuItems] = useState([] as MenuItem[]);

    useEffect(() => {
        if (!isEmpty(props.menuItems)) setMenuItems(props.menuItems!);
    }, [props.menuItems]);

    const clickMenu = (item: MenuItem, isParent: boolean) => {
        if (props.type === 'panel' && isParent) {
            item.expanded = !isNullOrUndefined(item.expanded) ? !item.expanded : true;

            setMenuItems([...menuItems]);
        } else if (!isParent) {
            props.onClickMenu(item);
        }
    };

    const generateItemTemplate = (items: MenuItem[]) => {
        return (
            <>
                {items?.map((item) =>
                    item.visible === false ? (
                        <Fragment key={item.id}></Fragment>
                    ) : (
                        <li
                            key={item.id}
                            id={item.id}
                            className={`menu ${item.className} ${item.disabled ? 'app-disabled' : ''} ${
                                !isEmpty(item.items) ? 'parent-item' : ''
                            }`}
                        >
                            <div
                                className="menu-title text-hover"
                                onClick={() => (item.click ? item.click() : clickMenu(item, !isEmpty(item.items)))}
                            >
                                <div className="title">
                                    {item.imgIcon && (
                                        <img
                                            src={item.imgIcon}
                                            width="20"
                                            height="0"
                                            alt={item.imgIconAlt ?? ''}
                                        />
                                    )}
                                    {item.icon && <i className={`pi ${item.icon}`}></i>}
                                    <span>
                                        {formatText(t(item.label ?? ''), { formatTextType: item.formatTextType! })}
                                    </span>
                                </div>
                                {!isEmpty(item.items) && (
                                    <i
                                        className={`icon-expanded pi ${
                                            props.type === 'panel' && item.expanded ? 'pi-angle-down' : 'pi-angle-right'
                                        }`}
                                    ></i>
                                )}
                            </div>

                            {!isEmpty(item.items) && (
                                <>
                                    <ul
                                        className={`submenu-container ${item.expanded ? 'expanded' : ''} ${
                                            item.subMenuClassName
                                        }`}
                                    >
                                        {generateItemTemplate(item.items! as MenuItem[])}
                                    </ul>
                                </>
                            )}
                        </li>
                    )
                )}
            </>
        );
    };

    return (
        <ul className={`menu-container ${props.type} ${props.orientation} ${props.className}`}>
            {useMemo(() => generateItemTemplate(menuItems), [menuItems, t])}
        </ul>
    );
};

MenuComponent.defaultProps = {
    items: [],
    type: 'dropdown',
    orientation: 'vertical',
    onClickMenu: () => {}
};

export default memo(MenuComponent);
