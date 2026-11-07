import DOMPurify from 'isomorphic-dompurify';
import { Post } from '../types';
import { DownloadAppItem, DOWNLOAD_APPS } from '../data/downloadsApps';
import { INITIAL_POSTS, INITIAL_CATEGORIES } from '../data/posts';
import { SITE_TOOLS, SiteToolItem, getToolBySlug } from '../data/toolsData';
import { getAppBreadcrumbs } from './breadcrumbs';

export interface SeoConfig {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  logoUrl: string;
}

export const DEFAULT_SEO_CONFIG: SeoConfig = {
  siteName: 'العنكبوت للمعلومات',
  siteUrl: 'https://www.information-net.com',
  siteDescription:
    'موقع العنكبوت للمعلومات information-net هو مدونة تعليمية شاملة تغطي الألعاب، البرامج، الكتب، التكنولوجيا، الذكاء الاصطناعي، الشروحات، وببجي موبايل.',
  logoUrl: 'https://www.information-net.com/logo-spider.png',
};

export function getOrganizationSchema(config: SeoConfig = DEFAULT_SEO_CONFIG) {
  return {
    '@type': 'Organization',
    '@id': `${config.siteUrl}/#organization`,
    name: 'العنكبوت للمعلومات',
    alternateName: 'information-net',
    url: `${config.siteUrl}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${config.siteUrl}/#logo`,
      url: 'https://www.information-net.com/logo-spider.png',
      contentUrl: 'https://www.information-net.com/logo-spider.png',
      width: 256,
      height: 256,
    },
  };
}

/**
 * Generates the Schema.org WebSite JSON-LD
 */
export function getWebSiteSchema(config: SeoConfig = DEFAULT_SEO_CONFIG) {
  return {
    '@type': 'WebSite',
    '@id': `${config.siteUrl}/#website`,
    name: config.siteName,
    url: `${config.siteUrl}/`,
    inLanguage: 'ar',
    publisher: {
      '@id': `${config.siteUrl}/#organization`,
    },
  };
}

export function getWebPageSchema(
  url: string,
  name: string,
  description: string,
  pageType: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' = 'WebPage',
  breadcrumbId?: string,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  return {
    '@type': pageType,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: {
      '@id': `${config.siteUrl}/#website`,
    },
    inLanguage: 'ar',
    ...(breadcrumbId ? { breadcrumb: { '@id': breadcrumbId } } : {}),
  };
}

