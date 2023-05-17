import { lazy } from 'react';
import { Navigate, Route } from 'react-router';

import { PublicRoutes } from '../constants/router.const';

const PublicRouting = (
    <>
        <Route
            path={PublicRoutes.Example}
            Component={lazy(() => import('../../features/example/example.component'))}
        />
        <Route
            path=""
            element={<Navigate to={`${PublicRoutes.Example}`} />}
        />
    </>
);

export default PublicRouting;
