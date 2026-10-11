'use client';

import React from 'react';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  setCustomizerOpen
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { BookingCheckoutDrawer } from '@/components/BookingCheckoutDrawer';
import { InteractiveModals } from '@/components/InteractiveModals';
import { MapPin, Phone, Mail } from 'lucide-react';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { customHotelName, activeTheme } = useAppSelector((state) => state.ui);
  const currentTheme = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-luxury-bg text-luxury-text transition-colors duration-300">
      <Navbar />

      <main className="flex-1">{children}</main>

      {/* Editorial Luxury Footer */}
      <footer className="bg-luxury-surface border-t border-luxury-border pt-16 pb-12 text-xs text-luxury-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-luxury-border">
          <div className="md:col-span-5 space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-[0.22em] text-luxury-text block">
                {customHotelName}
              </span>
              <span className="text-[10px] tracking-[0.28em] uppercase text-luxury-gold mt-1 block">
                {HOTEL_CONFIG.brand.distinction}
              </span>
            </div>
            <p className="text-luxury-muted max-w-sm leading-relaxed">
              {currentTheme.tagline}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-luxury-text uppercase tracking-[0.22em] text-[10px] font-semibold mb-3">
              Navigation Officielle
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-luxury-gold transition-colors">
                  La Maison & Architecture
                </Link>
              </li>
              <li>
                <Link href="/suites" className="hover:text-luxury-gold transition-colors">
                  Collection Suites & Villas
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-luxury-gold transition-colors">
                  Haute Gastronomie & Thermes
                </Link>
              </li>
              <li>
                <Link href="/conciergerie" className="hover:text-luxury-gold transition-colors">
                  Conciergerie Clefs d’Or & Accès
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-luxury-text uppercase tracking-[0.22em] text-[10px] font-semibold mb-3">
              Réception & Conciergerie Privée
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px]">
            © {new Date().getFullYear()} {customHotelName}. Tous droits réservés.
          </p>
          <button
            onClick={() => dispatch(setCustomizerOpen(true))}
            className="text-luxury-gold hover:underline uppercase tracking-[0.2em] text-[10px]"
          >
            Studio de Personnalisation White-Label
          </button>
        </div>
      </footer>

      <MobileBottomNav />
      <BookingCheckoutDrawer />
      <InteractiveModals />
    </div>
  );
}