function countWordsInHtml(htmlOrText: string): number {
  const plain = String(htmlOrText || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return 0;
  return plain.split(' ').length;
}

/**
 * Generates Schema.org SoftwareApplication / MobileApplication JSON-LD for dedicated App Download Pages
 */
export function getSoftwareAppSchema(
  app: DownloadAppItem,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const appUrl = `${config.siteUrl}/Downloads/${app.slug}`;
  const iconUrl = app.icon.startsWith('http')
    ? app.icon
    : `${config.siteUrl}${app.icon}`;

  return {
    '@type': ['SoftwareApplication', 'MobileApplication'],
    '@id': `${appUrl}#software`,
    name: app.arabicName,
    alternateName: app.name,
    operatingSystem: 'Android, iOS',
    applicationCategory:
      app.filterKey === 'games' ? 'GameApplication' : 'SocialNetworkingApplication',
    softwareVersion: app.version,
    fileSize: app.size,
    datePublished: app.updateDate,
    dateModified: app.updateDate,
    inLanguage: 'ar',
    isAccessibleForFree: true,
    url: appUrl,
    downloadUrl: app.googlePlayUrl,
    installUrl: app.googlePlayUrl,
    image: iconUrl,
    screenshot: app.screenshots.map((s) => ({
      '@type': 'ImageObject',
      url: s.url,
      caption: s.caption,
    })),
    description: app.fullDescription.join(' '),
    publisher: {
      '@id': `${config.siteUrl}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: app.googlePlayUrl,
    },
  };
}

/**
 * Generates Schema.org CollectionPage + ItemList + BreadcrumbList for /Downloads/
 */
export function getDownloadsCollectionSchema(
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const pageUrl = `${config.siteUrl}/Downloads/`;
  const pageTitle = `تطبيقات العنكبوت - دليل تحميل التطبيقات والألعاب مجاناً | ${config.siteName}`;
  const pageDesc =
    'اكتشف أفضل التطبيقات والألعاب للأندرويد والآيفون مثل ببجي موبايل ودوري كرة القدم 2026 بروابط رسمية مباشرة وآمنة.';
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(config),
      getWebSiteSchema(config),
      getWebPageSchema(
        pageUrl,
        pageTitle,
        pageDesc,
        'CollectionPage',
        breadcrumbId,
        config
      ),
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#itemlist`,
        name: 'قائمة تطبيقات وألعاب متجر العنكبوت',
        numberOfItems: DOWNLOAD_APPS.length,
        itemListElement: DOWNLOAD_APPS.map((app, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: app.arabicName,
          url: `${config.siteUrl}/Downloads/${app.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: `${config.siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'التحميلات',
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function getCategoryGraphSchema(
  categorySlug: string,
  catName: string,
  catDesc: string,
  catUrl: string,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  if (categorySlug.toLowerCase() === 'downloads') {
    return getDownloadsCollectionSchema(config);
  }
  const catPosts =
    categorySlug.toLowerCase() === 'blog'
      ? INITIAL_POSTS.filter((p) =>
          ['blog', 'education', 'games'].includes(p.categorySlug.toLowerCase())
        )
      : INITIAL_POSTS.filter(
          (p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase()
        );
  const breadcrumbId = `${catUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(config),
      getWebSiteSchema(config),
      getWebPageSchema(
        catUrl,
        `${catName} | ${config.siteName}`,
        catDesc,
        'CollectionPage',
        breadcrumbId,
        config
      ),
      {
        '@type': 'ItemList',
        '@id': `${catUrl}#itemlist`,
        name: catName,
        numberOfItems: catPosts.length,
        itemListElement: catPosts.map((p, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: p.title,
          url: p.canonicalUrl || `${config.siteUrl}/${p.categorySlug}/${p.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: `${config.siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: catName,
            item: catUrl,
          },
        ],
      },
    ],
  };
}

export const HOME_PAGE_TITLE = 'مدونة تقنية وتعليمية شاملة | العنكبوت للمعلومات';

export function formatArticleTitle(
  postTitle: string,
  siteName: string = DEFAULT_SEO_CONFIG.siteName
): string {
  const cleanTitle = String(postTitle || '').replace(/\s+/g, ' ').trim();
  const combined = `${cleanTitle} | ${siteName}`;
  if (combined.length <= 60) {
    if (combined.length < 20) {
      return `${cleanTitle} - مدونة تقنية | ${siteName}`.slice(0, 60);
    }
    return combined;
  }
  // If combined > 60 chars, omit siteName from <title>
  if (cleanTitle.length <= 60) {
    if (cleanTitle.length < 20) {
      return `${cleanTitle} - العنكبوت للمعلومات`.slice(0, 60);
    }
    return cleanTitle;
  }
  // Truncate at word boundary <= 60 chars
  const slice = cleanTitle.slice(0, 60);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace >= 25) {
    return slice.slice(0, lastSpace).trim();
  }
  return slice.trim();
}

export function formatMetaDescription(
  snippet: string,
  intro?: string,
  rawContent?: string
): string {
  const stripHtml = (s: string) =>
    String(s || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\{\s*"@context"[\s\S]*/g, ' ')
      .replace(/\.[a-zA-Z0-9_-]+\s*\{[\s\S]*/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&quot;/gi, '"')
      .replace(/&amp;/gi, '&')
      .replace(/"/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const cleanSnippet = stripHtml(snippet).replace(/\.{2,}$/, '').trim();
  const cleanIntro = stripHtml(intro || '').replace(/\.{2,}$/, '').trim();
  const cleanRaw = stripHtml(rawContent || '').replace(/\.{2,}$/, '').trim();

  let sourceText = cleanSnippet;
  if (sourceText.length < 120) {
    const combined = [cleanSnippet, cleanIntro, cleanRaw]
      .filter(Boolean)
      .join(' — ')
      .replace(/\s+/g, ' ')
      .trim();
    if (combined.length > sourceText.length) {
      sourceText = combined;
    }
  }

  const paddingSuffix =
    ' — دليل تقني شامل وشروحات مفصلة خطوة بخطوة من موقع العنكبوت للمعلومات لتغطية أحدث البرامج والتطبيقات والذكاء الاصطناعي والألعاب.';
  while (sourceText.length < 125) {
    sourceText = `${sourceText}${paddingSuffix}`.replace(/\s+/g, ' ').trim();
  }

  if (sourceText.length <= 160) {
    return sourceText;
  }

  // Truncate at a word boundary so final length is between 120 and 160 chars
  const maxBase = 156;
  const minBase = 120;
  const slice = sourceText.slice(0, maxBase);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace >= minBase) {
    return `${slice.slice(0, lastSpace).trim()}...`;
  }
  return `${sourceText.slice(0, 155).trim()}...`;
}

export function ensureHttpsAbsoluteUrl(
  rawUrl?: string | null,
  fallbackUrl: string = DEFAULT_SEO_CONFIG.logoUrl,
  siteUrl: string = DEFAULT_SEO_CONFIG.siteUrl
): string {
  const cleanSite = siteUrl.replace(/\/+$/, '');
  const candidate = String(rawUrl || '').trim();
  let resolved = '';
  if (!candidate) {
    resolved = fallbackUrl.startsWith('http')
      ? fallbackUrl.replace(/^http:\/\//i, 'https://')
      : `${cleanSite}/${fallbackUrl.replace(/^\/+/, '')}`;
  } else if (/unsplash\.com\/photos\/WUSTmZ6Vvow/i.test(candidate)) {
    resolved =
      'https://images.unsplash.com/photo-1792416253460-b63df6924ed9?auto=format&fit=crop&q=80&w=1200';
  } else if (/^https?:\/\//i.test(candidate)) {
    resolved = candidate.replace(/^http:\/\//i, 'https://');
  } else if (candidate.startsWith('//')) {
    resolved = `https:${candidate}`;
  } else {
    resolved = `${cleanSite}/${candidate.replace(/^\/+/, '')}`;
  }
  return resolved.replace(/ /g, '%20');
}

export function extractFirstImageFromHtml(html?: string | null): string | null {
  if (!html) return null;
  const match = String(html).match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  if (match && match[1] && match[1].trim()) {
    return match[1].trim();
  }
  return null;
}

export function resolvePostImage(
  post: Post,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): string {
  const manualOg = post.ogImage?.trim();
  if (manualOg) {
    return ensureHttpsAbsoluteUrl(manualOg, config.logoUrl, config.siteUrl);
  }
  const thumb = post.thumbnail?.trim();
  if (thumb) {
    return ensureHttpsAbsoluteUrl(thumb, config.logoUrl, config.siteUrl);
  }
  const extracted = extractFirstImageFromHtml(post.rawContent);
  if (extracted) {
    return ensureHttpsAbsoluteUrl(extracted, config.logoUrl, config.siteUrl);
  }
  return ensureHttpsAbsoluteUrl(config.logoUrl, config.logoUrl, config.siteUrl);
}

export function resolvePostCanonicalUrl(
  post: Post,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): string {
  const cleanSite = config.siteUrl.replace(/\/+$/, '');
  const defaultCanonical = `${cleanSite}/${post.categorySlug}/${post.slug}`;
  const rawCanonical = String(post.canonicalUrl || '').trim();
  if (!rawCanonical) {
    return defaultCanonical;
  }
  try {
    const parsed = new URL(rawCanonical, cleanSite);
    const cleanPath = parsed.pathname.replace(/\/+$/, '');
    if (!cleanPath || cleanPath === '') {
      return defaultCanonical;
    }
    return `${cleanSite}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  } catch {
    return defaultCanonical;
  }
}

export function resolvePostTitle(
  post: Post,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): string {
  if (post.seoTitle && post.seoTitle.trim()) {
    return formatArticleTitle(post.seoTitle.trim(), config.siteName);
  }
  if (
    post.slug === 'best-free-mobile-vpn' &&
    post.title.includes('أفضل تطبيقات VPN مجانية للأندرويد والآيفون')
  ) {
    return formatArticleTitle(
      'أفضل تطبيقات VPN مجانية للأندرويد والآيفون: مقارنة عملية',
      config.siteName
    );
  }
  return formatArticleTitle(post.title, config.siteName);
}

export function resolvePostSocialTitle(
  post: Post,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): string {
  if (post.seoTitle && post.seoTitle.trim()) {
    return post.seoTitle.trim();
  }
  if (
    post.slug === 'best-free-mobile-vpn' &&
    post.title.includes('أفضل تطبيقات VPN مجانية للأندرويد والآيفون')
  ) {
    return 'أفضل تطبيقات VPN مجانية للأندرويد والآيفون: مقارنة عملية';
  }
  return `${post.title} | ${config.siteName}`;
}

export function resolvePostDescription(post: Post): string {
  if (post.seoDescription && post.seoDescription.trim()) {
    return formatMetaDescription(post.seoDescription.trim());
  }
  if (
    post.slug === 'best-free-mobile-vpn' &&
    post.snippet.includes('Proton VPN')
  ) {
    return 'مقارنة عملية بين Proton VPN وPrivadoVPN وhide.me، مع ما يجب معرفته عن حدود الخطط المجانية، وكيف تتجنب تطبيقات VPN المجهولة، وخطوات التثبيت الآمن.';
  }
  return formatMetaDescription(
    post.snippet,
    post.content?.intro,
    post.rawContent
  );
}

/**
 * Generates the BlogPosting Schema.org JSON-LD node
 */
export function getArticleSchema(
  post: Post,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const postUrl = resolvePostCanonicalUrl(post, config);
  const headline =
    post.title.length > 110
      ? `${post.title.slice(0, 107).trim()}...`
      : post.title;
  const modifiedDate = post.modifiedIso || post.isoDate;
  const desc = resolvePostDescription(post);
  const imageUrl = resolvePostImage(post, config);
  const wordCount = countWordsInHtml(
    post.rawContent ||
      [
        post.content?.intro || '',
        ...(post.content?.sections || []).map((s) => `${s.title} ${s.body.join(' ')}`),
      ].join(' ')
  );

  return {
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${postUrl}#webpage`,
    },
    headline,
    description: desc,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
    datePublished: post.isoDate,
    dateModified: modifiedDate,
    author: {
      '@id': `${config.siteUrl}/#organization`,
      '@type': 'Organization',
      name: 'العنكبوت للمعلومات',
    },
    publisher: {
      '@id': `${config.siteUrl}/#organization`,
    },
    articleSection: post.category,
    keywords: (post.keywords && post.keywords.length > 0 ? post.keywords : post.tags).join(', '),
    inLanguage: 'ar',
    wordCount,
  };
}

/**
 * Generates BreadcrumbList Schema.org JSON-LD for an article
 */
export function getBreadcrumbSchema(
  post: Post,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const postUrl = resolvePostCanonicalUrl(post, config);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${postUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: config.siteName,
        item: `${config.siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category,
        item: `${config.siteUrl}/${post.categorySlug}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };
}

export function getArticleGraphSchema(
  post: Post,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const postUrl = resolvePostCanonicalUrl(post, config);
  const postImage = resolvePostImage(post, config);
  const postDesc = resolvePostDescription(post);
  const modifiedDate = post.modifiedIso || post.isoDate;

  if (post.slug === 'best-free-mobile-vpn') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://www.information-net.com/#organization',
          name: 'العنكبوت للمعلومات',
          alternateName: 'information-net',
          url: 'https://www.information-net.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.information-net.com/logo-spider.png',
          },
        },
        {
          '@type': 'WebSite',
          '@id': 'https://www.information-net.com/#website',
          url: 'https://www.information-net.com/',
          name: 'العنكبوت للمعلومات',
          inLanguage: 'ar',
          publisher: {
            '@id': 'https://www.information-net.com/#organization',
          },
        },
        {
          '@type': 'BlogPosting',
          '@id': `${postUrl}#article`,
          headline: post.title,
          description: postDesc,
          inLanguage: 'ar',
          articleSection: 'التطبيقات',
          datePublished: post.isoDate || '2026-10-19T00:00:00+00:00',
          dateModified: modifiedDate || '2026-10-19T00:00:00+00:00',
          author: {
            '@id': 'https://www.information-net.com/#organization',
          },
          publisher: {
            '@id': 'https://www.information-net.com/#organization',
          },
          mainEntityOfPage: {
            '@id': postUrl,
          },
          image: {
            '@type': 'ImageObject',
            url: postImage,
            width: 1200,
            height: 630,
          },
          keywords: post.keywords || [
            'أفضل VPN مجاني',
            'تحميل VPN للأندرويد',
            'VPN للآيفون',
            'Proton VPN',
            'PrivadoVPN',
            'hide.me',
            'حماية الخصوصية',
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://www.information-net.com/Blog/best-free-mobile-vpn#faq',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'هل VPN المجاني آمن فعلاً؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'يعتمد على الشركة وليس على المجانية. التطبيقات الكبيرة التي لها سياسة خصوصية واضحة وخطة مجانية محدودة، أكثر أماناً بكثير من تطبيقات مجهولة تقدم كل شيء بلا مقابل. ابحث عن الشركة نفسها قبل أن تحمل التطبيق.',
              },
            },
            {
              '@type': 'Question',
              name: 'هل يبطئ VPN الإنترنت؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'نعم بدرجة ما، لأن البيانات تُشفّر وتمر عبر خادم آخر قبل وصولها إلى الموقع. الفرق يكون غالباً محسوساً على الخوادم البعيدة أو في أوقات الازدحام، ويقل كثيراً إذا اخترت خادماً قريباً.',
              },
            },
            {
              '@type': 'Question',
              name: 'هل يخفي VPN كل نشاطي على الإنترنت؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'لا. هو يخفي عنوانك وما يمر عبر الاتصال عن مزود الخدمة والشبكة العامة، لكن المواقع وتطبيقات التواصل ما زالت تعرف حسابك وطريقة استخدامك لها. VPN أداة حماية للاتصال، وليس وسيلة لإخفاء الهوية بالكامل.',
              },
            },
            {
              '@type': 'Question',
              name: 'هل أحتاج إلى حساب للاستخدام؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'يعتمد على التطبيق. Proton VPN وPrivadoVPN يطلبان حساباً، بينما يتيح hide.me البدء دون بريد إلكتروني. اختر حسب مدى راحتك في مشاركة بياناتك.',
              },
            },
            {
              '@type': 'Question',
              name: 'هل استخدام VPN قانوني؟',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'استخدام VPN مشروع في أغلب الدول، لكن بعض الدول تقيّده أو تحظره. تحقق من القوانين المحلية قبل الاستخدام، وتذكر أن استخدامه لارتكاب أي مخالفة لا يجعلها قانونية.',
              },
            },
          ],
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://www.information-net.com/Blog/best-free-mobile-vpn#breadcrumb',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'الرئيسية',
              item: 'https://www.information-net.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'المدونة',
              item: 'https://www.information-net.com/Blog/',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'أفضل تطبيقات VPN مجانية للأندرويد والآيفون: مقارنة عملية',
              item: 'https://www.information-net.com/Blog/best-free-mobile-vpn',
            },
          ],
        },
      ],
    };
  }

  if (post.slug === 'google-ai-pro-price-saudi') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://www.information-net.com/#organization',
          name: 'العنكبوت للمعلومات',
          alternateName: 'information-net',
          url: 'https://www.information-net.com/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.information-net.com/logo-spider.png',
          },
        },
        {
          '@type': 'WebSite',
          '@id': 'https://www.information-net.com/#website',
          url: 'https://www.information-net.com/',
          name: 'العنكبوت للمعلومات',
          inLanguage: 'ar',
          publisher: {
            '@id': 'https://www.information-net.com/#organization',
          },
        },
        {
          '@type': 'BlogPosting',
          '@id': `${postUrl}#article`,
          headline: post.title,
          description: postDesc,
          keywords: post.keywords || [
            'سعر Google AI Pro السعودية',
            'اشتراك Gemini Pro في السعودية',
            'أسعار Google One',
            'Google AI Pro ريال',
            'هل يستحق اشتراك Google AI Pro',
          ],
          articleSection: 'الذكاء الاصطناعي',
          inLanguage: 'ar',
          datePublished: post.isoDate || '2026-10-18T00:00:00+03:00',
          dateModified: modifiedDate || '2026-10-18T00:00:00+03:00',
          author: {
            '@id': 'https://www.information-net.com/#organization',
          },
          publisher: {
            '@id': 'https://www.information-net.com/#organization',
          },
          mainEntityOfPage: {
            '@id': postUrl,
          },
          image: {
            '@type': 'ImageObject',
            url: postImage,
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${postUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'الرئيسية',
              item: 'https://www.information-net.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'الذكاء الاصطناعي',
              item: 'https://www.information-net.com/AI/',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: postUrl,
            },
          ],
        },
      ],
    };
  }

  const breadcrumb = getBreadcrumbSchema(post, config);
  const extractedFaqs: { question: string; answer: string }[] = [];
  if (post.rawContent && /الأسئلة الشائعة|أسئلة شائعة/.test(post.rawContent)) {
    const faqSectionMatch = post.rawContent.match(
      /<h2[^>]*>[^<]*(?:الأسئلة الشائعة|أسئلة شائعة)[^<]*<\/h2>([\s\S]*?)(?:<h2\b|$)/i
    );
    const faqBlock = faqSectionMatch ? faqSectionMatch[1] : post.rawContent;
    const qaRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = qaRegex.exec(faqBlock)) !== null) {
      const q = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const a = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (q && a) {
        extractedFaqs.push({ question: q, answer: a });
      }
    }
  }

  const faqSchemaNode =
    extractedFaqs.length > 0
      ? {
          '@type': 'FAQPage',
          '@id': `${postUrl}#faq`,
          mainEntity: extractedFaqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(config),
      getWebSiteSchema(config),
      getWebPageSchema(
        postUrl,
        resolvePostTitle(post, config),
        postDesc,
        'WebPage',
        `${postUrl}#breadcrumb`,
        config
      ),
      getArticleSchema(post, config),
      ...(faqSchemaNode ? [faqSchemaNode] : []),
      breadcrumb,
    ],
  };
}

export function getAppBreadcrumbSchema(
  app: DownloadAppItem,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const appUrl = `${config.siteUrl}/Downloads/${app.slug}`;
  const trail = getAppBreadcrumbs(app);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${appUrl}#breadcrumb`,
    itemListElement: trail.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.href.startsWith('http')
        ? item.href
        : `${config.siteUrl}${item.href}`,
    })),
  };
}

