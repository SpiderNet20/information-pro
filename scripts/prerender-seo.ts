import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_POSTS, INITIAL_CATEGORIES } from '../src/data/posts.ts';
import { DOWNLOAD_APPS } from '../src/data/downloadsApps.ts';
import { SITE_TOOLS } from '../src/data/toolsData.ts';
import { injectServerSideSeo, renderNotFoundHtml } from '../src/utils/seo.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const templatePath = path.join(distDir, 'index.html');

function writeHtmlFile(relFilePath: string, htmlContent: string) {
  const fullPath = path.join(distDir, relFilePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, htmlContent, 'utf-8');
}

function runPrerender() {
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf-8');
  let generatedCount = 0;

  // 1. Pre-render Home Page (dist/index.html)
  const homeHtml = injectServerSideSeo(baseTemplate, '/');
  writeHtmlFile('index.html', homeHtml);
  generatedCount++;

  // 2. Pre-render 404 Page (dist/404.html)
  const notFoundHtml = renderNotFoundHtml(baseTemplate);
  writeHtmlFile('404.html', notFoundHtml);
  generatedCount++;

  // 3. Pre-render Standalone Pages (/about, /contact, /privacy, /terms, /sitemap)
  const standalonePages = ['about', 'contact', 'privacy', 'terms', 'sitemap'];
  for (const sp of standalonePages) {
    const spHtml = injectServerSideSeo(baseTemplate, `/${sp}`);
    writeHtmlFile(`${sp}/index.html`, spHtml);
    writeHtmlFile(`${sp}.html`, spHtml);
    generatedCount += 2;
  }

  // 4. Pre-render Category Pages (original case + lowercase)
  const categorySlugs = new Set<string>([
    ...INITIAL_CATEGORIES.map((c) => c.slug),
    ...INITIAL_POSTS.map((p) => p.categorySlug),
    'Downloads',
    'Blog',
    'AI',
    'Business',
    'Games',
    'Software',
    'Education',
  ]);

  for (const catSlug of categorySlugs) {
    const catHtml = injectServerSideSeo(baseTemplate, `/${catSlug}/`);
    writeHtmlFile(`${catSlug}/index.html`, catHtml);
    generatedCount++;

    const lowerCat = catSlug.toLowerCase();
    if (lowerCat !== catSlug) {
      writeHtmlFile(`${lowerCat}/index.html`, catHtml);
      generatedCount++;
    }
  }

  // 5. Pre-render AI Sub-Section Pages
  const aiSubs = ['Tools', 'Downloads', 'Earning', 'Tools-Comparison'];
  for (const sub of aiSubs) {
    const subHtml = injectServerSideSeo(baseTemplate, `/AI/${sub}/`);
    writeHtmlFile(`AI/${sub}/index.html`, subHtml);
    writeHtmlFile(`ai/${sub.toLowerCase()}/index.html`, subHtml);
    generatedCount += 2;
  }

  // 6. Pre-render Tools Index (/tools/) & All 9 Individual Tools (/tools/:slug)
  const toolsIndexHtml = injectServerSideSeo(baseTemplate, '/tools/');
  writeHtmlFile('tools/index.html', toolsIndexHtml);
  writeHtmlFile('Tools/index.html', toolsIndexHtml);
  generatedCount += 2;

  for (const tool of SITE_TOOLS) {
    const toolHtml = injectServerSideSeo(baseTemplate, tool.path);
    const relToolPath = tool.path.replace(/^\/+|\/+$/g, '');
    writeHtmlFile(`${relToolPath}/index.html`, toolHtml);
    writeHtmlFile(`${relToolPath}.html`, toolHtml);
    generatedCount += 2;

    const lowerRelToolPath = relToolPath.toLowerCase();
    if (lowerRelToolPath !== relToolPath) {
      writeHtmlFile(`${lowerRelToolPath}/index.html`, toolHtml);
      writeHtmlFile(`${lowerRelToolPath}.html`, toolHtml);
      generatedCount += 2;
    }
  }

  // 7. Pre-render Dedicated App Download Pages (/Downloads/:slug)
  for (const app of DOWNLOAD_APPS) {
    const appPath = `/Downloads/${app.slug}`;
    const appHtml = injectServerSideSeo(baseTemplate, appPath);
    writeHtmlFile(`Downloads/${app.slug}/index.html`, appHtml);
    writeHtmlFile(`Downloads/${app.slug}.html`, appHtml);
    writeHtmlFile(`downloads/${app.slug.toLowerCase()}/index.html`, appHtml);
    generatedCount += 3;
  }

  // 8. Pre-render All Article Pages (/<categorySlug>/<slug>, lowercase, .html, and direct /<slug>)
  for (const post of INITIAL_POSTS) {
    const canonicalRoute = `/${post.categorySlug}/${post.slug}`;
    const postHtml = injectServerSideSeo(baseTemplate, canonicalRoute);

    // Canonical path directory index & .html
    writeHtmlFile(`${post.categorySlug}/${post.slug}/index.html`, postHtml);
    writeHtmlFile(`${post.categorySlug}/${post.slug}.html`, postHtml);
    generatedCount += 2;

    // Lowercase category + slug variant
    const lowerCat = post.categorySlug.toLowerCase();
    const lowerSlug = post.slug.toLowerCase();
    if (lowerCat !== post.categorySlug || lowerSlug !== post.slug) {
      writeHtmlFile(`${lowerCat}/${lowerSlug}/index.html`, postHtml);
      writeHtmlFile(`${lowerCat}/${lowerSlug}.html`, postHtml);
      generatedCount += 2;
    }

    // Direct single-segment /<slug>/index.html fallback
    writeHtmlFile(`${post.slug}/index.html`, postHtml);
    generatedCount++;
  }

  console.log(
    `[SEO Prerender] Successfully generated ${generatedCount} static HTML files with unique OpenGraph, Twitter Card, and Schema.org metadata in dist/`
  );
}

runPrerender();
