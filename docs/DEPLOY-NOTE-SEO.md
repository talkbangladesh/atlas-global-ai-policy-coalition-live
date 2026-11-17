# Part 1 technical SEO deployment note

The source of truth for site identity, canonical origin, social profiles, locales, contact email, verification placeholders and domain status is [`data/site.config.json`](../data/site.config.json).

Before launch, confirm DNS, SSL and hosting for `https://coalition.atlasai.institute`. The Vercel configuration contains 301 host redirects for the `www` hostname, the previous Vercel production hostname and the legacy member hostname.

Google Search Console and Bing Webmaster verification values are intentionally empty until the site owner supplies the verified tags.
