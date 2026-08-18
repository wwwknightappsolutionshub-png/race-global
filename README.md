# Race General Trading LLC

Public website and CMS for Race General Trading LLC — a Dubai-based agricultural commodity trader connecting African origins with buyers in the Middle East, Asia, and Europe.

This project is standalone. It is not part of KhayaOS.

## Stack

- Next.js 16 (App Router) for the public site
- Payload CMS 3 for all content, images, and enquiries
- SQLite for local/easy hosting (switch the adapter to Postgres for larger production if needed)

## Run locally

```bash
cd "C:\Users\Knight Hub\Desktop\Products\RaceGeneralTrading"
npm install
npm run dev
```

- Site: http://localhost:3000
- CMS: http://localhost:3000/admin

First launch seeds the eight commodities, page copy, process gates, and stock photos. Admin login:

- Email: `admin@racegentrade.com`
- Password: `RaceAdmin2026!`

Change this in `.env` (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`) before going live.

## What the CMS manages

From `/admin` you can edit:

- **Site settings** — name, tagline, phone, email, address, logo, SEO
- **Page copy** — every public page’s text and hero photos
- **Commodities** — add/remove cargos, photos, specs, order
- **Values, process gates, trade corridor** — reorder or rewrite
- **Images** — replace any photo; the live site updates
- **Enquiries** — inbound cargo requests from the contact form

## Pages

`/` · `/about` · `/what-we-do` · `/commodities` · `/commodities/[slug]` · `/process` · `/contact` · `/privacy`
