'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { EditBookingModal } from '@/components/EditBookingModal';
import {
  useAppDispatch,
  useAppSelector,
  loginWithCredentials,
  loginDemoRole,
  registerGuestAccount,
  updateUserProfile,
  updateGuestInfo,
  logoutUser,
  clearAuthError,
  useGetAllBookingsQuery,
  useGetRoomsQuery,
  useGetReviewsQuery,
  useAddRoomReviewMutation,
  setDrawerOpen,
  UserRole,
  DEMO_USERS,
  isStaffRole
} from '@hotel/store';
import { formatCurrencyAmount } from '@hotel/config';
import { BookingRecord } from '@hotel/types';
import {
  UserCheck,
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  Calendar,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  Phone,
  Building2,
  Crown,
  ConciergeBell,
  Edit3,
  Save,
  Star,
  Camera,
  Upload,
  X,
  CheckCircle2,
  BedDouble
} from 'lucide-react';

const ROLE_OPTIONS: {
  role: UserRole;
  shortLabel: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  {
    role: 'GUEST',
    shortLabel: 'Client / Résident',
    title: 'Espace Client & Résident',
    description: 'Consultez vos réservations, laissez vos avis avec photos et réservez en 1 clic.',
    icon: UserCheck,
    badgeColor: 'text-luxury-gold border-luxury-gold/40 bg-luxury-gold/10'
  },
  {
    role: 'DIRECTEUR',
    shortLabel: 'Directeur',
    title: 'Portail Directeur Général',
    description: 'Supervision exécutive du chiffre d’affaires, catalogue chambres et réservations VIP.',
    icon: Crown,
    badgeColor: 'text-amber-500 border-amber-500/40 bg-amber-500/10'
  },
  {
    role: 'ADMIN',
    shortLabel: 'Administrateur',
    title: 'Portail Administrateur Hôtel',
    description: 'Gestion complète des réservations, ajout/édition des chambres et tarification.',
    icon: LayoutDashboard,
    badgeColor: 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10'
  },
  {
    role: 'RECEPTION',
    shortLabel: 'Réception & Concierge',
    title: 'Portail Réception & Check-in',
    description: 'Validation des arrivées du jour, attribution des chambres et demandes navette.',
    icon: ConciergeBell,
    badgeColor: 'text-sky-500 border-sky-500/40 bg-sky-500/10'
  }
];

