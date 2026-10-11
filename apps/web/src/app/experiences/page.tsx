'use client';

import React from 'react';
import { SiteShell } from '@/components/SiteShell';
import { PageHeroBanner } from '@/components/PageHeroBanner';
import { ExperiencesSection } from '@/components/ExperiencesSection';

export default function ExperiencesPage() {
  return (
    <SiteShell>
      <PageHeroBanner
        kicker="GASTRONOMIE BÉNINOISE, GRILLADES & BIEN-ÊTRE"
        title="Restauration & Saveurs d’Afrique"
        subtitle="Spécialités du terroir béninois, grillades de l’Atlantique et piscine lagon en tarifs FCFA."
        imageUrl="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85"
      />

      <ExperiencesSection />
    </SiteShell>
  );
}
