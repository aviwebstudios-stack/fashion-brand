import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Adaeze Wrap Dress',
    description: 'A flowing wrap dress in premium ankara print, tailored for effortless elegance.',
    price: 65000,
    category: 'rtw',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    images: ['https://picsum.photos/seed/adaeze-dress/600/800'],
  },
  {
    name: 'Ife Silk Blouse',
    description: 'Hand-finished silk blouse with mother-of-pearl buttons and a relaxed silhouette.',
    price: 42000,
    category: 'rtw',
    sizes: ['S', 'M', 'L'],
    stock: 20,
    images: ['https://picsum.photos/seed/ife-blouse/600/800'],
  },
  {
    name: 'Zainab Tailored Trousers',
    description: 'High-waisted, wide-leg trousers cut from Italian wool blend.',
    price: 58000,
    category: 'rtw',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 12,
    images: ['https://picsum.photos/seed/zainab-trousers/600/800'],
  },
  {
    name: 'Amara Bridal Gown',
    description: 'A hand-beaded ballgown with a cathedral train, made to order for your big day.',
    price: 850000,
    category: 'bridals',
    sizes: ['S', 'M', 'L'],
    stock: 3,
    images: ['https://picsum.photos/seed/amara-gown/600/800'],
  },
  {
    name: 'Titilayo Lace Bridal Set',
    description: 'French lace bridal top and skirt set, fully lined with a detachable train.',
    price: 620000,
    category: 'bridals',
    sizes: ['S', 'M', 'L'],
    stock: 4,
    images: ['https://picsum.photos/seed/titilayo-bridal/600/800'],
  },
  {
    name: 'Chidinma Bespoke Aso-Oke Set',
    description: 'Custom-woven aso-oke fabric, tailored to your exact measurements.',
    price: 180000,
    category: 'bespoke',
    sizes: ['Custom'],
    stock: 8,
    images: ['https://picsum.photos/seed/chidinma-asooke/600/800'],
  },
  {
    name: 'Folake Bespoke Two-Piece',
    description: 'Made-to-measure structured blazer and skirt set in your choice of fabric.',
    price: 145000,
    category: 'bespoke',
    sizes: ['Custom'],
    stock: 6,
    images: ['https://picsum.photos/seed/folake-twopiece/600/800'],
  },
  {
    name: 'Ngozi Print Maxi Dress',
    description: 'Bold Ankara print maxi dress, now marked down for the season.',
    price: 38000,
    category: 'sales',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    images: ['https://picsum.photos/seed/ngozi-maxi/600/800'],
  },
  {
    name: 'Bisi Structured Jacket',
    description: 'Tailored crop jacket in tweed, previous season, final sale.',
    price: 29500,
    category: 'sales',
    sizes: ['S', 'M', 'L'],
    stock: 10,
    images: ['https://picsum.photos/seed/bisi-jacket/600/800'],
  },
];

async function main() {
  console.log('Seeding products...');
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });