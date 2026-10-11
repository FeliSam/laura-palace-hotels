'use client';

import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setDates,
  setGuests,
  setCategoryFilter,
  selectBookingNights
} from '@hotel/store';
import { HOTEL_CONFIG } from '@hotel/config';
import { SuiteCategory } from '@hotel/types';
import { Calendar, Users, Sparkles, ArrowDownRight, ShieldCheck, Compass } from 'lucide-react';

export function HeroBookingBar() {
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, adults, children } = useAppSelector((state) => state.booking);
  const { category } = useAppSelector((state) => state.filters);
  const { activeTheme, customHotelName } = useAppSelector((state) => state.ui);
  const nights = useAppSelector(selectBookingNights);

  const currentTheme = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  const handleScrollToSuites = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('suites');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Background Hero Image with Cinematic Gradient */}
      <div className="absolute inset-0 -z-10">
        <img
          src={currentTheme.heroImage}
          alt={customHotelName}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[var(--bg-primary)]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/80" />
      </div>

      {/* Main Editorial Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full my-auto pt-8 pb-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full luxury-glass text-luxury-gold text-xs tracking-[0.24em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Réservation Directe Officielle • Privilèges Inclus</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.06] font-normal tracking-tight text-white">
            {currentTheme.tagline}
          </h1>

          <p className="text-base sm:text-lg text-luxury-muted max-w-2xl leading-relaxed font-light">
            {HOTEL_CONFIG.brand.storyDescription}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs tracking-[0.18em] uppercase text-luxury-text/90">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-luxury-gold" />
              Meilleur Tarif Garanti & Surclassement Prioritaire
            </span>
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-luxury-gold" />
              Accueil Majordome & Check-in Flexible
            </span>
          </div>
        </div>
      </div>

      {/* Floating Interactive Booking Engine Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full z-20">
        <form
          onSubmit={handleScrollToSuites}
          className="luxury-glass rounded-2xl p-4 sm:p-6 shadow-2xl border border-luxury-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Check-in Date */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-luxury-gold">
                <Calendar className="w-3.5 h-3.5" />
                Arrivée (Check-in)
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface/90 border border-white/10 text-sm text-luxury-text focus:outline-none focus:border-luxury-gold"
              />
            </div>

            {/* Check-out Date */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-luxury-gold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Départ (Check-out)
                </span>
                <span className="text-luxury-text font-semibold">{nights} nuit{nights > 1 ? 's' : ''}</span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface/90 border border-white/10 text-sm text-luxury-text focus:outline-none focus:border-luxury-gold"
              />
            </div>

            {/* Guests Counter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-luxury-gold">
                <Users className="w-3.5 h-3.5" />
                Résidents ({adults} Ad. {children > 0 ? `+ ${children} Enf.` : ''})
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-luxury-surface/90 border border-white/10 text-xs">
                  <span className="text-luxury-muted">Adultes</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(setGuests({ adults: adults - 1 }))}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-luxury-gold hover:text-black flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-semibold">{adults}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(setGuests({ adults: adults + 1 }))}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-luxury-gold hover:text-black flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-luxury-surface/90 border border-white/10 text-xs">
                  <span className="text-luxury-muted">Enfants</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch(setGuests({ children: children - 1 }))}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-luxury-gold hover:text-black flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-semibold">{children}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(setGuests({ children: children + 1 }))}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-luxury-gold hover:text-black flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Preference */}
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-[0.2em] text-luxury-gold">
                Collection
              </label>
              <select
                value={category}
                onChange={(e) => dispatch(setCategoryFilter(e.target.value as SuiteCategory))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface/90 border border-white/10 text-sm text-luxury-text focus:outline-none focus:border-luxury-gold"
              >
                <option value="ALL">Toutes les Suites & Villas</option>
                <option value="SIGNATURE_SUITE">Suites Signature</option>
                <option value="ROYAL_PENTHOUSE">Penthouses Royaux</option>
                <option value="PRIVATE_VILLA">Villas & Hôtels Particuliers</option>
              </select>
            </div>

            {/* Submit / Check Availability */}
            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-[0.18em] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Vérifier Disponibilités</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Key Palace Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          {HOTEL_CONFIG.stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="font-serif text-2xl sm:text-3xl text-luxury-gold font-medium">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-luxury-muted mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
