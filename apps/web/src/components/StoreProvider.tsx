'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeHotelStore, AppStore, useAppSelector } from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';

function ThemeCssVariablesInjector({ children }: { children: React.ReactNode }) {
  const { activeTheme, customAccentColor, colorMode } = useAppSelector((state) => state.ui);
  const palette = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color-mode', colorMode);

    if (colorMode === 'light') {
      // Natural Alabaster & Warm Linen Light Mode
      root.style.setProperty('--bg-primary', '#F8F5F0');
      root.style.setProperty('--bg-secondary', '#EFECE6');
      root.style.setProperty('--surface-card', '#FFFFFF');
      root.style.setProperty('--text-primary', '#141413');
      root.style.setProperty('--text-secondary', '#5C5852');
      root.style.setProperty(
        '--accent-primary',
        customAccentColor || '#9E7B42'
      );
      root.style.setProperty('--accent-secondary', '#B89456');
      root.style.setProperty('--border-subtle', 'rgba(20, 20, 19, 0.11)');
    } else {
      // Deep Architectural Dark Mode
      root.style.setProperty('--bg-primary', palette.colors.backgroundPrimary);
      root.style.setProperty('--bg-secondary', palette.colors.backgroundSecondary);
      root.style.setProperty('--surface-card', palette.colors.surfaceCard);
      root.style.setProperty('--text-primary', palette.colors.textPrimary);
      root.style.setProperty('--text-secondary', palette.colors.textSecondary);
      root.style.setProperty(
        '--accent-primary',
        customAccentColor || palette.colors.accentPrimary
      );
      root.style.setProperty('--accent-secondary', palette.colors.accentSecondary);
      root.style.setProperty('--border-subtle', 'rgba(245, 242, 235, 0.12)');
    }
  }, [palette, customAccentColor, colorMode]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeHotelStore();
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeCssVariablesInjector>{children}</ThemeCssVariablesInjector>
    </Provider>
  );
}
