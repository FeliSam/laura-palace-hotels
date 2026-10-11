'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import { Calendar, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function HeroBookingBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, adults } = useAppSelector((state) => state.booking);
  const { category } = useAppSelector((state) => state.filters);
  const { activeTheme, customHotelName } = useAppSelector((state) => state.ui);
  const nights = useAppSelector(selectBookingNights);

  const currentTheme = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  const handleSearchAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/suites');
  };

  return (
    <section
      className="relative min-h-[84vh] flex flex-col justify-between overflow-hidden border-b border-luxury-border bg-[#0E0E11]"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(10, 10, 12, 0.90) 0%, rgba(10, 10, 12, 0.45) 55%, rgba(10, 10, 12, 0.55) 100%), url('${currentTheme.heroImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Redundant <img> layer in background for smooth loading & accessibility */}
      <img
        src={currentTheme.heroImage}
        alt={customHotelName}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/35 pointer-events-none" />

      {/* Editorial Headline */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full my-auto pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div className="max-w-3xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-black/55 backdrop-blur-md border border-white/20">
            <span className="w-5 h-[1px] bg-[#D4AF6A]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#E5C98B] font-medium">
              {currentTheme.locationOverride || 'Boulevard de la Marina • Cotonou, Bénin'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[62px] leading-[1.08] font-normal tracking-tight text-white drop-shadow-sm">
            {currentTheme.tagline}
          </h1>

          <p className="text-sm sm:text-base text-white/90 max-w-xl leading-relaxed font-light">
            Chambres climatisées, suites vue océan, gastronomie béninoise et navette Aéroport Cadjèhoun.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-[#E5C98B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tarifs Officiels FCFA
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Conciergerie 24h/24
            </span>
          </div>
        </div>
      </div>

      {/* Architectural Booking Bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full pb-8 sm:pb-10">
        <form
          onSubmit={handleSearchAvailability}
          className="editorial-card shadow-2xl p-3.5 sm:p-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
            {/* Check-in */}
            <div className="lg:col-span-3 space-y-1 min-w-0 max-w-full overflow-hidden">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-luxury-muted font-semibold">
                <Calendar className="w-3 h-3 text-luxury-gold" />
                Arrivée
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                className="w-full max-w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs sm:text-sm text-luxury-text focus:outline-none focus:border-luxury-gold box-border"
              />
            </div>

            {/* Check-out */}
            <div className="lg:col-span-3 space-y-1 min-w-0 max-w-full overflow-hidden">
              <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-luxury-muted font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-luxury-gold" />
                  Départ
                </span>
                <span className="text-luxury-gold font-bold">
                  {nights} nuit{nights > 1 ? 's' : ''}
                </span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                className="w-full max-w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs sm:text-sm text-luxury-text focus:outline-none focus:border-luxury-gold box-border"
              />
            </div>

            {/* Guests */}
            <div className="lg:col-span-2 space-y-1">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-luxury-muted font-semibold">
                <Users className="w-3 h-3 text-luxury-gold" />
                Résidents
              </label>
              <div className="flex items-center justify-between px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text">
                <span className="font-medium">
                  {adults} Adulte{adults > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => dispatch(setGuests({ adults: adults - 1 }))}
                    className="w-5 h-5 border border-luxury-border hover:border-luxury-gold text-luxury-text flex items-center justify-center"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setGuests({ adults: adults + 1 }))}
                    className="w-5 h-5 border border-luxury-border hover:border-luxury-gold text-luxury-text flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="lg:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-muted font-semibold">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => dispatch(setCategoryFilter(e.target.value as SuiteCategory))}
                className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text focus:outline-none focus:border-luxury-gold"
              >
                <option value="ALL">Toutes les Chambres</option>
                <option value="SIGNATURE_SUITE">Classiques</option>
                <option value="ROYAL_PENTHOUSE">Suites Exécutives</option>
                <option value="PRIVATE_VILLA">Villas Océan</option>
              </select>
            </div>

            {/* Submit to /suites page */}
            <div className="sm:col-span-2 lg:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
              >
                <span>Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
