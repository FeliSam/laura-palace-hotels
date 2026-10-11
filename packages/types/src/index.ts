import { z } from 'zod';

// ==========================================
// 1. ENUMS & CATEGORIES
// ==========================================
export type SuiteCategory = 'ALL' | 'SIGNATURE_SUITE' | 'ROYAL_PENTHOUSE' | 'PRIVATE_VILLA';
export type ViewType = 'OCEAN_PANORAMA' | 'IMPERIAL_GARDEN' | 'EIFFEL_SKYLINE' | 'PRIVATE_LAGOON';
export type CurrencyCode = 'XOF' | 'EUR' | 'USD';
export type PresetThemeId = 'palace-parisien' | 'riviera-azur' | 'alpine-sanctuary';

// ==========================================
// 2. ROOM / SUITE MODELS
// ==========================================
export interface RoomAmenity {
  id: string;
  label: string;
  icon: string;
  premium?: boolean;
}

export interface Room {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: Exclude<SuiteCategory, 'ALL'>;
  description: string;
  pricePerNight: number; // Base price in EUR
  sizeSqm: number;
  maxGuests: number;
  bedConfiguration: string;
  floorLevel: string;
  viewType: ViewType;
  viewLabel: string;
  heroImage: string;
  gallery: string[];
  amenities: RoomAmenity[];
  highlights: string[];
  isFeatured: boolean;
  availableCount?: number;
  isAvailableForDates?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface RoomReview {
  id: string;
  roomId: string;
  roomSlug: string;
  roomName: string;
  authorName: string;
  authorEmail?: string;
  authorBadge?: string;
  rating: number; // 1 to 5 stars
  comment: string;
  photos: string[];
  stayDate?: string;
  createdAt: string;
}

// ==========================================
// 3. BESPOKE ADD-ONS & EXPERIENCES
// ==========================================
export type AddOnPricingType = 'PER_STAY' | 'PER_NIGHT' | 'PER_GUEST';

export interface ExperienceAddOn {
  id: string;
  code: string;
  title: string;
  category: 'GASTRONOMY' | 'SPA_WELLNESS' | 'VIP_TRANSFER' | 'BESPOKE';
  description: string;
  price: number;
  pricingType: AddOnPricingType;
  image: string;
  badge?: string;
}

// ==========================================
// 4. BOOKING & PRICING BREAKDOWN
// ==========================================
export const CreateBookingSchema = z.object({
  roomId: z.string().min(1, 'Veuillez sélectionner une suite'),
  checkIn: z.string().min(1, "Date d'arrivée requise"),
  checkOut: z.string().min(1, 'Date de départ requise'),
  adults: z.number().int().min(1).max(10),
  children: z.number().int().min(0).max(6),
  addOnIds: z.array(z.string()).default([]),
  promoCode: z.string().optional(),
  guest: z.object({
    title: z.enum(['M.', 'Mme', 'Dr.', 'S.A.R.']).default('M.'),
    firstName: z.string().min(2, 'Prénom requis'),
    lastName: z.string().min(2, 'Nom requis'),
    email: z.string().email('Email invalide'),
    phone: z.string().min(6, 'Téléphone requis'),
    country: z.string().default('France'),
    arrivalTime: z.string().optional(),
    specialRequests: z.string().optional(),
    vipPreferences: z.array(z.string()).optional()
  })
});

export type CreateBookingPayload = z.infer<typeof CreateBookingSchema>;

export interface PriceBreakdown {
  nights: number;
  roomRatePerNight: number;
  roomSubtotal: number;
  addOnsSubtotal: number;
  discountAmount: number;
  taxesAndFees: number;
  totalPrice: number;
  currency: CurrencyCode;
}

export interface BookingRecord {
  id: string;
  referenceCode: string;
  status: 'CONFIRMED' | 'PENDING_CONCIERGE' | 'CANCELLED';
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  room: Pick<
    Room,
    'id' | 'slug' | 'name' | 'subtitle' | 'heroImage' | 'category' | 'sizeSqm' | 'rating' | 'reviewsCount'
  >;
  addOns: ExperienceAddOn[];
  guest: CreateBookingPayload['guest'];
  pricing: PriceBreakdown;
  createdAt: string;
}
