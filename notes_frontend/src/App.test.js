import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header and actions', () => {
  render(<App />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument();
});
