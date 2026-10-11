import React from 'react';
import { Provider } from 'react-redux';
import {
  store,
  useAppDispatch,
  useAppSelector,
  useGetRoomsQuery,
  selectRoomForBooking,
  selectPriceBreakdown
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';

/**
 * ÉCRAN PRINCIPAL REACT NATIVE (iOS & Android)
 * Partage 100% du Store Redux Toolkit (@hotel/store), des appels API RTK Query
 * et de la configuration White-Label (@hotel/config) avec l'application Web Next.js.
 */
export function MobileBookingScreen() {
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, selectedRoom } = useAppSelector((state) => state.booking);
  const { currency, activeTheme } = useAppSelector((state) => state.ui);
  const pricing = useAppSelector(selectPriceBreakdown);
  const { data } = useGetRoomsQuery({ checkIn, checkOut });

  const theme = HOTEL_CONFIG.themes[activeTheme];

  return {
    hotelName: HOTEL_CONFIG.brand.name,
    themeColors: theme.colors,
    checkIn,
    checkOut,
    selectedRoom,
    totalFormatted: formatCurrencyAmount(pricing.totalPrice, currency),
    availableSuitesCount: data?.rooms.length ?? 0,
    onSelectSuite: (room: any) => dispatch(selectRoomForBooking({ room, openDrawer: true }))
  };
}

export default function MobileApp() {
  return (
    <Provider store={store}>
      {/* Connectez ici vos composants React Native (View, Text, FlatList, Pressable) */}
    </Provider>
  );
}
