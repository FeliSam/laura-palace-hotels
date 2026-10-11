'use client';

import React, { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setActiveTheme,
  setColorMode,
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
import { X, Palette, Check, Search, Sun, Moon } from 'lucide-react';

export function InteractiveModals() {
  const dispatch = useAppDispatch();
  const {
    activeTheme,
    colorMode,
    customHotelName,
    isCustomizerOpen,
    isLookupModalOpen,
    inspectedRoom,
    currency
  } = useAppSelector((state) => state.ui);

  const [lookupInput, setLookupInput] = useState('AURA-2026-8841');
  const [triggerLookup, { data: lookupData, isFetching: isLookingUp, error: lookupError }] =
    useLazyGetBookingByReferenceQuery();

  const accentPresets = [
    { label: 'Or Champagne', hex: '#9A7432' },
    { label: 'Bronze Impérial', hex: '#B4693E' },
    { label: 'Émeraude Palace', hex: '#2F7A62' },
    { label: 'Bleu Riviera', hex: '#2B6CB0' },
    { label: 'Bordeaux Royal', hex: '#8C3B4A' }
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
          <div className="relative z-10 w-full max-w-lg editorial-card p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-border pb-4">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-luxury-gold" />
                <div>
                  <h3 className="font-serif text-2xl text-luxury-text">
                    Studio White-Label & Atmosphère
                  </h3>
                  <p className="text-xs text-luxury-muted">
                    Personnalisez le mode Jour/Nuit, le nom et la signature visuelle
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(setCustomizerOpen(false))}
                className="w-8 h-8 border border-luxury-border flex items-center justify-center text-luxury-text hover:border-luxury-gold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Light / Dark Mode Switch inside Studio */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-widest text-luxury-gold font-semibold">
                Luminosité de l’Interface (Jour / Nuit)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(setColorMode('light'))}
                  className={`p-3 border text-xs flex items-center justify-center gap-2 transition-all ${
                    colorMode === 'light'
                      ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                      : 'bg-luxury-surface text-luxury-muted border-luxury-border'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Mode Jour (Albâtre)</span>
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setColorMode('dark'))}
                  className={`p-3 border text-xs flex items-center justify-center gap-2 transition-all ${
                    colorMode === 'dark'
                      ? 'bg-luxury-text text-luxury-bg border-luxury-text font-semibold'
                      : 'bg-luxury-surface text-luxury-muted border-luxury-border'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Mode Nuit (Obsidienne)</span>
                </button>
              </div>
            </div>

            {/* Custom Hotel Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-widest text-luxury-gold font-semibold">
                Nom de Votre Établissement
              </label>
              <input
                type="text"
                value={customHotelName}
                onChange={(e) => dispatch(setCustomHotelName(e.target.value))}
                className="w-full px-4 py-2.5 bg-luxury-surface border border-luxury-border text-sm text-luxury-text"
              />
            </div>

            {/* Preset Ambiances */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-widest text-luxury-gold font-semibold">
                Destination & Photographie de Bannière
              </label>
              <div className="space-y-2">
                {(Object.keys(HOTEL_CONFIG.themes) as PresetThemeId[]).map((themeId) => {
                  const t = HOTEL_CONFIG.themes[themeId];
                  const isActive = activeTheme === themeId;
                  return (
                    <button
                      key={themeId}
                      onClick={() => dispatch(setActiveTheme(themeId))}
                      className={`w-full p-3.5 border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'border-luxury-gold bg-luxury-surface font-semibold'
                          : 'border-luxury-border bg-luxury-surface/40 hover:border-luxury-gold'
                      }`}
                    >
                      <div>
                        <div className="text-sm text-luxury-text">{t.label}</div>
                        <div className="text-xs text-luxury-muted">{t.locationOverride}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-5 h-5 rounded-full border border-luxury-border"
                          style={{ backgroundColor: t.colors.backgroundPrimary }}
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-luxury-border"
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
              <label className="block text-[11px] uppercase tracking-widest text-luxury-gold font-semibold">
                Couleur Signature (Accent)
              </label>
              <div className="flex flex-wrap gap-2">
                {accentPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => dispatch(setCustomAccentColor(preset.hex))}
                    className="flex items-center gap-2 px-3 py-1.5 bg-luxury-surface border border-luxury-border text-xs text-luxury-text hover:border-luxury-gold"
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
                className="px-6 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-widest transition-colors"
              >
                Fermer & Appliquer
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
          <div className="relative z-10 w-full max-w-lg editorial-card p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-luxury-border pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-luxury-gold font-semibold">
                  CONCIERGERIE EN LIGNE
                </span>
                <h3 className="font-serif text-2xl text-luxury-text">
                  Consulter Votre Dossier de Réservation
                </h3>
              </div>
              <button
                onClick={() => dispatch(setLookupModalOpen(false))}
                className="w-8 h-8 border border-luxury-border flex items-center justify-center text-luxury-text"
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
                className="flex-1 px-4 py-2.5 bg-luxury-surface border border-luxury-border text-sm font-mono uppercase text-luxury-text"
              />
              <button
                type="submit"
                disabled={isLookingUp}
                className="px-5 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Rechercher</span>
              </button>
            </form>

            {Boolean(lookupError) && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-xs text-luxury-text">
                Aucun dossier trouvé pour cette référence. Essayez le dossier de démonstration{' '}
                <strong className="text-luxury-gold">AURA-2026-8841</strong>.
              </div>
            )}

            {lookupData?.booking && (
              <div className="p-5 bg-luxury-surface border border-luxury-border space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-luxury-border pb-2">
                  <span className="font-mono text-sm text-luxury-gold font-bold">
                    {lookupData.booking.referenceCode}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 font-semibold text-[10px] uppercase tracking-wider">
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
                <div className="flex justify-between pt-2 border-t border-luxury-border">
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
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto editorial-card shadow-2xl">
            <div className="relative h-80 sm:h-96 bg-black">
              <img
                src={inspectedRoom.heroImage}
                alt={inspectedRoom.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <button
                onClick={() => dispatch(setInspectedRoom(null))}
                className="absolute top-4 right-4 w-10 h-10 bg-black/75 text-white hover:bg-luxury-gold flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-[#E5C98B]">
                    {inspectedRoom.viewLabel}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-white">
                    {inspectedRoom.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1">{inspectedRoom.subtitle}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-serif text-3xl text-[#E5C98B] font-semibold block">
                    {formatCurrencyAmount(inspectedRoom.pricePerNight, currency)}
                  </span>
                  <span className="text-xs text-white/80">par nuit • Petit-déjeuner inclus</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-luxury-surface border border-luxury-border text-xs">
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
                <h4 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold">
                  Privilèges Exclusifs Inclus avec cette Suite
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inspectedRoom.highlights.map((h) => (
                    <div
                      key={h}
                      className="p-3 bg-luxury-surface border border-luxury-border text-xs text-luxury-text flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-luxury-gold shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-luxury-border">
                <button
                  onClick={() => dispatch(setInspectedRoom(null))}
                  className="px-5 py-2.5 border border-luxury-border text-xs uppercase tracking-wider text-luxury-text"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    const room = inspectedRoom;
                    dispatch(setInspectedRoom(null));
                    dispatch(selectRoomForBooking({ room, openDrawer: true }));
                  }}
                  className="px-6 py-3 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white font-semibold text-xs uppercase tracking-[0.18em] transition-colors"
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
