'use client';

import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

interface GuestReview {
  id: string;
  guestName: string;
  guestTitle: string;
  origin: string;
  suiteStayed: string;
  stayDate: string;
  rating: number;
  headline: string;
  comment: string;
}

const VERIFIED_REVIEWS: GuestReview[] = [
  {
    id: 'rev-1',
    guestName: 'M. Patrice Zinsou',
    guestTitle: 'Directeur Régional • Séjour d’Affaires',
    origin: 'Cotonou / Abidjan',
    suiteStayed: 'Suite Junior Diplomatique Marina',
    stayDate: 'Septembre 2026 • 4 Nuits',
    rating: 5,
    headline: '« Le meilleur standard hôtelier sur le Boulevard de la Marina »',
    comment:
      'Accueil irréprochable dès l’aéroport de Cotonou avec la navette climatisée. Le Wi-Fi fibre est ultra-rapide pour mes visioconférences, et le buffet du petit-déjeuner face à la piscine est digne des meilleurs 5 étoiles internationaux.'
  },
  {
    id: 'rev-2',
    guestName: 'Mme Claire & M. Marc Hountondji',
    guestTitle: 'Séjour en Famille • Diaspora',
    origin: 'Paris / Ouidah',
    suiteStayed: 'Villa & Bungalow Plage (95 m²)',
    stayDate: 'Août 2026 • 6 Nuits',
    rating: 5,
    headline: '« Entre le confort moderne style Novotel et le charme de la Route des Pêches »',
    comment:
      'Nous avons adoré le bungalow familial sous les cocotiers et les grillades de poissons frais et langoustes le soir. Le personnel est aux petits soins et l’excursion organisée vers Ganvié était parfaite.'
  },
  {
    id: 'rev-3',
    guestName: 'Dr. Amadou Diallo',
    guestTitle: 'Consultant International • Conférence Palais des Congrès',
    origin: 'Dakar, Sénégal',
    suiteStayed: 'Chambre Exécutive Vue Océan',
    stayDate: 'Octobre 2026 • 3 Nuits',
    rating: 5,
    headline: '« Emplacement idéal à 5 minutes du Palais des Congrès et de la plage »',
    comment:
      'Chambre très calme, literie excellente et vue directe sur l’Océan Atlantique. La possibilité de régler et réserver facilement en Franc CFA avec facture immédiate facilite énormément les déplacements professionnels au Bénin.'
  }
];

export function GuestTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? VERIFIED_REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === VERIFIED_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-luxury-surface border-b border-luxury-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-14">
        {/* Header & Global Rating */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-luxury-border">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-luxury-gold" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-luxury-gold font-semibold">
                AVIS CLIENTS VÉRIFIÉS • COTONOU & BÉNIN
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
              L’Expérience de Nos Clients
            </h2>
          </div>

          {/* Verified Score Badge */}
          <div className="flex items-center gap-6 p-4 sm:p-5 editorial-card">
            <div>
              <div className="font-serif text-3xl sm:text-4xl text-luxury-text font-semibold leading-none">
                4.9 <span className="text-lg text-luxury-muted font-normal">/ 5</span>
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-luxury-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-luxury-border" />
            <div className="text-xs space-y-0.5">
              <div className="font-semibold text-luxury-text uppercase tracking-wider">
                Référence Hôtelière au Bénin
              </div>
              <div className="text-luxury-muted">
                Basé sur 580+ séjours d’affaires et tourisme à Cotonou
              </div>
            </div>
          </div>
        </div>

        {/* Desktop 3-Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {VERIFIED_REVIEWS.map((review) => (
            <article
              key={review.id}
              className="p-8 editorial-card flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-luxury-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-luxury-gold opacity-40" />
                </div>

                <h3 className="font-serif text-2xl text-luxury-text leading-snug">
                  {review.headline}
                </h3>

                <p className="text-sm text-luxury-muted leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="pt-5 border-t border-luxury-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-luxury-text">
                    {review.guestName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-luxury-gold font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Séjour Vérifié
                  </span>
                </div>
                <p className="text-xs text-luxury-muted">
                  {review.guestTitle} • {review.origin}
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-luxury-gold pt-1">
                  {review.suiteStayed} ({review.stayDate})
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile / Tablet Carousel */}
        <div className="lg:hidden space-y-4">
          {(() => {
            const review = VERIFIED_REVIEWS[activeIndex];
            return (
              <article className="p-6 sm:p-8 editorial-card space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-luxury-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-luxury-muted">
                    0{activeIndex + 1} / 0{VERIFIED_REVIEWS.length}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-luxury-text leading-snug">
                  {review.headline}
                </h3>

                <p className="text-sm text-luxury-muted leading-relaxed">
                  {review.comment}
                </p>

                <div className="pt-4 border-t border-luxury-border space-y-1">
                  <div className="font-serif text-lg font-semibold text-luxury-text">
                    {review.guestName}
                  </div>
                  <div className="text-xs text-luxury-muted">
                    {review.guestTitle} • {review.origin}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-luxury-gold pt-1">
                    {review.suiteStayed}
                  </div>
                </div>
              </article>
            );
          })()}

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handlePrev}
              aria-label="Avis précédent"
              className="w-10 h-10 editorial-card flex items-center justify-center text-luxury-text hover:border-luxury-gold"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Avis suivant"
              className="w-10 h-10 editorial-card flex items-center justify-center text-luxury-text hover:border-luxury-gold"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
