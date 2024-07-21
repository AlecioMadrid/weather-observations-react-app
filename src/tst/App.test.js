import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders submit button', () => {
  render(<App />);
  const linkElement = screen.getByText(/submit/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders help button', () => {
  render(<App />);
  const linkElement = screen.getByText(/help/i);
  expect(linkElement).toBeInTheDocument();
});



