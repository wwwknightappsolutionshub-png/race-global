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

- **Site settings** — name, tagline, phone, email, address, logo, SEO defaults, site URL, default OG image
- **Page copy** — every public page’s text and hero photos, plus a dedicated **SEO** tab (title, description, OG image, noindex per page)
- **Commodities** — add/remove cargos, photos, specs, order, and per-item SEO
- **Values, process gates, trade corridor** — reorder or rewrite
- **Images** — replace any photo; the live site updates
- **Enquiries** — inbound cargo requests from the contact form

## Enquiries & anti-spam

The contact form:

1. Stores the enquiry in **Enquiries** (`/admin`)
2. Emails a copy to `ENQUIRY_NOTIFY_TO` (default: Hostinger inbox) via SMTP

Public `POST /api/enquiries` is disabled. Submissions only go through the server action.

Hardening includes: honeypot, minimum fill time, email MX + mailbox probe, disposable-domain block, required E.164 phone validation, 24-hour duplicate block on email/phone, per-IP rate limit, and optional Cloudflare Turnstile / Twilio Lookup.

Set SMTP vars in `.env` (see `.env.example`). Without SMTP, enquiries still save in admin but will not appear in webmail.

## SEO

The live site emits:

- CMS-driven title, description, canonical, Open Graph, and Twitter cards per page
- Organization JSON-LD
- `/sitemap.xml` and `/robots.txt`

Edit SEO in **Site settings → SEO** (defaults) and **Page copy → SEO** (per page).

## Pages

`/` · `/about` · `/what-we-do` · `/commodities` · `/commodities/[slug]` · `/process` · `/contact` · `/privacy`
