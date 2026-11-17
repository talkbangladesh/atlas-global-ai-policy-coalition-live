import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist");
const readJson = async (relativePath) =>
  JSON.parse(await readFile(path.join(projectRoot, relativePath), "utf8"));
const siteConfig = await readJson("data/site.config.json");
const origin = new URL(siteConfig.primaryDomain).origin;
const linkedinUrl = siteConfig.sameAs[0];
const logoUrl = `${origin}/assets/atlas-global-south-logo.jpg`;
const shareImageUrl = `${origin}${siteConfig.defaultShareImage}`;
const locales = siteConfig.locales || [siteConfig.defaultLocale || "en"];
const coalitionId = `${origin}/#organization`;
const instituteId = `${origin}/#institute`;
const websiteId = `${origin}/#website`;
const googleVerification = siteConfig.verification?.googleSearchConsole || "";
const bingVerification = siteConfig.verification?.bingWebmaster || "";

const [membersData, committeeData, homepageData, contributionsData, countriesData, metricsData, publicationsData, eventsData, newsData, affiliationsData, routesData] =
  await Promise.all([
    readJson("data/members.json"),
    readJson("data/founding-committee.json"),
    readJson("data/homepage-content.json"),
    readJson("data/contributions.json"),
    readJson("data/countries.json"),
    readJson("data/metrics.json"),
    readJson("data/publications.json"),
    readJson("data/events.json"),
    readJson("data/news.json"),
    readJson("data/affiliations.json"),
    readJson("manus-routes.json"),
  ]);
const members = membersData.members;
const appSource = await readFile(path.join(projectRoot, "src/app.js"), "utf8");
if (!/\nload\(\);\s*$/.test(appSource)) {
  throw new Error("Could not safely prepare the existing app renderer for static page generation.");
}
let renderedMarkup = "";
const appMount = {
  get innerHTML() { return renderedMarkup; },
  set innerHTML(value) { renderedMarkup = String(value); },
};
const prerenderDocument = {
  title: "",
  querySelector(selector) { return selector === "#app" ? appMount : null; },
  querySelectorAll() { return []; },
  head: { querySelector() { return null; }, appendChild() {} },
  createElement() { return { setAttribute() {}, content: "" }; },
};
const sandbox = {
  document: prerenderDocument,
  location: { pathname: "/", href: `${origin}/` },
  membersData,
  committeeData,
  homepageData,
  contributionsData,
  countriesData,
  metricsData,
  publicationsData,
  eventsData,
  newsData,
  affiliationsData,
  siteOrigin: origin,
};
vm.createContext(sandbox);
vm.runInContext(
  `${appSource.replace(/\nload\(\);\s*$/, "\n")}
state.homepage = homepageData;
state.members = membersData.members;
state.auditedCount = membersData.meta.audited_records || membersData.members.length;
state.committee = committeeData.members;
state.committeeName = committeeData.committee_name;
state.committeeType = committeeData.committee_type || committeeData.committee;
state.committeeHost = committeeData.institutional_host_and_secretariat;
state.contributions = contributionsData.contributions || [];
state.countries = countriesData.countries || [];
state.metrics = metricsData;
state.publications = publicationsData.publications || [];
state.events = eventsData.events || [];
state.news = (newsData.news || []).filter((item) => /^\\d{4}-\\d{2}-\\d{2}$/.test(item.date));
state.affiliations = affiliationsData.affiliations || [];
globalThis.prerender = {
  header, footer, leadershipOverview, foundingCommittee, profile, committeeFaqItems, aboutFaqItems, membershipFaqItems,
  renderRoute(route) {
    location.pathname = route;
    location.href = siteOrigin + route;
    renderedMarkup = "";
    render();
    return { html: document.querySelector("#app").innerHTML, title: document.title };
  },
};
`,
  sandbox,
  { filename: "src/app.js" },
);

const render = sandbox.prerender;
const committee = committeeData.members;
const memberBySlug = new Map(members.map((member) => [member.slug, member]));
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character],
  );
