import React from 'react';
import { Bookmark, Flame } from 'lucide-react';
import { Post } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface FeaturedSliderProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onSelectCategory?: (cat: string) => void;
  onOpenSearch?: () => void;
}

const HERO_PILLS = [
  { label: 'التقنية', slug: 'Blog', dotColor: 'bg-[#3b82f6]' },
  { label: 'الذكاء الاصطناعي', slug: 'AI', dotColor: 'bg-[#8b5cf6]' },
  { label: 'الألعاب', slug: 'Blog', dotColor: 'bg-[#10b981]' },
  { label: 'البرامج', slug: 'Downloads', dotColor: 'bg-[#06b6d4]' },
  { label: 'الربح من الإنترنت', slug: 'Business', dotColor: 'bg-[#f59e0b]' },
  { label: 'مراجعات', slug: 'Tools-Comparison', dotColor: 'bg-[#ef4444]' },
  { label: 'شروحات', slug: 'tools', dotColor: 'bg-[#14b8a6]' },
  { label: 'أخبار تقنية', slug: 'AI', dotColor: 'bg-[#ec4899]' },
];

const VIEW_COUNTS = ['12.5K', '25.3K', '9.4K', '7.1K'];

export const FeaturedSlider: React.FC<FeaturedSliderProps> = ({
  posts,
  onSelectPost,
  onSelectCategory,
  onOpenSearch,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (posts.length === 0) return null;

  const mainPost = posts[0];
  const mostViewedPosts = posts.slice(1, 5);

  return (
    <section className="mb-8 sm:mb-12 pt-2 sm:pt-8">
      {/* 1. Centered Discovery Hero Header & Search Bar */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-1 sm:px-2">
        <h1 className="text-xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight leading-snug text-[#0f172a] dark:text-white font-heading">
          اكتشف عالم التقنية{' '}
          <span className="bg-gradient-to-l from-[#f97316] to-[#f59e0b] bg-clip-text text-transparent">
            بشكل أذكى وأسرع
          </span>
        </h1>

        <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 sm:mt-3 mb-4 sm:mb-6">
          مقالات مميزة · شروحات مبسطة · أدوات مجانية
        </p>

        {/* Large Pill Search Bar */}
        <div
          onClick={() => onOpenSearch?.()}
          className="max-w-xl mx-auto bg-white dark:bg-[#181e36] rounded-full p-1 sm:p-1.5 pl-1.5 pr-4 sm:pr-5 shadow-md shadow-slate-200/60 dark:shadow-none border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-between gap-2 sm:gap-3 cursor-pointer hover:border-[#0284c7] transition-all"
        >
          <input
            type="text"
            readOnly
            placeholder="ابحث عن مقال أو أداة أو تطبيق..."
            onClick={() => onOpenSearch?.()}
            className="w-full min-w-0 bg-transparent text-right text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none cursor-pointer truncate"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenSearch?.();
            }}
            className="shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-l from-[#f97316] to-[#fb923c] hover:from-[#ea580c] hover:to-[#f97316] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            بحث
          </button>
        </div>

        {/* Category Filter Pills with Colored Dots — Horizontal scroll on mobile, wrapped on desktop */}
        <div className="flex items-center sm:justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-5 overflow-x-auto sm:flex-wrap no-scrollbar py-1 px-1">
          {HERO_PILLS.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => onSelectCategory?.(pill.slug)}
              className="shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full bg-white dark:bg-[#181e36] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-2xs hover:border-[#0284c7] transition-all cursor-pointer"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${pill.dotColor}`} />
              <span className="whitespace-nowrap">{pill.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Featured Card (Right 2/3) + Most Viewed Dark Box (Left 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {/* Right Column (2/3 in RTL): Main Featured Article Card — Full uncropped image */}
        {mainPost && (
          <div
            onClick={() => onSelectPost(mainPost)}
            className="lg:col-span-2 group bg-white dark:bg-[#181e36] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
          >
            {/* Full Uncropped Featured Image */}
            <div className="relative w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={mainPost.thumbnail}
                alt={mainPost.title}
                className="w-full h-auto max-h-[420px] object-contain block"
              />

              {/* Bookmark Button */}
              <button
                onClick={(e) => toggleFavorite(mainPost.id, e)}
                className={`absolute top-3 left-3 z-20 p-2 rounded-xl transition-all cursor-pointer ${
                  isFavorite(mainPost.id)
                    ? 'bg-[#f97316] text-white shadow-md'
                    : 'bg-black/50 text-white hover:bg-[#f97316]'
                }`}
                title={isFavorite(mainPost.id) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite(mainPost.id) ? 'fill-white' : ''}`} />
              </button>

              <span className="absolute top-3 right-3 bg-[#f97316] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                مقال مميز
              </span>
            </div>

            {/* Clean Text Area below Image */}
            <div className="p-4 sm:p-6 text-right flex-1 flex flex-col justify-between">
              <h2 className="text-base sm:text-2xl font-extrabold leading-snug text-[#0f172a] dark:text-white group-hover:text-[#0284c7] transition-colors font-heading">
                {mainPost.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
                <span>18.7K مشاهدة</span>
                <span>·</span>
                <span>{mainPost.isoDate || mainPost.date}</span>
                <span>·</span>
                <span>{mainPost.readTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Left Column (1/3 in RTL): Dark Navy "الأكثر مشاهدة" Card */}
        <div className="lg:col-span-1 bg-[#0b1120] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-slate-800/90 flex flex-col justify-between">
          <div>
            {/* Box Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-slate-800/80">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 font-heading">
                <Flame className="w-4 h-4 text-[#f97316] fill-[#f97316]" />
                <span>الأكثر مشاهدة</span>
              </h3>
            </div>

            {/* 4 Numbered Items with uncropped thumbnails */}
            <div className="divide-y divide-slate-800/80">
              {mostViewedPosts.map((post, idx) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 cursor-pointer group"
                >
                  {/* Right side: Uncropped Thumbnail + Title & Meta */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-20 sm:w-22 aspect-video rounded-xl overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center shadow-xs">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                      <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#38bdf8] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
                        {post.category} · {VIEW_COUNTS[idx % VIEW_COUNTS.length]}
                      </div>
                    </div>
                  </div>

                  {/* Left side: Orange Circle Number Badge */}
                  <span className="w-6 h-6 rounded-full bg-[#f97316] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
