import { Room, ExperienceAddOn, BookingRecord } from '@hotel/types';

export const STATIC_SUITES: Room[] = [
  {
    id: 'suite-vendome-imperiale',
    slug: 'suite-vendome-imperiale',
    name: 'Suite Impériale Vendôme',
    subtitle: 'Terrasse Panoramique & Salon Privé Classé',
    category: 'ROYAL_PENTHOUSE',
    description:
      'Joyau architectural du 5ème étage avec boiseries XVIIIe dorées à la feuille d’or, piano à queue Steinway, salle à manger pour dix convives et terrasse privative surplombant la Colonne Vendôme.',
    pricePerNight: 4200,
    sizeSqm: 245,
    maxGuests: 4,
    bedConfiguration: '2 Chambres Master King Size (Literie Haute Couture Treca)',
    floorLevel: '5ème Étage Noble • Ascenseur Privé',
    viewType: 'EIFFEL_SKYLINE',
    viewLabel: 'Vue Place Vendôme & Tour Eiffel',
    heroImage:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'butler', label: 'Majordome Dédié 24h/24', icon: 'Crown', premium: true },
      { id: 'hammam', label: 'Hammam & Sauna en Marbre de Carrare', icon: 'Sparkles', premium: true },
      { id: 'transfer', label: 'Transfert Aéroport en Rolls-Royce Inclus', icon: 'Car', premium: true },
      { id: 'bar', label: 'Cave à Grands Crus & Champagne Dom Pérignon', icon: 'Wine' },
      { id: 'sound', label: 'Acoustique Devialet Phantom Or', icon: 'Volume2' },
      { id: 'terrace', label: 'Terrasse Chauffée de 65 m²', icon: 'Sun' }
    ],
    highlights: [
      'Transfert aller-retour aéroport en Rolls-Royce Phantom inclus',
      'Petit-déjeuner gastronomique servi en suite ou à L’Orangerie',
      'Accès privatif au Spa Nocturne sur demande'
    ],
    isFeatured: true,
    availableCount: 1,
    isAvailableForDates: true
  },
  {
    id: 'penthouse-celeste-eiffel',
    slug: 'penthouse-celeste-eiffel',
    name: 'Penthouse Céleste & Jardin Suspendu',
    subtitle: 'Duplex sous Verrière & Bassin de Nage Chauffé',
    category: 'ROYAL_PENTHOUSE',
    description:
      'Perché sur les toits avec une vue à 360 degrés, ce duplex contemporain marie marbre Calacatta, cheminée traversante au bioéthanol et jardin sur le toit doté d’un bassin chauffé à débordement.',
    pricePerNight: 5800,
    sizeSqm: 310,
    maxGuests: 6,
    bedConfiguration: '3 Suites Master King avec Dressings Walk-in',
    floorLevel: '6ème & 7ème Étages (Toit-Terrasse Exclusif)',
    viewType: 'EIFFEL_SKYLINE',
    viewLabel: 'Panorama 360° Toits de Paris & Tour Eiffel',
    heroImage:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'pool', label: 'Piscine Privée Chauffée sur le Toit', icon: 'Waves', premium: true },
      { id: 'chef', label: 'Cuisine de Chef & Cave Privée', icon: 'Utensils', premium: true },
      { id: 'butler', label: 'Majordome & Sécurité Privée', icon: 'ShieldCheck', premium: true },
      { id: 'spa-room', label: 'Cabine de Massage Duo Privée', icon: 'HeartHandshake' },
      { id: 'cinema', label: 'Salle de Projection Privée 4K Dolby Atmos', icon: 'Film' }
    ],
    highlights: [
      'Bassin privé chauffé à 32°C face à la Tour Eiffel scintillante',
      'Chef privé disponible pour un dîner sur-mesure en terrasse',
      'Check-in et Check-out flexibles garantis'
    ],
    isFeatured: true,
    availableCount: 1,
    isAvailableForDates: true
  },
  {
    id: 'villa-emeraude-lagon',
    slug: 'villa-emeraude-lagon',
    name: 'Villa Émeraude & Cour Intérieure',
    subtitle: 'Sanctuaire Botanique Privé & Piscine Miroir',
    category: 'PRIVATE_VILLA',
    description:
      'Une résidence totalement indépendante nichée au cœur du jardin secret du Palace. Entrée privée discrète, patio arboré d’oliviers centenaires, piscine miroir intérieure-extérieure et pavillon bien-être.',
    pricePerNight: 3600,
    sizeSqm: 220,
    maxGuests: 4,
    bedConfiguration: '2 Chambres King Size + Salon Bibliothèque',
    floorLevel: 'Rez-de-Jardin Privatif • Entrée Indépendante',
    viewType: 'PRIVATE_LAGOON',
    viewLabel: 'Patio Privé & Bassin Miroir',
    heroImage:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'lagoon', label: 'Bassin Miroir Privé Chauffé', icon: 'Waves', premium: true },
      { id: 'garden', label: 'Jardin Botanique Clos de 120 m²', icon: 'Trees', premium: true },
      { id: 'butler', label: 'Service Majordome 24h/24', icon: 'Crown' },
      { id: 'fireplace', label: 'Cheminée en Pierre de Bourgogne', icon: 'Flame' }
    ],
    highlights: [
      'Confidentialité absolue avec accès souterrain direct au limousine lounge',
      'Rituel de bienvenue au Spa Holistique (90 min pour 2 personnes)',
      'Dressing sur-mesure avec service de pressing haute couture'
    ],
    isFeatured: true,
    availableCount: 2,
    isAvailableForDates: true
  },
  {
    id: 'suite-signature-orangerie',
    slug: 'suite-signature-orangerie',
    name: 'Suite Signature L’Orangerie',
    subtitle: 'Lumière Traversante & Balcon sur les Jardins',
    category: 'SIGNATURE_SUITE',
    description:
      'Baignée de lumière naturelle grâce à ses quatre doubles portes-fenêtres, cette suite allie mobilier signé d’artisans français, étoffes Loro Piana et salle de bain monumentale en onyx miel.',
    pricePerNight: 1850,
    sizeSqm: 115,
    maxGuests: 3,
    bedConfiguration: '1 Lit King Size Majestueux + Méridienne Salon',
    floorLevel: '3ème Étage • Aile des Jardins',
    viewType: 'IMPERIAL_GARDEN',
    viewLabel: 'Vue Cour d’Honneur & Jardins à la Française',
    heroImage:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'onyx-bath', label: 'Salle de Bain en Onyx Miel & Douche Vapeur', icon: 'Sparkles', premium: true },
      { id: 'balcony', label: 'Balcon Filant en Fer Forgé', icon: 'Sun' },
      { id: 'bar', label: 'Bar à Spiritueux Rares & Machine Expresso Artisanale', icon: 'Coffee' },
      { id: 'sound', label: 'Système Audio Bang & Olufsen', icon: 'Volume2' }
    ],
    highlights: [
      'Petit-déjeuner américain ou détox inclus chaque matin',
      'Accueil Champagne Millésimé & Pâtisseries du Chef Pâtissier',
      'Accès illimité aux Thermes & Piscine Minérale de 25m'
    ],
    isFeatured: false,
    availableCount: 4,
    isAvailableForDates: true
  },
  {
    id: 'suite-horizon-azur',
    slug: 'suite-horizon-azur',
    name: 'Suite Horizon Grand Siècle',
    subtitle: 'Rotonde d’Angle & Salon de Musique',
    category: 'SIGNATURE_SUITE',
    description:
      'Située dans la rotonde historique de l’établissement, cette suite offre un salon circulaire spectaculaire, une bibliothèque d’œuvres d’art et un espace bureau gainé de cuir pleine fleur.',
    pricePerNight: 2350,
    sizeSqm: 145,
    maxGuests: 3,
    bedConfiguration: '1 Lit Emperor King Size + Salon Rotonde',
    floorLevel: '4ème Étage • Rotonde Principale',
    viewType: 'OCEAN_PANORAMA',
    viewLabel: 'Perspective Royale & Horizon Dégagé',
    heroImage:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'rotunda', label: 'Salon Rotonde Panoramique', icon: 'Compass', premium: true },
      { id: 'butler', label: 'Service Majordome Dédié', icon: 'Crown', premium: true },
      { id: 'bar', label: 'Cave à Vins Tempérée Privée', icon: 'Wine' }
    ],
    highlights: [
      'Déballage et pliage de vos effets personnels par votre Majordome',
      'Accès prioritaire à la Table 3 étoiles Michelin L’Orangerie Céleste'
    ],
    isFeatured: false,
    availableCount: 3,
    isAvailableForDates: true
  },
  {
    id: 'villa-royale-belvedere',
    slug: 'villa-royale-belvedere',
    name: 'Pavillon Royal Belvédère',
    subtitle: 'Hôtel Particulier Privé sur Trois Niveaux',
    category: 'PRIVATE_VILLA',
    description:
      'L’expression ultime de l’hospitalité privée : un hôtel particulier relié au Palace par une galerie secrète, doté de sa propre salle de sport Technogym Artis, cave à cigares et jardin d’hiver.',
    pricePerNight: 7500,
    sizeSqm: 420,
    maxGuests: 8,
    bedConfiguration: '4 Chambres En-Suite + Appartement Personnel Accompagnant',
    floorLevel: 'Hôtel Particulier Indépendant (3 Niveaux + Ascenseur)',
    viewType: 'IMPERIAL_GARDEN',
    viewLabel: 'Jardin Privé & Cour d’Honneur',
    heroImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'chauffeur', label: 'Chauffeur Rolls-Royce à Disposition Continue', icon: 'Car', premium: true },
      { id: 'chef', label: 'Brigade Culinaire & Majordome 24/7', icon: 'Utensils', premium: true },
      { id: 'spa-priv', label: 'Spa Privé, Hammam & Studio Fitness', icon: 'Sparkles', premium: true }
    ],
    highlights: [
      'Voiture avec chauffeur dédiée pendant toute la durée du séjour',
      'Privatisation complète avec entrée sécurisée indépendante',
      'Soins quotidiens au Spa inclus pour chaque résident'
    ],
    isFeatured: true,
    availableCount: 1,
    isAvailableForDates: true
  }
];

