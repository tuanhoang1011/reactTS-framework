import './footer.component.scss';

import { memo } from 'react';

import { CommonConstant } from '../../constants/common.const';

const FooterComponent = () => {
    return (
        <div className="footer-container">
            {/* Navigation */}
            <div className="footer-nav"></div>
            {/* Website information */}
            <div className="footer-info">
                <span className="gradient-1">{CommonConstant.WebSite} © 2023</span>
            </div>
        </div>
    );
};

export default memo(FooterComponent);
