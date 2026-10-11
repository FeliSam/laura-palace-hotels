'use client';

import React from 'react';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  setCustomizerOpen
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';
import { SiteShell } from '@/components/SiteShell';
import { HeroBookingBar } from '@/components/HeroBookingBar';
import { SuitesCatalog } from '@/components/SuitesCatalog';
import { GuestTestimonials } from '@/components/GuestTestimonials';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';

export default function PalaceHomePage() {
  const dispatch = useAppDispatch();
  const { customHotelName } = useAppSelector((state) => state.ui);

  return (
    <SiteShell>
      {/* 1. Full-Bleed Architectural Hero & Booking Engine */}
      <HeroBookingBar />

      {/* 2. Editorial Asymmetric Manifesto ("La Maison") */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 border-b border-luxury-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-luxury-gold" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-luxury-gold font-semibold">
                HÔTELLERIE INTERNATIONALE • COTONOU
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl text-luxury-text font-normal leading-tight">
              Confort international et hospitalité béninoise
            </h2>

            <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
              Situé sur le Boulevard de la Marina, <strong className="text-luxury-text">{customHotelName}</strong> accueille vos séjours d’affaires et de détente avec piscine lagon, Wi-Fi fibre et navette aéroport.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-luxury-border">
              {HOTEL_CONFIG.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl sm:text-3xl text-luxury-text font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-luxury-muted mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-12 gap-3 sm:gap-4">
            <div className="col-span-7 overflow-hidden border border-luxury-border bg-black">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85"
                alt="Salon Privé"
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
              <div className="overflow-hidden border border-luxury-border flex-1 bg-black">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85"
                  alt="Piscine & Détente"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 sm:p-4 bg-luxury-surface border border-luxury-border space-y-1">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold block">
                  SERVICE 24H/24
                </span>
                <p className="font-serif text-sm sm:text-base text-luxury-text leading-snug">
                  Navette Aéroport Cadjèhoun & Conciergerie dédiée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Suites Preview + Link to Dedicated /suites Page */}
      <div className="pt-12 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-luxury-gold font-semibold block mb-1">
            CHAMBRES & SUITES EN FCFA
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-luxury-text font-normal">
            Nos Chambres, Suites & Villas
          </h2>
        </div>

        <Link
          href="/suites"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-luxury-text hover:text-luxury-gold border-b border-luxury-text pb-1 font-medium transition-colors self-start sm:self-auto"
        >
          <span>Tout voir (6 Chambres)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <SuitesCatalog limit={4} />

      {/* 4. Full-Bleed Atmospheric Banner for Gastronomy & Spa Page */}
      <section
        className="relative py-16 sm:py-24 overflow-hidden border-y border-luxury-border bg-[#0E0E11]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10, 10, 12, 0.90) 0%, rgba(10, 10, 12, 0.65) 55%, rgba(10, 10, 12, 0.35) 100%), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"
          alt="Restauration & Mets Africains"
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-white">
          <div className="max-w-xl space-y-4">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#E5C98B] font-medium block">
              GASTRONOMIE BÉNINOISE & GRILLADES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-white">
              Saveurs du Bénin & Restaurant Le Nokoué
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
              Dégustez l’Amiwo au poulet bicyclette, l’Igname pilée, le Poisson braisé de Cotonou et nos buffets internationaux.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/experiences"
                className="px-5 py-3 bg-white text-black hover:bg-[#C5A059] hover:text-white text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors inline-flex items-center gap-2"
              >
                <span>Carte & Restauration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/conciergerie"
                className="px-5 py-3 bg-black/50 border border-white/50 text-white hover:border-white text-[11px] uppercase tracking-[0.18em] transition-colors"
              >
                Conciergerie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Verified Guest Reviews & Livre d'Or */}
      <GuestTestimonials />

      {/* 6. White-Label & Light/Dark Architecture Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="p-5 sm:p-8 editorial-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold">
              STUDIO PERSONNALISATION • CLAIR & SOMBRE
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-luxury-text">
              Adaptez le thème et l’enseigne en temps réel
            </h3>
            <p className="text-xs text-luxury-muted">
              Basculez entre les ambiances d’hôtels du Bénin ou personnalisez le nom de l’établissement.
            </p>
          </div>

          <button
            onClick={() => dispatch(setCustomizerOpen(true))}
            className="w-full sm:w-auto px-5 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Studio White-Label</span>
          </button>
        </div>
      </section>
    </SiteShell>
  );
}
