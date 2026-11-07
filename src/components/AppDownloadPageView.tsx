import React, { useState } from 'react';
import {
  Download,
  Star,
  ShieldCheck,
  Users,
  Shield,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  FileCode,
  Copy,
} from 'lucide-react';
import { DownloadAppItem, DOWNLOAD_APPS } from '../data/downloadsApps';
import { Post } from '../types';
import { AdSenseUnit } from './AdSenseUnit';
import { getAppBreadcrumbs } from '../utils/breadcrumbs';

interface AppDownloadPageViewProps {
  app: DownloadAppItem;
  allPosts: Post[];
  onSelectApp: (slug: string) => void;
  onBackToDownloads: () => void;
  onBackToHome: () => void;
  onSelectPost: (post: Post) => void;
  onOpenLightbox?: (url: string, title?: string) => void;
  onOpenSeoViewer?: () => void;
}

export const AppDownloadPageView: React.FC<AppDownloadPageViewProps> = ({
  app,
  allPosts,
  onSelectApp,
  onBackToDownloads,
  onBackToHome,
  onSelectPost,
  onOpenLightbox,
  onOpenSeoViewer,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showInlineSchema, setShowInlineSchema] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const relatedArticle = app.relatedPostSlug
    ? allPosts.find((p) => p.slug === app.relatedPostSlug)
    : undefined;

  const breadcrumbTrail = getAppBreadcrumbs(app);

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) =>
      prev === 0 ? app.screenshots.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) =>
      prev === app.screenshots.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 text-right select-none" dir="rtl">
      {/* Top Bar: Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 px-1">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-start gap-1.5 text-xs sm:text-sm font-bold text-[#0568e8] dark:text-blue-400"
        >
          {breadcrumbTrail.map((item, idx) => {
            const isLast = idx === breadcrumbTrail.length - 1;
            return (
              <React.Fragment key={`${item.name}-${idx}`}>
                {idx > 0 && <ChevronLeft className="w-3.5 h-3.5 text-[#647890]" />}
                {isLast ? (
                  <span className="text-[#0b2545] dark:text-white font-extrabold">
                    {item.name}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToDownloads();
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    {item.name}
                  </a>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* 1. Main Hero App Card */}
      <section className="relative overflow-hidden bg-gradient-to-l from-[#f1f7ff] via-[#f8fbff] to-[#eef5ff] dark:from-[#22274e] dark:via-[#1e2243] dark:to-[#252a54] rounded-[28px] p-5 sm:p-7 lg:p-8 border border-[#dce9f9] dark:border-[#2f366b] shadow-[0_8px_30px_rgba(3,93,205,0.06)]">
        {/* Subtle decorative background wave matching reference image */}
        <svg
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-45 dark:opacity-10"
          viewBox="0 0 1200 320"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 240C320 310 580 80 920 180C1060 220 1150 140 1200 100V320H0V240Z"
            fill="url(#heroWaveGrad)"
          />
          <defs>
            <linearGradient id="heroWaveGrad" x1="0" y1="0" x2="1200" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d8ebff" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-7">
          {/* Right Side in RTL: App Icon + Title + Developer + Stats + 3 Pill Badges */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 w-full lg:w-auto text-center sm:text-right">
            {/* Large App Icon */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-[28px] bg-white dark:bg-[#2a305e] p-1.5 shadow-[0_10px_25px_rgba(7,36,70,0.12)] border border-white dark:border-[#38407a] shrink-0 overflow-hidden">
              <img
                src={app.icon}
                alt={app.arabicName}
                className="w-full h-full object-cover rounded-[22px]"
              />
            </div>

            {/* App Primary Metadata */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0b2545] dark:text-white tracking-tight leading-tight">
                {app.name}
              </div>

              <a
                href={app.googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base font-extrabold text-[#0568e8] dark:text-blue-400 hover:underline mt-1 inline-flex items-center gap-1"
              >
                <span>{app.developer}</span>
              </a>

              <p className="text-xs sm:text-sm font-bold text-[#1e3552] dark:text-gray-300 mt-1.5">
                {app.tagline}
              </p>

              {/* 3 Stat Columns with vertical dividers (Rating | Downloads | Age Rating) */}
              <div className="flex items-center justify-center sm:justify-start gap-5 sm:gap-7 mt-4 pt-1">
                {/* 1. Rating */}
                <div className="flex flex-col items-center sm:items-start pl-5 sm:pl-7 border-l border-[#cfe0f5] dark:border-[#343b70]">
                  <div className="flex items-center gap-1.5" dir="ltr">
                    <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                    <span className="text-base sm:text-lg font-black text-[#0b2545] dark:text-white">
                      {app.rating}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#476282] dark:text-gray-400 mt-0.5">
                    ({app.reviewsCountText})
                  </span>
                </div>

                {/* 2. Downloads Count */}
                <div className="flex flex-col items-center pl-5 sm:pl-7 border-l border-[#cfe0f5] dark:border-[#343b70]">
                  <span dir="ltr" className="text-base sm:text-lg font-black text-[#0b2545] dark:text-white">
                    {app.downloads}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#476282] dark:text-gray-400 mt-0.5">
                    عمليات التنزيل
                  </span>
                </div>

                {/* 3. Age Rating */}
                <div className="flex flex-col items-center">
                  <span
                    dir="ltr"
                    className="inline-flex items-center justify-center bg-[#0b2545] dark:bg-blue-600 text-white text-[11px] font-black px-1.5 py-0.5 rounded-md leading-none"
                  >
                    {app.ageRating}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#476282] dark:text-gray-400 mt-1">
                    {app.ageRatingLabel}
                  </span>
                </div>
              </div>

              {/* 3 Rounded Pill Badges below stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#e9f2fc] dark:bg-[#2a305e] border border-[#cfe2f9] dark:border-[#38407a] text-[#0b2545] dark:text-blue-200 text-xs font-extrabold inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0568e8] dark:text-blue-400" />
                  <span>متوفر موثوق</span>
                </span>

                <span className="px-3.5 py-1.5 rounded-full bg-[#e9f2fc] dark:bg-[#2a305e] border border-[#cfe2f9] dark:border-[#38407a] text-[#0b2545] dark:text-blue-200 text-xs font-extrabold inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#0568e8] dark:text-blue-400" />
                  <span>{app.categoryBadge}</span>
                </span>

                <span className="px-3.5 py-1.5 rounded-full bg-[#e9f2fc] dark:bg-[#2a305e] border border-[#cfe2f9] dark:border-[#38407a] text-[#0b2545] dark:text-blue-200 text-xs font-extrabold inline-flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#0568e8] dark:text-blue-400" />
                  <span>المبرمجين</span>
                </span>
              </div>
            </div>
          </div>

          {/* Left Side in RTL: Large Blue Download Button + Price Subtitle + 3 Technical Specs */}
          <div className="w-full lg:w-[360px] flex flex-col items-center shrink-0 pt-2 lg:pt-1">
            <a
              href={app.googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-l from-[#0066ff] to-[#0576f3] hover:from-[#0052cc] hover:to-[#0462cc] text-white font-black text-lg sm:text-xl shadow-[0_8px_24px_rgba(0,102,255,0.3)] hover:shadow-[0_10px_28px_rgba(0,102,255,0.4)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>تحميل الآن</span>
            </a>

            <span className="text-xs font-bold text-[#3b5575] dark:text-gray-300 mt-2.5">
              {app.priceText}
            </span>

            {/* 3 Technical Specs Row: تاريخ التحديث | الإصدار | الحجم */}
            <div className="w-full grid grid-cols-3 gap-2 mt-5 pt-3 border-t border-[#d8e6f7]/80 dark:border-[#343b70] text-center">
              {/* Update Date */}
              <div className="flex flex-col items-center pl-2 border-l border-[#cfe0f5] dark:border-[#343b70]">
                <Briefcase className="w-4 h-4 text-[#0b2545] dark:text-blue-300 mb-1" />
                <span className="text-[11px] font-semibold text-[#476282] dark:text-gray-400">
                  تاريخ التحديث
                </span>
                <span dir="ltr" className="text-xs sm:text-[13px] font-black text-[#0b2545] dark:text-white mt-0.5">
                  {app.updateDate}
                </span>
              </div>

              {/* Version */}
              <div className="flex flex-col items-center pl-2 border-l border-[#cfe0f5] dark:border-[#343b70]">
                <ShieldCheck className="w-4 h-4 text-[#0b2545] dark:text-blue-300 mb-1" />
                <span className="text-[11px] font-semibold text-[#476282] dark:text-gray-400">
                  الإصدار
                </span>
                <span dir="ltr" className="text-xs sm:text-[13px] font-black text-[#0b2545] dark:text-white mt-0.5">
                  {app.version}
                </span>
              </div>

              {/* Size */}
              <div className="flex flex-col items-center">
                <Calendar className="w-4 h-4 text-[#0b2545] dark:text-blue-300 mb-1" />
                <span className="text-[11px] font-semibold text-[#476282] dark:text-gray-400">
                  الحجم
                </span>
                <span dir="ltr" className="text-xs sm:text-[13px] font-black text-[#0b2545] dark:text-white mt-0.5">
                  {app.size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top AdSense Unit directly below the Hero App Card */}
      <AdSenseUnit key={`ad-app-top-${app.slug}`} slotType="top" postId={`app-top-${app.slug}`} />

      {/* 2. Screenshots Gallery Carousel Section (Matches Reference Image 5 Cards + Left/Right Arrows + Dots) */}
      <section className="relative bg-white dark:bg-[#22274e] rounded-[26px] p-4 sm:p-5 border border-[#e3edf8] dark:border-[#2f366b] shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-5">
        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label="الصورة السابقة"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white dark:bg-[#2a305e] border border-[#dce8f6] dark:border-[#3b4380] shadow-md items-center justify-center text-[#0b2545] dark:text-white hover:bg-[#f0f6ff] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Left Navigation Arrow */}
        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="الصورة التالية"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white dark:bg-[#2a305e] border border-[#dce8f6] dark:border-[#3b4380] shadow-md items-center justify-center text-[#0b2545] dark:text-white hover:bg-[#f0f6ff] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 5 Screenshot Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {app.screenshots.map((shot, idx) => {
            const isHighlighted = idx === activeSlideIndex;
            const cardBgClass =
              app.slug === 'whatsapp-messenger'
                ? 'from-[#065f46] to-[#044e3a]'
                : app.slug === 'pubg-mobile'
                ? 'from-[#0f294a] to-[#09192e]'
                : app.slug === 'football-league-2026'
                ? 'from-[#083b66] to-[#052340]'
                : 'from-[#1a2744] to-[#0d1526]';

            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveSlideIndex(idx);
                  if (onOpenLightbox) {
                    onOpenLightbox(shot.url, `${app.arabicName} - ${shot.caption}`);
                  }
                }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b ${cardBgClass} p-3 flex flex-col justify-between h-[240px] sm:h-[250px] cursor-pointer transition-all border-2 ${
                  isHighlighted
                    ? 'border-[#0066ff] shadow-md'
                    : 'border-transparent hover:border-blue-400/60'
                }`}
              >
                {/* Top Arabic Feature Caption inside Screenshot Card */}
                <div className="text-center z-10 px-1 pb-2">
                  <span className="text-white font-extrabold text-xs sm:text-[13px] leading-snug drop-shadow-xs line-clamp-2">
                    {shot.caption}
                  </span>
                </div>

                {/* Inner Smartphone / Gameplay Frame */}
                <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-black/40 border border-white/15 shadow-inner">
                  <img
                    src={shot.url}
                    alt={`${app.arabicName} - ${shot.caption}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {app.screenshots.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlideIndex(idx)}
              aria-label={`انتقل إلى لقطة الشاشة ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === activeSlideIndex
                  ? 'w-2.5 bg-[#0066ff]'
                  : 'w-2.5 bg-[#cbdcf2] dark:bg-[#38407a] hover:bg-[#94b8e8]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. Main Content Section:
          - Right (Main Wide Area): المقال (معلومات التطبيق) with wide container and balanced, readable typography
          - Left (مكان التقييم): تطبيقات مشابهة
      */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-4 sm:gap-5 mt-5 items-start">
        {/* Column 1 (Right in RTL - عرض المقال بعرض واسع وخط متناسق ومريح للقراءة): معلومات التطبيق */}
        <article className="w-full min-w-0 bg-white dark:bg-[#22274e] rounded-[26px] p-4 sm:p-5 border border-[#e3edf8] dark:border-[#2f366b] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-3.5 px-1">
            <div className="text-lg sm:text-xl font-extrabold text-[#0b2545] dark:text-white">
              معلومات التطبيق
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e9f2fc] dark:bg-[#2a305e] text-[#0568e8] dark:text-blue-300">
              دليل شامل ومفصل
            </span>
          </div>

          <div className="w-full bg-[#f5f8fc] dark:bg-[#2a305e] rounded-2xl p-4 sm:p-6 border border-[#e6eef8] dark:border-[#38407a] flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Main H1 Title for the App Download Article - Balanced & Clear */}
              <h1 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-[#0b2545] dark:text-white leading-relaxed">
                {app.h1Title}
              </h1>

              {/* Full Authentic Arabic Intro Paragraphs - Balanced Font Weight & Comfortable Reading Line Height */}
              <div className="space-y-3.5 text-sm sm:text-[15px] font-medium text-[#243b5a] dark:text-gray-200 leading-[1.95]">
                {app.fullDescription.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Middle AdSense Unit inside the App Article after intro */}
              <AdSenseUnit key={`ad-app-mid-${app.slug}`} slotType="middle" postId={`app-mid-${app.slug}`} />

              {/* Structured Article Sections (H2, P, H3, UL/LI) */}
              {app.articleSections && app.articleSections.length > 0 ? (
                <div className="space-y-5 pt-1">
                  {app.articleSections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="pt-4 border-t border-[#e1ebf7] dark:border-[#38407a] space-y-3"
                    >
                      <h2 className="text-base sm:text-lg font-extrabold text-[#0b2545] dark:text-white leading-snug">
                        {sec.heading}
                      </h2>

                      {sec.paragraphs &&
                        sec.paragraphs.map((pText, pIdx) => (
                          <p
                            key={pIdx}
                            className="text-sm sm:text-[15px] font-medium text-[#243b5a] dark:text-gray-200 leading-[1.95]"
                          >
                            {pText}
                          </p>
                        ))}

                      {sec.subSections && sec.subSections.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {sec.subSections.map((sub, subIdx) => (
                            <div
                              key={subIdx}
                              className="bg-white/95 dark:bg-[#22274e]/90 rounded-xl p-3.5 sm:p-4 border border-[#e5eef9] dark:border-[#38407a]"
                            >
                              <h3 className="text-sm sm:text-[15px] font-bold text-[#0568e8] dark:text-blue-300 mb-1.5">
                                {sub.subHeading}
                              </h3>
                              <p className="text-xs sm:text-sm font-normal text-[#2c4464] dark:text-gray-300 leading-[1.85]">
                                {sub.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {sec.bullets && sec.bullets.length > 0 && (
                        <ul className="space-y-2.5 pt-1">
                          {sec.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="flex items-start justify-start gap-2.5 text-sm sm:text-[15px] font-medium text-[#243b5a] dark:text-gray-200 leading-[1.85]"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white fill-[#0066ff] shrink-0 mt-1.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0b2545] dark:text-white mt-4 mb-3">
                    أبرز المميزات
                  </h2>
                  <ul className="space-y-2.5">
                    {app.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-start gap-2.5 text-sm sm:text-[15px] font-medium text-[#243b5a] dark:text-gray-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white fill-[#0066ff] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FAQ Section inside App Information */}
              {app.faqs && app.faqs.length > 0 && (
                <div className="pt-4 border-t border-[#e1ebf7] dark:border-[#38407a] space-y-3">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0b2545] dark:text-white">
                    الأسئلة الشائعة حول {app.arabicName}
                  </h2>
                  <div className="space-y-2.5">
                    {app.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        className="bg-white/95 dark:bg-[#22274e]/90 rounded-xl p-3.5 sm:p-4 border border-[#e5eef9] dark:border-[#38407a]"
                      >
                        <h3 className="text-sm sm:text-[15px] font-bold text-[#0b2545] dark:text-white mb-1">
                          {faq.question}
                        </h3>
                        <p className="text-xs sm:text-sm font-normal text-[#476282] dark:text-gray-300 leading-[1.85]">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official Source Link & Related Guide Link */}
            <div className="mt-6 pt-4 border-t border-[#dce7f5] dark:border-[#38407a] flex flex-wrap items-center justify-between gap-3">
              <a
                href={app.googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-[#0066ff] dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>المصدر الرسمي على متجر Google Play ({app.packageId})</span>
              </a>

              {relatedArticle && (
                <a
                  href={`/${relatedArticle.categorySlug}/${relatedArticle.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPost(relatedArticle);
                  }}
                  className="text-xs sm:text-sm font-bold text-[#0b2545] dark:text-gray-200 hover:text-[#0066ff] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>اقرأ الدليل والشرح الكامل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </article>

        {/* Column 2 (Leftmost in RTL - مكان التقييم بعد حذف التقييم): تطبيقات مشابهة */}
        <div className="bg-white dark:bg-[#22274e] rounded-[26px] p-5 sm:p-6 border border-[#e3edf8] dark:border-[#2f366b] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:sticky lg:top-20">
          <h2 className="text-lg sm:text-xl font-black text-[#0b2545] dark:text-white mb-4">
            تطبيقات مشابهة
          </h2>

          <div className="flex flex-col gap-3.5 flex-1">
            {app.similarApps.map((sim, index) => {
              const targetSlug = sim.slug || 'pubg-mobile';
              return (
                <a
                  key={index}
                  href={`/Downloads/${targetSlug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectApp(targetSlug);
                  }}
                  className="group bg-[#f8fbff] dark:bg-[#2a305e] hover:bg-[#edf5ff] dark:hover:bg-[#32396e] rounded-2xl p-3.5 border border-[#e9f1fb] dark:border-[#38407a] transition-all flex items-center justify-between gap-3 cursor-pointer"
                >
                  {/* Right in RTL: Icon + Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={sim.icon}
                      alt={sim.name}
                      className="w-13 h-13 rounded-2xl object-cover shrink-0 shadow-2xs bg-white"
                    />
                    <div className="min-w-0 text-right">
                      <h3
                        dir="ltr"
                        className="text-xs sm:text-sm font-black text-[#0b2545] dark:text-white truncate group-hover:text-[#0066ff] dark:group-hover:text-blue-400"
                      >
                        {sim.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-semibold text-[#5c738f] dark:text-gray-400 truncate mt-0.5">
                        {sim.subtitle}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1 text-[11px] font-bold">
                        <span
                          dir="ltr"
                          className="text-[#476282] dark:text-gray-300 inline-flex items-center gap-0.5"
                        >
                          <Download className="w-3 h-3 text-[#0066ff]" />
                          <span>{sim.downloads}</span>
                        </span>
                        <span
                          dir="ltr"
                          className="text-[#0b2545] dark:text-white inline-flex items-center gap-0.5 font-extrabold"
                        >
                          <Star className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                          <span>{sim.rating}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Left in RTL: Chevron arrow */}
                  <ChevronLeft className="w-4 h-4 text-[#0b2545] dark:text-gray-400 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom AdSense Unit after the main content section */}
      <AdSenseUnit key={`ad-app-bot-${app.slug}`} slotType="bottom" postId={`app-bot-${app.slug}`} />

      {/* 5. Other Available Store Apps Strip for Internal Linking & SEO Discovery */}
      <section className="mt-6 bg-white dark:bg-[#22274e] rounded-[26px] p-5 border border-[#e3edf8] dark:border-[#2f366b]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-black text-[#0b2545] dark:text-white">
            المزيد من تطبيقات وألعاب متجر العنكبوت
          </h2>
          <a
            href="/Downloads/"
            onClick={(e) => {
              e.preventDefault();
              onBackToDownloads();
            }}
            className="text-xs sm:text-sm font-extrabold text-[#0066ff] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>تصفح جميع التطبيقات</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {DOWNLOAD_APPS.map((otherApp) => (
            <a
              key={otherApp.id}
              href={`/Downloads/${otherApp.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectApp(otherApp.slug);
              }}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                otherApp.slug === app.slug
                  ? 'bg-[#eef6ff] dark:bg-[#2f366b] border-[#0066ff]'
                  : 'bg-[#f8fbff] dark:bg-[#2a305e] border-[#e6eef8] dark:border-[#38407a] hover:border-blue-300'
              }`}
            >
              <img
                src={otherApp.icon}
                alt={otherApp.arabicName}
                className="w-13 h-13 rounded-2xl object-cover shrink-0 bg-white shadow-2xs"
              />
              <div className="min-w-0 flex-1 text-right">
                <h3 className="text-xs sm:text-sm font-black text-[#0b2545] dark:text-white truncate">
                  {otherApp.arabicName}
                </h3>
                <p className="text-[11px] font-semibold text-[#5c738f] dark:text-gray-400 line-clamp-1 mt-0.5">
                  {otherApp.shortDescription}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] font-bold">
                  <span dir="ltr" className="text-[#0066ff] dark:text-blue-300">
                    {otherApp.downloads}
                  </span>
                  <span dir="ltr" className="text-[#0b2545] dark:text-gray-200 inline-flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                    {otherApp.rating}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
