'use client';

import React from 'react';
import { SiteShell } from '@/components/SiteShell';
import { PageHeroBanner } from '@/components/PageHeroBanner';
import { ExperiencesSection } from '@/components/ExperiencesSection';

export default function ExperiencesPage() {
  return (
    <SiteShell>
      <PageHeroBanner
        kicker="GASTRONOMIE BÉNINOISE, GRILLADES DE L’ATLANTIQUE & BIEN-ÊTRE"
        title="Restauration, Saveurs d’Afrique & Piscine Lagon"
        subtitle="Découvrez les grands classiques du terroir béninois (Amiwo Royal, Igname pilée de Savalou, Atassi gourmet, Langouste de Ouidah) ainsi que notre espace piscine et spa au beurre de karité."
        imageUrl="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85"
      />

      <ExperiencesSection />
    </SiteShell>
  );
}
