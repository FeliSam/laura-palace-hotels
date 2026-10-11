'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useAppDispatch,
  useAppSelector,
  useGetRoomsQuery,
  setCategoryFilter,
  setViewFilter,
  setSortBy,
  selectRoomForBooking,
  selectBookingNights
} from '@hotel/store';
import { formatCurrencyAmount } from '@hotel/config';
import { Room, SuiteCategory, ViewType } from '@hotel/types';
import {
  Maximize2,
  Users,
  Check,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Images
} from 'lucide-react';

const CATEGORY_TABS: Array<{ id: SuiteCategory; label: string }> = [
  { id: 'ALL', label: 'Toute la Collection' },
  { id: 'ROYAL_PENTHOUSE', label: 'Suites & Penthouses' },
  { id: 'PRIVATE_VILLA', label: 'Villas & Bungalows' },
  { id: 'SIGNATURE_SUITE', label: 'Chambres Exécutives' }
];

function RoomCardWithGallery({
  room,
  nights,
  currency,
  isSelected,
  onSelectForBooking
}: {
  room: Room;
  nights: number;
  currency: any;
  isSelected: boolean;
  onSelectForBooking: () => void;
}) {
  const images = room.gallery && room.gallery.length > 0 ? room.gallery : [room.heroImage];
  const [imgIndex, setImgIndex] = useState(0);
  const totalForStay = room.pricePerNight * nights;

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <article
      className={`group editorial-card flex flex-col justify-between ${
        isSelected ? 'ring-2 ring-luxury-gold' : ''
      }`}
    >
      <div>
        {/* Multi-Image Interactive Gallery Header */}
        <div className="relative h-80 overflow-hidden bg-black">
          <img
            src={images[imgIndex]}
            alt={`${room.name} - Photo ${imgIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

          {/* Prev / Next Image Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Photo précédente"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/65 text-white hover:bg-luxury-gold flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Photo suivante"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/65 text-white hover:bg-luxury-gold flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Top Badges & Photo Counter */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-[#E5C98B] border border-white/15">
              {room.category === 'ROYAL_PENTHOUSE'
                ? 'Suite Prestige'
                : room.category === 'PRIVATE_VILLA'
                ? 'Villa & Bungalow'
                : 'Chambre Exécutive'}
            </span>

            <span className="px-2.5 py-1 bg-black/75 text-white text-[10px] tracking-wider flex items-center gap-1.5 rounded-full">
              <Images className="w-3 h-3 text-[#E5C98B]" />
              {imgIndex + 1} / {images.length}
            </span>
          </div>

          {/* Thumbnail Dots */}
          <div className="absolute bottom-16 left-6 flex items-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImgIndex(idx)}
                aria-label={`Voir photo ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === imgIndex ? 'w-6 bg-[#E5C98B]' : 'w-1.5 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#E5C98B]">
              {room.viewLabel}
            </p>
            <Link
              href={`/suites/${room.slug}`}
              className="font-serif text-2xl sm:text-3xl font-normal mt-0.5 hover:underline block"
            >
              {room.name}
            </Link>
          </div>
        </div>

        {/* Interactive Thumbnail Strip */}
        <div className="grid grid-cols-5 gap-1 p-1.5 bg-luxury-surface border-b border-luxury-border">
          {images.slice(0, 5).map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setImgIndex(idx)}
              className={`h-12 overflow-hidden border transition-all ${
                idx === imgIndex
                  ? 'border-luxury-gold opacity-100 scale-[0.98]'
                  : 'border-transparent opacity-60 hover:opacity-95'
              }`}
            >
              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
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

          <p className="text-sm text-luxury-muted leading-relaxed line-clamp-3">
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
      <div className="px-6 sm:px-8 py-5 bg-luxury-surface/50 border-t border-luxury-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-luxury-muted block">
            {formatCurrencyAmount(room.pricePerNight, currency)} / nuit
          </span>
          <span className="font-serif text-2xl text-luxury-text font-medium">
            {formatCurrencyAmount(totalForStay, currency)}{' '}
            <span className="font-sans text-[11px] text-luxury-muted font-normal">
              ({nights} nuit{nights > 1 ? 's' : ''})
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dedicated Page Link */}
          <Link
            href={`/suites/${room.slug}`}
            className="px-4 py-2.5 border border-luxury-border hover:border-luxury-gold text-[11px] uppercase tracking-[0.15em] text-luxury-text font-medium transition-colors"
          >
            Voir la Chambre
          </Link>

          <button
            onClick={onSelectForBooking}
            className="px-5 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors flex items-center gap-1.5"
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Choisie</span>
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
}

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
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      {/* Editorial Filter Bar */}
      {!limit && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-luxury-border">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setCategoryFilter(tab.id))}
                className={`px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition-all border ${
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
                  Toutes les vues
                </option>
                <option value="OCEAN_PANORAMA" className="bg-luxury-card text-luxury-text">
                  Vue Océan Atlantique
                </option>
                <option value="IMPERIAL_GARDEN" className="bg-luxury-card text-luxury-text">
                  Jardins & Piscine
                </option>
                <option value="PRIVATE_LAGOON" className="bg-luxury-card text-luxury-text">
                  Cocoteraie & Lagon
                </option>
                <option value="EIFFEL_SKYLINE" className="bg-luxury-card text-luxury-text">
                  Panorama Marina & Amazone
                </option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              className="bg-luxury-surface/60 px-3.5 py-2 border border-luxury-border text-xs text-luxury-text focus:outline-none"
            >
              <option value="FEATURED" className="bg-luxury-card text-luxury-text">
                Tri : Recommandé
              </option>
              <option value="PRICE_ASC" className="bg-luxury-card text-luxury-text">
                Tarif : Croissant (FCFA)
              </option>
              <option value="PRICE_DESC" className="bg-luxury-card text-luxury-text">
                Tarif : Décroissant (FCFA)
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
              className="h-[540px] bg-luxury-surface animate-pulse border border-luxury-border"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {sortedRooms.map((room: Room) => (
            <RoomCardWithGallery
              key={room.id}
              room={room}
              nights={nights}
              currency={currency}
              isSelected={selectedRoom?.id === room.id}
              onSelectForBooking={() =>
                dispatch(selectRoomForBooking({ room, openDrawer: true }))
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
