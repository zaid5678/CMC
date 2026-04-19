# Contentful Content Model Schema

This document defines all content types used by the CMC website. Create these in your Contentful space under **Content Model** before adding any content.

---

## 1. `announcement`

News and notices displayed on the home page and announcements section.

| Field ID | Display Name | Type | Required | Notes |
|----------|-------------|------|----------|-------|
| `title` | Title | Short text | Yes | Main headline |
| `date` | Date | Date & Time | Yes | Used for ordering (newest first) |
| `excerpt` | Excerpt | Short text | Yes | One-sentence summary shown in cards |
| `body` | Body | Long text | Yes | Full announcement text |

---

## 2. `event`

Events displayed on the Events page and home page preview.

| Field ID | Display Name | Type | Required | Notes |
|----------|-------------|------|----------|-------|
| `title` | Title | Short text | Yes | |
| `date` | Date | Date & Time | Yes | Used for ordering (soonest first) |
| `time` | Time | Short text | No | e.g. "7:00 PM" or "After Maghrib" |
| `category` | Category | Short text | No | One of: Education, Community, Ramadan, Youth, Sisters |
| `description` | Description | Long text | Yes | |
| `image` | Image | Media (image) | No | Optional event photo |
| `imageAlt` | Image Alt Text | Short text | No | Alt text for accessibility |

---

## 3. `service`

Services listed on the Services page (e.g. Daily Prayers, Quran Education).

| Field ID | Display Name | Type | Required | Notes |
|----------|-------------|------|----------|-------|
| `id` | ID | Short text | Yes | URL-safe slug, e.g. `quran-education` |
| `title` | Title | Short text | Yes | |
| `icon` | Icon | Short text | No | Lucide icon name, e.g. `BookOpen` |
| `shortDescription` | Short Description | Short text | Yes | One-line summary |
| `fullDescription` | Full Description | Long text | Yes | Paragraph shown on services page |
| `order` | Display Order | Integer | Yes | Lower number = displayed first |

**Note:** Services with IDs `quran-education`, `arabic-language`, `nikah`, or `janazah` automatically show an "Enquire" button linking to the contact page.

---

## 4. `teamMember`

Staff and volunteers shown on the About page.

| Field ID | Display Name | Type | Required | Notes |
|----------|-------------|------|----------|-------|
| `name` | Full Name | Short text | Yes | |
| `role` | Role / Title | Short text | Yes | e.g. "Resident Imam & Religious Director" |
| `bio` | Biography | Long text | Yes | 2–4 sentence bio |
| `initials` | Initials | Short text | Yes | 2-letter initials shown in avatar, e.g. "IA" |

---

## 5. `openingHours`

Mosque opening hours. Create a **single entry** of this type.

| Field ID | Display Name | Type | Required | Notes |
|----------|-------------|------|----------|-------|
| `mondayHours` | Monday Hours | Short text | Yes | e.g. "5:00 AM – 10:00 PM" |
| `tuesdayHours` | Tuesday Hours | Short text | Yes | |
| `wednesdayHours` | Wednesday Hours | Short text | Yes | |
| `thursdayHours` | Thursday Hours | Short text | Yes | |
| `fridayHours` | Friday Hours | Short text | Yes | |
| `saturdayHours` | Saturday Hours | Short text | Yes | |
| `sundayHours` | Sunday Hours | Short text | Yes | |
| `jumuahKhutbahTime` | Jumu'ah Khutbah Time | Short text | Yes | e.g. "1:00 PM" |
| `jumuahPrayerTime` | Jumu'ah Prayer Time | Short text | Yes | e.g. "1:30 PM" |
| `jumuahNote` | Jumu'ah Note | Short text | No | e.g. "Two khutbahs during school holidays" |

---

## 6. `siteSettings`

Global site settings — address, phone, email, maps link. Create a **single entry** of this type.

| Field ID | Display Name | Type | Required | Notes |
|----------|-------------|------|----------|-------|
| `addressLine1` | Address Line 1 | Short text | Yes | e.g. "14 Blantyre Street" |
| `addressLine2` | Address Line 2 | Short text | Yes | e.g. "Worlds End Estate" |
| `addressLine3` | Address Line 3 | Short text | Yes | e.g. "London SW10 0DS" |
| `phone` | Phone Number | Short text | Yes | e.g. "+44 (0)20 7123 4567" |
| `email` | Email Address | Short text | Yes | e.g. "info@chelseamuslimcommunity.org.uk" |
| `googleMapsUrl` | Google Maps URL | Short text | Yes | Full Google Maps link for "Get Directions" button |

---

## 7. `aboutContent`

Editorial content for the About page. Create a **single entry** of this type.

| Field ID | Display Name | Type | Required | Notes |
|----------|-------------|------|----------|-------|
| `historyParagraph1` | History — Paragraph 1 | Long text | Yes | First paragraph of "Our History" section |
| `historyParagraph2` | History — Paragraph 2 | Long text | Yes | |
| `historyParagraph3` | History — Paragraph 3 | Long text | Yes | |
| `missionStatement` | Mission Statement | Long text | Yes | Shown under "Our Mission" heading |
| `principle1Title` | Principle 1 Title | Short text | Yes | e.g. "Faith" |
| `principle1Description` | Principle 1 Description | Long text | Yes | |
| `principle2Title` | Principle 2 Title | Short text | Yes | e.g. "Community" |
| `principle2Description` | Principle 2 Description | Long text | Yes | |
| `principle3Title` | Principle 3 Title | Short text | Yes | e.g. "Service" |
| `principle3Description` | Principle 3 Description | Long text | Yes | |
| `values` | Our Values | Short text | Yes | Comma-separated list, e.g. "Faith & Devotion,Community & Belonging,Service & Generosity" |

---

## What is NOT in Contentful

The following content is hardcoded in the site and does not need to go in Contentful (it rarely changes and is structural rather than editorial):

- Navigation menu items and footer links
- Getting here directions (tube stations, bus routes)
- Safeguarding box text on the Contact page
- Hero section copy on the home page (brand tagline)
- Quranic verse on the About page
- Prayer times (fetched live from the Mawaqit API — not CMS content)