export const STATIC_ADDONS: ExperienceAddOn[] = [
  {
    id: 'addon-rolls-royce',
    code: 'VIP_ROLLS_TRANSFER',
    title: 'Transfert Privé en Rolls-Royce Phantom VIII',
    category: 'VIP_TRANSFER',
    description:
      'Accueil personnalisé au pied de l’avion (Salon VIP Tarmac) ou en gare avec chauffeur en livrée et rafraîchissements.',
    price: 480,
    pricingType: 'PER_STAY',
    image:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    badge: 'Le Plus Prisé'
  },
  {
    id: 'addon-michelin-dinner',
    code: 'GASTRO_9_COURSES',
    title: 'Dîner Dégustation 9 Séquences & Accords Grands Crus',
    category: 'GASTRONOMY',
    description:
      'Table privilégiée à L’Orangerie Céleste (3★ Michelin) avec visite privée de la cave historique par notre Chef Sommelier.',
    price: 620,
    pricingType: 'PER_GUEST',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    badge: '3★ Michelin'
  },
  {
    id: 'addon-spa-imperial',
    code: 'SPA_PRIVATIZATION',
    title: 'Rituel Impérial en Suite Spa Duo & Privatisation',
    category: 'SPA_WELLNESS',
    description:
      '2h30 de soin cellulaire haute précision, suivi d’une heure de privatisation du bassin minéral avec Champagne Rosé.',
    price: 750,
    pricingType: 'PER_STAY',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
    badge: 'Exclusivité'
  },
  {
    id: 'addon-champagne-caviar',
    code: 'ROYAL_WELCOME',
    title: 'Rituel d’Arrivée : Caviar Beluga Impérial & Krug Grande Cuvée',
    category: 'BESPOKE',
    description:
      'Dressé dans votre suite à votre arrivée par votre Majordome, accompagné d’une composition florale haute couture.',
    price: 890,
    pricingType: 'PER_STAY',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80'
  }
];

export const STATIC_BOOKINGS: BookingRecord[] = [
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
      id: STATIC_SUITES[0].id,
      slug: STATIC_SUITES[0].slug,
      name: STATIC_SUITES[0].name,
      subtitle: STATIC_SUITES[0].subtitle,
      heroImage: STATIC_SUITES[0].heroImage,
      category: STATIC_SUITES[0].category,
      sizeSqm: STATIC_SUITES[0].sizeSqm
    },
    addOns: [STATIC_ADDONS[0], STATIC_ADDONS[2]],
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
      currency: 'EUR'
    },
    createdAt: new Date().toISOString()
  }
];
