/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  ArrowRight,
  Sparkles,
  Flame,
  Gamepad2,
  Cpu,
  HelpCircle,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  Columns,
  FileCode,
  Maximize2,
  ExternalLink,
  Layers,
  ArrowUp,
  Briefcase,
  Lightbulb,
  ShoppingBag,
  Megaphone,
  Bookmark,
  Wrench,
  Image as ImageIcon,
  Barcode,
  Zap,
  Download,
} from 'lucide-react';

import { Post, CategoryInfo } from './types';
import { INITIAL_POSTS, INITIAL_CATEGORIES } from './data/posts';
import { Header } from './components/Header';
import { NewsTicker } from './components/NewsTicker';
import { FeaturedSlider } from './components/FeaturedSlider';
import { Sidebar } from './components/Sidebar';
import { PostPageView } from './components/PostPageView';
import { ImageLightbox } from './components/ImageLightbox';
import { SearchModal } from './components/SearchModal';
import { RedirectToolModal } from './components/RedirectToolModal';
import { ContactModal } from './components/ContactModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PagesModal, PageType } from './components/PagesModal';
import { MobileDrawer } from './components/MobileDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { SeoSchemaViewerModal } from './components/SeoSchemaViewerModal';
import { SitemapModal } from './components/SitemapModal';
import { HomeCategorySection } from './components/HomeCategorySection';
import { StandalonePageView } from './components/StandalonePageView';
import { DownloadsSectionView } from './components/DownloadsSectionView';
import { AppDownloadPageView } from './components/AppDownloadPageView';
import { ToolsSectionView } from './components/ToolsSectionView';
import { NotFoundPageView } from './components/NotFoundPageView';
import { DOWNLOAD_APPS, DownloadAppItem } from './data/downloadsApps';
import { SITE_TOOLS, SiteToolItem, getToolBySlug } from './data/toolsData';

