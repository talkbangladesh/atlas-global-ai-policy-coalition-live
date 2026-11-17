# Architecture

The application uses a single JSON source of truth and a reusable client-side renderer. Directory cards, profile pages and future country pages all read from `data/members.json`. The static shell is compatible with GitHub Pages; `404.html` provides the SPA fallback for direct profile URLs.

The data-access boundary is intentionally simple so the JSON service can later be replaced with PostgreSQL or an API without changing presentation components.
