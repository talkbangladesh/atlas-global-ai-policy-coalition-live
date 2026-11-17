# Committee SEO, AEO and GEO implementation report

**Scope:** Atlas Global South AI Policy Coalition Leadership and Founding Committee pages, plus the eight linked Founding Committee member profiles.

> **Status:** This report records the earlier Committee-only implementation. Its original canonical-domain recommendations have been superseded by [the Phase 1 global discoverability report](PHASE-1-GLOBAL-DISCOVERABILITY-REPORT.md), which uses the verified Vercel production domain and a centralized planned-domain configuration.

## 1. Existing SEO condition

The repository’s original leadership and Founding Committee HTML files were generic shells: the `<title>` and description described the member registry, the `#app` container was empty in the initial HTML, and the pages had no canonical URL, Open Graph or X/Twitter metadata, or JSON-LD. No project-generated `robots.txt` or `sitemap.xml` was present. The existing browser renderer and member/committee source data were retained.

## 2. SEO improvements implemented

The static production build now prerenders `/leadership/` and `/leadership/founding-committee/` using the existing app renderer and source data. Both pages receive distinct titles and descriptions, a canonical URL on the official Coalition domain, seven relevant keyword phrases, index/follow directives, Open Graph and X/Twitter preview metadata, and the official Coalition logo as the preview image. Existing paths and the roster design are preserved. A favicon derived from the existing official logo is emitted and linked from the prerendered pages.

## 3. AEO improvements implemented

The pages include a concise institutional introduction and a visible, accessible FAQ section. It answers what the Coalition and Founding Committee are, the Committee’s stated remit, who its members are, what professional details are available, which country labels appear on public member profiles, how researchers and institutions can engage, and what formal authority the site does not claim. Committee cards now distinguish their Committee responsibility from the linked profile’s professional designation, affiliation and country label. Each country is explicitly described as a member-profile label, not an official national delegation. Committee text and links were darkened slightly where Lighthouse identified contrast below WCAG AA, without changing the layout.

## 4. GEO and entity identity

The pages use the exact name **Atlas Global South AI Policy Coalition**, describe the relationship as convened by Atlas AI Institute, and identify the Institute as the Coalition’s institutional host and secretariat, consistent with the repository’s public content. The official Coalition LinkedIn Showcase is used as the Coalition organization’s `sameAs` profile. The official website and Institute URLs are used as the entity links. No government, statutory, intergovernmental or formally recognised international-authority status is asserted.

## 5. Structured data implemented

The committee pages emit JSON-LD for `Organization`, `WebSite`, `WebPage`, `ItemList`, `Person`, `PropertyValue`, `BreadcrumbList` and the visible `FAQPage`. Each committee member’s Person entity links to the existing member-profile URL, identifies Coalition membership via `memberOf`, and includes only repository-sourced professional designation, organization affiliations and profile-country labels when supplied. The Committee role and profile country are explicit `PropertyValue` labels, avoiding an implication of official national representation. The eight member profile pages emit `ProfilePage`, `Person`, `Organization`, `WebSite` and `BreadcrumbList` entities. Unique, stable IDs are based on the official page URLs.

## 6. Technical SEO issues identified and resolved

- Replaced client-only initial HTML for the two leadership routes with crawlable, content-bearing static HTML while preserving browser rendering and interactions.
- Added route-specific titles, descriptions, canonical URLs, Open Graph and X/Twitter metadata.
- Generated a public `robots.txt` that allows crawling, disallows `/api/*`, and references the sitemap.
- Generated an XML sitemap from the repository’s literal public routes and added the eight committee-member profile URLs; dynamic route templates are excluded.
- Added responsive 190/253/594-pixel WebP sources for the eight committee portraits with original PNG fallbacks, explicit dimensions, and lazy loading for off-screen portraits. The 594-pixel WebP derivatives total about 183 KB versus about 6.0 MB for the original PNG files (roughly 97% smaller); source originals remain unchanged.
- Added the Coalition favicon, fixed the brand link’s accessible name, and verified all generated page image and icon paths resolve in the build output.
- No multilingual alternate pages are defined for this scope, so no `hreflang` tags were added.

## 7. Member profile indexability

The static build now includes crawlable HTML at the eight existing committee-member profile URLs. Those pages retain the existing profile renderer and content, receive individual metadata and `ProfilePage`/`Person` JSON-LD, and are included in the sitemap. The other 155 member records still use the existing client-rendered profile behavior and were not prerendered as part of this Committee-page task.

## 8. Linking improvements

Committee cards retain their existing links to member profiles. Each page links to the Institute from the introduction and to the Coalition’s membership and contact pathways from the FAQ section. The official LinkedIn Showcase is linked in organization metadata. Whether the separate Atlas AI Institute website links back to the Coalition could not be changed from this repository; that cross-site backlink remains a recommended follow-up.

## 9. Validation and remaining limitations

Validated locally on the generated production build:

- `npm run check` passed: 163 member records and the exact eight-member founding committee source roster validated.
- `npm run build` passed and generated two committee pages, eight profile pages, a 36-URL sitemap and `robots.txt`.
- Raw HTML checks confirmed meaningful page content, all eight committee names, canonical and description metadata, and valid JSON parsing for each JSON-LD block.
- XML parsing confirmed the sitemap and the committee/profile URL entries. Local HTTP smoke tests returned the committee page, a member profile, `robots.txt` and `sitemap.xml` successfully, including with a Googlebot User-Agent.
- Referenced local images in the ten generated pages were checked; none were missing.
- Local mobile Lighthouse 12.6.1 on the built Founding Committee page reported **Performance 80, Accessibility 100, Best Practices 100, SEO 100**. Its LCP improved from 27.4 seconds before portrait optimization to 4.9 seconds afterward. These are local diagnostic results, not a deployed-site or field-data Core Web Vitals pass. The local Python server does not configure compression or cache headers, and the shared Google Fonts/main CSS chain remains a render-blocking opportunity.

The GitHub push succeeded, but the sandbox could not resolve or extract the public `coalition.atlasai.institute` pages during deployment verification. Therefore live raw HTML, public `robots.txt`/sitemap, Google PageSpeed Insights, Google Rich Results Test, Schema.org Validator, Google Search Console, Bing Webmaster Tools and deployed-site Lighthouse remain unverified. Re-run the live checks when the domain is reachable; Search Console and Bing checks also require authorized site properties. The remaining SPA-rendered pages outside the ten generated routes may still need a broader crawlability and metadata pass. No indexing, ranking, AI citations or global recognition are claimed.

## 10. Recommended next steps

1. After the Phase 1 build is deployed, inspect the live raw HTML and HTTP status for both Committee routes and a representative member profile on the configured Vercel primary domain.
2. Submit `https://atlas-global-ai-policy-coalition.vercel.app/sitemap.xml` in Google Search Console and Bing Webmaster Tools after confirming ownership.
3. Run Google Rich Results Test and Schema.org Validator on the deployed Committee and member-profile URLs; resolve any validator feedback that is relevant and supported by visible content.
4. Run PageSpeed Insights and Lighthouse on the deployed site for mobile and desktop; investigate remaining font/CSS blocking and confirm host-level compression and cache behavior. The local audit is a diagnostic baseline only.
5. Ask the Atlas AI Institute website maintainer to add a descriptive link back to the official Coalition website and committee page if appropriate.
6. Consider a separate, source-audited static-generation pass for the remaining member profiles and other public routes, preserving the same privacy and factuality rules.
