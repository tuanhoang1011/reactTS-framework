import { memo } from 'react';

const ErrorPageComponent = () => {
    return (
        <div className="private-container">
            <header className="private-header"></header>
            <div className="private-body">
                <nav className="private-sidebar"></nav>
                <div className="private-content">
                    <main className="private-main"></main>
                    <footer className="private-footer"></footer>
                </div>
            </div>
        </div>
    );
};

export default memo(ErrorPageComponent);
