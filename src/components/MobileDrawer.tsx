import React from 'react';
import {
  X,
  Home,
  Gamepad2,
  Cpu,
  HelpCircle,
  Users,
  Shield,
  FileText,
  Mail,
  Send,
  Facebook,
  Youtube,
  Twitter,
  Flame,
  Globe,
  Bookmark,
  Trash2,
} from 'lucide-react';
import { Post, StandalonePageType } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenStandalonePage: (page: StandalonePageType) => void;
  onOpenRedirectTool: () => void;
  posts?: Post[];
  onSelectPost?: (post: Post) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  onOpenStandalonePage,
  onOpenRedirectTool,
  posts = [],
  onSelectPost,
}) => {
  const { favoriteIds, removeFavorite, clearFavorites } = useFavorites();

  const favoritePosts = favoriteIds
    .map((id) => posts.find((p) => p.id === id))
    .filter((p): p is Post => Boolean(p));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-[#252a54] shadow-2xl flex flex-col z-50 text-right animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 dark:border-[#2f366b] flex items-center justify-between bg-gradient-to-l from-blue-50 to-white dark:from-[#1e2348] dark:to-[#252a54]">
          <div className="flex items-center gap-2">
            <img
              src="/logo-spider.png"
              alt="العنكبوت للمعلومات"
              className="w-8 h-8 rounded-full object-contain drop-shadow-sm"
            />
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                العنكبوت للمعلومات
              </h3>
              <span className="text-[10px] text-gray-400">القائمة الرئيسية</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#1e2348] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[11px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">
            أقسام المدونة
          </div>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>الصفحة الرئيسية</span>
          </a>

          <a
            href="/AI/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('AI');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeCategory === 'AI' || activeCategory === 'الذكاء الاصطناعي'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>الذكاء الاصطناعي</span>
            </div>
          </a>

          <a
            href="/Business/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Business');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeCategory === 'Business' || activeCategory === 'المال والأعمال'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-amber-500" />
              <span>المال والأعمال</span>
            </div>
          </a>

          <a
            href="/Blog/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Blog');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeCategory === 'Blog' || activeCategory === 'المدونة'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348]'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>المدونة</span>
            </div>
          </a>

          <a
            href="/Downloads/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Downloads');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeCategory === 'Downloads' || activeCategory === 'Software' || activeCategory === 'التحميلات'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-cyan-500" />
              <span>التحميلات</span>
            </div>
          </a>

          <a
            href="/tools/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('tools');
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeCategory === 'tools'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-4 h-4 text-emerald-500" />
              <span>الأدوات المجانية</span>
            </div>
          </a>

          {/* Dedicated Favorites Section in Mobile Sidebar */}
          <div className="pt-4 pb-1 px-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 text-[#035dcd] fill-[#035dcd]" />
              <span>المفضلات ({favoritePosts.length})</span>
            </div>
            {favoritePosts.length > 0 && (
              <button
                onClick={clearFavorites}
                className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
              >
                مسح الكل
              </button>
            )}
          </div>

          {favoritePosts.length === 0 ? (
            <div className="mx-2 p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-dashed border-gray-200 dark:border-[#384180] text-center">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                لا توجد مقالات محفوظة في المفضلة بعد
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 px-1 max-h-52 overflow-y-auto">
              {favoritePosts.map((favPost) => (
                <div
                  key={favPost.id}
                  onClick={() => {
                    if (onSelectPost) onSelectPost(favPost);
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#1f244a] hover:bg-blue-50 dark:hover:bg-[#1e2348] border border-gray-100 dark:border-[#2f366b] cursor-pointer"
                >
                  <img
                    src={favPost.thumbnail}
                    alt={favPost.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-white truncate">
                      {favPost.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 block">
                      {favPost.date}
                    </span>
                  </div>
                  <button
                    onClick={(e) => removeFavorite(favPost.id, e)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500"
                    title="إزالة من المفضلات"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 pb-1 text-[11px] font-bold text-gray-400 px-3 uppercase tracking-wider">
            أدوات وإضافات
          </div>

          <button
            onClick={() => {
              onOpenRedirectTool();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348]"
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>فاحص وحامي الروابط</span>
          </button>



          <div className="pt-4 pb-1 text-[11px] font-bold text-gray-400 px-3 uppercase tracking-wider">
            معلومات الموقع
          </div>

          <button
            onClick={() => {
              onOpenStandalonePage('contact');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2348]"
          >
            <Mail className="w-4 h-4 text-gray-400" />
            <span>اتصل بنا</span>
          </button>

          <button
            onClick={() => {
              onOpenStandalonePage('about');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2348]"
          >
            <FileText className="w-4 h-4 text-gray-400" />
            <span>من نحن</span>
          </button>

          <button
            onClick={() => {
              onOpenStandalonePage('privacy');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2348]"
          >
            <Shield className="w-4 h-4 text-gray-400" />
            <span>سياسة الخصوصية</span>
          </button>

          <button
            onClick={() => {
              onOpenStandalonePage('terms');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2348]"
          >
            <FileText className="w-4 h-4 text-gray-400" />
            <span>اتفاقية المستخدم</span>
          </button>

          <button
            onClick={() => {
              onOpenStandalonePage('sitemap');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2348]"
          >
            <Globe className="w-4 h-4 text-gray-400" />
            <span>خريطة الموقع</span>
          </button>
        </div>

        {/* Footer Socials */}
        <div className="p-4 border-t border-gray-100 dark:border-[#2f366b] bg-gray-50 dark:bg-[#1f244a] flex items-center justify-around">
          <a
            href="https://t.me/arb_1xbet"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#0088cc] text-white"
            title="تيليجرام"
          >
            <Send className="w-4 h-4 -rotate-90" />
          </a>
          <a
            href="https://www.facebook.com/informationspider/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#1877F2] text-white"
            title="فيسبوك"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCMNj0yd5HpbesN8wWh8167Q"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#FF0000] text-white"
            title="يوتيوب"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#1DA1F2] text-white"
            title="تويتر"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
