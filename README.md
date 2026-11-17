# Atlas Global AI Policy Coalition — Institutional Website

A dependency-free static website for the Atlas Global AI Policy Coalition. It integrates the source-audited Member Registry rather than rebuilding it.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fatlasaiinstitute%2Fatlas-global-ai-policy-coalition&project-name=atlas-global-ai-policy-coalition)

## Deploy to Vercel

Use the **Deploy with Vercel** button above to import this public GitHub repository and deploy it. Vercel runs `npm run build` and serves the generated `dist/` directory; the build uses only Node.js built-ins and has no third-party package dependencies.

The site deploys without form credentials, but submissions remain disabled until keys are configured. To enable forms, add these **build-time environment variables** in the Vercel project settings, then redeploy:

- `WEB3FORMS_ACCESS_KEY` — membership and contact forms.
- `WEB3FORMS_PUBLICATION_ACCESS_KEY` — publication-submission form only.

The build creates `dist/web3forms-config.js` from those variables. It never copies the local `web3forms-config.js` into the deployment or commits it to source control. Web3Forms browser-side access keys are visible to visitors by design; restrict their allowed domains and configure spam protection in the Web3Forms dashboard. Do not put private server credentials in either variable.

## Architecture

The project uses plain HTML, CSS and JavaScript. `data/members.json` is the single source of truth for 163 audited member records, unique IDs, unique slugs, profile routes, search, filters, pagination and future photo support. The website shell adds an editorial homepage, responsive navigation, institutional page templates, a route manifest and clear content-status placeholders.

The supplied workbook contains 163 unique profiles, not a complete verified 178-member database. The homepage labels 163 as audited profiles, 178 as the broader organizational target, and 55 as a country target awaiting verified assignments. Country assignments, official leadership, publications, news, events, contact details and authorized imagery are not invented; pages use explicit prepared-template states where information is not verified.

## Membership and publication forms

- `/membership/apply/` provides an application form with professional details, membership category, expertise, biography, motivation, consent and spam protection. It uses `WEB3FORMS_ACCESS_KEY`.
- `/contribute/submit/` accepts author and publication details, an abstract, keywords and a secure public Google Drive or Google Docs link. The manuscript itself cannot be pasted or uploaded. Applicants should enable “Anyone with the link — Viewer” and test access in a private browser window. It uses the separate `WEB3FORMS_PUBLICATION_ACCESS_KEY` only on this route.
- Both forms submit to Web3Forms. Submission does not approve membership or publish a contribution automatically. No real submission was sent during development; delivery still depends on each key’s Web3Forms dashboard configuration.

The configured runtime file `web3forms-config.js` is local-only and excluded from version control by `.gitignore`. Do not commit it to a public source repository. `web3forms-config.example.js` contains placeholders for source-code sharing.

## Local review

```bash
npm run build
npm run check
python3 preview_server.py
# open http://localhost:4173/
```

The route manifest is available at `/manus-routes.json`. Keep `data/members.json` as the single member-registry source of truth, preserve profile slugs, and run the validation scripts before opening a pull request. See `docs/`, `plan.md` and `TODO.md` for detailed guidance.
