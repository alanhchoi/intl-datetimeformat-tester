import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(1620258815791);
  render(<App />);
  expect(document.body).toMatchSnapshot();
});