export function getAppFaqSchema(app: DownloadAppItem) {
  if (!app.faqs || app.faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    '@id': `https://www.information-net.com/Downloads/${app.slug}#faq`,
    mainEntity: app.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getFullAppGraphSchema(
  app: DownloadAppItem,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const appUrl = `${config.siteUrl}/Downloads/${app.slug}`;
  const appTitle = `${app.h1Title} | ${config.siteName}`;
  const appDesc = app.fullDescription[0] || app.shortDescription;
  const softwareLd = getSoftwareAppSchema(app, config);
  const breadcrumbLd = getAppBreadcrumbSchema(app, config);
  const faqLd = getAppFaqSchema(app);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(config),
      getWebSiteSchema(config),
      getWebPageSchema(
        appUrl,
        appTitle,
        appDesc,
        'WebPage',
        `${appUrl}#breadcrumb`,
        config
      ),
      softwareLd,
      breadcrumbLd,
      ...(faqLd ? [faqLd] : []),
    ],
  };
}

export function getHomeGraphSchema(config: SeoConfig = DEFAULT_SEO_CONFIG) {
  const homeUrl = `${config.siteUrl}/`;
  const latestTen = INITIAL_POSTS.slice(0, 10);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(config),
      getWebSiteSchema(config),
      getWebPageSchema(
        homeUrl,
        HOME_PAGE_TITLE,
        formatMetaDescription(config.siteDescription),
        'WebPage',
        undefined,
        config
      ),
      {
        '@type': 'ItemList',
        '@id': `${homeUrl}#itemlist`,
        itemListElement: latestTen.map((p) => ({
          name: p.title,
          url: p.canonicalUrl || `${config.siteUrl}/${p.categorySlug}/${p.slug}`,
        })),
      },
    ],
  };
}

export function getStandalonePageGraphSchema(
  pageKey: string,
  title: string,
  description: string,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const pageUrl = `${config.siteUrl}/${pageKey}`;
  const sp = pageKey.toLowerCase();
  const pageType: 'AboutPage' | 'ContactPage' | 'WebPage' =
    sp === 'about'
      ? 'AboutPage'
      : sp === 'contact'
      ? 'ContactPage'
      : 'WebPage';
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(config),
      getWebSiteSchema(config),
      getWebPageSchema(
        pageUrl,
        `${title} | ${config.siteName}`,
        description,
        pageType,
        breadcrumbId,
        config
      ),
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: `${config.siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: title,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export interface ArticlePublishInput {
  id?: string;
  title: string;
  slug?: string;
  category?: string;
  categorySlug?: Post['categorySlug'];
  categoryIndex?: number;
  canonicalUrl?: string;
  date?: string;
  isoDate?: string;
  modifiedIso?: string;
  readTime?: string;
  author?: Post['author'];
  thumbnail?: string;
  snippet?: string;
  content?: Post['content'];
  tags?: string[];
  rawContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  keywords?: string[];
}

type CacheInvalidator = () => void;
const seoCacheInvalidators: CacheInvalidator[] = [];

export function registerSeoCacheInvalidator(fn: CacheInvalidator): void {
  if (!seoCacheInvalidators.includes(fn)) {
    seoCacheInvalidators.push(fn);
  }
}

export function notifySeoCacheInvalidated(): void {
  seoCacheInvalidators.forEach((fn) => {
    try {
      fn();
    } catch {
      // Ignore errors in listeners
    }
  });
}

const CATEGORY_INFO_MAP: Record<
  Post['categorySlug'],
  { name: string; index: number }
> = {
  AI: { name: 'الذكاء الاصطناعي', index: 3 },
  Games: { name: 'الألعاب', index: 1 },
  Software: { name: 'البرامج', index: 2 },
  Downloads: { name: 'التحميلات', index: 4 },
  Business: { name: 'المال والأعمال', index: 6 },
  Blog: { name: 'المدونة', index: 5 },
  Education: { name: 'مقالات تعليمية', index: 5 },
};

function generateSlugFromTitle(title: string, fallbackId: string): string {
  const ascii = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return ascii || `post-${fallbackId}`;
}

/**
 * Automatically extracts and normalizes all post & SEO fields upon creating or updating an article.
 * Preserves existing manual SEO overrides (seoTitle, seoDescription, ogImage, canonicalUrl) unless updated.
 */
export function preparePostForPublishing(
  input: ArticlePublishInput,
  existingPost?: Post | null,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): Post {
  const nowIso = new Date().toISOString();
  const cleanTitle = String(input.title || existingPost?.title || 'مقال جديد').trim();
  const categorySlug: Post['categorySlug'] =
    input.categorySlug || existingPost?.categorySlug || 'Blog';
  const catMeta = CATEGORY_INFO_MAP[categorySlug] || CATEGORY_INFO_MAP.Blog;
  const categoryName = input.category?.trim() || existingPost?.category || catMeta.name;
  const categoryIndex = input.categoryIndex ?? existingPost?.categoryIndex ?? catMeta.index;

  // Preserve existing slug on edit unless explicitly changed
  const slug =
    input.slug?.trim() ||
    existingPost?.slug ||
    generateSlugFromTitle(cleanTitle, String(Date.now()));

  const rawContent = input.rawContent !== undefined ? input.rawContent : existingPost?.rawContent;
  const contentObj: Post['content'] = input.content ||
    existingPost?.content || {
      intro: '',
      sections: [],
    };

  // Extract plain text from rawContent or sections for automatic snippet/intro generation
  const plainFromRaw = String(rawContent || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const plainFromSections = (contentObj.sections || [])
    .map((s) => `${s.title} ${(s.body || []).join(' ')}`)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const resolvedIntro =
    (input.content?.intro !== undefined ? input.content.intro : contentObj.intro)?.trim() ||
    plainFromRaw.slice(0, 240) ||
    plainFromSections.slice(0, 240) ||
    cleanTitle;

  const resolvedSnippet =
    (input.snippet !== undefined ? input.snippet : existingPost?.snippet)?.trim() ||
    resolvedIntro.slice(0, 180) ||
    cleanTitle;

  // Automatic featured image resolution: explicit thumbnail -> first <img> in rawContent -> existing thumbnail -> default HTTPS site logo
  const rawThumb =
    input.thumbnail !== undefined
      ? input.thumbnail.trim()
      : existingPost?.thumbnail?.trim() || '';
  const extractedImg = extractFirstImageFromHtml(rawContent);
  const resolvedThumbnail = ensureHttpsAbsoluteUrl(
    rawThumb || extractedImg || config.logoUrl,
    config.logoUrl,
    config.siteUrl
  );

  // Automatic canonical URL resolution: if slug or categorySlug changed, update canonical unless custom override was explicitly passed
  const cleanSite = config.siteUrl.replace(/\/+$/, '');
  const autoCanonical = `${cleanSite}/${categorySlug}/${slug}`;
  let resolvedCanonical = autoCanonical;
  if (input.canonicalUrl && input.canonicalUrl.trim()) {
    resolvedCanonical = resolvePostCanonicalUrl(
      {
        ...(existingPost as Post),
        slug,
        categorySlug,
        canonicalUrl: input.canonicalUrl.trim(),
      },
      config
    );
  } else if (
    existingPost?.canonicalUrl &&
    existingPost.slug === slug &&
    existingPost.categorySlug === categorySlug
  ) {
    resolvedCanonical = resolvePostCanonicalUrl(existingPost, config);
  }

  return {
    id: input.id || existingPost?.id || `post-${Date.now()}`,
    title: cleanTitle,
    slug,
    category: categoryName,
    categorySlug,
    categoryIndex,
    canonicalUrl: resolvedCanonical,
    date: input.date || existingPost?.date || new Date().toLocaleDateString('ar-EG'),
    isoDate: input.isoDate || existingPost?.isoDate || nowIso,
    modifiedIso: input.modifiedIso || (existingPost ? nowIso : input.isoDate || nowIso),
    readTime: input.readTime || existingPost?.readTime || '5 دقائق للقراءة',
    author: input.author ||
      existingPost?.author || {
        name: 'العنكبوت للمعلومات',
        avatar: config.logoUrl,
        role: 'محرر تقني',
        bio: 'فريق التحرير التقني في موقع العنكبوت للمعلومات',
      },
    thumbnail: resolvedThumbnail,
    snippet: resolvedSnippet,
    content: {
      intro: resolvedIntro,
      sections: contentObj.sections || [],
    },
    tags:
      input.tags && input.tags.length > 0
        ? input.tags
        : existingPost?.tags && existingPost.tags.length > 0
        ? existingPost.tags
        : [categoryName, config.siteName],
    commentsCount: existingPost?.commentsCount ?? 0,
    comments: existingPost?.comments ?? [],
    rawContent,
    seoTitle:
      input.seoTitle !== undefined ? input.seoTitle : existingPost?.seoTitle,
    seoDescription:
      input.seoDescription !== undefined
        ? input.seoDescription
        : existingPost?.seoDescription,
    ogImage:
      input.ogImage !== undefined
        ? input.ogImage
          ? ensureHttpsAbsoluteUrl(input.ogImage, config.logoUrl, config.siteUrl)
          : undefined
        : existingPost?.ogImage,
    keywords:
      input.keywords !== undefined ? input.keywords : existingPost?.keywords,
  };
}

/**
 * Publishes a new post or updates an existing post in INITIAL_POSTS and invalidates SSR cache.
 */
export function upsertPublishedPost(
  input: ArticlePublishInput,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): Post {
  const existingIdx = INITIAL_POSTS.findIndex(
    (p) =>
      (input.id && p.id === input.id) ||
      (input.slug && p.slug.toLowerCase() === input.slug.toLowerCase())
  );
  const existingPost = existingIdx !== -1 ? INITIAL_POSTS[existingIdx] : null;
  const prepared = preparePostForPublishing(input, existingPost, config);

  if (existingIdx !== -1) {
    INITIAL_POSTS[existingIdx] = prepared;
  } else {
    INITIAL_POSTS.unshift(prepared);
  }

  notifySeoCacheInvalidated();
  return prepared;
}

export interface ResolvedPageMetadata {
  status: 200 | 404;
  pageKind:
    | 'home'
    | 'post'
    | 'category'
    | 'ai-sub'
    | 'download-app'
    | 'tools-index'
    | 'tool'
    | 'standalone'
    | 'not-found';
  title: string;
  description: string;
  canonical: string | null;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogUrl: string | null;
  ogType: 'website' | 'article';
  ogSiteName: string;
  ogLocale: string;
  twitterCard: 'summary_large_image';
  twitterSite: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  keywords?: string;
  articleMeta?: {
    publishedTime: string;
    modifiedTime: string;
    section: string;
    author: string;
    tags: string[];
  };
  schemaGraph: object | null;
  matchedPost?: Post;
  matchedApp?: DownloadAppItem;
  matchedTool?: SiteToolItem;
  matchedCategorySlug?: string;
  matchedAiSubSlug?: string;
  matchedStandaloneKey?: string;
}

export interface PageMetadataResolveInput {
  requestPath?: string;
  post?: Post | null;
  activeCategory?: string;
  activeAiSubTag?: string;
  standalonePage?: string | null;
  selectedDownloadApp?: DownloadAppItem | null;
  selectedTool?: SiteToolItem | null;
  isNotFound?: boolean;
}

export function getToolsCollectionSchema(config: SeoConfig = DEFAULT_SEO_CONFIG) {
  const collectionUrl = `${config.siteUrl}/tools/`;
  const breadcrumbId = `${collectionUrl}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(config),
      getWebSiteSchema(config),
      getWebPageSchema(
        collectionUrl,
        'أدوات العنكبوت للمعلومات - أدوات ويب مجانية وتفاعلية',
        'مجموعة متكاملة من الأدوات المجانية تشمل اختبار سرعة الإنترنت، مولد البرومبتات، صانع الباركود وQR، معاينة نتائج جوجل، ضغط الصور WebP، إزالة خلفية الصور، وفحص روابط الفيديو.',
        'CollectionPage',
        breadcrumbId,
        config
      ),
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: `${config.siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'الأدوات',
            item: collectionUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${collectionUrl}#itemlist`,
        name: 'قائمة أدوات موقع العنكبوت للمعلومات',
        itemListElement: SITE_TOOLS.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          url: `${config.siteUrl}${tool.path}`,
        })),
      },
    ],
  };
}

