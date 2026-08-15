import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin';

async function main() {
  if (!email || !password) {
    console.error('Usage: node prisma/seedAdmin.js <email> <password> [name]');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`A user with email ${email} already exists.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log(`Admin account created successfully: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });