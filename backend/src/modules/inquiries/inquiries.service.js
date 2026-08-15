import prisma from '../../config/db.js';
import { notifyAdmin } from '../settings/telegram.service.js';

export const submitContactMessage = async ({ name, email, message }) => {
  await prisma.contactMessage.create({ data: { name, email, message } });

  await notifyAdmin(
    `📩 <b>New Contact Message</b>\n\nFrom: ${name} (${email})\n\n${message}`
  );
  return { message: 'Message sent successfully' };
};

export const submitAcademyInterest = async ({ name, email, phone, program }) => {
  await prisma.academyInquiry.create({ data: { name, email, phone, program } });

  await notifyAdmin(
    `🎓 <b>New Academy Interest</b>\n\nProgram: ${program}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}`
  );
  return { message: 'Interest submitted successfully' };
};

export const submitNewsletterSignup = async ({ email, firstName, lastName, interests }) => {
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {
      subscribed: true,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      interests: interests || undefined,
    },
    create: {
      email,
      firstName,
      lastName,
      interests: interests || [],
    },
  });

  const nameLine = firstName ? `${firstName} ${lastName || ''}`.trim() : 'N/A';
  const interestsLine = interests?.length ? interests.join(', ') : 'N/A';

  await notifyAdmin(
    `📧 <b>New Newsletter Signup</b>\n\nName: ${nameLine}\nEmail: ${email}\nInterests: ${interestsLine}`
  );
  return { message: 'Subscribed successfully' };
};

export const unsubscribeNewsletter = async ({ email }) => {
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (!subscriber) {
    return { message: 'If that email was subscribed, it has now been removed.' };
  }

  await prisma.newsletterSubscriber.update({
    where: { email },
    data: { subscribed: false },
  });

  return { message: 'You have been unsubscribed successfully.' };
};
