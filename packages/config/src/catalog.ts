import { Room, ExperienceAddOn, BookingRecord } from '@hotel/types';

export const STATIC_SUITES: Room[] = [
  {
    id: 'chambre-superieure-marina',
    slug: 'chambre-superieure-marina',
    name: 'Chambre Supérieure Vue Jardin & Piscine',
    subtitle: 'Standard International • Climatisation & Wi-Fi Haut Débit',
    category: 'SIGNATURE_SUITE',
    description:
      'Idéale pour vos séjours d’affaires ou de détente à Cotonou. Chambre spacieuse et lumineuse dotée d’un lit King Size grand confort, bureau ergonomique, fibre optique dédiée, télévision Smart 55", salle de bain en marbre avec douche pluie et balcon donnant sur les jardins tropicaux et la piscine.',
    pricePerNight: 95000,
    sizeSqm: 34,
    maxGuests: 2,
    bedConfiguration: '1 Grand Lit King Size (ou 2 Lits Twin sur demande)',
    floorLevel: '2ème & 3ème Étages • Aile Marina',
    viewType: 'IMPERIAL_GARDEN',
    viewLabel: 'Vue Jardins Tropicaux & Piscine',
    heroImage:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'wifi', label: 'Wi-Fi Fibre Haut Débit Gratuit', icon: 'Wifi', premium: true },
      { id: 'breakfast', label: 'Petit-Déjeuner Buffet Inclus', icon: 'Coffee', premium: true },
      { id: 'ac', label: 'Climatisation Individuelle Silencieuse', icon: 'Wind' },
      { id: 'pool', label: 'Accès Libre Piscine & Salle de Sport', icon: 'Waves' },
      { id: 'desk', label: 'Bureau Affaires & Coffre-Fort Laptop', icon: 'Briefcase' },
      { id: 'tv', label: 'Smart TV 55" Chaînes Canal+ & Internationales', icon: 'Tv' }
    ],
    highlights: [
      'Petit-déjeuner buffet complet inclus dès 06h30 au restaurant',
      'Accès gratuit à la piscine extérieure de 25m et au studio fitness',
      'Espace de travail ergonomique avec prises internationales',
      'Service en chambre (Room Service) disponible 24h/24'
    ],
    isFeatured: true,
    availableCount: 8,
    isAvailableForDates: true
  },
  {
    id: 'chambre-executive-ocean',
    slug: 'chambre-executive-ocean',
    name: 'Chambre Exécutive Vue Océan Atlantique',
    subtitle: 'Étage Exécutif • Accès Salon VIP & Vue Mer',
    category: 'SIGNATURE_SUITE',
    description:
      'Située dans les étages supérieurs avec une vue dégagée sur l’Océan Atlantique et la côte de Fidjrossè. Comprend une machine expresso, un plateau de courtoisie béninois, une salle de bain panoramique avec douche à effet pluie et l’accès privilégié au Salon Exécutif.',
    pricePerNight: 135000,
    sizeSqm: 42,
    maxGuests: 3,
    bedConfiguration: '1 Lit King Size Premium + Fauteuil Méridienne',
    floorLevel: '4ème Étage Exécutif • Vue Mer',
    viewType: 'OCEAN_PANORAMA',
    viewLabel: 'Vue Panoramique Océan Atlantique',
    heroImage:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'shuttle', label: 'Navette Aéroport Cotonou Gratuite', icon: 'Car', premium: true },
      { id: 'lounge', label: 'Accès Salon VIP & Rafraîchissements', icon: 'Crown', premium: true },
      { id: 'coffee', label: 'Machine Nespresso & Mini-Bar', icon: 'Coffee' },
      { id: 'view', label: 'Baie Vitrée Vue Océan Atlantique', icon: 'Sun' },
      { id: 'wifi', label: 'Fibre Optique Dédiée Haut Débit', icon: 'Wifi' }
    ],
    highlights: [
      'Transfert Aéroport International de Cotonou aller-retour offert',
      'Check-in prioritaire et départ tardif selon disponibilité (14h00)',
      'Petit-déjeuner continental ou buffet servi au restaurant',
      'Accès au Salon Exécutif avec boissons et presse quotidienne'
    ],
    isFeatured: true,
    availableCount: 6,
    isAvailableForDates: true
  },
  {
    id: 'suite-junior-diplomatique',
    slug: 'suite-junior-diplomatique',
    name: 'Suite Junior Diplomatique Marina',
    subtitle: 'Salon Séparé & Terrasse sur le Boulevard de la Marina',
    category: 'ROYAL_PENTHOUSE',
    description:
      'Conçue pour les dirigeants, diplomates et séjours prolongés au Bénin. Dispose d’un salon de réception indépendant pour vos rendez-vous privés, d’une grande chambre en-suite, d’une salle de bain avec baignoire îlot et d’une terrasse surplombant l’océan.',
    pricePerNight: 195000,
    sizeSqm: 68,
    maxGuests: 3,
    bedConfiguration: '1 Lit King Size + Salon de Réception Indépendant',
    floorLevel: '5ème Étage • Aile Présidentielle',
    viewType: 'OCEAN_PANORAMA',
    viewLabel: 'Vue Mer & Boulevard de la Marina',
    heroImage:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'salon', label: 'Salon de Réception Privé (4 pers.)', icon: 'Users', premium: true },
      { id: 'shuttle', label: 'Accueil VIP Aéroport & Chauffeur', icon: 'Car', premium: true },
      { id: 'pressing', label: 'Service Pressing Express Inclus', icon: 'Sparkles' },
      { id: 'terrace', label: 'Terrasse Privée Vue Océan', icon: 'Sun' },
      { id: 'bath', label: 'Baignoire Îlot & Douche Italienne', icon: 'Waves' }
    ],
    highlights: [
      'Accueil personnalisé à l’aéroport de Cotonou avec véhicule privé',
      'Salon privé idéal pour vos réunions d’affaires confidentielles',
      'Corbeille de fruits tropicaux (ananas Pain de Sucre, mangues) à l’arrivée',
      'Pressing offert pour 2 pièces par jour'
    ],
    isFeatured: true,
    availableCount: 3,
    isAvailableForDates: true
  },
  {
    id: 'bungalow-famille-route-des-peches',
    slug: 'bungalow-famille-route-des-peches',
    name: 'Villa & Bungalow Plage (Style Route des Pêches)',
    subtitle: 'Terrasse Privée, Jardin de Cocotiers & Accès Plage',
    category: 'PRIVATE_VILLA',
    description:
      'Pour les familles ou les escapades balnéaires : un pavillon indépendant niché au calme dans la cocoteraie avec terrasse ombragée, deux chambres climatisées, grand salon lumineux et accès direct à la piscine lagon et à la plage.',
    pricePerNight: 240000,
    sizeSqm: 95,
    maxGuests: 4,
    bedConfiguration: '2 Chambres Climatisées (1 King + 2 Lits Simples) + Salon',
    floorLevel: 'Rez-de-Jardin & Plage • Entrée Indépendante',
    viewType: 'PRIVATE_LAGOON',
    viewLabel: 'Cocoteraie & Piscine Lagon',
    heroImage:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'family', label: '2 Chambres & Grand Salon Familial', icon: 'Home', premium: true },
      { id: 'terrace', label: 'Véranda Privée sous les Cocotiers', icon: 'Trees', premium: true },
      { id: 'breakfast', label: 'Petit-Déjeuner Inclus pour 4 Personnes', icon: 'Utensils' },
      { id: 'beach', label: 'Accès Direct Plage & Transats Privés', icon: 'Sun' }
    ],
    highlights: [
      'Parfait pour les séjours en famille ou entre amis au Bénin',
      'Petit-déjeuner complet inclus pour les 4 occupants',
      'Accès direct à la piscine lagon et aux jardins sans ascenseur',
      'Service grillades de poissons et langoustes sur votre terrasse privée'
    ],
    isFeatured: true,
    availableCount: 4,
    isAvailableForDates: true
  },
  {
    id: 'suite-presidentielle-amazone',
    slug: 'suite-presidentielle-amazone',
    name: 'Suite Présidentielle L’Amazone',
    subtitle: 'Appartement de Prestige • Vue Panoramique Cotonou & Océan',
    category: 'ROYAL_PENTHOUSE',
    description:
      'Notre suite la plus prestigieuse au dernier étage. Décorée d’œuvres d’art contemporain béninois, elle offre une salle à manger pour 8 convives, deux chambres master, un bureau présidentiel et une vaste terrasse face à l’Atlantique.',
    pricePerNight: 380000,
    sizeSqm: 145,
    maxGuests: 4,
    bedConfiguration: '2 Suites Master King Size + Salle à Manger & Salon',
    floorLevel: 'Dernier Étage Panoramique • Accès Sécurisé',
    viewType: 'EIFFEL_SKYLINE',
    viewLabel: 'Panorama 180° Océan & Monument Amazone',
    heroImage:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'vip', label: 'Véhicule SUV Climatisé avec Chauffeur Inclus', icon: 'Car', premium: true },
      { id: 'butler', label: 'Service Majordome & Conciergerie 24h/24', icon: 'Crown', premium: true },
      { id: 'dining', label: 'Salle de Réunion / Dîner Privé 8 Places', icon: 'Utensils', premium: true },
      { id: 'security', label: 'Accès Ascenseur Sécurisé VIP', icon: 'ShieldCheck' }
    ],
    highlights: [
      'Transfert VIP Salon d’Honneur Aéroport de Cotonou inclus',
      'Service d’étage et conciergerie dédiée 24h/24',
      'Accès illimité au Spa, Hammam et espace bien-être',
      'Mise à disposition d’un véhicule avec chauffeur sur Cotonou'
    ],
    isFeatured: false,
    availableCount: 1,
    isAvailableForDates: true
  },
  {
    id: 'villa-royale-pendjari',
    slug: 'villa-royale-pendjari',
    name: 'Villa Résidentielle Privée avec Piscine',
    subtitle: 'Résidence Haut Standing Indépendante pour Délégations & Familles',
    category: 'PRIVATE_VILLA',
    description:
      'Une villa contemporaine entièrement privatisée au sein du domaine hôtelier, dotée de 3 chambres avec salles de bain privatives, piscine privée chauffée, salon cathédrale et service hôtelier complet.',
    pricePerNight: 450000,
    sizeSqm: 210,
    maxGuests: 6,
    bedConfiguration: '3 Chambres En-Suite King Size + Salon & Piscine Privée',
    floorLevel: 'Domaine Résidentiel Sécurisé 24h/24',
    viewType: 'PRIVATE_LAGOON',
    viewLabel: 'Piscine Privée & Jardin Clos',
    heroImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=85'
    ],
    amenities: [
      { id: 'priv-pool', label: 'Piscine Privée & Terrasse Lounge', icon: 'Waves', premium: true },
      { id: 'security', label: 'Sécurité & Parking Privé Devant la Villa', icon: 'ShieldCheck', premium: true },
      { id: 'chef', label: 'Chef à Domicile sur Demande', icon: 'Utensils' },
      { id: 'wifi', label: 'Wi-Fi Fibre Dédié & Salon Cinéma', icon: 'Wifi' }
    ],
    highlights: [
      'Idéal pour les familles nombreuses, artistes ou délégations officielles',
      'Intimité totale avec tous les services 5★ de l’hôtel',
      'Navette aéroport aller-retour incluse',
      'Possibilité de dîner barbecue privé préparé par notre Chef'
    ],
    isFeatured: false,
    availableCount: 2,
    isAvailableForDates: true
  }
];

