import './splash-screen.component.scss';

import { memo } from 'react';

import useSplashScreen from './splash-screen.hook';

const SplashScreenComponent = () => {
    const splashScreenHook = useSplashScreen();

    return splashScreenHook.isOn ? (
        <div className="splash-screen">
            <div className="flex items-center justify-center flex-col">
                <img
                    src="../images/fw-logo.svg"
                    alt=""
                    width="0"
                    height="0"
                    className="w-fit"
                />
                <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default memo(SplashScreenComponent);