const safeJsonLd = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
const absolute = (route) => `${origin}${route.startsWith("/") ? route : `/${route}`}`;
const cleanRoute = (route) => (route.endsWith("/") ? route : `${route}/`);
const instituteOrganization = {
  "@type": "Organization",
  "@id": instituteId,
  name: siteConfig.parentOrg,
  url: `${origin}/`,
};
const entityOrganization = {
  "@type": "Organization",
  "@id": coalitionId,
  name: siteConfig.siteName,
  url: `${origin}/`,
  description: homepageData.about.body,
  logo: { "@type": "ImageObject", url: `${origin}/assets/atlas-global-south-logo.jpg` },
  sameAs: siteConfig.sameAs,
  parentOrganization: { "@id": instituteId },
};
const websiteEntity = {
  "@type": "WebSite",
  "@id": websiteId,
  url: `${origin}/`,
  name: siteConfig.siteName,
  inLanguage: "en",
  publisher: { "@id": coalitionId },
};

function profileUrl(slug) {
  return absolute(`/members/${encodeURIComponent(slug)}/`);
}

function personEntity(committeeMember, includeProfile = true) {
  const profile = memberBySlug.get(committeeMember.profile_slug);
  const role = committeeMember.designation || committeeMember.responsibility || "Founding Committee member";
  const entity = {
    "@type": "Person",
    "@id": `${profileUrl(committeeMember.profile_slug)}#person`,
    name: committeeMember.full_name,
    url: profileUrl(committeeMember.profile_slug),
    memberOf: { "@id": coalitionId },
  };
  if (profile?.designation) entity.jobTitle = profile.designation;
  const profileProperties = [{
    "@type": "PropertyValue",
    name: "Founding Committee role",
    value: role,
  }];
  if (profile?.institution) {
    const affiliations = profile.institution.split(/\s*;\s*/).filter(Boolean);
    const organizations = affiliations.filter((name) => !/^independent consultant$/i.test(name));
    if (organizations.length) {
      entity.affiliation = organizations.map((name) => ({ "@type": "Organization", name }));
    }
    const nonOrganizationAffiliations = affiliations.filter((name) => !organizations.includes(name));
    if (nonOrganizationAffiliations.length) {
      profileProperties.push({
        "@type": "PropertyValue",
        name: "Professional affiliation listed on the public profile",
        value: nonOrganizationAffiliations.join("; "),
      });
    }
  }
  entity.additionalProperty = profileProperties;
  if (profile?.social_links?.linkedin) entity.sameAs = [profile.social_links.linkedin];
  if (includeProfile && profile?.photo && !profile.photo.startsWith("data:")) {
    entity.image = absolute(profile.photo);
  }
  return entity;
}

