import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import {
  Room,
  RoomReview,
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
  STATIC_BOOKINGS,
  STATIC_REVIEWS
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

const rawBaseQuery = fetchBaseQuery({ baseUrl: getApiBaseUrl(), timeout: 1800 });

// Client-side persistent stores (hydrated from localStorage in browser)
let clientRoomsStore: Room[] = [...STATIC_SUITES];
let clientBookingsStore: BookingRecord[] = [...STATIC_BOOKINGS];
let clientReviewsStore: RoomReview[] = [...STATIC_REVIEWS];
let isHydrated = false;

function hydrateLocalStores() {
  if (isHydrated || typeof window === 'undefined') return;
  isHydrated = true;
  try {
    const savedRooms = window.localStorage.getItem('aura_rooms_catalog_v1');
    if (savedRooms) {
      const parsed = JSON.parse(savedRooms);
      if (Array.isArray(parsed) && parsed.length > 0) {
        clientRoomsStore = parsed;
      }
    }
    const savedBookings = window.localStorage.getItem('aura_bookings_v1');
    if (savedBookings) {
      const parsed = JSON.parse(savedBookings);
      if (Array.isArray(parsed) && parsed.length > 0) {
        clientBookingsStore = parsed;
      }
    }
    const savedReviews = window.localStorage.getItem('aura_room_reviews_v1');
    if (savedReviews) {
      const parsed = JSON.parse(savedReviews);
      if (Array.isArray(parsed) && parsed.length > 0) {
        clientReviewsStore = parsed;
      }
    }
  } catch (_e) {
    // Ignore storage errors
  }
}

function persistLocalStores() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('aura_rooms_catalog_v1', JSON.stringify(clientRoomsStore));
    window.localStorage.setItem('aura_bookings_v1', JSON.stringify(clientBookingsStore));
    window.localStorage.setItem('aura_room_reviews_v1', JSON.stringify(clientReviewsStore));
  } catch (_e) {
    // Ignore storage quota errors
  }
}

function enrichRoomWithRating(room: Room): Room {
  const roomReviews = clientReviewsStore.filter(
    (rev) => rev.roomId === room.id || rev.roomSlug === room.slug
  );
  if (roomReviews.length === 0) {
    return {
      ...room,
      rating: room.rating || 4.9,
      reviewsCount: room.reviewsCount || 6
    };
  }
  const sum = roomReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / roomReviews.length) * 10) / 10;
  return {
    ...room,
    rating: avg,
    reviewsCount: roomReviews.length
  };
}

