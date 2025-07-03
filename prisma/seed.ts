import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const region = await prisma.region.create({
    data: {
      capital_city_id: 0,
      code: 'EG-01',
      population: 10000000,
      translations: {
        create: [
          { language: 'en', name: 'Greater Cairo' },
          { language: 'ar', name: 'القاهرة الكبرى' },
        ],
      },
    },
  });

  const cairo = await prisma.city.create({
    data: {
      region_id: region.region_id,
      translations: {
        create: [
          { language: 'en', name: 'Cairo' },
          { language: 'ar', name: 'القاهرة' },
        ],
      },
    },
  });

  const alex = await prisma.city.create({
    data: {
      region_id: region.region_id,
      translations: {
        create: [
          { language: 'en', name: 'Alexandria' },
          { language: 'ar', name: 'الإسكندرية' },
        ],
      },
    },
  });

  await prisma.region.update({
    where: { region_id: region.region_id },
    data: {
      capital_city_id: cairo.city_id,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
