'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useAppDispatch,
  useAppSelector,
  setCurrency,
  toggleColorMode,
  setCustomizerOpen,
  setLookupModalOpen,
  setDrawerOpen,
  selectBookingNights
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';
import { CurrencyCode } from '@hotel/types';
import { Sun, Moon, SlidersHorizontal, Search, Calendar, Phone } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'La Maison' },
  { href: '/suites', label: 'Suites & Villas' },
  { href: '/experiences', label: 'Gastronomie & Spa' },
  { href: '/conciergerie', label: 'Conciergerie' }
];

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { currency, colorMode, activeTheme, customHotelName } = useAppSelector((state) => state.ui);
  const { selectedRoom, selectedAddOns } = useAppSelector((state) => state.booking);
  const nights = useAppSelector(selectBookingNights);
  const currentTheme = HOTEL_CONFIG.themes[activeTheme];

  const currencies: CurrencyCode[] = ['EUR', 'USD', 'CHF'];

  return (
    <header className="sticky top-0 z-40 editorial-nav-glass border-b border-luxury-border transition-colors duration-300">
      {/* Subtle Architectural Top Bar */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 lg:px-10 py-2 text-[10px] tracking-[0.22em] uppercase text-luxury-muted border-b border-luxury-border">
        <div className="flex items-center gap-4">
          <span className="font-medium text-luxury-gold">{HOTEL_CONFIG.brand.distinction}</span>
          <span className="opacity-40">|</span>
          <span>{currentTheme?.locationOverride || `${HOTEL_CONFIG.contact.address}, ${HOTEL_CONFIG.contact.city}`}</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={`tel:${HOTEL_CONFIG.contact.phone}`}
            className="flex items-center gap-1.5 hover:text-luxury-text transition-colors"
          >
            <Phone className="w-3 h-3 text-luxury-gold" />
            <span>{HOTEL_CONFIG.contact.phone}</span>
          </a>
          <button
            onClick={() => dispatch(setLookupModalOpen(true))}
            className="flex items-center gap-1.5 hover:text-luxury-gold transition-colors uppercase tracking-[0.22em]"
          >
            <Search className="w-3 h-3 text-luxury-gold" />
            <span>Dossier Client</span>
          </button>
        </div>
      </div>

      {/* Main Architectural Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 grid grid-cols-2 lg:grid-cols-12 items-center gap-4">
        {/* Left: Real Multi-Page Navigation Links (Desktop) */}
        <nav className="hidden lg:flex lg:col-span-5 items-center gap-7">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  isActive
                    ? 'text-luxury-text font-semibold'
                    : 'text-luxury-muted hover:text-luxury-text'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-luxury-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Center: Editorial Crest & Brand Name */}
        <div className="lg:col-span-3 flex items-center lg:justify-center">
          <Link href="/" className="group text-left lg:text-center">
            <span className="block font-serif text-xl sm:text-2xl tracking-[0.22em] text-luxury-text font-normal leading-none">
              {customHotelName}
            </span>
            <span className="block text-[9px] tracking-[0.32em] uppercase text-luxury-muted mt-1.5">
              PARIS • PLACE VENDÔME
            </span>
          </Link>
        </div>

        {/* Right: Light/Dark Switch, Currency, White-Label & Booking Trigger */}
        <div className="lg:col-span-4 flex items-center justify-end gap-2 sm:gap-3">
          {/* Light / Dark Mode Architectural Toggle */}
          <button
            onClick={() => dispatch(toggleColorMode())}
            title={colorMode === 'light' ? 'Passer en mode Nuit (Obsidienne)' : 'Passer en mode Jour (Albâtre)'}
            aria-label="Basculer le thème Clair / Sombre"
            className="w-9 h-9 rounded-full border border-luxury-border flex items-center justify-center text-luxury-text hover:border-luxury-gold transition-colors bg-luxury-surface/50"
          >
            {colorMode === 'light' ? (
              <Moon className="w-4 h-4 text-luxury-text" />
            ) : (
              <Sun className="w-4 h-4 text-luxury-gold" />
            )}
          </button>

          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center rounded-full border border-luxury-border bg-luxury-surface/50 p-0.5">
            {currencies.map((code) => (
              <button
                key={code}
                onClick={() => dispatch(setCurrency(code))}
                className={`px-2 py-1 text-[10px] tracking-wider font-medium rounded-full transition-all ${
                  currency === code
                    ? 'bg-luxury-text text-luxury-bg font-semibold'
                    : 'text-luxury-muted hover:text-luxury-text'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* White-Label Studio Button */}
          <button
            onClick={() => dispatch(setCustomizerOpen(true))}
            title="Studio White-Label"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-luxury-border hover:border-luxury-gold text-[10px] uppercase tracking-[0.18em] text-luxury-text transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="hidden xl:inline">Style</span>
          </button>

          {/* Direct Booking CTA */}
          <button
            onClick={() => dispatch(setDrawerOpen(true))}
            className="px-4 sm:px-5 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white transition-colors text-[11px] tracking-[0.2em] uppercase font-medium flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Réserver</span>
            {(selectedRoom || selectedAddOns.length > 0) && (
              <span className="px-1.5 py-0.2 text-[9px] bg-luxury-gold text-white font-semibold">
                {nights}N
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
