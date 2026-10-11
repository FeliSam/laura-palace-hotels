'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
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
  setDrawerOpen,
  UserRole,
  DEMO_USERS,
  isStaffRole
} from '@hotel/store';
import { formatCurrencyAmount } from '@hotel/config';
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
  Save
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
    description: 'Consultez vos réservations, vos factures FCFA et réservez en 1 clic.',
    icon: UserCheck,
    badgeColor: 'text-luxury-gold border-luxury-gold/40 bg-luxury-gold/10'
  },
  {
    role: 'DIRECTEUR',
    shortLabel: 'Directeur',
    title: 'Portail Directeur Général',
    description: 'Supervision exécutive du chiffre d’affaires, taux d’occupation et réservations VIP.',
    icon: Crown,
    badgeColor: 'text-amber-500 border-amber-500/40 bg-amber-500/10'
  },
  {
    role: 'ADMIN',
    shortLabel: 'Administrateur',
    title: 'Portail Administrateur Hôtel',
    description: 'Gestion complète des réservations, du catalogue des chambres et de la tarification.',
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

  const allBookings = bookingsData?.bookings || [];
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
                      <span>Dashboard Réservations</span>
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

            {/* Staff View (Directeur, Admin, Réception) */}
            {isStaff ? (
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

                <div className="p-6 editorial-card space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Catalogue & Fiches Chambres
                  </span>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    6 Chambres & Suites Bénin
                  </h3>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    Toutes les chambres sont configurées en Franc CFA (FCFA) avec galeries de 5
                    photos haute résolution et fiches techniques dédiées.
                  </p>
                  <Link
                    href="/suites"
                    className="inline-flex items-center gap-1.5 text-xs text-luxury-gold font-semibold pt-2 hover:underline"
                  >
                    <span>Inspecter les chambres</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 editorial-card space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Restauration & Carte
                  </span>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    Gastronomie Béninoise
                  </h3>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    Carte des mets africains (Amiwo Royal, Agoun & Sauce Arachide, Wassawassa,
                    Grillades de Cotonou) en service continu.
                  </p>
                  <Link
                    href="/experiences"
                    className="inline-flex items-center gap-1.5 text-xs text-luxury-gold font-semibold pt-2 hover:underline"
                  >
                    <span>Voir la carte culinaire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* CLIENT PERSONAL BOOKINGS LIST */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold block">
                      HISTORIQUE & SÉJOURS À VENIR
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-luxury-text">
                      Mes Réservations ({userBookings.length})
                    </h2>
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
                    {userBookings.map((booking) => (
                      <div key={booking.id} className="editorial-card overflow-hidden flex flex-col">
                        <div className="relative h-44 bg-black">
                          <img
                            src={booking.room.heroImage}
                            alt={booking.room.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/75 text-amber-300 font-mono text-xs font-bold">
                            Réf: {booking.referenceCode}
                          </span>
                          <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-semibold">
                            {booking.status === 'CONFIRMED' ? 'Confirmée' : 'En Attente'}
                          </span>
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="font-serif text-xl">{booking.room.name}</h3>
                            <p className="text-xs text-stone-200">
                              Du {booking.checkIn} au {booking.checkOut} ({booking.nights} nuits)
                            </p>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs">
                          <div className="space-y-1.5 text-luxury-muted">
                            <div className="flex justify-between">
                              <span>Occupants :</span>
                              <span className="text-luxury-text font-medium">
                                {booking.adults} Adulte(s)
                                {booking.children > 0 ? `, ${booking.children} Enfant(s)` : ''}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Heure d’arrivée prévue :</span>
                              <span className="text-luxury-text font-medium">
                                {booking.guest.arrivalTime || '14:00'}
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

                          <div className="flex items-center justify-between pt-2">
                            <Link
                              href={`/suites/${booking.room.slug}`}
                              className="text-luxury-gold hover:underline font-medium"
                            >
                              Revoir les détails de la chambre →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
              <div className="p-6 editorial-card border-l-2 border-l-luxury-gold space-y-4">
                <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Connexion Rapide Démo (1 Clic)</span>
                </div>
                <p className="text-xs text-luxury-muted">
                  Cliquez sur l’un des 4 profils ci-dessous pour tester immédiatement ses droits :
                </p>

                <div className="space-y-2.5">
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
                        className="w-full p-3.5 bg-luxury-surface hover:bg-luxury-card border border-luxury-border hover:border-luxury-gold text-left transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                              {item.shortLabel}
                            </span>
                          </div>
                          <span className="font-serif text-base text-luxury-text block">
                            {demo.title} {demo.firstName} {demo.lastName}
                          </span>
                          <span className="text-[11px] text-luxury-muted block">
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
              <div className="p-6 sm:p-10 editorial-card space-y-6">
                {/* 4 Role Tabs */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-muted mb-2">
                    Choisissez votre profil de connexion
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-luxury-surface border border-luxury-border">
                    {ROLE_OPTIONS.map((item) => {
                      const Icon = item.icon;
                      const active = selectedRole === item.role;
                      return (
                        <button
                          type="button"
                          key={item.role}
                          onClick={() => handleRoleSwitch(item.role)}
                          className={`py-2.5 px-2 text-[10px] uppercase tracking-wider font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
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
                  <div className="p-4 bg-red-500/15 border border-red-500/40 text-xs text-luxury-text flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {!isRegistering ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                        PROFIL SÉLECTIONNÉ : {activeRoleMeta.shortLabel}
                      </span>
                      <h2 className="font-serif text-2xl text-luxury-text mt-0.5">
                        {activeRoleMeta.title}
                      </h2>
                      <p className="text-xs text-luxury-muted mt-1">
                        {activeRoleMeta.description}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-luxury-muted mb-1.5">
                        Adresse Email Professionnelle ou Personnelle
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-luxury-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-luxury-surface border border-luxury-border text-sm text-luxury-text"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-luxury-muted mb-1.5">
                        Mot de Passe
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-luxury-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-luxury-surface border border-luxury-border text-sm text-luxury-text"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Lock className="w-4 h-4 text-luxury-gold" />
                      <span>Se Connecter ({activeRoleMeta.shortLabel})</span>
                    </button>

                    <div className="pt-4 border-t border-luxury-border text-center">
                      <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="text-xs text-luxury-gold hover:underline font-medium"
                      >
                        Créer un nouveau compte utilisateur (Client, Directeur, Admin ou Réception) →
                      </button>
                    </div>
                  </form>
                ) : (
                  /* NEW ACCOUNT REGISTRATION FORM (ANY ROLE) */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <h2 className="font-serif text-2xl text-luxury-text">
                        Créer un Nouveau Compte Utilisateur
                      </h2>
                      <p className="text-xs text-luxury-muted mt-1">
                        Choisissez votre rôle (Client, Directeur, Administrateur ou Réception) et
                        vos coordonnées.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-luxury-gold font-semibold mb-1">
                        Type de Compte / Fonction
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                      >
                        <option value="GUEST">Client / Résident de l’Hôtel</option>
                        <option value="DIRECTEUR">Directeur Général / Direction</option>
                        <option value="ADMIN">Administrateur Hôtel</option>
                        <option value="RECEPTION">Chef de Réception & Conciergerie</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                          Civilité
                        </label>
                        <select
                          value={regTitle}
                          onChange={(e) => setRegTitle(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        >
                          <option value="M.">M.</option>
                          <option value="Mme">Mme</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                          Prénom *
                        </label>
                        <input
                          required
                          type="text"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Ex: Chimène"
                          className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                        Nom de Famille *
                      </label>
                      <input
                        required
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="Ex: Zinsou"
                        className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                          Email *
                        </label>
                        <input
                          required
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="votre@email.bj"
                          className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-luxury-muted mb-1">
                          Téléphone / WhatsApp *
                        </label>
                        <input
                          required
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
                    >
                      Créer mon Compte & Accéder au Portail
                    </button>

                    <div className="pt-2 text-center">
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
    </SiteShell>
  );
}
