# Phase 1 — Homepage, About & Technical SEO Foundation

**Project:** Atlas Global South AI Policy Coalition
**Repository:** `atlasaiinstitute/atlas-global-ai-policy-coalition`
**Primary origin configured:** `https://atlas-global-ai-policy-coalition.vercel.app`
**Status:** Phase 1 implemented, pushed and production-validated. Phase 2 has not started.

## Executive summary

The existing Vanilla HTML/CSS/JavaScript project and its routes were preserved. The production build now renders the page content already produced by the existing application into the initial HTML for all 28 literal routes in `manus-routes.json`, rather than shipping an empty app mount with generic registry metadata. It gives the homepage and About page dedicated metadata and structured data, keeps the existing visible page markup unchanged, and emits domain-consistent canonical URLs, social cards, `robots.txt` and `sitemap.xml`.

The Phase 1 checkpoint was pushed to GitHub `main` as `e5e6d877e47001d7a747bb0a385d557439c80331`. The live Vercel site served the new HTML immediately after the push. Homepage, About, robots, sitemap and the Google verification file were confirmed live; 36 published routes were fetched with a Googlebot User-Agent.

## Before and after measurements

The before-change live homepage and About URL both returned HTTP 200, but their raw HTML used the generic “Global Members” title/description and an empty `#app` mount. `robots.txt` pointed to the planned `coalition.atlasai.institute` sitemap rather than the live Vercel origin.

| Page / run | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage, before (Lighthouse mobile simulation) | 98 | 96 | 100 | 100 | 1.6 s | 2.1 s | 0 | 0 ms |
| Homepage, after (same Lighthouse simulation, 3 runs) | 74–75 | 96 | 100 | 100 | 1.6 s | 11.4–11.5 s | 0 | 0 ms |
| Homepage, after (Lighthouse DevTools throttling) | 98 | 96 | 100 | 100 | 1.8 s | 1.8 s | 0 | 0 ms |
| About, before (Lighthouse mobile simulation) | 95 | 95 | 100 | 100 | 1.6 s | 2.9 s | 0 | 0 ms |
| About, after (same Lighthouse mobile simulation) | 97 | 95 | 100 | 100 | 1.6 s | 2.6 s | 0 | 0 ms |

The post-change homepage results differ substantially by Lighthouse throttling method. The mobile-simulation run reports the H1 as LCP with an 11.4–11.5 s simulated render delay, while a DevTools-throttled run measured 1.8 s LCP and 98 performance. The repeated mismatch is disclosed rather than treated as a pass or hidden; obtain representative field/real-user measurements in Phase 3 before making performance or visual changes. About improved in the same-method comparison. The original UI and visible copy remain unchanged.

## Implementation

### Homepage and About

- Added distinct titles, content-derived descriptions, canonical URLs, Open Graph and Twitter/X card tags, index/follow directives, a language declaration, and route-specific hidden keyword metadata.
- The homepage JSON-LD graph contains the existing Coalition Organization identity, WebSite and WebPage entities. The About route uses AboutPage and links its main entity to the Coalition. The organization description is taken from published Coalition copy; no legal status, partner, recognition or other unsupported claim was added.
- Existing image elements across the generated public routes already had `alt` attributes; no visual asset, logo, styling or visible copy was changed.
- The existing rendering script preserves generated page titles and head metadata on boot and binds the current interactions to the pre-rendered DOM instead of replacing the page body after loading.

### All literal public routes

- The build generated initial HTML for all **28** literal route declarations using the existing route renderer and its current source data.
- Titles and descriptions are derived from each route’s existing manifest and rendered text; titles are 30–60 characters and descriptions 50–160 characters. Hidden keywords are concise, topic-relevant and derived from the page heading, site identity and existing page copy; they do not alter visible text.
- Open Graph, Twitter/X, canonical and WebPage metadata use only the configured live Vercel origin.
- `/global-members/` remains reachable but is identified as a duplicate of `/members/` using a canonical to `/members/`; the sitemap lists the canonical directory only. This is the sole duplicate title/canonical group found and is intentional.
- Existing Founding Committee and eight committee-member profile pages remain generated with their existing FAQPage, ItemList, Person and ProfilePage structured data.

### Crawl and verification files

