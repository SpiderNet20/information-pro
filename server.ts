import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { INITIAL_POSTS, INITIAL_CATEGORIES } from './src/data/posts.ts';
import { DOWNLOAD_APPS } from './src/data/downloadsApps.ts';
import { SITE_TOOLS } from './src/data/toolsData.ts';
import {
  injectServerSideSeo,
  isKnownRoute,
  renderNotFoundHtml,
  resolvePageMetadata,
  getDownloadsCollectionSchema,
  getFullAppGraphSchema,
  registerSeoCacheInvalidator,
} from './src/utils/seo.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const domain = 'https://www.information-net.com';

const AI_SUB_SECTION_PATHS = [
  '/AI/Tools/',
  '/AI/Downloads/',
  '/AI/Earning/',
  '/AI/Tools-Comparison/',
];

async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // --- Sitemap Logic ---

  const getSitemapHeader = () => `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const getSitemapFooter = () => `</urlset>`;

  const formatDate = (dateStr?: string) => {
    try {
      if (!dateStr) return new Date().toISOString().split('T')[0];
      const date = new Date(dateStr);
      return isNaN(date.getTime())
        ? new Date().toISOString().split('T')[0]
        : date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  // 0. Explicit /ads.txt route (text/plain, never redirected to index.html)
  app.get('/ads.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send('google.com, pub-4007921870267373, DIRECT, f08c47fec0942fa0\n');
  });

  // 1. sitemap_index.xml
  app.get('/sitemap_index.xml', (req, res) => {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    const today = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${domain}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-downloads.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-services.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
    res.send(xml);
  });

  // 2. sitemap.xml (Comprehensive - Home + Categories + AI Sub-sections + App Download Pages + Standalone Pages + Posts)
  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    const today = new Date().toISOString().split('T')[0];
    let xml = getSitemapHeader();

    // Add Home
    xml += `
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Add Main Categories (including /Downloads/)
    INITIAL_CATEGORIES.forEach((cat) => {
      const priority = cat.slug === 'Downloads' ? '0.95' : '0.9';
      xml += `
  <url>
    <loc>${domain}/${cat.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    // Add AI Sub-sections
    AI_SUB_SECTION_PATHS.forEach((subPath) => {
      xml += `
  <url>
    <loc>${domain}${subPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    });

    // Add Dedicated App Download Pages (/Downloads/pubg-mobile, /Downloads/football-league-2026)
    DOWNLOAD_APPS.forEach((appItem) => {
      xml += `
  <url>
    <loc>${domain}/Downloads/${appItem.slug}</loc>
    <lastmod>${formatDate(appItem.updateDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // Add Tools Directory & All 9 Interactive Tools (/tools/ and /tools/<slug>)
    xml += `
  <url>
    <loc>${domain}/tools/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.92</priority>
  </url>`;
    SITE_TOOLS.forEach((toolItem) => {
      xml += `
  <url>
    <loc>${domain}${toolItem.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    // Add Standalone Statutory Pages
    const standalonePages = ['about', 'contact', 'privacy', 'terms', 'sitemap'];
    standalonePages.forEach((page) => {
      xml += `
  <url>
    <loc>${domain}/${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add Posts
    INITIAL_POSTS.forEach((post) => {
      xml += `
  <url>
    <loc>${domain}/${post.categorySlug}/${post.slug}</loc>
    <lastmod>${formatDate(post.isoDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    });

    xml += getSitemapFooter();
    res.send(xml);
  });

  // 3. sitemap-downloads.xml (Dedicated Sitemap for /Downloads/ and all App Download Pages)
  app.get('/sitemap-downloads.xml', (req, res) => {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    const today = new Date().toISOString().split('T')[0];
    let xml = getSitemapHeader();
    xml += `
  <url>
    <loc>${domain}/Downloads/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`;
    DOWNLOAD_APPS.forEach((appItem) => {
      xml += `
  <url>
    <loc>${domain}/Downloads/${appItem.slug}</loc>
    <lastmod>${formatDate(appItem.updateDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });
    xml += getSitemapFooter();
    res.send(xml);
  });

  // 4. sitemap-blog.xml
  app.get('/sitemap-blog.xml', (req, res) => {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    let xml = getSitemapHeader();
    INITIAL_POSTS.forEach((post) => {
      xml += `
  <url>
    <loc>${domain}/${post.categorySlug}/${post.slug}</loc>
    <lastmod>${formatDate(post.isoDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    });
    xml += getSitemapFooter();
    res.send(xml);
  });

  // 5. sitemap-services.xml
  app.get('/sitemap-services.xml', (req, res) => {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    const today = new Date().toISOString().split('T')[0];
    let xml = getSitemapHeader();
    INITIAL_CATEGORIES.forEach((cat) => {
      xml += `
  <url>
    <loc>${domain}/${cat.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    });
    AI_SUB_SECTION_PATHS.forEach((subPath) => {
      xml += `
  <url>
    <loc>${domain}${subPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    DOWNLOAD_APPS.forEach((appItem) => {
      xml += `
  <url>
    <loc>${domain}/Downloads/${appItem.slug}</loc>
    <lastmod>${formatDate(appItem.updateDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });
    xml += `
  <url>
    <loc>${domain}/tools/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.92</priority>
  </url>`;
    SITE_TOOLS.forEach((toolItem) => {
      xml += `
  <url>
    <loc>${domain}${toolItem.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });
    xml += getSitemapFooter();
    res.send(xml);
  });

  // 6. sitemap-pages.xml
  app.get('/sitemap-pages.xml', (req, res) => {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    const today = new Date().toISOString().split('T')[0];
    const pages = ['about', 'contact', 'privacy', 'terms', 'sitemap'];
    let xml = getSitemapHeader();
    pages.forEach((page) => {
      xml += `
  <url>
    <loc>${domain}/${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    xml += getSitemapFooter();
    res.send(xml);
  });

  // 7. Dedicated Application Schema JSON-LD files (/Downloads/schema.json & /Downloads/:appSlug/schema.json)
  app.get(['/Downloads/schema.json', '/schemas/apps.schema.json'], (req, res) => {
    res.header('Content-Type', 'application/ld+json; charset=utf-8');
    res.send(JSON.stringify(getDownloadsCollectionSchema(), null, 2));
  });

  app.get(
    ['/Downloads/:appSlug/schema.json', '/schemas/:appSlug.schema.json'],
    (req, res) => {
      const slug = (req.params.appSlug || '').toLowerCase();
      const matchedApp = DOWNLOAD_APPS.find(
        (a) => a.slug.toLowerCase() === slug
      );
      if (!matchedApp) {
        return res.status(404).json({ error: 'App schema not found' });
      }
      res.header('Content-Type', 'application/ld+json; charset=utf-8');
      return res.send(JSON.stringify(getFullAppGraphSchema(matchedApp), null, 2));
    }
  );

  // 8. Interactive Tools API Endpoints (/api/tools/*)
  app.get('/api/tools/speedtest/ping', (_req, res) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    res.json({ ok: true, ts: Date.now() });
  });

  const speedBufferUnit = Buffer.alloc(65536, 0x5a);
  app.get('/api/tools/speedtest/download', (req, res) => {
    const requestedBytes = Number(req.query.bytes) || 2_000_000;
    const totalBytes = Math.min(12_000_000, Math.max(65_536, requestedBytes));
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(totalBytes),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    });

    let sent = 0;
    const writeChunk = () => {
      let canContinue = true;
      while (sent < totalBytes && canContinue) {
        const remaining = totalBytes - sent;
        const slice =
          remaining >= speedBufferUnit.length
            ? speedBufferUnit
            : speedBufferUnit.subarray(0, remaining);
        sent += slice.length;
        if (sent >= totalBytes) {
          res.end(slice);
          return;
        }
        canContinue = res.write(slice);
      }
      if (sent < totalBytes) {
        res.once('drain', writeChunk);
      }
    };
    writeChunk();
  });

  app.post('/api/tools/speedtest/upload', (req, res) => {
    let receivedBytes = 0;
    req.on('data', (chunk: Buffer) => {
      receivedBytes += chunk.length;
    });
    req.on('end', () => {
      res.set('Cache-Control', 'no-store');
      res.json({ ok: true, receivedBytes, ts: Date.now() });
    });
    req.on('error', () => {
      res.status(500).json({ ok: false, error: 'Upload stream error' });
    });
  });

  app.post('/api/tools/video-inspect', express.json(), async (req, res) => {
    try {
      const platform = String(req.body?.platform || '').toLowerCase();
      const rawUrl = String(req.body?.url || '').trim();
      if (!rawUrl) {
        return res.status(400).json({ ok: false, error: 'يرجى إدخال رابط الفيديو أولاً.' });
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      } catch {
        return res.status(400).json({ ok: false, error: 'صيغة الرابط غير صالحة.' });
      }

      const decodeMetaContent = (val?: string) =>
        (val || '')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
          .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
          .trim();

      if (platform === 'youtube') {
        const host = parsedUrl.hostname.toLowerCase();
        if (!host.includes('youtube.com') && !host.includes('youtu.be')) {
          return res.status(400).json({
            ok: false,
            error: 'الرابط المدخل ليس رابط يوتيوب صالحاً.',
          });
        }

        let videoId: string | null = null;
        let isShorts = false;
        if (host.includes('youtu.be')) {
          videoId = parsedUrl.pathname.replace(/^\/+/, '').split('/')[0] || null;
        } else if (parsedUrl.pathname.startsWith('/shorts/')) {
          videoId = parsedUrl.pathname.replace('/shorts/', '').split('/')[0] || null;
          isShorts = true;
        } else if (parsedUrl.pathname.startsWith('/embed/')) {
          videoId = parsedUrl.pathname.replace('/embed/', '').split('/')[0] || null;
        } else {
          videoId = parsedUrl.searchParams.get('v');
        }

        if (!videoId || !/^[a-zA-Z0-9_-]{6,15}$/.test(videoId)) {
          return res.status(400).json({
            ok: false,
            error: 'لم يتم العثور على معرف فيديو يوتيوب (Video ID) صالح داخل هذا الرابط.',
          });
        }

        const canonicalWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const oembedEndpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
          canonicalWatchUrl
        )}&format=json`;

        const oembedRes = await fetch(oembedEndpoint, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InformationNetBot/1.0)' },
        });

        if (!oembedRes.ok) {
          return res.json({
            ok: true,
            platform: 'youtube',
            normalizedUrl: canonicalWatchUrl,
            contentId: videoId,
            contentTypeLabel: isShorts ? 'فيديو يوتيوب قصير (YouTube Shorts)' : 'فيديو يوتيوب قياسي',
            publicStatus: 'restricted_or_login_required',
            statusSummary: 'الفيديو غير متاح للعامة أو تم تقييد تضمينه من قِبل صاحب القناة.',
            technicalReason:
              'أعادت واجهة YouTube oEmbed الرسمية أن هذا الفيديو خاص أو غير مدرج أو محذوف.',
            officialDownloadSteps: [
              'تأكد من أن رابط الفيديو عام (Public) وليس خاصاً.',
              'يمكنك حفظ الفيديوهات للمشاهدة دون إنترنت عبر ميزة التنزيل المدمجة داخل تطبيق YouTube الرسمي للهواتف.',
            ],
          });
        }

        const oembedData: any = await oembedRes.json();
        return res.json({
          ok: true,
          platform: 'youtube',
          normalizedUrl: canonicalWatchUrl,
          contentId: videoId,
          contentTypeLabel: isShorts ? 'فيديو يوتيوب قصير (YouTube Shorts)' : 'فيديو يوتيوب عام (YouTube Video)',
          publicStatus: 'available_metadata',
          statusSummary: 'تم التحقق من الفيديو وجلب بياناته الرسمية بنجاح عبر YouTube oEmbed.',
          title: oembedData.title,
          authorName: oembedData.author_name,
          authorUrl: oembedData.author_url,
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          altThumbnails: [
            {
              label: 'صورة مصغرة فائقة الدقة MaxRes',
              url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
              resolution: '1280×720',
            },
            {
              label: 'صورة مصغرة عالية الجودة HQ',
              url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              resolution: '480×360',
            },
            {
              label: 'صورة مصغرة متوسطة MQ',
              url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
              resolution: '320×180',
            },
          ],
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          directVideoUrl: null,
          technicalReason:
            'تمنع شروط خدمة YouTube استخراج ملفات البث الخام (MP4/WebM) خارج تطبيقاتها الرسمية. يمكنك تنزيل الصور المصغرة الرسمية أعلاه أو استخدام الميزة الرسمية في تطبيق يوتيوب.',
          officialDownloadSteps: [
            'لتنزيل الصورة المصغرة عالية الدقة: اضغط على أحد أزرار الدقة المتاحة أعلاه (1280×720 أو 480×360).',
            'لمشاهدة الفيديو بدون إنترنت قانونياً: افتح الفيديو في تطبيق YouTube الرسمي على هاتفك واضغط على زر «تنزيل» (Download) أسفل المشغل.',
            'إذا كنت مالك القناة: يمكنك تنزيل ملف MP4 الأصلي مباشرة من لوحة تحكم YouTube Studio.',
          ],
        });
      }

      if (platform === 'facebook' || platform === 'instagram') {
        const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
        let contentId: string | null = parsedUrl.searchParams.get('v') || null;
        let contentTypeLabel =
          platform === 'facebook' ? 'منشور فيديو فيسبوك' : 'منشور أو مقطع إنستغرام';

        if (platform === 'facebook') {
          if (parsedUrl.pathname.includes('/reel/')) {
            contentTypeLabel = 'مقطع فيسبوك ريلز (Facebook Reel)';
            contentId = pathParts[pathParts.indexOf('reel') + 1] || contentId;
          } else if (parsedUrl.pathname.includes('/videos/')) {
            contentTypeLabel = 'فيديو فيسبوك عام (Facebook Video)';
            contentId = pathParts[pathParts.indexOf('videos') + 1] || contentId;
          } else if (parsedUrl.pathname.includes('/watch')) {
            contentTypeLabel = 'فيديو Facebook Watch';
          }
        } else {
          if (parsedUrl.pathname.includes('/reel/') || parsedUrl.pathname.includes('/reels/')) {
            contentTypeLabel = 'مقطع إنستغرام ريلز (Instagram Reel)';
            const idx = pathParts.findIndex((p) => p === 'reel' || p === 'reels');
            contentId = pathParts[idx + 1] || null;
          } else if (parsedUrl.pathname.includes('/p/')) {
            contentTypeLabel = 'منشور إنستغرام (Instagram Post)';
            contentId = pathParts[pathParts.indexOf('p') + 1] || null;
          } else if (parsedUrl.pathname.includes('/tv/')) {
            contentTypeLabel = 'فيديو IGTV إنستغرام';
            contentId = pathParts[pathParts.indexOf('tv') + 1] || null;
          }
        }

        let ogTitle = '';
        let ogImage = '';
        let ogVideo = '';

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4500);
          const pageRes = await fetch(parsedUrl.toString(), {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml',
            },
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (pageRes.ok) {
            const html = await pageRes.text();
            const titleMatch =
              html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
              html.match(/<title[^>]*>([^<]+)<\/title>/i);
            const imgMatch = html.match(
              /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
            );
            const vidMatch = html.match(
              /<meta[^>]+property=["'](?:og:video:secure_url|og:video:url|og:video)["'][^>]+content=["']([^"']+)["']/i
            );

            if (titleMatch?.[1]) ogTitle = decodeMetaContent(titleMatch[1]);
            if (imgMatch?.[1]) ogImage = decodeMetaContent(imgMatch[1]);
            if (vidMatch?.[1]) ogVideo = decodeMetaContent(vidMatch[1]);
          }
        } catch {
          // Network or anti-bot wall encountered; handled transparently below
        }

        if (ogVideo && ogVideo.startsWith('https://')) {
          return res.json({
            ok: true,
            platform,
            normalizedUrl: parsedUrl.toString(),
            contentId,
            contentTypeLabel,
            publicStatus: 'direct_media_available',
            statusSummary: 'تم العثور على رابط وسائط عام ومباشر في البيانات الوصفية للمنشور.',
            title: ogTitle || contentTypeLabel,
            thumbnailUrl: ogImage || undefined,
            directVideoUrl: ogVideo,
            officialDownloadSteps: [
              'اضغط على زر «تنزيل ملف الفيديو العام المباشر» لمعاينة وحفظ الفيديو.',
              'تأكد دائماً من احترام حقوق الملكية الفكرية للناشر الأصلي عند إعادة الاستخدام.',
            ],
          });
        }

        return res.json({
          ok: true,
          platform,
          normalizedUrl: parsedUrl.toString(),
          contentId,
          contentTypeLabel,
          publicStatus: ogTitle || ogImage ? 'available_metadata' : 'restricted_or_login_required',
          statusSummary:
            ogTitle || ogImage
              ? 'تم التحقق من صحة الرابط وجلب بياناته الوصفية العامة، لكن ملف الفيديو المباشر محمي ببث مقسم أو يتطلب الجلسة الرسمية.'
              : 'صيغة الرابط صحيحة، لكن المنصة تشترط تسجيل الدخول أو تقيد الوصول الخارجي المباشر لملف الفيديو.',
          title: ogTitle || `${contentTypeLabel}${contentId ? ` (${contentId})` : ''}`,
          thumbnailUrl: ogImage || undefined,
          directVideoUrl: null,
          technicalReason:
            platform === 'facebook'
              ? 'يستخدم فيسبوك تقنية البث المقسم (DASH) ويقيد الوصول المباشر لملفات MP4 خارج المنصة لحماية خصوصية الناشرين.'
              : 'تفرض منصة إنستغرام حماية على روابط الوسائط المباشرة وتقصر تنزيل مقاطع Reels على الميزة الرسمية داخل التطبيق عندما يسمح صانع المحتوى بذلك.',
          officialDownloadSteps:
            platform === 'facebook'
              ? [
                  'افتح الفيديو داخل تطبيق أو موقع فيسبوك الرسمي واضغط على قائمة النقاط الثلاث (•••) ثم اختر «حفظ الفيديو» (Save Video) للرجوع إليه في أي وقت.',
                  'إذا كان الفيديو منشوراً بواسطة صفحتك الخاصة، يمكنك تنزيله بجودته الأصلية من خلال Meta Business Suite.',
                ]
              : [
                  'لتنزيل مقاطع Reels العامة المسموح بها: افتح المقطع في تطبيق Instagram الرسمي، اضغط على أيقونة المشاركة (Share)، ثم اختر «تنزيل» (Download).',
                  'لحفظ أي منشور أو فيديو في حسابك: اضغط على أيقونة العلامة المرجعية (Bookmark) أسفل المنشور لإضافته إلى المحفوظات (Saved).',
                ],
        });
      }

      return res.status(400).json({ ok: false, error: 'المنصة المطلوبة غير مدعومة.' });
    } catch {
      return res.status(500).json({ ok: false, error: 'حدث خطأ غير متوقع أثناء فحص الرابط.' });
    }
  });

  // --- SSR Memory Cache for Fast Response on Most-Visited Articles ---
  interface SsrCacheEntry {
    html: string;
    status: number;
    cachedAt: number;
    expiresAt: number;
    hits: number;
  }

  const MAX_SSR_CACHE_SIZE = 200;
  const STANDARD_TTL_MS = isProd ? 5 * 60 * 1000 : 60 * 1000; // 5m prod, 1m dev
  const POPULAR_ARTICLE_TTL_MS = isProd ? 15 * 60 * 1000 : 3 * 60 * 1000; // 15m prod, 3m dev
  const POPULAR_HIT_THRESHOLD = 3;

  const ssrMemoryCache = new Map<string, SsrCacheEntry>();
  const routeHitCounts = new Map<string, number>();
  let cachedProdTemplateHtml: string | null = null;

  registerSeoCacheInvalidator(() => {
    ssrMemoryCache.clear();
  });

  // --- Open Graph / Social Crawler Verification Endpoint ---
  app.get('/api/seo/og-preview', (req, res) => {
    const targetPath = String(req.query.path || req.query.url || '/');
    let cleanPath = targetPath;
    if (/^https?:\/\//i.test(cleanPath)) {
      try {
        const u = new URL(cleanPath);
        cleanPath = u.pathname + u.search;
      } catch {
        // keep as is
      }
    }
    const meta = resolvePageMetadata(cleanPath);
    res.json({
      ok: true,
      requestedPath: cleanPath,
      status: meta.status,
      pageKind: meta.pageKind,
      title: meta.title,
      description: meta.description,
      canonical: meta.canonical,
      openGraph: {
        'og:type': meta.ogType,
        'og:title': meta.ogTitle,
        'og:description': meta.ogDescription,
        'og:url': meta.ogUrl,
        'og:image': meta.ogImage,
        'og:image:secure_url': meta.ogImage,
        'og:image:alt': meta.ogImageAlt,
        'og:site_name': meta.ogSiteName,
        'og:locale': meta.ogLocale,
      },
      twitter: {
        'twitter:card': meta.twitterCard,
        'twitter:title': meta.twitterTitle,
        'twitter:description': meta.twitterDescription,
        'twitter:image': meta.twitterImage,
        'twitter:site': meta.twitterSite,
      },
    });
  });

  const normalizeCacheKey = (rawUrl: string): string => {
    const [pathRaw, queryAndHash = ''] = (rawUrl || '/').split('?');
    let pathname = pathRaw.split('#')[0].trim();
    try {
      pathname = decodeURIComponent(pathname);
    } catch {
      // ignore malformed percent encoding
    }
    pathname = pathname
      .replace(/\/index\.html?$/i, '')
      .replace(/\.html?$/i, '')
      .replace(/\/+$/, '');
    if (!pathname) pathname = '/';

    const queryStr = queryAndHash.split('#')[0] || '';
    if (queryStr) {
      try {
        const params = new URLSearchParams(queryStr);
        const postParam =
          params.get('post') ||
          params.get('slug') ||
          params.get('article') ||
          params.get('p');
        if (postParam) {
          return `${pathname.toLowerCase()}?post=${postParam.trim().toLowerCase()}`;
        }
      } catch {
        // ignore
      }
    }
    return pathname === '/' ? '/' : pathname.toLowerCase();
  };

  const getCachedSsrHtml = (key: string): SsrCacheEntry | null => {
    const entry = ssrMemoryCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      ssrMemoryCache.delete(key);
      return null;
    }
    entry.hits += 1;
    // Promote TTL if this article becomes one of the most visited
    if (entry.hits >= POPULAR_HIT_THRESHOLD) {
      entry.expiresAt = Date.now() + POPULAR_ARTICLE_TTL_MS;
    }
    return entry;
  };

  const setCachedSsrHtml = (key: string, html: string, status: number): void => {
    const totalHits = (routeHitCounts.get(key) || 0) + 1;
    routeHitCounts.set(key, totalHits);

    if (ssrMemoryCache.size >= MAX_SSR_CACHE_SIZE && !ssrMemoryCache.has(key)) {
      // Evict the entry with the lowest hit count (or oldest cachedAt on tie)
      let evictionKey: string | null = null;
      let lowestScore = Infinity;
      for (const [k, v] of ssrMemoryCache.entries()) {
        const score = v.hits * 1_000_000 + (v.cachedAt % 1_000_000);
        if (score < lowestScore) {
          lowestScore = score;
          evictionKey = k;
        }
      }
      if (evictionKey) {
        ssrMemoryCache.delete(evictionKey);
      }
    }

    const ttl = totalHits >= POPULAR_HIT_THRESHOLD ? POPULAR_ARTICLE_TTL_MS : STANDARD_TTL_MS;
    const now = Date.now();
    ssrMemoryCache.set(key, {
      html,
      status,
      cachedAt: now,
      expiresAt: now + ttl,
      hits: totalHits,
    });
  };

  // --- Vite / Static Serve Logic with Server-Side SEO HTML Injection & Memory Cache ---

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const cacheKey = normalizeCacheKey(url);

        const cached = getCachedSsrHtml(cacheKey);
        if (cached) {
          return res
            .status(cached.status)
            .set({
              'Content-Type': 'text/html; charset=utf-8',
              'X-SSR-Cache': 'HIT',
            })
            .end(cached.html);
        }

        const rawHtml = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        const viteHtml = await vite.transformIndexHtml(url, rawHtml);
        if (!isKnownRoute(url)) {
          const notFoundHtml = renderNotFoundHtml(viteHtml);
          setCachedSsrHtml(cacheKey, notFoundHtml, 404);
          return res
            .status(404)
            .set({
              'Content-Type': 'text/html; charset=utf-8',
              'X-SSR-Cache': 'MISS',
            })
            .end(notFoundHtml);
        }
        const seoHtml = injectServerSideSeo(viteHtml, url);
        setCachedSsrHtml(cacheKey, seoHtml, 200);
        res
          .status(200)
          .set({
            'Content-Type': 'text/html; charset=utf-8',
            'X-SSR-Cache': 'MISS',
          })
          .end(seoHtml);
      } catch (e) {
        next(e);
      }
    });
  } else {
    app.use(
      express.static(path.resolve(__dirname, 'dist'), {
        index: false,
        redirect: false,
      })
    );

    const getProdTemplate = (): string => {
      if (!cachedProdTemplateHtml) {
        cachedProdTemplateHtml = fs.readFileSync(
          path.resolve(__dirname, 'dist', 'index.html'),
          'utf-8'
        );
      }
      return cachedProdTemplateHtml;
    };

    // Pre-warm SSR Memory Cache for Home & Top 12 Most-Visited Articles on production startup
    try {
      const distIndexPath = path.resolve(__dirname, 'dist', 'index.html');
      if (fs.existsSync(distIndexPath)) {
        const baseHtml = getProdTemplate();
        const homeHtml = injectServerSideSeo(baseHtml, '/');
        routeHitCounts.set('/', POPULAR_HIT_THRESHOLD);
        setCachedSsrHtml('/', homeHtml, 200);

        INITIAL_POSTS.slice(0, 12).forEach((post) => {
          const postPath = `/${post.categorySlug}/${post.slug}`;
          const key = normalizeCacheKey(postPath);
          routeHitCounts.set(key, POPULAR_HIT_THRESHOLD);
          setCachedSsrHtml(key, injectServerSideSeo(baseHtml, postPath), 200);
        });
      }
    } catch (err) {
      console.warn('SSR cache pre-warm skipped:', err);
    }

    app.get('*', (req, res) => {
      const url = req.originalUrl;
      const cacheKey = normalizeCacheKey(url);

      const cached = getCachedSsrHtml(cacheKey);
      if (cached) {
        return res
          .status(cached.status)
          .set({
            'Content-Type': 'text/html; charset=utf-8',
            'X-SSR-Cache': 'HIT',
          })
          .send(cached.html);
      }

      const rawHtml = getProdTemplate();
      if (!isKnownRoute(url)) {
        const notFoundHtml = renderNotFoundHtml(rawHtml);
        setCachedSsrHtml(cacheKey, notFoundHtml, 404);
        return res
          .status(404)
          .set({
            'Content-Type': 'text/html; charset=utf-8',
            'X-SSR-Cache': 'MISS',
          })
          .send(notFoundHtml);
      }
      const seoHtml = injectServerSideSeo(rawHtml, url);
      setCachedSsrHtml(cacheKey, seoHtml, 200);
      res
        .status(200)
        .set({
          'Content-Type': 'text/html; charset=utf-8',
          'X-SSR-Cache': 'MISS',
        })
        .send(seoHtml);
    });
  }

  const port = Number(process.env.PORT) || 3000;
  httpServer.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      setTimeout(() => {
        httpServer.close();
        httpServer.listen(port);
      }, 500);
    } else {
      console.error('Server error:', err);
    }
  });
  httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();
