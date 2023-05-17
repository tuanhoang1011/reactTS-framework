import './public.component.scss';

import { memo } from 'react';
import { Outlet } from 'react-router';

import withBaseComponent from '../../../shared/base-component/base.component';
import FooterComponent from '../footer/footer.component';
import HeaderComponent from '../header/header.component';
import SidebarComponent from '../sidebar/sidebar.component';
import useSplashScreen from '../splash-screen/splash-screen.hook';

const PublicComponent = (props) => {
    const splashScreenHook = useSplashScreen();

    return !splashScreenHook.isOn ? (
        <div className="public-container">
            <header className="public-header">
                <HeaderComponent />
            </header>
            <div className="public-body">
                <nav className="public-sidebar">
                    <SidebarComponent />
                </nav>
                <div className="public-content">
                    <main className="public-main">
                        <Outlet></Outlet>
                    </main>
                    <footer className="public-footer">
                        <FooterComponent />
                    </footer>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default withBaseComponent(memo(PublicComponent))({});
