import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Send,
  Facebook,
  Youtube,
  Twitter,
  Globe,
  Sparkles,
  Download,
  CheckCircle2,
  Smartphone,
  Share,
  PlusSquare,
  ExternalLink,
  X,
} from 'lucide-react';
import { StandalonePageType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenRedirectTool: () => void;

  onOpenStandalonePage: (page: StandalonePageType) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenStandalonePage,
  activeCategory,
  onSelectCategory,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showPWAInstallModal, setShowPWAInstallModal] = useState(false);

  const isIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  const handlePWAInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setShowPWAInstallModal(false);
      }
      return;
    }
    setShowPWAInstallModal(true);
  };

  const categories = [
    { slug: 'all', name: 'الرئيسية' },
    { slug: 'AI', name: 'الذكاء الاصطناعي' },
    { slug: 'Business', name: 'المال والأعمال' },
    { slug: 'Blog', name: 'المدونة' },
    { slug: 'Downloads', name: 'التحميلات' },
    { slug: 'tools', name: 'الأدوات' },
  ];

  return (
    <header className="lg:sticky top-0 z-40 w-full shadow-sm bg-white dark:bg-[#252a54]">
      {/* Top Ribbon (HeaderTOP in SeoPlus) - Hidden on Mobile */}
      <div className="hidden md:block bg-[#035dcd] text-white text-xs border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
          {/* Statutory and Tool Pages */}
          <nav className="flex items-center gap-4">
            <button
              onClick={() => onSelectCategory('all')}
              className="hover:text-blue-100 transition-colors cursor-pointer"
            >
              الصفحة الرئيسية
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => onOpenStandalonePage('contact')}
              className="hover:text-blue-100 transition-colors cursor-pointer"
            >
              اتصل بنا
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => onOpenStandalonePage('about')}
              className="hover:text-blue-100 transition-colors cursor-pointer"
            >
              من نحن
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => onOpenStandalonePage('privacy')}
              className="hover:text-blue-100 transition-colors cursor-pointer"
            >
              سياسة الخصوصية
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => onOpenStandalonePage('terms')}
              className="hover:text-blue-100 transition-colors cursor-pointer"
            >
              اتفاقية المستخدم
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => onOpenStandalonePage('sitemap')}
              className="flex items-center gap-1 text-blue-100 hover:text-white font-bold transition-colors cursor-pointer"
              title="خريطة الموقع XML"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>خريطة الموقع (Sitemap)</span>
            </button>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mr-auto md:mr-0">
            <a
              href="https://t.me/arb_1xbet"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="تيليجرام"
            >
              <Send className="w-3.5 h-3.5 -rotate-90" />
            </a>
            <a
              href="https://www.facebook.com/informationspider/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="فيسبوك"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCMNj0yd5HpbesN8wWh8167Q"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="يوتيوب"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="تويتر"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (HeaderBOT in SeoPlus) */}
      <div className="border-b border-gray-100 dark:border-[#2f366b] transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-14 lg:h-20 flex items-center justify-between gap-4">
          
          {/* Right Section: Brand Logo */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
              }}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <img
                src="/logo-spider.png"
                alt="العنكبوت للمعلومات"
                className="w-9 h-9 lg:w-11 lg:h-11 rounded-full object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />

              <div className="flex flex-col">
                <span className="font-black text-base lg:text-xl text-gray-900 dark:text-white tracking-tight leading-none group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors">
                  العنكبوت <span className="text-[#035dcd] dark:text-blue-400 font-extrabold">للمعلومات</span>
                </span>
                <span className="text-[9px] lg:text-[10px] text-gray-400 font-medium tracking-wider">
                  information-net.com
                </span>
              </div>
            </a>
          </div>

          {/* Center Section: Desktop Nav Links - Hidden on Mobile */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('all');
              }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'text-[#035dcd] dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/30'
                  : 'hover:text-[#035dcd] dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-[#1e2348]'
              }`}
            >
              الرئيسية
            </a>

            {categories.filter(c => c.slug !== 'all').map((cat) => (
              <a
                key={cat.slug}
                href={`/${cat.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(cat.slug);
                }}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeCategory === cat.slug || (activeCategory === 'all' && false)
                    ? 'text-[#035dcd] dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/30'
                    : 'hover:text-[#035dcd] dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-[#1e2348]'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </nav>

          {/* Left Section: Action Buttons - Some hidden on mobile */}
          <div className="flex items-center gap-2">
            {/* In-App PWA Install Button in Header Bar (hidden when already installed) */}
            {!isInstalled && (
              <button
                onClick={handlePWAInstallClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#035dcd] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="تثبيت تطبيق العنكبوت للمعلومات (PWA)"
                aria-label="تثبيت التطبيق"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تثبيت التطبيق</span>
              </button>
            )}

            {/* Search Trigger - Hidden on mobile header */}
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#1e2348] hover:bg-gray-200 dark:hover:bg-[#2d3363] text-gray-700 dark:text-gray-200 items-center justify-center transition-colors cursor-pointer"
              title="البحث في الموقع"
              aria-label="بحث"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle - Hidden on mobile header */}
            <button
              onClick={onToggleDarkMode}
              className="hidden lg:flex w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#1e2348] hover:bg-gray-200 dark:hover:bg-[#2d3363] text-gray-700 dark:text-gray-200 items-center justify-center transition-colors cursor-pointer"
              title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              aria-label="تبديل الوضع"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Promotional Download Banner - Only visible on Homepage */}
      {activeCategory === 'all' && (
        <div className="relative bg-[#035dcd] bg-[url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcG2lXiWcAYQcZA0-pBLgPL8hGSY7tkBu2r-VlfQFSJ4j3CIeUbyIhCkiwKdqCj43FU-d7YabW6mX9a_30KhMK2pUVeqArhf4861H3bgcKhSRoD0abhNoYIj71ibl73htOcJUhLFvCE3mUUs6y1efGsyCBawzOpP-UyKSq9YR8K-T33EgTLcpPFf8AIOk/s1600/2fe08e27-c206-4415-8ae9-48e52f82d936.png')] bg-cover bg-center bg-no-repeat text-white border-b border-blue-400/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="flex-1 text-right">
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight drop-shadow-md">
                العنكبوت <span className="text-blue-200 font-extrabold">للمعلومات</span>
              </h2>
              <p className="text-blue-50 text-sm md:text-lg mb-8 leading-relaxed opacity-95 max-w-xl font-medium drop-shadow">
                مدونة تعليمية تقنية شاملة تغطي الألعاب، البرامج، ببجي موبايل، الذكاء الاصطناعي، والشروحات والحلول التقنية الحصرية. عالمك التقني في مكان واحد.
              </p>
              <div className="flex flex-wrap gap-4 justify-end md:justify-start">
                <button
                  onClick={handlePWAInstallClick}
                  className="bg-white text-[#035dcd] px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-50 active:scale-95 transition-all shadow-xl hover:shadow-blue-500/20 flex items-center gap-2.5 group cursor-pointer"
                  title="تحميل وتثبيت تطبيق العنكبوت للمعلومات (PWA)"
                >
                  {isInstalled ? (
                    <>
                      <span>التطبيق مثبّت على جهازك</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </>
                  ) : (
                    <>
                      <span>حمل الآن</span>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Categories Scroll Bar - ONLY visible on LG and below */}
      <div className="lg:hidden border-b border-gray-100 dark:border-[#2f366b] bg-gray-50/50 dark:bg-[#1f244a]/50 overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                activeCategory === cat.slug
                  ? 'bg-[#035dcd] text-white border-[#035dcd] shadow-sm'
                  : 'bg-white dark:bg-[#252a54] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#2f366b] hover:border-[#035dcd]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PWA Installation Dialog / Guide Modal */}
      {showPWAInstallModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowPWAInstallModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e2348] p-6 text-right shadow-2xl border border-gray-100 dark:border-[#2f366b] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-[#2f366b]">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="العنكبوت للمعلومات"
                  className="w-12 h-12 rounded-2xl shadow-md border border-blue-100 dark:border-blue-900"
                />
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    تطبيق العنكبوت للمعلومات (PWA)
                  </h3>
                  <p className="text-xs text-[#035dcd] dark:text-blue-400 font-bold">
                    تصفح سريع • إشعارات فورية • يعمل بدون إنترنت
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPWAInstallModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#252a54] text-gray-500 hover:text-gray-800 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isInstalled ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>تطبيق العنكبوت للمعلومات مثبّت بالفعل على جهازك! يمكنك فتحه مباشرة من الشاشة الرئيسية.</span>
              </div>
            ) : isInstallable ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  اضغط على الزر أدناه لتثبيت تطبيق <strong>العنكبوت للمعلومات</strong> مباشرة على جهازك بضغطة واحدة:
                </p>
                <button
                  onClick={async () => {
                    const accepted = await install();
                    if (accepted) setShowPWAInstallModal(false);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#035dcd] hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>تثبيت التطبيق الآن</span>
                </button>
              </div>
            ) : isIOS ? (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <p className="font-bold text-gray-900 dark:text-white">
                  لتثبيت التطبيق على أجهزة iPhone و iPad:
                </p>
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-[#252a54] space-y-2.5 border border-blue-100 dark:border-[#2f366b]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#035dcd] text-white text-xs font-black flex items-center justify-center shrink-0">1</span>
                    <span className="flex items-center gap-1.5 flex-wrap">
                      اضغط على زر <strong>المشاركة (Share)</strong>
                      <Share className="w-4 h-4 text-[#035dcd] inline" /> في شريط متصفح Safari.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#035dcd] text-white text-xs font-black flex items-center justify-center shrink-0">2</span>
                    <span className="flex items-center gap-1.5 flex-wrap">
                      اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>
                      <PlusSquare className="w-4 h-4 text-[#035dcd] inline" />.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#035dcd] text-white text-xs font-black flex items-center justify-center shrink-0">3</span>
                    <span>اضغط على <strong>إضافة (Add)</strong> في أعلى الشاشة ليظهر التطبيق فوراً.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
                {isIframe && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                    <p className="font-bold mb-2">
                      لتفعيل نافذة التثبيت التلقائية المباشرة في المتصفح، افتح الموقع في نافذة مستقلة ثم اضغط «حمل الآن»:
                    </p>
                    <a
                      href={typeof window !== 'undefined' ? window.location.href : '/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#035dcd] hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      <span>فتح في نافذة مستقلة وتثبيت التطبيق</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#252a54] space-y-2.5 border border-gray-100 dark:border-[#2f366b]">
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#035dcd]" />
                    <span>خطوات التثبيت المباشر (Android / سطح المكتب):</span>
                  </p>
                  <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#035dcd] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>
                      <strong>على الهاتف (Chrome):</strong> اضغط على القائمة <strong>(⋮)</strong> أعلى المتصفح ثم اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«الإضافة إلى الشاشة الرئيسية»</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#035dcd] text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>
                      <strong>على الكمبيوتر (Chrome / Edge):</strong> اضغط على أيقونة <strong>تثبيت التطبيق (+)</strong> في شريط العنوان أعلى المتصفح.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPWAInstallModal(false)}
              className="mt-5 w-full rounded-2xl bg-gray-100 dark:bg-[#252a54] hover:bg-gray-200 dark:hover:bg-[#2d3363] py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

