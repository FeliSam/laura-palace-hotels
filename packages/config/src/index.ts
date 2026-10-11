import { CurrencyCode, PresetThemeId } from '@hotel/types';

export interface ThemePalette {
  id: PresetThemeId;
  label: string;
  tagline: string;
  hotelNameOverride?: string;
  locationOverride?: string;
  colors: {
    backgroundPrimary: string;
    backgroundSecondary: string;
    surfaceCard: string;
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    accentSecondary: string;
    borderSubtle: string;
  };
  heroImage: string;
}

export interface HotelWhiteLabelConfig {
  brand: {
    name: string;
    subtitle: string;
    monogram: string;
    establishedYear: number;
    stars: number;
    distinction: string;
    tagline: string;
    storyTitle: string;
    storyDescription: string;
  };
  contact: {
    address: string;
    city: string;
    country: string;
    phone: string;
    conciergeEmail: string;
    coordinates: { lat: number; lng: number };
    checkInTime: string;
    checkOutTime: string;
  };
  pricing: {
    baseCurrency: CurrencyCode;
    taxRatePercent: number;
    cityTaxPerNight: number; // Taxe de séjour touristique au Bénin en FCFA
    currencies: Record<CurrencyCode, { symbol: string; rateFromBase: number; label: string }>;
    promoCodes: Record<string, { discountPercent: number; description: string }>;
  };
  themes: Record<PresetThemeId, ThemePalette>;
  defaultTheme: PresetThemeId;
  stats: Array<{ value: string; label: string }>;
  experiencesShowcase: Array<{
    id: string;
    kicker: string;
    title: string;
    description: string;
    schedule: string;
    image: string;
    highlight: string;
  }>;
}

/**
 * CONFIGURATION WHITE-LABEL — STANDARD HÔTELIER DU BÉNIN (COTONOU / OUIDAH)
 * Tarification native en Franc CFA (FCFA - XOF).
 */
