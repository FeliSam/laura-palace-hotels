'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  useGetRoomBySlugQuery,
  useGetAddOnsQuery,
  useGetReviewsQuery,
  useAddRoomReviewMutation,
  selectRoomForBooking,
  setDates,
  setGuests,
  toggleAddOn,
  selectBookingNights
} from '@hotel/store';
import { formatCurrencyAmount, HOTEL_CONFIG, STATIC_SUITES } from '@hotel/config';
import {
  ArrowLeft,
  Maximize2,
  Users,
  BedDouble,
  Eye,
  CheckCircle2,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Star,
  Camera,
  Plus,
  X,
  Send
} from 'lucide-react';

export function SuiteDetailClient({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { data } = useGetRoomBySlugQuery(slug);
  const { data: addOnsData } = useGetAddOnsQuery();
  const { data: reviewsData } = useGetReviewsQuery(slug);
  const [addRoomReview, { isLoading: isSubmittingReview }] = useAddRoomReviewMutation();

  const { currency, customHotelName } = useAppSelector((state) => state.ui);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { checkIn, checkOut, adults, children, selectedAddOns } = useAppSelector(
    (state) => state.booking
  );
  const nights = useAppSelector(selectBookingNights);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review Form State
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  const staticFallback =
    STATIC_SUITES.find((r) => r.slug === slug || r.id === slug) || STATIC_SUITES[0];
  const room = data || staticFallback;
  const addOns = addOnsData?.addOns || [];
  const roomReviews = reviewsData?.reviews || [];

  if (!room) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-serif text-4xl text-luxury-text">Chambre ou Suite introuvable</h1>
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

  const avgRating =
    roomReviews.length > 0
      ? Math.round(
          (roomReviews.reduce((acc, r) => acc + r.rating, 0) / roomReviews.length) * 10
        ) / 10
      : room.rating || 4.9;

  const handleBookThisRoom = () => {
    dispatch(selectRoomForBooking({ room, openDrawer: true }));
  };

  // Handle local image file upload (converts to Base64 data URL so it displays immediately)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          setReviewPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setReviewPhotos((prev) => [...prev, photoUrlInput.trim()]);
    setPhotoUrlInput('');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authorName =
      currentUser
        ? `${currentUser.title} ${currentUser.firstName} ${currentUser.lastName}`
        : reviewAuthor.trim() || 'Client Résident';

    if (!reviewComment.trim()) return;

    await addRoomReview({
      roomId: room.id,
      roomSlug: room.slug,
      roomName: room.name,
      authorName,
      authorEmail: currentUser?.email,
      authorBadge: currentUser ? `Compte Vérifié • ${currentUser.roleLabel}` : 'Séjour Vérifié',
      rating: reviewRating,
      comment: reviewComment.trim(),
      photos: reviewPhotos,
      stayDate: 'Octobre 2026'
    });

    setReviewComment('');
    setReviewPhotos([]);
    setReviewSuccessMsg(true);
    setTimeout(() => setReviewSuccessMsg(false), 4000);
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

      {/* Main Title, Star Rating & Price Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold text-[10px] uppercase tracking-[0.22em] font-semibold">
              {room.category}
            </span>
            <a
              href="#avis-clients"
              className="px-3 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-500 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>★★★★★</span>
              <span>{avgRating.toFixed(1)} / 5</span>
              <span className="text-[11px] text-luxury-muted">
                ({roomReviews.length || room.reviewsCount || 6} avis résidents)
              </span>
            </a>
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

      {/* Multi-Image Interactive Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-14 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 relative h-[360px] sm:h-[480px] overflow-hidden bg-black border border-luxury-border group">
            <img
              src={currentImg}
              alt={`${room.name} - Vue ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

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
                ★ Note Résidents : {avgRating.toFixed(1)}/5
              </span>
            </div>
          </div>

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
        {/* Left 7 Columns: Architectural Specs, Description, Amenities & Guest Reviews */}
        <div className="lg:col-span-7 space-y-12">
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
                <span>Paiement MTN Mobile Money, Visa, Mastercard ou Espèces CFA</span>
              </div>
              <div className="p-3.5 bg-luxury-surface border border-luxury-border flex items-center gap-3 text-xs text-luxury-text">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Petit-déjeuner buffet continental & béninois disponible</span>
              </div>
            </div>
          </div>

          {/* GUEST REVIEWS & STAY PHOTOS SECTION */}
          <div id="avis-clients" className="pt-8 border-t border-luxury-border space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-luxury-gold font-semibold block">
                  EXPÉRIENCES VÉCUES PAR NOS RÉSIDENTS
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-luxury-text">
                  Avis Clients & Photos de Séjour ({roomReviews.length})
                </h3>
              </div>

              <div className="p-4 bg-luxury-surface border border-luxury-border flex items-center gap-3">
                <span className="font-serif text-3xl text-amber-500 font-bold">
                  {avgRating.toFixed(1)}
                </span>
                <div className="text-xs">
                  <div className="text-amber-500 tracking-widest">★★★★★</div>
                  <span className="text-luxury-muted">Sur 5 étoiles</span>
                </div>
              </div>
            </div>

            {/* Interactive Form to Leave a Review & Upload Photos */}
            <form
              onSubmit={handleReviewSubmit}
              className="p-6 editorial-card border-l-2 border-l-luxury-gold space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-xl text-luxury-text">
                  Vous avez séjourné dans cette chambre ? Laissez votre avis & vos photos
                </h4>
                {reviewSuccessMsg && (
                  <span className="px-3 py-1 bg-emerald-500/15 text-emerald-600 text-xs font-semibold">
                    ✓ Merci ! Votre avis et vos photos ont été publiés.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Star Selector (1 to 5 Stars) */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1.5">
                    Votre Note en Étoiles *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`px-3 py-1.5 border text-sm transition-all flex items-center gap-1 ${
                          reviewRating >= star
                            ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-bold'
                            : 'bg-luxury-surface border-luxury-border text-luxury-muted'
                        }`}
                      >
                        <span>★</span>
                        <span className="text-xs">{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Author Name (if not connected) */}
                {!currentUser ? (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1.5">
                      Votre Nom & Prénom *
                    </label>
                    <input
                      required
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="Ex: M. Koffi Soglo"
                      className="w-full px-3.5 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-luxury-muted">
                    Publication en tant que{' '}
                    <strong className="text-luxury-text">
                      {currentUser.title} {currentUser.firstName} {currentUser.lastName}
                    </strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Votre Commentaire sur la Chambre *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Partagez votre expérience : confort du lit, vue, propreté, accueil..."
                  className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                />
              </div>

              {/* Photo Upload (Local Files or URL) */}
              <div className="space-y-2.5">
                <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold">
                  Ajouter des Photos de votre Séjour (Depuis votre téléphone/PC ou par lien)
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="cursor-pointer px-4 py-2 bg-luxury-surface border border-luxury-gold/60 hover:border-luxury-gold text-xs text-luxury-text flex items-center gap-2 transition-colors">
                    <Camera className="w-4 h-4 text-luxury-gold" />
                    <span>Importer des Photos (Fichier)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 min-w-[220px] flex gap-1.5">
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="Ou coller l’URL d’une photo (https://...)"
                      className="flex-1 px-3 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-3 py-2 bg-luxury-surface border border-luxury-border hover:border-luxury-gold text-xs text-luxury-text flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>

                {/* Preview Uploaded Review Photos */}
                {reviewPhotos.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {reviewPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-16 border border-luxury-gold overflow-hidden group"
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setReviewPhotos((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/80 text-white flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-luxury-gold" />
                <span>Publier mon Avis & mes Photos ({reviewRating} ★)</span>
              </button>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {roomReviews.length === 0 ? (
                <p className="text-xs text-luxury-muted italic">
                  Soyez le premier résident à publier un avis avec photo sur cette chambre.
                </p>
              ) : (
                roomReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 bg-luxury-surface border border-luxury-border space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-luxury-border">
                      <div>
                        <span className="font-serif text-lg text-luxury-text font-semibold block">
                          {rev.authorName}
                        </span>
                        <span className="text-[11px] text-luxury-gold">
                          {rev.authorBadge || 'Séjour Vérifié'} • {rev.stayDate || '2026'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                        <span>{'★'.repeat(rev.rating)}</span>
                        <span className="text-luxury-muted text-xs font-normal">
                          ({rev.rating}/5)
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-luxury-text leading-relaxed">
                      « {rev.comment} »
                    </p>

                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {rev.photos.map((photoUrl, idx) => (
                          <img
                            key={idx}
                            src={photoUrl}
                            alt={`Photo client ${idx + 1}`}
                            className="w-28 h-20 object-cover border border-luxury-border hover:border-luxury-gold transition-all"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
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
              <span className="px-2.5 py-1 bg-amber-500/15 text-amber-500 text-xs font-bold">
                ★ {avgRating.toFixed(1)}
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
