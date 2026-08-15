import prisma from '../../config/db.js';

export const getAllContent = async () => {
  const rows = await prisma.siteContent.findMany();
  const map = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });
  return map;
};

export const updateContent = async (updates) => {
  const entries = Object.entries(updates);
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  return getAllContent();
};