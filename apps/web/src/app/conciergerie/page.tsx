'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { PageHeroBanner } from '@/components/PageHeroBanner';
import {
  useAppDispatch,
  useAppSelector,
  useLazyGetBookingByReferenceQuery,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  setDrawerOpen,
  loginDemoRole,
  updateUserProfile,
  updateGuestInfo,
  isStaffRole
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';
import {
  Search,
  Car,
  ShieldCheck,
  Plane,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  UserCheck,
  Edit3,
  Save,
  Calendar,
  Eye,
  ArrowRight,
  Lock,
  Sparkles,
  XCircle,
  Star
} from 'lucide-react';

export default function ConciergeriePage() {
  const dispatch = useAppDispatch();
  const { currency } = useAppSelector((state) => state.ui);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data: allBookingsData } = useGetAllBookingsQuery();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateBookingStatusMutation();

  const [referenceInput, setReferenceInput] = useState('BENIN-2026-8841');
  const [triggerLookup, { data, isFetching, error }] = useLazyGetBookingByReferenceQuery();

  // Editable Personal Info State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editTitle, setEditTitle] = useState<'M.' | 'Mme' | 'Dr.'>('M.');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditTitle(currentUser.title);
      setEditFirstName(currentUser.firstName);
      setEditLastName(currentUser.lastName);
      setEditEmail(currentUser.email);
      setEditPhone(currentUser.phone);
      setEditCountry(currentUser.country);
    }
  }, [currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim() || !editEmail.trim()) return;

    dispatch(
      updateUserProfile({
        title: editTitle,
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        country: editCountry.trim() || 'Bénin'
      })
    );
    dispatch(
      updateGuestInfo({
        title: editTitle,
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        country: editCountry.trim() || 'Bénin'
      })
    );
    setIsEditingProfile(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3500);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (referenceInput.trim()) {
      triggerLookup(referenceInput.trim());
    }
  };

  const allBookings = allBookingsData?.bookings || [];
  const isStaff = isStaffRole(currentUser?.role);

  // For connected users: Staff sees all bookings; Guest sees their own bookings (or demo bookings if matching)
  const visibleBookings = currentUser
    ? isStaff
      ? allBookings
      : allBookings.filter(
          (b) =>
            b.guest.email.toLowerCase() === currentUser.email.toLowerCase() ||
            b.guest.lastName.toLowerCase() === currentUser.lastName.toLowerCase()
        )
    : [];

  return (
    <SiteShell>
      <PageHeroBanner
        kicker="CONCIERGERIE & SUIVI DE SÉJOUR • COTONOU BÉNIN 24H/24"
        title="Conciergerie Privée & Dossiers de Réservation"
        subtitle="Consultez vos réservations actives, modifiez vos informations personnelles à tout moment et organisez votre transfert depuis l’Aéroport Cardinal Bernardin Gantin de Cotonou."
        imageUrl="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2000&q=85"
      />

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-14">
        {/* 1. CONNECTED USER DYNAMIC SPACE: PERSONAL PROFILE + RESERVATIONS */}
        {currentUser ? (
          <div className="space-y-8">
            {/* Personal Info Card + Edit Form */}
            <div className="p-6 sm:p-8 editorial-card border-2 border-luxury-gold/40 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-luxury-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-luxury-gold/15 text-luxury-gold text-[10px] uppercase tracking-[0.22em] font-semibold">
                      COMPTE CONNECTÉ • {currentUser.roleLabel}
                    </span>
                    {profileSavedToast && (
                      <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 text-[10px] font-semibold">
                        ✓ Informations personnelles mises à jour
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-4xl text-luxury-text">
                    {currentUser.title} {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <p className="text-xs text-luxury-muted flex flex-wrap items-center gap-4">
                    <span>{currentUser.email}</span>
                    <span>•</span>
                    <span>{currentUser.phone}</span>
                    <span>•</span>
                    <span>{currentUser.country}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-4 py-2.5 border border-luxury-gold text-luxury-text hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>
                      {isEditingProfile
                        ? 'Fermer l’édition'
                        : 'Modifier mes infos personnelles'}
                    </span>
                  </button>

                  {isStaff && (
                    <Link
                      href="/admin"
                      className="px-4 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                    >
                      <span>Portail Direction Complet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Dynamic Edit Personal Info Form */}
              {isEditingProfile && (
                <form
                  onSubmit={handleSaveProfile}
                  className="p-6 bg-luxury-surface border border-luxury-border space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-luxury-text">
                      Modifier mes Informations Personnelles
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                      Synchronisation Instantanée
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                        Civilité
                      </label>
                      <select
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                      >
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                        Prénom *
                      </label>
                      <input
                        required
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                        Nom de Famille *
                      </label>
                      <input
                        required
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                        Adresse Email *
                      </label>
                      <input
                        required
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                        Téléphone / WhatsApp (+229) *
                      </label>
                      <input
                        required
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                        Pays / Ville de Résidence
                      </label>
                      <input
                        type="text"
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 border border-luxury-border text-xs text-luxury-muted hover:text-luxury-text"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Enregistrer mes Modifications</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reservations List for the Connected Account */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold block">
                      {isStaff
                        ? `SUPERVISION CONCIERGERIE (${currentUser.roleLabel})`
                        : 'SUIVI EN DIRECT DE VOS SÉJOURS'}
                    </span>
                    <h3 className="font-serif text-2xl text-luxury-text">
                      {isStaff
                        ? `Toutes les Réservations Clients (${visibleBookings.length})`
                        : `Mes Réservations Enregistrées (${visibleBookings.length})`}
                    </h3>
                  </div>

                  <button
                    onClick={() => dispatch(setDrawerOpen(true))}
                    className="px-4 py-2 bg-luxury-surface border border-luxury-border hover:border-luxury-gold text-xs uppercase tracking-wider font-semibold text-luxury-text flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>+ Nouvelle Réservation</span>
                  </button>
                </div>

                {visibleBookings.length === 0 ? (
                  <div className="p-8 bg-luxury-surface border border-luxury-border text-center space-y-3">
                    <p className="text-sm text-luxury-muted">
                      Aucune réservation associée à <strong>{currentUser.email}</strong> pour le
                      moment.
                    </p>
                    <button
                      onClick={() => dispatch(setDrawerOpen(true))}
                      className="px-5 py-2.5 bg-luxury-text text-luxury-bg text-xs uppercase tracking-widest font-semibold"
                    >
                      Réserver une Chambre Maintenant
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {visibleBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-5 bg-luxury-surface border border-luxury-border flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 pb-3 border-b border-luxury-border">
                            <div>
                              <span className="font-mono text-sm font-bold text-luxury-gold block">
                                {booking.referenceCode}
                              </span>
                              <span className="text-[11px] text-luxury-muted">
                                Client : {booking.guest.title} {booking.guest.firstName}{' '}
                                {booking.guest.lastName}
                              </span>
                            </div>

                            {booking.status === 'CONFIRMED' ? (
                              <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-600 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Confirmée
                              </span>
                            ) : booking.status === 'PENDING_CONCIERGE' ? (
                              <span className="px-2.5 py-1 bg-amber-500/15 text-amber-600 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                En Attente
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-red-500/15 text-red-600 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Annulée
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3.5">
                            <img
                              src={booking.room.heroImage}
                              alt={booking.room.name}
                              className="w-20 h-16 object-cover border border-luxury-border shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <Link
                                  href={`/suites/${booking.room.slug}`}
                                  className="font-serif text-lg text-luxury-text hover:text-luxury-gold truncate block"
                                >
                                  {booking.room.name}
                                </Link>
                                <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-semibold shrink-0">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{(booking.room.rating || 4.9).toFixed(1)}</span>
                                </span>
                              </div>
                              <p className="text-xs text-luxury-muted">
                                Du {booking.checkIn} au {booking.checkOut} ({booking.nights} nuits)
                              </p>
                              <p className="text-[11px] text-luxury-muted">
                                {booking.adults} Adulte(s) • Arrivée{' '}
                                {booking.guest.arrivalTime || '14:00'}
                              </p>
                            </div>
                          </div>

                          {booking.guest.specialRequests && (
                            <p className="p-2.5 bg-luxury-card border border-luxury-border text-[11px] text-luxury-muted italic">
                              « {booking.guest.specialRequests} »
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-luxury-border flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-luxury-muted block">
                              Montant TTC
                            </span>
                            <span className="font-serif text-lg text-luxury-gold font-semibold">
                              {formatCurrencyAmount(booking.pricing.totalPrice, currency)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/suites/${booking.room.slug}#avis-clients`}
                              className="px-3 py-1.5 bg-luxury-card border border-luxury-gold/50 hover:border-luxury-gold text-[11px] text-luxury-gold font-semibold flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>Noter & Photos</span>
                            </Link>

                            <Link
                              href={`/suites/${booking.room.slug}`}
                              className="px-3 py-1.5 border border-luxury-border hover:border-luxury-gold text-[11px] text-luxury-text flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3 text-luxury-gold" />
                              <span>Voir Chambre</span>
                            </Link>

                            {isStaff && booking.status !== 'CONFIRMED' && (
                              <button
                                disabled={isUpdatingStatus}
                                onClick={() =>
                                  updateStatus({
                                    referenceCode: booking.referenceCode,
                                    status: 'CONFIRMED'
                                  })
                                }
                                className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-semibold"
                              >
                                Confirmer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* PROMPT TO CONNECT TO SEE PERSONAL RESERVATIONS */
          <div className="p-6 sm:p-8 editorial-card border-l-4 border-l-luxury-gold flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Accès Dynamique aux Réservations</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-luxury-text">
                Connectez-vous pour afficher automatiquement vos réservations
              </h2>
              <p className="text-xs sm:text-sm text-luxury-muted">
                En vous connectant en tant que Client, Directeur, Administrateur ou Réception, vos
                réservations s’affichent directement sur cette page et vous pouvez modifier vos
                informations personnelles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => dispatch(loginDemoRole('GUEST'))}
                className="px-4 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Connexion Démo Client (1 Clic)
              </button>
              <button
                type="button"
                onClick={() => dispatch(loginDemoRole('DIRECTEUR'))}
                className="px-4 py-3 border border-luxury-gold text-luxury-text hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Connexion Démo Directeur
              </button>
              <Link
                href="/connexion"
                className="px-4 py-3 bg-luxury-surface border border-luxury-border hover:border-luxury-gold text-xs uppercase tracking-wider text-luxury-muted hover:text-luxury-text"
              >
                Page Connexion →
              </Link>
            </div>
          </div>
        )}

        {/* 2. REFERENCE LOOKUP & CONCIERGE SERVICES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Live Dossier Lookup by Reference Code */}
          <div className="lg:col-span-6 p-8 sm:p-10 editorial-card space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-luxury-gold block mb-2">
                RECHERCHE PAR NUMÉRO DE DOSSIER
              </span>
              <h2 className="font-serif text-3xl text-luxury-text font-normal">
                Rechercher une Réservation par Référence
              </h2>
              <p className="text-xs text-luxury-muted mt-1">
                Saisissez un numéro de référence (exemple :{' '}
                <strong className="text-luxury-text">BENIN-2026-8841</strong> ou{' '}
                <strong className="text-luxury-text">BENIN-2026-8902</strong>).
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
                placeholder="Ex: BENIN-2026-8841"
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
                <strong>BENIN-2026-8841</strong>.
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
                    <span className="text-luxury-muted block">Chambre Attribuée</span>
                    <Link
                      href={`/suites/${data.booking.room.slug}`}
                      className="text-luxury-gold hover:underline font-medium text-sm block"
                    >
                      {data.booking.room.name}
                    </Link>
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
                      {data.booking.guest.arrivalTime || '14:00'}
                    </span>
                  </div>
                </div>

                {data.booking.guest.specialRequests && (
                  <div className="pt-2 border-t border-luxury-border">
                    <span className="text-luxury-muted block mb-1">
                      Instructions transmises à la Réception :
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

          {/* Right: Bespoke Concierge Services in Benin */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.26em] text-luxury-gold block">
                LOGISTIQUE & ACCUEIL BÉNIN
              </span>
              <h3 className="font-serif text-3xl text-luxury-text font-normal">
                Prestations de Notre Conciergerie à Cotonou
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Plane,
                  title: 'Navette Aéroport Cotonou',
                  desc: 'Accueil personnalisé à l’Aéroport International Cardinal Bernardin Gantin (COO) à 5 minutes de l’hôtel.'
                },
                {
                  icon: Car,
                  title: 'Véhicules SUV Climatisés',
                  desc: 'Location de 4x4 avec chauffeur privé pour vos rendez-vous ministériels à Cotonou, Porto-Novo ou Ouidah.'
                },
                {
                  icon: ShieldCheck,
                  title: 'Protocole & Sécurité 24h/24',
                  desc: 'Parking privé sécurisé, contrôle d’accès diplomatique et salles de réunion confidentielles.'
                },
                {
                  icon: Clock,
                  title: 'Excursions Ouidah & Ganvié',
                  desc: 'Organisation de visites guidées sur la Route des Pêches, la Cité lacustre de Ganvié et le Parc de la Pendjari.'
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
                  Ligne Directe Réception & Conciergerie
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
