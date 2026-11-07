import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Download, Maximize2, ExternalLink } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageTitle?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageTitle = 'صورة المقال',
}) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => setScale((s) => Math.min(3, s + 0.25));
  const handleZoomOut = () => setScale((s) => Math.max(0.75, s - 0.25));
  const handleResetZoom = () => setScale(1);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.target = '_blank';
    a.download = imageTitle || 'image';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none text-right"
    >
      {/* Top Controls Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl flex items-center justify-between text-white py-2 px-4 bg-black/40 rounded-2xl backdrop-blur-sm z-20 border border-white/10"
      >
        <div className="flex items-center gap-2 max-w-md truncate">
          <span className="text-xs sm:text-sm font-bold truncate">{imageTitle}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors"
            title="استعادة الحجم"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="تحميل الصورة الأصلية"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors mr-2"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 w-full flex items-center justify-center overflow-hidden my-4"
      >
        <img
          src={imageUrl}
          alt={imageTitle}
          style={{ transform: `scale(${scale})` }}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-transform duration-200 cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Footer Info */}
      <div className="text-xs text-gray-400 pb-2 z-10 flex items-center gap-2">
        <span>العنكبوت للمعلومات</span>
        <span>•</span>
        <span>انقر في أي مكان فارغ للخروج أو استخدم عجلة الفأرة للتكبير</span>
      </div>
    </div>
  );
};
