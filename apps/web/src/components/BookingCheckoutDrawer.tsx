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
  Eye,
  Smartphone,
  CreditCard,
  Building2,
  Lock,
  Star
} from 'lucide-react';

type SimulatedPaymentMethod = 'MTN_MOMO' | 'BANK_CARD' | 'ON_SITE';

const VIP_PREFERENCES_OPTIONS = [
  'Navette Aéroport Cotonou',
  'Chambre Étage Élevé Vue Mer',
  'Facture Proforma Entreprise (IFU)',
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

  // Explicit Confirmation state in Step 3 before processing payment/booking
  const [isConfirmationStepReady, setIsConfirmationStepReady] = useState(false);

  // Simulated Payment State (MTN MoMo / Carte Bancaire / Sur place)
  const [paymentMethod, setPaymentMethod] = useState<SimulatedPaymentMethod>('MTN_MOMO');
  const [momoNumber, setMomoNumber] = useState('+229 01 97 45 88 20');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8841');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardHolder, setCardHolder] = useState('KOFFI SOGLO');
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [lastPaymentReceipt, setLastPaymentReceipt] = useState<{
    methodLabel: string;
    txRef: string;
    statusLabel: string;
  } | null>(null);

  const availableRooms = roomsData?.rooms || [];
  const availableAddOns = addOnsData?.addOns || [];
  const chosenRoom =
    (selectedRoom && availableRooms.find((r) => r.id === selectedRoom.id)) ||
    selectedRoom ||
    availableRooms[0] ||
    null;

  // Ensure Redux has the active room synced when drawer opens
  useEffect(() => {
    if (isDrawerOpen && !selectedRoom && availableRooms.length > 0) {
      dispatch(selectRoomForBooking({ room: availableRooms[0], openDrawer: true }));
    }
  }, [isDrawerOpen, selectedRoom, availableRooms, dispatch]);

  // Reset active photo index and confirmation step when room or checkoutStep changes
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [chosenRoom?.id]);

  useEffect(() => {
    setIsConfirmationStepReady(false);
    setFormError(null);
  }, [checkoutStep, paymentMethod]);

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
      setMomoNumber(currentUser.phone || '+229 01 97 00 11 22');
      setCardHolder(`${currentUser.firstName} ${currentUser.lastName}`.toUpperCase());
    }
  }, [currentUser, guestInfo.email, dispatch]);

  if (!isDrawerOpen) return null;

  const roomGallery =
    chosenRoom?.gallery && chosenRoom.gallery.length > 0
      ? chosenRoom.gallery
      : chosenRoom
      ? [chosenRoom.heroImage]
      : [];

  const validateStep3Inputs = (): boolean => {
    setFormError(null);

    if (!chosenRoom) {
      setFormError('Veuillez sélectionner une chambre.');
      return false;
    }

    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      setFormError('Veuillez renseigner vos coordonnées complètes (Nom, Prénom, Email, Téléphone).');
      return false;
    }

    if (paymentMethod === 'MTN_MOMO' && momoNumber.trim().length < 8) {
      setFormError('Veuillez saisir un numéro MTN Mobile Money valide (+229...).');
      return false;
    }

    if (paymentMethod === 'BANK_CARD' && cardNumber.trim().length < 8) {
      setFormError('Veuillez vérifier les informations de votre carte bancaire.');
      return false;
    }

    return true;
  };

  const handlePrepareConfirmation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateStep3Inputs()) {
      setIsConfirmationStepReady(true);
    }
  };

  const handleConfirmReservation = async () => {
    if (!validateStep3Inputs() || !chosenRoom) return;

    try {
      // Simulate realistic payment gateway authorization (1.2s)
      setIsSimulatingPayment(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const randomTx = Math.floor(100000 + Math.random() * 900000);
      const receipt =
        paymentMethod === 'MTN_MOMO'
          ? {
              methodLabel: `MTN Mobile Money Bénin (${momoNumber})`,
              txRef: `MOMO-BJ-${randomTx}`,
              statusLabel: 'Payé par MTN MoMo (Simulation)'
            }
          : paymentMethod === 'BANK_CARD'
          ? {
              methodLabel: `Carte Bancaire Visa / Mastercard (${cardNumber.slice(-4)})`,
              txRef: `CB-3DS-${randomTx}`,
              statusLabel: 'Payé par Carte Bancaire (Simulation)'
            }
          : {
              methodLabel: 'Règlement sur place à la Réception',
              txRef: `GARANTIE-${randomTx}`,
              statusLabel: 'Garanti — À régler au Check-in'
            };

      const paymentNote = `[${receipt.statusLabel} • Réf: ${receipt.txRef}]`;
      const combinedNotes = guestInfo.specialRequests
        ? `${guestInfo.specialRequests} | ${paymentNote}`
        : paymentNote;

      const result = await createBooking({
        roomId: chosenRoom.id,
        checkIn,
        checkOut,
        adults,
        children,
        addOnIds: selectedAddOns.map((a) => a.id),
        promoCode: promoCode || undefined,
        guest: {
          ...guestInfo,
          specialRequests: combinedNotes
        }
      }).unwrap();

      setLastPaymentReceipt(receipt);
      setIsSimulatingPayment(false);
      dispatch(setConfirmedBookingRef(result.booking.referenceCode));
    } catch (err: any) {
      setIsSimulatingPayment(false);
      setFormError(
        err?.data?.error || 'Une erreur est survenue lors de la validation de votre réservation.'
      );
    }
  };

  const isBusy = isSimulatingPayment || isSubmitting;

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
        <div className="p-4 sm:p-6 border-b border-luxury-border flex items-center justify-between bg-luxury-surface">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Réservation — {customHotelName}
            </span>
            <h2 className="font-serif text-xl sm:text-3xl text-luxury-text mt-0.5 line-clamp-1">
              {lastConfirmedBookingRef
                ? 'Confirmation & Reçu'
                : chosenRoom
                ? chosenRoom.name
                : 'Votre Réservation'}
            </h2>
          </div>

          <button
            onClick={() => dispatch(setDrawerOpen(false))}
            className="w-9 h-9 border border-luxury-border hover:border-luxury-gold text-luxury-text flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        {!lastConfirmedBookingRef && (
          <div className="px-4 sm:px-6 py-2.5 bg-luxury-surface/60 border-b border-luxury-border grid grid-cols-3 gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
            {[
              { step: 1, label: '1. Chambre' },
              { step: 2, label: '2. Options' },
              { step: 3, label: '3. Paiement' }
            ].map((item) => (
              <button
                key={item.step}
                onClick={() => dispatch(setCheckoutStep(item.step as 1 | 2 | 3))}
                className={`py-2 px-2 sm:px-3 font-medium text-center sm:text-left transition-all border truncate ${
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {lastConfirmedBookingRef ? (
            /* CONFIRMED STATE WITH SIMULATED PAYMENT RECEIPT */
            <div className="p-5 sm:p-8 editorial-card text-center space-y-5 my-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-500 font-semibold">
                  RÉSERVATION CONFIRMÉE
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-luxury-text">
                  Merci, {guestInfo.title} {guestInfo.lastName}
                </h3>
                <p className="text-xs sm:text-sm text-luxury-muted max-w-md mx-auto">
                  Séjour validé au sein de <strong className="text-luxury-text">{customHotelName}</strong>.
                </p>
              </div>

              <div className="p-4 bg-luxury-surface border border-luxury-border inline-block mx-auto">
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-muted block">
                  N° DE DOSSIER
                </span>
                <span className="font-mono text-xl sm:text-2xl text-luxury-gold font-bold tracking-wider mt-1 block">
                  {lastConfirmedBookingRef}
                </span>
              </div>

              <div className="text-left p-4 bg-luxury-surface border border-luxury-border space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-luxury-muted">Chambre :</span>
                  <span className="text-luxury-text font-semibold text-right">{chosenRoom?.name}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-luxury-muted">Séjour :</span>
                  <span className="text-luxury-text text-right">
                    {checkIn} → {checkOut} ({pricing.nights}N)
                  </span>
                </div>
                {lastPaymentReceipt && (
                  <>
                    <div className="flex justify-between gap-2 pt-2 border-t border-luxury-border">
                      <span className="text-luxury-muted">Paiement :</span>
                      <span className="text-luxury-text font-medium text-right">
                        {lastPaymentReceipt.methodLabel}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-luxury-muted">Réf. Transaction :</span>
                      <span className="font-mono text-emerald-600 font-semibold">
                        {lastPaymentReceipt.txRef}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-2 border-t border-luxury-border">
                  <span className="text-luxury-text font-semibold uppercase tracking-wider">
                    Total TTC :
                  </span>
                  <span className="text-luxury-gold font-semibold text-base font-serif">
                    {formatCurrencyAmount(pricing.totalPrice, currency)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setLastPaymentReceipt(null);
                    dispatch(resetBookingFlow());
                    dispatch(setDrawerOpen(false));
                  }}
                  className="px-6 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-widest"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : checkoutStep === 1 ? (
            /* STEP 1: ONLY THE CHOSEN ROOM + DATES */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-semibold mb-1">
                    Arrivée
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
                    className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs sm:text-sm text-luxury-text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gold font-semibold mb-1">
                    Départ ({pricing.nights} nuit{pricing.nights > 1 ? 's' : ''})
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
                    className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs sm:text-sm text-luxury-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-1">
                    Adultes
                  </label>
                  <select
                    value={adults}
                    onChange={(e) =>
                      dispatch(setGuests({ adults: Number(e.target.value), children }))
                    }
                    className="w-full px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
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
                    className="w-full px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
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
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                      Chambre Sélectionnée
                    </span>
                    <Link
                      href="/suites"
                      onClick={() => dispatch(setDrawerOpen(false))}
                      className="inline-flex items-center gap-1.5 text-[11px] text-luxury-muted hover:text-luxury-gold underline underline-offset-4 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Changer</span>
                    </Link>
                  </div>

                  <div className="editorial-card border-2 border-luxury-gold/50 overflow-hidden">
                    <div className="relative h-44 sm:h-52 bg-black overflow-hidden">
                      <img
                        src={roomGallery[activePhotoIdx] || chosenRoom.heroImage}
                        alt={chosenRoom.name}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 text-amber-300 text-[10px] uppercase tracking-widest font-semibold">
                        ✓ Sélectionnée
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/80 text-amber-300 text-[11px] font-semibold flex items-center gap-1 border border-amber-400/30">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{(chosenRoom.rating || 4.9).toFixed(1)}</span>
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-amber-300 block">
                            {chosenRoom.viewLabel}
                          </span>
                          <h3 className="font-serif text-lg sm:text-2xl leading-tight">
                            {chosenRoom.name}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif text-base sm:text-xl text-amber-300 font-semibold block">
                            {formatCurrencyAmount(chosenRoom.pricePerNight, currency)}
                          </span>
                          <span className="text-[10px] text-stone-300">/ nuit</span>
                        </div>
                      </div>
                    </div>

                    {roomGallery.length > 1 && (
                      <div className="px-3 py-2 bg-luxury-surface border-b border-luxury-border flex items-center gap-2 overflow-x-auto">
                        {roomGallery.map((imgUrl, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setActivePhotoIdx(idx)}
                            className={`w-12 h-9 shrink-0 overflow-hidden border transition-all ${
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

                    <div className="p-3.5 sm:p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-luxury-muted">
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-luxury-gold" />
                          {chosenRoom.sizeSqm} m²
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-luxury-gold" />
                          Max {chosenRoom.maxGuests} pers.
                        </span>
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-luxury-gold" />
                          {chosenRoom.bedConfiguration}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-luxury-border flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={`/suites/${chosenRoom.slug}`}
                          onClick={() => dispatch(setDrawerOpen(false))}
                          className="inline-flex items-center gap-1.5 text-xs text-luxury-gold hover:underline font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Détails & photos</span>
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
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-luxury-text mb-0.5">
                  Options & Restauration
                </h3>
                <p className="text-xs text-luxury-muted">
                  Prestations optionnelles pour <strong className="text-luxury-text">{chosenRoom?.name}</strong>.
                </p>
              </div>

              <div className="space-y-2.5">
                {availableAddOns.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => dispatch(toggleAddOn(addon))}
                      className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-luxury-card border-luxury-gold ring-1 ring-luxury-gold'
                          : 'bg-luxury-surface/60 border-luxury-border hover:border-luxury-gold'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-medium text-xs sm:text-sm text-luxury-text">
                            {addon.title}
                          </span>
                          {addon.badge && (
                            <span className="px-1.5 py-0.5 bg-luxury-gold/15 text-luxury-gold text-[9px] font-semibold">
                              {addon.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-luxury-muted line-clamp-2">{addon.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif text-sm sm:text-base text-luxury-gold font-semibold block">
                          +{formatCurrencyAmount(addon.price, currency)}
                        </span>
                        <span className="text-[10px] text-luxury-muted">
                          {isSelected ? '✓ Inclus' : '+ Ajouter'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo / Invitation Code */}
              <div className="p-3.5 bg-luxury-surface border border-luxury-border space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-luxury-gold font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  Code Promo (BENIN10 ou MARINA15)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="BENIN10"
                    className="flex-1 min-w-0 px-3 py-2 bg-luxury-card border border-luxury-border text-xs uppercase tracking-widest text-luxury-text"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(setPromoCode(promoInput))}
                    className="px-3.5 py-2 bg-luxury-text text-luxury-bg text-xs font-semibold uppercase tracking-wider shrink-0"
                  >
                    Appliquer
                  </button>
                </div>
                {pricing.discountAmount > 0 && (
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ Remise : -{formatCurrencyAmount(pricing.discountAmount, currency)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* STEP 3: VIP GUEST COORDINATES + SIMULATED PAYMENT + EXPLICIT CONFIRMATION STEP */
            <form
              id="vip-booking-form"
              onSubmit={handlePrepareConfirmation}
              className="space-y-4"
            >
              {currentUser && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-xs text-luxury-text flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Connecté :{' '}
                    <strong>
                      {currentUser.title} {currentUser.firstName} {currentUser.lastName}
                    </strong>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                    Pré-rempli
                  </span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-500/15 border border-red-500/40 text-xs text-luxury-text">
                  {formError}
                </div>
              )}

              {/* Section 1: Coordonnées du Résident */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold">
                  1. Coordonnées Client
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                      Civilité
                    </label>
                    <select
                      value={guestInfo.title}
                      onChange={(e) => {
                        setIsConfirmationStepReady(false);
                        dispatch(updateGuestInfo({ title: e.target.value as any }));
                      }}
                      className="w-full px-2.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    >
                      <option value="M.">M.</option>
                      <option value="Mme">Mme</option>
                      <option value="Dr.">Dr.</option>
                      <option value="S.A.R.">S.A.R.</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                      Prénom *
                    </label>
                    <input
                      required
                      type="text"
                      value={guestInfo.firstName}
                      onChange={(e) => {
                        setIsConfirmationStepReady(false);
                        dispatch(updateGuestInfo({ firstName: e.target.value }));
                      }}
                      placeholder="Koffi"
                      className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                      Nom *
                    </label>
                    <input
                      required
                      type="text"
                      value={guestInfo.lastName}
                      onChange={(e) => {
                        setIsConfirmationStepReady(false);
                        dispatch(updateGuestInfo({ lastName: e.target.value }));
                      }}
                      placeholder="Soglo"
                      className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                      Heure d’arrivée
                    </label>
                    <input
                      type="time"
                      value={guestInfo.arrivalTime || '14:00'}
                      onChange={(e) => {
                        setIsConfirmationStepReady(false);
                        dispatch(updateGuestInfo({ arrivalTime: e.target.value }));
                      }}
                      className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => {
                        setIsConfirmationStepReady(false);
                        dispatch(updateGuestInfo({ email: e.target.value }));
                      }}
                      placeholder="client@benin.bj"
                      className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                      Téléphone / WhatsApp (+229) *
                    </label>
                    <input
                      required
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => {
                        setIsConfirmationStepReady(false);
                        dispatch(updateGuestInfo({ phone: e.target.value }));
                      }}
                      placeholder="+229 01 97 00 00 00"
                      className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: SIMULATED PAYMENT MODULE */}
              <div className="pt-3 border-t border-luxury-border space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>2. Mode de Paiement (Simulé)</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-luxury-gold/15 text-luxury-gold font-semibold uppercase tracking-wider">
                    Démo
                  </span>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MTN_MOMO')}
                    className={`p-3 border text-left transition-all flex sm:flex-col items-center sm:items-stretch justify-between gap-2 ${
                      paymentMethod === 'MTN_MOMO'
                        ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-luxury-surface border-luxury-border hover:border-luxury-gold'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:justify-between">
                      <Smartphone className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="px-1.5 py-0.5 bg-amber-400 text-black font-bold text-[9px] uppercase">
                        MTN MoMo
                      </span>
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-xs font-semibold text-luxury-text block">
                        Mobile Money
                      </span>
                      <span className="text-[10px] text-luxury-muted">Push *880#</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK_CARD')}
                    className={`p-3 border text-left transition-all flex sm:flex-col items-center sm:items-stretch justify-between gap-2 ${
                      paymentMethod === 'BANK_CARD'
                        ? 'bg-luxury-card border-luxury-gold ring-1 ring-luxury-gold'
                        : 'bg-luxury-surface border-luxury-border hover:border-luxury-gold'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:justify-between">
                      <CreditCard className="w-4 h-4 text-luxury-gold shrink-0" />
                      <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold">
                        VISA / MC
                      </span>
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-xs font-semibold text-luxury-text block">
                        Carte Bancaire
                      </span>
                      <span className="text-[10px] text-luxury-muted">Visa, Mastercard</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ON_SITE')}
                    className={`p-3 border text-left transition-all flex sm:flex-col items-center sm:items-stretch justify-between gap-2 ${
                      paymentMethod === 'ON_SITE'
                        ? 'bg-luxury-card border-luxury-gold ring-1 ring-luxury-gold'
                        : 'bg-luxury-surface border-luxury-border hover:border-luxury-gold'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:justify-between">
                      <Building2 className="w-4 h-4 text-luxury-gold shrink-0" />
                      <span className="text-[9px] uppercase tracking-wider text-luxury-muted font-semibold">
                        HÔTEL
                      </span>
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="text-xs font-semibold text-luxury-text block">
                        Sur Place
                      </span>
                      <span className="text-[10px] text-luxury-muted">À la Réception</span>
                    </div>
                  </button>
                </div>

                {/* Conditional Inputs for Selected Simulated Payment Method */}
                {paymentMethod === 'MTN_MOMO' && (
                  <div className="p-3.5 bg-luxury-surface border border-amber-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-luxury-text">
                        Numéro MTN MoMo Bénin
                      </span>
                      <span className="text-xs font-serif text-luxury-gold font-semibold">
                        {formatCurrencyAmount(pricing.totalPrice, currency)}
                      </span>
                    </div>
                    <input
                      type="tel"
                      value={momoNumber}
                      onChange={(e) => {
                        setIsConfirmationStepReady(false);
                        setMomoNumber(e.target.value);
                      }}
                      placeholder="+229 01 97 00 00 00"
                      className="w-full min-w-0 px-3 py-2 bg-luxury-card border border-luxury-border text-xs font-mono text-luxury-text"
                    />
                  </div>
                )}

                {paymentMethod === 'BANK_CARD' && (
                  <div className="p-3.5 bg-luxury-surface border border-luxury-gold/40 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          N° Carte (Démo)
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            setIsConfirmationStepReady(false);
                            setCardNumber(e.target.value);
                          }}
                          className="w-full min-w-0 px-3 py-2 bg-luxury-card border border-luxury-border text-xs font-mono text-luxury-text"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          Titulaire
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => {
                            setIsConfirmationStepReady(false);
                            setCardHolder(e.target.value.toUpperCase());
                          }}
                          className="w-full min-w-0 px-3 py-2 bg-luxury-card border border-luxury-border text-xs uppercase text-luxury-text"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          Expiration
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            setIsConfirmationStepReady(false);
                            setCardExpiry(e.target.value);
                          }}
                          className="w-full min-w-0 px-3 py-2 bg-luxury-card border border-luxury-border text-xs font-mono text-luxury-text"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => {
                            setIsConfirmationStepReady(false);
                            setCardCvv(e.target.value);
                          }}
                          className="w-full min-w-0 px-3 py-2 bg-luxury-card border border-luxury-border text-xs font-mono text-luxury-text"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'ON_SITE' && (
                  <div className="p-3.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-muted">
                    Règlement de{' '}
                    <strong className="text-luxury-gold">
                      {formatCurrencyAmount(pricing.totalPrice, currency)}
                    </strong>{' '}
                    à la Réception lors du check-in.
                  </div>
                )}
              </div>

              {/* VIP Preferences Pills */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1.5">
                  Préférences en Chambre
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {VIP_PREFERENCES_OPTIONS.map((pref) => {
                    const active = (guestInfo.vipPreferences || []).includes(pref);
                    return (
                      <button
                        type="button"
                        key={pref}
                        onClick={() => dispatch(toggleVipPreference(pref))}
                        className={`px-2.5 py-1 text-[11px] border transition-all ${
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

              {/* EXPLICIT CONFIRMATION GATE BEFORE PROCESSING */}
              <div className="pt-3 border-t border-luxury-border">
                {!isConfirmationStepReady ? (
                  <div className="p-3.5 bg-luxury-surface border border-luxury-gold/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-widest text-luxury-gold font-semibold">
                        3. Vérification Avant Confirmation
                      </span>
                      <span className="text-[10px] text-luxury-muted">Requis</span>
                    </div>
                    <p className="text-xs text-luxury-muted">
                      Vérifiez vos informations avant d’activer le bouton de confirmation finale.
                    </p>
                    <button
                      type="button"
                      onClick={() => handlePrepareConfirmation()}
                      className="w-full py-2.5 bg-luxury-card hover:bg-luxury-gold hover:text-white border border-luxury-gold text-luxury-text text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      Vérifier mes informations →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-emerald-500 font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>3. Confirmation Finale</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsConfirmationStepReady(false)}
                        className="text-[11px] text-luxury-muted hover:text-luxury-text underline"
                      >
                        Modifier
                      </button>
                    </div>

                    <div className="p-3 bg-luxury-card border border-luxury-border space-y-1 text-xs">
                      <div className="flex justify-between gap-2">
                        <span className="text-luxury-muted">Client :</span>
                        <span className="font-semibold text-luxury-text text-right">
                          {guestInfo.title} {guestInfo.firstName} {guestInfo.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-luxury-muted">Chambre :</span>
                        <span className="font-semibold text-luxury-text text-right">
                          {chosenRoom?.name}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-luxury-muted">Séjour :</span>
                        <span className="text-luxury-text text-right">
                          {checkIn} → {checkOut} ({pricing.nights}N)
                        </span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-luxury-border">
                        <span className="font-semibold text-luxury-text">Total TTC :</span>
                        <span className="font-serif text-base font-bold text-luxury-gold">
                          {formatCurrencyAmount(pricing.totalPrice, currency)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={handleConfirmReservation}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirmer la Demande</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Sticky Price Summary & Navigation Footer */}
        {!lastConfirmedBookingRef && (
          <div className="p-4 sm:p-6 bg-luxury-surface border-t border-luxury-border space-y-3">
            {isSimulatingPayment && (
              <div className="p-2.5 bg-amber-500/15 border border-amber-500/40 text-xs text-luxury-text flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                <span>Validation du paiement simulé en cours...</span>
              </div>
            )}

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-luxury-muted">
                <span className="truncate pr-2">
                  {chosenRoom ? chosenRoom.name : 'Chambre'} ({pricing.nights}N)
                </span>
                <span className="shrink-0">{formatCurrencyAmount(pricing.roomSubtotal, currency)}</span>
              </div>
              {pricing.addOnsSubtotal > 0 && (
                <div className="flex justify-between text-luxury-muted">
                  <span>Options ({selectedAddOns.length})</span>
                  <span>+{formatCurrencyAmount(pricing.addOnsSubtotal, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-luxury-muted">
                <span>Taxes ({HOTEL_CONFIG.pricing.taxRatePercent}%)</span>
                <span>{formatCurrencyAmount(pricing.taxesAndFees, currency)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1.5 border-t border-luxury-border">
                <span className="uppercase tracking-widest text-luxury-text font-semibold">
                  Total TTC
                </span>
                <span className="font-serif text-xl sm:text-2xl text-luxury-gold font-semibold">
                  {formatCurrencyAmount(pricing.totalPrice, currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              {checkoutStep > 1 ? (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => dispatch(setCheckoutStep((checkoutStep - 1) as 1 | 2))}
                  className="px-3.5 py-2.5 border border-luxury-border text-xs uppercase tracking-wider text-luxury-text flex items-center gap-1.5"
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
                  className="px-5 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : !isConfirmationStepReady ? (
                <button
                  type="button"
                  onClick={() => handlePrepareConfirmation()}
                  className="px-4 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-luxury-gold shrink-0" />
                  <span>Vérifier</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={handleConfirmReservation}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Confirmer</span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