export function getToolPageGraphSchema(
  tool: SiteToolItem,
  config: SeoConfig = DEFAULT_SEO_CONFIG
) {
  const toolUrl = `${config.siteUrl}${tool.path}`;
  const breadcrumbId = `${toolUrl}#breadcrumb`;
  const graph: object[] = [
    getOrganizationSchema(config),
    getWebSiteSchema(config),
    getWebPageSchema(
      toolUrl,
      tool.seoTitle,
      tool.seoDescription,
      'WebPage',
      breadcrumbId,
      config
    ),
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'الرئيسية',
          item: `${config.siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tool.path.toLowerCase().startsWith('/ai/') ? 'الذكاء الاصطناعي' : 'الأدوات',
          item: tool.path.toLowerCase().startsWith('/ai/')
            ? `${config.siteUrl}/AI/`
            : `${config.siteUrl}/tools/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: toolUrl,
        },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': `${toolUrl}#webapp`,
      name: tool.name,
      headline: tool.h1Title,
      description: tool.seoDescription,
      url: toolUrl,
      ...(tool.imageUrl
        ? {
            image: ensureHttpsAbsoluteUrl(
              tool.imageUrl,
              config.logoUrl,
              config.siteUrl
            ),
          }
        : {}),
      applicationCategory: tool.applicationCategory,
      operatingSystem: 'All',
      inLanguage: 'ar',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@id': `${config.siteUrl}/#organization`,
      },
    },
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${toolUrl}#faq`,
      mainEntity: tool.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

const CATEGORY_NAMES_FALLBACK: Record<string, string> = {
  AI: 'الذكاء الاصطناعي',
  Business: 'المال والأعمال',
  Blog: 'المدونة',
  Downloads: 'تطبيقات العنكبوت - دليل تحميل التطبيقات والألعاب مجاناً',
  Software: 'البرامج',
  Games: 'الألعاب',
  Education: 'مقالات تعليمية',
};

const CATEGORY_DESCRIPTIONS_FALLBACK: Record<string, string> = {
  AI: 'اكتشف أفضل أدوات الذكاء الاصطناعي وتطبيقات AI، مع شروحات بسيطة للمبتدئين، وروابط تحميل البرامج، ومقارنة أفضل الأدوات، وطرق الربح من الذكاء الاصطناعي.',
  Business:
    'محتوى يساعد الزائر على التعرّف على مجالات المال والأعمال والخدمات الرقمية وأدوات الإنتاجية ذات الصلة.',
  Blog: 'تصفّح أحدث المقالات والشروحات والأدلة المنشورة على موقع العنكبوت للمعلومات.',
  Downloads:
    'دليل تحميل التطبيقات والألعاب مجاناً للاندرويد والأيفون: حمّل ببجي موبايل PUBG MOBILE، دوري كرة القدم 2026، واتساب مسنجر، وفري فاير بروابط رسمية مباشرة وآمنة.',
  Software:
    'شروحات ومراجعات أهم برامج الكمبيوتر والهواتف الذكية، أدوات النظام، وتطبيقات الإنتاجية والحماية.',
  Games:
    'أحدث أخبار وشروحات الألعاب الإلكترونية، إعدادات ببجي موبايل، الحساسية، التحديثات، وحلول مشاكل الألعاب على الهواتف والكمبيوتر.',
  Education:
    'دروس وشروحات تقنية وتعليمية مبسطة خطوة بخطوة في مجالات البرمجة، الإنترنت، الأنظمة، والمهارات الرقمية.',
};

const AI_SUB_SECTION_MAP: Record<string, { slug: string; label: string }> = {
  tools: { slug: 'Tools', label: 'أدوات الذكاء الاصطناعي' },
  downloads: { slug: 'Downloads', label: 'تحميل برامج وتطبيقات الذكاء الاصطناعي' },
  earning: { slug: 'Earning', label: 'الربح من الذكاء الاصطناعي' },
  'tools-comparison': { slug: 'Tools-Comparison', label: 'مقارنة أدوات الذكاء الاصطناعي' },
};

const STANDALONE_TITLES: Record<string, string> = {
  about: 'من نحن - نبذة عن الموقع ورسالتنا',
  contact: 'اتصل بنا - قنوات التواصل ونموذج المراسلة',
  privacy: 'سياسة الخصوصية - معايير الأمان وحماية البيانات',
  terms: 'اتفاقية المستخدم - شروط الاستخدام وحقوق الملكية',
  sitemap: 'خريطة الموقع - فهرس المقالات والأقسام',
};

const STANDALONE_DESCRIPTIONS: Record<string, string> = {
  about:
    'تعرف على موقع العنكبوت للمعلومات، رسالتنا التقنية والتعليمية، وفريق العمل المتخصص في تقديم شروحات الألعاب والبرامج والذكاء الاصطناعي باللغة العربية.',
  contact:
    'تواصل مباشرة مع إدارة موقع العنكبوت للمعلومات عبر قنواتنا الرسمية أو نموذج المراسلة الفوري للاستفسارات التقنية والاقتراحات والشراكات الإعلانية.',
  privacy:
    'نلتزم في موقع العنكبوت للمعلومات بأعلى معايير الخصوصية وحماية بيانات الزوار وملفات تعريف الارتباط وفقاً للمعايير الدولية وسياسات Google AdSense.',
  terms:
    'تعرف على شروط واتفاقية استخدام موقع العنكبوت للمعلومات، وضوابط الاقتباس وحقوق الملكية الفكرية للمقالات والشروحات المنشورة على المنصة.',
  sitemap:
    'تصفح الفهرس الشامل وخريطة موقع العنكبوت للمعلومات للوصول السريع إلى كافة الأقسام والمقالات التقنية وصفحات تحميل التطبيقات والألعاب.',
};

/**
 * Single Central Metadata Engine: resolves all SEO, OpenGraph, Twitter Card, Canonical,
 * and Schema.org JSON-LD metadata from the actual page source of truth.
 */
