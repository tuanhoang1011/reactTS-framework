import './loading.component.scss';

import { memo } from 'react';

import useLoading from './loading.hook';

const LoadingComponent = () => {
    const loadingHook = useLoading();

    return loadingHook.isOn ? (
        <div className="load-container">
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
    ) : (
        <></>
    );
};

export default memo(LoadingComponent);