const hybridBaseQuery: BaseQueryFn<any, unknown, unknown> = async (args, api, extraOptions) => {
  hydrateLocalStores();

  const url = typeof args === 'string' ? args : args.url || '';
  const method = typeof args === 'string' ? 'GET' : args.method || 'GET';

  // Handle local interactive mutations first (Reviews, Room Admin CRUD) so they always work even on static GitHub Pages
  if (method === 'GET' && url.startsWith('/reviews')) {
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const roomSlug = params.get('roomSlug');
    const list = roomSlug
      ? clientReviewsStore.filter(
          (r) => r.roomSlug === roomSlug || r.roomId === roomSlug
        )
      : [...clientReviewsStore];
    return { data: { reviews: list } };
  }

  if (method === 'POST' && url === '/reviews') {
    const body = args.body as Omit<RoomReview, 'id' | 'createdAt'>;
    const newReview: RoomReview = {
      id: `rev-${Date.now()}`,
      roomId: body.roomId,
      roomSlug: body.roomSlug,
      roomName: body.roomName,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      authorBadge: body.authorBadge || 'Résident Vérifié • Séjour Confirmé',
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      comment: body.comment,
      photos: Array.isArray(body.photos) ? body.photos : [],
      stayDate: body.stayDate || 'Octobre 2026',
      createdAt: new Date().toISOString()
    };
    clientReviewsStore = [newReview, ...clientReviewsStore];
    persistLocalStores();
    return { data: { review: newReview } };
  }

  if (method === 'POST' && url === '/rooms/upsert') {
    const incoming = args.body as Room;
    const cleanSlug =
      incoming.slug?.trim() ||
      incoming.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const roomRecord: Room = {
      ...incoming,
      id: incoming.id || `room-custom-${cleanSlug}`,
      slug: cleanSlug,
      gallery:
        incoming.gallery && incoming.gallery.length > 0
          ? incoming.gallery
          : [incoming.heroImage],
      isAvailableForDates: true
    };

    const existingIdx = clientRoomsStore.findIndex(
      (r) => r.id === roomRecord.id || r.slug === roomRecord.slug
    );
    if (existingIdx >= 0) {
      clientRoomsStore[existingIdx] = roomRecord;
    } else {
      clientRoomsStore = [roomRecord, ...clientRoomsStore];
    }
    persistLocalStores();
    return { data: { room: enrichRoomWithRating(roomRecord) } };
  }

  if (method === 'DELETE' && url.startsWith('/rooms/')) {
    const idOrSlug = decodeURIComponent(url.replace('/rooms/', '')).trim();
    clientRoomsStore = clientRoomsStore.filter(
      (r) => r.id !== idOrSlug && r.slug !== idOrSlug
    );
    persistLocalStores();
    return { data: { deletedId: idOrSlug } };
  }

  if (method === 'GET' && url.startsWith('/rooms/')) {
    const slug = decodeURIComponent(url.replace('/rooms/', '')).trim();
    const room = clientRoomsStore.find((r) => r.slug === slug || r.id === slug);
    if (!room) {
      return { error: { status: 404, data: { error: 'Chambre introuvable' } } };
    }
    return { data: enrichRoomWithRating(room) };
  }

  if (method === 'GET' && url.startsWith('/rooms')) {
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const category = params.get('category');
    const viewType = params.get('viewType');
    const guests = Number(params.get('guests') || '1');

    let rooms = clientRoomsStore.map(enrichRoomWithRating);
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
        meta: { total: rooms.length, source: 'hybrid-dynamic-engine' }
      }
    };
  }

  if (method === 'GET' && url === '/addons') {
    return { data: { addOns: STATIC_ADDONS } };
  }

  if (method === 'GET' && url === '/bookings') {
    return {
      data: {
        bookings: [...clientBookingsStore],
        meta: {
          total: clientBookingsStore.length,
          totalRevenueXof: clientBookingsStore
            .filter((b) => b.status !== 'CANCELLED')
            .reduce((sum, b) => sum + b.pricing.totalPrice, 0)
        }
      }
    };
  }

  if (method === 'PATCH' && url.startsWith('/bookings/') && url.endsWith('/status')) {
    const ref = decodeURIComponent(url.replace('/bookings/', '').replace('/status', ''))
      .trim()
      .toUpperCase();
    const newStatus = args.body?.status as BookingRecord['status'];
    const index = clientBookingsStore.findIndex(
      (b) => b.referenceCode.toUpperCase() === ref || b.id === ref
    );
    if (index === -1) {
      return { error: { status: 404, data: { error: 'Dossier introuvable' } } };
    }
    clientBookingsStore[index] = {
      ...clientBookingsStore[index],
      status: newStatus
    };
    persistLocalStores();
    return { data: { booking: clientBookingsStore[index] } };
  }

  if (method === 'PUT' && url.startsWith('/bookings/')) {
    const ref = decodeURIComponent(url.replace('/bookings/', '')).trim().toUpperCase();
    const index = clientBookingsStore.findIndex(
      (b) => b.referenceCode.toUpperCase() === ref || b.id === ref
    );
    if (index === -1) {
      return { error: { status: 404, data: { error: 'Dossier de réservation introuvable' } } };
    }

    const existing = clientBookingsStore[index];
    const body = args.body || {};

    const updatedRoom = body.roomId
      ? enrichRoomWithRating(
          clientRoomsStore.find((r) => r.id === body.roomId || r.slug === body.roomId) ||
            clientRoomsStore[0]
        )
      : enrichRoomWithRating(
          clientRoomsStore.find((r) => r.id === existing.room.id) || clientRoomsStore[0]
        );

    const checkIn = body.checkIn || existing.checkIn;
    const checkOut = body.checkOut || existing.checkOut;
    const adults = typeof body.adults === 'number' ? body.adults : existing.adults;
    const children = typeof body.children === 'number' ? body.children : existing.children;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));

    const roomSubtotal = updatedRoom.pricePerNight * nights;
    const addOnsSubtotal = existing.addOns.reduce((acc, addon) => {
      if (addon.pricingType === 'PER_NIGHT') return acc + addon.price * nights;
      if (addon.pricingType === 'PER_GUEST') return acc + addon.price * (adults + children);
      return acc + addon.price;
    }, 0);

    const gross = roomSubtotal + addOnsSubtotal;
    const discountAmount = existing.pricing.discountAmount || 0;
    const net = Math.max(0, gross - discountAmount);
    const taxesAndFees =
      Math.round((net * HOTEL_CONFIG.pricing.taxRatePercent) / 100) +
      HOTEL_CONFIG.pricing.cityTaxPerNight * nights * adults;

    const updatedBooking: BookingRecord = {
      ...existing,
      status: body.status || existing.status,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      room: {
        id: updatedRoom.id,
        slug: updatedRoom.slug,
        name: updatedRoom.name,
        subtitle: updatedRoom.subtitle,
        heroImage: updatedRoom.heroImage,
        category: updatedRoom.category,
        sizeSqm: updatedRoom.sizeSqm,
        ...(updatedRoom.rating ? { rating: updatedRoom.rating } : {}),
        ...(updatedRoom.reviewsCount ? { reviewsCount: updatedRoom.reviewsCount } : {})
      },
      guest: {
        ...existing.guest,
        ...(body.guest || {})
      },
      pricing: {
        ...existing.pricing,
        nights,
        roomRatePerNight: updatedRoom.pricePerNight,
        roomSubtotal,
        addOnsSubtotal,
        taxesAndFees,
        totalPrice: net + taxesAndFees
      }
    };

    clientBookingsStore[index] = updatedBooking;
    persistLocalStores();
    return { data: { booking: updatedBooking } };
  }

  if (method === 'POST' && url === '/bookings') {
    const payload = args.body as CreateBookingPayload;
    const room =
      clientRoomsStore.find((r) => r.id === payload.roomId || r.slug === payload.roomId) ||
      clientRoomsStore[0];
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

    const referenceCode = `BENIN-${new Date().getFullYear()}-${Math.floor(
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
        currency: 'XOF'
      },
      createdAt: new Date().toISOString()
    };

    clientBookingsStore = [booking, ...clientBookingsStore];
    persistLocalStores();
    return {
      data: {
        booking,
        message: `Réservation ${referenceCode} confirmée.`
      }
    };
  }

  if (method === 'GET' && url.startsWith('/bookings/')) {
    const ref = decodeURIComponent(url.replace('/bookings/', '')).trim().toUpperCase();
    const found = clientBookingsStore.find(
      (b) =>
        b.referenceCode.toUpperCase() === ref ||
        b.referenceCode.toUpperCase().replace('AURA', 'BENIN') === ref
    );
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

  try {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (!result.error) return result;
  } catch (_err) {
    // Fallback handled above
  }

  return { error: { status: 404, data: { error: 'Not found' } } };
};

export const hotelApi = createApi({
  reducerPath: 'hotelApi',
  baseQuery: hybridBaseQuery,
  tagTypes: ['Rooms', 'Bookings', 'AddOns', 'Reviews'],
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
      providesTags: (_res, _err, slug) => [{ type: 'Rooms', id: slug }, 'Rooms']
    }),
    upsertRoom: builder.mutation<
      { room: Room },
      Partial<Room> & { name: string; pricePerNight: number }
    >({
      query: (room) => ({
        url: '/rooms/upsert',
        method: 'POST',
        body: room
      }),
      invalidatesTags: ['Rooms']
    }),
    deleteRoom: builder.mutation<{ deletedId: string }, string | { id: string }>({
      query: (arg) => {
        const idOrSlug = typeof arg === 'string' ? arg : arg.id;
        return {
          url: `/rooms/${encodeURIComponent(idOrSlug)}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Rooms']
    }),
    getReviews: builder.query<{ reviews: RoomReview[] }, string | void>({
      query: (roomSlug) =>
        roomSlug ? `/reviews?roomSlug=${encodeURIComponent(roomSlug)}` : '/reviews',
      providesTags: ['Reviews']
    }),
    addRoomReview: builder.mutation<
      { review: RoomReview },
      Omit<RoomReview, 'id' | 'createdAt'>
    >({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Reviews', 'Rooms']
    }),
    getAddOns: builder.query<{ addOns: ExperienceAddOn[] }, void>({
      query: () => '/addons',
      providesTags: ['AddOns']
    }),
    getAllBookings: builder.query<
      { bookings: BookingRecord[]; meta: { total: number; totalRevenueXof: number } },
      void
    >({
      query: () => '/bookings',
      providesTags: ['Bookings']
    }),
    updateBookingStatus: builder.mutation<
      { booking: BookingRecord },
      { referenceCode: string; status: BookingRecord['status'] }
    >({
      query: ({ referenceCode, status }) => ({
        url: `/bookings/${encodeURIComponent(referenceCode)}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['Bookings', 'Rooms']
    }),
    updateBooking: builder.mutation<
      { booking: BookingRecord },
      {
        referenceCode: string;
        roomId?: string;
        checkIn?: string;
        checkOut?: string;
        adults?: number;
        children?: number;
        status?: BookingRecord['status'];
        guest?: Partial<BookingRecord['guest']>;
      }
    >({
      query: ({ referenceCode, ...body }) => ({
        url: `/bookings/${encodeURIComponent(referenceCode)}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Bookings', 'Rooms']
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
  useUpsertRoomMutation,
  useDeleteRoomMutation,
  useGetReviewsQuery,
  useAddRoomReviewMutation,
  useGetAddOnsQuery,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useUpdateBookingMutation,
  useCreateBookingMutation,
  useGetBookingByReferenceQuery,
  useLazyGetBookingByReferenceQuery
} = hotelApi;
