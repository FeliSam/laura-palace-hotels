'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  useAppSelector,
  useGetRoomsQuery,
  useUpdateBookingMutation
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';
import { BookingRecord } from '@hotel/types';
import {
  X,
  Calendar,
  BedDouble,
  Users,
  Save,
  Loader2,
  Clock
} from 'lucide-react';

interface EditBookingModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onUpdated?: (updatedBooking: BookingRecord) => void;
}

export function EditBookingModal({ booking, onClose, onUpdated }: EditBookingModalProps) {
  const { currency } = useAppSelector((state) => state.ui);
  const { data: roomsData } = useGetRoomsQuery();
  const [updateBooking, { isLoading: isSaving }] = useUpdateBookingMutation();

  const availableRooms = roomsData?.rooms || [];

  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [status, setStatus] = useState<BookingRecord['status']>('CONFIRMED');
  const [title, setTitle] = useState<'M.' | 'Mme' | 'Dr.' | 'S.A.R.'>('M.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [specialRequests, setSpecialRequests] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setRoomId(booking.room.id);
      setCheckIn(booking.checkIn);
      setCheckOut(booking.checkOut);
      setAdults(booking.adults);
      setChildren(booking.children);
      setStatus(booking.status);
      setTitle(booking.guest.title);
      setFirstName(booking.guest.firstName);
      setLastName(booking.guest.lastName);
      setEmail(booking.guest.email);
      setPhone(booking.guest.phone);
      setArrivalTime(booking.guest.arrivalTime || '14:00');
      setSpecialRequests(booking.guest.specialRequests || '');
      setErrorMsg(null);
    }
  }, [booking]);

  const livePricing = useMemo(() => {
    if (!booking) return null;
    const matchedRoom = availableRooms.find((r) => r.id === roomId || r.slug === roomId);
    const ratePerNight: number = matchedRoom
      ? matchedRoom.pricePerNight
      : booking.pricing.roomRatePerNight;

    const start = new Date(checkIn || booking.checkIn);
    const end = new Date(checkOut || booking.checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));

    const roomSubtotal = ratePerNight * nights;
    const addOnsSubtotal = booking.addOns.reduce((acc, addon) => {
      if (addon.pricingType === 'PER_NIGHT') return acc + addon.price * nights;
      if (addon.pricingType === 'PER_GUEST') return acc + addon.price * (adults + children);
      return acc + addon.price;
    }, 0);

    const gross = roomSubtotal + addOnsSubtotal;
    const discountAmount = booking.pricing.discountAmount || 0;
    const net = Math.max(0, gross - discountAmount);
    const taxesAndFees =
      Math.round((net * HOTEL_CONFIG.pricing.taxRatePercent) / 100) +
      HOTEL_CONFIG.pricing.cityTaxPerNight * nights * adults;

    return {
      nights,
      ratePerNight,
      roomSubtotal,
      addOnsSubtotal,
      taxesAndFees,
      totalPrice: net + taxesAndFees
    };
  }, [booking, availableRooms, roomId, checkIn, checkOut, adults, children]);

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Veuillez compléter les coordonnées du client.');
      return;
    }

    if (new Date(checkOut).getTime() <= new Date(checkIn).getTime()) {
      setErrorMsg('La date de départ doit être postérieure à la date d’arrivée.');
      return;
    }

    try {
      const res = await updateBooking({
        referenceCode: booking.referenceCode,
        roomId,
        checkIn,
        checkOut,
        adults,
        children,
        status,
        guest: {
          title,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          arrivalTime,
          specialRequests: specialRequests.trim()
        }
      }).unwrap();

      if (onUpdated) {
        onUpdated(res.booking);
      }
      onClose();
    } catch (_err) {
      setErrorMsg('Impossible de mettre à jour cette réservation.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-xl editorial-card p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-luxury-border">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold">
              MODIFICATION • {booking.referenceCode}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-luxury-text font-normal">
              Modifier la Réservation
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 border border-luxury-border flex items-center justify-center text-luxury-text shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-500/15 border border-red-500/40 text-xs text-red-500 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Room Selection & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                <BedDouble className="w-3.5 h-3.5" />
                <span>Chambre / Suite</span>
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text font-medium"
              >
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {formatCurrencyAmount(r.pricePerNight, currency)}/N (★{' '}
                    {(r.rating || 4.9).toFixed(1)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingRecord['status'])}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text font-semibold"
              >
                <option value="CONFIRMED">Confirmée</option>
                <option value="PENDING_CONCIERGE">En Attente</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>
          </div>

          {/* Dates & Arrival Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                <Calendar className="w-3 h-3" />
                <span>Arrivée *</span>
              </label>
              <input
                required
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                <Calendar className="w-3 h-3" />
                <span>Départ * ({livePricing?.nights || 1}N)</span>
              </label>
              <input
                required
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                <Clock className="w-3 h-3 text-luxury-gold" />
                <span>Heure d’Arrivée</span>
              </label>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
              />
            </div>
          </div>

          {/* Occupants */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                <Users className="w-3 h-3 text-luxury-gold" />
                <span>Adultes</span>
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Adulte{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                Enfants
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Enfant{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Coordinates */}
          <div className="pt-2 border-t border-luxury-border space-y-2.5">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold block">
              Coordonnées Client
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Titre
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
                >
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Dr.">Dr.</option>
                  <option value="S.A.R.">S.A.R.</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Prénom *
                </label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
                />
              </div>

              <div className="col-span-3 sm:col-span-2">
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Nom *
                </label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Téléphone (+229) *
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                Demandes Spéciales
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ex: Navette aéroport, étage élevé..."
                className="w-full px-3 py-2 bg-luxury-surface border border-luxury-border text-luxury-text"
              />
            </div>
          </div>

          {/* Live Recalculated Total Box */}
          {livePricing && (
            <div className="p-3 bg-luxury-surface border border-luxury-gold/40 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold block">
                  Total TTC ({livePricing.nights} nuit{livePricing.nights > 1 ? 's' : ''})
                </span>
                <span className="text-[10px] text-luxury-muted">
                  Chambre : {formatCurrencyAmount(livePricing.roomSubtotal, currency)} + Taxes :{' '}
                  {formatCurrencyAmount(livePricing.taxesAndFees, currency)}
                </span>
              </div>
              <span className="font-serif text-xl sm:text-2xl text-luxury-gold font-semibold">
                {formatCurrencyAmount(livePricing.totalPrice, currency)}
              </span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 border border-luxury-border text-luxury-muted hover:text-luxury-text uppercase tracking-wider text-center"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-luxury-gold" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
