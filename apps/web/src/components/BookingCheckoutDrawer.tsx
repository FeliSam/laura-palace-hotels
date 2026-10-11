'use client';

import React, { useState } from 'react';
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
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Tag,
  Crown,
  Loader2
} from 'lucide-react';

const VIP_PREFERENCES_OPTIONS = [
  'Accueil Tarmac Privé',
  'Oreillers en Soie Naturelle',
  'Champagne Millésimé à 9°C',
  'Suite Hypoallergénique',
  'Presse Financière Internationale',
  'Majordome Francophone / Anglophone'
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
  const pricing = useAppSelector(selectPriceBreakdown);

  const { data: roomsData } = useGetRoomsQuery();
  const { data: addOnsData } = useGetAddOnsQuery();
  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

  const [promoInput, setPromoInput] = useState(promoCode);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isDrawerOpen) return null;

  const availableRooms = roomsData?.rooms || [];
  const availableAddOns = addOnsData?.addOns || [];

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const activeRoom = selectedRoom || availableRooms[0];
    if (!activeRoom) {
      setFormError('Veuillez sélectionner une suite.');
      return;
    }

    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      setFormError('Veuillez renseigner vos coordonnées complètes pour l’émission du dossier VIP.');
      return;
    }

    try {
      const result = await createBooking({
        roomId: activeRoom.id,
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
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Content */}
      <aside className="relative z-10 w-full max-w-2xl bg-luxury-bg border-l border-luxury-border h-full flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Drawer Header */}
        <div className="p-6 border-b border-luxury-border flex items-center justify-between bg-luxury-surface/80">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Conciergerie & Réservation Officielle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-luxury-text mt-0.5">
              {lastConfirmedBookingRef
                ? 'Confirmation de Votre Séjour'
                : 'Configurateur de Séjour Sur-Mesure'}
            </h2>
          </div>

          <button
            onClick={() => dispatch(setDrawerOpen(false))}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-luxury-gold hover:text-black flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (when not confirmed yet) */}
        {!lastConfirmedBookingRef && (
          <div className="px-6 py-3 bg-luxury-surface/40 border-b border-white/10 grid grid-cols-3 gap-2 text-xs">
            {[
              { step: 1, label: '1. Suite & Dates' },
              { step: 2, label: '2. Privilèges & Spa' },
              { step: 3, label: '3. Dossier VIP' }
            ].map((item) => (
              <button
                key={item.step}
                onClick={() => dispatch(setCheckoutStep(item.step as 1 | 2 | 3))}
                className={`py-2 px-3 rounded-lg font-medium text-left transition-all ${
                  checkoutStep === item.step
                    ? 'bg-luxury-gold text-black font-semibold'
                    : 'text-luxury-muted hover:text-luxury-text bg-white/5'
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
            <div className="p-8 rounded-2xl bg-luxury-card border border-luxury-gold/50 text-center space-y-6 my-4">
              <div className="w-16 h-16 rounded-full bg-luxury-gold/20 border border-luxury-gold flex items-center justify-center mx-auto text-luxury-gold">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold">
                  DOSSIER OFFICIEL ENREGISTRÉ
                </span>
                <h3 className="font-serif text-3xl text-luxury-text">
                  Merci, {guestInfo.title} {guestInfo.lastName}
                </h3>
                <p className="text-sm text-luxury-muted max-w-md mx-auto">
                  Votre Majordome dédié au sein de <strong className="text-luxury-text">{customHotelName}</strong> a reçu vos préférences d’arrivée.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-luxury-surface border border-luxury-border inline-block mx-auto">
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-muted block">
                  NUMÉRO DE RÉFÉRENCE À CONSERVER
                </span>
                <span className="font-mono text-2xl text-luxury-gold font-bold tracking-wider mt-1 block">
                  {lastConfirmedBookingRef}
                </span>
              </div>

              <div className="text-left p-5 rounded-xl bg-luxury-surface/70 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Suite réservée :</span>
                  <span className="text-luxury-text font-semibold">{selectedRoom?.name}</span>
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
                  className="px-6 py-3 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-widest"
                >
                  Terminer & Retourner au Palace
                </button>
              </div>
            </div>
          ) : checkoutStep === 1 ? (
            /* STEP 1: SUITE & DATES */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-luxury-gold mb-1.5">
                    Date d’arrivée
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-luxury-gold mb-1.5">
                    Date de départ ({pricing.nights} nuits)
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-sm"
                  />
                </div>
              </div>

              {/* Suite Selector */}
              <div className="space-y-3">
                <label className="block text-[11px] uppercase tracking-widest text-luxury-gold">
                  Suite ou Villa Sélectionnée
                </label>
                <div className="space-y-3">
                  {availableRooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() =>
                          dispatch(selectRoomForBooking({ room, openDrawer: true }))
                        }
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                          isSelected
                            ? 'bg-luxury-card border-luxury-gold ring-1 ring-luxury-gold'
                            : 'bg-luxury-surface/60 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={room.heroImage}
                          alt={room.name}
                          className="w-20 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-lg text-luxury-text truncate">
                            {room.name}
                          </h4>
                          <p className="text-xs text-luxury-muted">
                            {room.sizeSqm} m² • Jusqu’à {room.maxGuests} résidents
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-lg text-luxury-gold font-semibold block">
                            {formatCurrencyAmount(room.pricePerNight, currency)}
                          </span>
                          <span className="text-[10px] text-luxury-muted">/ nuit</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : checkoutStep === 2 ? (
            /* STEP 2: BESPOKE ADD-ONS & PROMO CODE */
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-luxury-text mb-1">
                  Expériences & Attention Majordome
                </h3>
                <p className="text-xs text-luxury-muted">
                  Sélectionnez les prestations qui seront préparées avant votre arrivée.
                </p>
              </div>

              <div className="space-y-3">
                {availableAddOns.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => dispatch(toggleAddOn(addon))}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-luxury-card border-luxury-gold'
                          : 'bg-luxury-surface/60 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-luxury-text">
                            {addon.title}
                          </span>
                          {addon.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold text-[10px]">
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
              <div className="p-4 rounded-xl bg-luxury-surface border border-white/10 space-y-2">
                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-luxury-gold">
                  <Tag className="w-3.5 h-3.5" />
                  Code Privilège / Invitation (ex: PALACE10 ou ROYALVIP)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Entrez PALACE10 (-10%)"
                    className="flex-1 px-3.5 py-2 rounded-lg bg-luxury-bg border border-white/15 text-xs uppercase tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(setPromoCode(promoInput))}
                    className="px-4 py-2 rounded-lg bg-luxury-gold text-black text-xs font-semibold uppercase tracking-wider"
                  >
                    Appliquer
                  </button>
                </div>
                {pricing.discountAmount > 0 && (
                  <p className="text-xs text-emerald-400">
                    ✓ Privilège appliqué : -{formatCurrencyAmount(pricing.discountAmount, currency)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* STEP 3: VIP GUEST COORDINATES */
            <form id="vip-booking-form" onSubmit={handleConfirmReservation} className="space-y-4">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-200">
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
                    className="w-full px-3 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-xs"
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
                    placeholder="Jean-Édouard"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-xs"
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
                    placeholder="de Rochefort"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Heure d’arrivée estimée
                  </label>
                  <input
                    type="time"
                    value={guestInfo.arrivalTime || '15:00'}
                    onChange={(e) => dispatch(updateGuestInfo({ arrivalTime: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Email Confidentiel *
                  </label>
                  <input
                    required
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => dispatch(updateGuestInfo({ email: e.target.value }))}
                    placeholder="contact@domaine.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                    Ligne Directe / WhatsApp VIP *
                  </label>
                  <input
                    required
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => dispatch(updateGuestInfo({ phone: e.target.value }))}
                    placeholder="+33 6 00 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-xs"
                  />
                </div>
              </div>

              {/* VIP Preferences Pills */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-luxury-gold mb-2">
                  Préférences Personnalisées en Suite (Incluses)
                </label>
                <div className="flex flex-wrap gap-2">
                  {VIP_PREFERENCES_OPTIONS.map((pref) => {
                    const active = (guestInfo.vipPreferences || []).includes(pref);
                    return (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => dispatch(toggleVipPreference(pref))}
                        className={`px-3 py-1.5 rounded-full text-[11px] border transition-all ${
                          active
                            ? 'bg-luxury-gold text-black border-luxury-gold font-semibold'
                            : 'bg-luxury-surface text-luxury-muted border-white/10'
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
                  Instructions Particulières pour votre Majordome
                </label>
                <textarea
                  rows={2}
                  value={guestInfo.specialRequests}
                  onChange={(e) =>
                    dispatch(updateGuestInfo({ specialRequests: e.target.value }))
                  }
                  placeholder="Allergies, fleurs préférées, numéro de vol privé..."
                  className="w-full px-3.5 py-2 rounded-xl bg-luxury-surface border border-white/15 text-xs"
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
                  {selectedRoom ? selectedRoom.name : 'Sélectionnez une suite'} ({pricing.nights}{' '}
                  nuit{pricing.nights > 1 ? 's' : ''})
                </span>
                <span>{formatCurrencyAmount(pricing.roomSubtotal, currency)}</span>
              </div>
              {pricing.addOnsSubtotal > 0 && (
                <div className="flex justify-between text-luxury-muted">
                  <span>Expériences & Privilèges ({selectedAddOns.length})</span>
                  <span>+{formatCurrencyAmount(pricing.addOnsSubtotal, currency)}</span>
                </div>
              )}
              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Remise Privilège ({promoCode})</span>
                  <span>-{formatCurrencyAmount(pricing.discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-luxury-muted">
                <span>Taxes & Services Palace ({HOTEL_CONFIG.pricing.taxRatePercent}%)</span>
                <span>{formatCurrencyAmount(pricing.taxesAndFees, currency)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
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
                  className="px-4 py-3 rounded-xl border border-white/15 text-xs uppercase tracking-wider flex items-center gap-1.5"
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
                    if (!selectedRoom && availableRooms.length > 0) {
                      dispatch(selectRoomForBooking({ room: availableRooms[0], openDrawer: true }));
                    }
                    dispatch(setCheckoutStep((checkoutStep + 1) as 2 | 3));
                  }}
                  className="px-6 py-3 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-[0.18em] flex items-center gap-2"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="vip-booking-form"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-[0.18em] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Émission du dossier...</span>
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
