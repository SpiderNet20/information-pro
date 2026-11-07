import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileImage,
  Eraser,
  Pipette,
  RefreshCw,
  Info,
  Sparkles,
} from 'lucide-react';

interface CompressedItem {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  compressedBlob: Blob | null;
  compressedUrl: string;
  compressedSize: number;
  outputWidth: number;
  outputHeight: number;
  status: 'processing' | 'done' | 'error';
  errorMsg?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
};

export const ImageCompressorTool: React.FC = () => {
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(0); // 0 = keep original
  const [outputFormat, setOutputFormat] = useState<'image/webp' | 'image/jpeg'>('image/webp');
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const compressSingleFile = useCallback(
    async (
      file: File,
      qual: number,
      maxW: number,
      format: 'image/webp' | 'image/jpeg'
    ): Promise<Omit<CompressedItem, 'id'>> => {
      const originalUrl = URL.createObjectURL(file);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const origW = img.naturalWidth || img.width;
          const origH = img.naturalHeight || img.height;
          let targetW = origW;
          let targetH = origH;

          if (maxW > 0 && origW > maxW) {
            targetW = maxW;
            targetH = Math.max(1, Math.round((origH * maxW) / origW));
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              file,
              originalName: file.name,
              originalSize: file.size,
              originalUrl,
              originalWidth: origW,
              originalHeight: origH,
              compressedBlob: null,
              compressedUrl: '',
              compressedSize: 0,
              outputWidth: targetW,
              outputHeight: targetH,
              status: 'error',
              errorMsg: 'تعذر تهيئة محرك الرسم في المتصفح.',
            });
            return;
          }

          if (format === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, targetW, targetH);
          }
          ctx.drawImage(img, 0, 0, targetW, targetH);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve({
                  file,
                  originalName: file.name,
                  originalSize: file.size,
                  originalUrl,
                  originalWidth: origW,
                  originalHeight: origH,
                  compressedBlob: null,
                  compressedUrl: '',
                  compressedSize: 0,
                  outputWidth: targetW,
                  outputHeight: targetH,
                  status: 'error',
                  errorMsg: 'فشل توليد ملف الصورة المضغوط.',
                });
                return;
              }
              const compressedUrl = URL.createObjectURL(blob);
              resolve({
                file,
                originalName: file.name,
                originalSize: file.size,
                originalUrl,
                originalWidth: origW,
                originalHeight: origH,
                compressedBlob: blob,
                compressedUrl,
                compressedSize: blob.size,
                outputWidth: targetW,
                outputHeight: targetH,
                status: 'done',
              });
            },
            format,
            Math.min(1, Math.max(0.1, qual / 100))
          );
        };

        img.onerror = () => {
          resolve({
            file,
            originalName: file.name,
            originalSize: file.size,
            originalUrl,
            originalWidth: 0,
            originalHeight: 0,
            compressedBlob: null,
            compressedUrl: '',
            compressedSize: 0,
            outputWidth: 0,
            outputHeight: 0,
            status: 'error',
            errorMsg: 'الملف المرفوع ليس صورة صالحة أو أنه تالف.',
          });
        };

        img.src = originalUrl;
      });
    },
    []
  );

  const handleFilesSelected = async (fileList: FileList | File[]) => {
    setUploadError(null);
    const validFiles: File[] = [];
    Array.from(fileList).forEach((f) => {
      if (!f.type.startsWith('image/')) {
        setUploadError('يرجى اختيار ملفات صور صالحة فقط (PNG, JPG, WebP, BMP).');
      } else if (f.size > 25 * 1024 * 1024) {
        setUploadError(`حجم الصورة ${f.name} يتجاوز الحد الأقصى المسموح (25MB).`);
      } else {
        validFiles.push(f);
      }
    });

    if (validFiles.length === 0) return;

    const results: CompressedItem[] = [];
    for (const file of validFiles) {
      const res = await compressSingleFile(file, quality, maxWidth, outputFormat);
      results.push({
        ...res,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      });
    }

    setItems((prev) => {
      const updated = [...results, ...prev];
      if (!selectedPreviewId && results[0]) {
        setSelectedPreviewId(results[0].id);
      }
      return updated;
    });
  };

  // Re-compress existing items when quality, maxWidth, or outputFormat changes
  const handleRecompressAll = async (
    newQuality: number,
    newMaxW: number,
    newFormat: 'image/webp' | 'image/jpeg'
  ) => {
    if (items.length === 0) return;
    const recompressed: CompressedItem[] = [];
    for (const item of items) {
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      const res = await compressSingleFile(item.file, newQuality, newMaxW, newFormat);
      recompressed.push({
        ...res,
        id: item.id,
      });
    }
    setItems(recompressed);
  };

  const handleGenerateSampleImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#035dcd');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Draw decorative geometric circles & text
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.03 + (i % 5) * 0.02})`;
      ctx.beginPath();
      ctx.arc(150 + i * 55, 200 + ((i * 97) % 450), 40 + (i % 4) * 25, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('العنكبوت للمعلومات - اختبار ضغط الصور WebP', 600, 380);
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('High-Resolution Sample Image (1200 × 800 PNG)', 600, 440);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const sampleFile = new File([blob], 'sample-high-res-banner.png', { type: 'image/png' });
      await handleFilesSelected([sampleFile]);
    }, 'image/png');
  };

  const handleDownloadItem = (item: CompressedItem) => {
    if (!item.compressedUrl) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const baseName = item.originalName.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = item.compressedUrl;
    link.download = `${baseName}-optimized.${ext}`;
    link.click();
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    });
    setItems([]);
    setSelectedPreviewId(null);
    setUploadError(null);
  };

  const activeItem = items.find((i) => i.id === selectedPreviewId) || items[0] || null;

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Quality Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-100 mb-2">
              <label htmlFor="webp-quality-slider">جودة الصورة المضغوطة</label>
              <span className="font-mono text-[#035dcd] dark:text-blue-400">{quality}%</span>
            </div>
            <input
              id="webp-quality-slider"
              type="range"
              min={15}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => {
                const val = Number(e.target.value);
                setQuality(val);
                handleRecompressAll(val, maxWidth, outputFormat);
              }}
              className="w-full accent-[#035dcd] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              <span>أصغر حجم (15%)</span>
              <span>متوازن (80%)</span>
              <span>أقصى دقة (100%)</span>
            </div>
          </div>

          {/* Max Width Resize */}
          <div>
            <label
              htmlFor="webp-maxwidth-select"
              className="block text-xs font-bold text-gray-800 dark:text-gray-100 mb-2"
            >
              تغيير الأبعاد (العرض الأقصى)
            </label>
            <select
              id="webp-maxwidth-select"
              value={maxWidth}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaxWidth(val);
                handleRecompressAll(quality, val, outputFormat);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            >
              <option value={0}>الحفاظ على الأبعاد الأصلية</option>
              <option value={1920}>Full HD (بحد أقصى 1920px)</option>
              <option value={1280}>قياسي للمقالات (بحد أقصى 1280px)</option>
              <option value={1080}>مناسب للهواتف (بحد أقصى 1080px)</option>
              <option value={800}>مصغر سريع (بحد أقصى 800px)</option>
            </select>
          </div>

          {/* Output Format */}
          <div>
            <label
              htmlFor="webp-format-select"
              className="block text-xs font-bold text-gray-800 dark:text-gray-100 mb-2"
            >
              صيغة الإخراج النهائية
            </label>
            <select
              id="webp-format-select"
              value={outputFormat}
              onChange={(e) => {
                const fmt = e.target.value as 'image/webp' | 'image/jpeg';
                setOutputFormat(fmt);
                handleRecompressAll(quality, maxWidth, fmt);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            >
              <option value="image/webp">WebP (موصى به للويب والسيو)</option>
              <option value="image/jpeg">JPEG المضغوط</option>
            </select>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFilesSelected(e.dataTransfer.files);
            }
          }}
          className="border-2 border-dashed border-blue-300 dark:border-[#2f366b] hover:border-[#035dcd] rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#252a54] text-center transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/bmp,image/avif"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesSelected(e.target.files);
                e.target.value = '';
              }
            }}
            className="hidden"
          />
          <FileImage className="w-10 h-10 text-[#035dcd] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            اسحب الصور وأفلتها هنا أو اخترها من جهازك
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            يدعم PNG, JPG, JPEG, WebP, BMP (تتم المعالجة محلياً داخل متصفحك 100%)
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>اختيار صور من الجهاز</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateSampleImage}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1e2348] hover:bg-gray-200 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2f366b] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#035dcd]" />
              <span>تجربة فورية بصورة عالية الدقة</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Results List & Side-by-Side Comparison */}
      {items.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              الصور المعالجة ({items.length})
            </h3>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#252a54] hover:bg-red-50 text-gray-600 dark:text-gray-300 hover:text-red-600 border border-gray-200 dark:border-[#2f366b] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح القائمة</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const savedBytes = item.originalSize - item.compressedSize;
              const savedPct =
                item.originalSize > 0
                  ? Math.round((savedBytes / item.originalSize) * 100)
                  : 0;
              const isSmaller = savedBytes > 0;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPreviewId(item.id)}
                  className={`p-4 rounded-2xl bg-white dark:bg-[#252a54] border transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    activeItem?.id === item.id
                      ? 'border-[#035dcd]'
                      : 'border-gray-200 dark:border-[#2f366b]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.compressedUrl && (
                      <img
                        src={item.compressedUrl}
                        alt={item.originalName}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-[#2f366b] shrink-0"
                      />
                    )}
                    <div className="min-w-0 space-y-1">
                      <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                        {item.originalName}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                        <span>الأصلي: {formatBytes(item.originalSize)}</span>
                        <span>·</span>
                        <span className="text-gray-900 dark:text-white font-bold">
                          بعد الضغط: {formatBytes(item.compressedSize)}
                        </span>
                        <span>·</span>
                        <span>
                          {item.outputWidth}×{item.outputHeight}px
                        </span>
                      </div>
                      <div className="text-xs">
                        {isSmaller ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            تم توفير {formatBytes(savedBytes)} ({savedPct}%)
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            الحجم زاد بنسبة {Math.abs(savedPct)}% (اخفض مؤشر الجودة إلى 70% لتقليل الحجم)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadItem(item);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>تنزيل {outputFormat === 'image/webp' ? 'WebP' : 'JPG'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Side-by-Side Visual Preview */}
          {activeItem && activeItem.status === 'done' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-200">
                  <span>الصورة الأصلية ({formatBytes(activeItem.originalSize)})</span>
                  <span className="font-mono text-gray-500">
                    {activeItem.originalWidth}×{activeItem.originalHeight}
                  </span>
                </div>
                <div className="h-64 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={activeItem.originalUrl}
                    alt="الصورة الأصلية"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-200">
                  <span>
                    بعد التحويل إلى {outputFormat === 'image/webp' ? 'WebP' : 'JPEG'} (
                    {formatBytes(activeItem.compressedSize)})
                  </span>
                  <span className="font-mono text-[#035dcd] dark:text-blue-400">
                    {activeItem.outputWidth}×{activeItem.outputHeight}
                  </span>
                </div>
                <div className="h-64 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={activeItem.compressedUrl}
                    alt="الصورة المضغوطة"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const BackgroundRemoverTool: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImageElement, setSourceImageElement] = useState<HTMLImageElement | null>(null);
  const [tolerance, setTolerance] = useState<number>(32);
  const [feather, setFeather] = useState<number>(1);
  const [removalScope, setRemovalScope] = useState<'contiguous' | 'global'>('contiguous');
  const [sampledColors, setSampledColors] = useState<Array<{ r: number; g: number; b: number }>>([]);
  const [backdropStyle, setBackdropStyle] = useState<'checker' | 'white' | 'black' | 'blue'>('checker');
  const [resultDataUrl, setResultDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadNewImage = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP).');
      return;
    }
    setSourceFile(file);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSourceImageElement(img);
      // Sample top-left and top-right corners automatically as initial background colors
      const tempCanvas = document.createElement('canvas');
      const maxDim = 900;
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      tempCanvas.width = w;
      tempCanvas.height = h;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const topLeft = ctx.getImageData(2, 2, 1, 1).data;
        setSampledColors([{ r: topLeft[0], g: topLeft[1], b: topLeft[2] }]);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setErrorMsg('تعذر قراءة ملف الصورة المرفوع.');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleGenerateSampleLogo = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Solid light background to demonstrate clean removal
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 640, 480);

    // Draw a crisp blue & gold emblem in the center
    ctx.fillStyle = '#035dcd';
    ctx.beginPath();
    ctx.arc(320, 210, 115, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(320, 210, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPIDER', 320, 224);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('العنكبوت للمعلومات', 320, 385);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const sampleFile = new File([blob], 'sample-logo-emblem.png', { type: 'image/png' });
      loadNewImage(sampleFile);
    }, 'image/png');
  };

  // Run background removal whenever image, tolerance, feather, scope, or sampledColors change
  useEffect(() => {
    if (!sourceImageElement || sampledColors.length === 0) return;

    setIsProcessing(true);
    const maxDim = 900;
    let w = sourceImageElement.naturalWidth || sourceImageElement.width;
    let h = sourceImageElement.naturalHeight || sourceImageElement.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    const srcCanvas = sourceCanvasRef.current;
    const outCanvas = resultCanvasRef.current;
    if (!srcCanvas || !outCanvas) {
      setIsProcessing(false);
      return;
    }

    srcCanvas.width = w;
    srcCanvas.height = h;
    outCanvas.width = w;
    outCanvas.height = h;

    const srcCtx = srcCanvas.getContext('2d');
    const outCtx = outCanvas.getContext('2d');
    if (!srcCtx || !outCtx) {
      setIsProcessing(false);
      return;
    }

    srcCtx.drawImage(sourceImageElement, 0, 0, w, h);
    const imgData = srcCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const maxDist = (tolerance / 100) * 255 * 1.732;
    const softMargin = feather * 14;

    const minColorDist = (r: number, g: number, b: number): number => {
      let best = Infinity;
      for (const c of sampledColors) {
        const dr = r - c.r;
        const dg = g - c.g;
        const db = b - c.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < best) best = dist;
      }
      return best;
    };

    if (removalScope === 'contiguous') {
      // BFS flood-fill starting from all 4 border edges matching sampled background colors
      const visited = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      const tryEnqueue = (x: number, y: number) => {
        const idx = y * w + x;
        if (visited[idx]) return;
        const p = idx * 4;
        const dist = minColorDist(data[p], data[p + 1], data[p + 2]);
        if (dist <= maxDist) {
          visited[idx] = 1;
          queue[tail++] = idx;
        }
      };

      for (let x = 0; x < w; x++) {
        tryEnqueue(x, 0);
        tryEnqueue(x, h - 1);
      }
      for (let y = 0; y < h; y++) {
        tryEnqueue(0, y);
        tryEnqueue(w - 1, y);
      }

      while (head < tail) {
        const curr = queue[head++];
        const cx = curr % w;
        const cy = (curr - cx) / w;

        if (cx > 0) tryEnqueue(cx - 1, cy);
        if (cx < w - 1) tryEnqueue(cx + 1, cy);
        if (cy > 0) tryEnqueue(cx, cy - 1);
        if (cy < h - 1) tryEnqueue(cx, cy + 1);
      }

      for (let i = 0; i < w * h; i++) {
        const p = i * 4;
        if (visited[i]) {
          data[p + 3] = 0;
        } else if (softMargin > 0) {
          const dist = minColorDist(data[p], data[p + 1], data[p + 2]);
          if (dist < maxDist + softMargin) {
            const ratio = Math.max(0, Math.min(1, (dist - maxDist) / softMargin));
            data[p + 3] = Math.round(data[p + 3] * ratio);
          }
        }
      }
    } else {
      // Global color removal across the entire image
      for (let i = 0; i < w * h; i++) {
        const p = i * 4;
        const dist = minColorDist(data[p], data[p + 1], data[p + 2]);
        if (dist <= maxDist) {
          data[p + 3] = 0;
        } else if (softMargin > 0 && dist < maxDist + softMargin) {
          const ratio = Math.max(0, Math.min(1, (dist - maxDist) / softMargin));
          data[p + 3] = Math.round(data[p + 3] * ratio);
        }
      }
    }

    outCtx.putImageData(imgData, 0, 0);
    setResultDataUrl(outCanvas.toDataURL('image/png'));
    setIsProcessing(false);
  }, [sourceImageElement, tolerance, feather, removalScope, sampledColors]);

  const handleCanvasEyedropperClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sourceCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor((e.clientX - rect.left) * scaleX)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor((e.clientY - rect.top) * scaleY)));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setSampledColors((prev) => [...prev.slice(-3), { r: pixel[0], g: pixel[1], b: pixel[2] }]);
  };

  const handleDownloadTransparentPng = () => {
    if (!resultDataUrl) return;
    const baseName = sourceFile ? sourceFile.name.replace(/\.[^/.]+$/, '') : 'image';
    const link = document.createElement('a');
    link.href = resultDataUrl;
    link.download = `${baseName}-no-bg.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload & Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              إعدادات عزل وإزالة الخلفية
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              ارفع صورة شعار أو منتج أو مستند، أو انقر بالقطارة على لون الخلفية المراد إزالته.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  loadNewImage(e.target.files[0]);
                  e.target.value = '';
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>رفع صورة من جهازك</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateSampleLogo}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] hover:bg-gray-100 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2f366b] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#035dcd]" />
              <span>تجربة فورية بشعار نموذجي</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sliders & Mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-100 mb-2">
              <label htmlFor="bg-tolerance-slider">حساسية عزل الخلفية (Tolerance)</label>
              <span className="font-mono text-[#035dcd] dark:text-blue-400">{tolerance}%</span>
            </div>
            <input
              id="bg-tolerance-slider"
              type="range"
              min={5}
              max={85}
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-full accent-[#035dcd] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-100 mb-2">
              <label htmlFor="bg-feather-slider">تنعيم الحواف (Edge Softness)</label>
              <span className="font-mono text-[#035dcd] dark:text-blue-400">{feather}px</span>
            </div>
            <input
              id="bg-feather-slider"
              type="range"
              min={0}
              max={3}
              step={1}
              value={feather}
              onChange={(e) => setFeather(Number(e.target.value))}
              className="w-full accent-[#035dcd] cursor-pointer"
            />
          </div>

          <div>
            <label
              htmlFor="bg-scope-select"
              className="block text-xs font-bold text-gray-800 dark:text-gray-100 mb-2"
            >
              نطاق إزالة اللون
            </label>
            <select
              id="bg-scope-select"
              value={removalScope}
              onChange={(e) => setRemovalScope(e.target.value as 'contiguous' | 'global')}
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            >
              <option value="contiguous">عزل الحواف المتصلة فقط (يحافظ على ألوان داخل العنصر)</option>
              <option value="global">عزل اللون المحدد في كامل الصورة (للشعارات المفرغة)</option>
            </select>
          </div>
        </div>

        {/* Sampled Colors Bar */}
        {sampledColors.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-200 dark:border-[#2f366b]">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                <Pipette className="w-3.5 h-3.5 text-[#035dcd]" />
                <span>ألوان الخلفية المعزولة (انقر على الصورة الأصلية لإضافة لون):</span>
              </span>
              {sampledColors.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-[11px] font-mono"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})` }}
                  />
                  <span>
                    rgb({c.r},{c.g},{c.b})
                  </span>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSampledColors((prev) => prev.slice(0, 1))}
              className="text-xs text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الألوان الملتقطة</span>
            </button>
          </div>
        )}
      </div>

      {/* Before / After Workspace */}
      {sourceImageElement ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image (Clickable Eyedropper) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-800 dark:text-gray-100">
                1. الصورة الأصلية (انقر على الخلفية لالتقاط لونها بالقطارة)
              </span>
              <span className="text-[11px] text-[#035dcd] dark:text-blue-400 flex items-center gap-1">
                <Pipette className="w-3.5 h-3.5" />
                <span>القطارة مفعلة</span>
              </span>
            </div>
            <div className="min-h-[280px] max-h-[420px] rounded-xl bg-gray-100 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] flex items-center justify-center p-2 overflow-hidden">
              <canvas
                ref={sourceCanvasRef}
                onClick={handleCanvasEyedropperClick}
                title="انقر على أي جزء من الخلفية لعزل لونه"
                className="max-h-[380px] max-w-full object-contain cursor-crosshair rounded"
              />
            </div>
          </div>

          {/* Processed Transparent PNG */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-gray-800 dark:text-gray-100">
                2. النتيجة بعد إزالة الخلفية (PNG شفاف)
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-500">خلفية المعاينة:</span>
                {[
                  { id: 'checker', label: 'شفاف' },
                  { id: 'white', label: 'أبيض' },
                  { id: 'black', label: 'أسود' },
                  { id: 'blue', label: 'أزرق' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBackdropStyle(b.id as 'checker' | 'white' | 'black' | 'blue')}
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer border ${
                      backdropStyle === b.id
                        ? 'bg-[#035dcd] text-white border-[#035dcd]'
                        : 'bg-gray-50 dark:bg-[#1e2348] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#2f366b]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`min-h-[280px] max-h-[420px] rounded-xl border border-gray-200 dark:border-[#2f366b] flex items-center justify-center p-2 overflow-hidden ${
                backdropStyle === 'white'
                  ? 'bg-white'
                  : backdropStyle === 'black'
                  ? 'bg-slate-950'
                  : backdropStyle === 'blue'
                  ? 'bg-blue-600'
                  : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <canvas
                ref={resultCanvasRef}
                className="max-h-[380px] max-w-full object-contain rounded"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isProcessing ? 'جاري معالجة البكسلات...' : 'جاهز للتنزيل بصيغة PNG شفافة'}
              </span>
              <button
                type="button"
                disabled={!resultDataUrl || isProcessing}
                onClick={handleDownloadTransparentPng}
                className="px-5 py-2.5 rounded-xl bg-[#035dcd] hover:bg-[#02479e] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل الصورة الشفافة (PNG)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-center space-y-3">
          <Eraser className="w-10 h-10 text-[#035dcd] mx-auto" />
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            لم يتم اختيار صورة بعد
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            اضغط على «رفع صورة من جهازك» أو جرّب الأداة فوراً بالضغط على «تجربة فورية بشعار نموذجي» لمشاهدة كيف يعمل العزل اللوني والقطارة التفاعلية.
          </p>
        </div>
      )}

      <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
        <Info className="w-4 h-4 text-[#035dcd] shrink-0 mt-0.5" />
        <span>
          <strong>توضيح تقني صادق:</strong> تعمل هذه الأداة محلياً داخل المتصفح عبر خوارزمية عزل الحواف المتصلة والفرق اللوني (Flood-Fill & Chroma Matting). تعطي نتائج ممتازة مع الشعارات، الأيقونات، صور المنتجات، والخلفيات الموحدة أو المتباينة، بينما قد تتأثر الدقة في الصور الفوتوغرافية ذات الخلفيات الطبيعية المزدحمة وتفاصيل الشعر الدقيقة.
        </span>
      </div>
    </div>
  );
};
