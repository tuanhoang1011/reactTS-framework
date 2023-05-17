import { memo } from 'react';

import withBaseComponent from '../../../shared/base-component/base.component';

const Component1Component = () => {
    return <div>Component 1</div>;
};

export default withBaseComponent(memo(Component1Component))({ activeScreen: 'Component 1 - Screen' });
