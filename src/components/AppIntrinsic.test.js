import { render, screen } from '@testing-library/react';
import AppIntrinsic from './AppIntrinsic';

test('renders learn react link', () => {
  render(<AppIntrinsic />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
