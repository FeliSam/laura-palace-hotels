import React from 'react';
import { STATIC_SUITES } from '@hotel/config';
import { SiteShell } from '@/components/SiteShell';
import { SuiteDetailClient } from '@/components/SuiteDetailClient';

export function generateStaticParams() {
  return STATIC_SUITES.map((room) => ({
    slug: room.slug
  }));
}

export default async function SuiteDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <SiteShell>
      <SuiteDetailClient slug={slug} />
    </SiteShell>
  );
}
