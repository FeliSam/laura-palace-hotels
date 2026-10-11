'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UNIFIED_NAV_ITEMS } from './Navbar';

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation mobile principale"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 pt-1 pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto editorial-nav-glass border border-luxury-border rounded-full p-1 shadow-2xl grid grid-cols-5 items-center gap-1">
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
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all ${
                isActive
                  ? 'bg-luxury-text text-luxury-bg font-semibold shadow-sm'
                  : 'text-luxury-muted hover:text-luxury-text'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-luxury-gold' : 'text-luxury-muted'
                }`}
                strokeWidth={isActive ? 2.2 : 1.7}
              />
              <span className="text-[9px] tracking-wider uppercase mt-0.5 truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
