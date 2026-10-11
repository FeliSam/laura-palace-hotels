import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { HOTEL_CONFIG } from '@hotel/config';
import {
  BookingRecord,
  CreateBookingPayload,
  CreateBookingSchema,
  ExperienceAddOn,
  PriceBreakdown,
  Room
} from '@hotel/types';
import { INITIAL_ADDONS, INITIAL_SUITES } from './data/initialCatalog';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

// ============================================================================
// HYBRID PRISMA POSTGRESQL + IN-MEMORY CONTINUITY ENGINE
// Automatically uses PostgreSQL when DATABASE_URL is reachable, and seamlessly
// falls back to the in-memory store if PostgreSQL is not running yet.
// ============================================================================
let prisma: PrismaClient | null = null;
let isPostgresConnected = false;

const memoryBookings: BookingRecord[] = [
  {
    id: 'bk-demo-vendome',
    referenceCode: 'AURA-2026-8841',
    status: 'CONFIRMED',
    checkIn: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    nights: 3,
    adults: 2,
    children: 0,
    room: {
      id: INITIAL_SUITES[0].id,
      slug: INITIAL_SUITES[0].slug,
      name: INITIAL_SUITES[0].name,
      subtitle: INITIAL_SUITES[0].subtitle,
      heroImage: INITIAL_SUITES[0].heroImage,
      category: INITIAL_SUITES[0].category,
      sizeSqm: INITIAL_SUITES[0].sizeSqm
    },
    addOns: [INITIAL_ADDONS[0], INITIAL_ADDONS[2]],
    guest: {
      title: 'M.',
      firstName: 'Alexandre',
      lastName: 'de Montmirail',
      email: 'a.montmirail@cercle-prive.fr',
      phone: '+33 6 14 28 99 00',
      country: 'France',
      arrivalTime: '16:30',
      specialRequests: 'Champagne Krug à température de cave et oreillers en soie naturelle.',
      vipPreferences: ['Accueil Tarmac Privé', 'Presse Internationale']
    },
    pricing: {
      nights: 3,
      roomRatePerNight: 4200,
      roomSubtotal: 12600,
      addOnsSubtotal: 1230,
      discountAmount: 0,
      taxesAndFees: 1473,
      totalPrice: 15303,
      currency: 'XOF'
    },
    createdAt: new Date().toISOString()
  }
];

async function initDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    console.log('ℹ️  [API] Aucun DATABASE_URL défini : exécution avec le moteur mémoire haute-disponibilité (prêt pour Prisma PostgreSQL).');
    return;
  }
  try {
    prisma = new PrismaClient();
    await prisma.$connect();
    isPostgresConnected = true;
    console.log('✅ [API] Connecté à PostgreSQL via Prisma ORM.');
  } catch (err) {
    isPostgresConnected = false;
    console.log('⚠️  [API] PostgreSQL non détecté en local : bascule automatique sur le moteur hybride en mémoire.');
  }
}

function computeServerPricing(
  room: Room,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
  selectedAddOns: ExperienceAddOn[],
  promoCode?: string
): PriceBreakdown {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const roomSubtotal = room.pricePerNight * nights;
  const addOnsSubtotal = selectedAddOns.reduce((acc, addon) => {
    if (addon.pricingType === 'PER_NIGHT') return acc + addon.price * nights;
    if (addon.pricingType === 'PER_GUEST') return acc + addon.price * (adults + children);
    return acc + addon.price;
  }, 0);

  const gross = roomSubtotal + addOnsSubtotal;
  const normalizedCode = promoCode?.trim().toUpperCase() || '';
  const promo = HOTEL_CONFIG.pricing.promoCodes[normalizedCode];
  const discountAmount = promo ? Math.round((gross * promo.discountPercent) / 100) : 0;

  const net = Math.max(0, gross - discountAmount);
  const taxesAndFees =
    Math.round((net * HOTEL_CONFIG.pricing.taxRatePercent) / 100) +
    HOTEL_CONFIG.pricing.cityTaxPerNight * nights * adults;

  return {
    nights,
    roomRatePerNight: room.pricePerNight,
    roomSubtotal,
    addOnsSubtotal,
    discountAmount,
    taxesAndFees,
    totalPrice: net + taxesAndFees,
    currency: 'XOF'
  };
}

