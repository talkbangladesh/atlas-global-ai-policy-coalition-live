import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(projectRoot, "dist");
const origin = "https://coalition.atlasai.institute";
const sameAs = [
  "https://www.linkedin.com/showcase/atlas-global-south-ai-policy-coalition/",
  "https://www.linkedin.com/company/atlas-ai-institute/",
  "https://www.facebook.com/share/1DWmocBb8U/",
];
const errors = [];
const warnings = [];
const info = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const htmlFiles = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
function routeFor(file) {
  const relative = path.relative(distRoot, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  return `/${relative.replace(/\/index\.html$/, "")}/`.replaceAll("//", "/");
}
function decodeEntities(value) {
  return String(value || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function textOf(match) { return decodeEntities(match?.[1]?.replace(/\s+/g, " ").trim() || ""); }
function attr(tag, name) { return tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"))?.[1] || ""; }
function routeFile(route) {
  const clean = route.split("?")[0].split("#")[0] || "/";
  if (clean === "/") return path.join(distRoot, "index.html");
  if (clean.endsWith("/")) return path.join(distRoot, clean.slice(1), "index.html");
  return path.join(distRoot, clean.slice(1));
}
function canonicalFor(route) { return `${origin}${route === "/" ? "/" : route}`; }

await walk(distRoot);
const pages = htmlFiles.filter((file) => !file.endsWith("/404.html") && !file.endsWith("/google343e8e6554f1798d.html"));
const titleMap = new Map();
const descriptionMap = new Map();
const sitemap = await readFile(path.join(distRoot, "sitemap.xml"), "utf8").catch(() => "");
const sitemapLocs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
if (!sitemap) fail("Missing dist/sitemap.xml");
for (const file of pages) {
  const html = await readFile(file, "utf8");
  const route = routeFor(file);
  const canonicalRoute = route === "/global-members/" ? "/members/" : route;
  const title = textOf(html.match(/<title>([\s\S]*?)<\/title>/i));
  const description = decodeEntities(attr(html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] || "", "content"));
  if (!title) fail(`${route}: missing title`);
  if (!description) fail(`${route}: missing meta description`);
  if (title.length > 60) fail(`${route}: title exceeds 60 characters (${title.length})`);
  if (description.length > 160) fail(`${route}: description exceeds 160 characters (${description.length})`);
  if (title) titleMap.set(title, [...(titleMap.get(title) || []), route]);
  if (description) descriptionMap.set(description, [...(descriptionMap.get(description) || []), route]);
  const canonical = attr(html.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0] || "", "href");
  const expected = canonicalFor(canonicalRoute);
  if (canonical !== expected) fail(`${route}: canonical is ${canonical || "missing"}; expected ${expected}`);
  if (html.match(/<h1\b/gi)?.length !== 1) fail(`${route}: expected exactly one H1`);
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) if (!attr(tag, "alt").trim()) fail(`${route}: image missing alt text`);
  for (const tag of html.match(/<a\b[^>]*>/gi) || []) {
    const href = attr(tag, "href").trim();
    if (!href || /^(?:#|mailto:|tel:|javascript:|https?:\/\/|\/\/)/i.test(href)) continue;
    const target = routeFile(href);
    try { await readFile(target); } catch { fail(`${route}: broken internal link ${href}`); }
  }
  const alternates = [...html.matchAll(/<link\s+rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*>/gi)].map((match) => ({ lang: match[1], href: attr(match[0], "href") }));
  const required = new Map([["en", expected], ["x-default", expected], ["es", `${expected}?lang=es`], ["fr", `${expected}?lang=fr`], ["ar", `${expected}?lang=ar`]]);
  for (const [lang, href] of required) if (!alternates.some((item) => item.lang === lang && item.href === href)) fail(`${route}: missing/non-reciprocal ${lang} hreflang`);
  const ldScripts = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (!ldScripts.length) fail(`${route}: missing JSON-LD`);
  for (const match of ldScripts) {
    try {
      const graph = JSON.parse(match[1]);
      if (graph["@context"] !== "https://schema.org" || !Array.isArray(graph["@graph"])) fail(`${route}: invalid JSON-LD graph shape`);
      const coalition = graph["@graph"]?.find((node) => node["@id"] === `${origin}/#organization`);
      if (!coalition || JSON.stringify(coalition.sameAs) !== JSON.stringify(sameAs)) fail(`${route}: Coalition JSON-LD organization/sameAs mismatch`);
    } catch (error) { fail(`${route}: invalid JSON-LD (${error.message})`); }
  }
  const canonicalUrl = canonicalFor(canonicalRoute);
  if (!sitemapLocs.has(canonicalUrl)) fail(`${route}: missing from sitemap`);
}
for (const [title, routes] of titleMap) if (routes.length > 1) fail(`duplicate title "${title}" on ${routes.join(", ")}`);
for (const [description, routes] of descriptionMap) if (routes.length > 1) warn(`duplicate description on ${routes.join(", ")}`);
for (const requiredFile of ["robots.txt", "llms.txt", "llms-full.txt"]) {
  try { await readFile(path.join(distRoot, requiredFile)); } catch { fail(`missing dist/${requiredFile}`); }
}
const robots = await readFile(path.join(distRoot, "robots.txt"), "utf8").catch(() => "");
for (const crawler of ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"]) if (!robots.includes(crawler)) fail(`robots.txt missing crawler policy mention: ${crawler}`);
info.push(`${pages.length} HTML pages checked`);
info.push(`${sitemapLocs.size} sitemap URLs found`);
info.push(`${htmlFiles.length - pages.length} non-page HTML files excluded (404/verification)`);
console.log("SEO AUDIT");
console.log("=========");
for (const line of info) console.log(`INFO  ${line}`);
for (const line of warnings) console.log(`WARN  ${line}`);
if (errors.length) {
  for (const line of errors) console.error(`FAIL  ${line}`);
  console.error(`\nSEO AUDIT FAILED: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exitCode = 1;
} else {
  console.log(`PASS  SEO AUDIT PASSED: 0 errors, ${warnings.length} warning(s).`);
}