function committeeGraph(route, title, description, faqItems) {
  const url = absolute(cleanRoute(route));
  const list = {
    "@type": "ItemList",
    "@id": `${url}#committee-members`,
    name: "Atlas Global South AI Policy Coalition Founding Committee members",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: committee.length,
    itemListElement: committee.map((person, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: personEntity(person),
    })),
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Leadership", item: absolute("/leadership/") },
      { "@type": "ListItem", position: 3, name: "Founding Committee", item: absolute("/leadership/founding-committee/") },
    ],
  };
  const graph = [
    instituteOrganization,
    entityOrganization,
    websiteEntity,
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": coalitionId },
      mainEntity: { "@id": list["@id"] },
      primaryImageOfPage: { "@type": "ImageObject", url: logoUrl },
      breadcrumb: { "@id": breadcrumb["@id"] },
    },
    list,
    breadcrumb,
  ];
  if (faqItems.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      mainEntity: faqItems.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function addVisibleStructuredData(graph, route) {
  const url = absolute(cleanRoute(route));
  const page = graph["@graph"].find((node) => node["@id"] === `${url}#webpage`);
  if (route === "/about/" || route === "/membership/") {
    const items = route === "/about/" ? render.aboutFaqItems() : render.membershipFaqItems();
    graph["@graph"].push({ "@type": "FAQPage", "@id": `${url}#faq`, url, mainEntity: items.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) });
  }
  const memberRegistry = route === "/members/" || route === "/global-members/";
  if (memberRegistry) {
    const list = { "@type": "ItemList", "@id": `${url}#member-registry`, name: "Atlas Global South AI Policy Coalition member registry", numberOfItems: members.length, itemListElement: members.map((member, index) => ({ "@type": "ListItem", position: index + 1, url: profileUrl(member.slug), name: member.full_name })) };
    graph["@graph"].push(list);
    graph["@graph"].push({ "@type": "CollectionPage", "@id": `${url}#collection`, url, name: "Global members", mainEntity: { "@id": list["@id"] } });
    if (page) page.mainEntity = { "@id": list["@id"] };
  }
  const datedNews = (newsData.news || []).find((item) => route === `/news/${String(item.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`);
  const datedEvent = (eventsData.events || []).find((item) => route === `/events/${String(item.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`);
  const item = datedNews || datedEvent;
  if (item && /^\d{4}-\d{2}-\d{2}$/.test(item.date)) graph["@graph"].push({ "@type": datedNews ? "NewsArticle" : "Event", "@id": `${url}#item`, url, name: item.title, headline: datedNews ? item.title : undefined, datePublished: datedNews ? item.date : undefined, startDate: datedEvent ? item.date : undefined, description: item.summary || undefined, location: datedEvent && item.location ? { "@type": "Place", name: item.location } : undefined });
  return graph;
}

function profileGraph(profile, committeeMember, route, title, description) {
  const url = absolute(cleanRoute(route));
  const person = personEntity(committeeMember);
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Members", item: absolute("/members/") },
      { "@type": "ListItem", position: 3, name: profile.full_name, item: url },
    ],
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      instituteOrganization,
      entityOrganization,
      websiteEntity,
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        about: { "@id": coalitionId },
        mainEntity: { "@id": person["@id"] },
        breadcrumb: { "@id": breadcrumb["@id"] },
      },
      person,
      breadcrumb,
    ],
  };
}

