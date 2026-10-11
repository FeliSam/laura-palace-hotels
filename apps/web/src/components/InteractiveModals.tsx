'use client';

import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setActiveTheme,
  setCustomHotelName,
  setCustomAccentColor,
  setCustomizerOpen,
  setLookupModalOpen,
  setInspectedRoom,
  selectRoomForBooking,
  useLazyGetBookingByReferenceQuery
} from '@hotel/store';
import { HOTEL_CONFIG, formatCurrencyAmount } from '@hotel/config';
import { PresetThemeId } from '@hotel/types';
import {
  X,
  Palette,
  Sparkles,
  Check,
  Search,
  Maximize2,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';

export function InteractiveModals() {
  const dispatch = useAppDispatch();
  const {
    activeTheme,
    customHotelName,
    customAccentColor,
    isCustomizerOpen,
    isLookupModalOpen,
    inspectedRoom,
    currency
  } = useAppSelector((state) => state.ui);

  const [lookupInput, setLookupInput] = useState('AURA-2026-8841');
  const [triggerLookup, { data: lookupData, isFetching: isLookingUp, error: lookupError }] =
    useLazyGetBookingByReferenceQuery();

  const accentPresets = [
    { label: 'Or Champagne', hex: '#C9A45C' },
    { label: 'Bronze Impérial', hex: '#D08B5B' },
    { label: 'Émeraude Palace', hex: '#4E9F86' },
    { label: 'Bleu Riviera', hex: '#63B3ED' },
    { label: 'Rose Vendôme', hex: '#D48C96' }
  ];

  return (
    <>
      {/* 1. WHITE-LABEL LIVE CUSTOMIZER MODAL */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => dispatch(setCustomizerOpen(false))}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-luxury-card border border-luxury-border p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-luxury-gold" />
                <div>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    Studio White-Label en Direct
                  </h3>
                  <p className="text-xs text-luxury-muted">
                    Personnalisez instantanément l’identité et l’atmosphère de votre hôtel
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(setCustomizerOpen(false))}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Hotel Name */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-widest text-luxury-gold">
                Nom de Votre Établissement
              </label>
              <input
                type="text"
                value={customHotelName}
                onChange={(e) => dispatch(setCustomHotelName(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-sm text-luxury-text"
              />
            </div>

            {/* Preset Ambiances */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-luxury-gold">
                Atmosphère & Direction Artistique Pré-configurée
              </label>
              <div className="space-y-2.5">
                {(Object.keys(HOTEL_CONFIG.themes) as PresetThemeId[]).map((themeId) => {
                  const t = HOTEL_CONFIG.themes[themeId];
                  const isActive = activeTheme === themeId;
                  return (
                    <button
                      key={themeId}
                      onClick={() => dispatch(setActiveTheme(themeId))}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'border-luxury-gold bg-luxury-surface'
                          : 'border-white/10 bg-luxury-surface/40 hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-luxury-text">{t.label}</div>
                        <div className="text-xs text-luxury-muted">{t.locationOverride}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-5 h-5 rounded-full border border-white/20"
                          style={{ backgroundColor: t.colors.backgroundPrimary }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-white/20"
                          style={{ backgroundColor: t.colors.accentPrimary }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Accent Color */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-luxury-gold">
                Couleur Signature (Accent Or / Bijou)
              </label>
              <div className="flex flex-wrap gap-2">
                {accentPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => dispatch(setCustomAccentColor(preset.hex))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-surface border border-white/10 text-xs hover:border-white/40"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => dispatch(setCustomizerOpen(false))}
                className="px-6 py-2.5 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-widest"
              >
                Appliquer au Site
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOKING REFERENCE LOOKUP MODAL */}
      {isLookupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => dispatch(setLookupModalOpen(false))}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-luxury-card border border-luxury-border p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold">
                  CONCIERGERIE EN LIGNE
                </span>
                <h3 className="font-serif text-2xl text-luxury-text">
                  Consulter Votre Dossier de Réservation
                </h3>
              </div>
              <button
                onClick={() => dispatch(setLookupModalOpen(false))}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (lookupInput.trim()) triggerLookup(lookupInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value.toUpperCase())}
                placeholder="Ex: AURA-2026-8841"
                className="flex-1 px-4 py-2.5 rounded-xl bg-luxury-surface border border-white/15 text-sm font-mono uppercase"
              />
              <button
                type="submit"
                disabled={isLookingUp}
                className="px-5 py-2.5 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Rechercher</span>
              </button>
            </form>

            {Boolean(lookupError) && (
              <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200">
                Aucun dossier trouvé pour cette référence. Essayez le dossier de démonstration{' '}
                <strong className="text-white">AURA-2026-8841</strong>.
              </div>
            )}

            {lookupData?.booking && (
              <div className="p-5 rounded-xl bg-luxury-surface border border-luxury-gold/40 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-mono text-sm text-luxury-gold font-bold">
                    {lookupData.booking.referenceCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase tracking-wider">
                    ✓ {lookupData.booking.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Résident Principal :</span>
                  <span className="text-luxury-text font-medium">
                    {lookupData.booking.guest.title} {lookupData.booking.guest.firstName}{' '}
                    {lookupData.booking.guest.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Suite :</span>
                  <span className="text-luxury-text font-medium">
                    {lookupData.booking.room.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-muted">Séjour :</span>
                  <span className="text-luxury-text">
                    Du {lookupData.booking.checkIn} au {lookupData.booking.checkOut} (
                    {lookupData.booking.nights} nuits)
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-luxury-muted">Montant Total TTC :</span>
                  <span className="font-serif text-lg text-luxury-gold font-semibold">
                    {formatCurrencyAmount(lookupData.booking.pricing.totalPrice, currency)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SUITE DETAIL & GALLERY INSPECTION MODAL */}
      {inspectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => dispatch(setInspectedRoom(null))}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-luxury-card border border-luxury-border shadow-2xl">
            <div className="relative h-80 sm:h-96">
              <img
                src={inspectedRoom.heroImage}
                alt={inspectedRoom.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <button
                onClick={() => dispatch(setInspectedRoom(null))}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-luxury-gold hover:text-black flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-luxury-gold">
                    {inspectedRoom.viewLabel}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-white">
                    {inspectedRoom.name}
                  </h3>
                  <p className="text-xs text-luxury-muted mt-1">{inspectedRoom.subtitle}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-serif text-3xl text-luxury-gold font-semibold block">
                    {formatCurrencyAmount(inspectedRoom.pricePerNight, currency)}
                  </span>
                  <span className="text-xs text-luxury-muted">par nuit • Petit-déjeuner inclus</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-luxury-surface border border-white/10 text-xs">
                <div>
                  <span className="text-luxury-muted block">Superficie</span>
                  <span className="text-luxury-text font-semibold text-sm">
                    {inspectedRoom.sizeSqm} m²
                  </span>
                </div>
                <div>
                  <span className="text-luxury-muted block">Configuration Literie</span>
                  <span className="text-luxury-text font-semibold">
                    {inspectedRoom.bedConfiguration}
                  </span>
                </div>
                <div>
                  <span className="text-luxury-muted block">Étage & Accès</span>
                  <span className="text-luxury-text font-semibold">
                    {inspectedRoom.floorLevel}
                  </span>
                </div>
              </div>

              <p className="text-sm text-luxury-muted leading-relaxed">
                {inspectedRoom.description}
              </p>

              {/* Privilèges Inclus */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-[0.2em] text-luxury-gold">
                  Privilèges Exclusifs Inclus avec cette Suite
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inspectedRoom.highlights.map((h) => (
                    <div
                      key={h}
                      className="p-3 rounded-xl bg-luxury-surface/70 border border-white/5 text-xs flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-luxury-gold shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => dispatch(setInspectedRoom(null))}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-xs uppercase tracking-wider"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    const room = inspectedRoom;
                    dispatch(setInspectedRoom(null));
                    dispatch(selectRoomForBooking({ room, openDrawer: true }));
                  }}
                  className="px-6 py-3 rounded-xl bg-luxury-gold text-black font-semibold text-xs uppercase tracking-[0.18em]"
                >
                  Réserver cette Suite Maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
