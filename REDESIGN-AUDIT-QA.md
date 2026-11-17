# Atlas Coalition — Route redesign audit and QA

## Scope decision

`manus-routes.json` contains **40 routes**, including `/` (the completed homepage). That leaves **39 remaining routes**, not 38 as stated in the request. The attached note repeated the count but did not name a route to omit, so this pass used the manifest as the source of truth and included every listed route. Parameterized routes are rendered/prerendered when their corresponding source records exist; no country, publication, event, or contribution records were fabricated to fill empty datasets.

## Route inventory and template assignment

### About / mission / governance / leadership — editorial layout
- `/about/` — About the Coalition
- `/about/mission-and-vision/` — Mission & Vision
- `/about/organizational-structure/` — Organizational Structure
- `/about/governance/` — Governance
- `/leadership/` — Leadership & Governance
- `/leadership/:slug/` — Leadership Profile (concrete committee profiles are generated from the verified committee roster)
- `/leadership/founding-committee/` — Founding Committee

### Member registries — searchable cards and progressive loading
- `/global-members/` — Global Members (canonical alias to `/members/` retained)
- `/members/` — Members

### Member profiles — consistent profile, previous/next and registry navigation
- `/members/:slug/` — Member Profile (163 member-profile pages prerendered)

### Country pages — neutral map and verified-data boundary
- `/member-countries/` — Member Countries
- `/member-countries/:country-slug/` — Country Profile (truthful verification state; no unverified country profile generated)
- `/countries/` — Countries
- `/countries/:country-slug/` — Country Profile (truthful verification state; no unverified country profile generated)

### Research and initiatives — overview cards and data-backed detail pages
- `/policy-research/` — AI Policy & Research
- `/policy-research/:slug/` — Policy Research (six existing research-track routes generated)
- `/initiatives/` — Global Initiatives
- `/initiatives/:slug/` — Initiative (three existing initiative routes generated)

### Publications and contribution library — approved records only
- `/publications/` — Publications & Resources
- `/publications/:slug/` — Publication (no detail route generated without a published record)
- `/monthly-publication-programme/` — Monthly Publication Programme
- `/contributions/` — Contributions Library
- `/contributions/:slug/` — Published Contribution (no detail route generated without an approved published record)

### News and events — complete ISO dates, upcoming and archive separation
- `/news/` — News
- `/news/:slug/` — News Article (generated from the existing dated news record)
- `/events/` — Events
- `/events/:slug/` — Event (no detail route generated without a fully dated record)
- `/news-events/` — News & Events

### Member contributions — submission form and editorial-review steps
- `/contribute/` — Article Contributions
- `/contribute/submit/` — Share your thoughts

### Membership — benefits, eligibility and validated application
- `/membership/` — Membership
- `/membership/eligibility/` — Membership Eligibility
- `/membership/apply/` — Apply for Membership

### Contact — accessible contact form and published channels
- `/contact/` — Contact

### Legal / reader and committee documents — long-form reading layout
- `/privacy/` — Privacy Policy
- `/terms/` — Terms of Use
- `/accessibility/` — Accessibility Statement
- `/reader-charter/` — Reader Charter
- `/committee-rulebook/` — Committee Rulebook

### Homepage (already redesigned; not counted among remaining routes)
- `/` — Home | Atlas Global AI Policy Coalition

## Implementation summary

- Kept the static Vanilla JS/CSS architecture and existing URL patterns; no framework or runtime package was added.
- Rebuilt through the existing static generation pipeline. The build emitted **211 HTML route pages**, including **163 member profile pages**, six research-track details, three initiative details, dated news, and committee profile routes.
- Generated `dist/sitemap.xml` with **210 canonical URLs**; the `/global-members/` alias retains its canonical to `/members/`.
- Retained the configured canonical origin from `site-domains.json`: `https://atlas-global-ai-policy-coalition.vercel.app`. `coalition.atlasai.institute` remains displayed as non-clickable text.
- The member registry uses search and filters with “Load more”; profile fields remain conditional on source data. Empty countries, publications and events are represented truthfully.
- Newsletter markup is hidden unless a newsletter endpoint is configured. Contact, membership and contribution forms now report an unconfigured delivery channel instead of claiming success; when configured, they use the existing Web3Forms build-time keys and a honeypot field.
- The branded 404 includes a registry search and main-section links. The saved Arabic locale sets the document language and RTL direction on initial render.

## QA report

| Check | Result |
|---|---|
| `npm run check` | **Pass** — JavaScript syntax, 163 member records, and eight-person founding committee validations passed. |
| `npm run build` | **Pass** — static generation completed; 211 HTML files and sitemap generated. |
| Manifest route coverage | **Pass** — all 30 literal manifest routes exist in `dist/`; parameterized pages are generated only where source data supports concrete records. |
| Per-route title, description, canonical, Open Graph, shared header/footer and `<main>` | **Pass** for all 30 literal manifest pages; titles are unique across those routes. |
| Member profile prerendering | **Pass** — 163 generated pages. |
| Internal links | **Pass** — generated HTML scan found zero broken local `href` targets. |
| Chromium visual/runtime smoke | **Pass** on representative homepage, about, directory, profile, countries, publications, news/events, forms, membership, contact and legal routes; styled mobile screenshot reviewed at 390×844. |
| Branded 404 | **Pass** — `404.html` rendered the shared shell and registry search. |
| RTL smoke | **Pass** — Arabic locale rendered `<html lang="ar" dir="rtl">`. |
| Lighthouse mobile score | **Not measured** — Lighthouse CLI is not installed in this environment. The requested 90+ target is therefore unverified. |
| Full keyboard-only audit | **Not completed** — visible focus styling and minimum touch-target CSS are present, but a complete manual keyboard pass remains necessary. |
| WCAG contrast audit | **Not measured** — contrast was not independently quantified with an audit tool. |
| Tablet and desktop visual review | **Not completed** — source includes responsive breakpoints, but only representative mobile rendering was visually reviewed. |

## Real content / configuration still needed

- **Country verification:** authoritative country assignments and any approved region/member-count fields for `data/countries.json`.
- **Events:** confirmed public event records, each with a complete ISO date and approved title/details (plus time, timezone, location and registration URL if public).
- **PDFs/publications:** approved publication title, date, type, PDF URL and file size for each item.
- **Newsletter:** a working endpoint and any required credentials/configuration before displaying signup.
- **Quotes:** approved quotations, attribution and publication permission, if quotes are to appear.
- **Logo permissions:** confirmation for institutional/member logos; until then use text or existing authorized coalition artwork only.
- **Form delivery:** configure the existing Web3Forms access keys and validate their spam-protection/domain settings before accepting submissions in production.
- **Route-count decision:** confirm whether the manifest is intended to have 39 non-home routes, or identify a route to remove if 38 is the intended total.
