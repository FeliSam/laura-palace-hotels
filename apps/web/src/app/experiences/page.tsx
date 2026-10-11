'use client';

import React from 'react';
import { SiteShell } from '@/components/SiteShell';
import { PageHeroBanner } from '@/components/PageHeroBanner';
import { ExperiencesSection } from '@/components/ExperiencesSection';

export default function ExperiencesPage() {
  return (
    <SiteShell>
      <PageHeroBanner
        kicker="GASTRONOMIE 3★ MICHELIN • THERMES & RITUELS HOLISTIQUES"
        title="Haute Gastronomie & Sanctuaire du Bien-Être"
        subtitle="De la Table du Chef Édouard Valmont aux 1 800 m² de thermes minéraux taillés dans le marbre de Carrare, composez un séjour sensoriel hors du temps."
        imageUrl="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85"
      />

      <ExperiencesSection />
    </SiteShell>
  );
}
