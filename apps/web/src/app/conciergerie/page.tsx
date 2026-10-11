'use client';

import React, { useState } from 'react';
import { SiteShell } from '@/components/SiteShell';
import { PageHeroBanner } from '@/components/PageHeroBanner';
import {
  useAppDispatch,
  useAppSelector,
  useLazyGetBookingByReferenceQuery,
  setDrawerOpen
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';
import { Search, Car, ShieldCheck, Plane, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function ConciergeriePage() {
  const dispatch = useAppDispatch();
  const { currency } = useAppSelector((state) => state.ui);
  const [referenceInput, setReferenceInput] = useState('AURA-2026-8841');
  const [triggerLookup, { data, isFetching, error }] = useLazyGetBookingByReferenceQuery();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (referenceInput.trim()) {
      triggerLookup(referenceInput.trim());
    }
  };

  return (
    <SiteShell>
      <PageHeroBanner
        kicker="LES CLEFS D’OR • SERVICE SUR-MESURE 24H/24"
        title="Conciergerie Privée & Suivi de Dossier"
        subtitle="Transferts en Rolls-Royce Phantom VIII, accueil au pied de votre jet privé, visites privées de musées après fermeture ou suivi en direct de votre réservation."
        imageUrl="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2000&q=85"
      />

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Live Dossier Lookup */}
          <div className="lg:col-span-6 p-8 sm:p-10 editorial-card space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-luxury-gold block mb-2">
                ACCÈS CONFIDENTIEL RÉSIDENT
              </span>
              <h2 className="font-serif text-3xl text-luxury-text font-normal">
                Consulter Votre Dossier de Séjour
              </h2>
              <p className="text-xs text-luxury-muted mt-1">
                Saisissez votre numéro de référence (exemple de démonstration :{' '}
                <strong className="text-luxury-text">AURA-2026-8841</strong>).
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
                placeholder="Ex: AURA-2026-8841"
                className="flex-1 px-4 py-3 bg-luxury-surface border border-luxury-border text-sm font-mono uppercase text-luxury-text focus:outline-none focus:border-luxury-gold"
              />
              <button
                type="submit"
                disabled={isFetching}
                className="px-6 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Rechercher</span>
              </button>
            </form>

            {Boolean(error) && (
              <div className="p-4 border border-red-500/40 bg-red-500/10 text-xs text-luxury-text">
                Aucune réservation trouvée pour ce numéro. Essayez la référence{' '}
                <strong>AURA-2026-8841</strong>.
              </div>
            )}

            {data?.booking && (
              <div className="p-6 bg-luxury-surface border border-luxury-border space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-luxury-border">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-luxury-muted block">
                      Référence Officielle
                    </span>
                    <span className="font-mono text-base font-bold text-luxury-gold">
                      {data.booking.referenceCode}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/15 text-emerald-500 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {data.booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-luxury-muted block">Résident Principal</span>
                    <span className="text-luxury-text font-medium text-sm">
                      {data.booking.guest.title} {data.booking.guest.firstName}{' '}
                      {data.booking.guest.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-luxury-muted block">Suite Attribuée</span>
                    <span className="text-luxury-text font-medium text-sm">
                      {data.booking.room.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-luxury-muted block">Dates de Séjour</span>
                    <span className="text-luxury-text">
                      Du {data.booking.checkIn} au {data.booking.checkOut} ({data.booking.nights}{' '}
                      nuits)
                    </span>
                  </div>
                  <div>
                    <span className="text-luxury-muted block">Heure d’arrivée prévue</span>
                    <span className="text-luxury-text">
                      {data.booking.guest.arrivalTime || '15:00'}
                    </span>
                  </div>
                </div>

                {data.booking.guest.specialRequests && (
                  <div className="pt-2 border-t border-luxury-border">
                    <span className="text-luxury-muted block mb-1">
                      Instructions transmises au Majordome :
                    </span>
                    <p className="italic text-luxury-text">
                      « {data.booking.guest.specialRequests} »
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-luxury-border flex items-center justify-between">
                  <span className="uppercase tracking-widest text-luxury-muted">
                    Total Séjour Confirmé
                  </span>
                  <span className="font-serif text-2xl text-luxury-gold font-semibold">
                    {formatCurrencyAmount(data.booking.pricing.totalPrice, currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Bespoke Concierge Services */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.26em] text-luxury-gold block">
                LOGISTIQUE & PRIVILÈGES SUR-MESURE
              </span>
              <h3 className="font-serif text-3xl text-luxury-text font-normal">
                Les Attention de Nos Clefs d’Or
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Plane,
                  title: 'Accueil Salon VIP Tarmac',
                  desc: 'Formalités douanières privées au pied de votre avion au Bourget ou Roissy CDG.'
                },
                {
                  icon: Car,
                  title: 'Flotte Rolls-Royce Phantom',
                  desc: 'Chauffeurs en livrée à disposition pour vos déplacements et soirées privées.'
                },
                {
                  icon: ShieldCheck,
                  title: 'Discrétion & Sécurité',
                  desc: 'Entrée souterraine confidentielle et ascenseur privé menant directement aux Penthouses.'
                },
                {
                  icon: Clock,
                  title: 'Majordome Dédié 24h/24',
                  desc: 'Préparation de votre garde-robe, cave sur-mesure et accès culturel hors-horaires.'
                }
              ].map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.title} className="p-6 editorial-card space-y-2.5">
                    <Icon className="w-5 h-5 text-luxury-gold" />
                    <h4 className="font-serif text-xl text-luxury-text">{service.title}</h4>
                    <p className="text-xs text-luxury-muted leading-relaxed">{service.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-luxury-surface border border-luxury-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <p className="text-luxury-text font-semibold uppercase tracking-widest">
                  Ligne Directe Chef Concierge
                </p>
                <p className="text-luxury-muted flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-luxury-gold" />
                  {HOTEL_CONFIG.contact.phone} • {HOTEL_CONFIG.contact.conciergeEmail}
                </p>
              </div>
              <button
                onClick={() => dispatch(setDrawerOpen(true))}
                className="px-5 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-[0.18em] font-medium transition-colors shrink-0"
              >
                Nouvelle Réservation
              </button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
