'use client';

import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setCustomizerOpen,
  setLookupModalOpen,
  setDrawerOpen
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';
import { Navbar } from '@/components/Navbar';
import { HeroBookingBar } from '@/components/HeroBookingBar';
import { SuitesCatalog } from '@/components/SuitesCatalog';
import { ExperiencesSection } from '@/components/ExperiencesSection';
import { BookingCheckoutDrawer } from '@/components/BookingCheckoutDrawer';
import { InteractiveModals } from '@/components/InteractiveModals';
import { Crown, MapPin, Phone, Mail, SlidersHorizontal, Smartphone } from 'lucide-react';

export default function PalaceHomePage() {
  const dispatch = useAppDispatch();
  const { customHotelName, activeTheme } = useAppSelector((state) => state.ui);
  const currentTheme = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main>
        <HeroBookingBar />
        <SuitesCatalog />
        <ExperiencesSection />

        {/* Mobile Companion App & White-Label Architecture Banner */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-luxury-card border border-luxury-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-gold/15 text-luxury-gold text-[11px] uppercase tracking-[0.2em]">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Écosystème Unifié Next.js + React Native + Redux</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-luxury-text">
                Clé Digitale, Majordome Mobile & Personnalisation Instantanée
              </h2>
              <p className="text-sm text-luxury-muted leading-relaxed max-w-2xl">
                Votre réservation effectuée sur le Web est immédiatement synchronisée avec notre
                application mobile <strong>React Native</strong> grâce au store partagé{' '}
                <code className="text-luxury-gold">@hotel/store</code> et à l’API{' '}
                <code className="text-luxury-gold">Express + Prisma PostgreSQL</code>.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => dispatch(setCustomizerOpen(true))}
                  className="px-5 py-3 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-[0.16em] flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Tester le Studio White-Label</span>
                </button>
                <button
                  onClick={() => dispatch(setLookupModalOpen(true))}
                  className="px-5 py-3 rounded-xl border border-white/15 hover:border-luxury-gold text-xs uppercase tracking-[0.16em] text-luxury-text"
                >
                  Tester un Dossier Client (AURA-2026-8841)
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-luxury-surface border border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between text-luxury-gold uppercase tracking-widest text-[10px]">
                <span>Code Privilège Actif</span>
                <span>-10% / -15%</span>
              </div>
              <p className="text-luxury-text font-serif text-xl">
                Utilisez <strong className="text-luxury-gold">PALACE10</strong> ou{' '}
                <strong className="text-luxury-gold">ROYALVIP</strong> dans le configurateur de
                réservation.
              </p>
              <button
                onClick={() => dispatch(setDrawerOpen(true))}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-luxury-gold hover:text-black text-luxury-text font-medium uppercase tracking-wider transition-colors"
              >
                Ouvrir le Configurateur
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Luxury Footer */}
      <footer className="bg-luxury-surface border-t border-luxury-border pt-16 pb-12 text-xs text-luxury-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-luxury-gold flex items-center justify-center text-luxury-gold font-serif text-lg">
                {HOTEL_CONFIG.brand.monogram}
              </div>
              <span className="font-serif text-2xl tracking-[0.18em] text-luxury-text">
                {customHotelName}
              </span>
            </div>
            <p className="text-luxury-muted max-w-md leading-relaxed">
              {currentTheme.tagline}
            </p>
            <p className="text-[11px] text-luxury-gold uppercase tracking-[0.2em]">
              {HOTEL_CONFIG.brand.distinction}
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-luxury-text uppercase tracking-[0.2em] font-semibold mb-3">
              Coordonnées & Accès Privé
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

          <div className="space-y-2.5">
            <h4 className="text-luxury-text uppercase tracking-[0.2em] font-semibold mb-3">
              Horaires & Services
            </h4>
            <p>Arrivée (Check-in) : dès {HOTEL_CONFIG.contact.checkInTime}</p>
            <p>Départ (Check-out) : jusqu’à {HOTEL_CONFIG.contact.checkOutTime}</p>
            <p>Conciergerie Clefs d’Or & Voiturier : 24h/24</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {customHotelName}. Architecture Monorepo (Next.js • React
            Native • Express • Redux Toolkit • Prisma).
          </p>
          <button
            onClick={() => dispatch(setCustomizerOpen(true))}
            className="text-luxury-gold hover:underline uppercase tracking-widest text-[11px]"
          >
            Personnaliser le Thème White-Label
          </button>
        </div>
      </footer>

      {/* Global Overlays */}
      <BookingCheckoutDrawer />
      <InteractiveModals />
    </div>
  );
}