export const STATIC_ADDONS: ExperienceAddOn[] = [
  {
    id: 'addon-airport-shuttle',
    code: 'COTONOU_AIRPORT_VIP',
    title: 'Transfert Privé Aéroport de Cotonou (SUV Climatisé)',
    category: 'VIP_TRANSFER',
    description:
      'Accueil personnalisé avec pancarte nominative à la sortie des vols à l’Aéroport Cardinal Bernardin Gantin de Cotonou.',
    price: 25000,
    pricingType: 'PER_STAY',
    image:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    badge: 'Recommandé'
  },
  {
    id: 'addon-buffet-pension',
    code: 'DEMI_PENSION_BUFFET',
    title: 'Formule Demi-Pension : Grand Buffet & Grillades de la Mer',
    category: 'GASTRONOMY',
    description:
      'Dîner complet au restaurant principal : poissons braisés, langoustes, spécialités béninoises (Amiwo, Atassi gourmet) et buffet international.',
    price: 28000,
    pricingType: 'PER_GUEST',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    badge: 'Gastronomie'
  },
  {
    id: 'addon-excursion-ouidah-ganvie',
    code: 'TOUR_GANVIE_OUIDAH',
    title: 'Excursion Privée : Cité Lacustre de Ganvié ou Route de Ouidah',
    category: 'BESPOKE',
    description:
      'Sortie d’une demi-journée avec véhicule climatisé, guide officiel et embarcation motorisée privée à Ganvié ou visite historique de Ouidah.',
    price: 65000,
    pricingType: 'PER_STAY',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
    badge: 'Découverte Bénin'
  },
  {
    id: 'addon-spa-karite',
    code: 'SPA_KARITE_MASSAGE',
    title: 'Rituel Spa Relaxant au Beurre de Karité Pur & Huiles',
    category: 'SPA_WELLNESS',
    description:
      'Séance de 90 minutes de massage relaxant aux huiles naturelles et beurre de karité du Nord-Bénin, avec accès hammam.',
    price: 45000,
    pricingType: 'PER_STAY',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80'
  }
];

