'use client';

import React from 'react';

interface PageHeroBannerProps {
  kicker: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  heightClass?: string;
  children?: React.ReactNode;
}

export function PageHeroBanner({
  kicker,
  title,
  subtitle,
  imageUrl,
  heightClass = 'min-h-[62vh]',
  children
}: PageHeroBannerProps) {
  return (
    <section className={`relative ${heightClass} flex flex-col justify-end overflow-hidden border-b border-luxury-border`}>
      {/* Full-bleed Architectural Photography */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-black">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center opacity-85 scale-[1.02] transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full pt-24 pb-14 sm:pb-16">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#D4AF6A]" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#E5C98B] font-medium">
              {kicker}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.06] text-white font-normal tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed font-light">
            {subtitle}
          </p>
        </div>

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
