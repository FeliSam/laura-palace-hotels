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
import { Maximize2, Users, Eye, Check, ArrowUpRight, SlidersHorizontal } from 'lucide-react';

const CATEGORY_TABS: Array<{ id: SuiteCategory; label: string }> = [
  { id: 'ALL', label: 'Toute la Collection' },
  { id: 'ROYAL_PENTHOUSE', label: 'Penthouses Royaux' },
  { id: 'PRIVATE_VILLA', label: 'Villas Privées' },
  { id: 'SIGNATURE_SUITE', label: 'Suites Signature' }
];

export function SuitesCatalog({ limit }: { limit?: number }) {
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
    if (sortBy === 'PRICE_ASC') list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sortBy === 'PRICE_DESC') list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sortBy === 'SIZE_DESC') list.sort((a, b) => b.sizeSqm - a.sizeSqm);
    return limit ? list.slice(0, limit) : list;
  }, [data?.rooms, sortBy, limit]);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      {/* Editorial Filter Bar */}
      {!limit && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-luxury-border">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setCategoryFilter(tab.id))}
                className={`px-4 py-2 text-[11px] tracking-[0.18em] uppercase transition-all border ${
                  category === tab.id
                    ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                    : 'bg-luxury-surface/60 text-luxury-muted hover:text-luxury-text border-luxury-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-luxury-surface/60 px-3.5 py-2 border border-luxury-border text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-gold" />
              <select
                value={viewType}
                onChange={(e) => dispatch(setViewFilter(e.target.value as ViewType | 'ALL'))}
                className="bg-transparent text-luxury-text focus:outline-none text-xs"
              >
                <option value="ALL" className="bg-luxury-card text-luxury-text">
                  Toutes les perspectives
                </option>
                <option value="EIFFEL_SKYLINE" className="bg-luxury-card text-luxury-text">
                  Vue Tour Eiffel & Place Vendôme
                </option>
                <option value="IMPERIAL_GARDEN" className="bg-luxury-card text-luxury-text">
                  Jardins Impériaux
                </option>
                <option value="PRIVATE_LAGOON" className="bg-luxury-card text-luxury-text">
                  Bassin Miroir Privé
                </option>
                <option value="OCEAN_PANORAMA" className="bg-luxury-card text-luxury-text">
                  Horizon Panoramique
                </option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              className="bg-luxury-surface/60 px-3.5 py-2 border border-luxury-border text-xs text-luxury-text focus:outline-none"
            >
              <option value="FEATURED" className="bg-luxury-card text-luxury-text">
                Tri : Sélection Palace
              </option>
              <option value="PRICE_ASC" className="bg-luxury-card text-luxury-text">
                Tarif : Croissant
              </option>
              <option value="PRICE_DESC" className="bg-luxury-card text-luxury-text">
                Tarif : Décroissant
              </option>
              <option value="SIZE_DESC" className="bg-luxury-card text-luxury-text">
                Superficie : Plus vaste
              </option>
            </select>
          </div>
        </div>
      )}

      {/* Suites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-[520px] bg-luxury-surface animate-pulse border border-luxury-border"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {sortedRooms.map((room: Room) => {
            const isSelected = selectedRoom?.id === room.id;
            const totalForStay = room.pricePerNight * nights;

            return (
              <article
                key={room.id}
                className={`group editorial-card flex flex-col justify-between ${
                  isSelected ? 'ring-1 ring-luxury-gold' : ''
                }`}
              >
                <div>
                  {/* Architectural Photography */}
                  <div className="relative h-80 overflow-hidden bg-black">
                    <img
                      src={room.heroImage}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[10px] uppercase tracking-[0.22em] text-[#E5C98B]">
                        {room.category === 'ROYAL_PENTHOUSE'
                          ? 'Penthouse Royal'
                          : room.category === 'PRIVATE_VILLA'
                          ? 'Villa Privée'
                          : 'Suite Signature'}
                      </span>

                      <button
                        onClick={() => dispatch(setInspectedRoom(room))}
                        className="px-3 py-1 bg-white/90 text-black hover:bg-luxury-gold hover:text-white text-[10px] uppercase tracking-[0.18em] flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Plan & Galerie</span>
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-6 right-6 text-white">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#E5C98B]">
                        {room.viewLabel}
                      </p>
                      <h3 className="font-serif text-3xl font-normal mt-0.5">{room.name}</h3>
                    </div>
                  </div>

                  {/* Editorial Details */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-luxury-muted pb-4 border-b border-luxury-border">
                      <span className="flex items-center gap-1.5 text-luxury-text font-medium">
                        <Maximize2 className="w-3.5 h-3.5 text-luxury-gold" />
                        {room.sizeSqm} m²
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-luxury-text font-medium">
                        <Users className="w-3.5 h-3.5 text-luxury-gold" />
                        Jusqu’à {room.maxGuests} résidents
                      </span>
                      <span>•</span>
                      <span>{room.floorLevel}</span>
                    </div>

                    <p className="text-sm text-luxury-muted leading-relaxed">
                      {room.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <div
                          key={amenity.id}
                          className="text-xs text-luxury-text flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                          <span>{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Direct Reservation Bar */}
                <div className="px-6 sm:px-8 py-5 bg-luxury-surface/50 border-t border-luxury-border flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-luxury-muted block">
                      {formatCurrencyAmount(room.pricePerNight, currency)} / nuit
                    </span>
                    <span className="font-serif text-2xl text-luxury-text font-medium">
                      {formatCurrencyAmount(totalForStay, currency)}{' '}
                      <span className="font-sans text-[11px] text-luxury-muted font-normal">
                        pour {nights} nuit{nights > 1 ? 's' : ''}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(setInspectedRoom(room))}
                      className="px-4 py-2.5 border border-luxury-border hover:border-luxury-text text-[11px] uppercase tracking-[0.16em] text-luxury-text transition-colors"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() =>
                        dispatch(selectRoomForBooking({ room, openDrawer: true }))
                      }
                      className="px-5 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-[0.18em] font-medium transition-colors flex items-center gap-1.5"
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Sélectionnée</span>
                        </>
                      ) : (
                        <>
                          <span>Réserver</span>
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
