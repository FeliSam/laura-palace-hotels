'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  useGetRoomBySlugQuery,
  useGetAddOnsQuery,
  selectRoomForBooking,
  setDates,
  setGuests,
  toggleAddOn,
  selectBookingNights
} from '@hotel/store';
import { formatCurrencyAmount, HOTEL_CONFIG } from '@hotel/config';
import {
  ArrowLeft,
  Maximize2,
  Users,
  BedDouble,
  Building2,
  Eye,
  CheckCircle2,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export function SuiteDetailClient({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetRoomBySlugQuery(slug);
  const { data: addOnsData } = useGetAddOnsQuery();
  const { currency, customHotelName } = useAppSelector((state) => state.ui);
  const { checkIn, checkOut, adults, children, selectedAddOns } = useAppSelector(
    (state) => state.booking
  );
  const nights = useAppSelector(selectBookingNights);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-8">
        <div className="h-[460px] bg-luxury-surface animate-pulse border border-luxury-border" />
      </section>
    );
  }

  const room = data;
  const addOns = addOnsData?.addOns || [];

  if (!room) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-serif text-4xl text-luxury-text">Chambre ou Suite introuvable</h1>
        <p className="text-sm text-luxury-muted">
          Cette référence d’hébergement n’est plus disponible au catalogue.
        </p>
        <Link
          href="/suites"
          className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-text text-luxury-bg text-xs uppercase tracking-widest font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue des Chambres</span>
        </Link>
      </section>
    );
  }

  const images = room.gallery && room.gallery.length > 0 ? room.gallery : [room.heroImage];
  const currentImg = images[activeImageIndex % images.length] || room.heroImage;

  const roomSubtotal = room.pricePerNight * nights;
  const addOnsTotal = selectedAddOns.reduce((acc, item) => acc + item.price, 0);
  const taxes = Math.round(
    ((roomSubtotal + addOnsTotal) * HOTEL_CONFIG.pricing.taxRatePercent) / 100
  );
  const estimatedTotal = roomSubtotal + addOnsTotal + taxes;

  const handleBookThisRoom = () => {
    dispatch(selectRoomForBooking({ room, openDrawer: true }));
  };

  return (
    <article className="pb-24">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="bg-luxury-surface border-b border-luxury-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/suites"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-luxury-muted hover:text-luxury-gold font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-luxury-gold" />
            <span>Retour à toutes les Chambres & Suites</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-luxury-muted">
            <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
            <span>{customHotelName} • Cotonou / Ouidah, République du Bénin</span>
          </div>
        </div>
      </div>

      {/* Main Title & Price Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold text-[10px] uppercase tracking-[0.22em] font-semibold">
              {room.category}
            </span>
            <span className="text-xs text-luxury-muted uppercase tracking-widest">
              {room.floorLevel} • {room.viewLabel}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-luxury-text font-normal leading-tight">
            {room.name}
          </h1>
          <p className="text-sm sm:text-base text-luxury-muted leading-relaxed">
            {room.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-6 p-5 editorial-card shrink-0">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-luxury-muted">
              Tarif Officiel par Nuit
            </span>
            <span className="font-serif text-2xl sm:text-3xl text-luxury-gold font-semibold">
              {formatCurrencyAmount(room.pricePerNight, currency)}
            </span>
          </div>
          <button
            onClick={handleBookThisRoom}
            className="px-6 py-3.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors"
          >
            Réserver cette Chambre
          </button>
        </div>
      </header>

      {/* Multi-Image Interactive Gallery (Hero + Bento Previews + Thumbnails) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-14 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Active Large Image Viewer */}
          <div className="lg:col-span-8 relative h-[360px] sm:h-[480px] overflow-hidden bg-black border border-luxury-border group">
            <img
              src={currentImg}
              alt={`${room.name} - Vue ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

            {/* Prev / Next Controls */}
            <button
              type="button"
              onClick={() =>
                setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)
              }
              aria-label="Photo précédente"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-luxury-gold text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
              aria-label="Photo suivante"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-luxury-gold text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-white/15 uppercase tracking-widest text-[10px]">
                Photo {activeImageIndex + 1} sur {images.length} — {room.name}
              </span>
              <span className="hidden sm:inline-block px-3 py-1 bg-black/70 backdrop-blur-md text-[11px] text-amber-300">
                Cliquez sur les vignettes pour inspecter chaque angle
              </span>
            </div>
          </div>

          {/* Side Grid of 4 Auxiliary Views */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 h-full">
            {images.slice(0, 4).map((imgUrl, idx) => {
              const isCurrent = activeImageIndex === idx;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-[170px] lg:h-[232px] overflow-hidden border transition-all ${
                    isCurrent
                      ? 'border-luxury-gold ring-2 ring-luxury-gold'
                      : 'border-luxury-border opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${room.name} vignette ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono">
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Complete Horizontal Thumbnail Strip (All 5+ Photos) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((imgUrl, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-28 h-18 shrink-0 overflow-hidden border transition-all ${
                activeImageIndex === idx
                  ? 'border-luxury-gold ring-2 ring-luxury-gold scale-[1.02]'
                  : 'border-luxury-border opacity-65 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${room.name} miniature ${idx + 1}`}
                className="w-full h-16 object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Two-Column Detailed Specs & Dedicated Room Configurator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 7 Columns: Architectural Specs, Description, Amenities */}
        <div className="lg:col-span-7 space-y-10">
          {/* Key Architectural Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-luxury-surface border border-luxury-border">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-muted flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-luxury-gold" />
                Superficie
              </span>
              <p className="font-serif text-2xl text-luxury-text font-semibold">
                {room.sizeSqm} m²
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-muted flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-luxury-gold" />
                Capacité Max
              </span>
              <p className="font-serif text-2xl text-luxury-text font-semibold">
                {room.maxGuests} Résidents
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-muted flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-luxury-gold" />
                Literie
              </span>
              <p className="text-xs font-semibold text-luxury-text leading-snug">
                {room.bedConfiguration}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-muted flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-luxury-gold" />
                Panorama
              </span>
              <p className="text-xs font-semibold text-luxury-text leading-snug">
                {room.viewLabel}
              </p>
            </div>
          </div>

          {/* Full Editorial Description */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-luxury-text">
              Présentation & Architecture Intérieure
            </h2>
            <p className="text-sm sm:text-base text-luxury-muted leading-relaxed">
              {room.description}
            </p>
            <p className="text-sm text-luxury-muted leading-relaxed">
              Conçue selon les standards internationaux 5 étoiles du Bénin (Boulevard de la
              Marina & Route des Pêches), cette unité dispose d’une insonorisation acoustique
              renforcée, d’une climatisation individuelle silencieuse et d’un service d’étage
              disponible 24h/24.
            </p>
          </div>

          {/* Signature Highlights */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-luxury-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span>Points Forts Exclusifs</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {room.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="p-4 editorial-card border-l-2 border-l-luxury-gold space-y-1"
                >
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Privilège Inclus
                  </span>
                  <p className="text-sm font-medium text-luxury-text">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Amenities List */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-luxury-text">
              Équipements & Prestations de la Chambre
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="p-3.5 bg-luxury-surface border border-luxury-border flex items-center gap-3 text-xs text-luxury-text"
                >
                  <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
                  <span>{amenity.label}</span>
                </div>
              ))}
              <div className="p-3.5 bg-luxury-surface border border-luxury-border flex items-center gap-3 text-xs text-luxury-text">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Paiement Mobile Money, Visa, Mastercard ou Espèces CFA</span>
              </div>
              <div className="p-3.5 bg-luxury-surface border border-luxury-border flex items-center gap-3 text-xs text-luxury-text">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Petit-déjeuner buffet continental & béninois disponible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Sticky Direct Booking Card for THIS Room Only */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 p-6 sm:p-8 editorial-card border-2 border-luxury-gold/40 space-y-6 shadow-xl">
            <div className="pb-4 border-b border-luxury-border flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold block">
                  RÉSERVATION DIRECTE GARANTIE
                </span>
                <h3 className="font-serif text-2xl text-luxury-text mt-0.5">{room.name}</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">
                Disponible
              </span>
            </div>

            {/* Dates Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-1">
                  Arrivée (Check-in)
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-1">
                  Départ ({nights} nuit{nights > 1 ? 's' : ''})
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-1">
                  Adultes (Max {room.maxGuests})
                </label>
                <select
                  value={adults}
                  onChange={(e) =>
                    dispatch(setGuests({ adults: Number(e.target.value), children }))
                  }
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                >
                  {[1, 2, 3, 4, 5, 6]
                    .filter((n) => n <= room.maxGuests)
                    .map((n) => (
                      <option key={n} value={n}>
                        {n} Adulte{n > 1 ? 's' : ''}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-1">
                  Enfants
                </label>
                <select
                  value={children}
                  onChange={(e) =>
                    dispatch(setGuests({ adults, children: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                >
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n}>
                      {n} Enfant{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Add-ons Selector */}
            {addOns.length > 0 && (
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                  Options & Services Bénin (Facultatif)
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {addOns.map((addon) => {
                    const active = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => dispatch(toggleAddOn(addon))}
                        className={`w-full p-2.5 text-left border text-xs flex items-center justify-between transition-all ${
                          active
                            ? 'bg-luxury-card border-luxury-gold text-luxury-text font-medium'
                            : 'bg-luxury-surface border-luxury-border text-luxury-muted hover:text-luxury-text'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {active ? '✓ ' : '+ '}
                          {addon.title}
                        </span>
                        <span className="text-luxury-gold font-semibold shrink-0">
                          {formatCurrencyAmount(addon.price, currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Summary for this Specific Room */}
            <div className="p-4 bg-luxury-surface border border-luxury-border space-y-2 text-xs">
              <div className="flex justify-between text-luxury-muted">
                <span>
                  {formatCurrencyAmount(room.pricePerNight, currency)} × {nights} nuit
                  {nights > 1 ? 's' : ''}
                </span>
                <span className="text-luxury-text font-medium">
                  {formatCurrencyAmount(roomSubtotal, currency)}
                </span>
              </div>
              {addOnsTotal > 0 && (
                <div className="flex justify-between text-luxury-muted">
                  <span>Options sélectionnées ({selectedAddOns.length})</span>
                  <span className="text-luxury-text font-medium">
                    +{formatCurrencyAmount(addOnsTotal, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-luxury-muted">
                <span>Taxes & Services ({HOTEL_CONFIG.pricing.taxRatePercent}%)</span>
                <span>{formatCurrencyAmount(taxes, currency)}</span>
              </div>
              <div className="pt-2 border-t border-luxury-border flex justify-between items-baseline">
                <span className="uppercase tracking-widest text-luxury-text font-semibold">
                  Total Estimé TTC
                </span>
                <span className="font-serif text-2xl text-luxury-gold font-semibold">
                  {formatCurrencyAmount(estimatedTotal, currency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookThisRoom}
              className="w-full py-4 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <Calendar className="w-4 h-4 text-luxury-gold" />
              <span>Finaliser la Réservation de cette Chambre</span>
            </button>

            <p className="text-[11px] text-luxury-muted text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-luxury-gold shrink-0" />
              <span>Aucun débit immédiat • Confirmation officielle instantanée</span>
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
