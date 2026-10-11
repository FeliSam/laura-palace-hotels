'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import {
  makeHotelStore,
  AppStore,
  useAppSelector,
  useAppDispatch,
  setColorMode
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';

function ThemeCssVariablesInjector({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { activeTheme, customAccentColor, colorMode } = useAppSelector((state) => state.ui);
  const palette = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  // Hydrate saved colorMode on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('aura_color_mode');
      if (saved === 'light' || saved === 'dark') {
        dispatch(setColorMode(saved));
      }
    } catch (_e) {
      // Ignore storage error
    }
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color-mode', colorMode);
    try {
      window.localStorage.setItem('aura_color_mode', colorMode);
    } catch (_e) {
      // Ignore storage error
    }

    if (colorMode === 'light') {
      root.style.setProperty('--bg-primary', '#F8F5F0');
      root.style.setProperty('--bg-secondary', '#EFECE6');
      root.style.setProperty('--surface-card', '#FFFFFF');
      root.style.setProperty('--text-primary', '#141413');
      root.style.setProperty('--text-secondary', '#57534E');
      root.style.setProperty('--accent-primary', customAccentColor || '#9A7432');
      root.style.setProperty('--accent-secondary', '#B89146');
      root.style.setProperty('--border-subtle', 'rgba(20, 20, 19, 0.12)');
      root.style.setProperty('--nav-glass', 'rgba(248, 245, 240, 0.94)');
    } else {
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
      root.style.setProperty('--border-subtle', 'rgba(245, 242, 235, 0.13)');
      root.style.setProperty('--nav-glass', 'rgba(11, 11, 13, 0.92)');
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
