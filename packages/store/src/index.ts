import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { bookingSlice } from './slices/bookingSlice';
import { filterSlice } from './slices/filterSlice';
import { uiSlice } from './slices/uiSlice';
import { hotelApi } from './api/hotelApi';

export const makeHotelStore = () =>
  configureStore({
    reducer: {
      booking: bookingSlice.reducer,
      filters: filterSlice.reducer,
      ui: uiSlice.reducer,
      [hotelApi.reducerPath]: hotelApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      }).concat(hotelApi.middleware)
  });

export const store = makeHotelStore();

export type AppStore = ReturnType<typeof makeHotelStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './slices/bookingSlice';
export * from './slices/filterSlice';
export * from './slices/uiSlice';
export * from './api/hotelApi';
