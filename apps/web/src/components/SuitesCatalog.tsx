'use client';

import React from 'react';
import {
  useAppDispatch,
  useAppSelector,
  useGetRoomsQuery,
  setCategoryFilter,
  setViewFilter,
  setSortBy,
  selectRoomForBooking,
  setInspectedRoom,
  selectBookingNights
} from '@hotel/store';
import { formatCurrencyAmount } from '@hotel/config';
import { Room, SuiteCategory, ViewType } from '@hotel/types';
import {
  Sparkles,
  Maximize2,
  Users,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  SlidersHorizontal
} from 'lucide-react';

const CATEGORY_TABS: Array<{ id: SuiteCategory; label: string }> = [
  { id: 'ALL', label: 'Toute la Collection' },
  { id: 'ROYAL_PENTHOUSE', label: 'Penthouses Royaux' },
  { id: 'PRIVATE_VILLA', label: 'Villas Privées' },
  { id: 'SIGNATURE_SUITE', label: 'Suites Signature' }
];

export function SuitesCatalog() {
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, adults, children, selectedRoom } = useAppSelector(
    (state) => state.booking
  );
  const { category, viewType, sortBy } = useAppSelector((state) => state.filters);
  const { currency } = useAppSelector((state) => state.ui);
  const nights = useAppSelector(selectBookingNights);

  const totalGuests = adults + children;

  const { data, isLoading } = useGetRoomsQuery({
    checkIn,
    checkOut,
    guests: totalGuests,
    category,
    viewType
  });

  const sortedRooms = React.useMemo(() => {
    const list = [...(data?.rooms || [])];
    if (sortBy === 'PRICE_ASC') return list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sortBy === 'PRICE_DESC') return list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sortBy === 'SIZE_DESC') return list.sort((a, b) => b.sizeSqm - a.sizeSqm);
    return list;
  }, [data?.rooms, sortBy]);

  return (
    <section id="suites" className="py-24 max-w-7xl mx-auto px-4 sm:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-luxury-gold block mb-3">
            COLLECTION D’EXCEPTION • TARIFS EN TEMPS RÉEL
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-luxury-text font-normal">
            Suites Présidentielles, Penthouses & Villas
          </h2>
        </div>
        <p className="text-sm text-luxury-muted max-w-md">
          Disponibilités vérifiées du <strong className="text-luxury-text">{checkIn}</strong> au{' '}
          <strong className="text-luxury-text">{checkOut}</strong> ({nights} nuit
          {nights > 1 ? 's' : ''}) pour <strong className="text-luxury-text">{totalGuests}</strong>{' '}
          résident{totalGuests > 1 ? 's' : ''}.
        </p>
      </div>

      {/* Interactive Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-luxury-border">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setCategoryFilter(tab.id))}
              className={`px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase transition-all ${
                category === tab.id
                  ? 'bg-luxury-gold text-black font-semibold shadow-md'
                  : 'bg-luxury-surface text-luxury-muted hover:text-luxury-text border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-luxury-surface px-3.5 py-2 rounded-full border border-white/10 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" />
            <select
              value={viewType}
              onChange={(e) => dispatch(setViewFilter(e.target.value as ViewType | 'ALL'))}
              className="bg-transparent text-luxury-text focus:outline-none"
            >
              <option value="ALL" className="bg-black">Toutes les perspectives</option>
              <option value="EIFFEL_SKYLINE" className="bg-black">Vue Tour Eiffel & Place Vendôme</option>
              <option value="IMPERIAL_GARDEN" className="bg-black">Jardins Impériaux</option>
              <option value="PRIVATE_LAGOON" className="bg-black">Bassin Miroir Privé</option>
              <option value="OCEAN_PANORAMA" className="bg-black">Horizon Panoramique</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as any))}
            className="bg-luxury-surface px-3.5 py-2 rounded-full border border-white/10 text-xs text-luxury-text focus:outline-none"
          >
            <option value="FEATURED" className="bg-black">Tri : Sélection Palace</option>
            <option value="PRICE_ASC" className="bg-black">Tarif : Croissant</option>
            <option value="PRICE_DESC" className="bg-black">Tarif : Décroissant</option>
            <option value="SIZE_DESC" className="bg-black">Superficie : Plus vaste</option>
          </select>
        </div>
      </div>

      {/* Suites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-[520px] rounded-2xl bg-luxury-surface/60 animate-pulse border border-luxury-border"
            />
          ))}
        </div>
      ) : sortedRooms.length === 0 ? (
        <div className="text-center py-16 luxury-glass rounded-2xl p-8">
          <p className="font-serif text-2xl text-luxury-text mb-2">
            Aucune suite ne correspond à ces critères précis
          </p>
          <p className="text-sm text-luxury-muted mb-6">
            Réduisez le nombre de résidents ou élargissez le filtre de collection.
          </p>
          <button
            onClick={() => {
              dispatch(setCategoryFilter('ALL'));
              dispatch(setViewFilter('ALL'));
            }}
            className="px-6 py-2.5 rounded-full bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sortedRooms.map((room: Room) => {
            const isSelected = selectedRoom?.id === room.id;
            const totalForStay = room.pricePerNight * nights;

            return (
              <article
                key={room.id}
                className={`group rounded-2xl overflow-hidden bg-luxury-card gold-shimmer-border flex flex-col justify-between transition-all ${
                  isSelected ? 'ring-2 ring-luxury-gold' : ''
                }`}
              >
                <div>
                  {/* Suite Visual Header */}
                  <div className="relative h-72 sm:h-80 overflow-hidden">
                    <img
                      src={room.heroImage}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full luxury-glass text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-medium">
                        {room.category === 'ROYAL_PENTHOUSE'
                          ? 'Penthouse Royal'
                          : room.category === 'PRIVATE_VILLA'
                          ? 'Villa Privée'
                          : 'Suite Signature'}
                      </span>

                      <button
                        onClick={() => dispatch(setInspectedRoom(room))}
                        className="px-3 py-1 rounded-full bg-black/70 hover:bg-luxury-gold hover:text-black text-white text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Galerie & Plan
                      </button>
                    </div>

                    {/* Bottom Overlay Metrics */}
                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-luxury-gold uppercase tracking-[0.18em]">
                          {room.viewLabel}
                        </p>
                        <h3 className="font-serif text-2xl sm:text-3xl text-white mt-0.5">
                          {room.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] uppercase tracking-wider text-luxury-muted block">
                          Par nuit
                        </span>
                        <span className="font-serif text-2xl text-luxury-gold font-semibold">
                          {formatCurrencyAmount(room.pricePerNight, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Suite Details Body */}
                  <div className="p-6 space-y-5">
                    {/* Dimensions & Capacity */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-luxury-muted pb-4 border-b border-white/10">
                      <span className="flex items-center gap-1.5 text-luxury-text">
                        <Maximize2 className="w-3.5 h-3.5 text-luxury-gold" />
                        {room.sizeSqm} m²
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-luxury-text">
                        <Users className="w-3.5 h-3.5 text-luxury-gold" />
                        Jusqu’à {room.maxGuests} résidents
                      </span>
                      <span>•</span>
                      <span className="truncate">{room.floorLevel}</span>
                    </div>

                    <p className="text-sm text-luxury-muted leading-relaxed line-clamp-3">
                      {room.description}
                    </p>

                    {/* Amenities Chips */}
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity.id}
                          className="px-3 py-1 rounded-lg bg-luxury-surface border border-white/5 text-[11px] text-luxury-text flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-luxury-gold" />
                          {amenity.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-6 py-4 bg-luxury-surface/70 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-luxury-muted block">
                      Total estimé ({nights} nuit{nights > 1 ? 's' : ''})
                    </span>
                    <span className="text-sm font-semibold text-luxury-text">
                      {formatCurrencyAmount(totalForStay, currency)}{' '}
                      <span className="text-[11px] text-emerald-400 font-normal ml-1">
                        • Disponible
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => dispatch(setInspectedRoom(room))}
                      className="px-3.5 py-2.5 rounded-xl border border-white/15 hover:border-luxury-gold text-xs text-luxury-text transition-colors"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() =>
                        dispatch(selectRoomForBooking({ room, openDrawer: true }))
                      }
                      className="px-5 py-2.5 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-[0.15em] hover:opacity-95 transition-all flex items-center gap-1.5"
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sélectionnée</span>
                        </>
                      ) : (
                        <>
                          <span>Réserver cette Suite</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
