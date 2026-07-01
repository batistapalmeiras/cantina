// React
import React from 'react';
// Libs
import { render, screen } from '@testing-library/react';
// Local
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
