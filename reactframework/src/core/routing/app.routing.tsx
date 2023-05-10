import { lazy } from 'react';
import { Navigate, Route } from 'react-router';

import { AppRoutes } from '../constants/router.const';
import PrivateRouting from './private.routing';
import PublicRouting from './public.routing';

export const AppRouting = (
    <>
        <Route
            path={AppRoutes.Public}
            Component={lazy(() => import('../components/public/public.component'))}
        >
            {PublicRouting}
        </Route>

        <Route
            path={AppRoutes.Private}
            Component={lazy(() => import('../components/private/private.component'))}
        >
            {PrivateRouting}
        </Route>

        <Route
            path={AppRoutes.Error}
            Component={lazy(() => import('../components/error-page/error-page.component'))}
        ></Route>

        <Route
            path="*"
            element={<Navigate to={AppRoutes.Public} />}
        />
    </>
);
