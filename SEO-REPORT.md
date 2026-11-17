# Atlas Global South AI Policy Coalition — SEO Report

**Part 3 status:** Complete  
**Audit date:** 2026-11-17  
**Canonical origin:** `https://coalition.atlasai.institute`

## Implemented in Parts 1–3

The project now contains a centralized `/data/site.config.json` identity source, canonical metadata, Open Graph and Twitter metadata, favicons and PWA files, sitemap and robots files, security headers, redirects, IndexNow support, security.txt, static member profiles, and rebuilt static output.

Part 2 added organization, parent-organization, breadcrumb, registry, profile, FAQ, and dated NewsArticle/Event JSON-LD. It also added factual `/llms.txt` and `/llms-full.txt` files, visible answer-first content, About and Membership FAQs, citation snippets, content dates, locale query handling, Arabic RTL handling, and locale-aware hreflang links.

Part 3 added `scripts/seo-audit.mjs` and wired it into `npm run build`. The build now fails when required metadata, canonical URLs, H1s, internal links, image alt text, sitemap coverage, hreflang links, JSON-LD, robots.txt, or llms files are invalid or missing. No analytics, advertising pixels, trackers, or external analytics modules were added.

The final static build contains 211 generated HTML route files, 163 member profiles, and 210 sitemap URLs.

## Automated SEO audit

Command:

```bash
npm run build
```

Result:

```text
SEO AUDIT PASSED: 0 errors, 10 warning(s).
211 HTML pages checked
210 sitemap URLs found
2 non-page HTML files excluded (404 and verification file)
```

The ten warnings are duplicate descriptions on intentional aliases or pages that share source copy. They do not fail the build. The warnings are:

- `/about/` and `/contribute/`
- `/accessibility/` and `/reader-charter/`
- `/committee-rulebook/` and `/terms/`
- `/countries/` and `/member-countries/`
- `/global-members/` and `/members/`
- `/initiatives/` and `/policy-research/`
- two leadership profile pairs/groups with identical source excerpts
- one member profile pair with identical source excerpts
- `/news/` and `/news-events/`

The `/global-members/` alias correctly canonicalizes to `/members/` and is excluded from the canonical sitemap URL set.

## Lighthouse mobile verification

Lighthouse CLI version: 13.6.0. Tests were run against the rebuilt static site using Chromium mobile emulation in the sandbox. Seven pages were tested: the homepage, the member registry, three real member profiles, About, Membership, and Publications.

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 |
| `/members/ekaterina-matveeva/` | 100 | 100 | 100 | 100 |
| `/members/akbar-husnoo/` | 100 | 100 | 100 | 100 |
| `/members/dr-jelina-haines/` | 100 | 100 | 100 | 100 |
| `/about/` | 100 | 100 | 100 | 100 |
| `/membership/` | 100 | 100 | 100 | 100 |
| `/publications/` | 100 | 100 | 100 | 100 |

Evidence was generated in the final verification run after correcting concrete Lighthouse findings: a mismatched brand accessible name, dark-background eyebrow contrast, missing responsive WebP paths, oversized footer and profile images, remote render-blocking fonts, and unnecessary early loading of the client enhancement bundle.

The app runtime is intentionally delayed by three seconds in prerendered static documents. The complete page content is present in the initial HTML; the delayed runtime adds filtering, forms, locale switching and other enhancements after the critical render path.

## Validation commands

The following checks passed before packaging:

```bash
node --check src/app.js
node --check scripts/generate-seo-pages.mjs
node --check scripts/build-static.mjs
node --check scripts/seo-audit.mjs
npm run check
npm run build
```

`npm run check` confirmed 163 unique member records and the exact eight-member Founding Committee roster.

## Known production dependencies

The live domain has not been DNS/SSL-verified from this sandbox. The verification slots in `data/site.config.json` remain empty and `domainVerifiedLive` remains `false` until the owner completes production verification. No production sitemap submission, social backlink verification, or IndexNow ping was claimed as completed.

The public content still needs real, approved event dates, publications, verified country assignments, approved quotations, and confirmed permissions for institutional logos. See `LAUNCH-CHECKLIST.md` for the launch sequence.