function publicPageGraph(route, title, description) {
  const url = absolute(cleanRoute(route));
  const isAbout = route === "/about/";
  const isHome = route === "/";
  const page = {
    "@type": isAbout ? "AboutPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId },
    about: { "@id": coalitionId },
  };
  if (isHome || isAbout) page.mainEntity = { "@id": coalitionId };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` }, ...(isHome ? [] : [{ "@type": "ListItem", position: 2, name: title, item: url }])],
  };
  if (!isHome) page.breadcrumb = { "@id": breadcrumb["@id"] };
  const graph = [instituteOrganization, entityOrganization, websiteEntity, page];
  if (!isHome) graph.push(breadcrumb);
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

const decodeHtml = (value) => String(value ?? "")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const plainText = (html) => decodeHtml(String(html).replace(/<[^>]*>/g, " "))
  .replace(/\s+/g, " ").trim();
function trimDescription(value, limit = 155) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const prefix = text.slice(0, limit - 1);
  const boundary = prefix.lastIndexOf(" ");
  return `${prefix.slice(0, boundary > 90 ? boundary : limit - 1).replace(/[ ,;:.!?-]+$/, "")}…`;
}
function pageDescription(route, html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const paragraphs = [...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => plainText(match[1])).filter((value) => value.length > 30);
  const source = paragraphs[0] || homepageData.about.body;
  return trimDescription(source);
}
function pageKeywords(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const bodyText = plainText(main).toLowerCase();
  const heading = plainText(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "")
    .replace(/[,:;]+/g, " ").replace(/\s+/g, " ").trim();
  const existingTopics = [
    "AI governance", "AI policy", "responsible AI", "international cooperation",
    "global South", "policy research", "membership", "member registry",
    "founding committee", "AI ethics", "institutional capacity", "country engagement",
    "international dialogue", "reader charter", "publication", "events",
  ].filter((term) => bodyText.includes(term.toLowerCase()));
  const keywords = [heading, "Atlas Global South AI Policy Coalition", ...existingTopics]
    .map((term) => term.trim()).filter(Boolean)
    .filter((term, index, all) => all.findIndex((candidate) => candidate.toLowerCase() === term.toLowerCase()) === index)
    .slice(0, 8);
  for (const fallback of ["AI governance", "AI policy"]) {
    if (keywords.length >= 3) break;
    if (!keywords.some((term) => term.toLowerCase() === fallback.toLowerCase())) keywords.push(fallback);
  }
  return keywords;
}
function pageTitle(route, manifestTitle, html) {
  if (route === "/") return `${siteConfig.siteName} | AI Governance`;
  if (route === "/about/") return "About the Coalition | Atlas Global South AI Policy Coalition";
  let base = String(manifestTitle || "").replace(/\s*\|.*$/, "").trim()
    || plainText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "Coalition information");
  const titlePrefixes = {
    "Contact": "Contact the Coalition",
    "Countries": "Coalition Countries",
    "Events": "Coalition Events",
    "Governance": "Coalition Governance",
    "Members": "Coalition Members",
    "Membership": "Coalition Membership",
    "News": "Coalition News",
  };
  base = titlePrefixes[base] || base;
  const suffix = " | Atlas Coalition";
  const maxBase = 59 - suffix.length;
  if (base.length <= maxBase) return `${base}${suffix}`;
  const cropped = base.slice(0, maxBase - 1);
  const boundary = cropped.lastIndexOf(" ");
  return `${cropped.slice(0, boundary > 15 ? boundary : maxBase - 1).trimEnd()}…${suffix}`;
}

function clampTitle(title) {
  const value = String(title || "").trim();
  if (value.length < 60) return value;
  const cropped = value.slice(0, 58);
  const boundary = cropped.lastIndexOf(" ");
  return `${cropped.slice(0, boundary > 20 ? boundary : 58).trimEnd()}…`;
}
function pageDocument({ route, pageRoute = route, title, description, keywords = [], html, graph, image = shareImageUrl }) {
  title = clampTitle(title);
  const canonical = absolute(cleanRoute(route));
  const head = [
    '<!doctype html>',
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="keywords" content="${escapeHtml(keywords.join(", "))}">`,
    googleVerification ? `<meta name="google-site-verification" content="${escapeHtml(googleVerification)}">` : "",
    bingVerification ? `<meta name="msvalidate.01" content="${escapeHtml(bingVerification)}">` : "",
    `<meta name="atlas-prerendered-route" content="${escapeHtml(cleanRoute(pageRoute))}">`,
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    '<meta name="theme-color" content="#0B2447">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="icon" href="/favicon.ico" type="image/x-icon">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    ...locales.map((locale) => `<link rel="alternate" hreflang="${escapeHtml(locale)}" href="${escapeHtml(locale === "en" ? canonical : `${canonical}?lang=${locale}`)}">`),
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(canonical)}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="en_US">',
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:site_name" content="${escapeHtml(siteConfig.siteName)}">`,
    `<meta property="og:image" content="${escapeHtml(image || shareImageUrl)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    '<meta property="og:image:alt" content="Atlas Global South AI Policy Coalition official logo">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image || shareImageUrl)}">`,
    '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;600&amp;family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&amp;display=swap">',
    '<style>html{background:#f6f4ee}body{margin:0;background:#f6f4ee;color:#1c3046;font-family:Inter,Arial,sans-serif}#app{min-height:100vh}</style>',
    '<link rel="stylesheet" href="/src/styles/main.css">',
    `<script type="application/ld+json">${safeJsonLd(graph)}</script>`,
    "</head>",
    "<body>",
    `<div id="app">${html}</div>`,
    '<script type="module">setTimeout(() => import("/src/app.js"), 3000);</script>',
    "</body>",
    "</html>",
  ];
  return head.join("");
}

