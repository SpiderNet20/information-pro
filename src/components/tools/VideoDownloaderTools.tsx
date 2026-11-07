import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  Download,
  AlertCircle,
  CheckCircle2,
  Info,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  Copy,
  RefreshCw,
} from 'lucide-react';

export type VideoPlatform = 'facebook' | 'instagram' | 'youtube';

interface VideoInspectResponse {
  ok: boolean;
  platform: VideoPlatform;
  normalizedUrl: string;
  contentId: string | null;
  contentTypeLabel: string;
  publicStatus: 'available_metadata' | 'direct_media_available' | 'restricted_or_login_required' | 'not_found';
  statusSummary: string;
  title?: string;
  authorName?: string;
  authorUrl?: string;
  description?: string;
  thumbnailUrl?: string;
  altThumbnails?: Array<{ label: string; url: string; resolution: string }>;
  directVideoUrl?: string | null;
  embedUrl?: string | null;
  officialDownloadSteps: string[];
  technicalReason?: string;
}

interface VideoInspectorToolProps {
  platform: VideoPlatform;
}

const PLATFORM_CONFIG: Record<
  VideoPlatform,
  {
    nameAr: string;
    placeholder: string;
    sampleUrl: string;
    domainHint: string;
    complianceNote: string;
  }
> = {
  facebook: {
    nameAr: 'فيسبوك (Facebook Video & Reels)',
    placeholder: 'https://www.facebook.com/watch/?v=... أو https://www.facebook.com/reel/...',
    sampleUrl: 'https://www.facebook.com/facebook/videos/10153231379946729/',
    domainHint: 'facebook.com / fb.watch',
    complianceNote:
      'تلتزم الأداة بشروط خدمة Facebook وخصوصية المستخدمين؛ يتم فحص البيانات الوصفية العامة فقط دون تسجيل دخول أو تجاوز إعدادات الخصوصية. يظهر خيار التنزيل المباشر فقط إذا أتاح المنشور العام ملف فيديو مفتوحاً.',
  },
  instagram: {
    nameAr: 'إنستغرام (Instagram Reels & Posts)',
    placeholder: 'https://www.instagram.com/reel/... أو https://www.instagram.com/p/...',
    sampleUrl: 'https://www.instagram.com/reel/C8abc123xyz/',
    domainHint: 'instagram.com / instagr.am',
    complianceNote:
      'تلتزم الأداة بشروط خدمة Instagram وخصوصية الحسابات؛ لا تطلب تسجيل دخول ولا تتحايل على الحسابات الخاصة. يظهر خيار التنزيل المباشر فقط عند إتاحة ملف وسائط عام صريح.',
  },
  youtube: {
    nameAr: 'يوتيوب (YouTube Videos & Shorts)',
    placeholder: 'https://www.youtube.com/watch?v=... أو https://youtu.be/...',
    sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    domainHint: 'youtube.com / youtu.be',
    complianceNote:
      'تلتزم الأداة التزاماً كاملاً بشروط خدمة YouTube وحقوق الملكية الفكرية؛ يتم استخراج البيانات الرسمية والصور المصغرة عبر بروتوكول YouTube oEmbed الرسمي فقط، دون فك تشفير البث أو تجاوز قيود المنصة.',
  },
};

