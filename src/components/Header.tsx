import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Download,
  CheckCircle2,
  Smartphone,
  Share,
  PlusSquare,
  ExternalLink,
  X,
  Menu,
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
  onOpenMobileMenu,
  onOpenSearch,
  activeCategory,
  onSelectCategory,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showPWAInstallModal, setShowPWAInstallModal] = useState(false);

  const isIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  const navItems = [
    { label: 'الرئيسية', slug: 'all', href: '/' },
    { label: 'التقنية', slug: 'Blog', href: '/Blog/' },
    { label: 'الذكاء الاصطناعي', slug: 'AI', href: '/AI/' },
    { label: 'الألعاب', slug: 'Games', href: '/Blog/' },
    { label: 'البرامج', slug: 'Downloads', href: '/Downloads/' },
    { label: 'الربح من الإنترنت', slug: 'Business', href: '/Business/' },
    { label: 'شروحات', slug: 'tools', href: '/tools/' },
  ];

  const isNavItemActive = (slug: string, index: number) => {
    if (index === 0) return activeCategory === 'all';
    if (index === 3) return false; // Secondary alias for Blog
    return activeCategory === slug;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b1120] text-white border-b border-slate-800/80 shadow-md">
      <div className="w-full max-w-6xl mx-auto px-2.5 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Right Side (RTL Start): Brand Logo + Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#161f33] border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer shrink-0"
            aria-label="القائمة"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#111c35] border border-sky-500/30 flex items-center justify-center shadow-inner shrink-0">
              <img
                src="/logo-spider.png"
                alt="العنكبوت للمعلومات"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            </div>
            <div className="flex flex-col text-right min-w-0">
              <div className="text-[13px] sm:text-lg font-extrabold tracking-tight leading-none flex items-center gap-1 font-heading truncate">
                <span className="text-white">العنكبوت</span>
                <span className="text-[#38bdf8]">للمعلومات</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium mt-0.5 sm:mt-1 truncate">
                التكنولوجيا بلا حدود
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs xl:text-[13px] font-bold">
            {navItems.map((item, idx) => {
              const active = isNavItemActive(item.slug, idx);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(item.slug);
                  }}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#0284c7] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Left Side (RTL End): Search Input Pill + Dark Mode Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Search Input Box inside Header */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center justify-between gap-1.5 sm:gap-3 w-24 sm:w-52 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-[#161f33] hover:bg-[#1c2740] border border-slate-700/70 text-slate-400 text-[11px] sm:text-xs transition-colors cursor-pointer"
            title="البحث في الموقع"
            aria-label="ابحث في الموقع"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">ابحث...</span>
            </span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#161f33] hover:bg-[#1c2740] border border-slate-700/70 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            aria-label="تبديل الوضع"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-amber-400 fill-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* PWA Installation Dialog / Guide Modal */}
      {showPWAInstallModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowPWAInstallModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1e2348] p-6 text-right shadow-2xl border border-gray-100 dark:border-[#2f366b]"
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
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#035dcd] hover:bg-blue-700 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                      لتفعيل نافذة التثبيت التلقائية المباشرة في المتصفح، افتح الموقع في نافذة مستقلة:
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
