import './private.component.scss';

import { memo } from 'react';
import { Outlet } from 'react-router';

import withBaseComponent from '../../../shared/base-component/base.component';

const PrivateComponent = () => {
    return (
        <div className="private-container">
            <header className="private-header"></header>
            <div className="private-body">
                <nav className="private-sidebar"></nav>
                <div className="private-content">
                    <main className="private-main">
                        <Outlet></Outlet>
                    </main>
                    <footer className="private-footer"></footer>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(PrivateComponent))({});
