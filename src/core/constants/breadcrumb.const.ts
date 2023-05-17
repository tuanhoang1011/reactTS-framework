import { BreadcrumbItemList } from '../models/breadcrumb.model';
import { LogActiveScreen } from './log.const';

export const Breadcrumb = Object.freeze({
    Screen1: {
        Id: 'screen-1',
        Child: {
            ScreenList1: 'screen-1-list',
            ScreenDetail1: 'screen-1-detail',
            ScreenList2: 'screen-2-list',
            ScreenDetail2: 'screen-2-detail'
        }
    }
});

export const BreadcrumbRoutes = [
    {
        id: Breadcrumb.Screen1.Id,
        items: [
            {
                id: Breadcrumb.Screen1.Child.ScreenList1,
                destinationScreen: LogActiveScreen.ScreenEx1.List,
                url: '',
                label: 'Screen1 List',
                icon: 'pi pi-user'
            },
            {
                id: Breadcrumb.Screen1.Child.ScreenDetail1,
                destinationScreen: LogActiveScreen.ScreenEx1.List,
                url: '',
                label: 'Screen1 Detail',
                imgIcon: '../images/fw-user.svg',
                imgIconAlt: '',
                imgIconStyleClass: '',
                style: {
                    width: 20,
                    height: 20
                }
            },
            {
                id: Breadcrumb.Screen1.Child.ScreenList2,
                destinationScreen: LogActiveScreen.ScreenEx1.List,
                url: '',
                label: 'Screen2 List',
                icon: 'pi pi-user'
            },
            {
                id: Breadcrumb.Screen1.Child.ScreenDetail2,
                destinationScreen: LogActiveScreen.ScreenEx1.List,
                url: '',
                label: 'Screen2 Detail',
                icon: 'pi pi-user'
            }
        ]
    } as BreadcrumbItemList
];