export const STATIC_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-demo-cotonou-1',
    referenceCode: 'AURA-2026-8841',
    status: 'CONFIRMED',
    checkIn: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    nights: 3,
    adults: 2,
    children: 0,
    room: {
      id: STATIC_SUITES[1].id,
      slug: STATIC_SUITES[1].slug,
      name: STATIC_SUITES[1].name,
      subtitle: STATIC_SUITES[1].subtitle,
      heroImage: STATIC_SUITES[1].heroImage,
      category: STATIC_SUITES[1].category,
      sizeSqm: STATIC_SUITES[1].sizeSqm
    },
    addOns: [STATIC_ADDONS[0], STATIC_ADDONS[1]],
    guest: {
      title: 'M.',
      firstName: 'Koffi',
      lastName: 'Soglo',
      email: 'k.soglo@entreprise-benin.bj',
      phone: '+229 01 97 00 11 22',
      country: 'Bénin',
      arrivalTime: '15:30',
      specialRequests: 'Accueil navette à l’arrivée du vol Air France à l’aéroport de Cotonou.',
      vipPreferences: ['Navette Aéroport Cotonou', 'Chambre Étage Élevé Vue Mer']
    },
    pricing: {
      nights: 3,
      roomRatePerNight: 135000,
      roomSubtotal: 405000,
      addOnsSubtotal: 81000,
      discountAmount: 0,
      taxesAndFees: 15000,
      totalPrice: 501000,
      currency: 'XOF'
    },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'bk-demo-cotonou-2',
    referenceCode: 'AURA-2026-7419',
    status: 'CONFIRMED',
    checkIn: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0],
    nights: 4,
    adults: 2,
    children: 1,
    room: {
      id: STATIC_SUITES[3].id,
      slug: STATIC_SUITES[3].slug,
      name: STATIC_SUITES[3].name,
      subtitle: STATIC_SUITES[3].subtitle,
      heroImage: STATIC_SUITES[3].heroImage,
      category: STATIC_SUITES[3].category,
      sizeSqm: STATIC_SUITES[3].sizeSqm
    },
    addOns: [STATIC_ADDONS[2]],
    guest: {
      title: 'Mme',
      firstName: 'Aïcha',
      lastName: 'Bello-Hountondji',
      email: 'aicha.bello@diaspora-invest.com',
      phone: '+229 01 96 44 55 88',
      country: 'Bénin / France',
      arrivalTime: '14:00',
      specialRequests: 'Menu dégustation béninois (Agoun & Amiwo Royal) souhaité le premier soir.',
      vipPreferences: ['Corbeille de Fruits Tropicaux', 'Paiement Mobile Money / Carte à l’arrivée']
    },
    pricing: {
      nights: 4,
      roomRatePerNight: 240000,
      roomSubtotal: 960000,
      addOnsSubtotal: 65000,
      discountAmount: 0,
      taxesAndFees: 20000,
      totalPrice: 1045000,
      currency: 'XOF'
    },
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'bk-demo-cotonou-3',
    referenceCode: 'AURA-2026-5290',
    status: 'PENDING_CONCIERGE',
    checkIn: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    nights: 2,
    adults: 2,
    children: 0,
    room: {
      id: STATIC_SUITES[4].id,
      slug: STATIC_SUITES[4].slug,
      name: STATIC_SUITES[4].name,
      subtitle: STATIC_SUITES[4].subtitle,
      heroImage: STATIC_SUITES[4].heroImage,
      category: STATIC_SUITES[4].category,
      sizeSqm: STATIC_SUITES[4].sizeSqm
    },
    addOns: [STATIC_ADDONS[0], STATIC_ADDONS[3]],
    guest: {
      title: 'Dr.',
      firstName: 'Ousmane',
      lastName: 'Diop',
      email: 'o.diop@boad-uemoa.org',
      phone: '+228 90 12 34 56',
      country: 'Sénégal / UEMOA',
      arrivalTime: '18:00',
      specialRequests: 'Préparation de la salle de réunion privée pour 6 personnes le lendemain à 10h.',
      vipPreferences: ['Navette Aéroport Cotonou', 'Check-in Prioritaire Dès 12h00']
    },
    pricing: {
      nights: 2,
      roomRatePerNight: 380000,
      roomSubtotal: 760000,
      addOnsSubtotal: 70000,
      discountAmount: 83000,
      taxesAndFees: 10000,
      totalPrice: 757000,
      currency: 'XOF'
    },
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 'bk-demo-cotonou-4',
    referenceCode: 'AURA-2026-3104',
    status: 'CONFIRMED',
    checkIn: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
    nights: 3,
    adults: 1,
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
    addOns: [],
    guest: {
      title: 'M.',
      firstName: 'Sébastien',
      lastName: 'Dossou-Yovo',
      email: 's.dossou@portcotonou.bj',
      phone: '+229 01 95 88 77 66',
      country: 'Bénin',
      arrivalTime: '14:30',
      specialRequests: 'Chambre au calme côté jardin.',
      vipPreferences: ['Paiement Mobile Money / Carte à l’arrivée']
    },
    pricing: {
      nights: 3,
      roomRatePerNight: 95000,
      roomSubtotal: 285000,
      addOnsSubtotal: 0,
      discountAmount: 0,
      taxesAndFees: 7500,
      totalPrice: 292500,
      currency: 'XOF'
    },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];