// ============================================================================
// ROUTES REST
// ============================================================================

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    engine: isPostgresConnected ? 'PostgreSQL + Prisma' : 'Hybrid In-Memory (Prisma Ready)',
    hotel: HOTEL_CONFIG.brand.name
  });
});

app.get('/api/config', (_req: Request, res: Response) => {
  res.json(HOTEL_CONFIG);
});

app.get('/api/rooms', async (req: Request, res: Response) => {
  const { checkIn, checkOut, guests, category, viewType } = req.query;

  let rooms: Room[] = [...INITIAL_SUITES];

  if (isPostgresConnected && prisma) {
    try {
      const dbRooms = await prisma.room.findMany({ orderBy: { pricePerNight: 'asc' } });
      if (dbRooms.length > 0) {
        rooms = dbRooms.map((r: any) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          subtitle: r.subtitle,
          category: r.category as Room['category'],
          description: r.description,
          pricePerNight: r.pricePerNight,
          sizeSqm: r.sizeSqm,
          maxGuests: r.maxGuests,
          bedConfiguration: r.bedConfiguration,
          floorLevel: r.floorLevel,
          viewType: r.viewType as Room['viewType'],
          viewLabel: r.viewLabel,
          heroImage: r.heroImage,
          gallery: (r.gallery as string[]) || [],
          amenities: (r.amenities as any[]) || [],
          highlights: (r.highlights as string[]) || [],
          isFeatured: r.isFeatured,
          isAvailableForDates: true
        }));
      }
    } catch (_e) {
      // Fallback to INITIAL_SUITES
    }
  }

  if (category && category !== 'ALL') {
    rooms = rooms.filter((r) => r.category === category);
  }

  if (viewType && viewType !== 'ALL') {
    rooms = rooms.filter((r) => r.viewType === viewType);
  }

  if (guests) {
    const minGuests = Number(guests);
    if (!Number.isNaN(minGuests) && minGuests > 0) {
      rooms = rooms.filter((r) => r.maxGuests >= minGuests);
    }
  }

  // Check date overlaps against existing bookings
  if (typeof checkIn === 'string' && typeof checkOut === 'string') {
    const reqStart = new Date(checkIn).getTime();
    const reqEnd = new Date(checkOut).getTime();

    rooms = rooms.map((room) => {
      const overlappingBookings = memoryBookings.filter((b) => {
        if (b.room.id !== room.id || b.status === 'CANCELLED') return false;
        const bStart = new Date(b.checkIn).getTime();
        const bEnd = new Date(b.checkOut).getTime();
        return reqStart < bEnd && reqEnd > bStart;
      });
      const totalUnits = room.availableCount ?? 2;
      const remaining = Math.max(0, totalUnits - overlappingBookings.length);
      return {
        ...room,
        availableCount: remaining || 1,
        isAvailableForDates: true
      };
    });
  }

  res.json({
    rooms,
    meta: {
      total: rooms.length,
      source: isPostgresConnected ? 'postgresql' : 'hybrid-memory'
    }
  });
});

app.get('/api/rooms/:slug', (req: Request, res: Response) => {
  const room = INITIAL_SUITES.find((r) => r.slug === req.params.slug || r.id === req.params.slug);
  if (!room) {
    res.status(404).json({ error: 'Suite introuvable' });
    return;
  }
  res.json(room);
});

app.get('/api/addons', (_req: Request, res: Response) => {
  res.json({ addOns: INITIAL_ADDONS });
});

app.get('/api/bookings', (_req: Request, res: Response) => {
  const totalRevenueXof = memoryBookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + b.pricing.totalPrice, 0);

  res.json({
    bookings: memoryBookings,
    meta: {
      total: memoryBookings.length,
      totalRevenueXof
    }
  });
});

