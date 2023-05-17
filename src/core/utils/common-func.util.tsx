import { isNull, isUndefined } from 'lodash';
import { useLocation } from 'react-router';

import { AuthRoutes, PublicRoutes } from '../constants/router.const';

export const isNullOrUndefined = (val) => {
    return isUndefined(val) || isNull(val);
};

export const showMessageDebug = (msg: string) => {
    if (process.env['REACT_APP_DEBUG_MODE']) console.log(msg);
};

export const isPublicPages = () => {
    const location = useLocation();
    const authRoute = `${PublicRoutes.Auth}/`;
    const publicPage = [`${authRoute}${AuthRoutes.SignIn}`];

    return publicPage.some((url) => location.pathname.toLowerCase().includes(url.toLowerCase()));
};
