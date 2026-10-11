'use client';

import React, { useState, useMemo } from 'react';
import { SiteShell } from '@/components/SiteShell';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetRoomsQuery,
  useUpsertRoomMutation,
  useDeleteRoomMutation,
  setDrawerOpen,
  loginDemoRole,
  logoutUser,
  isStaffRole
} from '@hotel/store';
import { formatCurrencyAmount } from '@hotel/config';
import { BookingRecord, Room } from '@hotel/types';
import {
  LayoutDashboard,
  Search,
  Calendar,
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
  LogOut,
  Edit3,
  Trash2,
  Star,
  Upload,
  Save,
  Image as ImageIcon
} from 'lucide-react';

type AdminTab = 'BOOKINGS' | 'ROOMS';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { currency, customHotelName } = useAppSelector((state) => state.ui);
  const { currentUser } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useGetAllBookingsQuery();
  const { data: roomsData, isLoading: isLoadingRooms } = useGetRoomsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [upsertRoom, { isLoading: isSavingRoom }] = useUpsertRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const [activeTab, setActiveTab] = useState<AdminTab>('BOOKINGS');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingRecord['status']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Room Editor Modal State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState('');
  const [roomSubtitle, setRoomSubtitle] = useState('');
  const [roomCategory, setRoomCategory] = useState<Room['category']>('SIGNATURE_SUITE');
  const [roomPrice, setRoomPrice] = useState<number>(125000);
  const [roomSize, setRoomSize] = useState<number>(52);
  const [roomMaxGuests, setRoomMaxGuests] = useState<number>(2);
  const [roomBedConfig, setRoomBedConfig] = useState('1 Lit King Size');
  const [roomFloor, setRoomFloor] = useState('4ème Étage');
  const [roomView, setRoomView] = useState('Vue Océan & Piscine');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomAmenitiesText, setRoomAmenitiesText] = useState(
    'Climatisation Individuelle, Wi-Fi Fibre Haut Débit, Smart TV 4K Canal+, Petit-déjeuner Buffet Inclus'
  );
  const [roomRating, setRoomRating] = useState<number>(4.9);
  const [roomHeroImage, setRoomHeroImage] = useState(
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85'
  );
  const [roomGallery, setRoomGallery] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [roomToast, setRoomToast] = useState<string | null>(null);

  const bookings = data?.bookings || [];
  const rooms = roomsData?.rooms || [];

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

  const openAddRoomModal = () => {
    setEditingRoomId(null);
    setRoomName('');
    setRoomSubtitle('Chambre Haut Standing climatisée avec vue panoramique sur Cotonou');
    setRoomCategory('SIGNATURE_SUITE');
    setRoomPrice(135000);
    setRoomSize(48);
    setRoomMaxGuests(2);
    setRoomBedConfig('1 Lit King Size');
    setRoomFloor('5ème Étage');
    setRoomView('Vue Océan & Marina');
    setRoomDescription(
      'Chambre spacieuse conçue selon les standards internationaux des hôtels 5 étoiles du Bénin. Espace bureau exécutif, literie orthopédique King Size, salle de bain en marbre et terrasse privative.'
    );
    setRoomAmenitiesText(
      'Climatisation Individuelle, Wi-Fi Fibre Haut Débit, Smart TV 4K Canal+, Petit-déjeuner Buffet Inclus, Coffre-fort Digital'
    );
    setRoomRating(4.9);
    const defaultImg =
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85';
    setRoomHeroImage(defaultImg);
    setRoomGallery([
      defaultImg,
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=80'
    ]);
    setIsRoomModalOpen(true);
  };

  const openEditRoomModal = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomName(room.name);
    setRoomSubtitle(room.subtitle);
    setRoomCategory(room.category);
    setRoomPrice(room.pricePerNight);
    setRoomSize(room.sizeSqm);
    setRoomMaxGuests(room.maxGuests);
    setRoomBedConfig(room.bedConfiguration);
    setRoomFloor(room.floorLevel);
    setRoomView(room.viewLabel);
    setRoomDescription(room.description);
    setRoomAmenitiesText(room.amenities.map((a) => a.label).join(', '));
    setRoomRating(room.rating || 4.9);
    setRoomHeroImage(room.heroImage);
    setRoomGallery(room.gallery && room.gallery.length > 0 ? room.gallery : [room.heroImage]);
    setIsRoomModalOpen(true);
  };

  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setRoomGallery((prev) => [...prev, dataUrl]);
          if (!roomHeroImage) {
            setRoomHeroImage(dataUrl);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddGalleryUrl = () => {
    const trimmed = newGalleryUrl.trim();
    if (!trimmed) return;
    setRoomGallery((prev) => [...prev, trimmed]);
    if (!roomHeroImage) setRoomHeroImage(trimmed);
    setNewGalleryUrl('');
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    const amenitiesList = roomAmenitiesText
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)
      .map((label, idx) => ({
        id: `amenity-${idx + 1}`,
        label,
        icon: 'Sparkles',
        premium: true
      }));

    const finalGallery =
      roomGallery.length > 0
        ? roomGallery
        : [
            roomHeroImage ||
              'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85'
          ];

    await upsertRoom({
      ...(editingRoomId ? { id: editingRoomId } : {}),
      name: roomName.trim(),
      subtitle: roomSubtitle.trim(),
      category: roomCategory,
      pricePerNight: Number(roomPrice) || 95000,
      sizeSqm: Number(roomSize) || 40,
      maxGuests: Number(roomMaxGuests) || 2,
      bedConfiguration: roomBedConfig.trim(),
      floorLevel: roomFloor.trim(),
      viewType: 'OCEAN_PANORAMA',
      viewLabel: roomView.trim(),
      description: roomDescription.trim(),
      amenities: amenitiesList,
      highlights: amenitiesList.slice(0, 3).map((a) => a.label),
      isFeatured: true,
      heroImage: finalGallery[0],
      gallery: finalGallery,
      rating: Number(roomRating) || 4.9
    }).unwrap();

    setIsRoomModalOpen(false);
    setRoomToast(
      editingRoomId
        ? `✓ La chambre « ${roomName} » a été mise à jour avec succès.`
        : `✓ La nouvelle chambre « ${roomName} » a été ajoutée au catalogue.`
    );
    setTimeout(() => setRoomToast(null), 4500);
  };

  const handleDeleteRoom = async (room: Room) => {
    await deleteRoom({ id: room.id });
    setRoomToast(`Chambre « ${room.name} » retirée du catalogue.`);
    setTimeout(() => setRoomToast(null), 3500);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-luxury-border">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-[0.24em] font-semibold mb-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>DIRECTION & RÉCEPTION • PORTAIL ADMINISTRATEUR</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
              Administration — {customHotelName}
            </h1>
            <p className="text-xs sm:text-sm text-luxury-muted mt-1">
              Gérez les réservations clients et ajoutez ou modifiez les chambres, tarifs FCFA,
              étoiles et galeries photos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openAddRoomModal}
              className="px-5 py-3 rounded-full border border-luxury-gold text-luxury-text hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.15em] font-semibold flex items-center gap-2 transition-colors"
            >
              <BedDouble className="w-4 h-4 text-luxury-gold" />
              <span>+ Ajouter une Chambre</span>
            </button>
            <button
              onClick={() => dispatch(setDrawerOpen(true))}
              className="px-5 py-3 rounded-full bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.15em] font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-luxury-gold" />
              <span>Nouvelle Réservation</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs: 1. Réservations | 2. Gestion des Chambres */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-luxury-border pb-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('BOOKINGS')}
              className={`px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 border transition-all ${
                activeTab === 'BOOKINGS'
                  ? 'bg-luxury-text text-luxury-bg border-luxury-text'
                  : 'bg-luxury-surface text-luxury-muted hover:text-luxury-text border-luxury-border'
              }`}
            >
              <Calendar className="w-4 h-4 text-luxury-gold" />
              <span>1. Réservations Clients ({bookings.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ROOMS')}
              className={`px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 border transition-all ${
                activeTab === 'ROOMS'
                  ? 'bg-luxury-text text-luxury-bg border-luxury-text'
                  : 'bg-luxury-surface text-luxury-muted hover:text-luxury-text border-luxury-border'
              }`}
            >
              <BedDouble className="w-4 h-4 text-luxury-gold" />
              <span>2. Catalogue & Édition des Chambres ({rooms.length})</span>
            </button>
          </div>

          {roomToast && (
            <div className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 text-xs font-semibold">
              {roomToast}
            </div>
          )}
        </div>

        {activeTab === 'BOOKINGS' ? (
          <>
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
                <p className="text-[11px] text-luxury-muted">Synchronisés Web & Mobile</p>
              </div>

              <div className="p-6 editorial-card space-y-2">
                <div className="flex items-center justify-between text-xs text-luxury-muted uppercase tracking-wider">
                  <span>Séjours Confirmés</span>
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
                <p className="text-[11px] text-luxury-muted">Demandes navette ou salle VIP</p>
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
                              {booking.guest.title} {booking.guest.firstName}{' '}
                              {booking.guest.lastName}
                            </div>
                            <div className="text-[11px] text-luxury-muted">
                              {booking.guest.phone} • {booking.guest.country}
                            </div>
                          </td>

                          <td className="py-4 px-5">
                            <div className="font-medium text-luxury-text max-w-[230px] truncate flex items-center gap-1.5">
                              <span>{booking.room.name}</span>
                              <span className="text-amber-500 text-[10px] font-semibold">
                                ★ {(booking.room.rating || 4.9).toFixed(1)}
                              </span>
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
          </>
        ) : (
          /* TAB 2: ROOM CATALOG MANAGEMENT (ADD / EDIT ROOMS) */
          <div className="space-y-6">
            <div className="p-6 bg-luxury-surface border border-luxury-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold">
                  GESTION DYNAMIQUE DU CATALOGUE HÔTELIER
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-luxury-text mt-0.5">
                  Ajouter ou Éditer les Informations des Chambres ({rooms.length})
                </h2>
                <p className="text-xs text-luxury-muted mt-1">
                  Modifiez les titres, tarifs en FCFA, superficies, équipements, notes d’étoiles et
                  galeries photos de chaque chambre.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddRoomModal}
                className="px-5 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2 shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4 text-luxury-gold" />
                <span>Ajouter une Nouvelle Chambre</span>
              </button>
            </div>

            {isLoadingRooms ? (
              <div className="p-12 text-center text-luxury-muted text-sm">
                Chargement du catalogue des chambres...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="editorial-card overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-black overflow-hidden">
                        <img
                          src={room.heroImage}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 text-amber-300 text-[10px] uppercase tracking-widest font-semibold">
                          {room.floorLevel}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 text-amber-300 text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{(room.rating || 4.9).toFixed(1)}</span>
                          <span className="text-[10px] text-stone-300">
                            ({room.reviewsCount || 6})
                          </span>
                        </span>
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                          <div>
                            <h3 className="font-serif text-xl leading-tight">{room.name}</h3>
                            <span className="text-[10px] text-stone-300">
                              {room.sizeSqm} m² • Max {room.maxGuests} pers. •{' '}
                              {room.gallery?.length || 1} photos
                            </span>
                          </div>
                          <span className="font-serif text-lg text-amber-300 font-semibold">
                            {formatCurrencyAmount(room.pricePerNight, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3 text-xs">
                        <p className="text-luxury-text font-medium line-clamp-1">
                          {room.subtitle}
                        </p>
                        <p className="text-luxury-muted line-clamp-2 leading-relaxed">
                          {room.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-luxury-surface border-t border-luxury-border flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openEditRoomModal(room)}
                        className="flex-1 py-2.5 px-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Éditer Infos & Photos</span>
                      </button>

                      <Link
                        href={`/suites/${room.slug}`}
                        className="py-2.5 px-3 border border-luxury-border hover:border-luxury-gold text-luxury-text text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Voir</span>
                      </Link>

                      {room.id.startsWith('room-custom-') && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room)}
                          className="p-2.5 border border-red-500/40 text-red-500 hover:bg-red-500/10"
                          title="Supprimer cette chambre"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal Add / Edit Room Info & Photos */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsRoomModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-3xl editorial-card p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-luxury-border">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-luxury-gold font-semibold">
                  {editingRoomId ? 'ÉDITION DE CHAMBRE EXISTANTE' : 'CRÉATION D’UNE NOUVELLE CHAMBRE'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-luxury-text font-normal mt-0.5">
                  {editingRoomId ? `Modifier : ${roomName}` : 'Ajouter une Chambre au Catalogue'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(false)}
                className="w-9 h-9 border border-luxury-border flex items-center justify-center text-luxury-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                    Nom de la Chambre ou Suite *
                  </label>
                  <input
                    required
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Ex: Suite Royale Ganvié Vue Mer"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={roomCategory}
                    onChange={(e) => setRoomCategory(e.target.value as Room['category'])}
                    className="w-full px-3 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                  >
                    <option value="SIGNATURE_SUITE">Chambre Classique / Supérieure</option>
                    <option value="ROYAL_PENTHOUSE">Suite Exécutive / Présidentielle</option>
                    <option value="PRIVATE_VILLA">Villa & Pavillon Bord de Mer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                    Prix / Nuit (FCFA) *
                  </label>
                  <input
                    required
                    type="number"
                    min={20000}
                    step={5000}
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                    Superficie (m²)
                  </label>
                  <input
                    type="number"
                    min={15}
                    value={roomSize}
                    onChange={(e) => setRoomSize(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                    Capacité Max
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={roomMaxGuests}
                    onChange={(e) => setRoomMaxGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-amber-500 font-semibold mb-1">
                    Étoiles (Note / 5) ★
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={roomRating}
                    onChange={(e) => setRoomRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                    Configuration Literie
                  </label>
                  <input
                    type="text"
                    value={roomBedConfig}
                    onChange={(e) => setRoomBedConfig(e.target.value)}
                    placeholder="1 Lit King Size"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                    Étage / Emplacement
                  </label>
                  <input
                    type="text"
                    value={roomFloor}
                    onChange={(e) => setRoomFloor(e.target.value)}
                    placeholder="5ème Étage"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                    Orientation / Vue
                  </label>
                  <input
                    type="text"
                    value={roomView}
                    onChange={(e) => setRoomView(e.target.value)}
                    placeholder="Vue Océan & Marina"
                    className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Accroche / Sous-titre
                </label>
                <input
                  type="text"
                  value={roomSubtitle}
                  onChange={(e) => setRoomSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Description Détaillée de la Chambre
                </label>
                <textarea
                  rows={3}
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Équipements Inclus (séparés par une virgule)
                </label>
                <input
                  type="text"
                  value={roomAmenitiesText}
                  onChange={(e) => setRoomAmenitiesText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                />
              </div>

              {/* Multi-Photo Gallery Manager */}
              <div className="p-4 bg-luxury-surface border border-luxury-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Galerie Photos de la Chambre ({roomGallery.length} photos)</span>
                  </span>

                  <label className="cursor-pointer px-3 py-1.5 bg-luxury-card hover:bg-luxury-gold hover:text-white border border-luxury-gold text-luxury-text text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Importer des Photos depuis l’appareil</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleRoomPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Ou coller l’URL d’une photo (https://...)"
                    className="flex-1 px-3 py-2 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-4 py-2 bg-luxury-text text-luxury-bg text-xs font-semibold uppercase tracking-wider"
                  >
                    + Ajouter URL
                  </button>
                </div>

                {roomGallery.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-2">
                    {roomGallery.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative h-20 border overflow-hidden group ${
                          roomHeroImage === img
                            ? 'border-luxury-gold ring-2 ring-luxury-gold'
                            : 'border-luxury-border'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setRoomHeroImage(img)}
                            className="px-1.5 py-0.5 bg-amber-400 text-black text-[9px] font-bold uppercase"
                          >
                            Principale
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setRoomGallery((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="p-1 bg-red-600 text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/75 text-amber-300 text-[8px] uppercase">
                            Photo #1
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-border">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-5 py-2.5 border border-luxury-border text-luxury-muted hover:text-luxury-text text-xs uppercase tracking-wider"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingRoom}
                  className="px-6 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4 text-luxury-gold" />
                  <span>
                    {editingRoomId ? 'Enregistrer les Modifications' : 'Créer la Chambre'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  {selectedBooking.room.name} (★ {(selectedBooking.room.rating || 4.9).toFixed(1)})
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
                  Instructions Spéciales & Référence Paiement
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
