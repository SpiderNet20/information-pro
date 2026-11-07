import React, { useState } from 'react';
import {
  Home,
  ChevronLeft,
  Info,
  Mail,
  Shield,
  FileText,
  Globe,
  Share2,
  Copy,
  CheckCircle2,
  Sparkles,
  Send,
  User,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Search,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  Layers,
  ArrowRight,
  Printer,
  Download,
  Flame,
  Gamepad2,
  Cpu,
} from 'lucide-react';
import { StandalonePageType, Post, CategoryInfo } from '../types';
import { AdSenseUnit } from './AdSenseUnit';
import { DOWNLOAD_APPS } from '../data/downloadsApps';

interface StandalonePageViewProps {
  pageType: StandalonePageType;
  posts: Post[];
  categories: CategoryInfo[];
  onSelectPost: (post: Post) => void;
  onSelectCategory: (cat: string) => void;
  onGoHome: () => void;
  onNavigatePage: (page: StandalonePageType) => void;
}

export const StandalonePageView: React.FC<StandalonePageViewProps> = ({
  pageType,
  posts,
  categories,
  onSelectPost,
  onSelectCategory,
  onGoHome,
  onNavigatePage,
}) => {
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('عام');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Sitemap Search & Filter
  const [sitemapFilter, setSitemapFilter] = useState('all');
  const [sitemapQuery, setSitemapQuery] = useState('');
  const [selectedXmlTab, setSelectedXmlTab] = useState<
    | 'sitemap.xml'
    | 'sitemap_index.xml'
    | 'sitemap-downloads.xml'
    | 'sitemap-blog.xml'
    | 'sitemap-services.xml'
    | 'sitemap-pages.xml'
  >('sitemap.xml');
  const [showXmlCode, setShowXmlCode] = useState(true);
  const [copiedXmlCode, setCopiedXmlCode] = useState(false);

  // Toast / Copy Link State
  const [copiedUrl, setCopiedUrl] = useState(false);

  const pageMeta: Record<
    StandalonePageType,
    {
      title: string;
      subtitle: string;
      icon: React.ComponentType<{ className?: string }>;
      color: string;
      path: string;
    }
  > = {
    about: {
      title: 'من نحن - موقع العنكبوت للمعلومات',
      subtitle: 'مدونة تعليمية تقنية شاملة تغطي الألعاب، البرامج، ببجي موبايل، والذكاء الاصطناعي',
      icon: Info,
      color: 'bg-blue-600',
      path: '/about',
    },
    contact: {
      title: 'اتصل بنا - العنكبوت للمعلومات',
      subtitle: 'تواصل مباشرة مع إدارة الموقع للاستفسارات، الشراكات الإعلانية، والدعم الفني',
      icon: Mail,
      color: 'bg-emerald-600',
      path: '/contact',
    },
    privacy: {
      title: 'سياسة الخصوصية - Privacy Policy',
      subtitle: 'بيان الشفافية وحماية البيانات واستخدام ملفات تعريف الارتباط وإعلانات Google AdSense',
      icon: Shield,
      color: 'bg-indigo-600',
      path: '/privacy',
    },
    terms: {
      title: 'اتفاقية الاستخدام - Terms of Use',
      subtitle: 'الشروط والأحكام المنظمة لتصفح واستخدام محتوى موقع العنكبوت للمعلومات',
      icon: FileText,
      color: 'bg-amber-600',
      path: '/terms',
    },
    sitemap: {
      title: 'خريطة الموقع - Sitemap',
      subtitle: 'الفهرس الشامل والدليل السريع لكافة المقالات والأقسام والتصنيفات التقنية',
      icon: Globe,
      color: 'bg-sky-600',
      path: '/sitemap',
    },
  };

  const currentMeta = pageMeta[pageType] || pageMeta.about;
  const PageIcon = currentMeta.icon;

  const handleCopyLink = () => {
    const fullUrl = `https://www.information-net.com${currentMeta.path}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2200);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSubmitted(true);
    }, 800);
  };

  // Sitemap filtered posts
  const filteredSitemapPosts = posts.filter((p) => {
    const matchesCat =
      sitemapFilter === 'all' ||
      p.categorySlug.toLowerCase() === sitemapFilter.toLowerCase() ||
      p.category === sitemapFilter ||
      (sitemapFilter.toLowerCase() === 'downloads' &&
        (p.categorySlug === 'Software' || p.categorySlug === 'Downloads')) ||
      (sitemapFilter.toLowerCase() === 'blog' &&
        (p.categorySlug === 'Education' || p.categorySlug === 'Games'));
    const matchesQuery =
      !sitemapQuery.trim() ||
      p.title.toLowerCase().includes(sitemapQuery.toLowerCase()) ||
      p.snippet.toLowerCase().includes(sitemapQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(sitemapQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const domain = 'https://www.information-net.com';
  const todayIso = '2026-10-18';
  const aiSubSectionPaths = [
    '/AI/Tools/',
    '/AI/Downloads/',
    '/AI/Earning/',
    '/AI/Tools-Comparison/',
  ];

  const formatXmlDate = (dateStr?: string) => {
    if (!dateStr) return todayIso;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? todayIso : d.toISOString().split('T')[0];
  };

  const buildXmlContent = (
    fileKey:
      | 'sitemap.xml'
      | 'sitemap_index.xml'
      | 'sitemap-downloads.xml'
      | 'sitemap-blog.xml'
      | 'sitemap-services.xml'
      | 'sitemap-pages.xml'
  ): string => {
    if (fileKey === 'sitemap_index.xml') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${domain}/sitemap.xml</loc>
    <lastmod>${todayIso}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-downloads.xml</loc>
    <lastmod>${todayIso}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-blog.xml</loc>
    <lastmod>${todayIso}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-services.xml</loc>
    <lastmod>${todayIso}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap-pages.xml</loc>
    <lastmod>${todayIso}</lastmod>
  </sitemap>
</sitemapindex>`;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    if (fileKey === 'sitemap.xml') {
      xml += `
  <url>
    <loc>${domain}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
      categories.forEach((cat) => {
        const prio = cat.slug === 'Downloads' ? '0.95' : '0.9';
        xml += `
  <url>
    <loc>${domain}/${cat.slug}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${prio}</priority>
  </url>`;
      });
      aiSubSectionPaths.forEach((subPath) => {
        xml += `
  <url>
    <loc>${domain}${subPath}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
      });
      DOWNLOAD_APPS.forEach((appItem) => {
        xml += `
  <url>
    <loc>${domain}/Downloads/${appItem.slug}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      });
      (['about', 'contact', 'privacy', 'terms', 'sitemap'] as const).forEach((page) => {
        xml += `
  <url>
    <loc>${domain}/${page}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
      posts.forEach((post) => {
        xml += `
  <url>
    <loc>${domain}/${post.categorySlug}/${post.slug}</loc>
    <lastmod>${formatXmlDate(post.isoDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
      });
    } else if (fileKey === 'sitemap-downloads.xml') {
      xml += `
  <url>
    <loc>${domain}/Downloads/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`;
      DOWNLOAD_APPS.forEach((appItem) => {
        xml += `
  <url>
    <loc>${domain}/Downloads/${appItem.slug}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      });
    } else if (fileKey === 'sitemap-blog.xml') {
      posts.forEach((post) => {
        xml += `
  <url>
    <loc>${domain}/${post.categorySlug}/${post.slug}</loc>
    <lastmod>${formatXmlDate(post.isoDate)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
      });
    } else if (fileKey === 'sitemap-services.xml') {
      categories.forEach((cat) => {
        xml += `
  <url>
    <loc>${domain}/${cat.slug}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
      });
      aiSubSectionPaths.forEach((subPath) => {
        xml += `
  <url>
    <loc>${domain}${subPath}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
      DOWNLOAD_APPS.forEach((appItem) => {
        xml += `
  <url>
    <loc>${domain}/Downloads/${appItem.slug}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      });
    } else if (fileKey === 'sitemap-pages.xml') {
      (['about', 'contact', 'privacy', 'terms', 'sitemap'] as const).forEach((page) => {
        xml += `
  <url>
    <loc>${domain}/${page}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    }

    xml += `\n</urlset>`;
    return xml;
  };

  const activeXmlSource = buildXmlContent(selectedXmlTab);
  const totalSitemapUrls =
    1 + categories.length + aiSubSectionPaths.length + DOWNLOAD_APPS.length + 5 + posts.length;

  const handleCopyXmlSource = () => {
    navigator.clipboard.writeText(activeXmlSource).then(() => {
      setCopiedXmlCode(true);
      setTimeout(() => setCopiedXmlCode(false), 2200);
    });
  };

  const handleDownloadXmlFile = () => {
    const blob = new Blob([activeXmlSource], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedXmlTab;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="w-full space-y-6">
      {/* 1. Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-[#252a54] p-3 rounded-xl border border-gray-100 dark:border-[#2f366b] shadow-xs"
      >
        <button
          onClick={onGoHome}
          className="flex items-center gap-1 hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>الصفحة الرئيسية</span>
        </button>
        <ChevronLeft className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-[#035dcd] dark:text-blue-400">
          {currentMeta.title.split(' - ')[0]}
        </span>
      </nav>

      {/* 2. Page Header / Hero Banner */}
      <div className="bg-white dark:bg-[#252a54] rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-[#2f366b] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#2f366b] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${currentMeta.color} flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0`}
            >
              <PageIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#035dcd] dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/40">
                  صفحة رسمية معتمدة
                </span>
                <span className="text-[11px] text-gray-400">
                  آخر تحديث: 15 أكتوبر 2026
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {currentMeta.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-[#1e2348] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#2a3064] transition-colors cursor-pointer"
              title="نسخ رابط الصفحة الدائم"
            >
              {copiedUrl ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2348] transition-colors cursor-pointer"
              title="طباعة الصفحة"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Nav Bar between statutory pages */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-gray-400 shrink-0 font-medium">الانتقال السريع:</span>
          {(['about', 'contact', 'privacy', 'terms', 'sitemap'] as StandalonePageType[]).map(
            (pKey) => {
              const meta = pageMeta[pKey];
              const isActive = pKey === pageType;
              return (
                <a
                  key={pKey}
                  href={meta.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigatePage(pKey);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#035dcd] text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-[#1e2348] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a3064]'
                  }`}
                >
                  {meta.title.split(' - ')[0]}
                </a>
              );
            }
          )}
        </div>
      </div>

      {/* AdSense Unit Top Banner (excluded from contact page per AdSense policy) */}
      {pageType !== 'contact' && (
        <div className="bg-white dark:bg-[#252a54] p-3 rounded-2xl border border-gray-100 dark:border-[#2f366b] text-center shadow-xs">
          <AdSenseUnit slotType="top" postId={`standalone-top-${pageType}`} />
        </div>
      )}

      {/* 3. Dynamic Page Body Content */}
      <div className="bg-white dark:bg-[#252a54] rounded-2xl p-6 sm:p-10 border border-gray-100 dark:border-[#2f366b] shadow-xs text-right">
        {/* ================= PAGE: ABOUT ================= */}
        {pageType === 'about' && (
          <div className="space-y-8 text-gray-700 dark:text-gray-200 leading-relaxed">
            {/* Intro Hero Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/40">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#035dcd] dark:text-blue-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>مرحباً بكم في موقع العنكبوت للمعلومات (information-net.com)</span>
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                موقع <strong>العنكبوت للمعلومات "information-net"</strong> هو منصة ومدونة تعليمية وتقنية عربية متكاملة، انطلقت بهدف إثراء المحتوى العربي التقني الرصين وتقديم شروحات عملية مجربة ومقالات تثقيفية تواكب أحدث المستجدات في الثورة الرقمية المعاصرة.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-100 dark:border-[#2f366b]">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#035dcd]" />
                  <span>رسالتنا</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  توفير المعرفة التقنية المجانية لجميع المستخدمين في الوطن العربي بلغة واضحة وبسيطة، مع الالتزام التام بالشفافية، ومكافحة الشائعات والمحتوى المضلل، وتسهيل الاستفادة من أدوات الذكاء الاصطناعي والتكنولوجيا اليومية.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-100 dark:border-[#2f366b]">
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>رؤيتنا المستقبلية</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  أن نكون المرجع التقني والتعليمي المفضل لدى الشباب العربي في مجالات الذكاء الاصطناعي، الألعاب الرقمية الاحترافية، البرمجيات الآمنة، والحلول التقنية المبتكرة التي تمكنهم من التطور والعمل عبر الإنترنت.
                </p>
              </div>
            </div>

            {/* Core Sections Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-[#2f366b]">
                أقسام وتخصصات الموقع الرئيسية
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                يحتوي موقع العنكبوت للمعلومات على أربعة أقسام رئيسية متخصصة ومحدثة بانتظام:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="rounded-2xl border border-gray-200 dark:border-[#2f366b] overflow-hidden hover:shadow-md transition-all group bg-white dark:bg-[#1e2348] flex flex-col"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                        <span className="text-white text-xs font-bold bg-[#035dcd]/90 px-2.5 py-0.5 rounded-full">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {cat.description}
                      </p>
                      <a
                        href={`/${cat.slug}/`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectCategory(cat.slug);
                        }}
                        className="text-xs font-semibold text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <span>تصفح قسم {cat.name}</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Policy */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-100 dark:border-[#2f366b] space-y-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                سياسة التحرير والأمانة العلمية
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                تخضع كافة المقالات المنشورة في "العنكبوت للمعلومات" لمراجعة دقيقة لضمان صحة الروابط وسلامة التطبيقات والبرامج المشروحة من أي برمجيات خبيثة أو ملفات ضارة. نحن نحرص على تقديم المحتوى الأصلي الخالي من التضليل، ونرحب بملاحظات قرائنا لتصحيح أو تحديث أي معلومة فوراً.
              </p>
            </div>

            {/* Contact & Connect Links */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                  هل لديك استفسار أو اقتراح للتعاون؟
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  فريق إدارة الموقع جاهز للتواصل معكم والرد على كافة رسائلكم عبر صفحة الاتصال.
                </p>
              </div>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigatePage('contact');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#035dcd] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                انتقل إلى صفحة اتصل بنا
              </a>
            </div>
          </div>
        )}

        {/* ================= PAGE: CONTACT ================= */}
        {pageType === 'contact' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Contact Form Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    أرسل لنا رسالة مباشرة
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    يمكنك استخدام النموذج التالي لإرسال اقتراحك، استفسارك التقني، أو طلب التعاون الإعلاني. نحرص على مراجعة كافة الرسائل والرد خلال 24 - 48 ساعة.
                  </p>
                </div>

                {contactSubmitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3">
                    <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                      تم استلام رسالتك بنجاح!
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                      شكراً لتواصلك مع إدارة موقع العنكبوت للمعلومات. سيصلك الرد على بريدك الإلكتروني ({contactEmail}) في أقرب وقت ممكن.
                    </p>
                    <button
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactName('');
                        setContactEmail('');
                        setContactMessage('');
                      }}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      إرسال رسالة جديدة
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#035dcd]" />
                          <span>الاسم الكامل: <span className="text-rose-500">*</span></span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="مثال: أحمد محمد"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#035dcd]" />
                          <span>البريد الإلكتروني: <span className="text-rose-500">*</span></span>
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#035dcd]" />
                        <span>موضوع الرسالة:</span>
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
                      >
                        <option value="عام">استفسار عام</option>
                        <option value="دعم تقني">طلب مساعدة أو استفسار تقني</option>
                        <option value="شراكة وإعلانات">إعلانات ورعاية وشراكات تجارية</option>
                        <option value="تصحيح محتوى">الإبلاغ عن رابط غير صالح أو تصحيح معلومة</option>
                        <option value="أخرى">موضوع آخر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#035dcd]" />
                        <span>نص الرسالة: <span className="text-rose-500">*</span></span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="اكتب رسالتك أو استفسارك بالتفصيل هنا..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full py-3 rounded-xl bg-[#035dcd] hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {contactSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>جاري إرسال الرسالة...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 -rotate-90" />
                          <span>إرسال الرسالة الآن</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Direct Info & Official Channels Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-100 dark:border-[#2f366b] space-y-4">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#2f366b] pb-2">
                    قنوات الاتصال الرسمية
                  </h3>

                  <div className="space-y-3">
                    <a
                      href="mailto:20netplus@gmail.com"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#252a54] border border-gray-100 dark:border-[#2f366b] hover:border-[#035dcd] transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#035dcd] dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[11px] text-gray-400">البريد الإلكتروني المباشر</div>
                        <div className="text-xs font-bold text-gray-800 dark:text-white group-hover:text-[#035dcd] transition-colors truncate">
                          20netplus@gmail.com
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://t.me/arb_1xbet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#252a54] border border-gray-100 dark:border-[#2f366b] hover:border-sky-500 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                        <Send className="w-4 h-4 -rotate-90" />
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400">قناة تيليجرام الرسمية</div>
                        <div className="text-xs font-bold text-gray-800 dark:text-white group-hover:text-sky-500 transition-colors">
                          @arb_1xbet
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://www.facebook.com/informationspider/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#252a54] border border-gray-100 dark:border-[#2f366b] hover:border-blue-600 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400">صفحة فيسبوك</div>
                        <div className="text-xs font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">
                          informationspider
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://www.youtube.com/channel/UCMNj0yd5HpbesN8wWh8167Q"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#252a54] border border-gray-100 dark:border-[#2f366b] hover:border-rose-600 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400">قناة اليوتيوب الرسمية</div>
                        <div className="text-xs font-bold text-gray-800 dark:text-white group-hover:text-rose-600 transition-colors">
                          العنكبوت للمعلومات
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* FAQ Quick Notes */}
                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>ملاحظة هامة للمرسلين:</span>
                  </div>
                  <p className="leading-relaxed">
                    يرجى التأكد من كتابة بريدك الإلكتروني بشكل صحيح حتى نتمكن من الرد عليك. نعتذر عن عدم الرد على الرسائل التي لا تتعلق بمحتوى الموقع أو الرسائل العشوائية (Spam).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE: PRIVACY ================= */}
        {pageType === 'privacy' && (
          <div className="space-y-6 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 text-xs text-gray-700 dark:text-gray-300">
              تاريخ سريان الوثيقة: 15 أكتوبر 2026 | متوافقة مع معايير برنامج Google AdSense واللائحة العامة لحماية البيانات (GDPR).
            </div>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                1. مقدمة والتزامنا بخصوصية الزائر
              </h2>
              <p>
                في موقع <strong>"العنكبوت للمعلومات" (information-net.com)</strong>، تمثل خصوصية زوارنا أهمية بالغة بالنسبة لنا. توضح وثيقة سياسة الخصوصية هذه الخطوط العريضة لأنواع المعلومات الشخصية التي نتلقاها ونجمعها عند زيارتكم لموقعنا، وكيفية استخدام هذه المعلومات وحمايتها.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                2. ملفات الدخول والسجلات (Log Files)
              </h2>
              <p>
                مثل غالبية خوادم المواقع على شبكة الإنترنت، يستخدم موقع العنكبوت للمعلومات ملفات السجل (Log Files). تشمل المعلومات داخل ملفات السجل: عناوين بروتوكول الإنترنت (IP Addresses)، نوع متصفح الويب، مزود خدمة الإنترنت (ISP)، طابع التاريخ والوقت، وصفحات الإحالة وصفحات الخروج، وعدد النقرات لتحليل الاتجاهات، وإدارة الموقع، ومراقبة حركة المستخدمين حول الموقع، وجمع المعلومات الديموغرافية. عناوين IP وغيرها من هذه المعلومات ليست مرتبطة بأي معلومات تحدد هويتك الشخصية.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                3. ملفات تعريف الارتباط وإشارات الويب (Cookies and Web Beacons)
              </h2>
              <p>
                يستخدم موقعنا ملفات تعريف الارتباط لتخزين المعلومات عن تفضيلات الزوار، وتسجيل المعلومات الخاصة بالمستخدم حول الصفحات التي يصل إليها أو يزورها، وتخصيص محتوى صفحة الويب استناداً إلى نوع متصفح الزوار أو معلومات أخرى يرسلها الزائر عبر متصفحه.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                4. ملف تعريف الارتباط Google DoubleClick DART وإعلانات Google AdSense
              </h2>
              <p>
                تُعد شركة <strong>Google</strong> أحد البائعين والشركاء الإعلانيين المعتمدين على موقعنا:
              </p>
              <ul className="list-disc pr-6 space-y-2 text-xs sm:text-sm">
                <li>
                  تستخدم Google بصفتها مورّداً خارجياً ملفات تعريف الارتباط (مثل ملف تعريف الارتباط <strong>DART</strong>) لعرض الإعلانات على موقعنا.
                </li>
                <li>
                  يُمكّن استخدام Google لملف تعريف الارتباط DART من عرض الإعلانات للمستخدمين استناداً إلى زيارتهم لموقعنا ومواقع أخرى على شبكة الإنترنت.
                </li>
                <li>
                  يجوز للمستخدمين إلغاء استخدام ملف تعريف الارتباط DART بزيارة سياسة الخصوصية الخاصة بشبكة إعلانات Google والمحتوى على الرابط الرسمي التالي: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#035dcd] font-semibold underline">https://policies.google.com/technologies/ads</a>.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                5. شركاء الإعلانات وإعلانات الطرف الثالث
              </h2>
              <p>
                قد يستخدم بعض شركائنا الإعلانيين ملفات تعريف الارتباط وإشارات الويب على موقعنا. خوادم إعلانات الأطراف الثالثة أو شبكات الإعلانات تستخدم تقنيات في الإعلانات والروابط التي تظهر على موقع العنكبوت للمعلومات وتُرسل مباشرة إلى متصفحك. وتحصل تلقائياً على عنوان IP الخاص بك عند حدوث ذلك.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                موقع العنكبوت للمعلومات ليس لديه حق الوصول أو السيطرة على ملفات تعريف الارتباط هذه التي يستخدمها معلنون من أطراف ثالثة.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                6. سياسة خصوصية الأطفال (COPPA)
              </h2>
              <p>
                جزء آخر من أولوياتنا هو إضافة حماية للأطفال أثناء استخدام الإنترنت. نحن نشجع الآباء والأولياء على مراقبة والمشاركة في توجيه نشاط أطفالهم على الإنترنت. لا يجمع موقع العنكبوت للمعلومات عن قصد أي معلومات تعريف شخصية من الأطفال دون سن 13 عاماً. إذا كنت تعتقد أن طفلك قد قدم هذا النوع من المعلومات على موقعنا، فإننا نحثك على الاتصال بنا فوراً وسنبذل قصارى جهدنا لإزالة هذه المعلومات على الفور من سجلاتنا.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                7. حقوق المستخدم وحماية البيانات (GDPR & CCPA)
              </h2>
              <p>
                يحق لأي زائر طلب نسخة من بياناته المسجلة أو طلب حذفها، أو تعديل أي معلومة غير دقيقة، بالإضافة إلى حقه الكامل في التحكم بتعطيل ملفات تعريف الارتباط من خلال خيارات المتصفح الفردية الخاصة به.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                8. التواصل بشأن الخصوصية
              </h2>
              <p>
                إذا كان لديك أي سؤال إضافي أو تتطلب مزيداً من المعلومات حول سياسة الخصوصية الخاصة بموقعنا، فلا تتردد في الاتصال بنا عبر البريد الإلكتروني المعتمد: <a href="mailto:20netplus@gmail.com" className="text-[#035dcd] font-bold underline">20netplus@gmail.com</a> أو زيارة صفحة <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigatePage('contact'); }} className="text-[#035dcd] font-bold underline cursor-pointer">اتصل بنا</a>.
              </p>
            </section>
          </div>
        )}

        {/* ================= PAGE: TERMS ================= */}
        {pageType === 'terms' && (
          <div className="space-y-6 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 text-xs text-gray-700 dark:text-gray-300">
              تاريخ التحديث الأخير: 15 أكتوبر 2026 | اتفاقية الاستخدام وشروط الملكية الفكرية لموقع information-net.com.
            </div>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                1. القبول بالاتفاقية والشروط
              </h2>
              <p>
                يُعد تصفحك أو استخدامك لأي جزء من موقع <strong>"العنكبوت للمعلومات" (information-net.com)</strong> بمثابة إقرار وموافقة صريحة وكاملة منك على الالتزام بجميع بنود وشروط هذه الاتفاقية. إذا كنت لا توافق على أي بند منها، فيرجى التوقف عن استخدام الموقع فوراً.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                2. حقوق الملكية الفكرية والنشر
              </h2>
              <ul className="list-disc pr-6 space-y-2 text-xs sm:text-sm">
                <li>
                  جميع المقالات، والشروحات التقنية، والتصاميم الحصرية، ونصوص الأكواد البرمجية المنشورة على هذا الموقع محمية بموجب قوانين حقوق الملكية الفكرية وحقوق النشر الدولية.
                </li>
                <li>
                  <strong>ضوابط الاقتباس وإعادة النشر:</strong> لا يُسمح بنسخ أو اقتباس أي جزء من محتوى الموقع لأي غرض تجاري أو إلكتروني دون الحصول على إذن خطي مسبق، أو وضع رابط نصي مباشر وواضح (DoFollow / Active Link) يؤدي إلى المقال الأصلي في موقع العنكبوت للمعلومات كمرجع أساسي.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                3. إخلاء المسؤولية التعليمية والتكنولوجية
              </h2>
              <p>
                جميع المعلومات والشروحات والبرامج والألعاب المعروضة على موقع العنكبوت للمعلومات تُقدم لأغراض تعليمية وإرشادية ومعرفية فقط. يبذل فريق العمل قصارى جهده للتأكد من دقة المعلومات وصحتها وقت النشر، ولكننا لا نتحمل أي مسؤولية قانونية أو مدنية عن أي أضرار أو خسائر ناتجة عن التطبيق الخاطئ لأي شرح أو استخدام أي أداة أو برنامج خارجي.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                4. الروابط التابعة ومواقع الطرف الثالث
              </h2>
              <p>
                قد يحتوي الموقع على روابط تؤدي إلى مواقع خارجية تابعة لأطراف ثالثة (مثل متاجر التطبيقات، مواقع التحميل الرسمية، أو منصات التواصل). موقع العنكبوت للمعلومات لا يملك أي سيطرة على محتوى أو ممارسات تلك المواقع الخارجية ولا يتحمل أي مسؤولية عن سياساتها أو خدماتها.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                5. سياسة التعليقات والمشاركات
              </h2>
              <p>
                نرحب بجميع التعليقات والنقاشات الإيجابية التي تهدف لتبادل المعرفة. ويحتفظ موقع العنكبوت للمعلومات بالحق الكامل في تعديل أو حذف أي تعليق يخالف الآداب العامة، أو يحتوي على ألفاظ مسيئة أو تحريضية، أو روابط إعلانية غير مصرح بها دون الحاجة لإبداء الأسباب.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white border-r-4 border-[#035dcd] pr-3">
                6. التعديلات على الشروط
              </h2>
              <p>
                يحتفظ موقع العنكبوت للمعلومات بالحق في تحديث أو تعديل شروط هذه الاتفاقية في أي وقت دون إشعار مسبق. ويسري العمل بالتعديلات فور نشرها على هذه الصفحة.
              </p>
            </section>
          </div>
        )}

        {/* ================= PAGE: SITEMAP ================= */}
        {pageType === 'sitemap' && (
          <div className="space-y-6">
            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 text-center">
                <div className="text-2xl font-black text-[#035dcd] dark:text-blue-400">
                  {totalSitemapUrls}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">إجمالي روابط sitemap.xml</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 text-center">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {posts.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">مقال منشور</div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/40 text-center">
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  {DOWNLOAD_APPS.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">صفحات تطبيقات مستقلة</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 text-center">
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  XML 1.0
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">متوافق مع Google Search Console</div>
              </div>
            </div>

            {/* Live Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setSitemapFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    sitemapFilter === 'all'
                      ? 'bg-[#035dcd] text-white'
                      : 'bg-gray-100 dark:bg-[#1e2348] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  الكل ({posts.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSitemapFilter(c.slug)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      sitemapFilter === c.slug
                        ? 'bg-[#035dcd] text-white'
                        : 'bg-gray-100 dark:bg-[#1e2348] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {c.name} ({c.count})
                  </button>
                ))}
              </div>

              {/* Search in Sitemap */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={sitemapQuery}
                  onChange={(e) => setSitemapQuery(e.target.value)}
                  placeholder="ابحث في عناوين المقالات..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-xs focus:outline-none focus:border-[#035dcd]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Dedicated Downloads Section & App Pages in Sitemap */}
            <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-[#1e2348] border border-blue-100 dark:border-[#2f366b] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-[#035dcd] dark:text-blue-400">
                  قسم التحميلات وصفحات التطبيقات المستقلة (/Downloads/)
                </h3>
                <a
                  href="/Downloads/"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Downloads');
                  }}
                  className="text-xs font-bold text-[#035dcd] dark:text-blue-400 hover:underline"
                >
                  فتح متجر التحميلات ←
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DOWNLOAD_APPS.map((app) => (
                  <a
                    key={app.id}
                    href={`/Downloads/${app.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-100 dark:border-[#2f366b] hover:border-[#035dcd] transition-all"
                  >
                    <img
                      src={app.icon}
                      alt={app.arabicName}
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-gray-900 dark:text-white truncate">
                        {app.arabicName}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        /Downloads/{app.slug}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Posts Grid List */}
            <div className="space-y-3 pt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                عرض {filteredSitemapPosts.length} مقال:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSitemapPosts.map((post) => (
                  <a
                    key={post.id}
                    href={`/${post.categorySlug}/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectPost(post);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1e2348] border border-gray-100 dark:border-[#2f366b] hover:border-[#035dcd] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      loading="lazy"
                      className="w-16 h-16 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                        <span className="font-bold text-[#035dcd] dark:text-blue-400">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#035dcd] dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {post.snippet}
                      </p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#035dcd] group-hover:-translate-x-1 transition-all shrink-0" />
                  </a>
                ))}
              </div>

              {filteredSitemapPosts.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-xs">
                  لا توجد مقالات مطابقة لبحثك في الخريطة.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AdSense Unit Bottom Banner (excluded from contact page per AdSense policy) */}
      {pageType !== 'contact' && (
        <div className="bg-white dark:bg-[#252a54] p-3 rounded-2xl border border-gray-100 dark:border-[#2f366b] text-center shadow-xs">
          <AdSenseUnit slotType="bottom" postId={`standalone-bottom-${pageType}`} />
        </div>
      )}
    </article>
  );
};
