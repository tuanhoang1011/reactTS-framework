import { memo } from 'react';

import withBaseComponent from '../../../shared/base-component/base.component';

const Component2Component = () => {
    return <div>Component 2</div>;
};

export default withBaseComponent(memo(Component2Component))({ activeScreen: 'Component 2 - Screen' });
