'use client';

import React from 'react';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  setCurrency,
  setCustomizerOpen,
  setLookupModalOpen
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';
import { CurrencyCode } from '@hotel/types';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { BookingCheckoutDrawer } from '@/components/BookingCheckoutDrawer';
import { InteractiveModals } from '@/components/InteractiveModals';
import { MapPin, Phone, Mail, Search, SlidersHorizontal } from 'lucide-react';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { customHotelName, activeTheme, currency } = useAppSelector((state) => state.ui);
  const currentTheme = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  const currencies: Array<{ code: CurrencyCode; label: string }> = [
    { code: 'XOF', label: 'FCFA (XOF)' },
    { code: 'EUR', label: 'EUR (€)' },
    { code: 'USD', label: 'USD ($)' }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-luxury-bg text-luxury-text transition-colors duration-300">
      <Navbar />

      <main className="flex-1">{children}</main>

      {/* Editorial Luxury Footer (holds secondary tools like Currency & White-Label to keep Navbar clean) */}
      <footer className="bg-luxury-surface border-t border-luxury-border pt-16 pb-12 text-xs text-luxury-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-luxury-border">
          <div className="md:col-span-5 space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-[0.18em] text-luxury-text font-semibold block">
                {customHotelName}
              </span>
              <span className="text-[10px] tracking-[0.26em] uppercase text-luxury-gold mt-1 block">
                {HOTEL_CONFIG.brand.distinction}
              </span>
            </div>
            <p className="text-luxury-muted max-w-sm leading-relaxed">
              {currentTheme.tagline}
            </p>

            {/* Currency Switcher (FCFA default) */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-luxury-muted mr-1">
                Devise d’affichage :
              </span>
              {currencies.map((item) => (
                <button
                  key={item.code}
                  onClick={() => dispatch(setCurrency(item.code))}
                  className={`px-3 py-1 text-[11px] border transition-colors ${
                    currency === item.code
                      ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                      : 'bg-luxury-card text-luxury-muted border-luxury-border hover:text-luxury-text'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-luxury-text uppercase tracking-[0.22em] text-[10px] font-semibold mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-luxury-gold transition-colors">
                  Accueil & Présentation
                </Link>
              </li>
              <li>
                <Link href="/suites" className="hover:text-luxury-gold transition-colors">
                  Chambres, Suites & Bungalows
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-luxury-gold transition-colors">
                  Restaurant, Piscine & Spa
                </Link>
              </li>
              <li>
                <Link href="/conciergerie" className="hover:text-luxury-gold transition-colors">
                  Navette Aéroport & Excursions
                </Link>
              </li>
              <li>
                <button
                  onClick={() => dispatch(setLookupModalOpen(true))}
                  className="text-luxury-gold hover:underline flex items-center gap-1.5 pt-1"
                >
                  <Search className="w-3 h-3" />
                  <span>Retrouver ma réservation</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-luxury-text uppercase tracking-[0.22em] text-[10px] font-semibold mb-3">
              Coordonnées • Cotonou, Bénin
            </h4>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
              <span>{currentTheme.locationOverride || HOTEL_CONFIG.contact.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
              <span>{HOTEL_CONFIG.contact.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
              <span>{HOTEL_CONFIG.contact.conciergeEmail}</span>
            </p>
            <p className="text-[11px] text-luxury-muted pt-2">
              Paiements acceptés : Franc CFA (Espèces), Mobile Money (MTN MoMo / Moov Money), Cartes Visa & Mastercard.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px]">
            © {new Date().getFullYear()} {customHotelName} — République du Bénin. Tous droits réservés.
          </p>
          <button
            onClick={() => dispatch(setCustomizerOpen(true))}
            className="text-luxury-gold hover:underline uppercase tracking-[0.18em] text-[10px] flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Personnaliser l’Hôtel (Cotonou / Ouidah / Pendjari)</span>
          </button>
        </div>
      </footer>

      <MobileBottomNav />
      <BookingCheckoutDrawer />
      <InteractiveModals />
    </div>
  );
}
