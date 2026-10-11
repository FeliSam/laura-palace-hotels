'use client';

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeHotelStore, AppStore, useAppSelector } from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';

function ThemeCssVariablesInjector({ children }: { children: React.ReactNode }) {
  const { activeTheme, customAccentColor } = useAppSelector((state) => state.ui);
  const palette = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  useEffect(() => {
    const root = document.documentElement;
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
    root.style.setProperty('--border-subtle', palette.colors.borderSubtle);
  }, [palette, customAccentColor]);

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