function validateGraph(graph, route) {
  if (!graph || graph["@context"] !== "https://schema.org" || !Array.isArray(graph["@graph"])) throw new Error(`Invalid JSON-LD graph on ${route}`);
  const coalition = graph["@graph"].find((node) => node["@id"] === coalitionId);
  if (!coalition || coalition["@type"] !== "Organization" || coalition.name !== siteConfig.siteName || coalition.parentOrganization?.["@id"] !== instituteId || JSON.stringify(coalition.sameAs) !== JSON.stringify(siteConfig.sameAs)) throw new Error(`Coalition organization JSON-LD validation failed on ${route}`);
  graph["@graph"].forEach((node) => JSON.stringify(node));
}

const dynamicRoutes = [];
for (const member of members) dynamicRoutes.push({ route: `/members/${member.slug}/`, title: member.full_name });
for (const person of committee) dynamicRoutes.push({ route: `/leadership/${person.profile_slug}/`, title: person.full_name });
for (const item of homepageData.research_tracks || []) dynamicRoutes.push({ route: `/policy-research/${String(item.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`, title: item.title });
for (const item of homepageData.initiatives || []) dynamicRoutes.push({ route: `/initiatives/${String(item.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`, title: item.title });
for (const item of newsData.news || []) if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) dynamicRoutes.push({ route: `/news/${String(item.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`, title: item.title });
for (const item of eventsData.events || []) if (/^\d{4}-\d{2}-\d{2}$/.test(item.date)) dynamicRoutes.push({ route: `/events/${String(item.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`, title: item.title });
const staticRoutes = [...(routesData.routes || [])
  .map(({ path: route, title }) => ({ route: cleanRoute(route), title }))
  .filter(({ route }) => route && !route.includes(":")), ...dynamicRoutes];
