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
import { Calendar, Users, ArrowRight } from 'lucide-react';

export function HeroBookingBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, adults, children } = useAppSelector((state) => state.booking);
  const { category } = useAppSelector((state) => state.filters);
  const { activeTheme, customHotelName } = useAppSelector((state) => state.ui);
  const nights = useAppSelector(selectBookingNights);

  const currentTheme = HOTEL_CONFIG.themes[activeTheme] || HOTEL_CONFIG.themes['palace-parisien'];

  const handleSearchAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/suites');
  };

  return (
    <section className="relative min-h-[86vh] flex flex-col justify-between overflow-hidden border-b border-luxury-border">
      {/* Full-bleed Architectural Background Image */}
      <div className="absolute inset-0 -z-10 bg-black">
        <img
          src={currentTheme.heroImage}
          alt={customHotelName}
          className="w-full h-full object-cover object-center opacity-85 scale-[1.02] transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
      </div>

      {/* Editorial Headline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full my-auto pt-20 pb-12">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-[1px] bg-[#D4AF6A]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#E5C98B] font-medium">
              {currentTheme.locationOverride || '22 Place Vendôme • Paris'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] leading-[1.04] font-normal tracking-tight text-white">
            {currentTheme.tagline}
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed font-light">
            {HOTEL_CONFIG.brand.storyDescription}
          </p>
        </div>
      </div>

      {/* Refined Architectural Booking Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full pb-10 z-20">
        <form
          onSubmit={handleSearchAvailability}
          className="bg-luxury-card border border-luxury-border shadow-2xl p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Check-in */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-luxury-muted font-medium">
                <Calendar className="w-3 h-3 text-luxury-gold" />
                Arrivée
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-luxury-gold"
              />
            </div>

            {/* Check-out */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-luxury-muted font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-luxury-gold" />
                  Départ
                </span>
                <span className="text-luxury-gold font-semibold">{nights} nuit{nights > 1 ? 's' : ''}</span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-luxury-gold"
              />
            </div>

            {/* Guests */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-luxury-muted font-medium">
                <Users className="w-3 h-3 text-luxury-gold" />
                Résidents
              </label>
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs">
                <span>{adults} Adulte{adults > 1 ? 's' : ''}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => dispatch(setGuests({ adults: adults - 1 }))}
                    className="w-5 h-5 border border-luxury-border hover:border-luxury-gold flex items-center justify-center"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setGuests({ adults: adults + 1 }))}
                    className="w-5 h-5 border border-luxury-border hover:border-luxury-gold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-luxury-muted font-medium">
                Collection
              </label>
              <select
                value={category}
                onChange={(e) => dispatch(setCategoryFilter(e.target.value as SuiteCategory))}
                className="w-full px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text focus:outline-none focus:border-luxury-gold"
              >
                <option value="ALL">Toutes les Suites</option>
                <option value="ROYAL_PENTHOUSE">Penthouses</option>
                <option value="PRIVATE_VILLA">Villas Privées</option>
                <option value="SIGNATURE_SUITE">Suites Signature</option>
              </select>
            </div>

            {/* Submit to /suites page */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-medium text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
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
