'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import {
  useAppDispatch,
  useAppSelector,
  loginWithCredentials,
  loginDemoRole,
  registerGuestAccount,
  logoutUser,
  clearAuthError,
  useGetAllBookingsQuery,
  setDrawerOpen
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
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Phone,
  Building2
} from 'lucide-react';

export default function ConnexionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser, authError } = useAppSelector((state) => state.auth);
  const { currency, customHotelName } = useAppSelector((state) => state.ui);
  const { data: bookingsData } = useGetAllBookingsQuery();

  const [portalMode, setPortalMode] = useState<'GUEST' | 'ADMIN'>('GUEST');
  const [isRegistering, setIsRegistering] = useState(false);

  // Login fields
  const [email, setEmail] = useState('k.soglo@entreprise-benin.bj');
  const [password, setPassword] = useState('client2026');

  // Registration fields
  const [regTitle, setRegTitle] = useState<'M.' | 'Mme' | 'Dr.'>('M.');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+229 01 ');

  const handlePortalSwitch = (role: 'GUEST' | 'ADMIN') => {
    setPortalMode(role);
    setIsRegistering(false);
    dispatch(clearAuthError());
    if (role === 'ADMIN') {
      setEmail('direction@marina-hotel-benin.bj');
      setPassword('admin2026');
    } else {
      setEmail('k.soglo@entreprise-benin.bj');
      setPassword('client2026');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginWithCredentials({ email, password }));
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
        phone: regPhone
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

  return (
    <SiteShell>
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        {currentUser ? (
          /* AUTHENTICATED VIEW (CLIENT OR ADMIN) */
          <div className="space-y-10">
            <div className="p-8 editorial-card border-2 border-luxury-gold/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-luxury-gold/15 text-luxury-gold text-[10px] uppercase tracking-[0.22em] font-semibold">
                    {currentUser.role === 'ADMIN'
                      ? 'PORTAIL DIRECTION & RÉCEPTION'
                      : `ESPACE RÉSIDENT • ${currentUser.loyaltyTier || 'MEMBRE PRIVILÈGE'}`}
                  </span>
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

              <div className="flex flex-wrap items-center gap-3">
                {currentUser.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="px-6 py-3.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-luxury-gold" />
                    <span>Ouvrir le Dashboard Admin</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => dispatch(setDrawerOpen(true))}
                    className="px-6 py-3.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-luxury-gold" />
                    <span>Nouvelle Réservation</span>
                  </button>
                )}

                <button
                  onClick={() => dispatch(logoutUser())}
                  className="px-5 py-3.5 border border-luxury-border hover:border-red-500/60 text-luxury-muted hover:text-red-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>

            {/* Role-specific Dashboard Content */}
            {currentUser.role === 'ADMIN' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 editorial-card space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Accès Complet Activé
                  </span>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    Supervision des Réservations
                  </h3>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    Vous disposez des droits complets pour valider, modifier ou annuler les
                    dossiers de réservation des clients de {customHotelName}.
                  </p>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs text-luxury-gold font-semibold pt-2 hover:underline"
                  >
                    <span>Accéder à la liste des {allBookings.length} réservations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 editorial-card space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Catalogue Hôtelier
                  </span>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    6 Chambres & Suites Bénin
                  </h3>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    Toutes les chambres sont configurées en Franc CFA (FCFA) avec galeries multi-photos
                    et fiches techniques détaillées.
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
                    Carte des mets africains (Amiwo, Agoun & Sauce Arachide, Wassawassa, Grillades
                    de Cotonou) active.
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
          /* LOGIN / REGISTER FORM VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 5 Columns: Quick 1-Click Demo Access & Role Selector */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.26em] text-luxury-gold font-semibold block mb-2">
                  AUTHENTIFICATION & ESPACE PERSONNEL
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal leading-tight">
                  Connexion Client & Administration
                </h1>
                <p className="text-xs sm:text-sm text-luxury-muted mt-3 leading-relaxed">
                  Connectez-vous à votre espace résident pour retrouver vos réservations et
                  pré-remplir vos coordonnées, ou accédez au portail Direction pour gérer
                  l’établissement.
                </p>
              </div>

              {/* 1-Click Instant Demo Login Cards */}
              <div className="p-6 editorial-card border-l-2 border-l-luxury-gold space-y-4">
                <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Accès Rapide Démo (1 Clic)</span>
                </div>
                <p className="text-xs text-luxury-muted">
                  Testez immédiatement l’expérience dynamique côté Client ou côté Administrateur :
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => dispatch(loginDemoRole('GUEST'))}
                    className="w-full p-4 bg-luxury-surface hover:bg-luxury-card border border-luxury-border hover:border-luxury-gold text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold block">
                        Compte Client / Résident
                      </span>
                      <span className="font-serif text-lg text-luxury-text block">
                        M. Koffi Soglo (Cotonou)
                      </span>
                      <span className="text-[11px] text-luxury-muted">
                        k.soglo@entreprise-benin.bj • Mot de passe : client2026
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-luxury-gold group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      dispatch(loginDemoRole('ADMIN'));
                      router.push('/admin');
                    }}
                    className="w-full p-4 bg-luxury-surface hover:bg-luxury-card border border-luxury-border hover:border-luxury-gold text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold block">
                        Compte Direction / Administrateur
                      </span>
                      <span className="font-serif text-lg text-luxury-text block">
                        M. Stanislas Adjavon (Directeur)
                      </span>
                      <span className="text-[11px] text-luxury-muted">
                        direction@marina-hotel-benin.bj • Mot de passe : admin2026
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-luxury-gold group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Interactive Login / Registration Card */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-10 editorial-card space-y-6">
                {/* Role Switch Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-luxury-surface border border-luxury-border">
                  <button
                    type="button"
                    onClick={() => handlePortalSwitch('GUEST')}
                    className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all ${
                      portalMode === 'GUEST'
                        ? 'bg-luxury-text text-luxury-bg shadow-sm'
                        : 'text-luxury-muted hover:text-luxury-text'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-luxury-gold" />
                    <span>Espace Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePortalSwitch('ADMIN')}
                    className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all ${
                      portalMode === 'ADMIN'
                        ? 'bg-luxury-text text-luxury-bg shadow-sm'
                        : 'text-luxury-muted hover:text-luxury-text'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-luxury-gold" />
                    <span>Portail Admin</span>
                  </button>
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
                      <h2 className="font-serif text-2xl text-luxury-text">
                        {portalMode === 'ADMIN'
                          ? 'Connexion Direction & Réception'
                          : 'Connexion à votre Compte Client'}
                      </h2>
                      <p className="text-xs text-luxury-muted mt-1">
                        {portalMode === 'ADMIN'
                          ? 'Accès réservé au personnel habilité pour la gestion des réservations.'
                          : 'Retrouvez vos séjours au Bénin et réservez en 1 clic.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-luxury-muted mb-1.5">
                        Adresse Email
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
                      <span>
                        {portalMode === 'ADMIN'
                          ? 'Se Connecter au Portail Admin'
                          : 'Se Connecter à mon Espace Client'}
                      </span>
                    </button>

                    {portalMode === 'GUEST' && (
                      <div className="pt-4 border-t border-luxury-border text-center">
                        <button
                          type="button"
                          onClick={() => setIsRegistering(true)}
                          className="text-xs text-luxury-gold hover:underline font-medium"
                        >
                          Nouveau client ? Créer un compte résident en 30 secondes →
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  /* NEW CLIENT REGISTRATION FORM */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <h2 className="font-serif text-2xl text-luxury-text">
                        Créer votre Compte Client Bénin
                      </h2>
                      <p className="text-xs text-luxury-muted mt-1">
                        Vos informations seront automatiquement utilisées lors de vos réservations.
                      </p>
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
                      Créer mon Compte & Accéder à mon Espace
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
