# Contentful Setup Guide

Step-by-step instructions for setting up the CMC website with Contentful CMS.

---

## Step 1: Create a Contentful Account and Space

1. Go to [contentful.com](https://contentful.com) and create a free account.
2. Click **"Add space"** → choose **"Create an empty space"**.
3. Name it **"CMC Website"** and click **"Proceed to confirmation"**.

---

## Step 2: Create the Content Types

Go to **Content Model** in the top navigation. For each content type below, click **"Add content type"**, set the **API identifier** exactly as shown, then add each field.

> **Important:** The API identifier (not the display name) must match exactly what's listed. The display name can be anything you like.

Create all 7 content types from [CONTENTFUL_SCHEMA.md](./CONTENTFUL_SCHEMA.md):

| API Identifier | Display Name | Type |
|---------------|-------------|------|
| `announcement` | Announcement | Regular |
| `event` | Event | Regular |
| `service` | Service | Regular |
| `teamMember` | Team Member | Regular |
| `openingHours` | Opening Hours | Regular (create 1 entry only) |
| `siteSettings` | Site Settings | Regular (create 1 entry only) |
| `aboutContent` | About Page Content | Regular (create 1 entry only) |

For each field, click **"Add field"**, choose the correct type, and enter the **Field ID** exactly as shown in the schema.

---

## Step 3: Get Your API Keys

1. In Contentful, go to **Settings → API keys**.
2. Click **"Add API key"**, give it a name like "CMC Website", and save.
3. Note down:
   - **Space ID** (looks like `abc123xyz`)
   - **Content Delivery API – access token** (a long string starting with no prefix)

> **Never share these keys publicly.** Don't commit them to Git.

---

## Step 4: Configure the Local Environment

In the project root, copy the example env file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Contentful credentials:

```
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_api_token_here
```

Also fill in the SMTP settings if you want the contact form to work:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=info@chelseamuslimcommunity.org.uk
NEXT_PUBLIC_SITE_URL=https://chelseamuslimcommunity.org.uk
```

---

## Step 5: Populate Initial Content

In Contentful, go to **Content → Add entry** for each content type. Refer to the existing JSON files in `/data/` for the initial content to enter:

| Content type | Source file |
|-------------|------------|
| `announcement` | `data/announcements.json` |
| `event` | `data/events.json` |
| `service` | `data/services.json` |
| `teamMember` | `data/team.json` |
| `openingHours` | `data/opening-hours.json` |
| `siteSettings` | `data/site-settings.json` |
| `aboutContent` | `data/about-content.json` |

For singleton types (`openingHours`, `siteSettings`, `aboutContent`): create exactly **one** entry each.

After adding content, click **"Publish"** on each entry — draft entries are not returned by the API.

---

## Step 6: Test Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All pages should render with your Contentful content. If the env vars are missing or wrong, the site falls back to the local JSON files in `/data/` — so it will still work, just with the default data.

---

## Step 7: Deploy to Netlify

1. Push the code to GitHub (it's already there at `github.com/zaid5678/CMC`).
2. In Netlify, go to **Site settings → Environment variables**.
3. Add the same variables from your `.env.local`:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`
4. Trigger a new deploy: **Deploys → Trigger deploy → Deploy site**.

---

## Step 8: Set Up Automatic Deploys via Webhook

When you publish content in Contentful, you want the site to automatically rebuild on Netlify.

### 8a. Create a Netlify Build Hook

1. In Netlify: **Site settings → Build & deploy → Build hooks**.
2. Click **"Add build hook"**, name it "Contentful Publish", and copy the URL it gives you (looks like `https://api.netlify.com/build_hooks/...`).

### 8b. Create a Contentful Webhook

1. In Contentful: **Settings → Webhooks → Add webhook**.
2. Set:
   - **Name:** Netlify Rebuild
   - **URL:** Paste the Netlify build hook URL
   - **Method:** POST
   - **Triggers:** Check "Entry" → Published, Unpublished, Deleted
3. Click **"Save"**.

Now whenever you publish a change in Contentful, Netlify rebuilds the site automatically (takes about 1–2 minutes to go live).

---

## Step 9: Give Editors Access to Contentful

1. In Contentful: **Settings → Users → Invite users**.
2. Enter their email and assign the **"Editor"** role.
3. They'll get an email invite to create an account.

Editors can then:
- Add and update events, announcements, services, team members
- Change opening hours and contact details
- Publish changes that trigger a live site rebuild

No code or deployment knowledge needed.

---

## Caching Strategy

Pages that fetch from Contentful use **Incremental Static Regeneration (ISR)** with a 1-hour revalidation period (`export const revalidate = 3600`). This means:

- The page is built statically at deploy time
- Every hour, Next.js checks for fresh content
- The Netlify webhook triggers a full rebuild on every Contentful publish, so changes go live within 1–2 minutes regardless of the revalidation window

For most mosque content (events, announcements, hours), this is ideal — fast page loads with near-real-time updates when you publish.

---

## Using Contentful Images

If you upload images to Contentful (e.g. for events), reference them using the Contentful asset URL format:

```
https://images.ctfassets.net/{spaceId}/{assetId}/{filename}
```

The `next.config.mjs` already allows images from `images.ctfassets.net`, so `next/image` will work with Contentful asset URLs out of the box.