export default function ConnexionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, authError } = useAppSelector((state) => state.auth);
  const { currency } = useAppSelector((state) => state.ui);
  const { data: bookingsData } = useGetAllBookingsQuery();
  const { data: roomsData } = useGetRoomsQuery();
  const { data: reviewsData } = useGetReviewsQuery();
  const [addRoomReview, { isLoading: isSubmittingReview }] = useAddRoomReviewMutation();

  const [selectedRole, setSelectedRole] = useState<UserRole>('GUEST');
  const [isRegistering, setIsRegistering] = useState(false);

  // Login fields
  const [email, setEmail] = useState(DEMO_USERS.GUEST.email);
  const [password, setPassword] = useState(DEMO_USERS.GUEST.passwordHint);

  // Registration fields
  const [regTitle, setRegTitle] = useState<'M.' | 'Mme' | 'Dr.'>('M.');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+229 01 ');
  const [regRole, setRegRole] = useState<UserRole>('GUEST');

  // Edit Personal Info fields when logged in
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editTitle, setEditTitle] = useState<'M.' | 'Mme' | 'Dr.'>('M.');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('GUEST');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Rented Room Review & Photo Upload Modal State
  const [reviewingBooking, setReviewingBooking] = useState<BookingRecord | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [reviewPhotoUrlInput, setReviewPhotoUrlInput] = useState('');
  const [reviewSuccessToast, setReviewSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setEditTitle(currentUser.title);
      setEditFirstName(currentUser.firstName);
      setEditLastName(currentUser.lastName);
      setEditEmail(currentUser.email);
      setEditPhone(currentUser.phone);
      setEditCountry(currentUser.country);
      setEditRole(currentUser.role);
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
        country: editCountry.trim() || 'Bénin',
        role: editRole
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

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    setIsRegistering(false);
    dispatch(clearAuthError());
    const demoUser = DEMO_USERS[role];
    setEmail(demoUser.email);
    setPassword(demoUser.passwordHint);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginWithCredentials({ email, password, role: selectedRole }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail) return;
    dispatch(
      registerGuestAccount({
        title: regTitle,
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        phone: regPhone,
        role: regRole
      })
    );
  };

  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setReviewPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddReviewPhotoUrl = () => {
    const trimmed = reviewPhotoUrlInput.trim();
    if (!trimmed) return;
    setReviewPhotos((prev) => [...prev, trimmed]);
    setReviewPhotoUrlInput('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking || !currentUser || !reviewComment.trim()) return;

    await addRoomReview({
      roomId: reviewingBooking.room.id,
      roomSlug: reviewingBooking.room.slug,
      roomName: reviewingBooking.room.name,
      authorName: `${currentUser.title} ${currentUser.firstName} ${currentUser.lastName}`,
      authorEmail: currentUser.email,
      authorBadge: `Séjour Vérifié • Réf ${reviewingBooking.referenceCode}`,
      rating: reviewRating,
      comment: reviewComment.trim(),
      photos: reviewPhotos,
      stayDate: `Séjour du ${reviewingBooking.checkIn}`
    }).unwrap();

    const roomTitle = reviewingBooking.room.name;
    setReviewingBooking(null);
    setReviewComment('');
    setReviewPhotos([]);
    setReviewRating(5);
    setReviewSuccessToast(
      `✓ Merci ! Votre avis (${reviewRating}/5 ★) sur « ${roomTitle} » a été publié.`
    );
    setTimeout(() => setReviewSuccessToast(null), 5000);
  };

  const allBookings = bookingsData?.bookings || [];
  const allRooms = roomsData?.rooms || [];
  const allReviews = reviewsData?.reviews || [];

  const userBookings = currentUser
    ? allBookings.filter(
        (b) =>
          b.guest.email.toLowerCase() === currentUser.email.toLowerCase() ||
          b.guest.lastName.toLowerCase() === currentUser.lastName.toLowerCase()
      )
    : [];

  const isStaff = isStaffRole(currentUser?.role);
  const activeRoleMeta =
    ROLE_OPTIONS.find((r) => r.role === selectedRole) || ROLE_OPTIONS[0];

  return (
    <SiteShell>
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        {currentUser ? (
          /* AUTHENTICATED VIEW (CLIENT, DIRECTEUR, ADMIN, RECEPTION) */
          <div className="space-y-10">
            <div className="p-8 editorial-card border-2 border-luxury-gold/40 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-luxury-gold/15 text-luxury-gold text-[10px] uppercase tracking-[0.22em] font-semibold">
                      {currentUser.roleLabel}
                    </span>
                    {profileSavedToast && (
                      <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 text-[10px] font-semibold">
                        ✓ Vos informations ont été mises à jour
                      </span>
                    )}
                    {reviewSuccessToast && (
                      <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 text-[10px] font-semibold">
                        {reviewSuccessToast}
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-3xl sm:text-5xl text-luxury-text">
                    Bienvenue, {currentUser.title} {currentUser.firstName} {currentUser.lastName}
                  </h1>
                  <p className="text-xs sm:text-sm text-luxury-muted flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-luxury-gold" />
                      {currentUser.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-luxury-gold" />
                      {currentUser.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-luxury-gold" />
                      {currentUser.country}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-4 py-3 border border-luxury-gold text-luxury-text hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-luxury-gold" />
                    <span>{isEditingProfile ? 'Fermer' : 'Modifier mes Infos'}</span>
                  </button>

                  {isStaff ? (
                    <Link
                      href="/admin"
                      className="px-5 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-luxury-gold" />
                      <span>Dashboard & Gestion Chambres</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => dispatch(setDrawerOpen(true))}
                      className="px-5 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-luxury-gold" />
                      <span>Nouvelle Réservation</span>
                    </button>
                  )}

                  <button
                    onClick={() => dispatch(logoutUser())}
                    className="px-4 py-3 border border-luxury-border hover:border-red-500/60 text-luxury-muted hover:text-red-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>

              {/* Editable Personal Information Form */}
              {isEditingProfile && (
                <form
                  onSubmit={handleSaveProfile}
                  className="p-6 bg-luxury-surface border border-luxury-border space-y-4 pt-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-luxury-text">
                      Modifier mes Informations Personnelles & Fonction
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                      Mise à jour dynamique
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

                    <div>
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

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                        Profil / Rôle
                      </label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2.5 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                      >
                        <option value="GUEST">Client / Résident</option>
                        <option value="DIRECTEUR">Directeur Général</option>
                        <option value="ADMIN">Administrateur Hôtel</option>
                        <option value="RECEPTION">Chef de Réception</option>
                      </select>
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
                        Pays / Ville
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
                      <span>Enregistrer mes Informations</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Staff Quick Actions (Directeur, Admin, Réception) */}
            {isStaff && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 editorial-card space-y-2 border-l-2 border-l-luxury-gold">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    {currentUser.role === 'DIRECTEUR'
                      ? 'Supervision Direction Générale'
                      : currentUser.role === 'ADMIN'
                      ? 'Administration Système'
                      : 'Accueil & Check-in'}
                  </span>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    Tableau de Bord des Réservations
                  </h3>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    En tant que <strong>{currentUser.roleLabel}</strong>, vous pouvez inspecter,
                    confirmer ou annuler l’ensemble des dossiers clients et suivre les règlements
                    MTN Mobile Money & Carte Bancaire.
                  </p>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs text-luxury-gold font-semibold pt-2 hover:underline"
                  >
                    <span>Gérer les {allBookings.length} réservations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 editorial-card space-y-2 border-l-2 border-l-emerald-500">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">
                    Catalogue & Édition des Chambres
                  </span>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    Ajouter / Modifier les {allRooms.length} Chambres
                  </h3>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    Ajoutez de nouvelles chambres ou éditez les informations, tarifs en FCFA, notes
                    d’étoiles (★) et galeries multi-photos depuis le Dashboard Admin.
                  </p>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs text-luxury-gold font-semibold pt-2 hover:underline"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Ajouter ou Éditer une Chambre →</span>
                  </Link>
                </div>

                <div className="p-6 editorial-card space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Avis Clients & Photos ({allReviews.length})
                  </span>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    Notes d’Étoiles par Chambre
                  </h3>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    Consultez les avis étoilés et les photos publiées par les résidents sur les
                    chambres qu’ils ont louées.
                  </p>
                  <Link
                    href="/suites"
                    className="inline-flex items-center gap-1.5 text-xs text-luxury-gold font-semibold pt-2 hover:underline"
                  >
                    <span>Voir le catalogue étoilé</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* RENTED ROOMS / BOOKINGS LIST WITH "LEAVE REVIEW & PHOTOS" */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold block">
                    CHAMBRES LOUÉES • AVIS & PHOTOS DE SÉJOUR
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-luxury-text">
                    Mes Chambres Réservées ({userBookings.length})
                  </h2>
                  <p className="text-xs text-luxury-muted mt-0.5">
                    Chaque chambre réservée affiche son nombre d’étoiles. Vous pouvez noter votre
                    séjour (1 à 5 ★) et partager vos photos.
                  </p>
                </div>
                <Link
                  href="/suites"
                  className="text-xs uppercase tracking-widest text-luxury-gold hover:underline font-semibold"
                >
                  Parcourir les Chambres →
                </Link>
              </div>

              {userBookings.length === 0 ? (
                <div className="p-10 editorial-card text-center space-y-4">
                  <p className="text-sm text-luxury-muted">
                    Vous n’avez pas encore de réservation enregistrée sous cet email (
                    {currentUser.email}).
                  </p>
                  <Link
                    href="/suites"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-text text-luxury-bg text-xs uppercase tracking-widest font-semibold"
                  >
                    <span>Choisir une Chambre</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userBookings.map((booking) => {
                    const liveRoom =
                      allRooms.find((r) => r.id === booking.room.id) || booking.room;
                    const roomStars = liveRoom.rating || 4.9;
                    const roomReviewsCount = liveRoom.reviewsCount || 6;

                    return (
                      <div
                        key={booking.id}
                        className="editorial-card overflow-hidden flex flex-col"
                      >
                        <div className="relative h-48 bg-black">
                          <img
                            src={liveRoom.heroImage}
                            alt={liveRoom.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 text-amber-300 font-mono text-xs font-bold">
                            Réf: {booking.referenceCode}
                          </span>
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 bg-black/80 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-400/30">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{roomStars.toFixed(1)}</span>
                              <span className="text-[10px] text-stone-300">
                                ({roomReviewsCount})
                              </span>
                            </span>
                            <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-semibold">
                              {booking.status === 'CONFIRMED' ? 'Confirmée' : 'En Attente'}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="font-serif text-xl">{liveRoom.name}</h3>
                            <p className="text-xs text-stone-200">
                              Du {booking.checkIn} au {booking.checkOut} ({booking.nights} nuits)
                            </p>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs">
                          <div className="space-y-1.5 text-luxury-muted">
                            <div className="flex justify-between items-center">
                              <span>Note de la chambre :</span>
                              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < Math.round(roomStars)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-luxury-border'
                                    }`}
                                  />
                                ))}
                                <span className="ml-1 text-luxury-text">
                                  {roomStars.toFixed(1)}/5 ({roomReviewsCount} avis)
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Occupants :</span>
                              <span className="text-luxury-text font-medium">
                                {booking.adults} Adulte(s)
                                {booking.children > 0 ? `, ${booking.children} Enfant(s)` : ''}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-luxury-border">
                              <span className="uppercase tracking-wider text-luxury-text font-semibold">
                                Total TTC :
                              </span>
                              <span className="font-serif text-lg text-luxury-gold font-semibold">
                                {formatCurrencyAmount(booking.pricing.totalPrice, currency)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-luxury-border flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingBooking(booking)}
                                className="px-3.5 py-2 border border-luxury-gold text-luxury-text hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-luxury-gold" />
                                <span>Modifier la Réservation</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setReviewingBooking(booking);
                                  setReviewRating(5);
                                  setReviewComment('');
                                  setReviewPhotos([]);
                                }}
                                className="px-3.5 py-2 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Camera className="w-3.5 h-3.5 text-luxury-gold" />
                                <span>★ Avis & Photos</span>
                              </button>
                            </div>

                            <Link
                              href={`/suites/${liveRoom.slug}#avis-clients`}
                              className="text-luxury-gold hover:underline font-medium text-[11px]"
                            >
                              Voir la chambre →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MULTI-ROLE LOGIN / REGISTER VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 5 Columns: 4 Role Profiles with 1-Click Instant Access */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.26em] text-luxury-gold font-semibold block mb-2">
                  PORTAIL MULTI-PROFILS • BÉNIN
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal leading-tight">
                  Connexion Clients, Direction & Équipes
                </h1>
                <p className="text-xs sm:text-sm text-luxury-muted mt-3 leading-relaxed">
                  Sélectionnez votre profil pour accéder à votre espace personnel (Client/Résident)
                  ou aux outils de gestion de l’établissement (Directeur Général, Administrateur,
                  Réception).
                </p>
              </div>

              {/* 1-Click Demo Cards for all 4 Roles */}
              <div className="p-4 sm:p-6 editorial-card border-l-2 border-l-luxury-gold space-y-3">
                <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Connexion Rapide Démo (1 Clic)</span>
                </div>
                <p className="text-xs text-luxury-muted">
                  Sélectionnez un profil pour tester immédiatement ses droits :
                </p>

                <div className="space-y-2">
                  {ROLE_OPTIONS.map((item) => {
                    const demo = DEMO_USERS[item.role];
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.role}
                        onClick={() => {
                          dispatch(loginDemoRole(item.role));
                          if (isStaffRole(item.role)) {
                            router.push('/admin');
                          }
                        }}
                        className="w-full p-3 bg-luxury-surface hover:bg-luxury-card border border-luxury-border hover:border-luxury-gold text-left transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-0.5 pr-2 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                              {item.shortLabel}
                            </span>
                          </div>
                          <span className="font-serif text-sm sm:text-base text-luxury-text block truncate">
                            {demo.title} {demo.firstName} {demo.lastName}
                          </span>
                          <span className="text-[11px] text-luxury-muted block truncate">
                            {demo.email}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-luxury-gold shrink-0 group-hover:translate-x-1 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Role Selector + Login / Registration Form */}
            <div className="lg:col-span-7">
              <div className="p-4 sm:p-8 editorial-card space-y-5">
                {/* 4 Role Tabs */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-2">
                    Profil de connexion
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-luxury-surface border border-luxury-border">
                    {ROLE_OPTIONS.map((item) => {
                      const Icon = item.icon;
                      const active = selectedRole === item.role;
                      return (
                        <button
                          type="button"
                          key={item.role}
                          onClick={() => handleRoleSwitch(item.role)}
                          className={`py-2 px-2 text-[10px] uppercase tracking-wider font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            active
                              ? 'bg-luxury-text text-luxury-bg shadow-sm'
                              : 'text-luxury-muted hover:text-luxury-text'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-luxury-gold" />
                          <span className="truncate max-w-full">{item.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {authError && (
                  <div className="p-3 bg-red-500/15 border border-red-500/40 text-xs text-luxury-text flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {!isRegistering ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                        PROFIL : {activeRoleMeta.shortLabel}
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl text-luxury-text mt-0.5">
                        {activeRoleMeta.title}
                      </h2>
                      <p className="text-xs text-luxury-muted mt-1">
                        {activeRoleMeta.description}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-luxury-gold absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full min-w-0 pl-9 pr-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs sm:text-sm text-luxury-text"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-1">
                        Mot de Passe
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-luxury-gold absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full min-w-0 pl-9 pr-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs sm:text-sm text-luxury-text"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Lock className="w-4 h-4 text-luxury-gold" />
                      <span>Se Connecter ({activeRoleMeta.shortLabel})</span>
                    </button>

                    <div className="pt-3 border-t border-luxury-border text-center">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="text-xs text-luxury-gold hover:underline font-medium"
                      >
                        Créer un nouveau compte →
                      </button>
                    </div>
                  </form>
                ) : (
                  /* NEW ACCOUNT REGISTRATION FORM (ANY ROLE) */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-luxury-text">
                        Créer un Compte
                      </h2>
                      <p className="text-xs text-luxury-muted mt-0.5">
                        Sélectionnez votre fonction et renseignez vos coordonnées.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                        Fonction / Profil
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                      >
                        <option value="GUEST">Client / Résident</option>
                        <option value="DIRECTEUR">Directeur Général</option>
                        <option value="ADMIN">Administrateur Hôtel</option>
                        <option value="RECEPTION">Chef de Réception</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          Civilité
                        </label>
                        <select
                          value={regTitle}
                          onChange={(e) => setRegTitle(e.target.value as any)}
                          className="w-full px-2.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        >
                          <option value="M.">M.</option>
                          <option value="Mme">Mme</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-3">
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          Prénom *
                        </label>
                        <input
                          required
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Chimène"
                          className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                        Nom *
                      </label>
                      <input
                        required
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="Zinsou"
                        className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          Email *
                        </label>
                        <input
                          required
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="votre@email.bj"
                          className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                          Téléphone / WhatsApp *
                        </label>
                        <input
                          required
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full min-w-0 px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.18em] font-semibold transition-colors"
                    >
                      Créer mon Compte
                    </button>

                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="text-xs text-luxury-muted hover:text-luxury-text"
                      >
                        ← Retour à la connexion
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal: Leave Review & Upload Stay Photos for a Rented Room */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            onClick={() => setReviewingBooking(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-xl editorial-card p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-luxury-border">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-semibold">
                  AVIS & PHOTOS • RÉF {reviewingBooking.referenceCode}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-luxury-text mt-0.5">
                  Noter « {reviewingBooking.room.name} »
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingBooking(null)}
                className="w-9 h-9 border border-luxury-border flex items-center justify-center text-luxury-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-gold font-semibold mb-2">
                  Votre Note Globale (Nombre d’étoiles) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`px-3 py-2 border flex items-center gap-1 transition-all ${
                        reviewRating >= star
                          ? 'bg-amber-500/15 border-amber-500 text-amber-500 font-bold'
                          : 'bg-luxury-surface border-luxury-border text-luxury-muted'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          reviewRating >= star ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                      <span>{star}</span>
                    </button>
                  ))}
                  <span className="ml-2 font-semibold text-luxury-text">
                    {reviewRating} / 5 Étoiles
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-luxury-muted mb-1">
                  Votre Commentaire sur la Chambre & le Service *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Partagez votre expérience concernant le confort de la chambre, la propreté, la vue et l'accueil..."
                  className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-luxury-text"
                />
              </div>

              {/* Upload Photos from Device or URL */}
              <div className="p-4 bg-luxury-surface border border-luxury-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-semibold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Ajouter des Photos de la Chambre ({reviewPhotos.length})</span>
                  </span>

                  <label className="cursor-pointer px-3 py-1.5 bg-luxury-card hover:bg-luxury-gold hover:text-white border border-luxury-gold text-luxury-text text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Choisir des Photos sur mon appareil</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleReviewPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={reviewPhotoUrlInput}
                    onChange={(e) => setReviewPhotoUrlInput(e.target.value)}
                    placeholder="Ou ajouter un lien photo (https://...)"
                    className="flex-1 px-3 py-2 bg-luxury-card border border-luxury-border text-xs text-luxury-text"
                  />
                  <button
                    type="button"
                    onClick={handleAddReviewPhotoUrl}
                    className="px-3.5 py-2 bg-luxury-text text-luxury-bg text-[11px] uppercase tracking-wider font-semibold"
                  >
                    + Ajouter
                  </button>
                </div>

                {reviewPhotos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {reviewPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative h-20 border border-luxury-border overflow-hidden group"
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setReviewPhotos((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingBooking(null)}
                  className="px-4 py-2.5 border border-luxury-border text-luxury-muted hover:text-luxury-text uppercase tracking-wider"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-luxury-gold" />
                  <span>Publier mon Avis & mes Photos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Modify an Existing Reservation */}
      <EditBookingModal
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
        onUpdated={(updated) => {
          setReviewSuccessToast(
            `✓ La réservation ${updated.referenceCode} a été modifiée avec succès.`
          );
          setTimeout(() => setReviewSuccessToast(null), 4500);
        }}
      />
    </SiteShell>
  );
}
