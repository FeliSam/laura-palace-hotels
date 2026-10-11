'use client';

import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  useGetAddOnsQuery,
  toggleAddOn,
  setDrawerOpen
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';
import { Check, Plus, Clock, Award, Flame, Utensils, Sparkles, Wine } from 'lucide-react';

type DishCategory = 'ALL' | 'BENIN_TERROIR' | 'ATLANTIC_GRILL' | 'WEST_AFRICA' | 'DESSERTS_BOISSONS';

interface AfricanDish {
  id: string;
  name: string;
  localSubtitle: string;
  category: Exclude<DishCategory, 'ALL'>;
  description: string;
  priceXof: number;
  image: string;
  badge?: string;
  spicyLevel?: 1 | 2 | 3;
}

const AFRICAN_GASTRONOMY_MENU: AfricanDish[] = [
  {
    id: 'dish-amiwo-pintade',
    name: 'Amiwo Royal à la Pintade Fermière',
    localSubtitle: 'Spécialité Royale d’Abomey',
    category: 'BENIN_TERROIR',
    description:
      'Pâte rouge de maïs épicée servie avec pintade braisée au feu de bois et piment vert.',
    priceXof: 14500,
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
    badge: 'Incontournable Bénin',
    spicyLevel: 2
  },
  {
    id: 'dish-agoun-igname',
    name: 'Agoun (Igname Pilée) & Sauce Gboma',
    localSubtitle: 'Tradition de Savalou',
    category: 'BENIN_TERROIR',
    description:
      'Igname Laboko pilée accompagnée d’une sauce Gboma aux crabes ou sauce arachide onctueuse.',
    priceXof: 13000,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85',
    badge: 'Terroir Savalou',
    spicyLevel: 2
  },
  {
    id: 'dish-atassi-royal',
    name: 'Atassi Gourmet & Capitaine Braisé',
    localSubtitle: 'Riz & Haricots • Sauce Dja',
    category: 'BENIN_TERROIR',
    description:
      'Duo béninois de riz et haricots rouges avec friture de tomates (Dja), wagassi et poisson braisé.',
    priceXof: 12000,
    image:
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=85',
    badge: 'Favori Local',
    spicyLevel: 1
  },
  {
    id: 'dish-langouste-peches',
    name: 'Langouste Grillée au Beurre d’Ail',
    localSubtitle: 'Pêche du Jour • Ouidah',
    category: 'ATLANTIC_GRILL',
    description:
      'Langouste entière de Ouidah saisie au beurre d’ail et citron vert, servie avec alloco et riz.',
    priceXof: 26000,
    image:
      'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1000&q=85',
    badge: 'Pêche de Ouidah'
  },
  {
    id: 'dish-bar-braise-cotonou',
    name: 'Daurade Braisée Fidjrossè & Alloco',
    localSubtitle: 'Épices Africaines & Attiéké',
    category: 'ATLANTIC_GRILL',
    description:
      'Poisson entier mariné au gingembre et poivre de Penja, servi avec attiéké et alloco dorés.',
    priceXof: 16500,
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85',
    badge: 'Grill de la Mer',
    spicyLevel: 2
  },
  {
    id: 'dish-wagassi-assiette',
    name: 'Wagassi Grillé du Nord-Bénin',
    localSubtitle: 'Fromage Peulh de Parakou',
    category: 'BENIN_TERROIR',
    description:
      'Fromage traditionnel du Borgou doré à la poêle, légumes croquants et piment doux.',
    priceXof: 8500,
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=85',
    badge: 'Spécialité Borgou',
    spicyLevel: 1
  },
  {
    id: 'dish-kedjenou-poulet',
    name: 'Kédjenou de Volaille & Riz Jollof',
    localSubtitle: 'Cuisson à l’Étouffée',
    category: 'WEST_AFRICA',
    description:
      'Volaille fermière mijotée aux légumes et gingembre, servie avec un riz Jollof fumé.',
    priceXof: 15000,
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=85',
    badge: 'Afrique de l’Ouest',
    spicyLevel: 2
  },
  {
    id: 'dish-ananas-pain-de-sucre',
    name: 'Ananas Pain de Sucre & Bissap',
    localSubtitle: 'IGP Plateau d’Allada',
    category: 'DESSERTS_BOISSONS',
    description:
      'Carpaccio d’ananas d’Allada à la vanille, sorbet baobab et jus de Bissap glacé à la menthe.',
    priceXof: 7500,
    image:
      'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1000&q=85',
    badge: 'Terroir d’Allada'
  }
];

const DISH_TABS: Array<{ id: DishCategory; label: string }> = [
  { id: 'ALL', label: 'Toute la Carte' },
  { id: 'BENIN_TERROIR', label: 'Mets du Bénin' },
  { id: 'ATLANTIC_GRILL', label: 'Grillades Mer' },
  { id: 'WEST_AFRICA', label: 'Afrique de l’Ouest' },
  { id: 'DESSERTS_BOISSONS', label: 'Desserts & Jus' }
];

