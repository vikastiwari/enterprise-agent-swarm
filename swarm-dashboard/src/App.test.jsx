import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// ResizeObserver mock since it's not present in JSDOM by default
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('App Component', () => {
  it('renders the boot sequence initially', () => {
    render(<App />);
    const bootText = screen.getByText(/\[SYSTEM: OK\]/i);
    expect(bootText).toBeInTheDocument();
  });
});
