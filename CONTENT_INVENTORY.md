# Content Inventory

An audit of all editable content on the CMC website, showing what is managed in Contentful vs. what is hardcoded.

---

## Managed in Contentful

| Content | Contentful Type | Pages Where Used |
|---------|----------------|-----------------|
| Events (title, date, time, category, description, image) | `event` | Home page preview, Events page |
| Announcements (title, date, excerpt, body) | `announcement` | Home page |
| Services (title, description, icon, order) | `service` | Services page |
| Team members (name, role, bio, initials) | `teamMember` | About page |
| Opening hours (Mon–Sun, Jumu'ah times) | `openingHours` | Home page Find Us section |
| Contact info (address, phone, email, maps URL) | `siteSettings` | Home page, Contact page |
| About page text (history, mission, principles, values) | `aboutContent` | About page |

---

## Hardcoded — Intentionally Not in Contentful

These items are hardcoded because they are structural UI elements or rarely-changing legal/brand copy. A developer would need to edit the source files to change them.

### Navigation & Footer
- Navbar links and logo — [`components/Navbar.tsx`](components/Navbar.tsx)
- Footer links, social icons, copyright — [`components/Footer.tsx`](components/Footer.tsx)

### Home Page (`app/page.tsx`)
- Hero tagline: *"Est. in the Heart of London SW10"*
- Hero heading: *"Chelsea Muslim Community"*
- Hero subtitle paragraph
- About snapshot quote and heading (*"Rooted in Chelsea, Open to the World"*)
- About snapshot body paragraphs
- Services grid (4 icon cards — visual summary of the full services page)

### About Page (`app/about/page.tsx`)
- Quranic verse (Arabic, transliteration, translation, citation)
- Mosque exterior image and caption

### Contact Page (`components/ContactClient.tsx`)
- Getting Here section (tube stations, walking times, bus routes)
- Safeguarding box (legal text, NSPCC number)

### Prayer Times
- All prayer times are fetched **live** from the [Mawaqit API](https://mawaqit.net) — not stored anywhere in the codebase or Contentful. The mosque's Mawaqit feed URL is hardcoded in `lib/mawaqit.ts`.

---

## Pages Not Fetching from Contentful

| Page | Reason |
|------|--------|
| `/prayer-times` | Fetches live from Mawaqit API |
| `/donate` | Static page — donation info rarely changes |

---

## Adding New Content Types

To make additional content editable (e.g. a "Getting Here" section, trustee list, PDF documents):

1. Create a new content type in Contentful with the required fields
2. Add a TypeScript type and getter function in [`lib/contentful.ts`](lib/contentful.ts) following the existing pattern
3. Update the relevant page to call the new getter and render the data

Contentful also supports **Asset** fields for PDFs and documents — useful for prayer timetable PDFs, annual reports, etc. Upload the file as a Media asset in Contentful, then store the asset URL in a content entry.
