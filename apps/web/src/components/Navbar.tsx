'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useAppDispatch,
  useAppSelector,
  toggleColorMode,
  setDrawerOpen,
  selectBookingNights
} from '@hotel/store';
import {
  Home,
  BedDouble,
  Utensils,
  Compass,
  LayoutDashboard,
  Sun,
  Moon,
  Calendar
} from 'lucide-react';

export const UNIFIED_NAV_ITEMS = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/suites', label: 'Chambres', icon: BedDouble },
  { href: '/experiences', label: 'Restauration', icon: Utensils },
  { href: '/conciergerie', label: 'Concierge', icon: Compass },
  { href: '/admin', label: 'Admin', icon: LayoutDashboard }
];

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { colorMode, customHotelName } = useAppSelector((state) => state.ui);
  const { selectedRoom, selectedAddOns } = useAppSelector((state) => state.booking);
  const nights = useAppSelector(selectBookingNights);

  // Smart Hide-on-Scroll-Down / Show-on-Scroll-Up
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 24);

      if (currentY < 60) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current + 10) {
        setIsVisible(false);
      } else if (currentY < lastScrollY.current - 6) {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="h-[72px]" />

      <header
        className={`fixed top-0 left-0 right-0 z-40 editorial-nav-glass border-b border-luxury-border transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled ? 'shadow-sm' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[72px] flex items-center justify-between gap-4">
          {/* 1. Brand Logo */}
          <Link href="/" className="shrink-0">
            <span className="block font-serif text-lg sm:text-xl tracking-[0.16em] text-luxury-text font-semibold leading-none">
              {customHotelName}
            </span>
            <span className="block text-[9px] tracking-[0.26em] uppercase text-luxury-gold mt-1">
              COTONOU • BÉNIN ★★★★★
            </span>
          </Link>

          {/* 2. Unified Navigation Pill Bar (Matches Mobile Bottom Nav 1:1) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-luxury-surface/90 border border-luxury-border">
            {UNIFIED_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname === ''
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-[0.12em] uppercase transition-all ${
                    isActive
                      ? 'bg-luxury-text text-luxury-bg font-semibold shadow-sm'
                      : 'text-luxury-muted hover:text-luxury-text'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-luxury-gold' : 'text-luxury-muted'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Actions: Light/Dark Switch + Direct Reserve Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => dispatch(toggleColorMode())}
              title={
                colorMode === 'light'
                  ? 'Passer en mode Sombre'
                  : 'Passer en mode Clair'
              }
              aria-label="Basculer le thème Clair / Sombre"
              className="w-9 h-9 rounded-full border border-luxury-border bg-luxury-surface text-luxury-text hover:border-luxury-gold flex items-center justify-center transition-colors"
            >
              {colorMode === 'light' ? (
                <Moon className="w-4 h-4 text-luxury-text" />
              ) : (
                <Sun className="w-4 h-4 text-luxury-gold" />
              )}
            </button>

            <button
              onClick={() => dispatch(setDrawerOpen(true))}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white transition-colors text-[11px] tracking-[0.14em] uppercase font-semibold flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Réserver</span>
              {(selectedRoom || selectedAddOns.length > 0) && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-luxury-gold text-white font-bold">
                  {nights}N
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
