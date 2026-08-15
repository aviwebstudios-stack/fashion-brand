import https from 'https';
import crypto from 'crypto';
import prisma from '../../config/db.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME;

const telegramApiRequest = (method, params) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(params || {});
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

const getSettings = async () => {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  return settings;
};

// Step 1: generate a connect link with a unique token
export const generateConnectLink = async () => {
  if (!BOT_TOKEN || !BOT_USERNAME) {
    throw { statusCode: 500, message: 'Telegram bot is not configured on the server' };
  }

  const token = crypto.randomBytes(12).toString('hex');
  const settings = await getSettings();

  await prisma.settings.update({
    where: { id: settings.id },
    data: { telegramConnectToken: token },
  });

  return { url: `https://t.me/${BOT_USERNAME}?start=${token}` };
};

// Step 2: check if the admin has sent /start <token> to the bot yet
export const checkConnection = async () => {
  const settings = await getSettings();

  if (settings.telegramChatId) {
    return { connected: true, chatId: settings.telegramChatId };
  }

  if (!settings.telegramConnectToken) {
    return { connected: false };
  }

  const response = await telegramApiRequest('getUpdates', { limit: 20 });
  if (!response.ok) {
    return { connected: false };
  }

  const match = response.result.find(
    (update) => update.message?.text === `/start ${settings.telegramConnectToken}`
  );

  if (!match) {
    return { connected: false };
  }

  const chatId = String(match.message.chat.id);

  await prisma.settings.update({
    where: { id: settings.id },
    data: { telegramChatId: chatId, telegramConnectToken: null },
  });

  await telegramApiRequest('sendMessage', {
    chat_id: chatId,
    text: '✅ Favy Atelier is now connected. You will receive notifications here.',
  });

  return { connected: true, chatId };
};

export const disconnect = async () => {
  const settings = await getSettings();
  await prisma.settings.update({
    where: { id: settings.id },
    data: { telegramChatId: null, telegramConnectToken: null },
  });
  return { message: 'Telegram disconnected' };
};

export const getStatus = async () => {
  const settings = await getSettings();
  return { connected: !!settings.telegramChatId };
};

// Used internally by other modules to notify the admin
export const notifyAdmin = async (text) => {
  try {
    const settings = await getSettings();
    if (!settings.telegramChatId || !BOT_TOKEN) return;

    await telegramApiRequest('sendMessage', {
      chat_id: settings.telegramChatId,
      text,
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error('Telegram notify failed:', err.message);
  }
};