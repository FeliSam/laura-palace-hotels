'use client';

import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
  useGetAddOnsQuery,
  toggleAddOn,
  setDrawerOpen
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';
import { Check, Plus, Clock, Award } from 'lucide-react';

export function ExperiencesSection() {
  const dispatch = useAppDispatch();
  const { data } = useGetAddOnsQuery();
  const { selectedAddOns } = useAppSelector((state) => state.booking);
  const { currency } = useAppSelector((state) => state.ui);

  const addOns = data?.addOns || [];

  return (
    <section id="experiences" className="py-24 bg-luxury-bg border-y border-luxury-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-24">
        {/* Part 1: Signature Palace Pillars */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.28em] text-luxury-gold font-semibold block mb-3">
              ART DE VIVRE & HAUTE GASTRONOMIE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
              Des Émotions Taillées sur Mesure
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {HOTEL_CONFIG.experiencesShowcase.map((exp) => (
              <div
                key={exp.id}
                className="editorial-card overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-black">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 px-3 py-1 bg-black/75 text-[10px] uppercase tracking-[0.18em] text-[#E5C98B] border border-white/15">
                      {exp.highlight}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold block">
                      {exp.kicker}
                    </span>
                    <h3 className="font-serif text-2xl text-luxury-text">{exp.title}</h3>
                    <p className="text-sm text-luxury-muted leading-relaxed">{exp.description}</p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-luxury-border bg-luxury-surface/50 flex items-center gap-2 text-xs text-luxury-muted">
                  <Clock className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                  <span>{exp.schedule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: Interactive Bespoke Add-ons (Connected to Redux Booking Cart) */}
        <div id="bespoke">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.28em] text-luxury-gold font-semibold block mb-2">
                CONCIERGERIE PRIVÉE • PERSONNALISEZ VOTRE SÉJOUR
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-luxury-text">
                Ajoutez des Privilèges Exclusifs à Votre Réservation
              </h3>
            </div>
            <button
              onClick={() => dispatch(setDrawerOpen(true))}
              className="self-start md:self-auto px-5 py-2.5 border border-luxury-gold text-luxury-text hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.18em] font-medium transition-all"
            >
              Voir mon panier de séjour ({selectedAddOns.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon) => {
              const isAdded = selectedAddOns.some((a) => a.id === addon.id);
              const pricingLabel =
                addon.pricingType === 'PER_GUEST'
                  ? '/ résident'
                  : addon.pricingType === 'PER_NIGHT'
                  ? '/ nuit'
                  : '/ séjour';

              return (
                <div
                  key={addon.id}
                  className={`editorial-card overflow-hidden flex flex-col justify-between ${
                    isAdded ? 'ring-2 ring-luxury-gold' : ''
                  }`}
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img
                        src={addon.image}
                        alt={addon.title}
                        className="w-full h-full object-cover"
                      />
                      {addon.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 text-[#E5C98B] text-[10px] uppercase tracking-widest flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {addon.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-2.5">
                      <h4 className="font-serif text-xl text-luxury-text leading-snug">
                        {addon.title}
                      </h4>
                      <p className="text-xs text-luxury-muted leading-relaxed">
                        {addon.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-luxury-border bg-luxury-surface/40 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-serif text-lg text-luxury-gold font-semibold">
                        {formatCurrencyAmount(addon.price, currency)}
                      </span>
                      <span className="text-[11px] text-luxury-muted ml-1">{pricingLabel}</span>
                    </div>

                    <button
                      onClick={() => dispatch(toggleAddOn(addon))}
                      className={`px-3.5 py-2 text-xs font-medium flex items-center gap-1.5 transition-all border ${
                        isAdded
                          ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                          : 'bg-luxury-surface text-luxury-text hover:border-luxury-gold border-luxury-border'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Inclus</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>Ajouter</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
