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
    guestName: 'Comtesse Hélène de Valmy',
    guestTitle: 'Membre du Cercle Privé Aura',
    origin: 'Genève, Suisse',
    suiteStayed: 'Suite Impériale Vendôme (245 m²)',
    stayDate: 'Septembre 2026 • 4 Nuits',
    rating: 5,
    headline: '« Une maîtrise rare du silence et de l’attention sur-mesure »',
    comment:
      'Dès l’accueil au pied de l’avion par le chauffeur en Rolls-Royce jusqu’au dîner privé dressé sur notre terrasse face à la Colonne Vendôme, tout respire l’élégance véritable d’une maison particulière.'
  },
  {
    id: 'rev-2',
    guestName: 'Lord Julian & Lady Clara Sterling',
    guestTitle: 'Collectionneurs d’Art',
    origin: 'Londres, Royaume-Uni',
    suiteStayed: 'Penthouse Céleste & Jardin Suspendu (310 m²)',
    stayDate: 'Août 2026 • 6 Nuits',
    rating: 5,
    headline: '« Le bassin chauffé sur les toits au crépuscule est inoubliable »',
    comment:
      'Nous séjournons dans les plus grands palaces européens depuis vingt ans. Le Penthouse Céleste et la discrétion absolue de notre Majordome placent cet établissement au-dessus de tout ce que nous connaissions.'
  },
  {
    id: 'rev-3',
    guestName: 'M. Kenji Takahashi',
    guestTitle: 'Architecte Principal',
    origin: 'Tokyo, Japon',
    suiteStayed: 'Villa Émeraude & Cour Intérieure (220 m²)',
    stayDate: 'Octobre 2026 • 5 Nuits',
    rating: 5,
    headline: '« Une harmonie architecturale et minérale d’une pureté absolue »',
    comment:
      'La lumière traversante de la Villa Émeraude, la noblesse de la pierre et la privatisation nocturne des Thermes de marbre blanc offrent une sérénité que l’on ne trouve nulle part ailleurs en plein cœur de la ville.'
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
        {/* Header & Global Palace Rating */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-luxury-border">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-luxury-gold" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-luxury-gold font-semibold">
                LIVRE D’OR & AVIS RÉSIDENTS VÉRIFIÉS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
              Ce que Confient Nos Hôtes
            </h2>
          </div>

          {/* Verified Score Badge */}
          <div className="flex items-center gap-6 p-4 sm:p-5 editorial-card">
            <div>
              <div className="font-serif text-3xl sm:text-4xl text-luxury-text font-semibold leading-none">
                4.98 <span className="text-lg text-luxury-muted font-normal">/ 5</span>
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
                Excellence Certifiée
              </div>
              <div className="text-luxury-muted">
                Basé sur 420+ séjours vérifiés • Clefs Michelin
              </div>
            </div>
          </div>
        </div>

        {/* Desktop 3-Column Editorial Grid */}
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

        {/* Mobile / Tablet Interactive Review Carousel */}
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
