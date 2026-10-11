'use client';

import React from 'react';
import { SiteShell } from '@/components/SiteShell';
import { PageHeroBanner } from '@/components/PageHeroBanner';
import { SuitesCatalog } from '@/components/SuitesCatalog';
import {
  useAppDispatch,
  useAppSelector,
  setDates,
  setGuests,
  selectBookingNights
} from '@hotel/store';
import { Calendar, Users } from 'lucide-react';

export default function SuitesPage() {
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, adults, children } = useAppSelector((state) => state.booking);
  const nights = useAppSelector(selectBookingNights);

  return (
    <SiteShell>
      <PageHeroBanner
        kicker="COLLECTION D’APPARTEMENTS & HÔTELS PARTICULIERS"
        title="Suites Signature, Penthouses & Villas"
        subtitle="Chaque résidence dispose d’un service de Majordome dédié 24h/24, d’un accueil personnalisé en Rolls-Royce et d’un accès privilégié aux Thermes."
        imageUrl="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=2000&q=85"
      >
        {/* Inline Date & Guest Refinement Bar */}
        <div className="bg-luxury-card border border-luxury-border p-4 sm:p-5 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-luxury-muted mb-1">
                <Calendar className="w-3 h-3 text-luxury-gold" />
                Arrivée
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-luxury-muted mb-1">
                <span>Départ</span>
                <span className="text-luxury-gold font-semibold">{nights} nuit{nights > 1 ? 's' : ''}</span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-luxury-muted mb-1">
                <Users className="w-3 h-3 text-luxury-gold" />
                Résidents ({adults + children})
              </label>
              <div className="flex items-center justify-between px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text">
                <span>{adults} Adulte{adults > 1 ? 's' : ''}</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => dispatch(setGuests({ adults: adults - 1 }))}
                    className="w-5 h-5 border border-luxury-border flex items-center justify-center"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setGuests({ adults: adults + 1 }))}
                    className="w-5 h-5 border border-luxury-border flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHeroBanner>

      <SuitesCatalog />
    </SiteShell>
  );
}
