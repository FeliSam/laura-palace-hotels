'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useAppDispatch,
  useAppSelector,
  setDrawerOpen,
  selectBookingNights
} from '@hotel/store';
import { Home, BedDouble, Sparkles, Compass, CalendarCheck } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const nights = useAppSelector(selectBookingNights);
  const { selectedRoom } = useAppSelector((state) => state.booking);

  const items = [
    { href: '/', label: 'Palace', icon: Home },
    { href: '/suites', label: 'Suites', icon: BedDouble },
    { href: '/experiences', label: 'Art de Vivre', icon: Sparkles },
    { href: '/conciergerie', label: 'Concierge', icon: Compass }
  ];

  return (
    <nav
      aria-label="Navigation mobile principale"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 editorial-nav-glass border-t border-luxury-border px-2 py-1.5 shadow-2xl"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 gap-1 transition-colors ${
                isActive ? 'text-luxury-gold font-semibold' : 'text-luxury-muted hover:text-luxury-text'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.7} />
              <span className="text-[10px] tracking-wider uppercase">{item.label}</span>
            </Link>
          );
        })}

        {/* Center/Right Highlighted Native Booking Action */}
        <button
          onClick={() => dispatch(setDrawerOpen(true))}
          className="flex flex-col items-center justify-center py-1.5 gap-1 bg-luxury-text text-luxury-bg rounded-lg mx-1 relative"
        >
          <CalendarCheck className="w-4 h-4 text-luxury-gold" />
          <span className="text-[9px] tracking-wider uppercase font-semibold">
            {selectedRoom ? `${nights} Nuits` : 'Réserver'}
          </span>
        </button>
      </div>
    </nav>
  );
}
