import React, { useState, useRef } from 'react';
import {
  Gauge,
  Play,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  Activity,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Copy,
  RefreshCw,
  Trash2,
  Server,
  Info,
} from 'lucide-react';

interface SpeedTestResult {
  pingMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  serverUsed: string;
  timestamp: string;
}

export const InternetSpeedTestTool: React.FC = () => {
  const [stage, setStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'done' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('اضغط على «ابدأ اختبار السرعة» لبدء القياس الفعلي.');
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [jitterMs, setJitterMs] = useState<number | null>(null);
  const [downloadMbps, setDownloadMbps] = useState<number | null>(null);
  const [uploadMbps, setUploadMbps] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [serverUsed, setServerUsed] = useState<string>('خادم القياس المباشر');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const measurePing = async (signal: AbortSignal): Promise<{ ping: number; jitter: number; usedCloudflare: boolean }> => {
    const samples: number[] = [];
    let usedCf = false;

    for (let i = 0; i < 5; i++) {
      if (signal.aborted) throw new Error('Aborted');
      const start = performance.now();
      try {
        const res = await fetch(`https://speed.cloudflare.com/__down?bytes=0&t=${Date.now()}-${i}`, {
          method: 'GET',
          cache: 'no-store',
          mode: 'cors',
          signal,
        });
        if (res.ok) {
          await res.arrayBuffer();
          usedCf = true;
        } else {
          throw new Error('Fallback to local ping');
        }
      } catch (err) {
        if (signal.aborted) throw err;
        const fallbackStart = performance.now();
        const res = await fetch(`/api/tools/speedtest/ping?t=${Date.now()}-${i}`, {
          method: 'GET',
          cache: 'no-store',
          signal,
        });
        if (!res.ok) throw new Error('تعذر الاتصال بخادم القياس');
        await res.json();
        samples.push(Math.max(1, performance.now() - fallbackStart));
        setProgress(Math.round(((i + 1) / 5) * 25));
        continue;
      }
      const rtt = Math.max(1, performance.now() - start);
      samples.push(rtt);
      setProgress(Math.round(((i + 1) / 5) * 25));
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const bestPing = Math.round(sorted[0]);
    let jitterSum = 0;
    for (let i = 1; i < samples.length; i++) {
      jitterSum += Math.abs(samples[i] - samples[i - 1]);
    }
    const jitter = samples.length > 1 ? Math.round(jitterSum / (samples.length - 1)) : 1;

    return { ping: bestPing, jitter, usedCloudflare: usedCf };
  };

  const measureDownload = async (signal: AbortSignal, preferCloudflare: boolean): Promise<number> => {
    const payloadSizes = preferCloudflare
      ? [1_000_000, 4_000_000, 8_000_000]
      : [1_500_000, 4_000_000, 8_000_000];
    let totalBytes = 0;
    let totalSeconds = 0;

    for (let idx = 0; idx < payloadSizes.length; idx++) {
      if (signal.aborted) throw new Error('Aborted');
      const size = payloadSizes[idx];
      const url = preferCloudflare
        ? `https://speed.cloudflare.com/__down?bytes=${size}&t=${Date.now()}-${idx}`
        : `/api/tools/speedtest/download?bytes=${size}&t=${Date.now()}-${idx}`;

      const start = performance.now();
      let receivedInChunk = 0;

      try {
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          signal,
        });
        if (!response.ok) throw new Error('Download chunk failed');

        if (response.body) {
          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              receivedInChunk += value.byteLength;
              const elapsedSec = Math.max(0.05, (performance.now() - start) / 1000);
              const liveMbps = ((totalBytes + receivedInChunk) * 8) / ((totalSeconds + elapsedSec) * 1_000_000);
              setDownloadMbps(Number(liveMbps.toFixed(2)));
            }
          }
        } else {
          const buf = await response.arrayBuffer();
          receivedInChunk = buf.byteLength;
        }
      } catch (err) {
        if (signal.aborted) throw err;
        // Fallback to local server endpoint if Cloudflare CORS/network blocked mid-test
        const fallbackStart = performance.now();
        const fallbackRes = await fetch(`/api/tools/speedtest/download?bytes=${size}&t=${Date.now()}-${idx}`, {
          method: 'GET',
          cache: 'no-store',
          signal,
        });
        const buf = await fallbackRes.arrayBuffer();
        receivedInChunk = buf.byteLength;
        const elapsed = Math.max(0.05, (performance.now() - fallbackStart) / 1000);
        totalBytes += receivedInChunk;
        totalSeconds += elapsed;
        const mbps = (totalBytes * 8) / (totalSeconds * 1_000_000);
        setDownloadMbps(Number(mbps.toFixed(2)));
        setProgress(25 + Math.round(((idx + 1) / payloadSizes.length) * 45));
        continue;
      }

      const elapsed = Math.max(0.05, (performance.now() - start) / 1000);
      totalBytes += receivedInChunk;
      totalSeconds += elapsed;
      const currentMbps = (totalBytes * 8) / (totalSeconds * 1_000_000);
      setDownloadMbps(Number(currentMbps.toFixed(2)));
      setProgress(25 + Math.round(((idx + 1) / payloadSizes.length) * 45));
    }

    const finalMbps = totalSeconds > 0 ? (totalBytes * 8) / (totalSeconds * 1_000_000) : 0;
    return Number(Math.max(0.1, finalMbps).toFixed(2));
  };

  const measureUpload = async (signal: AbortSignal): Promise<number> => {
    const chunkSizes = [512 * 1024, 1024 * 1024, 1536 * 1024];
    let totalBytes = 0;
    let totalSeconds = 0;

    for (let idx = 0; idx < chunkSizes.length; idx++) {
      if (signal.aborted) throw new Error('Aborted');
      const size = chunkSizes[idx];
      const payload = new Uint8Array(size);
      for (let i = 0; i < size; i += 4096) {
        payload[i] = i % 256;
      }

      const start = performance.now();
      const res = await fetch(`/api/tools/speedtest/upload?t=${Date.now()}-${idx}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: payload,
        cache: 'no-store',
        signal,
      });
      if (!res.ok) throw new Error('تعذر إتمام قياس الرفع');
      await res.json();
      const elapsed = Math.max(0.05, (performance.now() - start) / 1000);
      totalBytes += size;
      totalSeconds += elapsed;
      const currentMbps = (totalBytes * 8) / (totalSeconds * 1_000_000);
      setUploadMbps(Number(currentMbps.toFixed(2)));
      setProgress(70 + Math.round(((idx + 1) / chunkSizes.length) * 30));
    }

    const finalMbps = totalSeconds > 0 ? (totalBytes * 8) / (totalSeconds * 1_000_000) : 0;
    return Number(Math.max(0.1, finalMbps).toFixed(2));
  };

  const startSpeedTest = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setErrorMsg(null);
    setPingMs(null);
    setJitterMs(null);
    setDownloadMbps(null);
    setUploadMbps(null);
    setProgress(5);

    try {
      setStage('ping');
      setStatusMessage('جاري قياس زمن الاستجابة (Ping) والتذبذب (Jitter)...');
      const pingData = await measurePing(controller.signal);
      setPingMs(pingData.ping);
      setJitterMs(pingData.jitter);
      const serverLabel = pingData.usedCloudflare
        ? 'Cloudflare Edge CDN + خادم الموقع'
        : 'خادم العنكبوت للمعلومات المباشر';
      setServerUsed(serverLabel);

      setStage('download');
      setStatusMessage('جاري قياس سرعة التنزيل الفعلية (Download)...');
      const dlMbps = await measureDownload(controller.signal, pingData.usedCloudflare);
      setDownloadMbps(dlMbps);

      setStage('upload');
      setStatusMessage('جاري قياس سرعة الرفع الفعلية (Upload)...');
      const ulMbps = await measureUpload(controller.signal);
      setUploadMbps(ulMbps);

      setProgress(100);
      setStage('done');
      setStatusMessage('اكتمل اختبار سرعة الإنترنت بنجاح.');

      setHistory((prev) => [
        {
          pingMs: pingData.ping,
          jitterMs: pingData.jitter,
          downloadMbps: dlMbps,
          uploadMbps: ulMbps,
          serverUsed: serverLabel,
          timestamp: new Date().toLocaleTimeString('ar-EG'),
        },
        ...prev.slice(0, 4),
      ]);
    } catch (err: any) {
      if (err?.message === 'Aborted' || err?.name === 'AbortError') {
        setStage('idle');
        setStatusMessage('تم إيقاف الاختبار.');
        return;
      }
      setStage('error');
      setErrorMsg('تعذر إكمال القياس بسبب انقطاع الاتصال أو حظر الطلبات في الشبكة الحالية. يرجى المحاولة مرة أخرى.');
      setStatusMessage('توقف الاختبار بسبب خطأ في الشبكة.');
    }
  };

  const isRunning = stage === 'ping' || stage === 'download' || stage === 'upload';

  return (
    <div className="space-y-6">
      {/* Main Interactive Measurement Card */}
      <div className="p-5 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b]">
        {/* Stage & Server Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-gray-200 dark:border-[#2f366b]">
          <div className="flex items-center gap-2.5">
            <Activity className={`w-5 h-5 text-[#035dcd] dark:text-blue-400 ${isRunning ? 'animate-spin' : ''}`} />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{statusMessage}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Server className="w-3.5 h-3.5 text-[#035dcd]" />
            <span>نقطة القياس: {serverUsed}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {(isRunning || stage === 'done') && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">
              <span>
                {stage === 'ping' && 'المرحلة 1 من 3: قياس زمن الاستجابة (Ping)'}
                {stage === 'download' && 'المرحلة 2 من 3: قياس سرعة التنزيل (Download)'}
                {stage === 'upload' && 'المرحلة 3 من 3: قياس سرعة الرفع (Upload)'}
                {stage === 'done' && 'اكتملت جميع مراحل الفحص (100%)'}
              </span>
              <span className="font-mono tabular-nums text-[#035dcd] dark:text-blue-400">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 dark:bg-[#252a54] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#035dcd] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 4 Metric Readout Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Download */}
          <div
            className={`p-4 sm:p-5 rounded-xl bg-white dark:bg-[#252a54] border transition-colors ${
              stage === 'download'
                ? 'border-[#035dcd] ring-2 ring-[#035dcd]/20'
                : 'border-gray-200 dark:border-[#2f366b]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-bold">سرعة التنزيل (Download)</span>
              <ArrowDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-gray-900 dark:text-white">
              {downloadMbps !== null ? downloadMbps : '—'}
            </div>
            <span className="text-xs text-gray-400 font-mono">Mbps</span>
          </div>

          {/* Upload */}
          <div
            className={`p-4 sm:p-5 rounded-xl bg-white dark:bg-[#252a54] border transition-colors ${
              stage === 'upload'
                ? 'border-[#035dcd] ring-2 ring-[#035dcd]/20'
                : 'border-gray-200 dark:border-[#2f366b]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-bold">سرعة الرفع (Upload)</span>
              <ArrowUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-gray-900 dark:text-white">
              {uploadMbps !== null ? uploadMbps : '—'}
            </div>
            <span className="text-xs text-gray-400 font-mono">Mbps</span>
          </div>

          {/* Ping */}
          <div
            className={`p-4 sm:p-5 rounded-xl bg-white dark:bg-[#252a54] border transition-colors ${
              stage === 'ping'
                ? 'border-[#035dcd] ring-2 ring-[#035dcd]/20'
                : 'border-gray-200 dark:border-[#2f366b]'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-bold">زمن الاستجابة (Ping)</span>
              <Gauge className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-gray-900 dark:text-white">
              {pingMs !== null ? pingMs : '—'}
            </div>
            <span className="text-xs text-gray-400 font-mono">ms</span>
          </div>

          {/* Jitter */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b]">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-bold">التذبذب (Jitter)</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-gray-900 dark:text-white">
              {jitterMs !== null ? jitterMs : '—'}
            </div>
            <span className="text-xs text-gray-400 font-mono">ms</span>
          </div>
        </div>

        {/* Error Box */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={startSpeedTest}
            disabled={isRunning}
            className={`px-8 py-4 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
              isRunning
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                : 'bg-[#035dcd] hover:bg-[#02479e] text-white shadow-md'
            }`}
          >
            {stage === 'done' || stage === 'error' ? (
              <>
                <RotateCcw className="w-5 h-5" />
                <span>إعادة الاختبار</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{isRunning ? 'جاري الفحص...' : 'ابدأ اختبار السرعة'}</span>
              </>
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
          ملاحظة: النتائج المعروضة تقريبية وتعكس سرعة نقل البيانات الفعلية بين متصفحك وخادم الفحص لحظة الاختبار، وقد تختلف عن أقصى سرعة لخط الإنترنت لديك تبعاً لحالة Wi-Fi أو الضغط على الشبكة.
        </p>
      </div>

      {/* Session History Table */}
      {history.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b]">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            سجل قياساتك في هذه الجلسة
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#2f366b] text-gray-500 dark:text-gray-400">
                  <th className="py-2.5 px-3">الوقت</th>
                  <th className="py-2.5 px-3">التنزيل (Download)</th>
                  <th className="py-2.5 px-3">الرفع (Upload)</th>
                  <th className="py-2.5 px-3">الاستجابة (Ping)</th>
                  <th className="py-2.5 px-3">التذبذب (Jitter)</th>
                  <th className="py-2.5 px-3">خادم القياس</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-b-0 border-gray-100 dark:border-[#2f366b] text-gray-800 dark:text-gray-200"
                  >
                    <td className="py-2.5 px-3 font-mono tabular-nums">{item.timestamp}</td>
                    <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      {item.downloadMbps} Mbps
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                      {item.uploadMbps} Mbps
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">{item.pingMs} ms</td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">{item.jitterMs} ms</td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{item.serverUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Tool 2: AI Prompt Generator (/tools/ai-prompt-generator)
// ============================================================================

const TARGET_AI_OPTIONS = [
  { id: 'general', label: 'عام (جميع نماذج الذكاء الاصطناعي)' },
  { id: 'chatgpt', label: 'ChatGPT (OpenAI GPT-4o / o1)' },
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'claude', label: 'Claude (Anthropic)' },
  { id: 'coding', label: 'مساعد برمجي (Cursor / Copilot)' },
  { id: 'image', label: 'توليد الصور (Midjourney / DALL-E)' },
];

const TASK_TYPE_OPTIONS = [
  { id: 'web-dev', label: 'إنشاء موقع أو صفحة ويب' },
  { id: 'code-debug', label: 'كتابة الأكواد وإصلاح الأخطاء' },
  { id: 'seo-article', label: 'كتابة مقال متوافق مع SEO' },
  { id: 'image-design', label: 'إنشاء الصور والتصميمات' },
  { id: 'marketing', label: 'التسويق وصناعة المحتوى' },
  { id: 'data-analysis', label: 'تحليل البيانات' },
  { id: 'other', label: 'مهام أخرى' },
];

export const AiPromptGeneratorTool: React.FC = () => {
  const [targetAi, setTargetAi] = useState<string>('general');
  const [taskType, setTaskType] = useState<string>('seo-article');
  const [userIdea, setUserIdea] = useState<string>('');
  const [promptLang, setPromptLang] = useState<'ar' | 'en' | 'bilingual'>('ar');
  const [detailLevel, setDetailLevel] = useState<'concise' | 'balanced' | 'comprehensive'>('comprehensive');
  const [constraints, setConstraints] = useState<string>('');
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const buildStructuredPrompt = (varIdx: number): string => {
    const cleanIdea = userIdea.trim();
    const cleanConstraints = constraints.trim();
    const aiLabel = TARGET_AI_OPTIONS.find((a) => a.id === targetAi)?.label || 'نموذج الذكاء الاصطناعي';
    const taskLabel = TASK_TYPE_OPTIONS.find((t) => t.id === taskType)?.label || 'مهمة مخصصة';

    const roleByTaskAr: Record<string, string[]> = {
      'web-dev': [
        'أنت مهندس واجهات أمامية ومطور ويب خبير (Senior Full-Stack Web Developer & UI/UX Architect) متخصص في بناء صفحات ومواقع ويب متجاوبة وسريعة وعالية الأداء.',
        'تصرف كخبير تطوير مواقع وتصميم تجربة المستخدم (Web & UX Specialist) يلتزم بأفضل معايير HTML5 وCSS/Tailwind وTypeScript وإمكانية الوصول.',
      ],
      'code-debug': [
        'أنت مهندس برمجيات أول ومراجع أكواد خبير (Staff Software Engineer & Code Reviewer) متخصص في كتابة كود نظيف وقابل للصيانة وتشخيص الأخطاء البرمجية من جذورها.',
        'تصرف كمعماري برمجيات خبير (Principal Software Architect) يركز على الأداء والأمان ومعالجة الحالات الحدية (Edge Cases) دون حلول ترقيعية.',
      ],
      'seo-article': [
        'أنت كاتب محتوى تقني وخبير تحسين محركات البحث (Senior SEO Content Strategist) متقن لقواعد الكتابة العربية السليمة وهيكلة المقالات المتوافقة مع معايير البحث.',
        'تصرف كمحرر صحفي وخبير SEO متخصص في صياغة مقالات شاملة وعملية تقدم قيمة حقيقية للقارئ وتراعي نية البحث (Search Intent).',
      ],
      'image-design': [
        'أنت مدير فني ومصمم بصري محترف (Creative Art Director & Visual Prompt Designer) متخصص في صياغة الأوصاف البصرية الدقيقة للإضاءة والتكوين والخامات وزوايا الكاميرا.',
        'تصرف كمصور فوتوغرافي ومصمم مشاهد رقمية خبير يحول الأفكار إلى أوصاف بصرية غنية بالتفاصيل الواقعية والفنية.',
      ],
      marketing: [
        'أنت خبير تسويق رقمي وصانع محتوى إعلاني (Senior Digital Marketing & Copywriting Strategist) متخصص في فهم الجمهور المستهدف ورفع معدل التحويل.',
        'تصرف كمستشار نمو وتسويق محتوى يجمع بين الإقناع الهادئ والبيانات الواضحة والرسائل التسويقية الصادقة.',
      ],
      'data-analysis': [
        'أنت محلل بيانات وخبير إحصاء واستخلاص رؤى (Senior Data Analyst & Business Intelligence Specialist) دقيق في قراءة الأرقام واكتشاف الأنماط.',
        'تصرف كخبير علوم بيانات متخصص في تنظيف البيانات وتفسير المؤشرات وتقديم توصيات عملية قابلة للتنفيذ.',
      ],
      other: [
        'أنت مستشار خبير ومتخصص محترف في المجال المطلوب، تقدم إجابات منهجية ودقيقة ومبنية على خطوات عملية واضحة.',
        'تصرف كخبير استشاري متمرس يحلل المطلوب بدقة ويقدم مخرجات منظمة وقابلة للتطبيق المباشر.',
      ],
    };

    const instructionsByTaskAr: Record<string, string[]> = {
      'web-dev': [
        '1. صمّم هيكل الصفحة والمكونات بوضوح مع دعم التجاوب الكامل للهواتف والشاشات الكبيرة.',
        '2. راعِ اتجاه اللغة (RTL للعربية) وتباين الألوان وسهولة الوصول بلوحة المفاتيح.',
        '3. اكتب كوداً نظيفاً يعمل فعلياً دون أزرار شكلية أو وظائف وهمية.',
        '4. أضف معالجة لحالات التحميل والخطأ والبيانات الفارغة.',
      ],
      'code-debug': [
        '1. حلّل المشكلة أو المتطلبات البرمجية وحدّد السبب الجذري قبل كتابة الكود.',
        '2. قدّم الكود الكامل القابل للتشغيل مع توضيح المدخلات والمخرجات.',
        '3. عالج الحالات الحدية (Edge Cases) وأخطاء المدخلات غير الصالحة.',
        '4. اشرح بإيجاز سبب المشكلة (إن وُجدت) وكيف يضمن الحل عدم تكرارها.',
      ],
      'seo-article': [
        '1. اقترح عنوان صفحة (Title) جذاباً لا يتجاوز 60 حرفاً، ووصف ميتا (Meta Description) بين 120 و160 حرفاً.',
        '2. قسّم المقال باستخدام عنوان رئيسي واحد (H1) وعناوين فرعية متدرجة ومنطقية (H2 وH3).',
        '3. اكتب بأسلوب عربي واضح ومباشر يقدم معلومات دقيقة دون حشو أو تكرار.',
        '4. اختم المقال بقسم للأسئلة الشائعة (FAQ) وخلاصة عملية.',
      ],
      'image-design': [
        '1. صِف العنصر الرئيسي (Subject) والبيئة المحيطة به بدقة.',
        '2. حدّد نوع الإضاءة، وزاوية الكاميرا، والعدسة، والألوان السائدة.',
        '3. أضف تفاصيل الخامات والأسلوب الفني المطلوب وأبعاد الصورة المقترحة (Aspect Ratio).',
      ],
      marketing: [
        '1. حدّد الفئة المستهدفة ونقطة الألم أو الاحتياج الأساسي الذي يعالجه المحتوى.',
        '2. قدّم صياغة جذابة وواضحة تركز على القيمة الفعلية دون مبالغات غير واقعية.',
        '3. أرفق دعوة لاتخاذ إجراء (CTA) واضحة ومباشرة.',
      ],
      'data-analysis': [
        '1. حدّد المتغيرات والمؤشرات الأساسية المطلوب فحصها.',
        '2. استخرج الأنماط والملاحظات الجوهرية من البيانات المتاحة.',
        '3. اعرض النتائج في نقاط أو جداول مقارنة واضحة مع توصيات عملية مبنية على الأرقام.',
      ],
      other: [
        '1. افهم الهدف الأساسي للمهمة وقسّم الحل إلى خطوات منطقية مرتبة.',
        '2. قدّم معلومات دقيقة ومباشرة قابلة للتطبيق العملي.',
        '3. تجنب العموميات وركّز على التفاصيل المرتبطة بطلب المستخدم.',
      ],
    };

    const qualityCriteriaByTaskAr: Record<string, string> = {
      'web-dev': 'التحقق من سلامة الكود برمجياً، عمل جميع الأزرار والمدخلات، توافق التصميم مع الجوال وسطح المكتب، وخلو الواجهة من أي نصوص تجريبية.',
      'code-debug': 'خلو الكود من الأخطاء المترجمة (Compile/Runtime Errors)، كفاءة الأداء، أمان التعامل مع المدخلات، ووضوح أسماء المتغيرات والدوال.',
      'seo-article': 'سلامة اللغة العربية، دقة المعلومات، التدرج السليم للعناوين (H1 -> H2 -> H3)، وتوزيع الكلمات المفتاحية بشكل طبيعي غير متكلف.',
      'image-design': 'وضوح العناصر البصرية، تناسق الإضاءة والألوان، وخلو الوصف من التناقضات الفنية.',
      marketing: 'وضوح الرسالة التسويقية، ملاءمتها للجمهور المستهدف، وصدق العرض دون وعود زائفة.',
      'data-analysis': 'دقة الحسابات والمنطق التحليلي، التمييز الواضح بين الحقائق والاستنتاجات، وقابلية التوصيات للتنفيذ.',
      other: 'الشمولية، الدقة، التنظيم المنهجي، والالتزام الكامل بجميع الشروط المذكورة.',
    };

    if (promptLang === 'en') {
      const detailTextEn =
        detailLevel === 'concise'
          ? 'Keep the response concise, direct, and focused on actionable essentials.'
          : detailLevel === 'balanced'
          ? 'Provide a well-balanced, structured response with clear explanations and practical examples.'
          : 'Provide a comprehensive, in-depth, production-grade response covering all details and edge cases.';

      return [
        `# Role & Objective`,
        `Act as a senior specialist for the task: "${taskLabel}" (Target Environment: ${aiLabel}).`,
        `Your primary objective is to fulfill the following request with high precision:`,
        `"${cleanIdea}"`,
        ``,
        `# Context & Scope`,
        `- Task Category: ${taskLabel}`,
        `- Detail Level: ${detailTextEn}`,
        ``,
        `# Step-by-Step Instructions`,
        `1. Analyze the core objective and break down the solution into logical, well-structured sections.`,
        `2. Provide concrete, accurate, and directly usable outputs (avoid placeholders or generic filler).`,
        `3. Address edge cases, validation, and best practices relevant to ${taskLabel}.`,
        ``,
        `# Constraints & Requirements`,
        cleanConstraints
          ? `- User Constraints: ${cleanConstraints}`
          : `- Do not fabricate facts, metrics, or unsupported claims. Maintain clarity and accuracy.`,
        ``,
        `# Expected Output Format & Quality Criteria`,
        `- Present the output using clear headings, bullet points, and code/tables where appropriate.`,
        `- Verify completeness, accuracy, and adherence to every constraint before finalizing the response.`,
      ].join('\n');
    }

    const roleOptions = roleByTaskAr[taskType] || roleByTaskAr.other;
    const chosenRole = roleOptions[varIdx % roleOptions.length];
    const instructions = instructionsByTaskAr[taskType] || instructionsByTaskAr.other;
    const qualityCriteria = qualityCriteriaByTaskAr[taskType] || qualityCriteriaByTaskAr.other;

    const detailDesc =
      detailLevel === 'concise'
        ? 'مختصر ومباشر: ركّز على الخلاصة والخطوات التنفيذية المباشرة دون إطالة.'
        : detailLevel === 'balanced'
        ? 'متوسط ومتوازن: اجمع بين الشرح الواضح والأمثلة العملية دون إسهاب زائد.'
        : 'احترافي ومفصّل شامل: قدّم معالجة متكاملة تغطي كافة الجوانب التقنية والتفصيلية والحالات الحدية.';

    const bilingualNote =
      promptLang === 'bilingual'
        ? '- استخدم اللغة العربية الفصحى الواضحة في الشرح مع إبقاء المصطلحات التقنية الأساسية والأكواد باللغة الإنجليزية (Bilingual Technical Format).'
        : '- التزم باللغة العربية الفصحى السليمة والواضحة في كامل المخرجات.';

    const lines = [
      `### 1. الدور والهدف الأساسي (Role & Objective)`,
      chosenRole,
      `المهمة المطلوبة (${taskLabel} — مخصص لـ ${aiLabel}):`,
      `«${cleanIdea}»`,
      ``,
      `### 2. السياق ومستوى التفصيل (Context)`,
      `- نوع المهمة: ${taskLabel}`,
      `- مستوى التفصيل المطلوب: ${detailDesc}`,
      bilingualNote,
      ``,
      `### 3. التعليمات والخطوات المطلوبة (Instructions)`,
      ...instructions,
      ``,
      `### 4. القيود والضوابط (Constraints)`,
      ...(cleanConstraints
        ? [
            `- التزم بالمتطلبات والقيود الخاصة التالية بدقة: ${cleanConstraints}`,
            `- لا تستخدم بيانات وهمية أو ادعاءات غير موثقة.`,
          ]
        : [
            `- تجنب الحشو والعموميات، ولا تفترض متطلبات تتعارض مع الفكرة الأساسية.`,
            `- لا تذكر معلومات غير مؤكدة على أنها حقائق قاطعة.`,
          ]),
      ``,
      `### 5. المخرجات المتوقعة ومعايير الجودة (Expected Output & Quality Criteria)`,
      `- اعرض النتيجة النهائية في أقسام منظمة بعناوين واضحة ونقاط قابلة للتطبيق المباشر.`,
      `- معيار التحقق والجودة: ${qualityCriteria}`,
    ];

    return lines.join('\n');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdea.trim() || userIdea.trim().length < 5) {
      setErrorMsg('يرجى كتابة وصف واضح لفكرتك (5 أحرف على الأقل) لإنشاء البرومبت المنظم.');
      return;
    }
    setErrorMsg(null);
    const promptText = buildStructuredPrompt(variationIndex);
    setGeneratedPrompt(promptText);
  };

  const handleRegenerateVariation = () => {
    if (!userIdea.trim() || userIdea.trim().length < 5) {
      setErrorMsg('يرجى إدخال وصف الفكرة أولاً قبل طلب صياغة بديلة.');
      return;
    }
    setErrorMsg(null);
    const nextIdx = variationIndex + 1;
    setVariationIndex(nextIdx);
    setGeneratedPrompt(buildStructuredPrompt(nextIdx));
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback selection copy
    }
  };

  const handleReset = () => {
    setTargetAi('general');
    setTaskType('seo-article');
    setUserIdea('');
    setPromptLang('ar');
    setDetailLevel('comprehensive');
    setConstraints('');
    setGeneratedPrompt('');
    setErrorMsg(null);
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleGenerate}
        className="p-5 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target AI */}
          <div>
            <label
              htmlFor="target-ai-select"
              className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
            >
              أداة الذكاء الاصطناعي المستهدفة
            </label>
            <select
              id="target-ai-select"
              value={targetAi}
              onChange={(e) => setTargetAi(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            >
              {TARGET_AI_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Task Type */}
          <div>
            <label
              htmlFor="task-type-select"
              className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
            >
              نوع المهمة المطلوبة
            </label>
            <select
              id="task-type-select"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            >
              {TASK_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User Idea */}
        <div>
          <label
            htmlFor="user-idea-input"
            className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
          >
            اشرح فكرتك أو طلبك بالتفصيل <span className="text-red-500">*</span>
          </label>
          <textarea
            id="user-idea-input"
            rows={4}
            value={userIdea}
            onChange={(e) => setUserIdea(e.target.value)}
            placeholder="مثال: أريد كتابة دليل شامل يشرح كيفية حماية شبكة الواي فاي المنزلية من الاختراق بخطوات مبسطة للمبتدئين..."
            className="w-full p-3.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd] leading-relaxed"
          />
        </div>

        {/* Language & Detail Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="prompt-lang-select"
              className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
            >
              لغة البرومبت
            </label>
            <select
              id="prompt-lang-select"
              value={promptLang}
              onChange={(e) => setPromptLang(e.target.value as 'ar' | 'en' | 'bilingual')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            >
              <option value="ar">العربية الفصحى</option>
              <option value="bilingual">ثنائي اللغة (شرح عربي + مصطلحات تقنية إنجليزية)</option>
              <option value="en">الإنجليزية (English)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="detail-level-select"
              className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
            >
              مستوى التفصيل
            </label>
            <select
              id="detail-level-select"
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value as 'concise' | 'balanced' | 'comprehensive')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
            >
              <option value="comprehensive">احترافي ومفصّل شامل</option>
              <option value="balanced">متوسط ومتوازن</option>
              <option value="concise">مختصر ومباشر</option>
            </select>
          </div>
        </div>

        {/* Optional Constraints */}
        <div>
          <label
            htmlFor="constraints-input"
            className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2"
          >
            قيود أو متطلبات خاصة (اختياري)
          </label>
          <input
            id="constraints-input"
            type="text"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="مثال: لا يتجاوز 1000 كلمة، استخدم جداول مقارنة، تجنب المكتبات الخارجية..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#035dcd]"
          />
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>إنشاء البرومبت</span>
          </button>

          <button
            type="button"
            onClick={handleRegenerateVariation}
            className="px-4 py-3 rounded-xl bg-white dark:bg-[#252a54] hover:bg-gray-100 dark:hover:bg-[#2d3363] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-[#2f366b] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4 text-[#035dcd]" />
            <span>إعادة الإنشاء بصياغة بديلة</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-xl bg-white dark:bg-[#252a54] hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-600 dark:text-gray-300 hover:text-red-600 border border-gray-200 dark:border-[#2f366b] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap mr-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>مسح المدخلات والبدء من جديد</span>
          </button>
        </div>
      </form>

      {/* Output Box */}
      {generatedPrompt && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#2f366b] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              البرومبت النهائي المنظم (قابل للتعديل والنسخ المباشر)
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ البرومبت!' : 'نسخ البرومبت'}</span>
            </button>
          </div>

          <textarea
            rows={12}
            value={generatedPrompt}
            onChange={(e) => setGeneratedPrompt(e.target.value)}
            aria-label="نص البرومبت الناتج"
            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed focus:outline-none focus:border-[#035dcd]"
          />

          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="w-4 h-4 text-[#035dcd] shrink-0 mt-0.5" />
            <span>
              توضيح: يقوم هذا المولّد بهيكلة وصياغة نص البرومبت محلياً وفق قواعد هندسة الأوامر لتنسخه وتستخدمه بنفسك داخل ChatGPT أو Gemini أو Claude، ولا يدّعي تشغيل نموذج ذكاء اصطناعي خارجي.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
