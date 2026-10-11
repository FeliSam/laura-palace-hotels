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
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 border-b border-luxury-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-luxury-gold" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-luxury-gold font-semibold">
                PATRIMOINE & ARCHITECTURE DEPUIS {HOTEL_CONFIG.brand.establishedYear}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal leading-[1.12]">
              {HOTEL_CONFIG.brand.storyTitle}
            </h2>

            <p className="text-sm sm:text-base text-luxury-muted leading-relaxed">
              Pensé comme une résidence particulière plutôt qu’un hôtel traditionnel,{' '}
              <strong className="text-luxury-text font-semibold">{customHotelName}</strong> cultive la
              rareté du calme, la justesse des proportions et l’art du service invisible.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-luxury-border">
              {HOTEL_CONFIG.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-3xl text-luxury-text font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-12 gap-4">
            <div className="col-span-7 overflow-hidden border border-luxury-border bg-black">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85"
                alt="Salon Privé"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between gap-4">
              <div className="overflow-hidden border border-luxury-border flex-1 bg-black">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85"
                  alt="Thermes de Marbre"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 bg-luxury-surface border border-luxury-border space-y-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold block">
                  DISTINCTION PALACE
                </span>
                <p className="font-serif text-lg text-luxury-text leading-snug">
                  Service Majordome dédié 24h/24 & Flotte Rolls-Royce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Suites Preview + Link to Dedicated /suites Page */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.28em] text-luxury-gold font-semibold block mb-2">
            SÉLECTION D’APPARTEMENTS PRIVÉS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
            Suites Signature, Penthouses & Villas
          </h2>
        </div>

        <Link
          href="/suites"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-luxury-text hover:text-luxury-gold border-b border-luxury-text pb-1 font-medium transition-colors"
        >
          <span>Découvrir toute la collection (6 Résidences)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <SuitesCatalog limit={4} />

      {/* 4. Full-Bleed Atmospheric Banner for Gastronomy & Spa Page (No -z-10 clipping) */}
      <section
        className="relative py-28 overflow-hidden border-y border-luxury-border bg-[#0E0E11]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10, 10, 12, 0.90) 0%, rgba(10, 10, 12, 0.65) 55%, rgba(10, 10, 12, 0.35) 100%), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"
          alt="Gastronomie Étoilée"
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-white">
          <div className="max-w-2xl space-y-6">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#E5C98B] font-medium block">
              TABLE 3★ MICHELIN & THERMES DE 1 800 M²
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight text-white">
              L’Orangerie Céleste & Le Sanctuaire Minéral
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light">
              Découvrez notre table triplement étoilée par le Chef Édouard Valmont ainsi que nos
              thermes de marbre blanc privatisables à la tombée de la nuit.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/experiences"
                className="px-6 py-3.5 bg-white text-black hover:bg-[#C5A059] hover:text-white text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors inline-flex items-center gap-2"
              >
                <span>Explorer la Gastronomie & le Spa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/conciergerie"
                className="px-6 py-3.5 bg-black/50 border border-white/50 text-white hover:border-white text-[11px] uppercase tracking-[0.2em] transition-colors"
              >
                Contacter la Conciergerie Clefs d’Or
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Verified Guest Reviews & Livre d'Or */}
      <GuestTestimonials />

      {/* 6. White-Label & Light/Dark Architecture Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="p-8 sm:p-12 editorial-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.26em] text-luxury-gold font-semibold">
              DIRECTION ARTISTIQUE MODULABLE • LIGHT & DARK MODE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-luxury-text">
              Personnalisez l’identité de l’établissement en temps réel
            </h3>
            <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
              Basculez entre le mode <strong className="text-luxury-text">Jour (Albâtre & Lin)</strong> et le mode{' '}
              <strong className="text-luxury-text">Nuit (Obsidienne)</strong> via le bouton de la barre de navigation, ou ouvrez le Studio
              White-Label pour adapter l’identité de votre hôtel.
            </p>
          </div>

          <button
            onClick={() => dispatch(setCustomizerOpen(true))}
            className="px-6 py-3.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors flex items-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Ouvrir le Studio White-Label</span>
          </button>
        </div>
      </section>
    </SiteShell>
  );
}
