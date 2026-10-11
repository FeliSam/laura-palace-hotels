'use client';

import React, { useState, useMemo } from 'react';
import { SiteShell } from '@/components/SiteShell';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  setDrawerOpen,
  loginDemoRole,
  logoutUser,
  isStaffRole
} from '@hotel/store';
import { formatCurrencyAmount } from '@hotel/config';
import { BookingRecord } from '@hotel/types';
import {
  LayoutDashboard,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  BedDouble,
  Plus,
  Eye,
  Phone,
  Mail,
  X,
  Lock,
  LogOut
} from 'lucide-react';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { currency, customHotelName } = useAppSelector((state) => state.ui);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetAllBookingsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingRecord['status']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const bookings = data?.bookings || [];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.referenceCode.toLowerCase().includes(q) ||
        b.guest.firstName.toLowerCase().includes(q) ||
        b.guest.lastName.toLowerCase().includes(q) ||
        b.guest.email.toLowerCase().includes(q) ||
        b.room.name.toLowerCase().includes(q)
      );
    });
  }, [bookings, statusFilter, searchQuery]);

  // Real-time KPI calculations
  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== 'CANCELLED');
    const totalRevenue = active.reduce((sum, b) => sum + b.pricing.totalPrice, 0);
    const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const pendingCount = bookings.filter((b) => b.status === 'PENDING_CONCIERGE').length;
    const totalNights = active.reduce((sum, b) => sum + b.nights, 0);
    return {
      totalBookings: bookings.length,
      confirmedCount,
      pendingCount,
      totalNights,
      totalRevenue
    };
  }, [bookings]);

  const handleStatusChange = async (referenceCode: string, status: BookingRecord['status']) => {
    try {
      const res = await updateStatus({ referenceCode, status }).unwrap();
      if (selectedBooking?.referenceCode === referenceCode) {
        setSelectedBooking(res.booking);
      }
    } catch (_e) {
      // Handled by RTK Query
    }
  };

  return (
    <SiteShell>
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        {/* Session Status Banner */}
        <div className="p-4 bg-luxury-surface border border-luxury-border flex flex-wrap items-center justify-between gap-4 text-xs">
          {isStaffRole(currentUser?.role) && currentUser ? (
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Session Active ({currentUser.roleLabel}) :{' '}
                <strong className="text-luxury-text">
                  {currentUser.title} {currentUser.firstName} {currentUser.lastName}
                </strong>{' '}
                ({currentUser.email})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-luxury-muted">
              <Lock className="w-4 h-4 text-luxury-gold" />
              <span>
                Portail Direction, Administration & Réception — Connectez-vous avec votre profil
                habilité.
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {isStaffRole(currentUser?.role) ? (
              <>
                <Link
                  href="/connexion"
                  className="px-3 py-1.5 border border-luxury-border hover:border-luxury-gold text-luxury-text uppercase tracking-wider text-[10px] font-semibold"
                >
                  Mon Profil
                </Link>
                <button
                  onClick={() => dispatch(logoutUser())}
                  className="px-3 py-1.5 border border-luxury-border hover:border-red-500/50 text-luxury-muted hover:text-red-500 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => dispatch(loginDemoRole('DIRECTEUR'))}
                  className="px-3 py-1.5 bg-luxury-gold text-white uppercase tracking-wider text-[10px] font-semibold"
                >
                  Démo Directeur
                </button>
                <button
                  onClick={() => dispatch(loginDemoRole('ADMIN'))}
                  className="px-3 py-1.5 bg-luxury-text text-luxury-bg uppercase tracking-wider text-[10px] font-semibold"
                >
                  Démo Admin
                </button>
                <button
                  onClick={() => dispatch(loginDemoRole('RECEPTION'))}
                  className="px-3 py-1.5 border border-luxury-border hover:border-luxury-gold text-luxury-text uppercase tracking-wider text-[10px] font-semibold"
                >
                  Démo Réception
                </button>
                <Link
                  href="/connexion"
                  className="px-3 py-1.5 border border-luxury-border hover:border-luxury-gold text-luxury-gold uppercase tracking-wider text-[10px] font-semibold"
                >
                  Page Connexion →
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Top Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-luxury-border">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-[0.24em] font-semibold mb-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>DIRECTION & RÉCEPTION • PORTAIL ADMINISTRATEUR</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
              Gestion des Réservations — {customHotelName}
            </h1>
            <p className="text-xs sm:text-sm text-luxury-muted mt-1">
              Visualisez toutes les réservations en temps réel, gérez les statuts d’arrivée et
              suivez le chiffre d’affaires en Franc CFA.
            </p>
          </div>

          <button
            onClick={() => dispatch(setDrawerOpen(true))}
            className="self-start md:self-auto px-5 py-3 rounded-full bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-luxury-gold" />
            <span>Saisir une Nouvelle Réservation</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 editorial-card space-y-2">
            <div className="flex items-center justify-between text-xs text-luxury-muted uppercase tracking-wider">
              <span>Chiffre d’Affaires Confirmé</span>
              <TrendingUp className="w-4 h-4 text-luxury-gold" />
            </div>
            <div className="font-serif text-2xl sm:text-3xl text-luxury-gold font-semibold">
              {formatCurrencyAmount(stats.totalRevenue, currency)}
            </div>
            <p className="text-[11px] text-luxury-muted">
              Sur {stats.totalNights} nuitées réservées
            </p>
          </div>

          <div className="p-6 editorial-card space-y-2">
            <div className="flex items-center justify-between text-xs text-luxury-muted uppercase tracking-wider">
              <span>Total Dossiers</span>
              <Calendar className="w-4 h-4 text-luxury-gold" />
            </div>
            <div className="font-serif text-3xl text-luxury-text font-semibold">
              {stats.totalBookings}
            </div>
            <p className="text-[11px] text-luxury-muted">
              Synchronisés Web & Mobile
            </p>
          </div>

          <div className="p-6 editorial-card space-y-2">
            <div className="flex items-center justify-between text-xs text-luxury-muted uppercase tracking-wider">
              <span> séjours Confirmés</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-serif text-3xl text-luxury-text font-semibold">
              {stats.confirmedCount}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              Prêts pour le Check-in (14h00)
            </p>
          </div>

          <div className="p-6 editorial-card space-y-2">
            <div className="flex items-center justify-between text-xs text-luxury-muted uppercase tracking-wider">
              <span>En Attente Conciergerie</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-serif text-3xl text-luxury-text font-semibold">
              {stats.pendingCount}
            </div>
            <p className="text-[11px] text-luxury-muted">
              Demandes navette ou salle VIP
            </p>
          </div>
        </div>

        {/* Search & Status Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-luxury-surface border border-luxury-border">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: `Toutes (${bookings.length})` },
              { id: 'CONFIRMED', label: 'Confirmées' },
              { id: 'PENDING_CONCIERGE', label: 'En Attente' },
              { id: 'CANCELLED', label: 'Annulées' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all border ${
                  statusFilter === tab.id
                    ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-text border-luxury-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher réf, nom client, chambre..."
              className="w-full pl-10 pr-4 py-2 bg-luxury-card border border-luxury-border text-xs text-luxury-text focus:outline-none focus:border-luxury-gold"
            />
          </div>
        </div>

        {/* Bookings List Table */}
        <div className="editorial-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-luxury-border bg-luxury-surface text-[10px] uppercase tracking-[0.2em] text-luxury-muted">
                  <th className="py-4 px-5">Référence</th>
                  <th className="py-4 px-5">Client / Résident</th>
                  <th className="py-4 px-5">Chambre ou Suite</th>
                  <th className="py-4 px-5">Dates & Nuits</th>
                  <th className="py-4 px-5">Montant TTC</th>
                  <th className="py-4 px-5">Statut</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-luxury-muted">
                      Chargement des réservations...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-luxury-muted">
                      Aucune réservation ne correspond à votre filtre.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-luxury-surface/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-mono font-bold text-luxury-gold whitespace-nowrap">
                        {booking.referenceCode}
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-luxury-text">
                          {booking.guest.title} {booking.guest.firstName} {booking.guest.lastName}
                        </div>
                        <div className="text-[11px] text-luxury-muted">
                          {booking.guest.phone} • {booking.guest.country}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-medium text-luxury-text max-w-[230px] truncate">
                          {booking.room.name}
                        </div>
                        <div className="text-[11px] text-luxury-muted">
                          {booking.adults} Ad.
                          {booking.children > 0 ? ` + ${booking.children} Enf.` : ''}
                          {booking.addOns.length > 0
                            ? ` • +${booking.addOns.length} option(s)`
                            : ''}
                        </div>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="text-luxury-text">
                          {booking.checkIn} → {booking.checkOut}
                        </div>
                        <div className="text-[11px] text-luxury-muted">
                          {booking.nights} nuit{booking.nights > 1 ? 's' : ''} • Arrivée{' '}
                          {booking.guest.arrivalTime || '14:00'}
                        </div>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-serif text-base font-semibold text-luxury-gold">
                          {formatCurrencyAmount(booking.pricing.totalPrice, currency)}
                        </span>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        {booking.status === 'CONFIRMED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 font-semibold text-[10px] uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmée
                          </span>
                        )}
                        {booking.status === 'PENDING_CONCIERGE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 font-semibold text-[10px] uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            En Attente
                          </span>
                        )}
                        {booking.status === 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 text-red-600 font-semibold text-[10px] uppercase tracking-wider">
                            <XCircle className="w-3 h-3" />
                            Annulée
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="px-3 py-1.5 border border-luxury-border hover:border-luxury-gold text-luxury-text text-[11px] inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-luxury-gold" />
                            <span>Détails</span>
                          </button>

                          {booking.status !== 'CONFIRMED' && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(booking.referenceCode, 'CONFIRMED')
                              }
                              className="px-2.5 py-1.5 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-emerald-700"
                            >
                              Confirmer
                            </button>
                          )}

                          {booking.status !== 'CANCELLED' && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(booking.referenceCode, 'CANCELLED')
                              }
                              className="px-2.5 py-1.5 border border-red-500/40 text-red-600 hover:bg-red-500/10 text-[10px] uppercase tracking-wider"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal Inspection Dossier Complet Admin */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedBooking(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-2xl editorial-card p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-luxury-border">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-luxury-gold font-semibold">
                  FICHE RÉSERVATION COMPLÈTE
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-luxury-text font-normal mt-0.5">
                  Dossier {selectedBooking.referenceCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-9 h-9 border border-luxury-border flex items-center justify-center text-luxury-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-luxury-surface border border-luxury-border text-xs">
              <div className="space-y-1">
                <span className="text-luxury-muted uppercase tracking-wider text-[10px] block">
                  Informations Client
                </span>
                <p className="font-semibold text-sm text-luxury-text">
                  {selectedBooking.guest.title} {selectedBooking.guest.firstName}{' '}
                  {selectedBooking.guest.lastName}
                </p>
                <p className="flex items-center gap-1.5 text-luxury-muted">
                  <Phone className="w-3 h-3 text-luxury-gold" />
                  {selectedBooking.guest.phone}
                </p>
                <p className="flex items-center gap-1.5 text-luxury-muted">
                  <Mail className="w-3 h-3 text-luxury-gold" />
                  {selectedBooking.guest.email}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-luxury-muted uppercase tracking-wider text-[10px] block">
                  Hébergement & Séjour
                </span>
                <p className="font-semibold text-sm text-luxury-text">
                  {selectedBooking.room.name}
                </p>
                <p className="text-luxury-muted">
                  Du {selectedBooking.checkIn} au {selectedBooking.checkOut} (
                  {selectedBooking.nights} nuits)
                </p>
                <p className="text-luxury-muted">
                  Occupants : {selectedBooking.adults} Adulte(s)
                  {selectedBooking.children > 0
                    ? `, ${selectedBooking.children} Enfant(s)`
                    : ''}
                </p>
              </div>
            </div>

            {selectedBooking.addOns.length > 0 && (
              <div className="space-y-2 text-xs">
                <h4 className="uppercase tracking-wider text-[10px] text-luxury-gold font-semibold">
                  Prestations & Options Incluses ({selectedBooking.addOns.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedBooking.addOns.map((addon) => (
                    <div
                      key={addon.id}
                      className="p-2.5 bg-luxury-surface border border-luxury-border flex justify-between"
                    >
                      <span className="text-luxury-text">{addon.title}</span>
                      <span className="text-luxury-gold font-semibold">
                        {formatCurrencyAmount(addon.price, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedBooking.guest.specialRequests && (
              <div className="p-4 bg-luxury-surface border border-luxury-border text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-semibold block">
                  Instructions Spéciales Client
                </span>
                <p className="text-luxury-text italic">
                  « {selectedBooking.guest.specialRequests} »
                </p>
              </div>
            )}

            <div className="p-4 bg-luxury-surface border border-luxury-border flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-luxury-text font-semibold">
                Montant Total TTC
              </span>
              <span className="font-serif text-2xl text-luxury-gold font-semibold">
                {formatCurrencyAmount(selectedBooking.pricing.totalPrice, currency)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleStatusChange(selectedBooking.referenceCode, 'CONFIRMED')
                  }
                  className="px-4 py-2 bg-emerald-600 text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Marquer Confirmée
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(selectedBooking.referenceCode, 'PENDING_CONCIERGE')
                  }
                  className="px-4 py-2 bg-amber-600 text-white text-xs uppercase tracking-wider font-semibold"
                >
                  En Attente
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(selectedBooking.referenceCode, 'CANCELLED')
                  }
                  className="px-4 py-2 border border-red-500/50 text-red-600 text-xs uppercase tracking-wider font-semibold"
                >
                  Annuler
                </button>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 bg-luxury-text text-luxury-bg text-xs uppercase tracking-wider font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
