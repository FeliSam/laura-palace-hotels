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
    taxRatePercent: number; // e.g. 10%
    cityTaxPerNight: number;
    currencies: Record<CurrencyCode, { symbol: string; rateFromEur: number; label: string }>;
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
 * FICHIER CENTRAL DE PERSONNALISATION (WHITE-LABEL)
 * Modifiez cet objet unique pour adapter instantanément le site Web (Next.js),
 * l'application Mobile (React Native) et les règles tarifaires de l'API.
 */
export const HOTEL_CONFIG: HotelWhiteLabelConfig = {
  brand: {
    name: "L'AURA PALACE",
    subtitle: 'PARIS • PLACE VENDÔME & CÔTE D’AZUR',
    monogram: 'A',
    establishedYear: 1928,
    stars: 5,
    distinction: 'Distinction Palace • Relais & Châteaux',
    tagline: "L'Art du Silence, de la Lumière et de la Haute Hospitalité.",
    storyTitle: 'Un Sanctuaire Intemporel façonné pour les Épicuriens',
    storyDescription:
      "Chaque suite, chaque jardin suspendu et chaque attention de notre Majordome privé ont été orchestrés pour transformer votre séjour en une œuvre d'art vivante."
  },
  contact: {
    address: '22 Place Vendôme',
    city: 'Paris',
    country: 'France',
    phone: '+33 1 42 68 90 00',
    conciergeEmail: 'conciergerie@laura-palace.com',
    coordinates: { lat: 48.8675, lng: 2.3294 },
    checkInTime: '15:00',
    checkOutTime: '12:00'
  },
  pricing: {
    baseCurrency: 'EUR',
    taxRatePercent: 10,
    cityTaxPerNight: 15,
    currencies: {
      EUR: { symbol: '€', rateFromEur: 1, label: 'EUR (€)' },
      USD: { symbol: '$', rateFromEur: 1.09, label: 'USD ($)' },
      CHF: { symbol: 'CHF ', rateFromEur: 0.96, label: 'CHF (Fr.)' }
    },
    promoCodes: {
      PALACE10: { discountPercent: 10, description: 'Privilège Membre Cercle Aura (-10%)' },
      ROYALVIP: { discountPercent: 15, description: 'Invitation Ambassadeur (-15%)' }
    }
  },
  defaultTheme: 'palace-parisien',
  themes: {
    'palace-parisien': {
      id: 'palace-parisien',
      label: 'Palace Parisien (Or & Obsidienne)',
      tagline: "L'Art du Silence et de la Haute Couture Hôtelière au cœur de Paris.",
      hotelNameOverride: "L'AURA PALACE PARIS",
      locationOverride: '22 Place Vendôme • Paris Ier',
      colors: {
        backgroundPrimary: '#08080A',
        backgroundSecondary: '#111116',
        surfaceCard: '#16161D',
        textPrimary: '#FAF7F2',
        textSecondary: '#A9A49A',
        accentPrimary: '#C9A45C',
        accentSecondary: '#E5C98B',
        borderSubtle: 'rgba(201, 164, 92, 0.22)'
      },
      heroImage:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85'
    },
    'riviera-azur': {
      id: 'riviera-azur',
      label: 'Riviera Méditerranée (Sable & Azur)',
      tagline: 'Villas suspendues entre pinède centenaire et horizon azuréen.',
      hotelNameOverride: 'VILLA AURA CAP-FERRAT',
      locationOverride: 'Pointe Saint-Hospice • Saint-Jean-Cap-Ferrat',
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
      label: 'Sanctuaire Alpin (Ambre & Ardoise)',
      tagline: 'Refuge privé au pied des cimes éternelles et thermalisme minéral.',
      hotelNameOverride: 'AURA COURCHEVEL 1850',
      locationOverride: 'Jardin Alpin • Courchevel 1850',
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
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85'
    }
  },
  stats: [
    { value: '28', label: 'Suites & Villas Privées' },
    { value: '3★', label: 'Table Gastronomique Michelin' },
    { value: '1 800 m²', label: 'Spa Holistique & Thermes' },
    { value: '24/7', label: 'Majordome & Flotte Privée' }
  ],
  experiencesShowcase: [
    {
      id: 'exp-gastronomy',
      kicker: 'HAUTE GASTRONOMIE • 3 ÉTOILES MICHELIN',
      title: 'L’Orangerie Céleste par le Chef Édouard Valmont',
      description:
        'Un voyage sensoriel en neuf séquences célébrant les terroirs rares, accompagné d’une cave secrète de plus de 14 000 flacons.',
      schedule: 'Dîner : 19h30 – 22h30 • Table du Chef sur réservation',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
      highlight: 'Cave Privée & Sommelier Dédié'
    },
    {
      id: 'exp-spa',
      kicker: 'SANCTUAIRE HOLISTIQUE • 1 800 M²',
      title: 'Thermes de Marbre Blanc & Rituels Cellulaires Suisses',
      description:
        'Piscine minérale chauffée de 25 mètres, suites de soin en duo avec hammam privé, cryothérapie et protocoles longévité sur-mesure.',
      schedule: 'Ouvert tous les jours : 07h00 – 22h00 • Privatisation nocturne possible',
      image:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
      highlight: 'Bassin Minéral & Suites Spa Privatives'
    },
    {
      id: 'exp-concierge',
      kicker: 'CONCIERGERIE CLEFS D’OR & MOBILITÉ',
      title: 'Transferts en Hélicoptère, Yachting & Accès Privés',
      description:
        'De votre tarmac privé jusqu’à votre suite, nos Clefs d’Or organisent vos visites privées de musées après fermeture et vos escapades en mer.',
      schedule: 'Service Majordome & Chauffeur Rolls-Royce Phantom 24h/24',
      image:
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=85',
      highlight: 'Flotte Rolls-Royce & Héliport Privé'
    }
  ]
};

export function formatCurrencyAmount(amountInEur: number, currency: CurrencyCode = 'EUR'): string {
  const currencyConfig = HOTEL_CONFIG.pricing.currencies[currency] || HOTEL_CONFIG.pricing.currencies.EUR;
  const converted = Math.round(amountInEur * currencyConfig.rateFromEur);
  const formattedNumber = new Intl.NumberFormat('fr-FR').format(converted);
  return currency === 'EUR' ? `${formattedNumber} €` : `${currencyConfig.symbol}${formattedNumber}`;
}

export * from './catalog';

