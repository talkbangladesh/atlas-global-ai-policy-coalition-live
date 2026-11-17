# Atlas Global South AI Policy Coalition — Delivery TODO

## Shared shell and design system
- [x] Replace the existing shell with a sticky mobile-first header, icon-only small-size brand mark, language switcher, one `Become a Member` primary CTA, semantic landmarks, keyboard navigation, visible focus rings and a responsive footer.
- [x] Establish deep navy, teal, warm off-white, Newsreader, Inter, JetBrains Mono, 8-point spacing, readable max-widths, consistent radii/shadows and reduced-motion behavior in shared tokens.
- [x] Add English-first i18n structure with Spanish, French and Arabic translation JSON files; Arabic switches document direction to RTL.

## Homepage sections and truthful data boundaries
- [x] Implement the required section order: Hero, Stats, About, Mission/Vision, Global Reach, Members, Member Countries, Founding Committee, Research Tracks, Initiatives, Publications, News & Events, Member Contributions, Join CTA and Footer.
- [x] Use only source data and supplied coalition brief copy. Do not render “Details coming soon”, “Forthcoming”, “Country names will appear here”, or any invented names, facts, quotes, logos or statistics.
- [x] Keep the reported 55-country metric consistent while clearly distinguishing it from the zero verified country assignments in `data/countries.json`; do not infer geography from biographies.
- [x] Use one consistent member-card style, real supplied photos where available, initials avatars otherwise, equal card structure, and only fields with data.
- [x] Replace the empty country box with an accessible inline SVG world map, data-driven highlight hooks, searchable/filterable verified-country list, region filter and no invented country records.
- [x] Add a derived affiliations strip from institutions already present in member profiles with a code note that logo permission must be confirmed; use text wordmarks when no logos are supplied.
- [x] Show Co-Chairs prominently with supplied photos, roles and biography excerpts; render optional quote text only when configured. Render the uniform Founding Committee grid below.
- [x] Render research tracks and initiatives as numbered cards with one-line descriptions and Explore text links; featured treatment has an explicit reason.
- [x] Render only published publications and complete-year news/events. If the data arrays are empty, use factual programme/calendar notices and no fake cards.
- [x] Add the member-contribution CTA plus a clear three-step editorial-review process. Join CTA has one `Apply for Membership` primary button, one `View membership criteria` text link, and benefits; no empty navy button.

## SEO, performance and handoff
- [x] Keep the route manifest synchronized, add canonical/OG/Twitter metadata, Organization JSON-LD, sitemap and robots output, and retain explicit image dimensions/lazy loading where images render.
- [x] Run JavaScript, JSON, member, committee and static build checks; resolve actionable diagnostics.
- [x] Save the final change as a canonical checkpoint on `main`; do not publish or change domain/DNS without explicit approval.
- [ ] Track remaining real content in `docs/content-checklist.md`: verified country list/map coordinates, photos, approved affiliations/logos, quotes, publications/PDFs, event details, translations and contact/social confirmation.
