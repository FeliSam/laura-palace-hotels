import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SuiteCategory, ViewType } from '@hotel/types';

export interface FilterState {
  category: SuiteCategory;
  viewType: ViewType | 'ALL';
  minGuests: number;
  maxPricePerNight: number;
  sortBy: 'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'SIZE_DESC';
  searchQuery: string;
}

const initialState: FilterState = {
  category: 'ALL',
  viewType: 'ALL',
  minGuests: 1,
  maxPricePerNight: 15000,
  sortBy: 'FEATURED',
  searchQuery: ''
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategoryFilter(state, action: PayloadAction<SuiteCategory>) {
      state.category = action.payload;
    },
    setViewFilter(state, action: PayloadAction<ViewType | 'ALL'>) {
      state.viewType = action.payload;
    },
    setMinGuestsFilter(state, action: PayloadAction<number>) {
      state.minGuests = action.payload;
    },
    setMaxPriceFilter(state, action: PayloadAction<number>) {
      state.maxPricePerNight = action.payload;
    },
    setSortBy(state, action: PayloadAction<FilterState['sortBy']>) {
      state.sortBy = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetFilters() {
      return initialState;
    }
  }
});

export const {
  setCategoryFilter,
  setViewFilter,
  setMinGuestsFilter,
  setMaxPriceFilter,
  setSortBy,
  setSearchQuery,
  resetFilters
} = filterSlice.actions;