export const VideoInspectorTool: React.FC<VideoInspectorToolProps> = ({ platform }) => {
  const cfg = PLATFORM_CONFIG[platform];
  const [urlInput, setUrlInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<VideoInspectResponse | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const validateClientSideUrl = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) {
      return `يرجى لصق رابط فيديو من ${cfg.nameAr} أولاً.`;
    }
    let parsed: URL;
    try {
      parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    } catch {
      return 'صيغة الرابط المدخل غير صحيحة. تأكد من نسخ الرابط الكامل من المتصفح أو التطبيق.';
    }

    const host = parsed.hostname.toLowerCase();
    if (platform === 'facebook') {
      if (!host.includes('facebook.com') && !host.includes('fb.watch') && !host.includes('fb.com')) {
        return 'هذا الرابط لا ينتمي إلى فيسبوك. يرجى إدخال رابط يبدأ بـ facebook.com أو fb.watch.';
      }
    } else if (platform === 'instagram') {
      if (!host.includes('instagram.com') && !host.includes('instagr.am')) {
        return 'هذا الرابط لا ينتمي إلى إنستغرام. يرجى إدخال رابط يبدأ بـ instagram.com.';
      }
    } else if (platform === 'youtube') {
      if (!host.includes('youtube.com') && !host.includes('youtu.be')) {
        return 'هذا الرابط لا ينتمي إلى يوتيوب. يرجى إدخال رابط يبدأ بـ youtube.com أو youtu.be.';
      }
    }

    return null;
  };

  const handleInspect = async (e?: React.FormEvent, customUrl?: string) => {
    if (e) e.preventDefault();
    const targetUrl = (customUrl !== undefined ? customUrl : urlInput).trim();
    setErrorMsg(null);
    setResult(null);

    const validationErr = validateClientSideUrl(targetUrl);
    if (validationErr) {
      setErrorMsg(validationErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tools/video-inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          url: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'تعذر فحص الرابط في الوقت الحالي. تأكد من صحة الرابط وحاول مجدداً.');
      } else {
        setResult(data as VideoInspectResponse);
      }
    } catch {
      setErrorMsg('حدث خطأ في الاتصال أثناء فحص الرابط. يرجى التحقق من اتصالك والمحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNormalized = async () => {
    if (!result?.normalizedUrl) return;
    await navigator.clipboard.writeText(result.normalizedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Box */}
      <form
        onSubmit={(e) => handleInspect(e)}
        className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor={`video-url-${platform}`}
            className="text-xs font-bold text-gray-800 dark:text-gray-100"
          >
            أدخل رابط الفيديو من {cfg.nameAr}
          </label>
          <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
            النطاق المدعوم: {cfg.domainHint}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id={`video-url-${platform}`}
            type="text"
            dir="ltr"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={cfg.placeholder}
            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs sm:text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#035dcd] hover:bg-[#02479e] disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري فحص الرابط...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>فحص الرابط وعرض الخيارات</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setUrlInput(cfg.sampleUrl);
              handleInspect(undefined, cfg.sampleUrl);
            }}
            className="text-xs text-[#035dcd] dark:text-blue-400 hover:underline cursor-pointer"
          >
            تجربة رابط قياسي من {cfg.nameAr}
          </button>

          {urlInput && (
            <button
              type="button"
              onClick={() => {
                setUrlInput('');
                setResult(null);
                setErrorMsg(null);
              }}
              className="text-xs text-gray-500 hover:text-red-500 cursor-pointer"
            >
              مسح الحقل
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Inspection Result */}
      {result && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-6">
          {/* Status Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#2f366b]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{result.contentTypeLabel}</span>
                {result.contentId && (
                  <>
                    <span>·</span>
                    <span className="font-mono">ID: {result.contentId}</span>
                  </>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                {result.title || 'تم التحقق من صيغة الرابط بنجاح'}
              </h3>
              {result.authorName && (
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  الناشر / القناة:{' '}
                  {result.authorUrl ? (
                    <a
                      href={result.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#035dcd] dark:text-blue-400 hover:underline"
                    >
                      {result.authorName}
                    </a>
                  ) : (
                    <span className="font-bold">{result.authorName}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyNormalized}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#1e2348] hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUrl ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'تم نسخ الرابط النظيف' : 'نسخ الرابط القياسي'}</span>
              </button>
              <a
                href={result.normalizedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#1e2348] hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح في المصدر</span>
              </a>
            </div>
          </div>

          {/* Diagnostic Status Box */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
              result.publicStatus === 'direct_media_available' || result.publicStatus === 'available_metadata'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200'
            }`}
          >
            {result.publicStatus === 'direct_media_available' || result.publicStatus === 'available_metadata' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold">{result.statusSummary}</div>
              {result.technicalReason && <div className="opacity-90">{result.technicalReason}</div>}
            </div>
          </div>

          {/* Media Preview & Direct Download (when genuinely available) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Thumbnail or Embed Column */}
            {(result.thumbnailUrl || result.embedUrl || result.directVideoUrl) && (
              <div className="lg:col-span-6 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#035dcd]" />
                  <span>معاينة الوسائط العامة المتاحة</span>
                </h4>

                {result.directVideoUrl ? (
                  <div className="space-y-3">
                    <video
                      src={result.directVideoUrl}
                      controls
                      preload="metadata"
                      poster={result.thumbnailUrl}
                      className="w-full rounded-xl bg-black max-h-[340px]"
                    />
                    <a
                      href={result.directVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-full py-3 px-4 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>تنزيل ملف الفيديو العام المباشر (MP4)</span>
                    </a>
                  </div>
                ) : result.thumbnailUrl ? (
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#2f366b] bg-gray-100 dark:bg-[#1e2348]">
                      <img
                        src={result.thumbnailUrl}
                        alt={result.title || 'صورة مصغرة للفيديو'}
                        className="w-full h-auto max-h-[300px] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Thumbnail download options (especially useful for YouTube oEmbed) */}
                    {result.altThumbnails && result.altThumbnails.length > 0 && (
                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-gray-700 dark:text-gray-200">
                          تنزيل الصور المصغرة الرسمية للفيديو (Thumbnails):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.altThumbnails.map((thumb, idx) => (
                            <a
                              key={idx}
                              href={thumb.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#1e2348] hover:bg-[#035dcd] hover:text-white text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-[#2f366b] text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>
                                {thumb.label} ({thumb.resolution})
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Official Legal Saving / Downloading Guide Column */}
            <div
              className={`${
                result.thumbnailUrl || result.directVideoUrl ? 'lg:col-span-6' : 'lg:col-span-12'
              } p-5 rounded-xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-3`}
            >
              <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#035dcd]" />
                <span>خيارات الحفظ والتنزيل الرسمية المعتمدة لهذا الرابط</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                {result.officialDownloadSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-[#035dcd] dark:text-blue-400">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Transparency & Legal Notice */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
        <Info className="w-4 h-4 text-[#035dcd] shrink-0 mt-0.5" />
        <span>{cfg.complianceNote}</span>
      </div>
    </div>
  );
};
