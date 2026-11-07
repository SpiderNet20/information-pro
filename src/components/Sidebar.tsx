import React, { useState } from 'react';
import {
  Search,
  Star,
  Send,
  Facebook,
  Youtube,
  Twitter,
  Tag,
  Shield,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FileCode,
  Bookmark,
  Trash2,
} from 'lucide-react';
import { Post, CategoryInfo } from '../types';
import { AdSenseUnit } from './AdSenseUnit';
import { useFavorites } from '../hooks/useFavorites';
import { TocHeading, buildTocHierarchy } from '../utils/toc';

export type SidebarTocHeading = TocHeading;

interface SidebarProps {
  categories: CategoryInfo[];
  posts: Post[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectPost: (post: Post) => void;
  onOpenRedirectTool: () => void;
  onOpenSeoViewer?: () => void;
  onSearchQuery: (query: string) => void;
  tocHeadings?: SidebarTocHeading[];
  onScrollToHeading?: (e: React.MouseEvent, id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  posts,
  activeCategory,
  onSelectCategory,
  onSelectPost,
  onOpenRedirectTool,
  onOpenSeoViewer,
  onSearchQuery,
  tocHeadings,
  onScrollToHeading,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isTocOpen, setIsTocOpen] = useState(true);
  const { favoriteIds, isFavorite, toggleFavorite, removeFavorite, clearFavorites } = useFavorites();

  const tocTree = React.useMemo(
    () => (tocHeadings && tocHeadings.length > 0 ? buildTocHierarchy(tocHeadings) : []),
    [tocHeadings]
  );

  const favoritePosts = favoriteIds
    .map((id) => posts.find((p) => p.id === id))
    .filter((p): p is Post => Boolean(p));

  const featuredPost = posts[0];
  const popularPosts = posts.slice(1, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput.trim());
    }
  };

  return (
    <aside className="w-full space-y-6 text-right">
      
      {/* 1. Quick Search Widget */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] shadow-sm border border-gray-100 dark:border-[#2f366b]">
        <div className="headline-seo pb-2.5 mb-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            ابحث بشكل سريع
          </h3>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ابحث عن أي شيء..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-xs text-gray-800 dark:text-white focus:outline-none focus:border-[#035dcd]"
          />
          <button
            type="submit"
            className="absolute left-1.5 top-1.5 p-1.5 rounded-lg bg-[#035dcd] text-white hover:bg-[#02479e] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 2. Semantic SEO Table of Contents (محتوى المقال - فهرس العناوين) */}
      {tocHeadings && tocHeadings.length > 0 && (
        <div className="rounded-2xl border border-gray-100 dark:border-[#2f366b] bg-white dark:bg-[#252a54] overflow-hidden shadow-sm">
          <button
            type="button"
            aria-expanded={isTocOpen}
            aria-controls="sidebar-article-toc-list"
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a3160] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#035dcd] shadow-[0_0_8px_rgba(3,93,205,0.6)] shrink-0" />
              <span className="font-extrabold text-sm truncate">محتوى المقال (فهرس العناوين)</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-[#1e2348] text-[#035dcd] dark:text-blue-300 shrink-0">
                {tocHeadings.length}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#035dcd] dark:text-blue-400 font-semibold shrink-0">
              <span>{isTocOpen ? 'إخفاء الفهرس' : 'عرض الفهرس'}</span>
              {isTocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isTocOpen && (
            <nav
              id="sidebar-article-toc-list"
              aria-label="جدول محتويات المقال"
              dir="rtl"
              className="p-4 pt-3 border-t border-gray-100 dark:border-[#2f366b] bg-gray-50/70 dark:bg-[#1f244a]"
            >
              <ol className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {tocTree.map((node, h2Idx) => (
                  <li key={node.id} className="font-bold text-gray-900 dark:text-white">
                    <a
                      href={`#${node.id}`}
                      onClick={(e) => onScrollToHeading?.(e, node.id)}
                      className="group flex items-start gap-2 hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer py-0.5"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-[#035dcd] dark:text-blue-300 text-[11px] font-black flex items-center justify-center mt-0.5 group-hover:bg-[#035dcd] group-hover:text-white transition-colors">
                        {h2Idx + 1}
                      </span>
                      <span className="leading-relaxed group-hover:underline decoration-[#035dcd]/40 underline-offset-4">
                        {node.text}
                      </span>
                    </a>

                    {/* Nested H3 sub-headings under their parent H2 */}
                    {node.children.length > 0 && (
                      <ul className="mt-1.5 mr-2.5 pr-3 border-r-2 border-blue-200/80 dark:border-[#384180] space-y-1.5 font-medium text-xs text-gray-600 dark:text-gray-400">
                        {node.children.map((sub) => (
                          <li key={sub.id}>
                            <a
                              href={`#${sub.id}`}
                              onClick={(e) => onScrollToHeading?.(e, sub.id)}
                              className="group flex items-start gap-2 hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer py-0.5"
                            >
                              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 group-hover:bg-[#035dcd] dark:group-hover:bg-blue-400 transition-colors" />
                              <span className="leading-relaxed group-hover:underline decoration-[#035dcd]/40 underline-offset-4">
                                {sub.text}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </div>
      )}

      {/* 3. Dedicated Favorites Section (المفضلات المحفوظة) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] shadow-sm border border-gray-100 dark:border-[#2f366b]">
        <div className="headline-seo pb-2.5 mb-4 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-[#035dcd] fill-[#035dcd]" />
            <span>المفضلات</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-[#1e2348] text-[#035dcd] dark:text-blue-300">
              {favoritePosts.length}
            </span>
          </h3>

          {favoritePosts.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-[11px] font-semibold text-red-500 hover:text-red-600 dark:text-red-400 transition-colors cursor-pointer"
              title="مسح جميع المقالات المحفوظة"
            >
              مسح الكل
            </button>
          )}
        </div>

        {favoritePosts.length === 0 ? (
          <div className="py-5 px-3 rounded-xl bg-gray-50/80 dark:bg-[#1f244a] border border-dashed border-gray-200 dark:border-[#384180] text-center">
            <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-blue-50 dark:bg-[#252a54] flex items-center justify-center text-[#035dcd] dark:text-blue-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">
              قائمة المفضلات فارغة حالياً
            </p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              اضغط على أيقونة الحفظ في أي مقال لإضافته هنا والرجوع إليه سريعاً في أي وقت.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pl-1">
            {favoritePosts.map((favPost) => (
              <div
                key={favPost.id}
                onClick={() => onSelectPost(favPost)}
                className="group flex items-center gap-3 p-2 rounded-xl bg-gray-50/70 dark:bg-[#1f244a] hover:bg-blue-50/60 dark:hover:bg-[#2a3160] border border-gray-100 dark:border-[#2f366b] transition-all cursor-pointer"
              >
                <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                  <img
                    src={favPost.thumbnail}
                    alt={favPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white line-clamp-2 group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {favPost.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    {favPost.date}
                  </span>
                </div>

                <button
                  onClick={(e) => removeFavorite(favPost.id, e)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0 cursor-pointer"
                  title="إزالة من المفضلات"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Featured Post Widget (FeaturedPost1 in SeoPlus) */}
      {featuredPost && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] shadow-sm border border-gray-100 dark:border-[#2f366b]">
          <div className="headline-seo pb-2.5 mb-4 flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>مشاركة مميزة</span>
            </h3>
          </div>

          <div
            onClick={() => onSelectPost(featuredPost)}
            className="cursor-pointer group"
          >
            <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-gray-200">
              <img
                src={featuredPost.thumbnail}
                alt={featuredPost.title}
                title={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 text-[10px] font-bold text-white px-2.5 py-0.5 rounded bg-[#035dcd]">
                الربح والشروحات التقنية
              </span>
              <button
                onClick={(e) => toggleFavorite(featuredPost.id, e)}
                className={`absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-xs transition-all cursor-pointer ${
                  isFavorite(featuredPost.id)
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-black/50 text-white hover:bg-[#035dcd]'
                }`}
                title={isFavorite(featuredPost.id) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFavorite(featuredPost.id) ? 'fill-white' : ''}`} />
              </button>
            </div>

            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {featuredPost.title}
            </h4>

            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed">
              {featuredPost.snippet}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-[#2f366b]">
              <Clock className="w-3 h-3 text-[#035dcd]" />
              <span>{featuredPost.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* AdSense Unit after Featured Post Widget */}
      <AdSenseUnit key="ad-sidebar-featured" slotType="top" postId="sidebar-featured" />

      {/* 3. Social Media Widget (LinkList4 in SeoPlus) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] shadow-sm border border-gray-100 dark:border-[#2f366b]">
        <div className="headline-seo pb-2.5 mb-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            مواقع التواصل الإجتماعي
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href="https://t.me/arb_1xbet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0088cc] text-white hover:opacity-90 transition-opacity text-xs font-bold shadow-sm"
          >
            <Send className="w-4 h-4 -rotate-90" />
            <span>تيليجرام</span>
          </a>

          <a
            href="https://www.facebook.com/informationspider/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1877F2] text-white hover:opacity-90 transition-opacity text-xs font-bold shadow-sm"
          >
            <Facebook className="w-4 h-4" />
            <span>فيسبوك</span>
          </a>

          <a
            href="https://www.youtube.com/channel/UCMNj0yd5HpbesN8wWh8167Q"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FF0000] text-white hover:opacity-90 transition-opacity text-xs font-bold shadow-sm"
          >
            <Youtube className="w-4 h-4" />
            <span>يوتيوب</span>
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity text-xs font-bold shadow-sm"
          >
            <Twitter className="w-4 h-4" />
            <span>تويتر</span>
          </a>
        </div>
      </div>

      {/* 4. Interactive Tools Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e2348] dark:to-[#232854] shadow-sm border border-blue-100 dark:border-[#2f366b]">
        <div className="headline-seo pb-2.5 mb-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            أدوات تقنية تهمك
          </h3>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onOpenRedirectTool}
            className="w-full p-3 rounded-xl bg-white dark:bg-[#252a54] hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-[#384180] flex items-center justify-between text-xs font-bold transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 group-hover:bg-white/20 group-hover:text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span>فاحص الروابط الخارجية</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Sidebar AdSense Unit */}
        <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-[#2f366b]">
          <AdSenseUnit key="ad-sidebar-tools" slotType="middle" postId="sidebar-tools" />
        </div>
      </div>

      {/* 5. Labels & Categories Cloud (Label400 in SeoPlus) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] shadow-sm border border-gray-100 dark:border-[#2f366b]">
        <div className="headline-seo pb-2.5 mb-4 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#035dcd]" />
            <span>أقسام الموقع</span>
          </h3>
        </div>

        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug || activeCategory === cat.name;
            return (
              <a
                key={cat.slug}
                href={`/${cat.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(cat.slug);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#035dcd] text-white font-bold shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e2348]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{cat.name}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-[#1e2348] text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {cat.count}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* 6. Popular / Recent Posts List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] shadow-sm border border-gray-100 dark:border-[#2f366b]">
        <div className="headline-seo pb-2.5 mb-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            المشاركات الأكثر رواجاً
          </h3>
        </div>

        <div className="space-y-3.5">
          {popularPosts.map((post) => {
            const saved = isFavorite(post.id);
            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-white line-clamp-2 group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {post.date}
                  </span>
                </div>

                <button
                  onClick={(e) => toggleFavorite(post.id, e)}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                    saved
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'text-gray-400 hover:text-[#035dcd] hover:bg-gray-100 dark:hover:bg-[#1e2348]'
                  }`}
                  title={saved ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AdSense Unit at the end of Sidebar */}
      <AdSenseUnit key="ad-sidebar-end" slotType="top" postId="sidebar-end" />

    </aside>
  );
};
