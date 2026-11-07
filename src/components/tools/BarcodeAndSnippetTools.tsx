import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import {
  QrCode,
  Barcode,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Copy,
  Smartphone,
  Monitor,
  Search,
  Globe,
  Info,
  Sparkles,
} from 'lucide-react';
import { INITIAL_POSTS } from '../../data/posts';

type CodeMode = 'qr' | 'CODE128' | 'EAN13' | 'UPC' | 'CODE39';

export const BarcodeGeneratorTool: React.FC = () => {
  const [mode, setMode] = useState<CodeMode>('qr');
  const [inputValue, setInputValue] = useState<string>('https://www.information-net.com/');
  const [sizePx, setSizePx] = useState<number>(280);
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [qrErrorLevel, setQrErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [showTextBelowBarcode, setShowTextBelowBarcode] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copiedValue, setCopiedValue] = useState<boolean>(false);

  const barcodeSvgRef = useRef<SVGSVGElement | null>(null);
  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const validateBarcodeInput = (val: string, currentMode: CodeMode): string | null => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'يرجى إدخال النص أو الرابط أو الرقم المراد تحويله إلى رمز.';
    }
    if (currentMode === 'qr') {
      if (trimmed.length > 1800) {
        return 'النص طويل جداً لرمز QR قياسي. يرجى تقليصه لأقل من 1800 حرف.';
      }
      return null;
    }

    // Standard 1D Barcodes require ASCII characters or specific numeric lengths
    if (/[^\x00-\x7F]/.test(trimmed)) {
      return 'الباركود التجاري أحادي البعد (Code 128 / EAN / UPC) يدعم الأرقام والحروف الإنجليزية (ASCII) فقط. لاستخدام اللغة العربية اختر وضع QR Code.';
    }

    if (currentMode === 'EAN13') {
      if (!/^\d{12,13}$/.test(trimmed)) {
        return 'معيار EAN-13 يتطلب إدخال 12 أو 13 رقماً إنجليزياً فقط (مثال: 628100000012).';
      }
    } else if (currentMode === 'UPC') {
      if (!/^\d{11,12}$/.test(trimmed)) {
        return 'معيار UPC-A يتطلب إدخال 11 أو 12 رقماً إنجليزياً فقط (مثال: 12345678901).';
      }
    } else if (currentMode === 'CODE39') {
      if (!/^[0-9A-Z\-. $/+%]+$/.test(trimmed)) {
        return 'معيار Code 39 يدعم الحروف الإنجليزية الكبيرة (A-Z) والأرقام (0-9) والرموز (- . $ / + %) فقط.';
      }
    }

    return null;
  };

  useEffect(() => {
    const err = validateBarcodeInput(inputValue, mode);
    setValidationError(err);
    if (err) return;

    const trimmed = inputValue.trim();

    if (mode === 'qr') {
      QRCode.toDataURL(
        trimmed,
        {
          width: sizePx,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: qrErrorLevel,
        },
        (error, url) => {
          if (!error && url) {
            setQrDataUrl(url);
          }
        }
      );

      QRCode.toString(
        trimmed,
        {
          type: 'svg',
          width: sizePx,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: qrErrorLevel,
        },
        (error, svgStr) => {
          if (!error && svgStr) {
            setQrSvgString(svgStr);
          }
        }
      );
    } else {
      try {
        const barHeight = Math.max(60, Math.round(sizePx * 0.42));
        if (barcodeSvgRef.current) {
          JsBarcode(barcodeSvgRef.current, trimmed, {
            format: mode,
            lineColor: fgColor,
            background: bgColor,
            width: sizePx >= 320 ? 2.4 : 2,
            height: barHeight,
            displayValue: showTextBelowBarcode,
            fontSize: 15,
            margin: 14,
          });
        }
        if (barcodeCanvasRef.current) {
          JsBarcode(barcodeCanvasRef.current, trimmed, {
            format: mode,
            lineColor: fgColor,
            background: bgColor,
            width: sizePx >= 320 ? 2.4 : 2,
            height: barHeight,
            displayValue: showTextBelowBarcode,
            fontSize: 15,
            margin: 14,
          });
        }
      } catch {
        setValidationError('تعذر توليد الباركود بهذه القيمة. تأكد من مطابقة الصيغة للمعيار المختار.');
      }
    }
  }, [inputValue, mode, sizePx, fgColor, bgColor, qrErrorLevel, showTextBelowBarcode]);

  const handleSelectMode = (newMode: CodeMode) => {
    setMode(newMode);
    if (newMode === 'EAN13' && !/^\d{12,13}$/.test(inputValue.trim())) {
      setInputValue('628100000012');
    } else if (newMode === 'UPC' && !/^\d{11,12}$/.test(inputValue.trim())) {
      setInputValue('12345678901');
    } else if (newMode === 'CODE39' && !/^[0-9A-Z\-. $/+%]+$/.test(inputValue.trim())) {
      setInputValue('INFO-NET-2026');
    } else if (newMode === 'CODE128' && /[^\x00-\x7F]/.test(inputValue.trim())) {
      setInputValue('INFONET-2026');
    }
  };

  const handleDownloadPng = () => {
    if (validationError) return;
    if (mode === 'qr' && qrDataUrl) {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-code-${Date.now()}.png`;
      link.click();
    } else if (barcodeCanvasRef.current) {
      const url = barcodeCanvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `barcode-${mode.toLowerCase()}-${Date.now()}.png`;
      link.click();
    }
  };

  const handleDownloadSvg = () => {
    if (validationError) return;
    let svgContent = '';
    if (mode === 'qr' && qrSvgString) {
      svgContent = qrSvgString;
    } else if (barcodeSvgRef.current) {
      const serializer = new XMLSerializer();
      svgContent = serializer.serializeToString(barcodeSvgRef.current);
    }
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode === 'qr' ? 'qr-code' : `barcode-${mode.toLowerCase()}`}-${Date.now()}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleReset = () => {
    setMode('qr');
    setInputValue('https://www.information-net.com/');
    setSizePx(280);
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    setQrErrorLevel('M');
    setValidationError(null);
  };

  const handleCopyInput = async () => {
    if (!inputValue.trim()) return;
    await navigator.clipboard.writeText(inputValue.trim());
    setCopiedValue(true);
    setTimeout(() => setCopiedValue(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b]">
        <span className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-3">
          اختر نوع الرمز المطلوب توليده
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'qr', label: 'QR Code (روابط ونصوص وعربي)', icon: QrCode },
            { id: 'CODE128', label: 'Barcode Code 128 (قياسي للمنتجات)', icon: Barcode },
            { id: 'EAN13', label: 'EAN-13 (باركود تجاري 13 رقماً)', icon: Barcode },
            { id: 'UPC', label: 'UPC-A (باركود أمريكي 12 رقماً)', icon: Barcode },
            { id: 'CODE39', label: 'Code 39 (مخازن وشحن)', icon: Barcode },
          ].map((item) => {
            const IconComp = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectMode(item.id as CodeMode)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border ${
                  active
                    ? 'bg-[#035dcd] text-white border-[#035dcd]'
                    : 'bg-white dark:bg-[#252a54] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#2f366b] hover:border-[#035dcd]'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Controls vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="barcode-value-input"
                className="text-xs font-bold text-gray-800 dark:text-gray-100"
              >
                {mode === 'qr'
                  ? 'النص أو الرابط أو البيانات (يدعم العربية والإنجليزية)'
                  : `قيمة الباركود (${mode})`}
              </label>
              <button
                type="button"
                onClick={handleCopyInput}
                className="text-xs text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedValue ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedValue ? 'تم النسخ' : 'نسخ القيمة'}</span>
              </button>
            </div>
            <input
              id="barcode-value-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                mode === 'qr'
                  ? 'أدخل رابط موقع، نصاً، رقم هاتف، أو بطاقة...'
                  : 'أدخل الكود الرقمي أو الحروف اللاتينية...'
              }
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-[11px] text-gray-500 dark:text-gray-400">أمثلة سريعة:</span>
              {mode === 'qr' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setInputValue('https://www.information-net.com/')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-gray-700 dark:text-gray-200 hover:border-[#035dcd] cursor-pointer"
                  >
                    رابط الموقع
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputValue('العنكبوت للمعلومات - بوابة الأدوات والشروحات التقنية')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-gray-700 dark:text-gray-200 hover:border-[#035dcd] cursor-pointer"
                  >
                    نص عربي
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputValue('WIFI:T:WPA;S:MyNetwork;P:Pass12345;;')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-gray-700 dark:text-gray-200 hover:border-[#035dcd] cursor-pointer"
                  >
                    شبكة Wi-Fi
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setInputValue(
                        mode === 'EAN13'
                          ? '628100000012'
                          : mode === 'UPC'
                          ? '12345678901'
                          : 'ITEM-2026-AR'
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-gray-700 dark:text-gray-200 hover:border-[#035dcd] cursor-pointer"
                  >
                    نموذج قياسي صالح
                  </button>
                </>
              )}
            </div>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Size & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="code-size-select"
                className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
              >
                حجم ودقة الرمز
              </label>
              <select
                id="code-size-select"
                value={sizePx}
                onChange={(e) => setSizePx(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
              >
                <option value={200}>صغير (200px)</option>
                <option value={280}>متوسط قياسي (280px)</option>
                <option value={360}>كبير (360px)</option>
                <option value={500}>دقة طباعة عالية (500px)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fg-color-input"
                className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
              >
                لون الرمز الأساسي
              </label>
              <div className="flex items-center gap-2 bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] rounded-xl px-3 py-1.5">
                <input
                  id="fg-color-input"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-gray-700 dark:text-gray-200">{fgColor}</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="bg-color-input"
                className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
              >
                لون الخلفية
              </label>
              <div className="flex items-center gap-2 bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] rounded-xl px-3 py-1.5">
                <input
                  id="bg-color-input"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-gray-700 dark:text-gray-200">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Mode-Specific Options */}
          {mode === 'qr' ? (
            <div>
              <label
                htmlFor="qr-ecc-select"
                className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
              >
                مستوى تصحيح الأخطاء (Error Correction)
              </label>
              <select
                id="qr-ecc-select"
                value={qrErrorLevel}
                onChange={(e) => setQrErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
              >
                <option value="L">منخفض (L - 7%) - رمز أبسط للروابط الطويلة</option>
                <option value="M">متوسط (M - 15%) - موصى به للاستخدام العام</option>
                <option value="Q">عالٍ (Q - 25%) - مناسب للملصقات والمنتجات</option>
                <option value="H">فائق (H - 30%) - أقصى مقاومة للتلف والطباعة</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="show-barcode-text"
                className="text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                إظهار الكود النصي أسفل خطوط الباركود
              </label>
              <input
                id="show-barcode-text"
                type="checkbox"
                checked={showTextBelowBarcode}
                onChange={(e) => setShowTextBelowBarcode(e.target.checked)}
                className="w-4 h-4 accent-[#035dcd] cursor-pointer"
              />
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#252a54] hover:bg-gray-100 dark:hover:bg-[#2d3363] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2f366b] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة الضبط للوضع الافتراضي</span>
            </button>
          </div>
        </div>

        {/* Live Preview & Download Column */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] flex flex-col items-center justify-between space-y-5">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
              معاينة الرمز المباشرة
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {mode === 'qr' ? 'QR Code 2D' : `Barcode ${mode}`}
            </span>
          </div>

          <div className="w-full min-h-[240px] p-4 rounded-xl bg-gray-50 dark:bg-[#1e2348] border border-gray-100 dark:border-[#2f366b] flex items-center justify-center overflow-x-auto">
            {validationError ? (
              <div className="text-center text-xs text-gray-400 p-4">
                يرجى تصحيح القيمة المدخلة لعرض المعاينة
              </div>
            ) : mode === 'qr' ? (
              qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="معاينة رمز QR Code"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              ) : null
            ) : (
              <div className="flex flex-col items-center">
                <svg ref={barcodeSvgRef} className="max-w-full h-auto rounded-lg shadow-sm" />
                <canvas ref={barcodeCanvasRef} className="hidden" />
              </div>
            )}
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={Boolean(validationError)}
              onClick={handleDownloadPng}
              className="w-full py-3 px-4 rounded-xl bg-[#035dcd] hover:bg-[#02479e] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>تنزيل PNG</span>
            </button>
            <button
              type="button"
              disabled={Boolean(validationError)}
              onClick={handleDownloadSvg}
              className="w-full py-3 px-4 rounded-xl bg-gray-900 dark:bg-[#1e2348] hover:bg-gray-800 disabled:opacity-50 text-white border border-gray-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>تنزيل SVG للطباعة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GoogleSnippetPreviewTool: React.FC = () => {
  const [title, setTitle] = useState<string>(
    'اختبار سرعة الإنترنت بدقة (التنزيل والرفع والبنق) | العنكبوت للمعلومات'
  );
  const [description, setDescription] = useState<string>(
    'أداة اختبار سرعة الإنترنت المباشرة لقياس سرعة التنزيل Download وسرعة الرفع Upload وزمن الاستجابة Ping والتذبذب Jitter بوحدات Mbps وms للهاتف والكمبيوتر.'
  );
  const [urlPath, setUrlPath] = useState<string>(
    'https://www.information-net.com/tools/internet-speed-test'
  );
  const [focusKeyword, setFocusKeyword] = useState<string>('اختبار سرعة الإنترنت');
  const [deviceView, setDeviceView] = useState<'both' | 'mobile' | 'desktop'>('both');
  const [copiedMeta, setCopiedMeta] = useState<boolean>(false);

  // Approximate pixel calculation based on Google's ~20px Arial/Sans rendering
  const estimatePixels = (str: string, isTitle: boolean): number => {
    let px = 0;
    for (const ch of str) {
      if (/[A-ZMW@]/.test(ch)) px += isTitle ? 12 : 9;
      else if (/[il1|.,:;!']/.test(ch)) px += isTitle ? 5 : 4;
      else if (/[\u0600-\u06FF]/.test(ch)) px += isTitle ? 9.5 : 7.2;
      else px += isTitle ? 9 : 7;
    }
    return Math.round(px);
  };

  const titleChars = title.trim().length;
  const descChars = description.trim().length;
  const titlePx = estimatePixels(title.trim(), true);
  const descPx = estimatePixels(description.trim(), false);

  const truncateForSerp = (text: string, maxChars: number): string => {
    const clean = text.trim();
    if (clean.length <= maxChars) return clean;
    return clean.slice(0, maxChars - 1).trimEnd() + '…';
  };

  const formatBreadcrumbs = (rawUrl: string): { host: string; trail: string } => {
    try {
      const parsed = new URL(
        rawUrl.startsWith('http') ? rawUrl : `https://www.information-net.com/${rawUrl.replace(/^\/+/, '')}`
      );
      const segs = parsed.pathname
        .split('/')
        .filter(Boolean)
        .slice(0, 3);
      return {
        host: parsed.hostname,
        trail: segs.length > 0 ? `${parsed.origin} › ${segs.join(' › ')}` : parsed.origin,
      };
    } catch {
      return {
        host: 'www.information-net.com',
        trail: 'https://www.information-net.com',
      };
    }
  };

  const { trail } = formatBreadcrumbs(urlPath);

  const keywordInTitle =
    focusKeyword.trim() && title.toLowerCase().includes(focusKeyword.trim().toLowerCase());
  const keywordInDesc =
    focusKeyword.trim() && description.toLowerCase().includes(focusKeyword.trim().toLowerCase());

  const handleLoadSampleArticle = (slug: string) => {
    const post = INITIAL_POSTS.find((p) => p.slug === slug);
    if (!post) return;
    setTitle(`${post.title} | العنكبوت للمعلومات`);
    setDescription(post.seoDescription || post.content.intro);
    setUrlPath(`https://www.information-net.com/${post.categorySlug}/${post.slug}`);
    setFocusKeyword(post.tags?.[0] || '');
  };

  const handleCopyMetaCode = async () => {
    const cleanUrl = urlPath.trim() || 'https://www.information-net.com/';
    const code = [
      `<title>${title.trim()}</title>`,
      `<meta name="description" content="${description.trim().replace(/"/g, '&quot;')}" />`,
      `<link rel="canonical" href="${cleanUrl}" />`,
      `<meta property="og:title" content="${title.trim().replace(/"/g, '&quot;')}" />`,
      `<meta property="og:description" content="${description.trim().replace(/"/g, '&quot;')}" />`,
      `<meta property="og:url" content="${cleanUrl}" />`,
    ].join('\n');
    await navigator.clipboard.writeText(code);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            بيانات مقتطف البحث (Title & Meta Description)
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">تجربة مقال فعلي:</span>
            {INITIAL_POSTS.slice(0, 2).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleLoadSampleArticle(p.slug)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-gray-700 dark:text-gray-200 hover:border-[#035dcd] cursor-pointer truncate max-w-[160px]"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input + Meter */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label htmlFor="serp-title-input" className="font-bold text-gray-800 dark:text-gray-100">
              عنوان الصفحة (Title Tag)
            </label>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span
                className={
                  titleChars >= 30 && titleChars <= 60
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : titleChars > 60
                    ? 'text-red-600 dark:text-red-400 font-bold'
                    : 'text-amber-600 dark:text-amber-400 font-bold'
                }
              >
                {titleChars} / 60 حرفاً
              </span>
              <span>·</span>
              <span className="text-gray-500 dark:text-gray-400">~{titlePx}px / 580px</span>
            </div>
          </div>
          <input
            id="serp-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان الصفحة الذي يظهر في نتائج بحث جوجل..."
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
          />
          <div className="w-full h-1.5 bg-gray-200 dark:bg-[#252a54] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                titleChars >= 30 && titleChars <= 65
                  ? 'bg-emerald-500'
                  : titleChars > 65
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((titleChars / 65) * 100))}%` }}
            />
          </div>
        </div>

        {/* Description Input + Meter */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label htmlFor="serp-desc-input" className="font-bold text-gray-800 dark:text-gray-100">
              وصف الميتا (Meta Description)
            </label>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span
                className={
                  descChars >= 110 && descChars <= 160
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : descChars > 160
                    ? 'text-red-600 dark:text-red-400 font-bold'
                    : 'text-amber-600 dark:text-amber-400 font-bold'
                }
              >
                {descChars} / 160 حرفاً
              </span>
              <span>·</span>
              <span className="text-gray-500 dark:text-gray-400">~{descPx}px / 960px</span>
            </div>
          </div>
          <textarea
            id="serp-desc-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أدخل الوصف المختصر للصفحة لجذب الباحثين للنقر..."
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
          />
          <div className="w-full h-1.5 bg-gray-200 dark:bg-[#252a54] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                descChars >= 110 && descChars <= 160
                  ? 'bg-emerald-500'
                  : descChars > 160
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((descChars / 160) * 100))}%` }}
            />
          </div>
        </div>

        {/* URL & Focus Keyword */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="serp-url-input"
              className="block text-xs font-bold text-gray-800 dark:text-gray-100 mb-2"
            >
              الرابط الدائم للصفحة (Canonical URL)
            </label>
            <input
              id="serp-url-input"
              type="text"
              dir="ltr"
              value={urlPath}
              onChange={(e) => setUrlPath(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            />
          </div>

          <div>
            <label
              htmlFor="serp-keyword-input"
              className="block text-xs font-bold text-gray-800 dark:text-gray-100 mb-2"
            >
              الكلمة المفتاحية المستهدفة (اختياري للفحص)
            </label>
            <input
              id="serp-keyword-input"
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="مثال: اختبار سرعة الإنترنت"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            />
          </div>
        </div>
      </div>

      {/* Device Switcher & Copy Code */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b]">
          {[
            { id: 'both', label: 'معاينة الهاتف والكمبيوتر معاً', icon: Search },
            { id: 'mobile', label: 'معاينة الهاتف (Mobile)', icon: Smartphone },
            { id: 'desktop', label: 'معاينة الكمبيوتر (Desktop)', icon: Monitor },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = deviceView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDeviceView(tab.id as 'both' | 'mobile' | 'desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-[#252a54] text-[#035dcd] dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCopyMetaCode}
          className="px-4 py-2.5 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copiedMeta ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedMeta ? 'تم نسخ كود HTML Meta!' : 'نسخ كود Meta Tags الجاهز'}</span>
        </button>
      </div>

      {/* Live SERP Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(deviceView === 'both' || deviceView === 'mobile') && (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-100 dark:border-[#2f366b]">
              <span className="font-bold flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                <Smartphone className="w-4 h-4 text-[#035dcd]" />
                <span>نتيجة بحث Google على الجوال (Mobile SERP)</span>
              </span>
              <span>عرض ~380px</span>
            </div>

            <div className="p-4 rounded-xl bg-white text-right border border-gray-100 shadow-xs space-y-1.5" dir="rtl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-[#035dcd]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#202124] truncate">العنكبوت للمعلومات</div>
                  <div className="text-[11px] text-[#4d5156] truncate" dir="ltr">
                    {trail}
                  </div>
                </div>
              </div>
              <h4 className="text-base font-medium text-[#1a0dab] hover:underline leading-snug pt-0.5 break-words">
                {truncateForSerp(title || 'عنوان الصفحة يظهر هنا', 62)}
              </h4>
              <p className="text-xs text-[#4d5156] leading-relaxed break-words">
                {truncateForSerp(description || 'وصف الميتا يظهر هنا في نتائج بحث جوجل...', 145)}
              </p>
            </div>
          </div>
        )}

        {(deviceView === 'both' || deviceView === 'desktop') && (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-100 dark:border-[#2f366b]">
              <span className="font-bold flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                <Monitor className="w-4 h-4 text-[#035dcd]" />
                <span>نتيجة بحث Google على الكمبيوتر (Desktop SERP)</span>
              </span>
              <span>عرض ~600px</span>
            </div>

            <div className="p-4 rounded-xl bg-white text-right border border-gray-100 shadow-xs space-y-1.5" dir="rtl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-[#035dcd]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#202124] truncate">العنكبوت للمعلومات</div>
                  <div className="text-[11px] text-[#4d5156] truncate" dir="ltr">
                    {trail}
                  </div>
                </div>
              </div>
              <h4 className="text-lg font-medium text-[#1a0dab] hover:underline leading-snug pt-0.5 break-words">
                {truncateForSerp(title || 'عنوان الصفحة يظهر هنا', 65)}
              </h4>
              <p className="text-[13px] text-[#4d5156] leading-relaxed break-words">
                {truncateForSerp(description || 'وصف الميتا يظهر هنا في نتائج بحث جوجل...', 160)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Diagnostic Recommendations */}
      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-3">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#035dcd]" />
          <span>تحليل واقتراحات تحسين المقتطف (SEO Audit)</span>
        </h4>
        <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-200">
          <li className="flex items-start gap-2">
            {titleChars >= 30 && titleChars <= 60 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <span>
              <strong>طول العنوان:</strong>{' '}
              {titleChars < 30
                ? 'العنوان قصير نسبياً؛ يُنصح بإضافة كلمات دلالية توضح محتوى الصفحة ليصل إلى 45–60 حرفاً.'
                : titleChars > 60
                ? 'العنوان يتجاوز 60 حرفاً وقد يتم اقتطاعه بعلامة (…) في بعض الشاشات؛ ضع أهم الكلمات في البداية.'
                : 'ممتاز! طول العنوان مثالي للظهور الكامل في نتائج البحث دون اقتصاص.'}
            </span>
          </li>

          <li className="flex items-start gap-2">
            {descChars >= 110 && descChars <= 160 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <span>
              <strong>طول الوصف:</strong>{' '}
              {descChars < 110
                ? 'الوصف قصير؛ يُفضل توسيعه ليصبح بين 120 و155 حرفاً لشرح فائدة الصفحة وتحفيز الزائر على النقر.'
                : descChars > 160
                ? 'الوصف أطول من 160 حرفاً وسيتم اقتصاص نهايته في جوجل؛ اختصر الجمل الزائدة.'
                : 'ممتاز! طول وصف الميتا متوازن ومثالي للهاتف وسطح المكتب.'}
            </span>
          </li>

          {focusKeyword.trim() && (
            <li className="flex items-start gap-2">
              {keywordInTitle && keywordInDesc ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <span>
                <strong>تواجد الكلمة المفتاحية «{focusKeyword.trim()}»:</strong>{' '}
                {keywordInTitle && keywordInDesc
                  ? 'موجودة في كل من العنوان ووصف الميتا، مما يعزز ارتباط المقتطف ببحث المستخدم.'
                  : !keywordInTitle && !keywordInDesc
                  ? 'غير موجودة في العنوان ولا في الوصف؛ يُنصح بتضمينها بشكل طبيعي.'
                  : keywordInTitle
                  ? 'موجودة في العنوان ولكنها غائبة عن الوصف؛ أضفها في الجملة الأولى من الوصف.'
                  : 'موجودة في الوصف ولكنها غائبة عن العنوان الرئيسي.'}
              </span>
            </li>
          )}
        </ul>

        <div className="pt-2 border-t border-gray-200 dark:border-[#2f366b] flex items-start gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4 text-[#035dcd] shrink-0 mt-0.5" />
          <span>
            ملاحظة: هذه المعاينة تقريبية لمساعدتك في ضبط الأطوال القياسية؛ قد يعيد محرك بحث Google صياغة العنوان أو المقتطف ديناميكياً بحسب عبارة البحث التي يكتبها المستخدم.
          </span>
        </div>
      </div>
    </div>
  );
};
