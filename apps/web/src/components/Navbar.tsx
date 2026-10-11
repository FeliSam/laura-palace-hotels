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
import { Sun, Moon, Calendar } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/suites', label: 'Chambres & Suites' },
  { href: '/experiences', label: 'Restaurant & Piscine' },
  { href: '/conciergerie', label: 'Services & Dossier' }
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
      {/* Fixed height spacer */}
      <div className="h-[72px]" />

      <header
        className={`fixed top-0 left-0 right-0 z-40 editorial-nav-glass border-b border-luxury-border transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled ? 'shadow-sm' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-[72px] flex items-center justify-between gap-6">
          {/* 1. Brand Logo (Clean & Minimal) */}
          <Link href="/" className="shrink-0">
            <span className="block font-serif text-lg sm:text-xl tracking-[0.16em] text-luxury-text font-semibold leading-none">
              {customHotelName}
            </span>
            <span className="block text-[9px] tracking-[0.26em] uppercase text-luxury-gold mt-1">
              COTONOU • BÉNIN ★★★★★
            </span>
          </Link>

          {/* 2. Centered Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname === ''
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-xs tracking-[0.14em] uppercase transition-colors ${
                    isActive
                      ? 'text-luxury-text font-semibold'
                      : 'text-luxury-muted hover:text-luxury-text'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-luxury-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Minimal Actions: Light/Dark Switch + Direct Reserve Button */}
          <div className="flex items-center gap-3">
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
              className="px-4 sm:px-5 py-2.5 bg-luxury-text text-luxury-bg hover:bg-luxury-gold hover:text-white transition-colors text-xs tracking-[0.14em] uppercase font-semibold flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Réserver</span>
              {(selectedRoom || selectedAddOns.length > 0) && (
                <span className="px-1.5 py-0.2 text-[10px] bg-luxury-gold text-white font-bold">
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
