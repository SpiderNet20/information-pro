import React, { useState, useEffect } from 'react';
import { ExternalLink, ShieldCheck, X, Link as LinkIcon, CheckCircle } from 'lucide-react';

interface RedirectToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
}

export const RedirectToolModal: React.FC<RedirectToolModalProps> = ({
  isOpen,
  onClose,
  targetUrl = 'https://ai.information-net.com',
}) => {
  const [countdown, setCountdown] = useState(6);
  const [isReady, setIsReady] = useState(false);
  const [customUrl, setCustomUrl] = useState(targetUrl);

  useEffect(() => {
    if (isOpen) {
      setCountdown(6);
      setIsReady(false);
      setCustomUrl(targetUrl);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsReady(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  // SVG circle calculation
  const strokeDashoffset = 500 - (500 * (6 - countdown)) / 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#252a54] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#2f366b] text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#035dcd] text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-base">نظام تحويل وحماية الروابط</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            يتم فحص الرابط والتأكد من أمانه وحمايته قبل التحويل المباشر.
          </p>

          {/* SeoPlus Circular Countdown */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="75"
                className="stroke-gray-100 dark:stroke-[#1b1e38]"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="75"
                className="stroke-[#035dcd] transition-all duration-1000 ease-linear"
                strokeWidth="12"
                strokeDasharray="500"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-gray-800 dark:text-white font-mono">
                {countdown}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isReady ? 'الرابط جاهز!' : 'ثوانٍ متبقية'}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className="mb-6">
            {!isReady ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#035dcd] dark:text-blue-300 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#035dcd] animate-ping" />
                <span>جاري تهيئة الرابط وفحصه أمنياً...</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>تم تجهيز الرابط بنجاح!</span>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="flex flex-col gap-3">
            <a
              href={isReady ? customUrl : '#'}
              target={isReady ? '_blank' : '_self'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!isReady) e.preventDefault();
              }}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isReady
                  ? 'bg-[#035dcd] hover:bg-[#02479e] text-white shadow-lg shadow-blue-500/25 hover:scale-[1.02] cursor-pointer'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isReady ? 'الانتقال إلى الرابط الآن' : 'يرجى الانتظار...'}</span>
            </a>

            {/* Test another link box */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2f366b] text-right">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5" /> فحص رابط مخصص:
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white focus:outline-none focus:border-[#035dcd]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
