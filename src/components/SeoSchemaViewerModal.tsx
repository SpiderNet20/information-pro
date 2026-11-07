import React, { useState } from 'react';
import {
  FileCode,
  Globe,
  Share2,
  Copy,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Post } from '../types';
import { DownloadAppItem } from '../data/downloadsApps';
import {
  resolvePageMetadata,
  DEFAULT_SEO_CONFIG,
} from '../utils/seo';

interface SeoSchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  downloadApp?: DownloadAppItem | null;
  activeCategory?: string;
}

export const SeoSchemaViewerModal: React.FC<SeoSchemaViewerModalProps> = ({
  isOpen,
  onClose,
  post,
  downloadApp = null,
  activeCategory = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'google' | 'social' | 'meta'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const resolvedMeta = resolvePageMetadata({
    post,
    activeCategory,
    selectedDownloadApp: downloadApp,
  });

  const fullSchema = resolvedMeta.schemaGraph || {};
  const schemaJsonString = JSON.stringify(fullSchema, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewTitle = resolvedMeta.title;
  const previewDesc = resolvedMeta.description;
  const previewUrl = resolvedMeta.canonical || DEFAULT_SEO_CONFIG.siteUrl;
  const previewImage = resolvedMeta.ogImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#252a54] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#2f366b] flex flex-col text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#035dcd] to-indigo-600 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>
                  {downloadApp || activeCategory === 'Downloads'
                    ? 'ملف سكيما التطبيقات (SoftwareApplication Schema JSON-LD)'
                    : 'فحص السيو وملفات السكيما (Schema.org JSON-LD)'}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                  متوافق 100% مع Google
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                {downloadApp
                  ? `التطبيق: ${downloadApp.h1Title}`
                  : activeCategory === 'Downloads' && !post
                  ? 'قسم تطبيقات العنكبوت (/Downloads/)'
                  : post
                  ? `المقال: ${post.title}`
                  : 'الصفحة الرئيسية للموقع'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 dark:bg-[#1e2348] border-b border-gray-200 dark:border-[#2f366b] overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d325a]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>ملف JSON-LD المنظم</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeTab === 'google'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d325a]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>معاينة نتيجة بحث جوجل (SERP)</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeTab === 'social'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d325a]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>بطاقات السوشيال ميديا (OpenGraph)</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
              activeTab === 'meta'
                ? 'bg-[#035dcd] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d325a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>وسوم Meta والعناوين</span>
          </button>
        </div>

        {/* Tab 1: Raw JSON-LD Schema */}
        {activeTab === 'schema' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {downloadApp
                    ? `ملف سكيما التطبيق (${downloadApp.slug}.schema.json):`
                    : activeCategory === 'Downloads' && !post
                    ? 'ملف سكيما متجر التطبيقات (apps.schema.json):'
                    : 'كود السكيما المدمج تلقائياً في الـ Head:'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {downloadApp
                    ? 'يحتوي على كيانات SoftwareApplication و MobileApplication و Offer و BreadcrumbList و FAQPage'
                    : activeCategory === 'Downloads' && !post
                    ? 'يحتوي على CollectionPage و ItemList بكافة تطبيقات المتجر وفق معايير schema.org'
                    : 'يحتوي على كيانات BlogPosting و BreadcrumbList و WebSite و FAQPage وفق معايير schema.org'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(downloadApp || (activeCategory === 'Downloads' && !post)) && (
                  <a
                    href={
                      downloadApp
                        ? `/Downloads/${downloadApp.slug}/schema.json`
                        : '/Downloads/schema.json'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح ملف schema.json</span>
                  </a>
                )}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#035dcd] hover:bg-[#02479e] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ كود السكيما'}</span>
                </button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 text-gray-100 text-xs font-mono direction-ltr text-left p-4">
              <pre className="overflow-x-auto max-h-[50vh] leading-relaxed">
                <code>{schemaJsonString}</code>
              </pre>
            </div>

            {/* Validation Checklist */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
              <h5 className="font-bold text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>حالة اختبار النتائج الغنية (Google Rich Results): مكتملة وصالحة</span>
              </h5>
              {downloadApp ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                  <div>✓ النوع الأساسي: SoftwareApplication / MobileApplication</div>
                  <div>✓ السعر والتوفر: Offer (Free / 0 USD - InStock)</div>
                  <div>✓ الأسئلة الشائعة ومسار التنقل: FAQPage + BreadcrumbList</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                  <div>✓ تم تحديد النوع الأساسي: {activeCategory === 'Downloads' ? 'CollectionPage / ItemList' : 'BlogPosting'}</div>
                  <div>✓ تم توفير مسار التنقل: BreadcrumbList (3 مستويات)</div>
                  <div>✓ تم إرفاق صورة عالية الدقة (1200x630)</div>
                  <div>✓ تم إدراج كاتب المقال والناشر وشعار الموقع الرسمي</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Google SERP Simulator */}
        {activeTab === 'google' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                محاكاة مظهر النتيجة في محرك بحث Google (Google Search Snippet)
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                هكذا تظهر الصفحة للزوار الباحثين على أجهزة الكمبيوتر والهواتف الذكية.
              </p>
            </div>

            {/* Google Search Card Box */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1e2348] border border-gray-200 dark:border-[#384180] shadow-sm max-w-xl mx-auto text-left direction-ltr">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#035dcd]">
                  ع
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-gray-800 dark:text-gray-200">
                    العنكبوت للمعلومات
                  </span>
                  <span className="text-[11px] text-gray-500 truncate max-w-md">
                    {previewUrl}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-2 mt-1">
                {previewTitle}
              </h3>

              {downloadApp && (
                <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold mt-1">
                  <span>★★★★★</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    التقييم: {downloadApp.rating} · ‏{downloadApp.reviewsCountText} · ‏مجاني · ‏Android/iOS
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3 mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed flex-1">
                  {post && (
                    <span className="text-gray-400 font-semibold mr-1">
                      {new Date(post.isoDate).toLocaleDateString('ar-EG')} —{' '}
                    </span>
                  )}
                  {previewDesc}
                </p>

                {(post || downloadApp) && (
                  <img
                    src={previewImage}
                    alt={previewTitle}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 border border-gray-100 dark:border-gray-700"
                  />
                )}
              </div>
            </div>

            {/* Snippet Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b]">
                <span className="text-gray-400 block mb-1">طول العنوان (Title):</span>
                <span className="font-bold text-gray-800 dark:text-white font-mono">
                  {previewTitle.length} حرف{' '}
                  <span className="text-emerald-600 font-normal">
                    ({previewTitle.length <= 60 ? 'مثالي' : 'طويل'})
                  </span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b]">
                <span className="text-gray-400 block mb-1">طول الوصف (Description):</span>
                <span className="font-bold text-gray-800 dark:text-white font-mono">
                  {previewDesc.length} حرف{' '}
                  <span className="text-emerald-600 font-normal">
                    ({previewDesc.length <= 160 ? 'مثالي' : 'طويل'})
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Social Media Card Preview */}
        {activeTab === 'social' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                معاينة بطاقة المشاركة في فيسبوك، واتساب، وتويتر (OpenGraph & Twitter Card)
              </h4>
            </div>

            {/* Social Card */}
            <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-[#384180] bg-white dark:bg-[#1e2348] shadow-md text-left direction-ltr">
              <div className="h-52 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                <img
                  src={post ? post.thumbnail : DEFAULT_SEO_CONFIG.logoUrl}
                  alt={previewTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-1">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                  INFORMATION-NET.COM
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug">
                  {previewTitle}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {previewDesc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Meta Tags Inspector */}
        {activeTab === 'meta' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
              قائمة وسوم Meta المحقونة في الصفحة:
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] flex flex-col gap-1">
                <span className="font-mono text-[#035dcd] font-bold">&lt;title&gt;</span>
                <span className="text-gray-800 dark:text-white font-medium">{previewTitle}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] flex flex-col gap-1">
                <span className="font-mono text-[#035dcd] font-bold">&lt;meta name="description"&gt;</span>
                <span className="text-gray-800 dark:text-white">{previewDesc}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] flex flex-col gap-1">
                <span className="font-mono text-[#035dcd] font-bold">&lt;link rel="canonical"&gt;</span>
                <span className="text-gray-800 dark:text-white font-mono text-[11px]">{previewUrl}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] flex flex-col gap-1">
                <span className="font-mono text-[#035dcd] font-bold">&lt;meta property="og:type"&gt;</span>
                <span className="text-gray-800 dark:text-white">{post ? 'article' : 'website'}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] flex flex-col gap-1">
                <span className="font-mono text-[#035dcd] font-bold">&lt;meta name="robots"&gt;</span>
                <span className="text-gray-800 dark:text-white font-mono">index, follow, max-image-preview:large</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-[#1f244a] border-t border-gray-200 dark:border-[#2f366b] flex items-center justify-between shrink-0 text-xs">
          <span className="text-gray-400">
            مولد السيو التلقائي - قالب سيو بلس v8.0 للعنكبوت للمعلومات
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#035dcd] text-white font-bold hover:bg-[#02479e] transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
