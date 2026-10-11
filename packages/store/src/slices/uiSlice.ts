import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencyCode, PresetThemeId, Room } from '@hotel/types';
import { HOTEL_CONFIG } from '@hotel/config';

export type ColorMode = 'light' | 'dark';

export interface UiState {
  currency: CurrencyCode;
  colorMode: ColorMode;
  activeTheme: PresetThemeId;
  customHotelName: string;
  customAccentColor: string | null;
  isCustomizerOpen: boolean;
  isLookupModalOpen: boolean;
  inspectedRoom: Room | null;
}

const initialState: UiState = {
  currency: HOTEL_CONFIG.pricing.baseCurrency,
  colorMode: 'light', // Default to natural Editorial Alabaster Light mode like Aman / Cheval Blanc
  activeTheme: HOTEL_CONFIG.defaultTheme,
  customHotelName: HOTEL_CONFIG.brand.name,
  customAccentColor: null,
  isCustomizerOpen: false,
  isLookupModalOpen: false,
  inspectedRoom: null
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.currency = action.payload;
    },
    setColorMode(state, action: PayloadAction<ColorMode>) {
      state.colorMode = action.payload;
    },
    toggleColorMode(state) {
      state.colorMode = state.colorMode === 'light' ? 'dark' : 'light';
    },
    setActiveTheme(state, action: PayloadAction<PresetThemeId>) {
      state.activeTheme = action.payload;
      const preset = HOTEL_CONFIG.themes[action.payload];
      if (preset?.hotelNameOverride) {
        state.customHotelName = preset.hotelNameOverride;
      }
      state.customAccentColor = null;
    },
    setCustomHotelName(state, action: PayloadAction<string>) {
      state.customHotelName = action.payload;
    },
    setCustomAccentColor(state, action: PayloadAction<string | null>) {
      state.customAccentColor = action.payload;
    },
    setCustomizerOpen(state, action: PayloadAction<boolean>) {
      state.isCustomizerOpen = action.payload;
    },
    setLookupModalOpen(state, action: PayloadAction<boolean>) {
      state.isLookupModalOpen = action.payload;
    },
    setInspectedRoom(state, action: PayloadAction<Room | null>) {
      state.inspectedRoom = action.payload;
    }
  }
});

export const {
  setCurrency,
  setColorMode,
  toggleColorMode,
  setActiveTheme,
  setCustomHotelName,
  setCustomAccentColor,
  setCustomizerOpen,
  setLookupModalOpen,
  setInspectedRoom
} = uiSlice.actions;