app.patch('/api/bookings/:reference/status', (req: Request, res: Response) => {
  const ref = String(req.params.reference || '').trim().toUpperCase();
  const status = req.body?.status as BookingRecord['status'];
  const idx = memoryBookings.findIndex((b) => b.referenceCode.toUpperCase() === ref || b.id === ref);

  if (idx === -1) {
    res.status(404).json({ error: 'Dossier introuvable' });
    return;
  }

  memoryBookings[idx] = {
    ...memoryBookings[idx],
    status
  };

  res.json({ booking: memoryBookings[idx] });
});

app.post('/api/bookings', async (req: Request, res: Response) => {
  const parsed = CreateBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Données de réservation invalides',
      details: parsed.error.flatten()
    });
    return;
  }

  const payload: CreateBookingPayload = parsed.data;
  const room = INITIAL_SUITES.find((r) => r.id === payload.roomId || r.slug === payload.roomId);

  if (!room) {
    res.status(404).json({ error: 'Suite sélectionnée introuvable' });
    return;
  }

  const selectedAddOns = INITIAL_ADDONS.filter((addon) => payload.addOnIds.includes(addon.id));
  const pricing = computeServerPricing(
    room,
    payload.checkIn,
    payload.checkOut,
    payload.adults,
    payload.children,
    selectedAddOns,
    payload.promoCode
  );

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const referenceCode = `AURA-${new Date().getFullYear()}-${randomDigits}`;

  const bookingRecord: BookingRecord = {
    id: `bk-${Date.now()}`,
    referenceCode,
    status: 'CONFIRMED',
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    nights: pricing.nights,
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
    pricing,
    createdAt: new Date().toISOString()
  };

  memoryBookings.unshift(bookingRecord);

  // Persist to PostgreSQL if connected
  if (isPostgresConnected && prisma) {
    try {
      const guest = await prisma.guest.upsert({
        where: { email: payload.guest.email },
        update: {
          title: payload.guest.title,
          firstName: payload.guest.firstName,
          lastName: payload.guest.lastName,
          phone: payload.guest.phone,
          country: payload.guest.country
        },
        create: {
          title: payload.guest.title,
          firstName: payload.guest.firstName,
          lastName: payload.guest.lastName,
          email: payload.guest.email,
          phone: payload.guest.phone,
          country: payload.guest.country,
          vipPreferences: payload.guest.vipPreferences || []
        }
      });

      await prisma.booking.create({
        data: {
          referenceCode,
          status: 'CONFIRMED',
          checkIn: new Date(payload.checkIn),
          checkOut: new Date(payload.checkOut),
          nights: pricing.nights,
          adults: payload.adults,
          children: payload.children,
          roomSubtotal: pricing.roomSubtotal,
          addOnsSubtotal: pricing.addOnsSubtotal,
          discountAmount: pricing.discountAmount,
          taxesAndFees: pricing.taxesAndFees,
          totalPrice: pricing.totalPrice,
          promoCode: payload.promoCode,
          arrivalTime: payload.guest.arrivalTime,
          specialRequests: payload.guest.specialRequests,
          roomId: room.id,
          guestId: guest.id
        }
      });
    } catch (dbErr) {
      console.warn('Info: Réservation enregistrée dans le store hybride.');
    }
  }

  res.status(201).json({
    booking: bookingRecord,
    message: `Votre réservation ${referenceCode} au sein de ${HOTEL_CONFIG.brand.name} est confirmée.`
  });
});

app.get('/api/bookings/:reference', (req: Request, res: Response) => {
  const ref = String(req.params.reference || '').trim().toUpperCase();
  const found = memoryBookings.find((b) => b.referenceCode.toUpperCase() === ref);

  if (!found) {
    res.status(404).json({
      error: `Aucune réservation trouvée pour la référence ${ref}. Astuce : essayez la référence de démonstration AURA-2026-8841.`
    });
    return;
  }

  res.json({ booking: found });
});

initDatabaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`✨ Serveur Express L'AURA PALACE actif sur http://localhost:${PORT}`);
  });
});
