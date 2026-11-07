import React, { useState, useMemo } from 'react';
import {
  Gauge,
  Sparkles,
  QrCode,
  Search,
  FileImage,
  Eraser,
  Facebook,
  Instagram,
  Youtube,
  Wrench,
  ArrowLeft,
  ChevronLeft,
  HelpCircle,
  BookOpen,
  Info,
  ShieldCheck,
  Smartphone,
  Zap,
  Settings,
} from 'lucide-react';
import {
  SITE_TOOLS,
  TOOL_CATEGORIES,
  SiteToolItem,
  ToolCategoryKey,
} from '../data/toolsData';
import {
  InternetSpeedTestTool,
  AiPromptGeneratorTool,
} from './tools/SpeedTestAndPromptTools';
import {
  BarcodeGeneratorTool,
  GoogleSnippetPreviewTool,
} from './tools/BarcodeAndSnippetTools';
import {
  ImageCompressorTool,
  BackgroundRemoverTool,
} from './tools/ImageProcessingTools';
import { VideoInspectorTool } from './tools/VideoDownloaderTools';
import { AdSenseUnit } from './AdSenseUnit';

interface ToolsSectionViewProps {
  selectedTool: SiteToolItem | null;
  onSelectTool: (toolSlug: string) => void;
  onBackToToolsIndex: () => void;
  onBackToHome: () => void;
}

interface CardVisualStyle {
  cardBg: string;
  cardBorder: string;
  iconWrapperClass: string;
  buttonClass: string;
}

