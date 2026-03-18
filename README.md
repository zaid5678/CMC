# Chelsea Muslim Community — Website

Production-ready website for Chelsea Muslim Community (CMC), a mosque and Islamic community centre at 14 Blantyre Street, Worlds End Estate, London SW10 0DS.

Built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and react-leaflet. Deployable to Netlify.

---

## Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd cmc-website

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy and fill in environment variables
cp .env.local.example .env.local
# Edit .env.local with your SMTP credentials and contact email

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Netlify Deployment

1. Push the repository to GitHub (or GitLab / Bitbucket)
2. Log in to [Netlify](https://netlify.com) and click **Add new site → Import an existing project**
3. Connect your repository
4. Build settings are pre-configured in `netlify.toml` — no changes needed
5. Go to **Site settings → Environment variables** and add:

| Variable | Description |
|---|---|
| `SMTP_HOST` | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g. `587`) |
| `SMTP_USER` | Your sending email address |
| `SMTP_PASS` | App password (not your main password) |
| `CONTACT_EMAIL` | Where contact form emails are delivered |
| `NEXT_PUBLIC_SITE_URL` | Your live domain (e.g. `https://chelseamuslimcommunity.org.uk`) |

6. Click **Deploy site**

---

## Updating Content

All content lives in JSON files in `/data/` — no database, no CMS required. Edit with any text editor.

| File | Contents |
|---|---|
| `data/events.json` | Upcoming events (title, date, time, category, description) |
| `data/announcements.json` | Mosque announcements shown on the home page |
| `data/team.json` | Team member profiles (name, role, bio, initials) |
| `data/services.json` | Service descriptions for the Services page |
| `data/opening-hours.json` | Weekly opening hours and Jumu'ah times |

After editing, redeploy (or push to your repo if you have auto-deploy enabled).

---

## Adding Real Photographs

Search for `IMAGE_PLACEHOLDER` comments in the codebase to find every location where a placeholder gradient currently exists. Replace the `<div>` placeholder with a Next.js `<Image>` component:

```tsx
// Before (placeholder):
<div style={{ height: '450px', background: 'linear-gradient(...)' }} aria-label="..." role="img">

// After (real photo):
<Image
  src="/images/mosque-exterior.jpg"
  alt="Exterior of Chelsea Muslim Community mosque on Blantyre Street"
  fill
  className="object-cover"
/>
```

Place image files in `/public/images/`. Recommended sizes: 1200×800px minimum for section images, 800×600px for cards.

---

## Online Payment Integration (Donate Page)

The donate page has a placeholder "Donate Online" button. To wire up real payments:

1. Create an account with a UK-compatible provider (Stripe, LaunchGood, JustGiving, or Charity Checkout)
2. In `app/donate/page.tsx`, find the disabled button block and replace with a link to your payment page
3. Update the surrounding text to describe the platform

---

## PDF Timetable Download

The Prayer Times page has a "Download PDF" button (currently disabled). To enable it:

1. Upload your monthly timetable PDF to `/public/timetables/timetable-YYYY-MM.pdf`
2. In `app/prayer-times/page.tsx`, replace the disabled button with:

```tsx
<a
  href="/timetables/timetable-2025-04.pdf"
  download
  className="text-sm font-medium px-4 py-2 rounded btn-gold"
>
  Download PDF
</a>
```

---

## Prayer Times

Times are fetched live from the [Aladhan API](https://aladhan.com) using the Muslim World League calculation method (Method 3) with CMC's exact coordinates from Mawaqit. The API response is cached in-memory for 24 hours.

Jumu'ah (Friday prayer) Iqama: **12:20pm** — confirmed from CMC's [Mawaqit listing](https://mawaqit.net/en/m/chelsea-muslim-community-hub-london-sw100ds-united-kingdom).

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `SMTP_HOST` | Yes (contact form) | SMTP server hostname |
| `SMTP_PORT` | Yes | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | Yes | Sending email address |
| `SMTP_PASS` | Yes | App password or SMTP password |
| `CONTACT_EMAIL` | Yes | Email to receive contact form submissions |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Full URL of the live site (for Open Graph metadata) |

For Gmail: use an [App Password](https://support.google.com/accounts/answer/185833), not your main account password.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + CSS custom properties
- **Animations:** Framer Motion
- **Maps:** react-leaflet with CartoDB Voyager tiles (no API key required)
- **Prayer Times:** Aladhan public API — Muslim World League method, CMC coordinates
- **Email:** Nodemailer via Next.js API route
- **Deployment:** Netlify + @netlify/plugin-nextjs

## Project Structure

```
app/
  api/contact/          Contact form POST endpoint
  api/prayer-times/     Daily times GET + monthly calendar GET
  about/                About Us page
  prayer-times/         Prayer Times page (with monthly timetable + Qibla)
  services/             Services page
  events/               Events page with category filtering
  donate/               Donate page
  contact/              Contact page with map and safeguarding section
  layout.tsx            Root layout (Navbar, Footer, metadata)
  globals.css           CSS variables, fonts, global utilities
components/             All reusable UI components
data/                   JSON content files
lib/                    Utility functions (qibla, prayer times, rate limit)
public/                 Static assets
netlify.toml            Netlify build config
```
