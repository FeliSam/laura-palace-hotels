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
  heightClass = 'min-h-[58vh]',
  children
}: PageHeroBannerProps) {
  return (
    <section
      className={`relative ${heightClass} flex flex-col justify-end overflow-hidden border-b border-luxury-border bg-[#0E0E11]`}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(10, 10, 12, 0.90) 0%, rgba(10, 10, 12, 0.48) 55%, rgba(10, 10, 12, 0.55) 100%), url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Full-bleed Architectural Photography (no -z-10 so parent bg never hides it) */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-45 pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full pt-16 pb-14 sm:pb-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-black/55 backdrop-blur-md border border-white/20">
            <span className="w-6 h-[1px] bg-[#D4AF6A]" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#E5C98B] font-medium">
              {kicker}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.06] text-white font-normal tracking-tight drop-shadow-sm">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed font-light">
            {subtitle}
          </p>
        </div>

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