- `robots.txt` allows public crawling, excludes `/api/*`, and names the sitemap on the current Vercel primary domain. No legitimate search or AI-search crawler is blocked.
- `sitemap.xml` contains **35 unique canonical URLs**: 27 canonical literal routes plus the eight existing committee-member profiles. It contains no planned-domain URLs.
- The supplied Google verification meta tag is emitted in prerendered pages, and the exact requested root file `google343e8e6554f1798d.html` is copied into Vercel output and confirmed to return HTTP 200 with its required content.
- `404.html` has a route-appropriate title and `noindex,follow`; its existing visible body remains unchanged.
- Vercel’s existing build command, output directory and rewrite configuration were retained.

## Domain migration readiness

`site-domains.json` is the centralized domain configuration. The confirmed live Vercel origin is the sole active canonical origin. `coalition.atlasai.institute` and `coalition.atlasaii.org` are recorded as planned only; redirects remain disabled. No DNS settings, Vercel domain assignments or production-domain redirects were changed. A future authorized domain activation can update canonical, Open Graph and sitemap origins consistently.

## Validation results

- `npm run check` passed: all 163 member records passed unique-ID/slug checks, and the exact eight-member Committee dataset passed its validator.
- `npm run build` passed: 28 literal pages and eight existing Committee member pages generated.
- A route-by-route comparison confirmed that the generated app body exactly matches the existing renderer output for all 28 literal routes. No visible text, CSS, layout or route was changed.
- Titles, descriptions, 3–8 hidden keywords, one H1, canonical/OG URL agreement, image alt attributes, robots directives and JSON-LD were checked locally.
- All 28 literal routes and all eight existing Committee profile URLs returned HTTP 200 with an H1, route-specific title and canonical HTML when fetched from production with a Googlebot User-Agent.
- Production robots and sitemap use the Vercel primary origin; the sitemap parses with 35 unique canonical URLs. The Google verification file returned HTTP 200 and the required file content.
- The static-site internal-link audit found no broken links among declared routes or published member slugs.
- `git diff --check` passed; the pushed branch is `main`.

## Findings and remaining work

1. **Preserved long About heading:** one existing About-page H2 is 130 characters. It has not been rewritten because the user explicitly requires zero visible-copy changes. All H1s are within 80 characters; this H2 remains a disclosed SEO-panel limitation.
2. **Dynamic missing-slug HTTP status:** on production, an unknown extensionless member slug (`/members/no-such-profile`) returns HTTP 200, while `/members/no-such-profile/` and an unknown slash-suffixed static route return 404. The broad Vercel SPA rewrite is pre-existing. The routing policy was not changed in Phase 1 to avoid breaking existing dynamic links; precise status handling needs a published-record-aware route solution in the next authorized phase.
3. **Dynamic member/publication discoverability:** the 155 other member profiles and dynamic publication/article details have not been individually prerendered or added to the sitemap in Phase 1. Their profile and publication metadata, attribution and structured data belong to the separately staged member/publication work.
4. **External verification:** the Google proof file and meta tag are public, but Search Console ownership has not yet been confirmed inside the Google Search Console account. Google must fetch the deployed file/tag before it recognizes ownership.
5. **Environment variables:** the sandbox build reported no local Web3Forms membership/publication keys. Production environment values were not inspected or changed; verify those in Vercel without copying secrets into the repository.
6. **Phase 3 items:** caching/security headers, a full security review and performance optimization are not implemented in this phase. The homepage Lighthouse simulation mismatch above should be resolved with representative real-user/field data before changing the preserved UI.

No claim of guaranteed rankings, indexing, citations or AI-search placement is made. Phase 2 has not been started, as requested.

## Files changed or added

- Modified `scripts/generate-seo-pages.mjs` for all-static-route rendering, route-specific metadata, schema, canonical origin, sitemap/robots output and Google verification.
- Modified `scripts/build-static.mjs` to include the verification file in Vercel output.
- Modified `src/app.js` to retain matching prerendered metadata and hydrate existing generated content without replacing its body.
- Modified `404.html` head metadata only.
- Added `site-domains.json` and `google343e8e6554f1798d.html`.
- Added this Phase 1 report and updated `docs/COMMITTEE-SEO-IMPLEMENTATION-REPORT.md` to mark its earlier domain recommendations as superseded.
