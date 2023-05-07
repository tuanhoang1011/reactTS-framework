import { render, screen } from '@testing-library/react';
import React from 'react';

import AppCommponent from './app.component';

test('renders learn react link', () => {
    render(<AppCommponent />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
