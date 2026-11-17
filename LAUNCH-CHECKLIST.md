# Atlas Global South AI Policy Coalition — Launch Checklist

This checklist is intentionally status-based. Production-only actions are not marked complete from the sandbox.

## Domain, DNS, SSL and hosting

- [ ] Confirm DNS for `coalition.atlasai.institute` points to the selected hosting provider.
- [ ] Confirm the production certificate is valid for `coalition.atlasai.institute` and redirects HTTP to HTTPS.
- [ ] Confirm the canonical site loads at `https://coalition.atlasai.institute/`.
- [ ] Confirm the configured old-domain and `www` redirects resolve with permanent redirects to the canonical origin.
- [ ] Confirm the deployed static host serves `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/manus-routes.json`, and `/.well-known/security.txt`.
- [ ] After DNS, SSL, canonical URL and hosting checks pass, set `domainVerifiedLive` from `false` to `true` in `/data/site.config.json` and rebuild.

## Search engine verification and submission

- [ ] Create or open the Google Search Console property for `https://coalition.atlasai.institute`.
- [ ] Add the Google verification value to `verification.googleSearchConsole` in `/data/site.config.json`, rebuild, deploy, and complete verification.
- [ ] Submit `https://coalition.atlasai.institute/sitemap.xml` to Google Search Console.
- [ ] Add the site to Bing Webmaster Tools.
- [ ] Add the Bing verification value to `verification.bingWebmaster` in `/data/site.config.json`, rebuild, deploy, and complete verification.
- [ ] Submit `https://coalition.atlasai.institute/sitemap.xml` to Bing Webmaster Tools.
- [ ] Confirm the deployed robots policy exposes the sitemap and does not block public HTML pages.

## Social and rich-result checks

- [ ] Confirm the LinkedIn Showcase page links back to `https://coalition.atlasai.institute/`.
- [ ] Confirm the Atlas AI Institute LinkedIn page links back to `https://coalition.atlasai.institute/`.
- [ ] Confirm the Facebook page links back to `https://coalition.atlasai.institute/`.
- [ ] Test the deployed homepage, About page, Membership page, registry page and a member profile with Google’s Rich Results Test.
- [ ] Confirm Organization, BreadcrumbList, FAQPage, CollectionPage/ItemList, Person and dated Article/Event results are parsed as intended.
- [ ] Test Open Graph and Twitter previews using the deployed URL and confirm the branded 1200×630 share image, title, description and canonical URL.
- [ ] Confirm Arabic previews and `?lang=ar` pages use `lang="ar"` and `dir="rtl"`.

## IndexNow and post-deploy monitoring

- [ ] After the first production deployment, run the IndexNow ping using the key file at `/indexnow-key.txt` and the deployed canonical URL.
- [ ] Record the deployment date and submitted sitemap URL in the launch log.
- [ ] Review Search Console and Bing crawl reports after the first crawl cycle.
- [ ] Re-run `npm run build` and `npm run check` for every content/data release.
- [ ] Re-run `node scripts/seo-audit.mjs` against the rebuilt output before each deployment.

## Real content still needed

The following items are deliberately not invented or filled with placeholder facts:

- Confirmed event dates, times, timezones, locations and registration links.
- Approved publications with real titles, authors, dates, summaries, URLs and files.
- Verified member-country assignments and authoritative country records.
- Approved quotations with named speakers and source context.
- Permission to use institutional logos and any additional partner marks.

## Current project status

The sandbox build and audit pass. `domainVerifiedLive` remains `false`, Google and Bing verification slots remain empty, and the production submission and backlink checks remain pending because they require the owner’s live domain access and external platform accounts.
