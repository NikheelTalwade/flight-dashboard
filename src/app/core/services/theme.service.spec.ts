import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('persists and applies the selected theme', () => {
    const service = new ThemeService();

    service.setTheme('dark');

    expect(service.theme).toBe('dark');
    expect(localStorage.getItem('flight-ops-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles between light and dark modes', () => {
    const service = new ThemeService();
    service.setTheme('light');

    service.toggleTheme();
    expect(service.theme).toBe('dark');

    service.toggleTheme();
    expect(service.theme).toBe('light');
  });
});
