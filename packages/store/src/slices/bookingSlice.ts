import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Room, ExperienceAddOn, CreateBookingPayload, PriceBreakdown } from '@hotel/types';
import { HOTEL_CONFIG } from '@hotel/config';

export interface BookingState {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  selectedRoom: Room | null;
  selectedAddOns: ExperienceAddOn[];
  promoCode: string;
  checkoutStep: 1 | 2 | 3;
  isDrawerOpen: boolean;
  guestInfo: CreateBookingPayload['guest'];
  lastConfirmedBookingRef: string | null;
}

// Default dates: Tomorrow to +4 nights
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const fourNightsLater = new Date();
fourNightsLater.setDate(fourNightsLater.getDate() + 4);

const formatDateInput = (d: Date) => d.toISOString().split('T')[0];

const initialState: BookingState = {
  checkIn: formatDateInput(tomorrow),
  checkOut: formatDateInput(fourNightsLater),
  adults: 2,
  children: 0,
  selectedRoom: null,
  selectedAddOns: [],
  promoCode: '',
  checkoutStep: 1,
  isDrawerOpen: false,
  guestInfo: {
    title: 'M.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Bénin',
    arrivalTime: '14:00',
    specialRequests: '',
    vipPreferences: []
  },
  lastConfirmedBookingRef: null
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setDates(state, action: PayloadAction<{ checkIn: string; checkOut: string }>) {
      state.checkIn = action.payload.checkIn;
      state.checkOut = action.payload.checkOut;
    },
    setGuests(state, action: PayloadAction<{ adults?: number; children?: number }>) {
      if (action.payload.adults !== undefined) {
        state.adults = Math.max(1, Math.min(10, action.payload.adults));
      }
      if (action.payload.children !== undefined) {
        state.children = Math.max(0, Math.min(6, action.payload.children));
      }
    },
    selectRoomForBooking(state, action: PayloadAction<{ room: Room; openDrawer?: boolean }>) {
      state.selectedRoom = action.payload.room;
      if (action.payload.openDrawer !== false) {
        state.isDrawerOpen = true;
        state.checkoutStep = 1;
      }
    },
    toggleAddOn(state, action: PayloadAction<ExperienceAddOn>) {
      const exists = state.selectedAddOns.some((item) => item.id === action.payload.id);
      if (exists) {
        state.selectedAddOns = state.selectedAddOns.filter((item) => item.id !== action.payload.id);
      } else {
        state.selectedAddOns.push(action.payload);
      }
    },
    setPromoCode(state, action: PayloadAction<string>) {
      state.promoCode = action.payload.trim().toUpperCase();
    },
    setCheckoutStep(state, action: PayloadAction<1 | 2 | 3>) {
      state.checkoutStep = action.payload;
    },
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isDrawerOpen = action.payload;
    },
    updateGuestInfo(state, action: PayloadAction<Partial<CreateBookingPayload['guest']>>) {
      state.guestInfo = { ...state.guestInfo, ...action.payload };
    },
    toggleVipPreference(state, action: PayloadAction<string>) {
      const current = state.guestInfo.vipPreferences || [];
      if (current.includes(action.payload)) {
        state.guestInfo.vipPreferences = current.filter((p) => p !== action.payload);
      } else {
        state.guestInfo.vipPreferences = [...current, action.payload];
      }
    },
    setConfirmedBookingRef(state, action: PayloadAction<string | null>) {
      state.lastConfirmedBookingRef = action.payload;
    },
    resetBookingFlow(state) {
      state.selectedAddOns = [];
      state.checkoutStep = 1;
      state.lastConfirmedBookingRef = null;
    }
  }
});

export const {
  setDates,
  setGuests,
  selectRoomForBooking,
  toggleAddOn,
  setPromoCode,
  setCheckoutStep,
  setDrawerOpen,
  updateGuestInfo,
  toggleVipPreference,
  setConfirmedBookingRef,
  resetBookingFlow
} = bookingSlice.actions;

// ==========================================
// MEMOIZED SELECTORS (REAL-TIME PRICING)
// ==========================================
export const selectBookingNights = (state: { booking: BookingState }): number => {
  const start = new Date(state.booking.checkIn);
  const end = new Date(state.booking.checkOut);
  const diffMs = end.getTime() - start.getTime();
  const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Number.isFinite(nights) && nights > 0 ? nights : 1;
};

export const selectPriceBreakdown = createSelector(
  [(state: { booking: BookingState }) => state.booking, selectBookingNights],
  (booking, nights): PriceBreakdown => {
    const roomRatePerNight = booking.selectedRoom?.pricePerNight ?? 0;
    const roomSubtotal = roomRatePerNight * nights;

    const addOnsSubtotal = booking.selectedAddOns.reduce((acc, addon) => {
      if (addon.pricingType === 'PER_NIGHT') return acc + addon.price * nights;
      if (addon.pricingType === 'PER_GUEST') return acc + addon.price * (booking.adults + booking.children);
      return acc + addon.price;
    }, 0);

    const grossSubtotal = roomSubtotal + addOnsSubtotal;
    const promo = HOTEL_CONFIG.pricing.promoCodes[booking.promoCode];
    const discountAmount = promo ? Math.round((grossSubtotal * promo.discountPercent) / 100) : 0;

    const netBeforeTax = Math.max(0, grossSubtotal - discountAmount);
    const taxesAndFees =
      Math.round((netBeforeTax * HOTEL_CONFIG.pricing.taxRatePercent) / 100) +
      HOTEL_CONFIG.pricing.cityTaxPerNight * nights * booking.adults;

    return {
      nights,
      roomRatePerNight,
      roomSubtotal,
      addOnsSubtotal,
      discountAmount,
      taxesAndFees,
      totalPrice: netBeforeTax + taxesAndFees,
      currency: 'XOF'
    };
  }
);
