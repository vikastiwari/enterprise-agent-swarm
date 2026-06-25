import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('Zustand Store', () => {
  beforeEach(() => {
    // Reset state before each test
    useStore.setState({ theme: 'dark', isMobileMenuOpen: false });
  });

  it('should initialize with dark theme', () => {
    const { theme } = useStore.getState();
    expect(theme).toBe('dark');
  });

  it('should update theme when setTheme is called', () => {
    const { setTheme } = useStore.getState();
    
    setTheme('light');
    
    expect(useStore.getState().theme).toBe('light');
  });

  it('should toggle mobile menu', () => {
    const { toggleMobileMenu } = useStore.getState();
    expect(useStore.getState().isMobileMenuOpen).toBe(false);

    toggleMobileMenu();
    expect(useStore.getState().isMobileMenuOpen).toBe(true);
  });
});
