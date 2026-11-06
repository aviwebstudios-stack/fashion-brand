# Favy Atelier

The online store and booking site for Favy Atelier, a fashion house in Nigeria that makes ready-to-wear, bridal gowns and bespoke pieces.

Live site: https://fashion-brand-liard.vercel.app

## What it does

### Public site

- Shop by collection (Ready-to-Wear, Bridals, Bespoke, Sales) with quick view, size guide and a shopping bag.
- Checkout and payment through Paystack, with order tracking in the customer's account.
- Book a paid consultation: pick a service, a date and an open time slot, then pay online.
- Fashion Academy page with programs, fees and an enquiry form.
- Customer accounts with email verification, password reset, saved measurements, orders and bookings.
- Newsletter sign-up, contact form, cookie preferences and info pages (shipping, care, sizing, FAQs).

### Admin dashboard (`/admin`)

- Products: add, edit and remove items, with image upload.
- Orders and bookings: view them and update their status. Customers see each change on their tracking page.
- Users, contact messages, academy enquiries and newsletter subscribers.
- Site content: edit the text on the Home, Consultations and Academy pages and in the footer.
- Images & Video: replace every photo and video slot on the site, and download the current file for any slot.
- Theme: brand colours and fonts.
- Settings: Telegram alerts for new payments and enquiries.

## Tech stack

**Frontend** (`frontend/`)
- React 19, TypeScript and Vite
- Tailwind CSS 4
- React Router, Zustand, TanStack Query, Axios
- Radix UI primitives and Lucide icons

**Backend** (`backend/`)
- Node.js and Express
- PostgreSQL with Prisma
- Cloudinary for uploaded images and video
- Paystack for payments
- Nodemailer for email, Telegram bot for admin alerts
- JWT auth with bcrypt, Zod validation, Helmet, CORS and rate limiting

## Project structure

```
fashion-brand/
├── backend/
│   ├── prisma/            Database schema, migrations and seed scripts
│   ├── server.js          Entry point
│   └── src/
│       ├── config/        Database, Cloudinary and email setup
│       ├── middleware/    Auth, admin check, uploads, validation, errors
│       ├── modules/       One folder per feature (products, orders, bookings,
│       │                  payments, settings, inquiries, ...), each with
│       │                  routes, controller and service
│       └── utils/
└── frontend/
    ├── public/
    │   └── media-originals/   Local copies of every admin media slot, shown
    │                          until the live content loads
    └── src/
        ├── app/           Routes
        ├── components/    Layout, shop, cart, admin and shared components
        ├── lib/           API clients and hooks
        ├── pages/         One file per page, grouped by area
        ├── store/         Zustand stores
        └── styles/
```

## Run it locally

You need Node.js 20 or newer and a PostgreSQL database.

1. Install and start the backend:

   ```bash
   cd backend
   npm install
   cp .env.example .env        # then fill in the values
   npx prisma migrate deploy
   npx prisma generate
   npm run dev                 # http://localhost:5000
   ```

   To create the first admin account, run `node prisma/seedAdmin.js <email> <password>`.

2. In a second terminal, start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev                 # http://localhost:5173
   ```

3. Build the frontend for production with `npm run build` in `frontend/`.

## Environment variables

### Backend (`backend/.env`)

| Name | Used for |
| --- | --- |
| `PORT` | Port the API listens on |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Signing login tokens |
| `JWT_EXPIRES_IN` | How long a login lasts |
| `EMAIL_HOST` | SMTP server |
| `EMAIL_PORT` | SMTP port |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account |
| `CLOUDINARY_API_KEY` | Cloudinary account |
| `CLOUDINARY_API_SECRET` | Cloudinary account |
| `PAYSTACK_SECRET_KEY` | Paystack payments |
| `PAYSTACK_PUBLIC_KEY` | Paystack payments |
| `TELEGRAM_BOT_TOKEN` | Admin alerts bot |
| `TELEGRAM_BOT_USERNAME` | Admin alerts bot |
| `CLIENT_URL` | Frontend address, used for CORS and the payment return link |

### Frontend (`frontend/.env.development`, `frontend/.env.production`)

| Name | Used for |
| --- | --- |
| `VITE_API_URL` | Backend API address, ending in `/api` |
