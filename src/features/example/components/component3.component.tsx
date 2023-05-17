import { memo } from 'react';

import withBaseComponent from '../../../shared/base-component/base.component';

const Component3Component = () => {
    return <div>Component 3</div>;
};

export default withBaseComponent(memo(Component3Component))({ activeScreen: 'Component 3 - Screen' });