export const HOTEL_CONFIG: HotelWhiteLabelConfig = {
  brand: {
    name: 'LE MÉRIDIEN & MARINA',
    subtitle: 'COTONOU • BOULEVARD DE LA MARINA',
    monogram: 'M',
    establishedYear: 2024,
    stars: 5,
    distinction: 'Hôtellerie Internationale 5★ • Boulevard de la Marina, Cotonou',
    tagline: "L'Élégance Contemporaine et l'Hospitalité Béninoise face à l'Océan Atlantique.",
    storyTitle: 'Votre Référence Hôtelière au Cœur de Cotonou',
    storyDescription:
      'Idéalement situé sur le Boulevard de la Marina à proximité du Palais des Congrès et de la Route des Pêches, notre établissement allie confort international, chambres climatisées grand standing, piscine lagon et gastronomie raffinée.'
  },
  contact: {
    address: 'Boulevard de la Marina, face plage de Fidjrossè',
    city: 'Cotonou',
    country: 'Bénin',
    phone: '+229 01 21 30 04 00',
    conciergeEmail: 'reservation@marina-hotel-benin.bj',
    coordinates: { lat: 6.3541, lng: 2.4183 },
    checkInTime: '14:00',
    checkOutTime: '12:00'
  },
  pricing: {
    baseCurrency: 'XOF',
    taxRatePercent: 18, // TVA standard UEMOA / Bénin (incluse ou détaillée)
    cityTaxPerNight: 2500, // Taxe de nuitée touristique au Bénin (2 500 FCFA / nuit)
    currencies: {
      XOF: { symbol: 'FCFA', rateFromBase: 1, label: 'FCFA (XOF)' },
      EUR: { symbol: '€', rateFromBase: 1 / 655.957, label: 'EUR (€)' },
      USD: { symbol: '$', rateFromBase: 1 / 605, label: 'USD ($)' }
    },
    promoCodes: {
      BENIN10: { discountPercent: 10, description: 'Remise Séjour & Affaires (-10%)' },
      MARINA15: { discountPercent: 15, description: 'Offre Privilège Week-end Cotonou (-15%)' },
      PALACE10: { discountPercent: 10, description: 'Privilège Client Fidèle (-10%)' }
    }
  },
  defaultTheme: 'palace-parisien',
  themes: {
    'palace-parisien': {
      id: 'palace-parisien',
      label: 'Grand Hôtel Marina Cotonou (Style Novotel / Sofitel)',
      tagline: "Confort International, Piscine Panoramique & Affaires sur le Boulevard de la Marina.",
      hotelNameOverride: 'MARINA PALACE COTONOU',
      locationOverride: 'Boulevard de la Marina • Cotonou, Bénin',
      colors: {
        backgroundPrimary: '#0B0B0D',
        backgroundSecondary: '#141418',
        surfaceCard: '#1A1A20',
        textPrimary: '#F5F2EB',
        textSecondary: '#A6A096',
        accentPrimary: '#C8A25A',
        accentSecondary: '#E2C383',
        borderSubtle: 'rgba(200, 162, 90, 0.22)'
      },
      heroImage:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85'
    },
    'riviera-azur': {
      id: 'riviera-azur',
      label: 'Resort Route des Pêches & Ouidah (Plage & Cocoteraie)',
      tagline: 'Villas et Suites face à l’Océan sur la Route des Pêches entre Cotonou et Ouidah.',
      hotelNameOverride: 'OCÉAN LODGE OUIDAH',
      locationOverride: 'Route des Pêches • Avlékété - Ouidah, Bénin',
      colors: {
        backgroundPrimary: '#07131A',
        backgroundSecondary: '#0C1E28',
        surfaceCard: '#112836',
        textPrimary: '#F7F9FA',
        textSecondary: '#9FB5C2',
        accentPrimary: '#D4AF6A',
        accentSecondary: '#73C2FB',
        borderSubtle: 'rgba(212, 175, 106, 0.25)'
      },
      heroImage:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2000&q=85'
    },
    'alpine-sanctuary': {
      id: 'alpine-sanctuary',
      label: 'Royal Safari & Parc de la Pendjari (Terre & Savane)',
      tagline: 'Éco-Lodge de prestige aux portes de la réserve biosphère de la Pendjari.',
      hotelNameOverride: 'PENDJARI ROYAL LODGE',
      locationOverride: 'Réserve de la Pendjari • Nord-Bénin',
      colors: {
        backgroundPrimary: '#0B0A09',
        backgroundSecondary: '#161311',
        surfaceCard: '#1F1B18',
        textPrimary: '#F8F4EF',
        textSecondary: '#B5A89B',
        accentPrimary: '#D08B5B',
        accentSecondary: '#E7B996',
        borderSubtle: 'rgba(208, 139, 91, 0.24)'
      },
      heroImage:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85'
    }
  },
  stats: [
    { value: '110', label: 'Chambres, Suites & Bungalows' },
    { value: '10 min', label: 'Aéroport Cardinal Bernardin Gantin' },
    { value: '25 m', label: 'Piscine Extérieure & Lounge Bar' },
    { value: '24h/24', label: 'Navette Aéroport & Sécurité' }
  ],
  experiencesShowcase: [
    {
      id: 'exp-gastronomy',
      kicker: 'GASTRONOMIE BÉNINOISE & INTERNATIONALE',
      title: 'Restaurant L’Orangerie de la Marina & Grill au Bord de l’Eau',
      description:
        'Savourez une cuisine raffinée mêlant poissons frais de l’Atlantique, langoustes grillées, spécialités du terroir béninois revisitées et grands classiques internationaux.',
      schedule: 'Petit-déjeuner buffet dès 06h30 • Déjeuner & Dîner : 12h00 – 23h00',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
      highlight: 'Buffet International & Poissons de l’Atlantique'
    },
    {
      id: 'exp-spa',
      kicker: 'PISCINE LAGON, FITNESS & BIEN-ÊTRE',
      title: 'Bassin Panoramique, Spa au Beurre de Karité & Hammam',
      description:
        'Détendez-vous au bord de notre grande piscine entourée de palmiers avec bar lounge, salle de fitness climatisée Technogym et soins relaxants aux huiles naturelles du Bénin.',
      schedule: 'Ouvert tous les jours : 07h00 – 21h30 • Accès libre aux résidents',
      image:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
      highlight: 'Piscine Extérieure & Soins Karité Pur'
    },
    {
      id: 'exp-concierge',
      kicker: 'AFFAIRES, SÉMINAIRES & EXCURSIONS',
      title: 'Navette Aéroport Cotonou, Salles de Conférence & Découverte',
      description:
        'Accueil personnalisé à l’Aéroport International de Cotonou, location de véhicules avec chauffeur, salles de réunion fibrées et excursions vers Ganvié et Ouidah.',
      schedule: 'Service Conciergerie, Paiement Mobile Money (MTN / Moov) & Cartes Visa',
      image:
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=85',
      highlight: 'Navette Aéroport & Excursions Ganvié / Ouidah'
    }
  ]
};

export function formatCurrencyAmount(amountInXof: number, currency: CurrencyCode = 'XOF'): string {
  const currencyConfig =
    HOTEL_CONFIG.pricing.currencies[currency] || HOTEL_CONFIG.pricing.currencies.XOF;
  const converted = Math.round(amountInXof * currencyConfig.rateFromBase);
  const formattedNumber = new Intl.NumberFormat('fr-FR').format(converted);

  if (currency === 'XOF') {
    return `${formattedNumber} FCFA`;
  }
  if (currency === 'EUR') {
    return `${formattedNumber} €`;
  }
  return `${currencyConfig.symbol}${formattedNumber}`;
}

export * from './catalog';
