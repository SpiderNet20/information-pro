import React, { useState, useMemo } from 'react';
import {
  Home,
  Search,
  Compass,
  Wrench,
  BookOpen,
  Download,
  Sparkles,
  Briefcase,
  ArrowRight,
  ChevronLeft,
  AlertTriangle,
  Map,
  FileText,
} from 'lucide-react';
import { Post, StandalonePageType } from '../types';
import { SITE_TOOLS, SiteToolItem } from '../data/toolsData';
import { DOWNLOAD_APPS, DownloadAppItem } from '../data/downloadsApps';

interface NotFoundPageViewProps {
  requestedPath?: string;
  posts: Post[];
  onGoHome: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectPost: (post: Post) => void;
  onSelectTool: (toolSlug: string) => void;
  onSelectDownloadApp: (appSlug: string) => void;
  onOpenStandalonePage: (page: StandalonePageType) => void;
}

export const NotFoundPageView: React.FC<NotFoundPageViewProps> = ({
  requestedPath,
  posts,
  onGoHome,
  onSelectCategory,
  onSelectPost,
  onSelectTool,
  onSelectDownloadApp,
  onOpenStandalonePage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const displayPath = useMemo(() => {
    const raw =
      requestedPath ||
      (typeof window !== 'undefined' ? window.location.pathname : '/404');
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [requestedPath]);

  // Live instant search across Articles, Tools, and Download Apps
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedPosts = posts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.snippet.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5);

    const matchedTools = SITE_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedApps = DOWNLOAD_APPS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.arabicName.toLowerCase().includes(q) ||
        a.shortDescription.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      posts: matchedPosts,
      tools: matchedTools,
      apps: matchedApps,
      total: matchedPosts.length + matchedTools.length + matchedApps.length,
    };
  }, [searchQuery, posts]);

  const suggestedPosts = useMemo(() => posts.slice(0, 4), [posts]);
  const featuredTools: SiteToolItem[] = useMemo(
    () => SITE_TOOLS.slice(0, 3),
    []
  );

  const quickSections = [
    {
      label: 'المدونة والمقالات',
      slug: 'Blog',
      href: '/Blog/',
      desc: 'شروحات تقنية ومقالات تعليمية شاملة',
      icon: BookOpen,
      colorClass: 'bg-blue-50 text-[#035dcd] dark:bg-[#1e2348] dark:text-blue-400',
    },
    {
      label: 'أدوات الموقع الذكية',
      slug: 'tools',
      href: '/tools/',
      desc: '9 أدوات مجانية مباشرة في متصفحك',
      icon: Wrench,
      colorClass:
        'bg-purple-50 text-purple-600 dark:bg-[#1e2348] dark:text-purple-400',
    },
    {
      label: 'الذكاء الاصطناعي AI',
      slug: 'AI',
      href: '/AI/',
      desc: 'أحدث أدوات وشروحات الذكاء الاصطناعي',
      icon: Sparkles,
      colorClass:
        'bg-emerald-50 text-emerald-600 dark:bg-[#1e2348] dark:text-emerald-400',
    },
    {
      label: 'التحميلات والبرامج',
      slug: 'Downloads',
      href: '/Downloads/',
      desc: 'تطبيقات وبرامج أصلية بروابط آمنة',
      icon: Download,
      colorClass:
        'bg-amber-50 text-amber-600 dark:bg-[#1e2348] dark:text-amber-400',
    },
    {
      label: 'المال والأعمال',
      slug: 'Business',
      href: '/Business/',
      desc: 'الربح من الإنترنت والعمل الحر',
      icon: Briefcase,
      colorClass: 'bg-rose-50 text-rose-600 dark:bg-[#1e2348] dark:text-rose-400',
    },
  ];

  return (
    <div className="space-y-8 text-right py-2 sm:py-4" dir="rtl">
      {/* Breadcrumb */}
      <nav
        aria-label="مسار التنقل"
        className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>الرئيسية</span>
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-gray-900 dark:text-white">
          خطأ 404 - الصفحة غير موجودة
        </span>
      </nav>

      {/* Main 404 Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200/90 dark:border-[#2f366b] shadow-xs p-6 sm:p-10 lg:p-12 text-center">
        {/* Decorative subtle background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* 404 Visual Badge */}
          <div className="inline-flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-[#1e2348] border border-blue-100 dark:border-[#384180] text-[#035dcd] dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-l from-[#035dcd] via-[#1a75ff] to-indigo-600 bg-clip-text text-transparent select-none leading-none">
              404
            </span>
          </div>

          {/* Heading & Explanation */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
              عذراً، الصفحة التي تبحث عنها غير موجودة
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              يبدو أن الرابط الذي اتبعته غير صحيح، أو أن الصفحة قد تم نقلها أو تغيير
              عنوانها ضمن التحديثات الأخيرة في موقع{' '}
              <strong className="text-gray-900 dark:text-white">
                العنكبوت للمعلومات
              </strong>
              .
            </p>

            {/* Requested Path Indicator */}
            {displayPath && displayPath !== '/' && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-[#1b1e38] border border-gray-200 dark:border-[#2f366b] text-xs text-gray-600 dark:text-gray-300 max-w-full overflow-hidden">
                <span className="font-bold shrink-0">المسار المطلوب:</span>
                <code
                  dir="ltr"
                  className="font-mono text-[#035dcd] dark:text-blue-400 truncate"
                >
                  {displayPath}
                </code>
              </div>
            )}
          </div>

          {/* Instant Search Box inside 404 Page */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مقال، أداة، أو برنامج للوصول إليه فوراً..."
                aria-label="ابحث في الموقع"
                className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#1b1e38] border border-gray-200 dark:border-[#384180] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:bg-white dark:focus:bg-[#1e2348] transition-all shadow-2xs"
              />
            </div>

            {/* Instant Search Results Dropdown / Panel */}
            {searchResults && (
              <div className="mt-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#1b1e38] border border-gray-200 dark:border-[#384180] text-right space-y-4 shadow-md">
                {searchResults.total === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-3">
                    لم يتم العثور على نتائج مطابقة لـ «{searchQuery}». جرب كلمات
                    أخرى أو تصفح الأقسام بالأسفل.
                  </p>
                ) : (
                  <>
                    {searchResults.posts.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-black text-[#035dcd] dark:text-blue-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span>المقالات المطابقة ({searchResults.posts.length})</span>
                        </div>
                        <div className="divide-y divide-gray-200/70 dark:divide-[#2f366b]">
                          {searchResults.posts.map((post) => (
                            <a
                              key={post.id}
                              href={`/${post.categorySlug}/${post.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onSelectPost(post);
                              }}
                              className="py-2 px-2 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-[#252a54] rounded-xl transition-colors cursor-pointer"
                            >
                              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                                {post.title}
                              </span>
                              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 shrink-0">
                                {post.category}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.tools.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>الأدوات المطابقة ({searchResults.tools.length})</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.tools.map((tool) => (
                            <a
                              key={tool.id}
                              href={tool.path}
                              onClick={(e) => {
                                e.preventDefault();
                                onSelectTool(tool.slug);
                              }}
                              className="p-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200/80 dark:border-[#2f366b] hover:border-purple-400 transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <span className="text-xs font-bold text-gray-900 dark:text-white">
                                {tool.name}
                              </span>
                              <ChevronLeft className="w-3.5 h-3.5 text-purple-500" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.apps.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" />
                          <span>التطبيقات والبرامج ({searchResults.apps.length})</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResults.apps.map((app: DownloadAppItem) => (
                            <a
                              key={app.slug}
                              href={`/Downloads/${app.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onSelectDownloadApp(app.slug);
                              }}
                              className="p-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200/80 dark:border-[#2f366b] hover:border-emerald-400 transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <span className="text-xs font-bold text-gray-900 dark:text-white">
                                {app.arabicName} ({app.name})
                              </span>
                              <ChevronLeft className="w-3.5 h-3.5 text-emerald-500" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onGoHome();
              }}
              className="px-6 py-3 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>العودة إلى الصفحة الرئيسية</span>
            </a>

            <a
              href="/tools/"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('tools');
              }}
              className="px-5 py-3 rounded-xl bg-blue-50 dark:bg-[#1e2348] hover:bg-blue-100 dark:hover:bg-[#2a3160] text-[#035dcd] dark:text-blue-300 border border-blue-200/80 dark:border-[#384180] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>تصفح أدوات الموقع</span>
            </a>

            <a
              href="/sitemap"
              onClick={(e) => {
                e.preventDefault();
                onOpenStandalonePage('sitemap');
              }}
              className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-[#1b1e38] hover:bg-gray-200/80 dark:hover:bg-[#2a3160] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2f366b] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>خريطة الموقع الكاملة</span>
            </a>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  window.history.back();
                } else {
                  onGoHome();
                }
              }}
              className="px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-[#035dcd] dark:hover:text-blue-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرجوع للصفحة السابقة</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Sections Navigation */}
      <section className="rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200/90 dark:border-[#2f366b] p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-[#035dcd]" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
            تصفح أقسام الموقع الرئيسية
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickSections.map((sec) => {
            const IconComponent = sec.icon;
            return (
              <a
                key={sec.slug}
                href={sec.href}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(sec.slug);
                }}
                className="group p-4 rounded-2xl bg-gray-50/80 dark:bg-[#1e2348] border border-gray-200/80 dark:border-[#2f366b] hover:border-[#035dcd] dark:hover:border-blue-400 transition-all flex flex-col justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${sec.colorClass}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors">
                    {sec.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-[#035dcd] dark:text-blue-400 pt-1">
                  <span>استكشف القسم</span>
                  <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Suggested Articles & Featured Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Articles (8 cols) */}
        <section className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200/90 dark:border-[#2f366b] p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              أحدث المقالات والشروحات المقترحة
            </h2>
            <a
              href="/Blog/"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('Blog');
              }}
              className="text-xs font-bold text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>عرض جميع المقالات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group p-3.5 rounded-2xl bg-gray-50/80 dark:bg-[#1e2348] border border-gray-200/80 dark:border-[#2f366b] hover:border-[#035dcd] transition-all flex items-start gap-3.5 cursor-pointer"
              >
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-200 dark:bg-[#252a54]"
                />
                <div className="min-w-0 space-y-1.5">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100/80 dark:bg-[#252a54] text-[#035dcd] dark:text-blue-400">
                    {post.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors leading-snug">
                    <a
                      href={`/${post.categorySlug}/${post.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectPost(post);
                      }}
                    >
                      {post.title}
                    </a>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Featured Online Tools (4 cols) */}
        <section className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200/90 dark:border-[#2f366b] p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              أدوات مجانية سريعة
            </h2>
            <a
              href="/tools/"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('tools');
              }}
              className="text-xs font-bold text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>كل الأدوات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {featuredTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.path}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTool(tool.slug);
                }}
                className="group p-3.5 rounded-2xl bg-gray-50/80 dark:bg-[#1e2348] border border-gray-200/80 dark:border-[#2f366b] hover:border-[#035dcd] transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    {tool.shortDescription}
                  </p>
                </div>
                <ChevronLeft className="w-4 h-4 text-[#035dcd] dark:text-blue-400 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
