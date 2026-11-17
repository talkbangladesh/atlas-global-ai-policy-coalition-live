# One-click Vercel deployment

This repository is configured as a static Vercel project.

## Deploy

1. Import the repository into Vercel, or use the **Deploy with Vercel** button in `README.md`.
2. Keep the detected framework as **Other** (or leave it unselected).
3. Keep the default build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js: `22.x`
4. Deploy. No environment variables are required for the public site.

The build generates the complete static site, SEO pages, `sitemap.xml`, `robots.txt`, `llms.txt`, and `404.html` in `dist/`.

## Optional form configuration

To activate the membership/contact and publication forms, add these Vercel **Environment Variables** and redeploy:

- `WEB3FORMS_ACCESS_KEY`
- `WEB3FORMS_PUBLICATION_ACCESS_KEY`

These are intentionally browser-visible Web3Forms access keys. Do not put private server credentials in them.

## Domains

Attach `coalition.atlasai.institute` in Vercel after DNS is configured. The legacy `www.coalition.atlasai.institute` and `coalitionmembers.atlasai.institute` hosts redirect to the primary domain. Vercel preview and project domains remain usable for deployment checks.
