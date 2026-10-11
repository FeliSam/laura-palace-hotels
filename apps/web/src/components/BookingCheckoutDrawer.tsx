'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  setDrawerOpen,
  setCheckoutStep,
  setDates,
  setGuests,
  toggleAddOn,
  setPromoCode,
  updateGuestInfo,
  toggleVipPreference,
  setConfirmedBookingRef,
  resetBookingFlow,
  selectPriceBreakdown,
  useGetRoomsQuery,
  useGetAddOnsQuery,
  useCreateBookingMutation,
  selectRoomForBooking
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Tag,
  Crown,
  Loader2,
  Maximize2,
  Users,
  BedDouble,
  RefreshCw,
  Eye
} from 'lucide-react';

const VIP_PREFERENCES_OPTIONS = [
  'Navette Aéroport Cotonou',
  'Chambre Étage Élevé Vue Mer',
  'Paiement Mobile Money / Carte à l’arrivée',
  'Lit King Size Supplémentaire',
  'Corbeille de Fruits Tropicaux',
  'Check-in Prioritaire Dès 12h00'
];

export function BookingCheckoutDrawer() {
  const dispatch = useAppDispatch();
  const {
    isDrawerOpen,
    checkoutStep,
    checkIn,
    checkOut,
    adults,
    children,
    selectedRoom,
    selectedAddOns,
    promoCode,
    guestInfo,
    lastConfirmedBookingRef
  } = useAppSelector((state) => state.booking);
  const { currency, customHotelName } = useAppSelector((state) => state.ui);
  const { currentUser } = useAppSelector((state) => state.auth);
  const pricing = useAppSelector(selectPriceBreakdown);

  const { data: roomsData } = useGetRoomsQuery();
  const { data: addOnsData } = useGetAddOnsQuery();
  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

  const [promoInput, setPromoInput] = useState(promoCode);
  const [formError, setFormError] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const availableRooms = roomsData?.rooms || [];
  const availableAddOns = addOnsData?.addOns || [];
  const chosenRoom = selectedRoom || availableRooms[0] || null;

  // Ensure Redux has the active room synced when drawer opens
  useEffect(() => {
    if (isDrawerOpen && !selectedRoom && availableRooms.length > 0) {
      dispatch(selectRoomForBooking({ room: availableRooms[0], openDrawer: true }));
    }
  }, [isDrawerOpen, selectedRoom, availableRooms, dispatch]);

  // Reset active photo index when chosen room changes
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [chosenRoom?.id]);

  // Auto-fill guest info when user is logged in
  useEffect(() => {
    if (currentUser && !guestInfo.email) {
      dispatch(
        updateGuestInfo({
          title: currentUser.title,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser.phone,
          country: currentUser.country
        })
      );
    }
  }, [currentUser, guestInfo.email, dispatch]);

  if (!isDrawerOpen) return null;

  const roomGallery =
    chosenRoom?.gallery && chosenRoom.gallery.length > 0
      ? chosenRoom.gallery
      : chosenRoom
      ? [chosenRoom.heroImage]
      : [];

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!chosenRoom) {
      setFormError('Veuillez sélectionner une chambre.');
      return;
    }

    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      setFormError('Veuillez renseigner vos coordonnées complètes pour la confirmation.');
      return;
    }

    try {
      const result = await createBooking({
        roomId: chosenRoom.id,
        checkIn,
        checkOut,
        adults,
        children,
        addOnIds: selectedAddOns.map((a) => a.id),
        promoCode: promoCode || undefined,
        guest: guestInfo
      }).unwrap();

      dispatch(setConfirmedBookingRef(result.booking.referenceCode));
    } catch (err: any) {
      setFormError(
        err?.data?.error || 'Une erreur est survenue lors de la validation de votre réservation.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(setDrawerOpen(false))}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Content */}
      <aside className="relative z-10 w-full max-w-2xl bg-luxury-bg text-luxury-text border-l border-luxury-border h-full flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 border-b border-luxury-border flex items-center justify-between bg-luxury-surface">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-semibold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Réservation Directe — {customHotelName}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-luxury-text mt-0.5">
              {lastConfirmedBookingRef
                ? 'Confirmation de Votre Séjour'
                : chosenRoom
                ? chosenRoom.name
                : 'Votre Réservation'}
            </h2>
          </div>

          <button
            onClick={() => dispatch(setDrawerOpen(false))}
            className="w-10 h-10 border border-luxury-border hover:border-luxury-gold text-luxury-text flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!lastConfirmedBookingRef && (
          <div className="px-6 py-3 bg-luxury-surface/60 border-b border-luxury-border grid grid-cols-3 gap-2 text-xs">
            {[
              { step: 1, label: '1. Chambre Choisie' },
              { step: 2, label: '2. Options & Restauration' },
              { step: 3, label: '3. Coordonnées Client' }
            ].map((item) => (
              <button
                key={item.step}
                onClick={() => dispatch(setCheckoutStep(item.step as 1 | 2 | 3))}
                className={`py-2 px-3 font-medium text-left transition-all border ${
                  checkoutStep === item.step
                    ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                    : 'text-luxury-muted hover:text-luxury-text bg-luxury-card border-luxury-border'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {lastConfirmedBookingRef ? (
            /* CONFIRMED STATE */
            <div className="p-8 editorial-card text-center space-y-6 my-4">
              <div className="w-16 h-16 rounded-full bg-luxury-gold/15 border border-luxury-gold flex items-center justify-center mx-auto text-luxury-gold">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold">
                  DOSSIER OFFICIEL ENREGISTRÉ
                </span>
                <h3 className="font-serif text-3xl text-luxury-text">
                  Merci, {guestInfo.title} {guestInfo.lastName}
                </h3>
                <p className="text-sm text-luxury-muted max-w-md mx-auto">
                  La Réception de{' '}
                  <strong className="text-luxury-text">{customHotelName}</strong> a enregistré votre
                  réservation et prépare votre accueil à Cotonou.
                </p>
              </div>

              <div className="p-5 bg-luxury-surface border border-luxury-border inline-block mx-auto">
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-muted block">
                  NUMÉRO DE RÉFÉRENCE À CONSERVER
                </span>
                <span className="font-mono text-2xl text-luxury-gold font-bold tracking-wider mt-1 block">
                  {lastConfirmedBookingRef}
                </span>
              </div>

              <div className="text-left p-5 bg-luxury-surface border border-luxury-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Chambre réservée :</span>
                  <span className="text-luxury-text font-semibold">{chosenRoom?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Dates :</span>
                  <span className="text-luxury-text">
                    Du {checkIn} au {checkOut} ({pricing.nights} nuits)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Total TTC confirmé :</span>
                  <span className="text-luxury-gold font-semibold text-sm">
                    {formatCurrencyAmount(pricing.totalPrice, currency)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    dispatch(resetBookingFlow());
                    dispatch(setDrawerOpen(false));
                  }}
                  className="px-6 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-widest"
                >
                  Terminer & Fermer
                </button>
              </div>
            </div>
          ) : checkoutStep === 1 ? (
            /* STEP 1: ONLY THE CHOSEN ROOM + DATES */
            <div className="space-y-6">
              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-luxury-gold font-semibold mb-1.5">
                    Date d’arrivée
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-sm text-luxury-text"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-luxury-gold font-semibold mb-1.5">
                    Date de départ ({pricing.nights} nuit{pricing.nights > 1 ? 's' : ''})
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-sm text-luxury-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-luxury-muted mb-1">
                    Adultes
                  </label>
                  <select
                    value={adults}
                    onChange={(e) =>
                      dispatch(setGuests({ adults: Number(e.target.value), children }))
                    }
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Adulte{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-luxury-muted mb-1">
                    Enfants
                  </label>
                  <select
                    value={children}
                    onChange={(e) =>
                      dispatch(setGuests({ adults, children: Number(e.target.value) }))
                    }
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} Enfant{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Focused Card: Displays ONLY the Chosen Room */}
              {chosenRoom && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-luxury-gold font-semibold">
                      Chambre Sélectionnée pour votre Séjour
                    </span>
                    <Link
                      href="/suites"
                      onClick={() => dispatch(setDrawerOpen(false))}
                      className="inline-flex items-center gap-1.5 text-[11px] text-luxury-muted hover:text-luxury-gold underline underline-offset-4 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Changer de chambre</span>
                    </Link>
                  </div>

                  <div className="editorial-card border-2 border-luxury-gold/50 overflow-hidden">
                    {/* Chosen Room Multi-Image Preview */}
                    <div className="relative h-52 bg-black overflow-hidden">
                      <img
                        src={roomGallery[activePhotoIdx] || chosenRoom.heroImage}
                        alt={chosenRoom.name}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 text-amber-300 text-[10px] uppercase tracking-widest font-semibold">
                        ✓ Chambre Choisie
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-amber-300 block">
                            {chosenRoom.viewLabel}
                          </span>
                          <h3 className="font-serif text-2xl leading-tight">{chosenRoom.name}</h3>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-xl text-amber-300 font-semibold block">
                            {formatCurrencyAmount(chosenRoom.pricePerNight, currency)}
                          </span>
                          <span className="text-[10px] text-stone-300">/ nuit</span>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail switcher for the chosen room */}
                    {roomGallery.length > 1 && (
                      <div className="px-4 py-2.5 bg-luxury-surface border-b border-luxury-border flex items-center gap-2 overflow-x-auto">
                        {roomGallery.map((imgUrl, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setActivePhotoIdx(idx)}
                            className={`w-14 h-10 shrink-0 overflow-hidden border transition-all ${
                              activePhotoIdx === idx
                                ? 'border-luxury-gold ring-2 ring-luxury-gold'
                                : 'border-luxury-border opacity-65 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Room details & link to full page */}
                    <div className="p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-luxury-muted">
                        <span className="flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-luxury-gold" />
                          {chosenRoom.sizeSqm} m²
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-luxury-gold" />
                          Max {chosenRoom.maxGuests} résidents
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BedDouble className="w-3.5 h-3.5 text-luxury-gold" />
                          {chosenRoom.bedConfiguration}
                        </span>
                      </div>

                      <p className="text-xs text-luxury-muted leading-relaxed">
                        {chosenRoom.subtitle}
                      </p>

                      <div className="pt-2 border-t border-luxury-border flex items-center justify-between">
                        <Link
                          href={`/suites/${chosenRoom.slug}`}
                          onClick={() => dispatch(setDrawerOpen(false))}
                          className="inline-flex items-center gap-1.5 text-xs text-luxury-gold hover:underline font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Voir la fiche détaillée & toutes les photos</span>
                        </Link>
                        <span className="text-xs font-semibold text-luxury-text">
                          Sous-total ({pricing.nights}N) :{' '}
                          <strong className="text-luxury-gold">
                            {formatCurrencyAmount(pricing.roomSubtotal, currency)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : checkoutStep === 2 ? (
            /* STEP 2: BESPOKE ADD-ONS & PROMO CODE */
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-luxury-text mb-1">
                  Options, Navette & Restauration
                </h3>
                <p className="text-xs text-luxury-muted">
                  Sélectionnez les prestations souhaitées pour votre séjour à{' '}
                  <strong className="text-luxury-text">{chosenRoom?.name}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                {availableAddOns.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => dispatch(toggleAddOn(addon))}
                      className={`p-4 border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-luxury-card border-luxury-gold ring-1 ring-luxury-gold'
                          : 'bg-luxury-surface/60 border-luxury-border hover:border-luxury-gold'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-luxury-text">
                            {addon.title}
                          </span>
                          {addon.badge && (
                            <span className="px-2 py-0.5 bg-luxury-gold/15 text-luxury-gold text-[10px] font-semibold">
                              {addon.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-luxury-muted">{addon.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif text-base text-luxury-gold font-semibold block">
                          +{formatCurrencyAmount(addon.price, currency)}
                        </span>
                        <span className="text-[10px] text-luxury-muted">
                          {isSelected ? '✓ Inclus' : 'Cliquer pour ajouter'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo / Invitation Code */}
              <div className="p-4 bg-luxury-surface border border-luxury-border space-y-2">
                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-luxury-gold font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  Code Promo / Entreprise (ex: BENIN10 ou MARINA15)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Entrez BENIN10 (-10%)"
                    className="flex-1 px-3.5 py-2 bg-luxury-card border border-luxury-border text-xs uppercase tracking-widest text-luxury-text"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(setPromoCode(promoInput))}
                    className="px-4 py-2 bg-luxury-text text-luxury-bg text-xs font-semibold uppercase tracking-wider"
                  >
                    Appliquer
                  </button>
                </div>
                {pricing.discountAmount > 0 && (
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ Privilège appliqué : -{formatCurrencyAmount(pricing.discountAmount, currency)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* STEP 3: VIP GUEST COORDINATES */
            <form id="vip-booking-form" onSubmit={handleConfirmReservation} className="space-y-4">
              {currentUser && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-xs text-luxury-text flex items-center justify-between">
                  <span>
                    Connecté en tant que{' '}
                    <strong>
                      {currentUser.title} {currentUser.firstName} {currentUser.lastName}
                    </strong>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                    Coordonnées pré-remplies
                  </span>
                </div>
              )}

              {formError && (
                <div className="p-3.5 bg-red-500/15 border border-red-500/40 text-xs text-luxury-text">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Civilité
                  </label>
                  <select
                    value={guestInfo.title}
                    onChange={(e) =>
                      dispatch(updateGuestInfo({ title: e.target.value as any }))
                    }
                    className="w-full px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  >
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                    <option value="Dr.">Dr.</option>
                    <option value="S.A.R.">S.A.R.</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Prénom *
                  </label>
                  <input
                    required
                    type="text"
                    value={guestInfo.firstName}
                    onChange={(e) => dispatch(updateGuestInfo({ firstName: e.target.value }))}
                    placeholder="Koffi"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Nom de Famille *
                  </label>
                  <input
                    required
                    type="text"
                    value={guestInfo.lastName}
                    onChange={(e) => dispatch(updateGuestInfo({ lastName: e.target.value }))}
                    placeholder="Soglo"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Heure d’arrivée estimée
                  </label>
                  <input
                    type="time"
                    value={guestInfo.arrivalTime || '14:00'}
                    onChange={(e) => dispatch(updateGuestInfo({ arrivalTime: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => dispatch(updateGuestInfo({ email: e.target.value }))}
                    placeholder="client@entreprise-benin.bj"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Téléphone / WhatsApp (+229) *
                  </label>
                  <input
                    required
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => dispatch(updateGuestInfo({ phone: e.target.value }))}
                    placeholder="+229 01 97 00 00 00"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  />
                </div>
              </div>

              {/* VIP Preferences Pills */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-luxury-gold font-semibold mb-2">
                  Préférences Personnalisées en Chambre (Incluses)
                </label>
                <div className="flex flex-wrap gap-2">
                  {VIP_PREFERENCES_OPTIONS.map((pref) => {
                    const active = (guestInfo.vipPreferences || []).includes(pref);
                    return (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => dispatch(toggleVipPreference(pref))}
                        className={`px-3 py-1.5 text-[11px] border transition-all ${
                          active
                            ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                            : 'bg-luxury-surface text-luxury-muted border-luxury-border'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                  Instructions Particulières pour la Réception
                </label>
                <textarea
                  rows={2}
                  value={guestInfo.specialRequests}
                  onChange={(e) =>
                    dispatch(updateGuestInfo({ specialRequests: e.target.value }))
                  }
                  placeholder="Navette aéroport, allergies alimentaires, arrivée tardive..."
                  className="w-full px-3.5 py-2 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                />
              </div>
            </form>
          )}
        </div>

        {/* Sticky Price Summary & Navigation Footer */}
        {!lastConfirmedBookingRef && (
          <div className="p-6 bg-luxury-surface border-t border-luxury-border space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-luxury-muted">
                <span>
                  {chosenRoom ? chosenRoom.name : 'Chambre sélectionnée'} ({pricing.nights} nuit
                  {pricing.nights > 1 ? 's' : ''})
                </span>
                <span>{formatCurrencyAmount(pricing.roomSubtotal, currency)}</span>
              </div>
              {pricing.addOnsSubtotal > 0 && (
                <div className="flex justify-between text-luxury-muted">
                  <span>Options & Restauration ({selectedAddOns.length})</span>
                  <span>+{formatCurrencyAmount(pricing.addOnsSubtotal, currency)}</span>
                </div>
              )}
              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Remise Privilège ({promoCode})</span>
                  <span>-{formatCurrencyAmount(pricing.discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-luxury-muted">
                <span>Taxes & Services ({HOTEL_CONFIG.pricing.taxRatePercent}%)</span>
                <span>{formatCurrencyAmount(pricing.taxesAndFees, currency)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-luxury-border">
                <span className="uppercase tracking-widest text-luxury-text font-semibold">
                  Total Séjour TTC
                </span>
                <span className="font-serif text-2xl text-luxury-gold font-semibold">
                  {formatCurrencyAmount(pricing.totalPrice, currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              {checkoutStep > 1 ? (
                <button
                  type="button"
                  onClick={() => dispatch(setCheckoutStep((checkoutStep - 1) as 1 | 2))}
                  className="px-4 py-3 border border-luxury-border text-xs uppercase tracking-wider text-luxury-text flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour
                </button>
              ) : (
                <div />
              )}

              {checkoutStep < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedRoom && chosenRoom) {
                      dispatch(selectRoomForBooking({ room: chosenRoom, openDrawer: true }));
                    }
                    dispatch(setCheckoutStep((checkoutStep + 1) as 2 | 3));
                  }}
                  className="px-6 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-[0.18em] flex items-center gap-2 transition-colors"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="vip-booking-form"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-[0.18em] flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validation...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirmer la Réservation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
