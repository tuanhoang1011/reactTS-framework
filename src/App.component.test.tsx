import { render, screen } from '@testing-library/react';

import AppCommponent from './App.component';

test('renders learn react link', () => {
    render(<AppCommponent />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