const getToolCardVisualStyle = (slug: string, index: number): CardVisualStyle => {
  switch (slug) {
    case 'internet-speed-test':
      return {
        cardBg:
          'bg-gradient-to-b from-[#f8fbff] via-white to-[#f2f7ff] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#e2ecf8] hover:border-blue-400 dark:border-[#2f366b] dark:hover:border-blue-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#3395ff] to-[#0062e6] text-white shadow-[0_10px_22px_-5px_rgba(0,98,230,0.45)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#005ce6] to-[#1f7aff] hover:from-[#004ec4] hover:to-[#0062e6] shadow-[0_6px_16px_-3px_rgba(0,92,230,0.45)]',
      };
    case 'aprompt-generator':
    case 'ai-prompt-generator':
      return {
        cardBg:
          'bg-gradient-to-b from-[#faf8ff] via-white to-[#f5f1ff] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#ebe4f8] hover:border-purple-400 dark:border-[#2f366b] dark:hover:border-purple-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#9d6eff] to-[#6a32df] text-white shadow-[0_10px_22px_-5px_rgba(106,50,223,0.45)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#632ce0] to-[#874fff] hover:from-[#5221c4] hover:to-[#7138f0] shadow-[0_6px_16px_-3px_rgba(106,50,223,0.45)]',
      };
    case 'barcode-generator':
      return {
        cardBg:
          'bg-gradient-to-b from-[#f6fdfb] via-white to-[#eefaf5] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#dff3ec] hover:border-teal-400 dark:border-[#2f366b] dark:hover:border-teal-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#1dd3a7] to-[#0b9e73] text-white shadow-[0_10px_22px_-5px_rgba(11,158,115,0.42)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#087f6d] to-[#0ea88b] hover:from-[#06695a] hover:to-[#0b9178] shadow-[0_6px_16px_-3px_rgba(8,127,109,0.42)]',
      };
    case 'google-snippet-preview':
      return {
        cardBg:
          'bg-gradient-to-b from-[#fff9f9] via-white to-[#fef2f3] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#f7e2e4] hover:border-rose-400 dark:border-[#2f366b] dark:hover:border-rose-400',
        iconWrapperClass:
          'bg-gradient-to-b from-white to-[#f8fafc] text-gray-800 shadow-[0_10px_22px_-5px_rgba(15,23,42,0.14)] border border-slate-200/90',
        buttonClass:
          'bg-gradient-to-l from-[#e12d4b] to-[#f43f5e] hover:from-[#c8233e] hover:to-[#e11d48] shadow-[0_6px_16px_-3px_rgba(225,45,75,0.42)]',
      };
    case 'image-compressor':
      return {
        cardBg:
          'bg-gradient-to-b from-[#fffdf8] via-white to-[#fef7ea] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#f6ead6] hover:border-amber-400 dark:border-[#2f366b] dark:hover:border-amber-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#ffba3b] to-[#f28d18] text-white shadow-[0_10px_22px_-5px_rgba(242,141,24,0.45)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#eb8514] to-[#f7a223] hover:from-[#d4730b] hover:to-[#eb8514] shadow-[0_6px_16px_-3px_rgba(235,133,20,0.42)]',
      };
    case 'background-remover':
      return {
        cardBg:
          'bg-gradient-to-b from-[#f8fbff] via-white to-[#f2f7ff] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#e2ecf8] hover:border-blue-400 dark:border-[#2f366b] dark:hover:border-blue-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#3395ff] to-[#0062e6] text-white shadow-[0_10px_22px_-5px_rgba(0,98,230,0.45)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#005ce6] to-[#1f7aff] hover:from-[#004ec4] hover:to-[#0062e6] shadow-[0_6px_16px_-3px_rgba(0,92,230,0.45)]',
      };
    case 'facebook-video-downloader':
      return {
        cardBg:
          'bg-gradient-to-b from-[#fff9f9] via-white to-[#fef2f3] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#f7e2e4] hover:border-rose-400 dark:border-[#2f366b] dark:hover:border-rose-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#ff5d6e] to-[#e02844] text-white shadow-[0_10px_22px_-5px_rgba(224,40,68,0.45)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#e12d4b] to-[#f43f5e] hover:from-[#c8233e] hover:to-[#e11d48] shadow-[0_6px_16px_-3px_rgba(225,45,75,0.42)]',
      };
    case 'download-from-instagram':
    case 'instagram-downloader':
      return {
        cardBg:
          'bg-gradient-to-b from-[#faf8ff] via-white to-[#f5f1ff] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#ebe4f8] hover:border-purple-400 dark:border-[#2f366b] dark:hover:border-purple-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#9d6eff] to-[#6a32df] text-white shadow-[0_10px_22px_-5px_rgba(106,50,223,0.45)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#632ce0] to-[#874fff] hover:from-[#5221c4] hover:to-[#7138f0] shadow-[0_6px_16px_-3px_rgba(106,50,223,0.45)]',
      };
    case 'youtube-downloader':
    default: {
      const mod = index % 3;
      if (mod === 0) {
        return {
          cardBg:
            'bg-gradient-to-b from-[#f8fbff] via-white to-[#f2f7ff] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
          cardBorder:
            'border-[#e2ecf8] hover:border-blue-400 dark:border-[#2f366b] dark:hover:border-blue-400',
          iconWrapperClass:
            'bg-gradient-to-b from-[#3395ff] to-[#0062e6] text-white shadow-[0_10px_22px_-5px_rgba(0,98,230,0.45)] ring-1 ring-white/40',
          buttonClass:
            'bg-gradient-to-l from-[#005ce6] to-[#1f7aff] hover:from-[#004ec4] hover:to-[#0062e6] shadow-[0_6px_16px_-3px_rgba(0,92,230,0.45)]',
        };
      }
      return {
        cardBg:
          'bg-gradient-to-b from-[#f6fdfb] via-white to-[#eefaf5] dark:from-[#252a54] dark:via-[#222750] dark:to-[#1e2348]',
        cardBorder:
          'border-[#dff3ec] hover:border-teal-400 dark:border-[#2f366b] dark:hover:border-teal-400',
        iconWrapperClass:
          'bg-gradient-to-b from-[#1dd3a7] to-[#0b9e73] text-white shadow-[0_10px_22px_-5px_rgba(11,158,115,0.42)] ring-1 ring-white/40',
        buttonClass:
          'bg-gradient-to-l from-[#087f6d] to-[#0ea88b] hover:from-[#06695a] hover:to-[#0b9178] shadow-[0_6px_16px_-3px_rgba(8,127,109,0.42)]',
      };
    }
  }
};

