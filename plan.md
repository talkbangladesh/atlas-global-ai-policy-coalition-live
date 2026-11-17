# Atlas Global South AI Policy Coalition — Redesign Plan

## Implementation approach

The project remains a dependency-free static HTML/CSS/JavaScript site so the existing audited member registry, route manifest, SEO generation and form integration continue to work without introducing an unnecessary framework. The application will use one reusable renderer in `src/app.js`, shared tokens and responsive components in `src/styles/main.css`, and explicit JSON data sources under `data/`.

The homepage will be rebuilt around the supplied section order: Hero, Stats, About, Mission/Vision, Global Reach, Members, Member Countries, Founding Committee, Research Tracks, Initiatives, Publications, News & Events, Member Contributions, Join CTA, and Footer. All content-bearing cards are generated only when their source record contains a value. Missing country assignments, publications, events, affiliations, quotes and profile fields will be omitted rather than filled with placeholder copy.

The 55-country figure remains the reported coalition metric from the supplied homepage brief; the public country dataset remains an independent truth boundary with zero verified assignments. The interface will label those two facts clearly and will not invent country names or map highlights. News will show only dates that already include a year; the supplied undated announcement entries will remain out of the public News cards until their year is verified. Publications and upcoming events will use their own JSON files and render the required programme/calendar empty states without fake records.

Reusable primitives include the sticky header, icon-only brand mark, language switcher, primary/text-link CTA hierarchy, section headers, member cards, committee cards, research/initiative cards, map/list controls, publication/event/news cards, form panels, newsletter signup, footer and reduced-motion scroll reveal. The world map is an inline SVG with accessible map semantics and a data hook for verified country paths. It renders the world silhouette and only adds highlighted interactive country markers when `/data/countries.json` contains verified `map` coordinates.

## Design direction

**Chosen movement: International Editorial Ledger.** The experience is quiet, institutional and editorial, borrowing the precision of a policy brief rather than the energy of a marketing landing page.

- **Core principles:** evidence before ornament; generous rhythm; calm hierarchy; global but not decorative.
- **Color philosophy:** deep navy carries institutional trust, warm off-white gives the long page a paper-like reading surface, and teal is reserved for verified action, data markers and movement.
- **Layout paradigm:** offset editorial bands and split compositions, with content aligned to a readable measure and visual emphasis created through rules, tint shifts and asymmetry instead of dense centered grids.
- **Signature elements:** thin hairline rules, teal evidence markers, a square A-seal for small-size branding, and a world-network map motif.
- **Interaction philosophy:** every control states its outcome; secondary actions are quiet arrow links; map and filters reveal data without changing the page context.
- **Animation:** count-up statistics begin on intersection; map routes and scroll reveals are subtle; `prefers-reduced-motion` disables continuous animation and uses immediate transitions.
- **Typography:** Newsreader for editorial headlines, Inter for body/UI, and JetBrains Mono for small uppercase labels and data identifiers.
- **Brand essence:** an international platform for responsible AI governance cooperation; rigorous, connective, inclusive.
- **Brand voice:** direct and evidence-aware. Example lines: “Advancing global AI governance through international cooperation.” “Explore the member registry.”
- **Wordmark and logo:** a compact A-seal paired with the full Coalition wordmark; the supplied logo asset remains the source mark while the seal handles small sizes.
- **Signature brand color:** `#12A39F`, used sparingly for action and verified status.

## Project structure

```text
data/                    source-of-truth JSON files and empty publication/event structures
src/app.js               route resolution, reusable components and interactions
src/styles/main.css      tokens, responsive layout, accessibility and motion rules
public/manus-routes.json complete static route manifest
scripts/                 existing static build and SEO generation utilities
docs/content-checklist.md real-content handoff checklist
plan.md                  implementation and design decisions
TODO.md                  outcome-based delivery status
```

## Delivery scope

The redesign includes the homepage and shared shell, preserves member/profile and institutional routes, adds i18n-ready English/Spanish/French/Arabic structure with RTL switching, updates metadata and route compatibility, removes forbidden placeholder strings from rendered content, and leaves external publishing/DNS changes untouched until explicitly requested.
