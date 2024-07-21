import { render, screen, cleanup } from '@testing-library/react';
import App from '../App';

afterEach(() => {
  cleanup()
})

test('renders disabled submit button', () => {
  render(<App />);
  const linkElement = screen.getByText(/submit/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.id).toBe("disabled-submit-button");
  expect(linkElement).toBeDisabled();
});

test('renders help button', () => {
  render(<App />);
  const linkElement = screen.getByText(/help/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.id).toBe("help-button");
});

test('renders title', () => {
  render(<App />);
  const linkElement = screen.getByText(/National Weather Service Observation Query Tool/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders latitude textInput', () => {
  render(<App />);
  const linkElement = screen.getByTestId("latitude-text-input");
  expect(linkElement).toBeInTheDocument();
});

test('renders longitude textInput', () => {
  render(<App />);
  const linkElement = screen.getByTestId("longitude-text-input");
  expect(linkElement).toBeInTheDocument();
});

test('renders data table', () => {
  render(<App />);
  const linkElement = screen.getByTestId("data-table");
  expect(linkElement).toBeInTheDocument();
});