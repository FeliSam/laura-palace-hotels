import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'GUEST' | 'ADMIN';

export interface AuthUser {
  id: string;
  title: 'M.' | 'Mme' | 'Dr.';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  role: UserRole;
  loyaltyTier?: string;
}

export interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  authError: string | null;
}

export const DEMO_USERS: Record<'GUEST' | 'ADMIN', AuthUser & { passwordHint: string }> = {
  GUEST: {
    id: 'usr-guest-koffi',
    title: 'M.',
    firstName: 'Koffi',
    lastName: 'Soglo',
    email: 'k.soglo@entreprise-benin.bj',
    phone: '+229 01 97 00 11 22',
    country: 'Bénin',
    role: 'GUEST',
    loyaltyTier: 'Membre Privilège Marina',
    passwordHint: 'client2026'
  },
  ADMIN: {
    id: 'usr-admin-direction',
    title: 'M.',
    firstName: 'Stanislas',
    lastName: 'Adjavon',
    email: 'direction@marina-hotel-benin.bj',
    phone: '+229 01 21 30 04 00',
    country: 'Bénin',
    role: 'ADMIN',
    loyaltyTier: 'Direction Générale • Administrateur',
    passwordHint: 'admin2026'
  }
};

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
    loginDemoRole(state, action: PayloadAction<'GUEST' | 'ADMIN'>) {
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
        loyaltyTier: demo.loyaltyTier
      };
      state.isAuthenticated = true;
      state.authError = null;
    },
    loginWithCredentials(
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) {
      const { email, password } = action.payload;
      const cleanEmail = email.trim().toLowerCase();

      if (
        (cleanEmail === DEMO_USERS.ADMIN.email.toLowerCase() ||
          cleanEmail.includes('admin') ||
          cleanEmail.includes('direction')) &&
        (password === DEMO_USERS.ADMIN.passwordHint || password.length >= 4)
      ) {
        const admin = DEMO_USERS.ADMIN;
        state.currentUser = {
          id: admin.id,
          title: admin.title,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phone,
          country: admin.country,
          role: 'ADMIN',
          loyaltyTier: admin.loyaltyTier
        };
        state.isAuthenticated = true;
        state.authError = null;
        return;
      }

      if (password.length >= 4) {
        const isDefaultGuest = cleanEmail === DEMO_USERS.GUEST.email.toLowerCase();
        const guest = DEMO_USERS.GUEST;
        state.currentUser = isDefaultGuest
          ? {
              id: guest.id,
              title: guest.title,
              firstName: guest.firstName,
              lastName: guest.lastName,
              email: guest.email,
              phone: guest.phone,
              country: guest.country,
              role: 'GUEST',
              loyaltyTier: guest.loyaltyTier
            }
          : {
              id: `usr-${Date.now()}`,
              title: 'M.',
              firstName: cleanEmail.split('@')[0] || 'Client',
              lastName: 'Résident',
              email: email.trim(),
              phone: '+229 01 97 00 00 00',
              country: 'Bénin',
              role: 'GUEST',
              loyaltyTier: 'Membre Privilège Marina'
            };
        state.isAuthenticated = true;
        state.authError = null;
      } else {
        state.authError =
          'Identifiants invalides. Utilisez les comptes démo ou un mot de passe d’au moins 4 caractères.';
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
      }>
    ) {
      state.currentUser = {
        id: `usr-${Date.now()}`,
        title: action.payload.title,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        phone: action.payload.phone,
        country: 'Bénin',
        role: 'GUEST',
        loyaltyTier: 'Membre Privilège Marina'
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
