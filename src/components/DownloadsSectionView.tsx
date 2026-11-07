import React, { useState, useMemo } from 'react';
import {
  Search,
  Zap,
  Shield,
  Gift,
  Smartphone,
  LayoutGrid,
  Gamepad2,
  MessageCircle,
  Settings,
  Camera,
  Music,
  BookOpen,
  ChevronLeft,
  ArrowLeft,
  Star,
  User,
  Download,
  Flame,
  ExternalLink,
  FileCode,
} from 'lucide-react';
import { Post } from '../types';
import { DOWNLOAD_APPS, DownloadAppItem } from '../data/downloadsApps';
import { AdSenseUnit } from './AdSenseUnit';
import { getDownloadsCollectionSchema } from '../utils/seo';

interface DownloadsSectionViewProps {
  posts: Post[];
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
  onSelectApp: (appSlug: string) => void;
  onOpenSeoViewer?: () => void;
}

const SIDEBAR_CATEGORIES = [
  { key: 'games', label: 'ألعاب', icon: Gamepad2, iconColor: 'text-[#072446] dark:text-blue-300' },
  { key: 'social', label: 'تطبيقات', icon: MessageCircle, iconColor: 'text-[#0a3d7a] dark:text-blue-400' },
  { key: 'system', label: 'أدوات وتطبيقات النظام', icon: Settings, iconColor: 'text-[#0568e8] dark:text-blue-400' },
  { key: 'media', label: 'التصوير والفيديو', icon: Camera, iconColor: 'text-[#0a3d7a] dark:text-blue-400' },
  { key: 'entertainment', label: 'الترفيه والموسيقى', icon: Music, iconColor: 'text-[#0568e8] dark:text-blue-400' },
  { key: 'education', label: 'التعليم والكتب', icon: BookOpen, iconColor: 'text-[#0568e8] dark:text-blue-400' },
];