import { AdSenseUnit } from './components/AdSenseUnit';
import { StandalonePageType } from './types';
import { applySeoMetadata } from './utils/seo';
import { useFavorites } from './hooks/useFavorites';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Theme state with localStorage sync
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('mode') === 'dark';
  });

  // Modals & Tools state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRedirectToolOpen, setIsRedirectToolOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSeoViewerOpen, setIsSeoViewerOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title?: string } | null>(null);
  const [activePage, setActivePage] = useState<PageType | null>(null);

  // Article Feed View Style (matching SeoPlus BlogStylePosts: 1=wide classic, 2=grid, 3=compact)
  const [feedLayout, setFeedLayout] = useState<'classic' | 'grid' | 'compact'>('classic');


  // Pagination / Load More
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // AI Sub-Tags configuration (Main section /AI/ with nested /AI/Tools/, /AI/Downloads/, /AI/Earning/, /AI/Tools-Comparison/)
  const AI_SUB_TAGS = [
    {
      label: 'الذكاء الاصطناعي AI',
      slug: 'AI',
      path: '/AI/',
      icon: Sparkles,
      postSlugs: [
        'google-ai-pro-price-saudi',
        'get-google-gemini-students-free-ai-pro',
        'october-war-video-ai',
        'chatgpt-prompts',
        'google-ai-review',
        'best-free-ai-video-creation-sites',
        'artificial-intelligence-will-change-our-lives',
        'bing-ai-chat',
        'profit-chatgpt-open-ai',
      ],
    },
    {
      label: 'أدوات AI',
      slug: 'Tools',
      path: '/AI/Tools/',
      icon: Cpu,
      postSlugs: [
        'google-ai-pro-price-saudi',
        'october-war-video-ai',
        'chatgpt-prompts',
        'best-free-ai-video-creation-sites',
        'get-google-gemini-students-free-ai-pro',
        'bing-ai-chat',
      ],
    },
    {
      label: 'تحميلات AI',
      slug: 'Downloads',
      path: '/AI/Downloads/',
      icon: FileCode,
      postSlugs: [
        'get-google-gemini-students-free-ai-pro',
        'bing-ai-chat',
      ],
    },
    {
      label: 'الربح AI',
      slug: 'Earning',
      path: '/AI/Earning/',
      icon: Flame,
      postSlugs: [
        'profit-chatgpt-open-ai',
      ],
    },
    {
      label: 'مقارنات AI',
      slug: 'Tools-Comparison',
      path: '/AI/Tools-Comparison/',
      icon: Layers,
      postSlugs: [
        'google-ai-review',
        'best-free-ai-video-creation-sites',
        'artificial-intelligence-will-change-our-lives',
      ],
    },
  ];

  // Helper to normalize category slugs to the main sections
  const normalizeCategorySlug = (cat: string) => {
    if (!cat || cat === 'all' || cat === 'الكل') return 'all';
    if (cat === 'tools' || cat === 'Tools' || cat === 'الأدوات') return 'tools';
    if (
      cat === 'Downloads' ||
      cat === 'Software' ||
      cat === 'التحميلات' ||
      cat === 'البرامج'
    ) {
      return 'Downloads';
    }
    if (
      cat === 'AI' ||
      cat === 'الذكاء الاصطناعي' ||
      AI_SUB_TAGS.some(
        (t) =>
          t.slug.toLowerCase() === cat.toLowerCase() ||
          t.label === cat ||
          t.label.replace(/\s*AI$/i, '') === cat ||
          `ai-${t.slug}`.toLowerCase() === cat.toLowerCase() ||
          `ai/${t.slug}`.toLowerCase() === cat.toLowerCase()
      )
    ) {
      return 'AI';
    }
    if (cat === 'Business' || cat === 'المال والأعمال' || cat === 'الربح من الإنترنت') return 'Business';
    if (
      cat === 'Blog' ||
      cat === 'المدونة' ||
      cat === 'Education' ||
      cat === 'مقالات تعليمية' ||
      cat === 'Games' ||
      cat === 'الألعاب'
    ) {
      return 'Blog';
    }
    return cat;
  };

  // Helper to get existing posts belonging to each of the 4 main sections without altering post URLs
  const getSectionPosts = (sectionSlug: string, aiSubTag: string = 'AI'): Post[] => {
    const norm = normalizeCategorySlug(sectionSlug);
    if (norm === 'all') return INITIAL_POSTS;
    if (norm === 'Downloads') {
      return INITIAL_POSTS.filter(
        (p) =>
          p.categorySlug === 'Software' ||
          p.categorySlug === 'Downloads' ||
          p.category === 'التحميلات'
      );
    }
    if (norm === 'Blog') {
      return [
        ...INITIAL_POSTS.filter((p) => p.categorySlug === 'Blog'),
        ...INITIAL_POSTS.filter((p) => p.categorySlug === 'Education'),
        ...INITIAL_POSTS.filter((p) => p.categorySlug === 'Games'),
      ];
    }
    if (norm === 'AI' && aiSubTag && aiSubTag !== 'AI') {
      const matchedSubTag = AI_SUB_TAGS.find(
        (t) =>
          t.slug.toLowerCase() === aiSubTag.toLowerCase() ||
          t.label === aiSubTag ||
          t.label.replace(/\s*AI$/i, '') === aiSubTag
      );
      if (matchedSubTag) {
        const baseLabel = matchedSubTag.label.replace(/\s*AI$/i, '');
        return INITIAL_POSTS.filter(
          (p) =>
            (p.categorySlug === 'AI' || p.category === 'AI') &&
            (p.tags.includes(matchedSubTag.label) ||
              p.tags.includes(baseLabel) ||
              matchedSubTag.postSlugs.includes(p.slug))
        );
      }
    }
    return INITIAL_POSTS.filter(
      (p) => p.categorySlug === norm || p.category === norm
    );
  };

  // Clear Arabic labels for internal navigation links to existing articles
  const ARTICLE_NAV_LABELS: Record<string, string> = {
    '1xbet-apple-of-fortune-hack': 'هكر اكس بت: سكربت التفاحة تحميل مجانا | Hack 1xBet Apple of Fortune',
    'best-free-mobile-vpn': 'أفضل تطبيقات VPN مجانية للأندرويد والآيفون: مقارنة عملية',
    'google-ai-pro-price-saudi': 'أسعار اشتراك Google AI Pro في السعودية وطرق الدفع',
    'get-google-gemini-students-free-ai-pro': 'اشتراك Google Gemini للطلاب وتفعيل AI Pro مجاناً',
    'chatgpt-prompts': 'أسرار وأكواد ChatGPT المخفية للاستخدام الاحترافي',
    'google-ai-review': 'مراجعة وتجربة أدوات جوجل للذكاء الاصطناعي Google AI',
    'best-free-ai-video-creation-sites': 'أفضل مواقع إنشاء فيديوهات بالذكاء الاصطناعي مجاناً',
    'bing-ai-chat': 'شرح دردشة Bing AI من مايكروسوفت وطريقة استخدامها',
    'profit-chatgpt-open-ai': 'طرق الربح من ChatGPT وتقنيات OpenAI',
    'october-war-video-ai': 'طريقة عمل فيديوهات حرب أكتوبر بالذكاء الاصطناعي',
    'artificial-intelligence-will-change-our-lives': 'مستقبل الذكاء الاصطناعي وكيف سيغير حياتنا',
    'best-high-cpc-niches-adsense': 'أفضل المجالات للربح من جوجل أدسنس وأعلى التخصصات ربحاً',
    'highest-adsense-keywords': 'أفضل الكلمات المفتاحية للربح من أدسنس وأكثر المجالات ربحاً',
    'profit-from-amazon': 'الربح من أمازون: أفضل طرق كسب المال من سوق Amazon',
    'new-jobs-with-great-pay': 'أفضل الوظائف العالمية برواتب مجزية وفرص العمل الحديثة',
    'telegram-channels-for-making-money': 'أفضل قنوات الربح من تيليجرام وطرق تحقيق الدخل',
    '1xbet-website-problem': 'حل مشكلة إغلاق موقع 1xBet على الكمبيوتر والمتصفح',
    'scooter-maintenance': 'طريقة صيانة بطارية السكوتر والدراجات الكهربائية في المنزل',
    'best-power-banks-guide': 'دليل اختيار أفضل شاحن متنقل (باور بانك) للهواتف والسفر',
    'qatar-travel-guide': 'دليل السياحة في قطر: أفضل الأماكن للعائلات والأفراد',
    'hidden-places-saudi-arabia': 'أماكن سياحية مخفية في السعودية: 20 وجهة تستحق الزيارة',
    'how-to-boost-4g-mobile-signal': 'كيفية زيادة سرعة الإنترنت وتقوية إشارة الجيل الرابع 4G',
    'reasons-for-ban-pubg-mobile': 'أسباب حظر حساب ببجي موبايل وكيفية فك الباند مجاناً',
    'best-5-entertainment-games-kwait': 'أفضل 5 ألعاب تسلية وترفيه للهاتف في الكويت',
    'best-free-game-recharge-sites': 'أفضل المواقع الموثوقة لشحن رصيد الألعاب مجاناً',
    'earning-from-pubg-mobile': 'طرق الربح من ببجي موبايل وكسب أموال حقيقية',
    'best-earning-games-libya': 'أفضل 5 ألعاب للربح من الإنترنت في ليبيا',
    'best-travel-apps-qatar': 'تحميل أفضل تطبيقات السياحة والمواصلات والفنادق في قطر',
    'download-quran-offline-free': 'تحميل تطبيق القرآن الكريم بدون إنترنت للآيفون والأندرويد',
    'threads-instagram': 'تنزيل وشرح استخدام تطبيق ثريدز Threads انستغرام الجديد',
    'download-pinterest-videos': 'أفضل أداة لتحميل فيديوهات وصور Pinterest مجاناً',
    'download-1xbet-app-new-update': 'تحديث تطبيق 1xBet الجديد: المميزات وطرق الاستخدام الذكي',
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('mode', 'dark');
      document.body.classList.add('dark');
      localStorage.setItem('mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('mode', 'light');
      document.body.classList.remove('dark');
      localStorage.setItem('mode', 'light');
    }
  }, [darkMode]);

  // Parse current URL (supports clean /Blog/, /Downloads/slug, /tools/slug, or /AI/slug paths, .html, query params, and backward-compatible hashes)
  const parseUrlToState = () => {
    if (typeof window === 'undefined') {
      return {
        post: null,
        downloadApp: null,
        tool: null,
        category: 'all',
        aiSubTag: 'AI',
        standalone: null as StandalonePageType | null,
        isNotFound: false,
        cleanPath: '/',
      };
    }

    // Check query parameters (?post=slug, ?slug=slug, ?p=id) first
    if (window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
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
          const matchedByQuery = INITIAL_POSTS.find(
            (p) => p.slug.toLowerCase() === qPost || p.id.toLowerCase() === qPost
          );
          if (matchedByQuery) {
            return {
              post: matchedByQuery,
              downloadApp: null,
              tool: null,
              category: normalizeCategorySlug(matchedByQuery.categorySlug),
              aiSubTag: 'AI',
              standalone: null as StandalonePageType | null,
              isNotFound: false,
              cleanPath: `/${matchedByQuery.categorySlug}/${matchedByQuery.slug}`,
            };
          }
        }
      } catch {
        // Ignore malformed search query
      }
    }

    let rawPath = window.location.pathname || '/';
    try {
      rawPath = decodeURIComponent(rawPath);
    } catch {
      // Keep raw if malformed encoding
    }
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();

    // If pathname is root '/' but there is an old hash (e.g. #Games/ or #AI/slug), prefer the hash
    let target = rawPath;
    if ((rawPath === '/' || !rawPath) && rawHash) {
      target = '/' + rawHash;
    }

    const clean = target
      .replace(/\/index\.html?$/i, '')
      .replace(/\.html?$/i, '')
      .replace(/^\/+|\/+$/g, '')
      .trim();

    if (!clean) {
      return {
        post: null,
        downloadApp: null,
        tool: null,
        category: 'all',
        aiSubTag: 'AI',
        standalone: null as StandalonePageType | null,
        isNotFound: false,
        cleanPath: '/',
      };
    }

    if (clean === '404') {
      return {
        post: null,
        downloadApp: null,
        tool: null,
        category: 'all',
        aiSubTag: 'AI',
        standalone: null as StandalonePageType | null,
        isNotFound: true,
        cleanPath: window.location.pathname || '/404',
      };
    }

    const standalonePages: StandalonePageType[] = ['about', 'contact', 'privacy', 'terms', 'sitemap'];
    const matchedStandalone = standalonePages.find(
      (p) => p.toLowerCase() === clean.toLowerCase() || `p/${p.toLowerCase()}` === clean.toLowerCase()
    );
    if (matchedStandalone) {
      return {
        post: null,
        downloadApp: null,
        tool: null,
        category: 'all',
        aiSubTag: 'AI',
        standalone: matchedStandalone,
        isNotFound: false,
        cleanPath: `/${matchedStandalone}`,
      };
    }

    if (/^sitemap([_-][a-z]+)?\.xml$/i.test(clean)) {
      return {
        post: null,
        downloadApp: null,
        tool: null,
        category: 'all',
        aiSubTag: 'AI',
        standalone: 'sitemap' as StandalonePageType,
        isNotFound: false,
        cleanPath: `/${clean}`,
      };
    }

    const cleanParts = clean.split('/');

    // Check /AI/aprompt-generator or any tool matching custom path
    if (
      cleanParts.length === 2 &&
      cleanParts[0].toLowerCase() === 'ai' &&
      (cleanParts[1].toLowerCase() === 'aprompt-generator' ||
        cleanParts[1].toLowerCase() === 'ai-prompt-generator')
    ) {
      const matchedAiTool = getToolBySlug(cleanParts[1]);
      if (matchedAiTool) {
        return {
          post: null,
          downloadApp: null,
          tool: matchedAiTool,
          category: 'tools',
          aiSubTag: 'AI',
          standalone: null as StandalonePageType | null,
          isNotFound: false,
          cleanPath: matchedAiTool.path,
        };
      }
    }

    // Check /tools/ directory or /tools/<slug> tool page
    if (cleanParts[0].toLowerCase() === 'tools') {
      if (cleanParts.length === 1) {
        return {
          post: null,
          downloadApp: null,
          tool: null,
          category: 'tools',
          aiSubTag: 'AI',
          standalone: null as StandalonePageType | null,
          isNotFound: false,
          cleanPath: '/tools/',
        };
      }
      if (cleanParts.length === 2) {
        const matchedTool = getToolBySlug(cleanParts[1]);
        if (matchedTool) {
          return {
            post: null,
            downloadApp: null,
            tool: matchedTool,
            category: 'tools',
            aiSubTag: 'AI',
            standalone: null as StandalonePageType | null,
            isNotFound: false,
            cleanPath: matchedTool.path,
          };
        }
      }
      return {
        post: null,
        downloadApp: null,
        tool: null,
        category: 'all',
        aiSubTag: 'AI',
        standalone: null as StandalonePageType | null,
        isNotFound: true,
        cleanPath: window.location.pathname,
      };
    }

    // Check dedicated app download pages: /Downloads/<appSlug>
    if (
      cleanParts.length === 2 &&
      (cleanParts[0].toLowerCase() === 'downloads' || cleanParts[0].toLowerCase() === 'software')
    ) {
      const matchedDownloadApp = DOWNLOAD_APPS.find(
        (app) => app.slug.toLowerCase() === cleanParts[1].toLowerCase()
      );
      if (matchedDownloadApp) {
        return {
          post: null,
          downloadApp: matchedDownloadApp,
          tool: null,
          category: 'Downloads',
          aiSubTag: 'AI',
          standalone: null as StandalonePageType | null,
          isNotFound: false,
          cleanPath: `/Downloads/${matchedDownloadApp.slug}`,
        };
      }
    }

    // Check AI sub-tags (e.g. /AI/, /AI/Tools/, /AI/Downloads/, /AI/Earning/, /AI/Tools-Comparison/, or legacy /AI-Tools/)
    const potentialAiSubTag =
      cleanParts.length === 2 && cleanParts[0].toLowerCase() === 'ai'
        ? cleanParts[1]
        : clean.replace(/^ai-/i, '');
    const matchedAiSubTag = AI_SUB_TAGS.find(
      (t) =>
        (cleanParts[0].toLowerCase() === 'ai' || clean.toLowerCase().startsWith('ai-')) &&
        t.slug.toLowerCase() === potentialAiSubTag.toLowerCase()
    );
    if (matchedAiSubTag && cleanParts.length <= 2) {
      return {
        post: null,
        downloadApp: null,
        tool: null,
        category: 'AI',
        aiSubTag: matchedAiSubTag.slug,
        standalone: null as StandalonePageType | null,
        isNotFound: false,
        cleanPath: matchedAiSubTag.path,
      };
    }

    const officialCategories = ['AI', 'Games', 'Software', 'Downloads', 'Business', 'Blog', 'Education'];

    // 1. Direct official category match (e.g. /Blog/ or /AI/ or /Downloads/)
    if (cleanParts.length === 1) {
      const matchedCat = officialCategories.find(
        (c) => c.toLowerCase() === clean.toLowerCase()
      );
      if (matchedCat) {
        const normCat = normalizeCategorySlug(matchedCat);
        return {
          post: null,
          downloadApp: null,
          tool: null,
          category: normCat,
          aiSubTag: 'AI',
          standalone: null as StandalonePageType | null,
          isNotFound: false,
          cleanPath: `/${normCat}/`,
        };
      }
    }

    // 2. Check if path is {category}/{slug}, /YYYY/MM/{slug}, or single-segment {slug}
    const postSlug = cleanParts[cleanParts.length - 1];
    const isSingleSeg = cleanParts.length === 1;
    const isValidTwoSeg =
      cleanParts.length === 2 &&
      [
        ...officialCategories.map((c) => c.toLowerCase()),
        'post',
        'posts',
        'article',
        'articles',
      ].includes(cleanParts[0].toLowerCase());
    const isLegacyBloggerThreeSeg =
      cleanParts.length === 3 &&
      /^\d{4}$/.test(cleanParts[0]) &&
      /^\d{1,2}$/.test(cleanParts[1]);

    if (isSingleSeg || isValidTwoSeg || isLegacyBloggerThreeSeg) {
      const foundPost = INITIAL_POSTS.find(
        (p) =>
          p.slug.toLowerCase() === postSlug.toLowerCase() ||
          p.slug.toLowerCase() === clean.toLowerCase()
      );
      if (foundPost) {
        return {
          post: foundPost,
          downloadApp: null,
          tool: null,
          category: normalizeCategorySlug(foundPost.categorySlug),
          aiSubTag: 'AI',
          standalone: null as StandalonePageType | null,
          isNotFound: false,
          cleanPath: `/${foundPost.categorySlug}/${foundPost.slug}`,
        };
      }
    }

    // Any unmatched URL renders the dedicated 404 Not Found Page
    return {
      post: null,
      downloadApp: null,
      tool: null,
      category: 'all',
      aiSubTag: 'AI',
      standalone: null as StandalonePageType | null,
      isNotFound: true,
      cleanPath: window.location.pathname,
    };
  };

  // Initialize route state synchronously on first render so client mount never flashes or overwrites article SEO/OG tags with homepage tags
  const initialRoute = useMemo(() => parseUrlToState(), []);
  const [activeCategory, setActiveCategory] = useState<string>(initialRoute.category);
  const [activeAiSubTag, setActiveAiSubTag] = useState<string>(initialRoute.aiSubTag);
  const [selectedPost, setSelectedPost] = useState<Post | null>(initialRoute.post);
  const [selectedDownloadApp, setSelectedDownloadApp] = useState<DownloadAppItem | null>(initialRoute.downloadApp);
  const [selectedTool, setSelectedTool] = useState<SiteToolItem | null>(initialRoute.tool);
  const [standalonePage, setStandalonePage] = useState<StandalonePageType | null>(initialRoute.standalone);
  const [isNotFound, setIsNotFound] = useState<boolean>(initialRoute.isNotFound);

  // Dynamic SEO & Schema.org JSON-LD Injection
  useEffect(() => {
    applySeoMetadata(
      selectedPost,
      activeCategory,
      standalonePage,
      selectedDownloadApp,
      undefined,
      activeAiSubTag,
      selectedTool,
      isNotFound
    );
  }, [selectedPost, activeCategory, standalonePage, selectedDownloadApp, activeAiSubTag, selectedTool, isNotFound]);

  // Initial Deep-Link URL listener & Back/Forward button popstate support
  useEffect(() => {
    const handlePopState = () => {
      const { post, downloadApp, tool, category, aiSubTag, standalone, isNotFound: notFound, cleanPath } = parseUrlToState();
      setSelectedPost(post);
      setSelectedDownloadApp(downloadApp);
      setSelectedTool(tool);
      setActiveCategory(category);
      setActiveAiSubTag(aiSubTag);
      setStandalonePage(standalone);
      setIsNotFound(notFound);

      // Clean legacy route hash or non-standard slashes on valid known routes only,
      // while preserving in-page semantic TOC anchor hashes (e.g. #what-is-ai) on article pages
      const isArticleTocHash =
        Boolean(post) &&
        Boolean(window.location.hash) &&
        /^#[a-z0-9]+(?:-[a-z0-9]+)*$/.test(window.location.hash);
      const targetUrl = isArticleTocHash ? `${cleanPath}${window.location.hash}` : cleanPath;
      if (!notFound && `${window.location.pathname}${window.location.hash}` !== targetUrl) {
        window.history.replaceState(null, '', targetUrl);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Currently active Category object
  const currentCategoryInfo = useMemo(() => {
    const norm = normalizeCategorySlug(activeCategory);
    return INITIAL_CATEGORIES.find(
      (c) => c.slug === norm || c.name === activeCategory
    );
  }, [activeCategory]);

  // Filtered posts based on active category and AI sub-tag
  const filteredPosts = useMemo(() => {
    return getSectionPosts(activeCategory, activeAiSubTag);
  }, [activeCategory, activeAiSubTag]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setIsLoadingMore(false);
    }, 600);
  };

  // Category change handler with clean path URL (/Blog/, /AI/, /Business/, /Downloads/, /tools/ or AI sub-tags)
  const handleSelectCategory = (cat: string) => {
    setIsNotFound(false);
    if (cat === 'tools' || cat === 'Tools' || cat === 'الأدوات') {
      setActiveCategory('tools');
      setActiveAiSubTag('AI');
      setSelectedPost(null);
      setSelectedDownloadApp(null);
      setSelectedTool(null);
      setStandalonePage(null);
      const targetPath = '/tools/';
      if (window.location.pathname !== targetPath || window.location.hash) {
        window.history.pushState(null, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isMainDownloads =
      cat === 'Downloads' ||
      cat === 'Software' ||
      cat === 'التحميلات' ||
      cat === 'البرامج';

    const matchedAiSubTag = !isMainDownloads
      ? AI_SUB_TAGS.find(
          (t) =>
            t.slug !== 'AI' &&
            (t.slug.toLowerCase() === cat.toLowerCase() ||
              t.label === cat ||
              t.label.replace(/\s*AI$/i, '') === cat ||
              `ai-${t.slug}`.toLowerCase() === cat.toLowerCase() ||
              `ai/${t.slug}`.toLowerCase() === cat.toLowerCase())
        )
      : undefined;
    if (matchedAiSubTag) {
      handleSelectAiSubTag(matchedAiSubTag.slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const norm = normalizeCategorySlug(cat);
    setActiveCategory(norm);
    setActiveAiSubTag('AI');
    setSelectedPost(null);
    setSelectedDownloadApp(null);
    setSelectedTool(null);
    setStandalonePage(null);
    setVisibleCount(6);

    const targetPath = norm === 'all' ? '/' : `/${norm}/`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Tool selection handler (/tools/<slug>)
  const handleSelectTool = (toolSlug: string) => {
    const foundTool = getToolBySlug(toolSlug);
    if (!foundTool) return;

    setIsNotFound(false);
    setSelectedTool(foundTool);
    setSelectedPost(null);
    setSelectedDownloadApp(null);
    setStandalonePage(null);
    setActiveCategory('tools');

    const targetPath = foundTool.path;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Sub-Tag selection handler (keeps fixed nested English URLs: /AI/, /AI/Tools/, /AI/Downloads/, /AI/Earning/, /AI/Tools-Comparison/)
  const handleSelectAiSubTag = (subTagSlug: string) => {
    const matched = AI_SUB_TAGS.find(
      (t) =>
        t.slug === subTagSlug ||
        t.label === subTagSlug ||
        t.label.replace(/\s*AI$/i, '') === subTagSlug
    );
    const resolvedSlug = matched ? matched.slug : 'AI';
    const targetPath = matched ? matched.path : '/AI/';
    setIsNotFound(false);
    setActiveCategory('AI');
    setActiveAiSubTag(resolvedSlug);
    setSelectedPost(null);
    setSelectedDownloadApp(null);
    setSelectedTool(null);
    setStandalonePage(null);
    setVisibleCount(8);

    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
  };

  // Dedicated Download App selection handler (/Downloads/<slug>)
  const handleSelectDownloadApp = (appSlug: string) => {
    const foundApp = DOWNLOAD_APPS.find(
      (a) => a.slug.toLowerCase() === appSlug.toLowerCase()
    );
    if (!foundApp) return;

    setIsNotFound(false);
    setSelectedDownloadApp(foundApp);
    setSelectedPost(null);
    setSelectedTool(null);
    setStandalonePage(null);
    setActiveCategory('Downloads');

    const targetPath = `/Downloads/${foundApp.slug}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Post selection handler with clean path URL (preserves original /{categorySlug}/{slug})
  const handleSelectPost = (post: Post) => {
    setIsNotFound(false);
    setSelectedPost(post);
    setSelectedDownloadApp(null);
    setSelectedTool(null);
    setStandalonePage(null);
    setActiveCategory(normalizeCategorySlug(post.categorySlug));

    const targetPath = `/${post.categorySlug}/${post.slug}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to home / category handler
  const handleBackToHome = () => {
    setIsNotFound(false);
    setSelectedPost(null);
    setSelectedDownloadApp(null);
    setSelectedTool(null);
    setStandalonePage(null);
    const norm = normalizeCategorySlug(activeCategory);
    const targetPath = norm !== 'all' ? `/${norm}/` : '/';
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Standalone Page handler
  const handleOpenStandalonePage = (pageType: StandalonePageType) => {
    setIsNotFound(false);
    setStandalonePage(pageType);
    setSelectedPost(null);
    setSelectedDownloadApp(null);
    setSelectedTool(null);
    const targetPath = `/${pageType}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0f1424] text-[#0f172a] dark:text-gray-100 transition-colors duration-300 pb-16 lg:pb-0">
      
      {/* 1. Main Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRedirectTool={() => setIsRedirectToolOpen(true)}
        onOpenStandalonePage={handleOpenStandalonePage}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 2. Container Site Wrapper */}
      <main
        className={
          !isNotFound && !standalonePage && !selectedPost && !selectedDownloadApp && !selectedTool && activeCategory === 'Downloads'
            ? 'flex-1 w-full pb-20 lg:pb-0'
            : 'flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 pb-20 lg:pb-8'
        }
      >
        
        {/* 404 Not Found Page View for Non-Existent Routes */}
        {isNotFound ? (
          <NotFoundPageView
            posts={INITIAL_POSTS}
            onGoHome={() => handleSelectCategory('all')}
            onSelectCategory={handleSelectCategory}
            onSelectPost={handleSelectPost}
            onSelectTool={handleSelectTool}
            onSelectDownloadApp={handleSelectDownloadApp}
            onOpenStandalonePage={handleOpenStandalonePage}
          />
        ) : standalonePage ? (
          <StandalonePageView
            pageType={standalonePage}
            posts={INITIAL_POSTS}
            categories={INITIAL_CATEGORIES}
            onSelectPost={handleSelectPost}
            onSelectCategory={handleSelectCategory}
            onGoHome={handleBackToHome}
            onNavigatePage={handleOpenStandalonePage}
          />
        ) : selectedTool || activeCategory === 'tools' ? (
          <ToolsSectionView
            selectedTool={selectedTool}
            onSelectTool={handleSelectTool}
            onBackToToolsIndex={() => handleSelectCategory('tools')}
            onBackToHome={() => handleSelectCategory('all')}
          />
        ) : selectedDownloadApp ? (
          <AppDownloadPageView
            app={selectedDownloadApp}
            allPosts={INITIAL_POSTS}
            onSelectApp={handleSelectDownloadApp}
            onBackToDownloads={() => handleSelectCategory('Downloads')}
            onBackToHome={() => handleSelectCategory('all')}
            onSelectPost={handleSelectPost}
            onOpenLightbox={(url, title) => setLightboxImage({ url, title })}
            onOpenSeoViewer={() => setIsSeoViewerOpen(true)}
          />
        ) : selectedPost ? (
          <PostPageView
            post={selectedPost}
            allPosts={INITIAL_POSTS}
            categories={INITIAL_CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => handleSelectCategory(cat)}
            onSelectPost={handleSelectPost}
            onBackToHome={handleBackToHome}
            onOpenSeoViewer={() => setIsSeoViewerOpen(true)}
            onOpenImage={(url, title) => setLightboxImage({ url, title })}
            onOpenRedirectTool={() => setIsRedirectToolOpen(true)}
            onSearchQuery={() => setIsSearchOpen(true)}
          />
        ) : activeCategory === 'Downloads' ? (
          <DownloadsSectionView
            posts={filteredPosts}
            allPosts={INITIAL_POSTS}
            onSelectPost={handleSelectPost}
            onSelectApp={handleSelectDownloadApp}
            onOpenSeoViewer={() => setIsSeoViewerOpen(true)}
          />
        ) : activeCategory === 'all' ? (
          /* HOMEPAGE VIEW — Exact Design-D Layout */
          <div>
            {/* 1. Hero Discovery + Search + Category Pills + Featured & Most Viewed */}
            <FeaturedSlider
              posts={INITIAL_POSTS}
              onSelectPost={handleSelectPost}
              onSelectCategory={handleSelectCategory}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* 2. Section: أحدث المقالات (3-Column Grid) */}
            <section className="mb-8 sm:mb-12">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 sm:h-6 rounded-full bg-[#f97316]" />
                  <h2 className="text-lg sm:text-2xl font-extrabold text-[#0f172a] dark:text-white font-heading">
                    أحدث المقالات
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory('Blog')}
                  className="text-xs font-bold text-[#0284c7] hover:underline cursor-pointer"
                >
                  عرض الكل ←
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {INITIAL_POSTS.slice(0, 3).map((post, idx) => {
                  const catColors = [
                    'text-[#8b5cf6]',
                    'text-[#f97316]',
                    'text-[#0284c7]',
                  ];
                  const viewsList = ['18.7K', '12.5K', '25.3K'];

                  return (
                    <article
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className="group bg-white dark:bg-[#181e36] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-xs hover:shadow-md hover:border-[#0284c7] transition-all cursor-pointer flex flex-col"
                    >
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-3 flex items-center justify-center">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="px-1.5 pb-1 text-right flex-1 flex flex-col justify-between">
                        <div>
                          <span
                            className={`text-xs font-bold mb-1.5 block ${
                              catColors[idx % catColors.length]
                            }`}
                          >
                            {post.category}
                          </span>
                          <h3 className="text-sm sm:text-base font-extrabold text-[#0f172a] dark:text-white group-hover:text-[#0284c7] transition-colors line-clamp-2 leading-snug font-heading">
                            {post.title}
                          </h3>
                        </div>

                        <div className="text-[11px] text-slate-400 mt-3 font-medium">
                          {post.isoDate || post.date} · {viewsList[idx % viewsList.length]} مشاهدة
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* 3. Section: المزيد من المقالات (2-Column Asymmetric Layout: Right List + Left Free Tools & App CTA) */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 sm:h-6 rounded-full bg-[#f97316]" />
                  <h2 className="text-lg sm:text-2xl font-extrabold text-[#0f172a] dark:text-white font-heading">
                    المزيد من المقالات
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCategory('Blog')}
                  className="text-xs font-bold text-[#0284c7] hover:underline cursor-pointer"
                >
                  عرض الكل ←
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                {/* Right Column (2/3 in RTL): Horizontal Articles List */}
                <div className="lg:col-span-2">
                  <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                    {INITIAL_POSTS.slice(3, 3 + visibleCount).map((post, idx) => {
                      const rowCatColors = [
                        'text-[#10b981]',
                        'text-[#ef4444]',
                        'text-[#0ea5e9]',
                        'text-[#8b5cf6]',
                      ];
                      const rowViews = ['9.4K', '7.1K', '6.2K', '8.5K', '11.2K', '5.9K'];

                      return (
                        <article
                          key={post.id}
                          onClick={() => handleSelectPost(post)}
                          className="py-3.5 sm:py-5 first:pt-1 flex items-center justify-between gap-3 sm:gap-6 cursor-pointer group"
                        >
                          {/* Right side: Text */}
                          <div className="flex-1 min-w-0 text-right">
                            <span
                              className={`text-[11px] sm:text-xs font-bold mb-1 sm:mb-1.5 block ${
                                rowCatColors[idx % rowCatColors.length]
                              }`}
                            >
                              {post.category}
                            </span>
                            <h3 className="text-sm sm:text-lg font-extrabold text-[#0f172a] dark:text-white group-hover:text-[#0284c7] transition-colors line-clamp-2 leading-snug font-heading">
                              {post.title}
                            </h3>
                            <div className="text-[11px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2 font-medium">
                              {post.isoDate || post.date} · {rowViews[idx % rowViews.length]} مشاهدة
                            </div>
                          </div>

                          {/* Left side: Pure Uncropped Thumbnail */}
                          <div className="w-28 sm:w-44 aspect-video rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900 shadow-2xs flex items-center justify-center">
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {3 + visibleCount < INITIAL_POSTS.length && (
                    <div className="pt-5 sm:pt-6 text-center">
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-6 sm:px-7 py-2.5 rounded-xl bg-white dark:bg-[#181e36] hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white shadow-2xs hover:border-[#0284c7] transition-all cursor-pointer"
                      >
                        {isLoadingMore ? 'جاري التحميل...' : 'عرض المزيد من المقالات'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Left Column (1/3 in RTL): Free Tools Widget + Install App Card */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-5">
                  {/* Card 1: أدوات مجانية */}
                  <div className="bg-white dark:bg-[#181e36] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-[#0f172a] dark:text-white mb-3 font-heading">
                      <Wrench className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      <span>أدوات مجانية</span>
                    </div>

                    <div className="divide-y divide-dashed divide-slate-200 dark:divide-slate-800">
                      {[
                        {
                          label: 'ضغط الصور',
                          slug: 'image-compressor',
                          icon: ImageIcon,
                          iconColor: 'text-slate-700 dark:text-slate-200',
                        },
                        {
                          label: 'مولد الباركود',
                          slug: 'barcode-generator',
                          icon: Barcode,
                          iconColor: 'text-slate-700 dark:text-slate-200',
                        },
                        {
                          label: 'اختبار السرعة',
                          slug: 'internet-speed-test',
                          icon: Zap,
                          iconColor: 'text-amber-500 fill-amber-500',
                        },
                        {
                          label: 'تحميل الفيديو',
                          slug: 'youtube-downloader',
                          icon: Download,
                          iconColor: 'text-slate-700 dark:text-slate-200',
                        },
                      ].map((tool) => {
                        const IconComp = tool.icon;
                        return (
                          <button
                            key={tool.slug}
                            type="button"
                            onClick={() => handleSelectTool(tool.slug)}
                            className="w-full py-3 first:pt-2 last:pb-1 flex items-center gap-3 text-right hover:text-[#0284c7] transition-colors cursor-pointer group"
                          >
                            <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-sky-50 dark:group-hover:bg-slate-700 transition-colors">
                              <IconComp className={`w-4 h-4 ${tool.iconColor}`} />
                            </span>
                            <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#0284c7]">
                              {tool.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card 2: حمّل تطبيق الموقع */}
                  <div className="bg-gradient-to-br from-[#0284c7] via-[#2563eb] to-[#4f46e5] rounded-2xl p-5 sm:p-6 text-center text-white shadow-md">
                    <h3 className="text-base font-extrabold font-heading">
                      حمّل تطبيق الموقع
                    </h3>
                    <p className="text-xs text-blue-100 mt-1 mb-4">
                      تصفّح أسرع وبدون إنترنت
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        if (isInstallable) {
                          await install();
                        } else {
                          handleSelectCategory('Downloads');
                        }
                      }}
                      className="px-6 py-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      {isInstalled ? 'التطبيق مثبّت' : 'تثبيت التطبيق'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <AdSenseUnit key="ad-home-bottom" slotType="bottom" postId="home-bottom" />
          </div>
        ) : (
          /* Category Feeds View (AI, Business, Blog, Software) */
          <>
            {/* News Ticker Bar (Sp-shreet) */}
            <NewsTicker
              posts={INITIAL_POSTS}
              onSelectPost={handleSelectPost}
            />

            {/* Interactive Category Banner - Clean dark navy card without image shading */}
            {activeCategory !== 'all' && currentCategoryInfo && (
              <div className="mb-6 sm:mb-10">
                <div className="relative bg-[#0b1120] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-800">
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 p-5 sm:p-10">
                    <div className="flex-1 text-right w-full">
                      {/* Breadcrumb */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-blue-100/90 mb-4 font-bold">
                        <div className="flex items-center gap-2">
                          <a
                            href="/"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectCategory('all');
                            }}
                            className="hover:text-white transition-colors cursor-pointer"
                          >
                            الرئيسية
                          </a>
                          <span>/</span>
                          <a
                            href={`/${currentCategoryInfo.slug}/`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentCategoryInfo.slug === 'AI') {
                                handleSelectAiSubTag('AI');
                              } else {
                                handleSelectCategory(currentCategoryInfo.slug);
                              }
                            }}
                            className="text-white hover:underline cursor-pointer"
                          >
                            {currentCategoryInfo.name}
                          </a>
                          {currentCategoryInfo.slug === 'AI' && activeAiSubTag !== 'AI' && (
                            <>
                              <span>/</span>
                              <span className="text-amber-300">
                                {AI_SUB_TAGS.find((t) => t.slug === activeAiSubTag)?.label}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Section Title */}
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                        {currentCategoryInfo.name}
                      </h1>

                      {/* Section Description directly below Title with clear, harmonious typography */}
                      <p className="text-white/95 text-base sm:text-lg lg:text-xl font-medium leading-loose max-w-3xl">
                        {currentCategoryInfo.description}
                      </p>

                      {/* Extra spacing between Description and Internal Navigation Area */}
                      <nav
                        aria-label={`التنقل الداخلي في قسم ${currentCategoryInfo.name}`}
                        className="mt-8 sm:mt-10 pt-6 border-t border-white/20"
                      >
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                          {currentCategoryInfo.slug === 'AI'
                            ? AI_SUB_TAGS.map((tag) => {
                                const TagIcon = tag.icon;
                                const isActive = activeAiSubTag === tag.slug;
                                return (
                                  <a
                                    key={tag.slug}
                                    href={tag.path}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleSelectAiSubTag(tag.slug);
                                    }}
                                    className={`group px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all backdrop-blur-sm flex items-center gap-2.5 shadow-sm cursor-pointer ${
                                      isActive
                                        ? 'bg-white text-[#035dcd] border-white shadow-md scale-[1.02]'
                                        : 'bg-white/15 hover:bg-white text-white hover:text-[#035dcd] border-white/25'
                                    }`}
                                  >
                                    <TagIcon
                                      className={`w-4 h-4 transition-colors shrink-0 ${
                                        isActive
                                          ? 'text-[#035dcd]'
                                          : 'text-amber-300 group-hover:text-[#035dcd]'
                                      }`}
                                    />
                                    <span>{tag.label}</span>
                                  </a>
                                );
                              })
                            : (currentCategoryInfo.slug === 'Business'
                                ? [
                                    {
                                      label: 'العمل الحر',
                                      icon: Briefcase,
                                      slug: 'telegram-channels-for-making-money',
                                    },
                                    {
                                      label: 'أفكار',
                                      icon: Lightbulb,
                                      slug: 'new-jobs-with-great-pay',
                                    },
                                    {
                                      label: 'التجارة الإلكترونية',
                                      icon: ShoppingBag,
                                      slug: 'profit-from-amazon',
                                    },
                                    {
                                      label: 'التسويق',
                                      icon: Megaphone,
                                      slug: 'best-high-cpc-niches-adsense',
                                    },
                                  ]
                                : currentCategoryInfo.slug === 'Blog'
                                  ? [
                                      {
                                        label: 'شروحات الشبكات والإنترنت',
                                        icon: Cpu,
                                        slug: 'how-to-boost-4g-mobile-signal',
                                      },
                                      {
                                        label: 'أدلة الأجهزة والصيانة',
                                        icon: Layers,
                                        slug: 'scooter-maintenance',
                                      },
                                      {
                                        label: 'أدلة السفر والسياحة',
                                        icon: Sparkles,
                                        slug: 'qatar-travel-guide',
                                      },
                                      {
                                        label: 'شروحات وحلول الألعاب',
                                        icon: Gamepad2,
                                        slug: 'reasons-for-ban-pubg-mobile',
                                      },
                                    ]
                                  : [
                                      {
                                        label: 'تطبيقات السفر والمواصلات',
                                        icon: Sparkles,
                                        slug: 'best-travel-apps-qatar',
                                      },
                                      {
                                        label: 'تطبيق القرآن الكريم بدون نت',
                                        icon: FileCode,
                                        slug: 'download-quran-offline-free',
                                      },
                                      {
                                        label: 'تطبيق ثريدز Threads',
                                        icon: Users,
                                        slug: 'threads-instagram',
                                      },
                                      {
                                        label: 'أدوات تحميل الفيديو والصور',
                                        icon: ExternalLink,
                                        slug: 'download-pinterest-videos',
                                      },
                                    ]
                              ).map((item) => {
                                const TagIcon = item.icon;
                                const targetPost = INITIAL_POSTS.find(
                                  (p) => p.slug === item.slug
                                );
                                const href = targetPost
                                  ? `/${targetPost.categorySlug}/${targetPost.slug}`
                                  : `/${currentCategoryInfo.slug}/`;
                                return (
                                  <a
                                    key={item.label}
                                    href={href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (targetPost) {
                                        handleSelectPost(targetPost);
                                      }
                                    }}
                                    className="group px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#035dcd] border border-white/25 text-xs sm:text-sm font-bold transition-all backdrop-blur-sm flex items-center gap-2.5 shadow-sm cursor-pointer"
                                  >
                                    <TagIcon className="w-4 h-4 text-amber-300 group-hover:text-[#035dcd] transition-colors shrink-0" />
                                    <span>{item.label}</span>
                                  </a>
                                );
                              })}
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>

                {/* AdSense Unit immediately after banner (only when category has articles) */}
                {displayedPosts.length > 0 && (
                  <div className="mt-8">
                    <AdSenseUnit
                      key={`ad-cat-top-${activeCategory}-${activeAiSubTag}`}
                      slotType="top"
                      postId={`cat-top-${activeCategory}-${activeAiSubTag}`}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Main Content Layout: Two Columns (Main Content + Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start mt-6 w-full max-w-full">
              
              {/* Main Content Column (Spans 2 columns on desktop) */}
              <div className="lg:col-span-2 w-full space-y-8 overflow-visible">
                
                {/* DEDICATED SECTION VIEW (AI, Business, Blog, Software) */}
                <div className="space-y-6">

                      {/* View Layout Switcher (SeoPlus BlogStylePosts) - Hidden on mobile as requested */}
                      <div className="hidden sm:flex p-5 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-100 dark:border-[#2f366b] shadow-sm flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-gray-400 font-medium">
                          عرض مقالات القسم حسب التنسيق المفضل لديك:
                        </span>

                        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-[#1e2348] border border-gray-200 dark:border-[#384180] text-xs">
                          <button
                            onClick={() => setFeedLayout('classic')}
                            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                              feedLayout === 'classic'
                                ? 'bg-[#035dcd] text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                            title="عرض كلاسيكي عريض (سيو بلس)"
                          >
                            <Columns className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline font-bold">عريض</span>
                          </button>

                          <button
                            onClick={() => setFeedLayout('grid')}
                            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                              feedLayout === 'grid'
                                ? 'bg-[#035dcd] text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                            title="عرض شبكي (Grid)"
                          >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline font-bold">شبكة</span>
                          </button>

                          <button
                            onClick={() => setFeedLayout('compact')}
                            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                              feedLayout === 'compact'
                                ? 'bg-[#035dcd] text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                            title="عرض مضغوط وموجز"
                          >
                            <List className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline font-bold">موجز</span>
                          </button>
                        </div>
                      </div>


                    {/* Section Articles Feed */}
                    {displayedPosts.length === 0 ? (
                      <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#252a54] border border-gray-100 dark:border-[#2f366b]">
                        <p className="text-gray-500 font-bold">لا توجد مقالات حالياً في هذا القسم</p>
                        <button
                          onClick={() => handleSelectCategory('all')}
                          className="mt-3 px-4 py-2 rounded-xl bg-[#035dcd] text-white text-xs font-bold"
                        >
                          العودة للرئيسية
                        </button>
                      </div>
                    ) : feedLayout === 'classic' ? (
                      /* Style 1: Wide Classic Cards */
                      <div className="space-y-4">
                        {displayedPosts.map((post) => (
                          <article
                            key={post.id}
                            className="group bg-white dark:bg-[#252a54] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-[#2f366b] transition-all flex flex-col sm:flex-row items-stretch"
                          >
                            <div
                              onClick={() => handleSelectPost(post)}
                              className="relative sm:w-72 sm:min-w-[280px] aspect-video sm:aspect-auto overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900 cursor-pointer flex items-center justify-center"
                            >
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-3 right-3 flex flex-wrap items-center gap-1.5">
                                <span className={`text-xs font-bold text-white px-2.5 py-1 rounded shadow-md cat-badge-${post.categoryIndex}`}>
                                  {post.category}
                                </span>
                                {post.categorySlug === 'AI' &&
                                  post.tags
                                    .filter((t) => t !== 'الذكاء الاصطناعي' && t !== 'AI')
                                    .map((subLabel) => (
                                      <span
                                        key={subLabel}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectCategory(subLabel);
                                        }}
                                        className="text-[11px] font-bold text-white bg-slate-900/80 hover:bg-[#035dcd] backdrop-blur-xs px-2.5 py-1 rounded shadow-md transition-colors cursor-pointer"
                                      >
                                        {subLabel}
                                      </span>
                                    ))}
                              </div>

                              <button
                                onClick={(e) => toggleFavorite(post.id, e)}
                                className={`absolute top-3 left-3 p-1.5 rounded-lg backdrop-blur-xs transition-all cursor-pointer ${
                                  isFavorite(post.id)
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-black/60 text-white hover:bg-[#035dcd]'
                                }`}
                                title={isFavorite(post.id) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isFavorite(post.id) ? 'fill-white' : ''}`} />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxImage({ url: post.thumbnail, title: post.title });
                                }}
                                className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#035dcd]"
                                title="تكبير الصورة"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between text-right">
                              <div
                                onClick={() => handleSelectPost(post)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#035dcd]" /> {post.date}
                                  </span>
                                  <span>• {post.readTime}</span>
                                </div>

                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors">
                                  {post.title}
                                </h3>

                                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-2 leading-relaxed">
                                  {post.snippet}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2f366b] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    {post.author.name}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleSelectPost(post)}
                                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#035dcd] dark:text-blue-300 text-xs font-bold group-hover:bg-[#035dcd] group-hover:text-white transition-colors cursor-pointer"
                                >
                                  اقرأ المقال بالكامل ←
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : feedLayout === 'grid' ? (
                      /* Style 2: Grid Layout */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {displayedPosts.map((post) => (
                          <article
                            key={post.id}
                            className="group bg-white dark:bg-[#252a54] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-[#2f366b] transition-all flex flex-col"
                          >
                            <div
                              onClick={() => handleSelectPost(post)}
                              className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer flex items-center justify-center"
                            >
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-3 right-3 flex flex-wrap items-center gap-1.5">
                                <span className={`text-xs font-bold text-white px-2.5 py-1 rounded shadow-md cat-badge-${post.categoryIndex}`}>
                                  {post.category}
                                </span>
                                {post.categorySlug === 'AI' &&
                                  post.tags
                                    .filter((t) => t !== 'الذكاء الاصطناعي' && t !== 'AI')
                                    .map((subLabel) => (
                                      <span
                                        key={subLabel}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectCategory(subLabel);
                                        }}
                                        className="text-[11px] font-bold text-white bg-slate-900/80 hover:bg-[#035dcd] backdrop-blur-xs px-2.5 py-1 rounded shadow-md transition-colors cursor-pointer"
                                      >
                                        {subLabel}
                                      </span>
                                    ))}
                              </div>
                              <button
                                onClick={(e) => toggleFavorite(post.id, e)}
                                className={`absolute top-3 left-3 p-1.5 rounded-lg backdrop-blur-xs transition-all cursor-pointer ${
                                  isFavorite(post.id)
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-black/60 text-white hover:bg-[#035dcd]'
                                }`}
                                title={isFavorite(post.id) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isFavorite(post.id) ? 'fill-white' : ''}`} />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxImage({ url: post.thumbnail, title: post.title });
                                }}
                                className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#035dcd]"
                                title="تكبير الصورة"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between text-right">
                              <div
                                onClick={() => handleSelectPost(post)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1.5">
                                  <Clock className="w-3 h-3 text-[#035dcd]" />
                                  <span>{post.date}</span>
                                </div>

                                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors">
                                  {post.title}
                                </h3>

                                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-2 leading-relaxed">
                                  {post.snippet}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2f366b] flex items-center justify-between text-xs">
                                <span className="text-gray-400">{post.readTime}</span>
                                <button
                                  onClick={() => handleSelectPost(post)}
                                  className="font-bold text-[#035dcd] dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                  عرض بالكامل ←
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      /* Style 3: Compact List Layout */
                      <div className="space-y-3">
                        {displayedPosts.map((post) => (
                          <article
                            key={post.id}
                            className="group bg-white dark:bg-[#252a54] rounded-xl p-3 shadow-sm hover:shadow-md border border-gray-100 dark:border-[#2f366b] transition-all flex items-center gap-3.5 text-right"
                          >
                            <div
                              onClick={() => handleSelectPost(post)}
                              className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900 cursor-pointer flex items-center justify-center"
                            >
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                                <Clock className="w-3 h-3 text-[#035dcd]" />
                                <span>{post.date}</span>
                              </div>

                              <h3
                                onClick={() => handleSelectPost(post)}
                                className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors leading-snug cursor-pointer"
                              >
                                {post.title}
                              </h3>

                              <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
                                <span>{post.readTime}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => toggleFavorite(post.id, e)}
                                    className={`p-1 rounded transition-colors cursor-pointer ${
                                      isFavorite(post.id)
                                        ? 'text-amber-500'
                                        : 'text-gray-400 hover:text-[#035dcd]'
                                    }`}
                                    title={isFavorite(post.id) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${isFavorite(post.id) ? 'fill-amber-500' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => handleSelectPost(post)}
                                    className="text-[#035dcd] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                                  >
                                    قراءة ←
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}

                    {/* Load More Button */}
                    {visibleCount < filteredPosts.length && (
                      <div className="pt-6 text-center">
                        <button
                          onClick={handleLoadMore}
                          disabled={isLoadingMore}
                          className="px-8 py-3 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isLoadingMore ? 'جاري تحميل المزيد من المقالات...' : 'تحميل المزيد من المشاركات'}
                        </button>
                      </div>
                    )}

                    {/* Bottom AdSense Unit for Category & Sub-section Pages */}
                    {displayedPosts.length > 0 && (
                      <AdSenseUnit
                        key={`ad-cat-bot-${activeCategory}-${activeAiSubTag}`}
                        slotType="bottom"
                        postId={`cat-bot-${activeCategory}-${activeAiSubTag}`}
                      />
                    )}
                  </div>

              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-1">
                <Sidebar
                  categories={INITIAL_CATEGORIES}
                  posts={INITIAL_POSTS}
                  activeCategory={activeCategory}
                  onSelectCategory={handleSelectCategory}
                  onSelectPost={handleSelectPost}
                  onOpenRedirectTool={() => setIsRedirectToolOpen(true)}
                  onOpenSeoViewer={() => setIsSeoViewerOpen(true)}
                  onSearchQuery={() => setIsSearchOpen(true)}
                />
              </div>

            </div>
          </>
        )}

      </main>

      {/* 3. Footer */}
      <Footer
        onOpenStandalonePage={handleOpenStandalonePage}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Mobile Quick Bottom Navigation */}
      <MobileBottomNav
        onGoHome={() => handleSelectCategory('all')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 5. Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenStandalonePage={handleOpenStandalonePage}
        onOpenRedirectTool={() => setIsRedirectToolOpen(true)}
        posts={INITIAL_POSTS}
        onSelectPost={handleSelectPost}
      />

      {/* 6. Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={INITIAL_POSTS}
        onSelectPost={handleSelectPost}
      />

      <RedirectToolModal
        isOpen={isRedirectToolOpen}
        onClose={() => setIsRedirectToolOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <PagesModal
        pageType={activePage}
        onClose={() => setActivePage(null)}
      />

      {/* SEO & Schema.org JSON-LD Inspector Modal */}
      <SeoSchemaViewerModal
        isOpen={isSeoViewerOpen}
        onClose={() => setIsSeoViewerOpen(false)}
        post={selectedPost}
        downloadApp={selectedDownloadApp}
        activeCategory={activeCategory}
      />

      {/* Sitemap.xml Modal Explorer */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        posts={INITIAL_POSTS}
        onSelectPost={handleSelectPost}
      />



      {/* Fullscreen High-Resolution Image Lightbox */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage?.url || ''}
        imageTitle={lightboxImage?.title}
      />

      {/* PWA Offline Mode Connectivity Indicator */}
      <OfflineIndicator />

    </div>
  );
}
