import { Component, memo } from 'react';

import { CommonProps } from '../models/common-props.model';

class ErrorBoundary extends Component<CommonProps> {
    state = { hasError: false };

    componentDidCatch(error: unknown) {}

    static getDerivedStateFromError(error: unknown) {
        return { hasError: true };
    }

    render() {
        return this.props.children;
    }
}

export default memo(ErrorBoundary);