export function resolvePageMetadata(
  input: PageMetadataResolveInput | string,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): ResolvedPageMetadata {
  const opts: PageMetadataResolveInput =
    typeof input === 'string' ? { requestPath: input } : input;

  const defaultLogoHttps = ensureHttpsAbsoluteUrl(
    config.logoUrl,
    config.logoUrl,
    config.siteUrl
  );

  const notFoundTitle = '404 - الصفحة غير موجودة | العنكبوت للمعلومات';
  const notFoundDesc =
    'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك البحث في الموقع أو العودة إلى الصفحة الرئيسية لموقع العنكبوت للمعلومات.';
  const buildNotFoundMeta = (): ResolvedPageMetadata => ({
    status: 404,
    pageKind: 'not-found',
    title: notFoundTitle,
    description: notFoundDesc,
    canonical: null,
    robots: 'noindex, follow',
    ogTitle: notFoundTitle,
    ogDescription: notFoundDesc,
    ogImage: defaultLogoHttps,
    ogImageAlt: config.siteName,
    ogUrl: null,
    ogType: 'website',
    ogSiteName: config.siteName,
    ogLocale: 'ar_AR',
    twitterCard: 'summary_large_image',
    twitterSite: '@information_net',
    twitterTitle: notFoundTitle,
    twitterDescription: notFoundDesc,
    twitterImage: defaultLogoHttps,
    schemaGraph: null,
  });

  if (opts.isNotFound) {
    return buildNotFoundMeta();
  }

  // If requestPath is provided, parse route entities from path first
  let resolvedPost = opts.post || null;
  let resolvedApp = opts.selectedDownloadApp || null;
  let resolvedTool = opts.selectedTool || null;
  let resolvedStandalone = opts.standalonePage || null;
  let resolvedCategory = opts.activeCategory || 'all';
  let resolvedAiSub = opts.activeAiSubTag || 'AI';

  if (opts.requestPath !== undefined) {
    const parsedRoute = parseRequestPathToEntities(opts.requestPath);
    if (!parsedRoute.isKnown) {
      return buildNotFoundMeta();
    }

    resolvedPost = parsedRoute.post;
    resolvedApp = parsedRoute.app;
    resolvedTool = parsedRoute.tool;
    resolvedStandalone = parsedRoute.standalone;
    resolvedCategory = parsedRoute.category;
    resolvedAiSub = parsedRoute.aiSub;
  }

  // 0a. Dedicated Interactive Tool Page (/tools/<slug>)
  if (resolvedTool) {
    const toolUrl = `${config.siteUrl}${resolvedTool.path}`;
    const toolDesc = formatMetaDescription(resolvedTool.seoDescription, resolvedTool.introText);
    const toolImage = resolvedTool.imageUrl
      ? ensureHttpsAbsoluteUrl(resolvedTool.imageUrl, defaultLogoHttps, config.siteUrl)
      : defaultLogoHttps;
    return {
      status: 200,
      pageKind: 'tool',
      title: resolvedTool.seoTitle,
      description: toolDesc,
      canonical: toolUrl,
      robots: 'index, follow',
      ogTitle: resolvedTool.seoTitle,
      ogDescription: toolDesc,
      ogImage: toolImage,
      ogImageAlt: resolvedTool.h1Title || resolvedTool.name,
      ogUrl: toolUrl,
      ogType: 'website',
      ogSiteName: config.siteName,
      ogLocale: 'ar_AR',
      twitterCard: 'summary_large_image',
      twitterSite: '@information_net',
      twitterTitle: resolvedTool.seoTitle,
      twitterDescription: toolDesc,
      twitterImage: toolImage,
      schemaGraph: getToolPageGraphSchema(resolvedTool, config),
      matchedTool: resolvedTool,
    };
  }

  // 0b. Tools Directory Index Page (/tools/)
  if (resolvedCategory.toLowerCase() === 'tools') {
    const toolsUrl = `${config.siteUrl}/tools/`;
    const toolsTitle = 'أدوات العنكبوت للمعلومات - أدوات ويب ذكية ومجانية | العنكبوت للمعلومات';
    const toolsDesc = formatMetaDescription(
      'استخدم مجاناً أدوات موقع العنكبوت للمعلومات: اختبار سرعة الإنترنت، مولد البرومبتات للذكاء الاصطناعي، صانع الباركود وQR، معاينة نتائج جوجل، ضغط الصور WebP، وإزالة الخلفية.'
    );
    return {
      status: 200,
      pageKind: 'tools-index',
      title: toolsTitle,
      description: toolsDesc,
      canonical: toolsUrl,
      robots: 'index, follow',
      ogTitle: toolsTitle,
      ogDescription: toolsDesc,
      ogImage: defaultLogoHttps,
      ogImageAlt: 'أدوات العنكبوت للمعلومات',
      ogUrl: toolsUrl,
      ogType: 'website',
      ogSiteName: config.siteName,
      ogLocale: 'ar_AR',
      twitterCard: 'summary_large_image',
      twitterSite: '@information_net',
      twitterTitle: toolsTitle,
      twitterDescription: toolsDesc,
      twitterImage: defaultLogoHttps,
      schemaGraph: getToolsCollectionSchema(config),
      matchedCategorySlug: 'tools',
    };
  }

  // 1. Dedicated App Download Page (/Downloads/<slug>)
  if (resolvedApp) {
    const appTitle = formatArticleTitle(resolvedApp.h1Title, config.siteName);
    const socialTitle = `${resolvedApp.h1Title} | ${config.siteName}`;
    const appDesc = formatMetaDescription(
      resolvedApp.fullDescription[0] || resolvedApp.shortDescription,
      resolvedApp.fullDescription.slice(1).join(' ')
    );
    const appUrl = `${config.siteUrl}/Downloads/${resolvedApp.slug}`;
    const appImage = ensureHttpsAbsoluteUrl(
      resolvedApp.icon,
      defaultLogoHttps,
      config.siteUrl
    );

    return {
      status: 200,
      pageKind: 'download-app',
      title: appTitle,
      description: appDesc,
      canonical: appUrl,
      robots: 'index, follow',
      ogTitle: socialTitle,
      ogDescription: appDesc,
      ogImage: appImage,
      ogImageAlt: resolvedApp.arabicName || resolvedApp.name,
      ogUrl: appUrl,
      ogType: 'website',
      ogSiteName: config.siteName,
      ogLocale: 'ar_AR',
      twitterCard: 'summary_large_image',
      twitterSite: '@information_net',
      twitterTitle: socialTitle,
      twitterDescription: appDesc,
      twitterImage: appImage,
      schemaGraph: getFullAppGraphSchema(resolvedApp, config),
      matchedApp: resolvedApp,
    };
  }

  // 2. Article Post Page (/<categorySlug>/<slug>)
  if (resolvedPost) {
    const isVpnArticle = resolvedPost.slug === 'best-free-mobile-vpn';
    const computedTitle = resolvePostTitle(resolvedPost, config);
    const socialTitle = resolvePostSocialTitle(resolvedPost, config);
    const computedDesc = resolvePostDescription(resolvedPost);
    const canonicalUrl = resolvePostCanonicalUrl(resolvedPost, config);
    const postImage = resolvePostImage(resolvedPost, config);
    const modifiedDate = resolvedPost.modifiedIso || resolvedPost.isoDate;
    const imageAlt =
      isVpnArticle &&
      resolvedPost.title.includes('أفضل تطبيقات VPN مجانية للأندرويد والآيفون')
        ? 'شاشة هاتف تعرض تطبيق VPN قبل الاتصال بالشبكة'
        : resolvedPost.title;

    const keywordsStr =
      resolvedPost.keywords && resolvedPost.keywords.length > 0
        ? resolvedPost.keywords.join('، ')
        : isVpnArticle
        ? 'أفضل VPN مجاني، تحميل VPN للأندرويد، VPN للآيفون، Proton VPN، PrivadoVPN، hide.me، حماية الخصوصية'
        : undefined;

    return {
      status: 200,
      pageKind: 'post',
      title: computedTitle,
      description: computedDesc,
      canonical: canonicalUrl,
      robots: 'index, follow',
      ogTitle: socialTitle,
      ogDescription: computedDesc,
      ogImage: postImage,
      ogImageAlt: imageAlt,
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogUrl: canonicalUrl,
      ogType: 'article',
      ogSiteName: config.siteName,
      ogLocale: 'ar_AR',
      twitterCard: 'summary_large_image',
      twitterSite: '@information_net',
      twitterTitle: socialTitle,
      twitterDescription: computedDesc,
      twitterImage: postImage,
      keywords: keywordsStr,
      articleMeta: {
        publishedTime: resolvedPost.isoDate,
        modifiedTime: modifiedDate,
        section: isVpnArticle ? 'التطبيقات' : resolvedPost.category,
        author: resolvedPost.author?.name || config.siteName,
        tags: resolvedPost.tags || [],
      },
      schemaGraph: getArticleGraphSchema(resolvedPost, config),
      matchedPost: resolvedPost,
    };
  }

  // 3. Standalone Page (/about, /contact, /privacy, /terms, /sitemap)
  if (resolvedStandalone) {
    const sp = resolvedStandalone.toLowerCase();
    const spTitle = STANDALONE_TITLES[sp] || 'صفحة مستقلة';
    const spDesc = formatMetaDescription(
      STANDALONE_DESCRIPTIONS[sp] || config.siteDescription
    );
    const pageUrl = `${config.siteUrl}/${sp}`;
    const fullTitle = formatArticleTitle(spTitle, config.siteName);
    const socialTitle = `${spTitle} | ${config.siteName}`;

    return {
      status: 200,
      pageKind: 'standalone',
      title: fullTitle,
      description: spDesc,
      canonical: pageUrl,
      robots: 'index, follow',
      ogTitle: socialTitle,
      ogDescription: spDesc,
      ogImage: defaultLogoHttps,
      ogImageAlt: spTitle,
      ogUrl: pageUrl,
      ogType: 'website',
      ogSiteName: config.siteName,
      ogLocale: 'ar_AR',
      twitterCard: 'summary_large_image',
      twitterSite: '@information_net',
      twitterTitle: socialTitle,
      twitterDescription: spDesc,
      twitterImage: defaultLogoHttps,
      schemaGraph: getStandalonePageGraphSchema(sp, spTitle, spDesc, config),
      matchedStandaloneKey: sp,
    };
  }

  // 4. AI Sub-Section (/AI/Tools/, /AI/Downloads/, /AI/Earning/, /AI/Tools-Comparison/)
  if (
    resolvedCategory.toLowerCase() === 'ai' &&
    resolvedAiSub &&
    resolvedAiSub.toLowerCase() !== 'ai' &&
    AI_SUB_SECTION_MAP[resolvedAiSub.toLowerCase()]
  ) {
    const subInfo = AI_SUB_SECTION_MAP[resolvedAiSub.toLowerCase()];
    const matchedCat = INITIAL_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === 'ai'
    );
    const subUrl = `${config.siteUrl}/AI/${subInfo.slug}/`;
    const subTitle = formatArticleTitle(subInfo.label, config.siteName);
    const socialTitle = `${subInfo.label} | ${config.siteName}`;
    const subDesc = formatMetaDescription(
      matchedCat?.description || CATEGORY_DESCRIPTIONS_FALLBACK.AI
    );

    return {
      status: 200,
      pageKind: 'ai-sub',
      title: subTitle,
      description: subDesc,
      canonical: subUrl,
      robots: 'index, follow',
      ogTitle: socialTitle,
      ogDescription: subDesc,
      ogImage: defaultLogoHttps,
      ogImageAlt: subInfo.label,
      ogUrl: subUrl,
      ogType: 'website',
      ogSiteName: config.siteName,
      ogLocale: 'ar_AR',
      twitterCard: 'summary_large_image',
      twitterSite: '@information_net',
      twitterTitle: socialTitle,
      twitterDescription: subDesc,
      twitterImage: defaultLogoHttps,
      schemaGraph: getCategoryGraphSchema(
        'AI',
        subInfo.label,
        subDesc,
        subUrl,
        config
      ),
      matchedCategorySlug: 'AI',
      matchedAiSubSlug: subInfo.slug,
    };
  }

  // 5. Category Page (/Downloads/, /AI/, /Blog/, /Business/, /Games/, /Software/, /Education/)
  if (resolvedCategory && resolvedCategory !== 'all') {
    const matchedCat = INITIAL_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === resolvedCategory.toLowerCase()
    );
    const canonicalSlug = matchedCat
      ? matchedCat.slug
      : Object.keys(CATEGORY_NAMES_FALLBACK).find(
          (k) => k.toLowerCase() === resolvedCategory.toLowerCase()
        ) || resolvedCategory;

    const isDownloads = canonicalSlug.toLowerCase() === 'downloads';
    const catName = isDownloads
      ? CATEGORY_NAMES_FALLBACK.Downloads
      : matchedCat?.name ||
        CATEGORY_NAMES_FALLBACK[canonicalSlug] ||
        canonicalSlug;
    const catDesc = formatMetaDescription(
      isDownloads
        ? CATEGORY_DESCRIPTIONS_FALLBACK.Downloads
        : matchedCat?.description ||
            CATEGORY_DESCRIPTIONS_FALLBACK[canonicalSlug] ||
            `تصفح أحدث وأبرز مقالات وشروحات قسم ${catName} في موقع العنكبوت للمعلومات.`
    );
    const catUrl = `${config.siteUrl}/${canonicalSlug}/`;
    const catFullTitle = formatArticleTitle(catName, config.siteName);
    const socialTitle = `${catName} | ${config.siteName}`;

    return {
      status: 200,
      pageKind: 'category',
      title: catFullTitle,
      description: catDesc,
      canonical: catUrl,
      robots: 'index, follow',
      ogTitle: socialTitle,
      ogDescription: catDesc,
      ogImage: defaultLogoHttps,
      ogImageAlt: catName,
      ogUrl: catUrl,
      ogType: 'website',
      ogSiteName: config.siteName,
      ogLocale: 'ar_AR',
      twitterCard: 'summary_large_image',
      twitterSite: '@information_net',
      twitterTitle: socialTitle,
      twitterDescription: catDesc,
      twitterImage: defaultLogoHttps,
      schemaGraph: isDownloads
        ? getDownloadsCollectionSchema(config)
        : getCategoryGraphSchema(
            canonicalSlug,
            catName,
            catDesc,
            catUrl,
            config
          ),
      matchedCategorySlug: canonicalSlug,
    };
  }

  // 6. Home Page (/)
  const homeDesc = formatMetaDescription(config.siteDescription);
  const homeUrl = `${config.siteUrl}/`;
  const homeSocialTitle =
    'العنكبوت للمعلومات - مدونة تقنية وتعليمية شاملة | العنكبوت للمعلومات';

  return {
    status: 200,
    pageKind: 'home',
    title: HOME_PAGE_TITLE,
    description: homeDesc,
    canonical: homeUrl,
    robots: 'index, follow',
    ogTitle: homeSocialTitle,
    ogDescription: homeDesc,
    ogImage: defaultLogoHttps,
    ogImageAlt: config.siteName,
    ogUrl: homeUrl,
    ogType: 'website',
    ogSiteName: config.siteName,
    ogLocale: 'ar_AR',
    twitterCard: 'summary_large_image',
    twitterSite: '@information_net',
    twitterTitle: homeSocialTitle,
    twitterDescription: homeDesc,
    twitterImage: defaultLogoHttps,
    schemaGraph: getHomeGraphSchema(config),
  };
}

/**
 * Strips all SEO, OpenGraph, Twitter Card, Canonical, Robots, and JSON-LD tags from <head>
 * so the central engine can inject a single, non-duplicated, conflict-free set of tags.
 */