export const ToolsSectionView: React.FC<ToolsSectionViewProps> = ({
  selectedTool,
  onSelectTool,
  onBackToToolsIndex,
  onBackToHome,
}) => {
  const [activeCatFilter, setActiveCatFilter] = useState<ToolCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const renderToolIcon = (
    iconName: SiteToolItem['iconName'],
    className = 'w-6 h-6',
    slug?: string
  ) => {
    if (slug === 'google-snippet-preview') {
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      );
    }

    if (slug === 'aprompt-generator' || slug === 'ai-prompt-generator') {
      return (
        <svg
          viewBox="0 0 40 40"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <rect
            x="9"
            y="9"
            width="22"
            height="22"
            rx="5"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M14 4V9M20 4V9M26 4V9M14 31V36M20 31V36M26 31V36M4 14H9M4 20H9M4 26H9M31 14H36M31 20H36M31 26H36"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fill="currentColor"
            fontSize="11"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            AI
          </text>
        </svg>
      );
    }

    if (slug === 'background-remover') {
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <path
            d="M7 7L14 14M7 7V13M7 7H13M29 7L22 14M29 7V13M29 7H23M7 29L14 22M7 29V23M7 29H13M29 29L22 22M29 29V23M29 29H23"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 25L25 11"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    switch (iconName) {
      case 'Gauge':
        return <Gauge className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'QrCode':
        return <QrCode className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'FileImage':
        return <FileImage className={className} />;
      case 'Eraser':
        return <Eraser className={className} />;
      case 'Facebook':
        return <Facebook className={className} />;
      case 'Instagram':
        return <Instagram className={className} />;
      case 'Youtube':
        return <Youtube className={className} />;
      default:
        return <Wrench className={className} />;
    }
  };

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SITE_TOOLS.filter((tool) => {
      const matchesCat =
        activeCatFilter === 'all' || tool.categories.includes(activeCatFilter);
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.h1Title.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q) ||
        tool.categoryLabels.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [activeCatFilter, searchQuery]);

  const renderInteractiveToolComponent = (tool: SiteToolItem) => {
    switch (tool.slug) {
      case 'internet-speed-test':
        return <InternetSpeedTestTool />;
      case 'aprompt-generator':
        return <AiPromptGeneratorTool />;
      case 'barcode-generator':
        return <BarcodeGeneratorTool />;
      case 'google-snippet-preview':
        return <GoogleSnippetPreviewTool />;
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'background-remover':
        return <BackgroundRemoverTool />;
      case 'facebook-video-downloader':
        return <VideoInspectorTool key="facebook" platform="facebook" />;
      case 'download-from-instagram':
        return <VideoInspectorTool key="instagram" platform="instagram" />;
      case 'youtube-downloader':
        return <VideoInspectorTool key="youtube" platform="youtube" />;
      default:
        return null;
    }
  };

  // --- 1. Individual Tool Page (/tools/:slug) ---
  if (selectedTool) {
    const relatedTools = selectedTool.relatedToolSlugs
      .map((slug) => SITE_TOOLS.find((t) => t.slug === slug))
      .filter((t): t is SiteToolItem => Boolean(t));

    const headerStyle = getToolCardVisualStyle(selectedTool.slug, 0);

    return (
      <div className="space-y-8 text-right" dir="rtl">
        {/* Breadcrumbs */}
        <nav
          aria-label="مسار التنقل"
          className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBackToHome();
            }}
            className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            الرئيسية
          </a>
          <span aria-hidden="true">/</span>
          <a
            href="/tools/"
            onClick={(e) => {
              e.preventDefault();
              onBackToToolsIndex();
            }}
            className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            الأدوات
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-gray-900 dark:text-white">{selectedTool.name}</span>
        </nav>

        {/* Tool Page Header Card */}
        <header className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{selectedTool.categoryLabels.join(' · ')}</span>
              <span aria-hidden="true">·</span>
              <span>
                {selectedTool.executionType === 'local-browser'
                  ? 'معالجة محلية في المتصفح'
                  : selectedTool.executionType === 'network-measurement'
                  ? 'قياس شبكي مباشر'
                  : 'فحص بيانات وصفية عامة'}
              </span>
            </div>

            <a
              href="/tools/"
              onClick={(e) => {
                e.preventDefault();
                onBackToToolsIndex();
              }}
              className="text-xs font-bold text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>عرض جميع الأدوات (9)</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${headerStyle.iconWrapperClass}`}
            >
              {renderToolIcon(
                selectedTool.iconName,
                'w-7 h-7 sm:w-8 sm:h-8',
                selectedTool.slug
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {selectedTool.h1Title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
                {selectedTool.introText}
              </p>
            </div>
          </div>
        </header>

        {/* Interactive Tool Workspace */}
        <section
          aria-label={`واجهة أداة ${selectedTool.name}`}
          className="p-5 sm:p-8 rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] shadow-xs"
        >
          {renderInteractiveToolComponent(selectedTool)}
        </section>

        {/* AdSense Slot */}
        <AdSenseUnit
          key={`ad-tool-${selectedTool.slug}`}
          slotType="top"
          postId={`tool-${selectedTool.slug}`}
        />

        {/* Guide & Article Content Section */}
        {selectedTool.articleHtml ? (
          <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-6">
            {selectedTool.imageUrl && !/<img\b/i.test(selectedTool.articleHtml) && (
              <figure className="overflow-hidden rounded-2xl border border-gray-100 dark:border-[#2f366b] shadow-xs">
                <img
                  src={selectedTool.imageUrl}
                  alt={selectedTool.h1Title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </figure>
            )}
            <div
              className="article-raw-html text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:dark:border-[#2f366b] [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:text-sm [&_p]:sm:text-base [&_p]:leading-relaxed [&_p]:mb-3.5 [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:space-y-2 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:space-y-2 [&_ol]:my-4 [&_li]:text-sm [&_li]:sm:text-base [&_li]:leading-relaxed [&_a]:text-[#035dcd] [&_a]:dark:text-blue-400 [&_a]:font-bold [&_a]:underline hover:[&_a]:opacity-85 [&_img]:w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:border [&_img]:border-gray-100 [&_img]:dark:border-[#2f366b] [&_img]:my-5 [&_img]:shadow-xs"
              onClick={(e) => {
                const target = (e.target as HTMLElement).closest('a');
                if (!target) return;
                const href = target.getAttribute('href') || '';
                if (!href) return;

                const isInternal =
                  href.startsWith('/') ||
                  href.startsWith('https://www.information-net.com') ||
                  href.startsWith('http://www.information-net.com');

                if (!isInternal) return;

                const cleanPath = href
                  .replace(/^https?:\/\/(www\.)?information-net\.com/i, '')
                  .replace(/\/+$/, '');

                if (!cleanPath || cleanPath === '') {
                  e.preventDefault();
                  onBackToHome();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }

                if (cleanPath.toLowerCase() === '/tools') {
                  e.preventDefault();
                  onBackToToolsIndex();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }

                const matchedTool = SITE_TOOLS.find(
                  (t) => t.path.toLowerCase() === cleanPath.toLowerCase()
                );
                if (matchedTool) {
                  e.preventDefault();
                  if (matchedTool.slug === selectedTool.slug) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    onSelectTool(matchedTool.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
              dangerouslySetInnerHTML={{ __html: selectedTool.articleHtml }}
            />
          </section>
        ) : (
          <>
            <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-[#2f366b]">
                <BookOpen className="w-5 h-5 text-[#035dcd]" />
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                  دليل الاستخدام والمعلومات التقنية
                </h2>
              </div>

              <div className="space-y-6">
                {selectedTool.guideSections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {sec.heading}
                    </h3>
                    {sec.paragraphs?.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 pr-4 list-disc">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <Info className="w-4 h-4 text-[#035dcd] shrink-0 mt-0.5" />
                <span>
                  <strong>آلية العمل والشفافية:</strong> {selectedTool.executionNotice}
                </span>
              </div>
            </section>

            {/* FAQ Section */}
            {selectedTool.faqs.length > 0 && (
              <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-[#2f366b]">
                  <HelpCircle className="w-5 h-5 text-[#035dcd]" />
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    الأسئلة الشائعة حول {selectedTool.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  {selectedTool.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-2"
                    >
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Related Tools Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              أدوات أخرى قد تهمك
            </h2>
            <a
              href="/tools/"
              onClick={(e) => {
                e.preventDefault();
                onBackToToolsIndex();
              }}
              className="text-xs font-bold text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>تصفح جميع الأدوات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedTools.map((relTool, idx) => {
              const relStyle = getToolCardVisualStyle(relTool.slug, idx);
              return (
                <article
                  key={relTool.id}
                  className={`p-6 rounded-2xl border ${relStyle.cardBg} ${relStyle.cardBorder} transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center justify-between gap-4`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${relStyle.iconWrapperClass}`}
                    >
                      {renderToolIcon(relTool.iconName, 'w-7 h-7', relTool.slug)}
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      <a
                        href={relTool.path}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectTool(relTool.slug);
                        }}
                        className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        {relTool.name}
                      </a>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                      {relTool.shortDescription}
                    </p>
                  </div>

                  <a
                    href={relTool.path}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectTool(relTool.slug);
                    }}
                    className={`px-6 py-2 rounded-full text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${relStyle.buttonClass}`}
                  >
                    <span>استخدم الأداة</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // --- 2. Main Tools Index Page (/tools/) matching the exact visual reference ---
  const scrollToToolsGrid = () => {
    const el = document.getElementById('tools-main-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* 1. Hero Banner Section with Background Image */}
      <header className="relative overflow-hidden rounded-3xl bg-[#dbeeff] bg-[url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhIb05gBjAaOokgGiCI1ptLoWpZU0bWfMoFG9k1oT54Ms1z-6Zp0UUfq4MB8MH8z8aocDdjd_SfBw3yqCmeERtvNweVReHFTz_sb9kxdYPETfen1CT75gZexo6ijmqZeSbknN4m30Iu1VHB9RwimwCqPWll6CXIXKYmGT3vJ8r8F9sEZJOnQhUriTcH0gE/s2164/%D8%AD%D8%A7%D8%B3%D9%88%D8%A8%20%D9%85%D8%AD%D9%85%D9%88%D9%84%20%D9%88%D8%A3%D9%8A%D9%82%D9%88%D9%86%D8%A7%D8%AA%20%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%D8%A7%D8%AA%20%D8%B9%D8%A7%D8%A6%D9%85%D8%A9.png')] bg-cover bg-center bg-no-repeat border border-[#cbe2ff] dark:border-[#2f366b] shadow-sm px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-6">
          {/* Right Column in RTL: Headline, Subtitle & Primary Pill Button */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-right">
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black leading-[1.35] tracking-tight">
              <span className="block text-[#0f1f3d]">
                أدوات مجانية عبر الإنترنت
              </span>
              <span className="block text-[#0066ff] mt-1">
                من العنكبوت للمعلومات
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-[17px] font-semibold text-[#1e2f4d] leading-relaxed max-w-xl mx-auto lg:mx-0">
              مجموعة من الأدوات المجانية المفيدة التي تساعدك في إنجاز مهامك بسهولة
              واحترافية.
            </p>

            <div className="pt-1 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={scrollToToolsGrid}
                className="px-8 py-3.5 rounded-full bg-gradient-to-l from-[#005ce6] to-[#1a75ff] hover:from-[#004ec4] hover:to-[#0062e6] text-white text-sm sm:text-base font-extrabold shadow-[0_10px_25px_-5px_rgba(0,102,255,0.55)] hover:shadow-[0_14px_28px_-5px_rgba(0,102,255,0.65)] transition-all duration-200 flex items-center gap-3 cursor-pointer"
              >
                <span>اكتشف جميع الأدوات</span>
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Unified Tools Section Container (Exact match to reference image) */}
      <section
        id="tools-main-grid"
        className="rounded-3xl bg-white dark:bg-[#202447] border border-slate-200/80 dark:border-[#2f366b] shadow-xs px-4 py-8 sm:px-8 sm:py-10 lg:px-10 space-y-8"
      >
        {/* Section Title with Side Lines & Subtitle */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <span
              aria-hidden="true"
              className="hidden sm:block w-14 md:w-20 h-[2px] bg-gradient-to-r from-transparent to-blue-300 dark:to-blue-500/60"
            />
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0f1f3d] dark:text-white tracking-tight">
              كل أدواتك في{' '}
              <span className="text-[#0066ff] dark:text-blue-400">مكان واحد</span>
            </h2>
            <span
              aria-hidden="true"
              className="hidden sm:block w-14 md:w-20 h-[2px] bg-gradient-to-l from-transparent to-blue-300 dark:to-blue-500/60"
            />
          </div>

          <p className="text-xs sm:text-sm lg:text-base font-medium text-slate-600 dark:text-gray-300">
            اختر الأداة التي تحتاجها واستخدمها مباشرة دون أي تعقيدات.
          </p>
        </div>

        {/* Optional Quick Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
            {TOOL_CATEGORIES.map((cat) => {
              const isActive = activeCatFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCatFilter(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0066ff] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#1b1e38] text-slate-700 dark:text-gray-200 hover:bg-slate-200/80 dark:hover:bg-[#282e5c]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أداة..."
              aria-label="البحث في الأدوات"
              className="w-full pr-10 pl-3.5 py-2 rounded-full bg-slate-50 dark:bg-[#1b1e38] border border-slate-200 dark:border-[#2f366b] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0066ff]"
            />
          </div>
        </div>

        {/* 3x3 Centered Tool Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-50 dark:bg-[#1b1e38] border border-slate-200 dark:border-[#2f366b] text-center space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              لا توجد أداة مطابقة لعبارة البحث «{searchQuery}»
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCatFilter('all');
              }}
              className="px-5 py-2 rounded-full bg-[#0066ff] text-white text-xs font-bold cursor-pointer"
            >
              عرض جميع الأدوات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredTools.map((tool, idx) => {
              const style = getToolCardVisualStyle(tool.slug, idx);
              return (
                <article
                  key={tool.id}
                  onClick={() => onSelectTool(tool.slug)}
                  className={`group relative rounded-2xl border ${style.cardBg} ${style.cardBorder} p-6 sm:p-7 flex flex-col items-center text-center justify-between gap-5 shadow-[0_4px_16px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.14)] hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex flex-col items-center space-y-3.5 w-full">
                    {/* Glossy 3D Squircle Icon */}
                    <div
                      className={`w-16 h-16 rounded-[18px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${style.iconWrapperClass}`}
                    >
                      {renderToolIcon(tool.iconName, 'w-8 h-8', tool.slug)}
                    </div>

                    {/* Tool Title */}
                    <h3 className="text-base sm:text-lg font-black text-[#0f1f3d] dark:text-white leading-snug pt-1">
                      <a
                        href={tool.path}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectTool(tool.slug);
                        }}
                        className="hover:text-[#0066ff] dark:hover:text-blue-400 transition-colors"
                      >
                        {tool.name}
                      </a>
                    </h3>

                    {/* Short 2-line Description */}
                    <p className="text-xs sm:text-[13.5px] text-slate-600 dark:text-gray-300 leading-relaxed max-w-[270px]">
                      {tool.shortDescription}
                    </p>
                  </div>

                  {/* Rounded Pill Button matching Card Theme */}
                  <a
                    href={tool.path}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectTool(tool.slug);
                    }}
                    className={`px-7 py-2.5 rounded-full text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 ${style.buttonClass}`}
                  >
                    <span>استخدم الأداة</span>
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                  </a>
                </article>
              );
            })}
          </div>
        )}

        {/* 4-Feature Trust Bar at the bottom (Exact match to reference image) */}
        <div className="rounded-2xl bg-[#f1f6fc] dark:bg-[#1b1e38] border border-[#dce8f7] dark:border-[#2f366b] py-5 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#d8e5f3] dark:divide-[#2f366b] gap-4 sm:gap-0">
            {/* Feature 1 (Rightmost in RTL): أدوات متنوعة */}
            <div className="flex items-center justify-center gap-3.5 px-3 py-2 sm:py-1">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-[#252a54] text-[#0066ff] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-[#0f1f3d] dark:text-white">
                  أدوات متنوعة
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400">
                  تلبي احتياجاتك اليومية
                </div>
              </div>
            </div>

            {/* Feature 2: متوافقة مع جميع الأجهزة */}
            <div className="flex items-center justify-center gap-3.5 px-3 py-2 sm:py-1">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-[#252a54] text-[#0066ff] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-[#0f1f3d] dark:text-white">
                  متوافقة مع جميع الأجهزة
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400">
                  على الكمبيوتر والهواتف
                </div>
              </div>
            </div>

            {/* Feature 3: سريعة وسهلة الاستخدام */}
            <div className="flex items-center justify-center gap-3.5 px-3 py-2 sm:py-1">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-[#252a54] text-[#0066ff] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-[#0f1f3d] dark:text-white">
                  سريعة وسهلة الاستخدام
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400">
                  واجهة بسيطة وواضحة
                </div>
              </div>
            </div>

            {/* Feature 4 (Leftmost in RTL): آمنة وموثوقة */}
            <div className="flex items-center justify-center gap-3.5 px-3 py-2 sm:py-1">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-[#252a54] text-[#0066ff] dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-[#0f1f3d] dark:text-white">
                  آمنة وموثوقة
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400">
                  مبنية بمعايير أمان عالية
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Unit */}
      <AdSenseUnit key="ad-tools-index" slotType="bottom" postId="tools-index" />
    </div>
  );
};