export function ExperiencesSection() {
  const dispatch = useAppDispatch();
  const { data } = useGetAddOnsQuery();
  const { selectedAddOns } = useAppSelector((state) => state.booking);
  const { currency } = useAppSelector((state) => state.ui);
  const [activeDishTab, setActiveDishTab] = useState<DishCategory>('ALL');

  const addOns = data?.addOns || [];

  const filteredDishes =
    activeDishTab === 'ALL'
      ? AFRICAN_GASTRONOMY_MENU
      : AFRICAN_GASTRONOMY_MENU.filter((d) => d.category === activeDishTab);

  return (
    <section
      id="experiences"
      className="py-12 sm:py-20 bg-luxury-bg border-y border-luxury-border transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16 sm:space-y-20">
        {/* PART 1: CARTE GASTRONOMIQUE BÉNINOISE & AFRICAINE */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-luxury-border">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Utensils className="w-4 h-4 text-luxury-gold" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-luxury-gold font-semibold">
                  LA TABLE DE LA MARINA • CUISINE BÉNINOISE
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-luxury-text font-normal">
                Mets du Bénin & Grillades de l’Atlantique
              </h2>
            </div>

            <p className="text-xs text-luxury-muted max-w-md leading-relaxed">
              Recettes du terroir béninois et pêche fraîche de Ouidah. Service en salle, piscine ou en chambre.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {DISH_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDishTab(tab.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs tracking-[0.12em] uppercase transition-all border ${
                  activeDishTab === tab.id
                    ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold shadow-sm'
                    : 'bg-luxury-surface text-luxury-muted hover:text-luxury-text border-luxury-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDishes.map((dish) => (
              <article
                key={dish.id}
                className="editorial-card overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {dish.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 text-[#E5C98B] text-[10px] uppercase tracking-widest font-medium border border-white/15">
                        {dish.badge}
                      </span>
                    )}

                    {dish.spicyLevel && (
                      <span
                        title="Relevé aux épices douces du Bénin"
                        className="absolute top-3 right-3 px-2 py-1 bg-black/75 text-amber-400 text-[10px] flex items-center gap-0.5"
                      >
                        {Array.from({ length: dish.spicyLevel }).map((_, idx) => (
                          <Flame key={idx} className="w-3 h-3 fill-current" />
                        ))}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-[10px] uppercase tracking-wider text-white/85 truncate">
                        {dish.localSubtitle}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif text-lg sm:text-xl text-luxury-text leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-luxury-muted leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-luxury-border bg-luxury-surface/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-luxury-muted block">
                      Tarif Carte
                    </span>
                    <span className="font-serif text-base sm:text-lg text-luxury-gold font-semibold">
                      {formatCurrencyAmount(dish.priceXof, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => dispatch(setDrawerOpen(true))}
                    className="px-3 py-1.5 text-[11px] uppercase tracking-wider border border-luxury-border hover:border-luxury-gold text-luxury-text transition-colors"
                  >
                    Réserver Table
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* PART 2: ESPACES BIEN-ÊTRE, PISCINE & SERVICES DE L'HÔTEL */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.28em] text-luxury-gold font-semibold block mb-3">
              CADRE DE VIE • PISCINE LAGON, SPA & CONFÉRENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
              Les Espaces de Détente & d’Affaires
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {HOTEL_CONFIG.experiencesShowcase.map((exp) => (
              <div
                key={exp.id}
                className="editorial-card overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-black">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 px-3 py-1 bg-black/75 text-[10px] uppercase tracking-[0.18em] text-[#E5C98B] border border-white/15">
                      {exp.highlight}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold block">
                      {exp.kicker}
                    </span>
                    <h3 className="font-serif text-2xl text-luxury-text">{exp.title}</h3>
                    <p className="text-sm text-luxury-muted leading-relaxed">{exp.description}</p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-luxury-border bg-luxury-surface/50 flex items-center gap-2 text-xs text-luxury-muted">
                  <Clock className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                  <span>{exp.schedule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 3: FORFAITS & OPTIONS À AJOUTER À LA RÉSERVATION */}
        <div id="bespoke">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.28em] text-luxury-gold font-semibold block mb-2">
                OPTIONS SUR-MESURE • DEMI-PENSION, NAVETTE & EXCURSIONS
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-luxury-text">
                Ajoutez des Prestations à Votre Séjour
              </h3>
            </div>
            <button
              onClick={() => dispatch(setDrawerOpen(true))}
              className="self-start md:self-auto px-5 py-2.5 border border-luxury-gold text-luxury-text hover:bg-luxury-gold hover:text-white text-xs uppercase tracking-[0.18em] font-medium transition-all"
            >
              Voir mon panier de séjour ({selectedAddOns.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon) => {
              const isAdded = selectedAddOns.some((a) => a.id === addon.id);
              const pricingLabel =
                addon.pricingType === 'PER_GUEST'
                  ? '/ résident'
                  : addon.pricingType === 'PER_NIGHT'
                  ? '/ nuit'
                  : '/ séjour';

              return (
                <div
                  key={addon.id}
                  className={`editorial-card overflow-hidden flex flex-col justify-between ${
                    isAdded ? 'ring-2 ring-luxury-gold' : ''
                  }`}
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img
                        src={addon.image}
                        alt={addon.title}
                        className="w-full h-full object-cover"
                      />
                      {addon.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 text-[#E5C98B] text-[10px] uppercase tracking-widest flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {addon.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-2.5">
                      <h4 className="font-serif text-xl text-luxury-text leading-snug">
                        {addon.title}
                      </h4>
                      <p className="text-xs text-luxury-muted leading-relaxed">
                        {addon.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-luxury-border bg-luxury-surface/40 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-serif text-lg text-luxury-gold font-semibold">
                        {formatCurrencyAmount(addon.price, currency)}
                      </span>
                      <span className="text-[11px] text-luxury-muted ml-1">{pricingLabel}</span>
                    </div>

                    <button
                      onClick={() => dispatch(toggleAddOn(addon))}
                      className={`px-3.5 py-2 text-xs font-medium flex items-center gap-1.5 transition-all border ${
                        isAdded
                          ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                          : 'bg-luxury-surface text-luxury-text hover:border-luxury-gold border-luxury-border'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Inclus</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>Ajouter</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
