import { render, screen } from '@testing-library/react';
import App from './App';
import { SCENARIOS } from './scenarios/registry.data';

test('registry ids and paths are unique', () => {
  expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
  expect(new Set(SCENARIOS.map((s) => s.path)).size).toBe(SCENARIOS.length);
});

test('index links to both variants of every scenario', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dynamic component test scenarios');
  for (const s of SCENARIOS) {
    expect(screen.getByTestId(`link-${s.id}-accessible`)).toHaveAttribute('href', `#${s.path}?variant=accessible`);
    expect(screen.getByTestId(`link-${s.id}-broken`)).toHaveAttribute('href', `#${s.path}?variant=broken`);
  }
});
