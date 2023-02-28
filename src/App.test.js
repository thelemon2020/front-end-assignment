//
// FILE : index.js
// PROJECT : SENG3080 - Front End Assignment
// PROGRAMMER : Chris Lemon
// FIRST VERSION : 2023-02-19
// LAST REVISION : 2020-09-27
// DESCRIPTION : The entry point to the application
//


import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
