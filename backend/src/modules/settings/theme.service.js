import prisma from '../../config/db.js';

export const DEFAULT_THEME = {
  colors: {
    primary: '#3d4636',
    accent: '#c9a227',
    background: '#faf8f3',
    text: '#2b2b26',
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
  },
};

const getSettings = async () => {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  return settings;
};

export const getTheme = async () => {
  const settings = await getSettings();
  return settings.theme || DEFAULT_THEME;
};

export const updateTheme = async (themeData) => {
  const settings = await getSettings();
  const current = settings.theme || DEFAULT_THEME;

  const merged = {
    colors: { ...current.colors, ...themeData.colors },
    fonts: { ...current.fonts, ...themeData.fonts },
  };

  await prisma.settings.update({
    where: { id: settings.id },
    data: { theme: merged },
  });

  return merged;
};