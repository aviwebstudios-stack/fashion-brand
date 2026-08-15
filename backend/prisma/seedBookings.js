import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const weekdayAvailability = (startTime, endTime) =>
  [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    dayOfWeek,
    startTime,
    endTime,
    isAvailable: true,
  }));

const services = [
  {
    name: 'Favy Woman Consultation',
    description:
      'A personalized styling session to explore ready-to-wear and bespoke pieces tailored to your shape, taste, and upcoming occasions.',
    price: 50000,
    duration: 60,
    isAvailable: true,
    availability: { create: weekdayAvailability('09:00', '17:00') },
  },
  {
    name: 'Bridal Consultation',
    description:
      'A one-on-one session to design your dream bridal look, from fabric selection to fitting timeline. Bespoke bridal pieces start at ₦850,000.',
    price: 75000,
    duration: 90,
    isAvailable: true,
    availability: { create: weekdayAvailability('10:00', '16:00') },
  },
];

async function main() {
  console.log('Seeding consultation services...');
  for (const service of services) {
    await prisma.consultationService.create({ data: service });
  }
  console.log(`Seeded ${services.length} consultation services successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });