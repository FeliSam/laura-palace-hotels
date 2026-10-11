'use client';

import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setCurrency,
  setCustomizerOpen,
  setLookupModalOpen,
  setDrawerOpen,
  selectBookingNights
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';
import { CurrencyCode } from '@hotel/types';
import { Crown, SlidersHorizontal, Search, Calendar, Sparkles, Phone } from 'lucide-react';

export function Navbar() {
  const dispatch = useAppDispatch();
  const { currency, activeTheme, customHotelName } = useAppSelector((state) => state.ui);
  const { selectedRoom, selectedAddOns } = useAppSelector((state) => state.booking);
  const nights = useAppSelector(selectBookingNights);
  const currentTheme = HOTEL_CONFIG.themes[activeTheme];

  const currencies: CurrencyCode[] = ['EUR', 'USD', 'CHF'];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 luxury-glass border-b border-luxury-border transition-colors duration-300">
      {/* Top VIP Bar */}
      <div className="hidden md:flex items-center justify-between px-8 py-1.5 text-[11px] tracking-[0.22em] uppercase text-luxury-muted border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-luxury-gold">
            <Crown className="w-3.5 h-3.5" />
            {HOTEL_CONFIG.brand.distinction}
          </span>
          <span>•</span>
          <span>{currentTheme?.locationOverride || `${HOTEL_CONFIG.contact.address}, ${HOTEL_CONFIG.contact.city}`}</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href={`tel:${HOTEL_CONFIG.contact.phone}`}
            className="flex items-center gap-1.5 hover:text-luxury-text transition-colors"
          >
            <Phone className="w-3 h-3 text-luxury-gold" />
            Conciergerie 24/7 : {HOTEL_CONFIG.contact.phone}
          </a>
          <button
            onClick={() => dispatch(setLookupModalOpen(true))}
            className="flex items-center gap-1.5 text-luxury-gold hover:underline"
          >
            <Search className="w-3 h-3" />
            Ma Réservation
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-full border border-luxury-gold/60 flex items-center justify-center bg-luxury-surface group-hover:border-luxury-gold transition-colors">
            <span className="font-serif text-xl font-semibold tracking-widest text-luxury-gold">
              {HOTEL_CONFIG.brand.monogram}
            </span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-2xl tracking-[0.18em] text-luxury-text font-medium">
              {customHotelName}
            </span>
            <span className="block text-[10px] tracking-[0.28em] uppercase text-luxury-muted">
              EST. {HOTEL_CONFIG.brand.establishedYear} • ★★★★★ PALACE
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-luxury-muted">
          <a href="#suites" className="hover:text-luxury-gold transition-colors">
            Suites & Villas
          </a>
          <a href="#experiences" className="hover:text-luxury-gold transition-colors">
            Gastronomie & Spa
          </a>
          <a href="#bespoke" className="hover:text-luxury-gold transition-colors">
            Services Sur-Mesure
          </a>
          <button
            onClick={() => dispatch(setLookupModalOpen(true))}
            className="hover:text-luxury-gold transition-colors uppercase tracking-[0.2em]"
          >
            Suivi Dossier
          </button>
        </nav>

        {/* Actions: Currency, White-Label Customizer & Booking CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center rounded-full bg-luxury-surface/90 border border-luxury-border p-0.5">
            {currencies.map((code) => (
              <button
                key={code}
                onClick={() => dispatch(setCurrency(code))}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                  currency === code
                    ? 'bg-luxury-gold text-black font-semibold'
                    : 'text-luxury-muted hover:text-luxury-text'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* White-Label Live Customizer Trigger */}
          <button
            onClick={() => dispatch(setCustomizerOpen(true))}
            title="Personnaliser le site (White-Label)"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-luxury-border bg-luxury-surface/80 hover:border-luxury-gold text-xs text-luxury-text transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="hidden xl:inline tracking-wider uppercase text-[11px]">
              Personnaliser
            </span>
          </button>

          {/* Direct Booking Drawer Trigger */}
          <button
            onClick={() => dispatch(setDrawerOpen(true))}
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-luxury-gold text-black font-medium text-xs tracking-[0.16em] uppercase hover:opacity-95 transition-all shadow-lg shadow-black/40"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Réserver</span>
            {(selectedRoom || selectedAddOns.length > 0) && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] rounded-full bg-black text-luxury-gold font-bold">
                {nights}N
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