function stripManagedHeadTags(html: string): string {
  return html
    .replace(/<!--SEO_HEAD_START-->[\s\S]*?<!--SEO_HEAD_END-->\s*/gi, '')
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, '')
    .replace(
      /<meta\b[^>]*\bname=["'](?:description|keywords|robots|twitter:[a-z0-9:_-]+)["'][^>]*>\s*/gi,
      ''
    )
    .replace(
      /<meta\b[^>]*\bcontent=["'][^"']*["'][^>]*\bname=["'](?:description|keywords|robots|twitter:[a-z0-9:_-]+)["'][^>]*>\s*/gi,
      ''
    )
    .replace(
      /<meta\b[^>]*\bproperty=["'](?:og:[a-z0-9:_-]+|article:[a-z0-9:_-]+)["'][^>]*>\s*/gi,
      ''
    )
    .replace(
      /<meta\b[^>]*\bcontent=["'][^"']*["'][^>]*\bproperty=["'](?:og:[a-z0-9:_-]+|article:[a-z0-9:_-]+)["'][^>]*>\s*/gi,
      ''
    )
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(
      /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
      ''
    );
}

/**
 * Injects the rendered head block at the very top of <head> right after <meta name="viewport">
 * so social media crawlers (Facebook, WhatsApp, X/Twitter, Telegram, LinkedIn) read the tags
 * within the first 500 bytes of the response before any scripts or styles.
 */
function injectHeadBlockAtTop(rawHtml: string, headBlock: string): string {
  const cleaned = stripManagedHeadTags(rawHtml);
  const wrappedBlock = `    <!--SEO_HEAD_START-->\n${headBlock}\n    <!--SEO_HEAD_END-->`;
  const viewportRegex = /(<meta\b[^>]*\bname=["']viewport["'][^>]*>)/i;
  if (viewportRegex.test(cleaned)) {
    return cleaned.replace(viewportRegex, `$1\n${wrappedBlock}`);
  }
  const headOpenRegex = /(<head\b[^>]*>)/i;
  if (headOpenRegex.test(cleaned)) {
    return cleaned.replace(headOpenRegex, `$1\n${wrappedBlock}`);
  }
  return cleaned.replace('</head>', `${wrappedBlock}\n  </head>`);
}

/**
 * Renders the authoritative, single-instance SEO & Social Meta Tags block for <head>
 */
function renderManagedHeadTags(meta: ResolvedPageMetadata): string {
  const lines: string[] = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${escapeHtml(meta.robots)}" />`,
  ];

  if (meta.keywords) {
    lines.push(`<meta name="keywords" content="${escapeHtml(meta.keywords)}" />`);
  }

  if (meta.canonical) {
    lines.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  }

  // Open Graph tags
  lines.push(`<meta property="og:type" content="${escapeHtml(meta.ogType)}" />`);
  lines.push(`<meta property="og:locale" content="${escapeHtml(meta.ogLocale)}" />`);
  lines.push(`<meta property="og:site_name" content="${escapeHtml(meta.ogSiteName)}" />`);
  lines.push(`<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`);
  lines.push(
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`
  );
  if (meta.ogUrl) {
    lines.push(`<meta property="og:url" content="${escapeHtml(meta.ogUrl)}" />`);
  }
  lines.push(`<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`);
  lines.push(
    `<meta property="og:image:secure_url" content="${escapeHtml(meta.ogImage)}" />`
  );
  lines.push(
    `<meta property="og:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />`
  );
  if (meta.ogImageWidth) {
    lines.push(
      `<meta property="og:image:width" content="${escapeHtml(meta.ogImageWidth)}" />`
    );
  }
  if (meta.ogImageHeight) {
    lines.push(
      `<meta property="og:image:height" content="${escapeHtml(meta.ogImageHeight)}" />`
    );
  }

  if (meta.articleMeta) {
    lines.push(
      `<meta property="article:published_time" content="${escapeHtml(
        meta.articleMeta.publishedTime
      )}" />`
    );
    lines.push(
      `<meta property="article:modified_time" content="${escapeHtml(
        meta.articleMeta.modifiedTime
      )}" />`
    );
    lines.push(
      `<meta property="article:section" content="${escapeHtml(
        meta.articleMeta.section
      )}" />`
    );
    lines.push(
      `<meta property="article:author" content="${escapeHtml(
        meta.articleMeta.author
      )}" />`
    );
    for (const tag of meta.articleMeta.tags) {
      lines.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
    }
  }

  // Twitter / X Card tags
  lines.push(`<meta name="twitter:card" content="${escapeHtml(meta.twitterCard)}" />`);
  lines.push(`<meta name="twitter:site" content="${escapeHtml(meta.twitterSite)}" />`);
  lines.push(
    `<meta name="twitter:title" content="${escapeHtml(meta.twitterTitle)}" />`
  );
  lines.push(
    `<meta name="twitter:description" content="${escapeHtml(
      meta.twitterDescription
    )}" />`
  );
  lines.push(
    `<meta name="twitter:image" content="${escapeHtml(meta.twitterImage)}" />`
  );
  lines.push(
    `<meta name="twitter:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />`
  );

  // Single JSON-LD @graph script
  if (meta.schemaGraph) {
    lines.push(
      `<script id="ssr-schema" type="application/ld+json">${JSON.stringify(
        meta.schemaGraph
      )}</script>`
    );
  }

  return lines.map((l) => `    ${l}`).join('\n');
}

/**
 * Updates head metadata and updates the single #ssr-schema JSON-LD script on the client
 * using the central resolvePageMetadata engine, with strict DOM deduplication.
 */
export function applySeoMetadata(
  post: Post | null,
  activeCategory: string = 'all',
  standalonePage: string | null = null,
  selectedDownloadApp: DownloadAppItem | null = null,
  config: SeoConfig = DEFAULT_SEO_CONFIG,
  activeAiSubTag: string = 'AI',
  selectedTool: SiteToolItem | null = null,
  isNotFound: boolean = false
) {
  if (typeof document === 'undefined') return;

  const meta = resolvePageMetadata(
    {
      post,
      activeCategory,
      activeAiSubTag,
      standalonePage,
      selectedDownloadApp,
      selectedTool,
      isNotFound,
    },
    config
  );

  document.title = meta.title;
  setUniqueMeta('name', 'description', meta.description);
  setUniqueMeta('name', 'robots', meta.robots);

  if (meta.keywords) {
    setUniqueMeta('name', 'keywords', meta.keywords);
  } else {
    removeMetaByAttr('name', 'keywords');
  }

  if (meta.canonical) {
    setUniqueCanonical(meta.canonical);
  } else {
    document
      .querySelectorAll('link[rel="canonical"]')
      .forEach((el) => el.remove());
  }

  setUniqueMeta('property', 'og:type', meta.ogType);
  setUniqueMeta('property', 'og:locale', meta.ogLocale);
  setUniqueMeta('property', 'og:site_name', meta.ogSiteName);
  setUniqueMeta('property', 'og:title', meta.ogTitle);
  setUniqueMeta('property', 'og:description', meta.ogDescription);
  if (meta.ogUrl) {
    setUniqueMeta('property', 'og:url', meta.ogUrl);
  } else {
    removeMetaByAttr('property', 'og:url');
  }
  setUniqueMeta('property', 'og:image', meta.ogImage);
  setUniqueMeta('property', 'og:image:secure_url', meta.ogImage);
  setUniqueMeta('property', 'og:image:alt', meta.ogImageAlt);

  if (meta.ogImageWidth) {
    setUniqueMeta('property', 'og:image:width', meta.ogImageWidth);
  } else {
    removeMetaByAttr('property', 'og:image:width');
  }
  if (meta.ogImageHeight) {
    setUniqueMeta('property', 'og:image:height', meta.ogImageHeight);
  } else {
    removeMetaByAttr('property', 'og:image:height');
  }

  if (meta.articleMeta) {
    setUniqueMeta(
      'property',
      'article:published_time',
      meta.articleMeta.publishedTime
    );
    setUniqueMeta(
      'property',
      'article:modified_time',
      meta.articleMeta.modifiedTime
    );
    setUniqueMeta('property', 'article:section', meta.articleMeta.section);
    setUniqueMeta('property', 'article:author', meta.articleMeta.author);
    updateArticleTags(meta.articleMeta.tags);
  } else {
    removeMetaByAttr('property', 'article:published_time');
    removeMetaByAttr('property', 'article:modified_time');
    removeMetaByAttr('property', 'article:section');
    removeMetaByAttr('property', 'article:author');
    updateArticleTags([]);
  }

  setUniqueMeta('name', 'twitter:card', meta.twitterCard);
  setUniqueMeta('name', 'twitter:site', meta.twitterSite);
  setUniqueMeta('name', 'twitter:title', meta.twitterTitle);
  setUniqueMeta('name', 'twitter:description', meta.twitterDescription);
  setUniqueMeta('name', 'twitter:image', meta.twitterImage);
  setUniqueMeta('name', 'twitter:image:alt', meta.ogImageAlt);

  if (meta.schemaGraph) {
    injectSingleSchema(meta.schemaGraph);
  } else {
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((el) => el.remove());
  }
}

interface ParsedRouteEntities {
  isKnown: boolean;
  post: Post | null;
  app: DownloadAppItem | null;
  tool: SiteToolItem | null;
  standalone: string | null;
  category: string;
  aiSub: string;
}

/**
 * Universal route parser supporting clean routes, trailing slashes, .html suffixes,
 * single-segment article slugs, cross-category aliases, Blogger /YYYY/MM/slug.html,
 * and query parameters (?post=, ?slug=, ?p=).
 */
export function parseRequestPathToEntities(rawPath: string): ParsedRouteEntities {
  const emptyResult: ParsedRouteEntities = {
    isKnown: false,
    post: null,
    app: null,
    tool: null,
    standalone: null,
    category: 'all',
    aiSub: 'AI',
  };

  const fullStr = String(rawPath || '/').trim();
  const [pathPartRaw, queryAndHash = ''] = fullStr.split('?');
  const queryPart = queryAndHash.split('#')[0] || '';

  // 1. Check if a query parameter explicitly specifies a post (?post=slug, ?slug=slug, ?p=id)
  if (queryPart) {
    try {
      const params = new URLSearchParams(queryPart);
      const qPost = (
        params.get('post') ||
        params.get('slug') ||
        params.get('article') ||
        params.get('p') ||
        ''
      )
        .replace(/\.html?$/i, '')
        .trim()
        .toLowerCase();
      if (qPost) {
        const matchedPostByQuery = INITIAL_POSTS.find(
          (p) =>
            p.slug.toLowerCase() === qPost || p.id.toLowerCase() === qPost
        );
        if (matchedPostByQuery) {
          return {
            ...emptyResult,
            isKnown: true,
            post: matchedPostByQuery,
            category: matchedPostByQuery.categorySlug,
          };
        }
      }
    } catch {
      // Ignore malformed query string
    }
  }

  let decodedPath = pathPartRaw.split('#')[0] || '/';
  try {
    decodedPath = decodeURIComponent(decodedPath);
  } catch {
    // Keep raw if percent encoding is malformed
  }

  const clean = decodedPath
    .replace(/\/index\.html?$/i, '')
    .replace(/\.html?$/i, '')
    .replace(/^\/+|\/+$/g, '')
    .trim();

  if (!clean) {
    return { ...emptyResult, isKnown: true, category: 'all' };
  }

  const parts = clean.split('/');
  if (parts.some((p) => !p)) {
    return emptyResult;
  }

  const standalonePages = ['about', 'contact', 'privacy', 'terms', 'sitemap'];

  // Single segment: /tools, /about, /Blog, or direct /<post-slug>
  if (parts.length === 1) {
    const seg = parts[0].toLowerCase();

    if (seg === 'tools') {
      return { ...emptyResult, isKnown: true, category: 'tools' };
    }

    if (standalonePages.includes(seg)) {
      return { ...emptyResult, isKnown: true, standalone: seg };
    }

    const matchedCat = INITIAL_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === seg
    );
    if (matchedCat) {
      return { ...emptyResult, isKnown: true, category: matchedCat.slug };
    }

    const sampleCatPost = INITIAL_POSTS.find(
      (p) => p.categorySlug.toLowerCase() === seg
    );
    if (sampleCatPost) {
      return {
        ...emptyResult,
        isKnown: true,
        category: sampleCatPost.categorySlug,
      };
    }

    // Direct single-segment post slug fallback (e.g. /1xbet-apple-of-fortune-hack)
    const directPost = INITIAL_POSTS.find(
      (p) => p.slug.toLowerCase() === seg
    );
    if (directPost) {
      return {
        ...emptyResult,
        isKnown: true,
        post: directPost,
        category: directPost.categorySlug,
      };
    }

    return emptyResult;
  }

  // Two segments: /tools/<slug>, /Downloads/<appSlug>, /AI/<subSection>, /p/<standalone>, or /<category>/<postSlug>
  if (parts.length === 2) {
    const seg0 = parts[0].toLowerCase();
    const seg1 = parts[1].toLowerCase();

    if (seg0 === 'p' && standalonePages.includes(seg1)) {
      return { ...emptyResult, isKnown: true, standalone: seg1 };
    }

    if (seg0 === 'tools') {
      const matchedTool = getToolBySlug(seg1);
      if (matchedTool) {
        return {
          ...emptyResult,
          isKnown: true,
          tool: matchedTool,
          category: 'tools',
        };
      }
      return emptyResult;
    }

    if (
      seg0 === 'ai' &&
      (seg1 === 'aprompt-generator' || seg1 === 'ai-prompt-generator')
    ) {
      const matchedAiTool = getToolBySlug(seg1);
      if (matchedAiTool) {
        return {
          ...emptyResult,
          isKnown: true,
          tool: matchedAiTool,
          category: 'tools',
        };
      }
    }

    if (seg0 === 'downloads' || seg0 === 'software') {
      const matchedApp = DOWNLOAD_APPS.find(
        (a) => a.slug.toLowerCase() === seg1
      );
      if (matchedApp) {
        return {
          ...emptyResult,
          isKnown: true,
          app: matchedApp,
          category: 'Downloads',
        };
      }
    }

    if (seg0 === 'ai' && AI_SUB_SECTION_MAP[seg1]) {
      return {
        ...emptyResult,
        isKnown: true,
        category: 'AI',
        aiSub: AI_SUB_SECTION_MAP[seg1].slug,
      };
    }

    // Exact category + slug match first
    const exactPost = INITIAL_POSTS.find(
      (p) =>
        p.categorySlug.toLowerCase() === seg0 &&
        p.slug.toLowerCase() === seg1
    );
    if (exactPost) {
      return {
        ...emptyResult,
        isKnown: true,
        post: exactPost,
        category: exactPost.categorySlug,
      };
    }

    // Cross-category alias match (e.g. /Blog/apple-fortune-1xbet or /Downloads/download-quran-offline-free)
    const isValidCatPrefix =
      INITIAL_CATEGORIES.some((c) => c.slug.toLowerCase() === seg0) ||
      INITIAL_POSTS.some((p) => p.categorySlug.toLowerCase() === seg0) ||
      ['blog', 'downloads', 'software', 'games', 'education', 'ai', 'business', 'post', 'posts', 'article', 'articles'].includes(seg0);

    if (isValidCatPrefix) {
      const postBySlug = INITIAL_POSTS.find(
        (p) => p.slug.toLowerCase() === seg1
      );
      if (postBySlug) {
        return {
          ...emptyResult,
          isKnown: true,
          post: postBySlug,
          category: postBySlug.categorySlug,
        };
      }
    }

    return emptyResult;
  }

  // Three segments: legacy Blogger /YYYY/MM/<postSlug>
  if (
    parts.length === 3 &&
    /^\d{4}$/.test(parts[0]) &&
    /^\d{1,2}$/.test(parts[1])
  ) {
    const seg2 = parts[2].toLowerCase();
    const legacyPost = INITIAL_POSTS.find(
      (p) => p.slug.toLowerCase() === seg2
    );
    if (legacyPost) {
      return {
        ...emptyResult,
        isKnown: true,
        post: legacyPost,
        category: legacyPost.categorySlug,
      };
    }
  }

  return emptyResult;
}

export function isKnownRoute(path: string): boolean {
  return parseRequestPathToEntities(path).isKnown;
}

export function renderNotFoundHtml(
  html: string,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): string {
  const meta404 = resolvePageMetadata({ isNotFound: true }, config);
  const headBlock = renderManagedHeadTags(meta404);

  const topPostsList = INITIAL_POSTS.slice(0, 5)
    .map(
      (p) =>
        `<li><a href="/${escapeHtml(p.categorySlug)}/${escapeHtml(
          p.slug
        )}">${escapeHtml(p.title)}</a></li>`
    )
    .join('\n          ');

  let html404 = injectHeadBlockAtTop(html, headBlock);
  html404 = html404.replace(
    /<div\s+id=["']root["']\s*>[\s\S]*?<\/div>/i,
    `<div id="root">
      <main dir="rtl" lang="ar">
        <h1>404 - عذراً، الصفحة التي تبحث عنها غير موجودة</h1>
        <p>${escapeHtml(meta404.description)}</p>
        <nav aria-label="روابط سريعة">
          <ul>
            <li><a href="/">العودة إلى الصفحة الرئيسية</a></li>
            <li><a href="/Blog/">المدونة والمقالات</a></li>
            <li><a href="/tools/">أدوات العنكبوت للمعلومات</a></li>
            <li><a href="/AI/">قسم الذكاء الاصطناعي</a></li>
            <li><a href="/Downloads/">التحميلات والبرامج</a></li>
            <li><a href="/sitemap">خريطة الموقع الكاملة</a></li>
          </ul>
        </nav>
        <h2>أحدث المقالات المقترحة</h2>
        <ul>
          ${topPostsList}
        </ul>
      </main>
    </div>`
  );

  return html404;
}

export function getRouteHttpStatus(requestPath: string): number {
  return isKnownRoute(requestPath) ? 200 : 404;
}

function getCategoryPostsForSsr(catSlug: string): Post[] {
  const lower = catSlug.toLowerCase();
  if (lower === 'blog') {
    return INITIAL_POSTS.filter((p) =>
      ['blog', 'education', 'games'].includes(p.categorySlug.toLowerCase())
    );
  }
  if (lower === 'downloads') {
    return INITIAL_POSTS.filter((p) =>
      ['downloads', 'software'].includes(p.categorySlug.toLowerCase())
    );
  }
  return INITIAL_POSTS.filter((p) => p.categorySlug.toLowerCase() === lower);
}

/**
 * Server-Side SEO Injector: transforms index.html per URL route using the central
 * resolvePageMetadata engine, stripping all duplicate/previous tags and injecting
 * a single conflict-free set of SEO, OpenGraph, Twitter Card, Canonical, and JSON-LD tags.
 */
export function injectServerSideSeo(
  rawHtml: string,
  requestPath: string,
  config: SeoConfig = DEFAULT_SEO_CONFIG
): string {
  if (!isKnownRoute(requestPath)) {
    return renderNotFoundHtml(rawHtml, config);
  }

  const meta = resolvePageMetadata({ requestPath }, config);
  let ssrContentHtml = '';

  if (meta.pageKind === 'tool' && meta.matchedTool) {
    const t = meta.matchedTool;
    const guidesHtml = t.guideSections
      .map((sec) => {
        const pHtml = (sec.paragraphs || [])
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join('\n');
        const ulHtml =
          sec.bullets && sec.bullets.length > 0
            ? `<ul>${sec.bullets
                .map((b) => `<li>${escapeHtml(b)}</li>`)
                .join('')}</ul>`
            : '';
        return `<h2>${escapeHtml(sec.heading)}</h2>\n${pHtml}\n${ulHtml}`;
      })
      .join('\n');

    const faqsHtml =
      t.faqs && t.faqs.length > 0
        ? `<h2>الأسئلة الشائعة حول ${escapeHtml(t.name)}</h2>\n` +
          t.faqs
            .map(
              (f) =>
                `<h3>${escapeHtml(f.question)}</h3>\n<p>${escapeHtml(
                  f.answer
                )}</p>`
            )
            .join('\n')
        : '';

    const toolImgHtml =
      t.imageUrl && (!t.articleHtml || !/<img\b/i.test(t.articleHtml))
        ? `<figure><img src="${escapeHtml(t.imageUrl)}" alt="${escapeHtml(
            t.h1Title
          )}" /></figure>`
        : '';

    const mainGuideBody = t.articleHtml
      ? `${toolImgHtml ? `${toolImgHtml}\n` : ''}${t.articleHtml}`
      : `${toolImgHtml}
        <p>${escapeHtml(t.introText)}</p>
        <p><strong>توضيح تقني:</strong> ${escapeHtml(t.executionNotice)}</p>
        ${guidesHtml}
        ${faqsHtml}`;

    ssrContentHtml = `
      <div dir="rtl" lang="ar">
        <nav aria-label="Breadcrumb"><a href="/">الرئيسية</a> &rsaquo; <a href="/tools/">الأدوات</a> &rsaquo; <span>${escapeHtml(
          t.name
        )}</span></nav>
        <h1>${escapeHtml(t.h1Title)}</h1>
        ${mainGuideBody}
        <h2>أدوات ذات صلة</h2>
        <ul>
          ${SITE_TOOLS.filter((item) => t.relatedToolSlugs.includes(item.slug))
            .map(
              (rel) =>
                `<li><a href="${escapeHtml(rel.path)}">${escapeHtml(
                  rel.name
                )}</a> - ${escapeHtml(rel.shortDescription)}</li>`
            )
            .join('\n')}
        </ul>
      </div>
    `;
  } else if (meta.pageKind === 'tools-index') {
    ssrContentHtml = `
      <section dir="rtl" lang="ar">
        <nav aria-label="Breadcrumb"><a href="/">الرئيسية</a> &rsaquo; <span>الأدوات</span></nav>
        <h1>أدوات العنكبوت للمعلومات: أدوات ويب ذكية ومجانية في متصفحك</h1>
        <p>${escapeHtml(meta.description)}</p>
        <h2>قائمة الأدوات المتاحة (9 أدوات)</h2>
        <ul>
          ${SITE_TOOLS.map(
            (t) =>
              `<li><a href="${escapeHtml(t.path)}">${escapeHtml(
                t.name
              )}</a> - ${escapeHtml(t.shortDescription)}</li>`
          ).join('\n')}
        </ul>
      </section>
    `;
  } else if (meta.pageKind === 'download-app' && meta.matchedApp) {
    const matchedApp = meta.matchedApp;
    const renderedSectionsHtml = (matchedApp.articleSections || [])
      .map((sec) => {
        const pHtml = (sec.paragraphs || [])
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join('\n');
        const subHtml = (sec.subSections || [])
          .map(
            (sub) =>
              `<h3>${escapeHtml(sub.subHeading)}</h3>\n<p>${escapeHtml(
                sub.text
              )}</p>`
          )
          .join('\n');
        const ulHtml =
          sec.bullets && sec.bullets.length > 0
            ? `<ul>${sec.bullets
                .map((b) => `<li>${escapeHtml(b)}</li>`)
                .join('')}</ul>`
            : '';
        return `<h2>${escapeHtml(sec.heading)}</h2>\n${pHtml}\n${subHtml}\n${ulHtml}`;
      })
      .join('\n');

    const renderedFaqsHtml =
      matchedApp.faqs && matchedApp.faqs.length > 0
        ? `<h2>الأسئلة الشائعة حول ${escapeHtml(matchedApp.arabicName)}</h2>\n` +
          matchedApp.faqs
            .map(
              (faq) =>
                `<h3>${escapeHtml(faq.question)}</h3>\n<p>${escapeHtml(
                  faq.answer
                )}</p>`
            )
            .join('\n')
        : '';

    const breadcrumbItemsHtml = getAppBreadcrumbs(matchedApp)
      .map((item, idx, arr) =>
        idx < arr.length - 1
          ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a>`
          : `<span>${escapeHtml(item.name)}</span>`
      )
      .join(' &rsaquo; ');

    ssrContentHtml = `
      <article dir="rtl" lang="ar">
        <nav aria-label="Breadcrumb">${breadcrumbItemsHtml}</nav>
        <h1>${escapeHtml(matchedApp.h1Title)}</h1>
        <p><strong>المطور:</strong> ${escapeHtml(matchedApp.developer)} | <strong>التقييم:</strong> ${escapeHtml(matchedApp.rating)} (${escapeHtml(matchedApp.reviewsCountText)}) | <strong>التحميلات:</strong> ${escapeHtml(matchedApp.downloads)} | <strong>الإصدار:</strong> ${escapeHtml(matchedApp.version)} | <strong>الحجم:</strong> ${escapeHtml(matchedApp.size)}</p>
        ${matchedApp.fullDescription.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')}
        ${renderedSectionsHtml}
        ${renderedFaqsHtml}
        <p><a href="${escapeHtml(matchedApp.googlePlayUrl)}" rel="noopener noreferrer">تحميل ${escapeHtml(matchedApp.arabicName)} من متجر Google Play الرسمي</a></p>
        <h2>تطبيقات مشابهة</h2>
        <ul>
          ${DOWNLOAD_APPS.map((a) => `<li><a href="/Downloads/${a.slug}">${escapeHtml(a.h1Title)}</a> - ${escapeHtml(a.shortDescription)}</li>`).join('')}
        </ul>
      </article>
    `;
  } else if (meta.pageKind === 'post' && meta.matchedPost) {
    ssrContentHtml = renderFullArticleSsrHtml(meta.matchedPost);
  } else if (meta.pageKind === 'standalone' && meta.matchedStandaloneKey) {
    const spTitle = STANDALONE_TITLES[meta.matchedStandaloneKey] || meta.title;
    ssrContentHtml = `
      <section dir="rtl" lang="ar">
        <h1>${escapeHtml(spTitle)}</h1>
        <p>${escapeHtml(meta.description)}</p>
        <ul>
          ${INITIAL_CATEGORIES.map((c) => `<li><a href="/${c.slug}/">${escapeHtml(c.name)}</a></li>`).join('\n')}
        </ul>
      </section>
    `;
  } else if (meta.pageKind === 'ai-sub' && meta.matchedAiSubSlug) {
    const subInfo =
      AI_SUB_SECTION_MAP[meta.matchedAiSubSlug.toLowerCase()] || {
        label: meta.ogImageAlt,
      };
    const catPosts = getCategoryPostsForSsr('AI');
    ssrContentHtml = `
      <section dir="rtl" lang="ar">
        <h1>${escapeHtml(subInfo.label)}</h1>
        <p>${escapeHtml(meta.description)}</p>
        <ul>
          ${catPosts.map((p) => `<li><a href="/${p.categorySlug}/${p.slug}">${escapeHtml(p.title)}</a></li>`).join('\n')}
        </ul>
      </section>
    `;
  } else if (meta.pageKind === 'category' && meta.matchedCategorySlug) {
    if (meta.matchedCategorySlug.toLowerCase() === 'downloads') {
      const dlPosts = getCategoryPostsForSsr('Downloads');
      ssrContentHtml = `
        <section dir="rtl" lang="ar">
          <h1>تطبيقات العنكبوت - دليل تحميل التطبيقات وألعاب مجانا</h1>
          <p>${escapeHtml(meta.description)}</p>
          <h2>أحدث التطبيقات والألعاب المتوفرة للتحميل</h2>
          <ul>
            ${DOWNLOAD_APPS.map(
              (a) =>
                `<li><a href="/Downloads/${a.slug}">${escapeHtml(a.arabicName)}</a> - ${escapeHtml(a.shortDescription)}</li>`
            ).join('\n')}
            ${dlPosts.map((p) => `<li><a href="/${p.categorySlug}/${p.slug}">${escapeHtml(p.title)}</a></li>`).join('\n')}
          </ul>
        </section>
      `;
    } else {
      const catPosts = getCategoryPostsForSsr(meta.matchedCategorySlug);
      ssrContentHtml = `
        <section dir="rtl" lang="ar">
          <h1>${escapeHtml(meta.ogImageAlt)}</h1>
          <p>${escapeHtml(meta.description)}</p>
          <ul>
            ${catPosts.map((p) => `<li><a href="/${p.categorySlug}/${p.slug}">${escapeHtml(p.title)}</a></li>`).join('\n')}
          </ul>
        </section>
      `;
    }
  } else {
    const latestTen = INITIAL_POSTS.slice(0, 10);
    ssrContentHtml = `
      <section dir="rtl" lang="ar">
        <h1>العنكبوت للمعلومات - مدونة تقنية وتعليمية شاملة</h1>
        <p>${escapeHtml(meta.description)}</p>
        <h2>أحدث المقالات</h2>
        <ul>
          ${latestTen.map((p) => `<li><a href="/${p.categorySlug}/${p.slug}">${escapeHtml(p.title)}</a></li>`).join('\n')}
        </ul>
        <h2>أقسام الموقع</h2>
        <ul>
          ${INITIAL_CATEGORIES.map((c) => `<li><a href="/${c.slug}/">${escapeHtml(c.name)}</a></li>`).join('\n')}
        </ul>
      </section>
    `;
  }

  const headBlock = renderManagedHeadTags(meta);
  let html = injectHeadBlockAtTop(rawHtml, headBlock);

  if (ssrContentHtml) {
    html = html.replace(
      /<div\s+id=["']root["']\s*>[\s\S]*?<\/div>/i,
      `<div id="root">${ssrContentHtml}</div>`
    );
  }

  return html;
}

function sanitizeArticleHtml(dirtyHtml: string): string {
  const preCleaned = String(dirtyHtml || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<\/?article\b[^>]*>/gi, '')
    .replace(/<h1(\b[^>]*)>([\s\S]*?)<\/h1>/gi, '<h2$1>$2</h2>');

  const purified = DOMPurify.sanitize(preCleaned, {
    FORBID_TAGS: [
      'script',
      'style',
      'iframe',
      'object',
      'embed',
      'meta',
      'link',
      'article',
      'h1',
    ],
    FORBID_ATTR: [
      'style',
      'onclick',
      'ondblclick',
      'onmousedown',
      'onmouseup',
      'onmouseover',
      'onmousemove',
      'onmouseout',
      'onmouseenter',
      'onmouseleave',
      'onkeydown',
      'onkeypress',
      'onkeyup',
      'onload',
      'onerror',
      'onunload',
      'onabort',
      'onfocus',
      'onblur',
      'onchange',
      'onsubmit',
      'onreset',
      'onselect',
      'oninput',
      'oncontextmenu',
    ],
  });

  return purified
    .replace(/\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/<(script|style|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe)\b[^>]*\/?>/gi, '');
}

function renderParagraphOrHtml(block: string): string {
  const trimmed = String(block || '').trim();
  if (!trimmed) return '';
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    const clean = sanitizeArticleHtml(trimmed);
    return /^<(p|h2|h3|h4|ul|ol|blockquote|div|table|figure)\b/i.test(
      clean.trim()
    )
      ? clean
      : `<p>${clean}</p>`;
  }
  return `<p>${escapeHtml(trimmed)}</p>`;
}

export function renderFullArticleSsrHtml(post: Post): string {
  const parts: string[] = [`<h1>${escapeHtml(post.title)}</h1>`];

  const hasRawContent = Boolean(
    post.rawContent && post.rawContent.trim().length > 0
  );
  const isPlaceholderSections =
    post.content?.sections?.length === 1 &&
    post.content.sections[0].id === 'section-main';

  if (hasRawContent && isPlaceholderSections) {
    parts.push(sanitizeArticleHtml(post.rawContent!));
  } else {
    if (post.content?.intro) {
      const introParagraphs = post.content.intro
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
      for (const p of introParagraphs) {
        parts.push(renderParagraphOrHtml(p));
      }
    }

    if (post.content?.sections && post.content.sections.length > 0) {
      for (const sec of post.content.sections) {
        if (sec.title) {
          parts.push(`<h2>${escapeHtml(sec.title)}</h2>`);
        }
        for (const bodyItem of sec.body || []) {
          parts.push(renderParagraphOrHtml(bodyItem));
        }
        if (sec.note?.text) {
          parts.push(`<p>${escapeHtml(sec.note.text)}</p>`);
        }
      }
    }

    if (hasRawContent) {
      parts.push(sanitizeArticleHtml(post.rawContent!));
    }
  }

  return `<article dir="rtl" lang="ar">\n${parts.join('\n')}\n</article>`;
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setUniqueMeta(attr: 'name' | 'property', key: string, value: string) {
  const allMatching = Array.from(
    document.head.querySelectorAll(`meta[${attr}="${key}"]`)
  );
  let primary = allMatching[0] as HTMLMetaElement | undefined;
  // Remove any duplicate instances
  for (let i = 1; i < allMatching.length; i++) {
    allMatching[i].remove();
  }
  if (!primary) {
    primary = document.createElement('meta');
    primary.setAttribute(attr, key);
    document.head.appendChild(primary);
  }
  primary.setAttribute('content', value);
}

function removeMetaByAttr(attr: 'name' | 'property', key: string) {
  document.head
    .querySelectorAll(`meta[${attr}="${key}"]`)
    .forEach((el) => el.remove());
}

function updateArticleTags(tags: string[]) {
  document.head
    .querySelectorAll('meta[property="article:tag"]')
    .forEach((el) => el.remove());
  (tags || []).forEach((tag) => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'article:tag');
    meta.setAttribute('content', tag);
    document.head.appendChild(meta);
  });
}

function setUniqueCanonical(url: string) {
  const allCanonicals = Array.from(
    document.head.querySelectorAll('link[rel="canonical"]')
  );
  let primary = allCanonicals[0] as HTMLLinkElement | undefined;
  for (let i = 1; i < allCanonicals.length; i++) {
    allCanonicals[i].remove();
  }
  if (!primary) {
    primary = document.createElement('link');
    primary.setAttribute('rel', 'canonical');
    document.head.appendChild(primary);
  }
  primary.setAttribute('href', url);
}

function injectSingleSchema(data: object) {
  const allLdScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  allLdScripts.forEach((el) => {
    if (el.id !== 'ssr-schema') {
      el.remove();
    }
  });

  let script = document.getElementById(
    'ssr-schema'
  ) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'ssr-schema';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