const canonicalOverrides = new Map([["/global-members/", "/members/"]]);
const committeeRouteSet = new Set(["/leadership/", "/leadership/founding-committee/"]);
const memberProfileRoutes = new Set(members.map((member) => `/members/${member.slug}/`));
for (const routeInfo of staticRoutes) {
  const { route } = routeInfo;
  const canonicalRoute = canonicalOverrides.get(route) || route;
  const canonicalTitle = staticRoutes.find((entry) => entry.route === canonicalRoute)?.title || routeInfo.title;
  const rendered = render.renderRoute(route);
  const title = pageTitle(route, route === "/global-members/" ? routeInfo.title : canonicalTitle, rendered.html);
  const description = pageDescription(canonicalRoute, rendered.html);
  const faqItems = committeeRouteSet.has(route) ? render.committeeFaqItems() : [];
  const routeMember = route.match(/^\/members\/([^/]+)\/$/) ? memberBySlug.get(route.match(/^\/members\/([^/]+)\/$/)[1]) : route.match(/^\/leadership\/([^/]+)\/$/) ? memberBySlug.get(route.match(/^\/leadership\/([^/]+)\/$/)[1]) : null;
  const routeCommittee = committee.find((person) => person.profile_slug === routeMember?.slug);
  const graph = routeMember
    ? profileGraph(routeMember, routeCommittee || { profile_slug: routeMember.slug, full_name: routeMember.full_name, designation: routeMember.designation || "Coalition member" }, canonicalRoute, title, description)
    : committeeRouteSet.has(route)
      ? committeeGraph(canonicalRoute, title, description, faqItems)
      : publicPageGraph(canonicalRoute, title, description);
  addVisibleStructuredData(graph, canonicalRoute);
  validateGraph(graph, canonicalRoute);
  validateGraph(graph, canonicalRoute);
  validateGraph(graph, canonicalRoute);
  const documentHtml = pageDocument({
    route: canonicalRoute,
    pageRoute: route,
    title,
    description,
    keywords: pageKeywords(rendered.html),
    html: rendered.html,
    graph,
  });
  const outputPath = route === "/"
    ? path.join(outputRoot, "index.html")
    : path.join(outputRoot, route.replace(/^\//, ""), "index.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, documentHtml, "utf8");
}

for (const member of members) {
  const route = `/members/${member.slug}/`;
  const title = clampTitle(`${member.full_name} | ${siteConfig.shortName}`);
  const biography = String(member.biography || "").replace(/\s+/g, " ").trim();
  const description = trimDescription(biography || `${siteConfig.siteName} public member profile for ${member.full_name}.`);
  const image = member.photo ? absolute(member.photo) : shareImageUrl;
  const graph = profileGraph(member, committee.find((entry) => entry.profile_slug === member.slug) || { profile_slug: member.slug, full_name: member.full_name, designation: member.designation || "Coalition member" }, route, title, description);
  const html = `${render.header()}${render.profile(member.slug)}${render.footer()}`;
  validateGraph(graph, route);
  const outputPath = path.join(outputRoot, "members", member.slug, "index.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, pageDocument({ route, title, description, keywords: pageKeywords(html), html, graph, image }), "utf8");
}

for (const committeeMember of committee) {
  const profile = memberBySlug.get(committeeMember.profile_slug);
  if (!profile) throw new Error(`No public member record for ${committeeMember.profile_slug}`);
  const route = `/members/${profile.slug}/`;
  const title = clampTitle(`${profile.full_name} | Founding Committee`);
  const biography = String(profile.biography || "").replace(/\s+/g, " ").trim();
  const descriptionLead = "Founding Committee member of the Atlas Global South AI Policy Coalition. ";
  const excerptLength = Math.max(0, 150 - descriptionLead.length);
  const excerpt = biography.slice(0, excerptLength).replace(/[\s,;:.!?-]+$/, "");
  const description = `${descriptionLead}${excerpt}${biography.length > excerpt.length ? "…" : ""}`;
  const image = profile.photo ? absolute(profile.photo) : logoUrl;
  const graph = profileGraph(profile, committeeMember, route, title, description);
  const html = `${render.header()}${render.profile(profile.slug)}${render.footer()}`;
  validateGraph(graph, route);
  const outputPath = path.join(outputRoot, "members", profile.slug, "index.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, pageDocument({ route, title, description, keywords: pageKeywords(html), html, graph, image }), "utf8");
}

const sitemapRoutes = new Set(staticRoutes.map(({ route }) => route).filter((route) => !canonicalOverrides.has(route)));
for (const member of committee) sitemapRoutes.add(`/members/${member.profile_slug}/`);
const latestContentDate = [
  ...members.map((member) => member.updated_at || member.created_at),
  ...(newsData.news || []).map((item) => item.date),
  ...(eventsData.events || []).map((item) => item.date),
].filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(String(date))).sort().at(-1) || "2026-11-15";
const memberDates = new Map(members.map((member) => [`/members/${member.slug}/`, member.updated_at || member.created_at || latestContentDate]));
const sitemapEntries = [...sitemapRoutes]
  .sort((left, right) => left.localeCompare(right))
  .map((route) => {
    const lastmod = memberDates.get(route) || latestContentDate;
    const loc = absolute(route);
    const alternates = [...locales, "x-default"].map((locale) => `    <xhtml:link rel="alternate" hreflang="${escapeHtml(locale)}" href="${escapeHtml(locale === "en" || locale === "x-default" ? loc : `${loc}?lang=${locale}`)}"/>`).join("\n");
    return `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <lastmod>${escapeHtml(lastmod)}</lastmod>\n${alternates}\n  </url>`;
  })
  .join("\n");
await writeFile(
  path.join(outputRoot, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`,
  "utf8",
);
await writeFile(
  path.join(outputRoot, "robots.txt"),
  `# Explicit crawler policy: public pages are crawlable; APIs are not.\n# Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended and CCBot may crawl public pages.\nUser-agent: *\nAllow: /\nDisallow: /api/*\nSitemap: ${origin}/sitemap.xml\n`,
  "utf8",
);

console.log(`SEO static pages generated: ${staticRoutes.length} route files, including ${members.length} member profiles and data-backed detail pages.`);
console.log(`Sitemap URLs: ${sitemapRoutes.size}; canonical origin: ${origin}; robots.txt allows public crawling.`);
console.log(`All member profiles generated: ${members.length}; default share image: ${shareImageUrl}`);
