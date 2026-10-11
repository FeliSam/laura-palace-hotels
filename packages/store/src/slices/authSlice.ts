import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'GUEST' | 'DIRECTEUR' | 'ADMIN' | 'RECEPTION';

export interface AuthUser {
  id: string;
  title: 'M.' | 'Mme' | 'Dr.';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  role: UserRole;
  roleLabel: string;
  loyaltyTier?: string;
}

export interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  authError: string | null;
}

export const DEMO_USERS: Record<UserRole, AuthUser & { passwordHint: string }> = {
  GUEST: {
    id: 'usr-guest-koffi',
    title: 'M.',
    firstName: 'Koffi',
    lastName: 'Soglo',
    email: 'k.soglo@entreprise-benin.bj',
    phone: '+229 01 97 00 11 22',
    country: 'Bénin',
    role: 'GUEST',
    roleLabel: 'Client / Résident',
    loyaltyTier: 'Membre Privilège Marina',
    passwordHint: 'client2026'
  },
  DIRECTEUR: {
    id: 'usr-dir-adjavon',
    title: 'M.',
    firstName: 'Stanislas',
    lastName: 'Adjavon',
    email: 'directeur@marina-hotel-benin.bj',
    phone: '+229 01 21 30 04 00',
    country: 'Bénin',
    role: 'DIRECTEUR',
    roleLabel: 'Directeur Général',
    loyaltyTier: 'Direction Générale • Accès Exécutif',
    passwordHint: 'directeur2026'
  },
  ADMIN: {
    id: 'usr-admin-houngbedji',
    title: 'Mme',
    firstName: 'Nadège',
    lastName: 'Houngbédji',
    email: 'admin@marina-hotel-benin.bj',
    phone: '+229 01 96 45 12 80',
    country: 'Bénin',
    role: 'ADMIN',
    roleLabel: 'Administratrice Hôtel',
    loyaltyTier: 'Administration & Tarification',
    passwordHint: 'admin2026'
  },
  RECEPTION: {
    id: 'usr-rec-dossou',
    title: 'M.',
    firstName: 'Ulrich',
    lastName: 'Dossou',
    email: 'reception@marina-hotel-benin.bj',
    phone: '+229 01 95 88 33 10',
    country: 'Bénin',
    role: 'RECEPTION',
    roleLabel: 'Chef de Réception & Conciergerie',
    loyaltyTier: 'Accueil & Check-in Résidents',
    passwordHint: 'reception2026'
  }
};

export const isStaffRole = (role?: UserRole | null): boolean =>
  role === 'DIRECTEUR' || role === 'ADMIN' || role === 'RECEPTION';

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  authError: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.authError = null;
    },
    loginDemoRole(state, action: PayloadAction<UserRole>) {
      const demo = DEMO_USERS[action.payload];
      state.currentUser = {
        id: demo.id,
        title: demo.title,
        firstName: demo.firstName,
        lastName: demo.lastName,
        email: demo.email,
        phone: demo.phone,
        country: demo.country,
        role: demo.role,
        roleLabel: demo.roleLabel,
        loyaltyTier: demo.loyaltyTier
      };
      state.isAuthenticated = true;
      state.authError = null;
    },
    loginWithCredentials(
      state,
      action: PayloadAction<{ email: string; password: string; role?: UserRole }>
    ) {
      const { email, password, role } = action.payload;
      const cleanEmail = email.trim().toLowerCase();

      // Match against demo accounts first
      const matchedDemo = (Object.values(DEMO_USERS) as (AuthUser & { passwordHint: string })[]).find(
        (u) => u.email.toLowerCase() === cleanEmail
      );

      if (matchedDemo && (password === matchedDemo.passwordHint || password.length >= 4)) {
        state.currentUser = {
          id: matchedDemo.id,
          title: matchedDemo.title,
          firstName: matchedDemo.firstName,
          lastName: matchedDemo.lastName,
          email: matchedDemo.email,
          phone: matchedDemo.phone,
          country: matchedDemo.country,
          role: matchedDemo.role,
          roleLabel: matchedDemo.roleLabel,
          loyaltyTier: matchedDemo.loyaltyTier
        };
        state.isAuthenticated = true;
        state.authError = null;
        return;
      }

      if (password.length >= 4) {
        const assignedRole: UserRole =
          role ||
          (cleanEmail.includes('directeur')
            ? 'DIRECTEUR'
            : cleanEmail.includes('admin')
            ? 'ADMIN'
            : cleanEmail.includes('reception')
            ? 'RECEPTION'
            : 'GUEST');

        const roleLabels: Record<UserRole, string> = {
          GUEST: 'Client / Résident',
          DIRECTEUR: 'Directeur Général',
          ADMIN: 'Administrateur Hôtel',
          RECEPTION: 'Chef de Réception'
        };

        state.currentUser = {
          id: `usr-${Date.now()}`,
          title: 'M.',
          firstName: cleanEmail.split('@')[0] || 'Utilisateur',
          lastName: assignedRole === 'GUEST' ? 'Résident' : 'Marina Palace',
          email: email.trim(),
          phone: '+229 01 97 00 00 00',
          country: 'Bénin',
          role: assignedRole,
          roleLabel: roleLabels[assignedRole],
          loyaltyTier:
            assignedRole === 'GUEST' ? 'Membre Privilège Marina' : roleLabels[assignedRole]
        };
        state.isAuthenticated = true;
        state.authError = null;
      } else {
        state.authError =
          'Identifiants invalides. Choisissez un profil démo ou saisissez un mot de passe (min. 4 caractères).';
      }
    },
    registerGuestAccount(
      state,
      action: PayloadAction<{
        title: 'M.' | 'Mme' | 'Dr.';
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role?: UserRole;
      }>
    ) {
      const assignedRole = action.payload.role || 'GUEST';
      const roleLabels: Record<UserRole, string> = {
        GUEST: 'Client / Résident',
        DIRECTEUR: 'Directeur Général',
        ADMIN: 'Administrateur Hôtel',
        RECEPTION: 'Chef de Réception'
      };
      state.currentUser = {
        id: `usr-${Date.now()}`,
        title: action.payload.title,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        phone: action.payload.phone,
        country: 'Bénin',
        role: assignedRole,
        roleLabel: roleLabels[assignedRole],
        loyaltyTier:
          assignedRole === 'GUEST' ? 'Membre Privilège Marina' : roleLabels[assignedRole]
      };
      state.isAuthenticated = true;
      state.authError = null;
    },
    clearAuthError(state) {
      state.authError = null;
    },
    logoutUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.authError = null;
    }
  }
});

export const {
  loginSuccess,
  loginDemoRole,
  loginWithCredentials,
  registerGuestAccount,
  clearAuthError,
  logoutUser
} = authSlice.actions;