export const DownloadsSectionView: React.FC<DownloadsSectionViewProps> = ({
  posts,
  allPosts,
  onSelectPost,
  onSelectApp,
  onOpenSeoViewer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');
  const [showAllPosts, setShowAllPosts] = useState(false);

  const downloadsSchemaJson = useMemo(
    () => JSON.stringify(getDownloadsCollectionSchema(), null, 2),
    []
  );

  const filteredFeaturedApps = useMemo((): DownloadAppItem[] => {
    return DOWNLOAD_APPS.filter((app) => {
      const matchesCategory =
        activeSubFilter === 'all' ||
        app.filterKey === activeSubFilter ||
        (activeSubFilter === 'entertainment' && app.filterKey === 'games');

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.arabicName.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeSubFilter, searchQuery]);

  const filteredSectionPosts = useMemo(() => {
    const basePosts = showAllPosts
      ? [
          ...posts,
          ...allPosts.filter(
            (p) =>
              p.categorySlug === 'Games' &&
              !posts.some((existing) => existing.id === p.id)
          ),
        ]
      : posts;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return basePosts;
    return basePosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.snippet.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, allPosts, searchQuery, showAllPosts]);

  return (
    <div className="w-full text-right select-none" dir="rtl">
      {/* 1. Store Hero Banner - Keeping exact interface & colors as requested */}
      <section className="relative w-full overflow-hidden bg-gradient-to-l from-[#e7f5ff] via-[#b8e2fe] to-[#3aa6fa] border-b border-[#cbe7fd]">
        <div className="max-w-7xl mx-auto relative min-h-[360px] sm:min-h-[410px] lg:min-h-[430px] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-8 lg:py-10">
          
          {/* Right Side: Title, Subtitle, Description, Search Input, 4 Feature Pills */}
          <div className="relative z-20 w-full lg:w-[56%] flex flex-col items-start text-right lg:pr-2">
            {/* Main Title: تطبيقات العنكبوت */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black leading-tight tracking-tight text-[#072446]">
              <span>تطبيقات </span>
              <span className="text-[#0568e8]">العنكبوت</span>
            </h1>

            {/* Subtitle: دليل تحميل التطبيقات وألعاب مجانا */}
            <h2 className="text-xl sm:text-2xl lg:text-[29px] font-extrabold text-[#072446] mt-2 leading-snug">
              دليل تحميل التطبيقات وألعاب مجانا
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-[15px] font-semibold text-[#1c395b] mt-3 leading-relaxed max-w-lg">
              اكتشف أفضل التطبيقات والألعاب للاندرويد والأيفون، بجودة عالية
              <br className="hidden sm:inline" /> وروابط مباشرة وآمنة.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mt-6">
              <div className="relative flex items-center bg-white rounded-full shadow-[0_8px_25px_rgba(3,93,205,0.12)] px-5 sm:px-6 py-3 sm:py-3.5 border border-white/90">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن تطبيق أو لعبة..."
                  className="w-full bg-transparent text-right text-sm sm:text-base font-medium text-[#072446] placeholder:text-[#8ea3bc] focus:outline-none"
                />
                <Search className="w-5 h-5 text-[#5b7493] shrink-0 mr-3" />
              </div>
            </div>

            {/* 4 Trust / Feature Pills */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-5">
              <button
                type="button"
                onClick={() => setActiveSubFilter('all')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#e4f3fe]/90 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#072446] transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#072446] fill-[#072446]" />
                <span>تحميل مباشر</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubFilter('all')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#e4f3fe]/90 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#072446] transition-all cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#072446]" />
                <span>آمن ومضمون</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubFilter('all')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#e4f3fe]/90 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#072446] transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#072446]" />
                <span>مجاني 100%</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubFilter('all')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#e4f3fe]/90 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#072446] transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#072446]" />
                <span>جميع الأجهزة</span>
              </button>
            </div>
          </div>

          {/* Left Side: 3D Smartphone & Floating Icons Illustration */}
          <div className="relative lg:absolute lg:left-0 lg:top-0 lg:bottom-0 w-full lg:w-[52%] h-[260px] sm:h-[320px] lg:h-full mt-6 lg:mt-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <img
              src="/downloads-hero-phone.png"
              alt="تطبيقات العنكبوت - دليل تحميل التطبيقات والألعاب مجاناً"
              className="w-full h-full object-cover object-left lg:[mask-image:linear-gradient(to_right,black_82%,transparent_100%)]"
            />
          </div>
        </div>
      </section>

      {/* 2. Main Store Content Area */}
      <section className="w-full bg-white dark:bg-[#1b1e38] py-7 sm:py-9 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top AdSense Unit in /Downloads/ */}
          <div className="mb-6">
            <AdSenseUnit key="ad-downloads-top" slotType="top" postId="downloads-hub-top" />
          </div>

          <div className="flex flex-col md:flex-row items-start gap-5 lg:gap-7">
            
            {/* Right Sidebar Column in RTL: تصفح الأقسام */}
            <aside className="w-full md:w-[260px] lg:w-[300px] shrink-0">
              <div className="bg-[#ebf3fa] dark:bg-[#22274e] rounded-[22px] p-4 sm:p-5 border border-[#dfeaf8] dark:border-[#2f366b]">
                {/* Header: تصفح الأقسام */}
                <div className="flex items-center justify-start gap-2.5 mb-4 px-1">
                  <LayoutGrid className="w-5 h-5 text-[#0568e8] fill-[#0568e8] shrink-0" />
                  <h3 className="text-lg sm:text-xl font-black text-[#072446] dark:text-white">
                    تصفح الأقسام
                  </h3>
                </div>

                {/* Two-part list matching the reference image: continuous white icon strip on right + 6 white label bars on left */}
                <div className="flex items-stretch gap-2">
                  {/* Right vertical white icon strip */}
                  <div className="bg-white dark:bg-[#2a305e] rounded-2xl w-11 shrink-0 flex flex-col justify-between py-0 border border-white dark:border-[#343b70] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    {SIDEBAR_CATEGORIES.map((cat) => {
                      const IconComp = cat.icon;
                      const isSelected = activeSubFilter === cat.key;
                      return (
                        <button
                          key={`icon-${cat.key}`}
                          type="button"
                          onClick={() =>
                            setActiveSubFilter((prev) =>
                              prev === cat.key ? 'all' : cat.key
                            )
                          }
                          title={cat.label}
                          className={`h-[44px] w-full flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#0568e8] text-white'
                              : cat.iconColor
                          }`}
                        >
                          <IconComp className="w-5 h-5 fill-current/15" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Left 6 horizontal white category bars */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    {SIDEBAR_CATEGORIES.map((cat) => {
                      const isSelected = activeSubFilter === cat.key;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() =>
                            setActiveSubFilter((prev) =>
                              prev === cat.key ? 'all' : cat.key
                            )
                          }
                          className={`h-[44px] w-full rounded-xl px-3.5 flex items-center justify-between transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#0568e8] text-white border-[#0568e8] shadow-sm'
                              : 'bg-white dark:bg-[#2a305e] text-[#072446] dark:text-gray-100 border-white dark:border-[#343b70] hover:border-blue-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                          }`}
                        >
                          <span className="font-extrabold text-xs sm:text-[13px] truncate">
                            {cat.label}
                          </span>

                          <ChevronLeft
                            className={`w-4 h-4 shrink-0 ${
                              isSelected
                                ? 'text-white'
                                : 'text-[#072446] dark:text-gray-400'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* Left Main Column in RTL: أحدث التطبيقات والألعاب + App Cards + 3 Colored Banners */}
            <div className="flex-1 w-full min-w-0">
              {/* Top Row: أحدث التطبيقات والألعاب on Right | عرض الكل ← on Left */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[#ff5722] fill-[#ff5722]" />
                  <h2 className="text-xl sm:text-2xl font-black text-[#072446] dark:text-white">
                    أحدث التطبيقات والألعاب
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSubFilter('all');
                    setSearchQuery('');
                    setShowAllPosts((prev) => !prev);
                  }}
                  className="text-sm font-bold text-[#0568e8] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>عرض الكل</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Verified App Cards Row with Crawlable Dedicated Download Links & Real Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {filteredFeaturedApps.map((app) => (
                  <article
                    key={app.id}
                    className="group bg-white dark:bg-[#252a54] rounded-2xl p-4 border border-gray-100 dark:border-[#2f366b] shadow-[0_2px_14px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/40 transition-all flex flex-col items-center text-center justify-between"
                  >
                    <a
                      href={`/Downloads/${app.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectApp(app.slug);
                      }}
                      className="w-full flex flex-col items-center cursor-pointer"
                    >
                      {/* App Icon */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-xs bg-white p-0.5 border border-gray-100 dark:border-[#343b70]">
                        <img
                          src={app.icon}
                          alt={app.arabicName}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      </div>

                      {/* App Title */}
                      <h3 className="font-extrabold text-sm sm:text-[15px] text-[#072446] dark:text-white leading-tight line-clamp-1 group-hover:text-[#0568e8] dark:group-hover:text-blue-400 transition-colors">
                        {app.name}
                      </h3>

                      {/* Category & Developer Subtitle */}
                      <span className="text-[11px] font-bold text-[#0568e8] dark:text-blue-400 mt-0.5">
                        {app.category} · {app.developer}
                      </span>

                      {/* Useful Short Description for Visitors & Search Engines */}
                      <p className="text-[11px] sm:text-xs font-medium text-[#546a82] dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                        {app.shortDescription}
                      </p>
                    </a>

                    <div className="w-full mt-3">
                      {/* Stats Row: Right = Downloads (+1B) | Left = Star Rating (4.6) */}
                      <div className="w-full flex items-center justify-between px-1 mb-3 text-xs border-t border-gray-100 dark:border-[#2f366b] pt-2.5">
                        <span
                          dir="ltr"
                          className="flex items-center gap-1 font-semibold text-[#647890] dark:text-gray-400 text-[11px]"
                        >
                          <User className="w-3.5 h-3.5 text-[#647890] fill-[#647890]" />
                          <span>{app.downloads}</span>
                        </span>

                        <span
                          dir="ltr"
                          className="flex items-center gap-1 font-extrabold text-[#072446] dark:text-gray-200"
                        >
                          <Star className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
                          <span>{app.rating}</span>
                        </span>
                      </div>

                      {/* Crawlable Dedicated Download Page Link Button */}
                      <a
                        href={`/Downloads/${app.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectApp(app.slug);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#057ef3] hover:bg-[#0466ca] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>تحميل الآن</span>
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      {/* Direct Official Google Play Verification Link */}
                      <a
                        href={app.googlePlayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full inline-flex items-center justify-center gap-1 text-[10px] font-bold text-[#647890] dark:text-gray-400 hover:text-[#0568e8] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Play ({app.size})</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* 3 Colored Promotional Banners Row (Right: Purple iPhone | Middle: Green Android | Left: Blue New Games) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                {/* 1. Rightmost in RTL: تطبيقات الأيفون (Purple) */}
                <a
                  href="/Downloads/whatsapp-messenger"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectApp('whatsapp-messenger');
                  }}
                  className="relative overflow-hidden bg-gradient-to-l from-[#632092] to-[#7c2eb3] hover:opacity-95 rounded-2xl p-5 flex items-center justify-between text-white shadow-sm transition-all cursor-pointer min-h-[96px]"
                >
                  <div className="relative z-10 text-right">
                    <h3 className="text-lg sm:text-xl font-black leading-snug">
                      تطبيقات الأيفون
                    </h3>
                    <p className="text-xs text-purple-100/90 font-medium mt-1">
                      تصفح أفضل تطبيقات iOS والأندرويد مجاناً
                    </p>
                  </div>

                  {/* Apple Logo SVG */}
                  <svg
                    viewBox="0 0 384 512"
                    className="w-12 h-12 fill-white/90 shrink-0 relative z-10"
                    aria-hidden="true"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                </a>

                {/* 2. Middle in RTL: تطبيقات الأندرويد (Green) */}
                <a
                  href="/Downloads/football-league-2026"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectApp('football-league-2026');
                  }}
                  className="relative overflow-hidden bg-gradient-to-l from-[#2b7a38] to-[#3ca14c] hover:opacity-95 rounded-2xl p-5 flex items-center justify-between text-white shadow-sm transition-all cursor-pointer min-h-[96px]"
                >
                  <div className="relative z-10 text-right">
                    <h3 className="text-lg sm:text-xl font-black leading-snug">
                      تطبيقات الأندرويد
                    </h3>
                    <p className="text-xs text-emerald-100/90 font-medium mt-1">
                      تصفح أحدث تطبيقات وألعاب الأندرويد 2026
                    </p>
                  </div>

                  {/* Android Robot SVG */}
                  <svg
                    viewBox="0 0 576 512"
                    className="w-13 h-13 fill-white/90 shrink-0 relative z-10"
                    aria-hidden="true"
                  >
                    <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55" />
                  </svg>
                </a>

                {/* 3. Leftmost in RTL: ألعاب جديدة (Blue) */}
                <a
                  href="/Downloads/pubg-mobile"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectApp('pubg-mobile');
                  }}
                  className="relative overflow-hidden bg-gradient-to-l from-[#0256c9] to-[#0870f7] hover:opacity-95 rounded-2xl p-5 flex items-center justify-between text-white shadow-sm transition-all cursor-pointer min-h-[96px]"
                >
                  <div className="relative z-10 text-right">
                    <h3 className="text-lg sm:text-xl font-black leading-snug">
                      ألعاب جديدة
                    </h3>
                    <p className="text-xs text-blue-100/90 font-medium mt-1">
                      تصفح أقوى الألعاب المجانية للموبايل
                    </p>
                  </div>

                  <Gamepad2 className="w-13 h-13 text-white/90 shrink-0 relative z-10" />
                </a>
              </div>

              {/* Middle AdSense Unit in /Downloads/ */}
              <AdSenseUnit key="ad-downloads-middle" slotType="middle" postId="downloads-hub-middle" />

              {/* Comprehensive App Directory & Direct Links */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2f366b]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-base sm:text-lg font-black text-[#072446] dark:text-white">
                    دليل البرامج والألعاب المتوفرة للتحميل المباشر
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {DOWNLOAD_APPS.map((app) => (
                    <div
                      key={`detail-${app.id}`}
                      className="bg-[#f8fbff] dark:bg-[#22274e] rounded-2xl p-4 border border-[#e3edf8] dark:border-[#2f366b] flex items-start gap-3.5"
                    >
                      <img
                        src={app.icon}
                        alt={app.arabicName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-white shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={`/Downloads/${app.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectApp(app.slug);
                            }}
                            className="text-sm font-black text-[#072446] dark:text-white hover:text-[#0568e8] truncate"
                          >
                            {app.arabicName}
                          </a>
                          <span
                            dir="ltr"
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#2a305e] text-[#0568e8] dark:text-blue-300 shrink-0"
                          >
                            v{app.version} · {app.size}
                          </span>
                        </div>
                        <p className="text-xs text-[#4a627d] dark:text-gray-300 mt-1 leading-relaxed">
                          {app.shortDescription}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] font-extrabold">
                          <a
                            href={`/Downloads/${app.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectApp(app.slug);
                            }}
                            className="text-[#0568e8] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>صفحة التحميل والمميزات</span>
                            <ArrowLeft className="w-3 h-3" />
                          </a>
                          <a
                            href={app.googlePlayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#5c738f] dark:text-gray-400 hover:text-[#0568e8] inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>رابط Google Play الرسمي</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Section: Site's Download Articles & Guides */}
              {filteredSectionPosts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2f366b]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-black text-[#072446] dark:text-white">
                      شروحات ومقالات البرامج والتطبيقات ({filteredSectionPosts.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSectionPosts.map((post) => (
                      <a
                        key={post.id}
                        href={`/${post.categorySlug}/${post.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectPost(post);
                        }}
                        className="group bg-white dark:bg-[#252a54] rounded-2xl p-3.5 border border-gray-100 dark:border-[#2f366b] shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3.5 cursor-pointer"
                      >
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0 text-right">
                          <h4 className="text-xs sm:text-sm font-bold text-[#072446] dark:text-white line-clamp-2 group-hover:text-[#0568e8] dark:group-hover:text-blue-400 transition-colors leading-snug">
                            {post.title}
                          </h4>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-[#7b8fa6] dark:text-gray-400">
                              {post.date}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0576f3] dark:text-blue-400">
                              <span>اقرأ الشرح</span>
                              <ArrowLeft className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom AdSense Unit in /Downloads/ */}
              <AdSenseUnit key="ad-downloads-bottom" slotType="bottom" postId="downloads-hub-bottom" />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
