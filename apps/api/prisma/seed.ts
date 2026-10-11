import { PrismaClient } from '@prisma/client';
import { INITIAL_SUITES, INITIAL_ADDONS } from '../src/data/initialCatalog';

const prisma = new PrismaClient();

async function main() {
  console.log('✨ Seeding L’AURA PALACE PostgreSQL database...');

  for (const room of INITIAL_SUITES) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: {
        name: room.name,
        subtitle: room.subtitle,
        category: room.category,
        description: room.description,
        pricePerNight: room.pricePerNight,
        sizeSqm: room.sizeSqm,
        maxGuests: room.maxGuests,
        bedConfiguration: room.bedConfiguration,
        floorLevel: room.floorLevel,
        viewType: room.viewType,
        viewLabel: room.viewLabel,
        heroImage: room.heroImage,
        gallery: room.gallery,
        amenities: room.amenities as any,
        highlights: room.highlights,
        isFeatured: room.isFeatured
      },
      create: {
        id: room.id,
        slug: room.slug,
        name: room.name,
        subtitle: room.subtitle,
        category: room.category,
        description: room.description,
        pricePerNight: room.pricePerNight,
        sizeSqm: room.sizeSqm,
        maxGuests: room.maxGuests,
        bedConfiguration: room.bedConfiguration,
        floorLevel: room.floorLevel,
        viewType: room.viewType,
        viewLabel: room.viewLabel,
        heroImage: room.heroImage,
        gallery: room.gallery,
        amenities: room.amenities as any,
        highlights: room.highlights,
        isFeatured: room.isFeatured
      }
    });
  }

  for (const addon of INITIAL_ADDONS) {
    await prisma.experienceAddOn.upsert({
      where: { code: addon.code },
      update: {
        title: addon.title,
        category: addon.category,
        description: addon.description,
        price: addon.price,
        pricingType: addon.pricingType,
        image: addon.image,
        badge: addon.badge
      },
      create: {
        id: addon.id,
        code: addon.code,
        title: addon.title,
        category: addon.category,
        description: addon.description,
        price: addon.price,
        pricingType: addon.pricingType,
        image: addon.image,
        badge: addon.badge
      }
    });
  }

  console.log('✅ Base de données PostgreSQL initialisée avec succès.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed Prisma:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
