import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import {
  Room,
  ExperienceAddOn,
  CreateBookingPayload,
  BookingRecord,
  SuiteCategory,
  ViewType
} from '@hotel/types';
import {
  HOTEL_CONFIG,
  STATIC_SUITES,
  STATIC_ADDONS,
  STATIC_BOOKINGS
} from '@hotel/config';

export interface GetRoomsQueryParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  category?: SuiteCategory;
  viewType?: ViewType | 'ALL';
}

const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://localhost:4000/api';
};

const rawBaseQuery = fetchBaseQuery({ baseUrl: getApiBaseUrl(), timeout: 2500 });

// Client-side persistence for GitHub Pages / static mode
const clientBookingsStore: BookingRecord[] = [...STATIC_BOOKINGS];

const hybridBaseQuery: BaseQueryFn<any, unknown, unknown> = async (args, api, extraOptions) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (!result.error) {
      return result;
    }
  } catch (_err) {
    // Express API unreachable (e.g. hosted on GitHub Pages) -> fallback below
  }

  // Fallback for static hosting (GitHub Pages)
  const url = typeof args === 'string' ? args : args.url || '';
  const method = typeof args === 'string' ? 'GET' : args.method || 'GET';

  if (method === 'GET' && url.startsWith('/rooms')) {
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const category = params.get('category');
    const viewType = params.get('viewType');
    const guests = Number(params.get('guests') || '1');

    let rooms = [...STATIC_SUITES];
    if (category && category !== 'ALL') {
      rooms = rooms.filter((r) => r.category === category);
    }
    if (viewType && viewType !== 'ALL') {
      rooms = rooms.filter((r) => r.viewType === viewType);
    }
    if (!Number.isNaN(guests) && guests > 0) {
      rooms = rooms.filter((r) => r.maxGuests >= guests);
    }

    return {
      data: {
        rooms,
        meta: { total: rooms.length, source: 'github-pages-static-engine' }
      }
    };
  }

  if (method === 'GET' && url === '/addons') {
    return { data: { addOns: STATIC_ADDONS } };
  }

  if (method === 'POST' && url === '/bookings') {
    const payload = args.body as CreateBookingPayload;
    const room =
      STATIC_SUITES.find((r) => r.id === payload.roomId || r.slug === payload.roomId) ||
      STATIC_SUITES[0];
    const selectedAddOns = STATIC_ADDONS.filter((a) => payload.addOnIds.includes(a.id));

    const start = new Date(payload.checkIn);
    const end = new Date(payload.checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    const roomSubtotal = room.pricePerNight * nights;
    const addOnsSubtotal = selectedAddOns.reduce((acc, addon) => {
      if (addon.pricingType === 'PER_NIGHT') return acc + addon.price * nights;
      if (addon.pricingType === 'PER_GUEST')
        return acc + addon.price * (payload.adults + payload.children);
      return acc + addon.price;
    }, 0);

    const gross = roomSubtotal + addOnsSubtotal;
    const promo =
      HOTEL_CONFIG.pricing.promoCodes[(payload.promoCode || '').trim().toUpperCase()];
    const discountAmount = promo ? Math.round((gross * promo.discountPercent) / 100) : 0;
    const net = Math.max(0, gross - discountAmount);
    const taxesAndFees =
      Math.round((net * HOTEL_CONFIG.pricing.taxRatePercent) / 100) +
      HOTEL_CONFIG.pricing.cityTaxPerNight * nights * payload.adults;

    const referenceCode = `AURA-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const booking: BookingRecord = {
      id: `bk-${Date.now()}`,
      referenceCode,
      status: 'CONFIRMED',
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      nights,
      adults: payload.adults,
      children: payload.children,
      room: {
        id: room.id,
        slug: room.slug,
        name: room.name,
        subtitle: room.subtitle,
        heroImage: room.heroImage,
        category: room.category,
        sizeSqm: room.sizeSqm
      },
      addOns: selectedAddOns,
      guest: payload.guest,
      pricing: {
        nights,
        roomRatePerNight: room.pricePerNight,
        roomSubtotal,
        addOnsSubtotal,
        discountAmount,
        taxesAndFees,
        totalPrice: net + taxesAndFees,
        currency: 'EUR'
      },
      createdAt: new Date().toISOString()
    };

    clientBookingsStore.unshift(booking);
    return {
      data: {
        booking,
        message: `Réservation ${referenceCode} confirmée.`
      }
    };
  }

  if (method === 'GET' && url.startsWith('/bookings/')) {
    const ref = decodeURIComponent(url.replace('/bookings/', '')).trim().toUpperCase();
    const found = clientBookingsStore.find((b) => b.referenceCode.toUpperCase() === ref);
    if (!found) {
      return {
        error: {
          status: 404,
          data: { error: `Aucune réservation trouvée pour ${ref}` }
        }
      };
    }
    return { data: { booking: found } };
  }

  return { error: { status: 404, data: { error: 'Not found' } } };
};

export const hotelApi = createApi({
  reducerPath: 'hotelApi',
  baseQuery: hybridBaseQuery,
  tagTypes: ['Rooms', 'Bookings', 'AddOns'],
  endpoints: (builder) => ({
    getRooms: builder.query<
      { rooms: Room[]; meta: { total: number; source: string } },
      GetRoomsQueryParams | void
    >({
      query: (params) => {
        if (!params) return '/rooms';
        const search = new URLSearchParams();
        if (params.checkIn) search.set('checkIn', params.checkIn);
        if (params.checkOut) search.set('checkOut', params.checkOut);
        if (params.guests) search.set('guests', String(params.guests));
        if (params.category && params.category !== 'ALL') search.set('category', params.category);
        if (params.viewType && params.viewType !== 'ALL') search.set('viewType', params.viewType);
        const qs = search.toString();
        return `/rooms${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Rooms']
    }),
    getRoomBySlug: builder.query<Room, string>({
      query: (slug) => `/rooms/${slug}`,
      providesTags: (_res, _err, slug) => [{ type: 'Rooms', id: slug }]
    }),
    getAddOns: builder.query<{ addOns: ExperienceAddOn[] }, void>({
      query: () => '/addons',
      providesTags: ['AddOns']
    }),
    createBooking: builder.mutation<
      { booking: BookingRecord; message: string },
      CreateBookingPayload
    >({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Rooms', 'Bookings']
    }),
    getBookingByReference: builder.query<{ booking: BookingRecord }, string>({
      query: (reference) => `/bookings/${encodeURIComponent(reference.trim().toUpperCase())}`,
      providesTags: (_res, _err, reference) => [{ type: 'Bookings', id: reference }]
    })
  })
});

export const {
  useGetRoomsQuery,
  useGetRoomBySlugQuery,
  useGetAddOnsQuery,
  useCreateBookingMutation,
  useGetBookingByReferenceQuery,
  useLazyGetBookingByReferenceQuery
} = hotelApi;
