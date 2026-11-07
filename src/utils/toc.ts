/**
 * Semantic SEO Table of Contents (TOC) & Anchor ID Generator
 *
 * Implements the 12-step deterministic algorithm:
 * 1. Read original heading text without modifying it in the DOM.
 * 2. Strip Arabic diacritics (tashkeel) and tatweel.
 * 3. Convert English characters to lowercase.
 * 4. Translate Arabic headings into concise semantic English slugs via a fixed dictionary.
 * 5. Convert spaces to hyphens (-).
 * 6. Strip unnecessary punctuation and symbols.
 * 7. Preserve meaningful numbers.
 * 8. Collapse duplicate hyphens and trim leading/trailing hyphens; prevent keyword stuffing.
 * 9. Verify uniqueness across the entire page.
 * 10. Append sequential suffixes (-2, -3, ...) when duplicate headings occur.
 * 11. Use fallback IDs (section-1, section-2, ...) when semantic conversion is not possible.
 * 12. Persist and reuse generated IDs per article so anchors remain stable after reload/update.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: 'h2' | 'h3';
  parentId?: string;
}

export interface TocTreeNode extends TocHeading {
  children: TocHeading[];
}

const TOC_STORAGE_PREFIX = 'seo_toc_anchors_v1_';
const memoryAnchorCache = new Map<string, Record<string, string>>();

/**
 * Exact normalized Arabicheading -> Semantic English Anchor ID map.
 * Includes all official benchmark examples and common blog section titles.
 */
const EXACT_HEADING_DICTIONARY: Record<string, string> = {
  'مقدمه المقال': 'introduction',
  'مقدمه': 'introduction',
  'المقدمه': 'introduction',
  'تمهيد': 'introduction',
  'ما هو الذكاء الاصطناعي': 'what-is-ai',
  'ما هي تقنيه الذكاء الاصطناعي': 'what-is-ai',
  'كيف يعمل الذكاء الاصطناعي': 'how-ai-works',
  'اليه عمل الذكاء الاصطناعي': 'how-ai-works',
  'مميزات الذكاء الاصطناعي': 'ai-benefits',
  'مزايا الذكاء الاصطناعي': 'ai-benefits',
  'فوائد الذكاء الاصطناعي': 'ai-benefits',
  'عيوب الذكاء الاصطناعي': 'ai-disadvantages',
  'سلبيات الذكاء الاصطناعي': 'ai-disadvantages',
  'مخاطر الذكاء الاصطناعي': 'ai-disadvantages',
  'افضل ادوات الذكاء الاصطناعي': 'best-ai-tools',
  'اهم ادوات الذكاء الاصطناعي': 'best-ai-tools',
  'الاسئله الشائعه': 'frequently-asked-questions',
  'اسئله شائعه': 'frequently-asked-questions',
  'الاسئله المتداوله': 'frequently-asked-questions',
  'الخلاصه': 'conclusion',
  'خلاصه المقال': 'conclusion',
  'الخاتمه': 'conclusion',
  'خاتمه': 'conclusion',
  'خاتمه المقال': 'conclusion',
  'اقرا ايضا': 'related-articles',
  'مقالات ذات صله': 'related-articles',
  'مقارنه سريعه': 'quick-comparison',
  'خطوات التثبيت الامن': 'safe-installation-steps',
  'نصائح لتوفير المال': 'money-saving-tips',
  'طرق الدفع في السعوديه': 'saudi-payment-methods',
  'السعر الشهري في السعوديه': 'monthly-price-saudi',
  'الكلمات المفتاحيه المقترحه': 'suggested-keywords',
};

/**
 * Multi-word Arabic phrases replaced in order (longest/most specific first).
 */
const PHRASE_DICTIONARY: Array<[string, string]> = [
  ['الاسئله الشائعه حول', 'faq'],
  ['الاسئله المتداوله حول', 'faq'],
  ['الاسئله الشائعه', 'frequently-asked-questions'],
  ['اسئله شائعه', 'frequently-asked-questions'],
  ['الذكاء الاصطناعي', 'ai'],
  ['جوجل ادسنس', 'google-adsense'],
  ['جوجل جيميني', 'google-gemini'],
  ['شات جي بي تي', 'chatgpt'],
  ['جي بي تي', 'gpt'],
  ['ببجي موبايل', 'pubg-mobile'],
  ['القران الكريم', 'holy-quran'],
  ['المصحف الشريف', 'holy-quran'],
  ['التجاره الالكترونيه', 'ecommerce'],
  ['التسويق الالكتروني', 'digital-marketing'],
  ['التسويق الرقمي', 'digital-marketing'],
  ['التمويل الشخصي', 'personal-finance'],
  ['الخدمات الماليه', 'financial-services'],
  ['الخدمات القانونيه', 'legal-services'],
  ['العنايه الشخصيه', 'personal-care'],
  ['العمل الحر', 'freelancing'],
  ['كسب المال', 'make-money'],
  ['ربح المال', 'make-money'],
  ['جني المال', 'make-money'],
  ['جني الاموال', 'make-money'],
  ['تحقيق الدخل', 'monetization'],
  ['تحقيق الارباح', 'monetization'],
  ['سكربت التفاحه', 'apple-script'],
  ['هكر التفاحه', 'apple-script'],
  ['اسرار التفاحه', 'apple-secrets'],
  ['كشف اماكن', 'radar'],
  ['بدون انترنت', 'offline'],
  ['بدون نت', 'offline'],
  ['بدون جلبريك', 'no-jailbreak'],
  ['بدون جلربيك', 'no-jailbreak'],
  ['بدون باند', 'anti-ban'],
  ['شحن الالعاب', 'game-recharge'],
  ['انشاء حساب', 'create-account'],
  ['تسجيل الدخول', 'login'],
  ['الدعم الفني', 'technical-support'],
  ['دعم العملاء', 'customer-support'],
  ['البوابات التعليميه', 'educational-portals'],
  ['ايميل تعليمي', 'edu-email'],
  ['الايميل التعليمي', 'edu-email'],
  ['الابحاث العلميه', 'scientific-research'],
  ['نماذج امتحانات', 'exam-models'],
  ['طرق الدفع', 'payment-methods'],
  ['خطوات التثبيت', 'installation-steps'],
  ['ما هو', 'what-is'],
  ['ماهو', 'what-is'],
  ['ما هي', 'what-is'],
  ['ماهي', 'what-is'],
  ['ما الذي', 'what'],
  ['ما المقصود', 'meaning-of'],
  ['كيف يعمل', 'how-works'],
  ['كيف تحصل', 'how-to-get'],
  ['كيف تختار', 'how-to-choose'],
  ['كيف تزيد', 'how-to-increase'],
  ['كيف تبدا', 'how-to-start'],
  ['كيف يمكنني', 'how-to'],
  ['كيف يمكن', 'how-to'],
  ['كيفيه استخدام', 'how-to-use'],
  ['طريقه استخدام', 'how-to-use'],
  ['كيفيه تحميل', 'how-to-download'],
  ['طريقه تحميل', 'how-to-download'],
  ['كيفيه تنزيل', 'how-to-download'],
  ['خطوات تنزيل', 'download-steps'],
  ['كيفيه تفعيل', 'how-to-activate'],
  ['طريقه تفعيل', 'how-to-activate'],
  ['خطوات تفعيل', 'activation-steps'],
  ['كيفيه كتابه', 'how-to-write'],
  ['رابط تحميل', 'download-link'],
  ['افضل ادوات', 'best-tools'],
  ['افضل تطبيقات', 'best-apps'],
  ['افضل مواقع', 'best-sites'],
  ['افضل طرق', 'best-ways'],
  ['افضل انواع', 'best-types'],
  ['افضل افكار', 'best-ideas'],
  ['مزايا وعيوب', 'pros-and-cons'],
  ['ايجابيات وسلبيات', 'pros-and-cons'],
  ['الخطوه الاولي', 'step-1'],
  ['الخطوه الثانيه', 'step-2'],
  ['الخطوه الثالثه', 'step-3'],
  ['الخطوه الرابعه', 'step-4'],
  ['الخطوه الخامسه', 'step-5'],
];

/**
 * Single Arabic word (normalized without diacritics, tatweel, or leading ال) -> English token.
 */
const WORD_DICTIONARY: Record<string, string> = {
  مقدمه: 'introduction',
  خلاصه: 'conclusion',
  خاتمه: 'conclusion',
  ما: 'what',
  ماذا: 'what',
  لماذا: 'why',
  كيف: 'how',
  كيفيه: 'how-to',
  طريقه: 'method',
  طرق: 'methods',
  خطوات: 'steps',
  خطوه: 'step',
  مميزات: 'benefits',
  مزايا: 'benefits',
  فوائد: 'benefits',
  ميزات: 'features',
  قدرات: 'capabilities',
  خصائص: 'features',
  عيوب: 'disadvantages',
  سلبيات: 'disadvantages',
  ايجابيات: 'pros',
  مخاطر: 'risks',
  افضل: 'best',
  اهم: 'top',
  اشهر: 'popular',
  احدث: 'latest',
  ادوات: 'tools',
  اداه: 'tool',
  تطبيقات: 'apps',
  تطبيق: 'app',
  برامج: 'software',
  برنامج: 'program',
  مواقع: 'sites',
  موقع: 'site',
  منصه: 'platform',
  منصات: 'platforms',
  متجر: 'store',
  العاب: 'games',
  لعبه: 'game',
  ببجي: 'pubg',
  موبايل: 'mobile',
  هاتف: 'phone',
  هاتفك: 'phone',
  هاتفي: 'phone',
  جوال: 'mobile',
  اندرويد: 'android',
  ايفون: 'iphone',
  كمبيوتر: 'pc',
  حاسوب: 'pc',
  محاكي: 'emulator',
  تحميل: 'download',
  تنزيل: 'download',
  تثبيت: 'install',
  تفعيل: 'activation',
  تشغيل: 'run',
  استخدام: 'usage',
  التسجيل: 'registration',
  تسجيل: 'register',
  اشتراك: 'subscription',
  سعر: 'price',
  اسعار: 'prices',
  شهري: 'monthly',
  سنوي: 'annual',
  مجانا: 'free',
  مجاني: 'free',
  مجانيه: 'free',
  مباشر: 'direct',
  رابط: 'link',
  روابط: 'links',
  ملف: 'file',
  ملفات: 'files',
  سكربت: 'script',
  هكر: 'hack',
  هاك: 'hack',
  ثريدز: 'threads',
  انستغرام: 'instagram',
  بنترست: 'pinterest',
  تليجرام: 'telegram',
  تيليجرام: 'telegram',
  فيسبوك: 'facebook',
  يوتيوب: 'youtube',
  امازون: 'amazon',
  ادسنس: 'adsense',
  جوجل: 'google',
  بينج: 'bing',
  دردشه: 'chat',
  روبوت: 'bot',
  روبوتات: 'robotics',
  طلاب: 'students',
  طالب: 'student',
  تعليم: 'education',
  تعليمي: 'educational',
  مذاكره: 'study',
  امتحانات: 'exams',
  كتب: 'books',
  مقالات: 'articles',
  مقال: 'article',
  محتوي: 'content',
  كلمات: 'keywords',
  مفتاحيه: 'keywords',
  سيو: 'seo',
  ربح: 'earning',
  ارباح: 'earnings',
  ارباحا: 'earnings',
  مربح: 'profitable',
  مربحا: 'profitable',
  مال: 'money',
  اموال: 'money',
  بيع: 'selling',
  شراء: 'buying',
  تجاره: 'commerce',
  تسويق: 'marketing',
  اعلانات: 'ads',
  اعلاني: 'ad',
  عائد: 'revenue',
  عائدا: 'revenue',
  استثمار: 'investment',
  اسهم: 'stocks',
  عقارات: 'real-estate',
  عقاري: 'real-estate',
  صحه: 'health',
  جمال: 'beauty',
  تقنيه: 'tech',
  تقني: 'tech',
  برمجيات: 'software',
  رقميه: 'digital',
  رقمي: 'digital',
  وظائف: 'jobs',
  عمل: 'work',
  مهندس: 'engineer',
  مدير: 'manager',
  مصمم: 'designer',
  خبير: 'expert',
  تحليل: 'analysis',
  بياني: 'data',
  طيران: 'aviation',
  طاقه: 'energy',
  جرافيك: 'graphic',
  صور: 'images',
  صوره: 'image',
  فيديو: 'video',
  فيديوهات: 'videos',
  مقاطع: 'clips',
  مقطع: 'clip',
  شدات: 'uc',
  بطولات: 'tournaments',
  تحديات: 'challenges',
  مدونه: 'blog',
  انشاء: 'create',
  تصميم: 'design',
  كتابه: 'writing',
  وصف: 'description',
  منتجات: 'products',
  عملاء: 'clients',
  ترويج: 'promotion',
  شراكه: 'affiliate',
  افيليت: 'affiliate',
  مستعمل: 'used',
  سعوديه: 'saudi',
  قطر: 'qatar',
  كويت: 'kuwait',
  ليبيا: 'libya',
  عربيه: 'arab',
  عالم: 'world',
  انترنت: 'internet',
  شبكه: 'network',
  سرعه: 'speed',
  امان: 'security',
  امن: 'safe',
  حمايه: 'protection',
  حساب: 'account',
  حسابك: 'account',
  ايداع: 'deposit',
  شروط: 'requirements',
  متطلبات: 'requirements',
  عوامل: 'factors',
  انواع: 'types',
  مجالات: 'niches',
  مجال: 'niche',
  افكار: 'ideas',
  نصائح: 'tips',
  تنبيه: 'warning',
  تنبيهات: 'warnings',
  احذر: 'warning',
  مشكله: 'problem',
  حل: 'solution',
  فرق: 'difference',
  مقارنه: 'comparison',
  مراجعه: 'review',
  شرح: 'guide',
  دليل: 'guide',
  دليلك: 'guide',
  خطه: 'plan',
  عمليه: 'practical',
  عملي: 'practical',
  تحديث: 'update',
  جديد: 'new',
  سريع: 'fast',
  سريعه: 'quick',
  شامل: 'complete',
  كامل: 'full',
  توفير: 'saving',
  وقت: 'time',
  جهد: 'effort',
  تخصيص: 'customization',
  تطوير: 'development',
  كفاءه: 'efficiency',
  حوار: 'conversation',
  تفاعل: 'interaction',
  اساسيه: 'basic',
  رسمي: 'official',
  قانوني: 'legal',
  قبول: 'approval',
  زيارات: 'traffic',
  اختيار: 'choosing',
  بدائل: 'alternatives',
  سياحه: 'tourism',
  سفر: 'travel',
  فنادق: 'hotels',
  مواصلات: 'transport',
  اماكن: 'places',
  صيانه: 'maintenance',
  بطاريه: 'battery',
  سكوتر: 'scooter',
  شاحن: 'charger',
  باور: 'power',
  بانك: 'bank',
  اشاره: 'signal',
  حظر: 'ban',
  باند: 'ban',
  فك: 'unban',
  اسباب: 'reasons',
  قران: 'quran',
  مصحف: 'quran',
  اوفلاين: 'offline',
  مسلم: 'muslim',
  اسئله: 'questions',
  سؤال: 'question',
  شائعه: 'faq',
  متداوله: 'faq',
  اولا: 'first',
  ثانيا: 'second',
  ثالثا: 'third',
  رابعا: 'fourth',
  خامسا: 'fifth',
};

/**
 * Arabic stop words ignored during word-by-word slug generation
 * to keep Anchor IDs concise and free of filler words.
 */
const ARABIC_STOP_WORDS = new Set([
  'في',
  'من',
  'الي',
  'على',
  'علي',
  'عن',
  'مع',
  'ان',
  'إن',
  'أن',
  'هل',
  'او',
  'أو',
  'ام',
  'أم',
  'ثم',
  'بل',
  'لا',
  'لم',
  'لن',
  'قد',
  'كل',
  'بعض',
  'اي',
  'أي',
  'هذا',
  'هذه',
  'ذلك',
  'تلك',
  'الذي',
  'التي',
  'الذين',
  'اللذان',
  'اللتان',
  'هو',
  'هي',
  'هم',
  'نحن',
  'انت',
  'أنت',
  'انا',
  'أنا',
  'كان',
  'كانت',
  'يكون',
  'تكون',
  'صار',
  'اصبح',
  'أصبح',
  'ليس',
  'ليست',
  'بين',
  'حول',
  'خلال',
  'بعد',
  'قبل',
  'عند',
  'فوق',
  'تحت',
  'امام',
  'أمام',
  'خلف',
  'ضد',
  'نحو',
  'لدى',
  'لدي',
  'عبر',
  'بشكل',
  'بطريقه',
  'اكثر',
  'أكثر',
  'اقل',
  'أقل',
  'جدا',
  'فعلا',
  'فقط',
  'ايضا',
  'أيضا',
  'لك',
  'لها',
  'له',
  'لهم',
  'بها',
  'به',
  'فيها',
  'فيه',
  'منها',
  'منه',
  'عليها',
  'عليه',
]);

/**
 * Step 2: Strip Arabic diacritics (tashkeel), tatweel, and normalize Arabic characters for matching.
 */
export function normalizeArabicText(raw: string): string {
  return raw
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, ' and ')
    .replace(/&quot;/gi, ' ')
    .replace(/&#39;/gi, ' ')
    // Remove Arabic tashkeel / diacritics and tatweel
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    // Normalize Alef variants
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Teh Marbuta to Heh
    .replace(/ة/g, 'ه')
    // Normalize Alef Maksura to Yeh
    .replace(/ى/g, 'ي')
    // Convert Arabic-Indic digits (٠-٩) to standard ASCII digits (0-9)
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .toLowerCase()
    .replace(/[^\u0621-\u064Aa-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if an existing HTML id attribute is already a valid semantic English ID
 * (and not an auto-generated placeholder like `toc-h2-0` or `modal-toc-h2-1`).
 */
export function isValidPublishedSemanticId(id: string | null | undefined): boolean {
  if (!id) return false;
  const trimmed = id.trim();
  if (!trimmed) return false;
  if (/^(modal-)?toc-h[23]-\d+$/i.test(trimmed)) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed);
}

/**
 * Generates a semantic base English slug from a heading's text (Steps 1–8).
 * Returns empty string if no semantic representation can be derived (triggering `section-N` fallback).
 */
export function generateSemanticBaseSlug(headingText: string): string {
  if (!headingText || !headingText.trim()) return '';

  const normalized = normalizeArabicText(headingText);
  if (!normalized) return '';

  // Strip leading list numbering (e.g., "1. ما هو..." or "1- ...") for exact dictionary lookup
  const withoutLeadingNumber = normalized.replace(/^\d+\s*[-.)]*\s*/, '').trim();

  // 1. Check exact full-heading dictionary first
  if (EXACT_HEADING_DICTIONARY[withoutLeadingNumber]) {
    return EXACT_HEADING_DICTIONARY[withoutLeadingNumber];
  }
  if (EXACT_HEADING_DICTIONARY[normalized]) {
    return EXACT_HEADING_DICTIONARY[normalized];
  }

  // 2. Apply multi-word phrase replacements
  let working = ` ${withoutLeadingNumber || normalized} `;
  for (const [arabicPhrase, englishSlug] of PHRASE_DICTIONARY) {
    if (working.includes(` ${arabicPhrase} `)) {
      working = working.split(` ${arabicPhrase} `).join(` ${englishSlug} `);
    } else if (working.includes(arabicPhrase)) {
      working = working.split(arabicPhrase).join(` ${englishSlug} `);
    }
  }

  // 3. Tokenize and translate remaining words
  const rawTokens = working.trim().split(/[\s-]+/).filter(Boolean);
  const englishTokens: string[] = [];

  for (const token of rawTokens) {
    // Already ASCII English word or number
    if (/^[a-z0-9]+$/.test(token)) {
      englishTokens.push(token);
      continue;
    }

    if (ARABIC_STOP_WORDS.has(token)) {
      continue;
    }

    // Direct word lookup
    if (WORD_DICTIONARY[token]) {
      englishTokens.push(...WORD_DICTIONARY[token].split('-'));
      continue;
    }

    // Strip common prefixes: و (and), ف, ب, ل, ك, ال (the)
    const strippedAl = token.replace(/^(?:و|ف|ب|ل|ك)?(?:ال)?/, '');
    if (strippedAl && ARABIC_STOP_WORDS.has(strippedAl)) {
      continue;
    }
    if (strippedAl && WORD_DICTIONARY[strippedAl]) {
      englishTokens.push(...WORD_DICTIONARY[strippedAl].split('-'));
      continue;
    }

    // Strip common suffixes (ها, هم, كم, نا, ات, ين, ون, ان, ي, ك, ه)
    const strippedSuffix = (strippedAl || token).replace(/(?:ها|هم|كم|نا|ات|ين|ون|ان|يه|ه|ك|ي)$/, '');
    if (strippedSuffix && WORD_DICTIONARY[strippedSuffix]) {
      englishTokens.push(...WORD_DICTIONARY[strippedSuffix].split('-'));
      continue;
    }
    if (strippedSuffix && WORD_DICTIONARY[strippedSuffix + 'ه']) {
      englishTokens.push(...WORD_DICTIONARY[strippedSuffix + 'ه'].split('-'));
      continue;
    }
  }

  // If leading list number was stripped and we ended up with no semantic tokens, check if original had a number
  if (englishTokens.length === 0) {
    const leadingNumMatch = normalized.match(/^(\d+)/);
    if (leadingNumMatch) {
      return `section-${leadingNumMatch[1]}`;
    }
    return '';
  }

  // Step 8: Deduplicate repeated keywords to prevent keyword stuffing while keeping order
  const deduplicated: string[] = [];
  const seenWords = new Set<string>();
  for (const part of englishTokens) {
    const cleanPart = part.replace(/[^a-z0-9]/g, '');
    if (!cleanPart) continue;
    // Allow numbers or non-duplicate semantic tokens
    if (/^\d+$/.test(cleanPart) || !seenWords.has(cleanPart)) {
      deduplicated.push(cleanPart);
      seenWords.add(cleanPart);
    }
  }

  // If the slug is only a bare number (e.g. "1"), prefix with "section-" so it is valid and descriptive
  if (deduplicated.length === 1 && /^\d+$/.test(deduplicated[0])) {
    return `section-${deduplicated[0]}`;
  }

  // Cap slug to 6 meaningful tokens for clean SEO URLs
  const finalSlug = deduplicated
    .slice(0, 6)
    .join('-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return finalSlug;
}

/**
 * Loads persisted anchor ID map for a specific article so IDs remain 100% stable across reloads/updates.
 */
function loadArticleAnchorCache(articleKey: string): Record<string, string> {
  if (!articleKey) return {};
  if (memoryAnchorCache.has(articleKey)) {
    return memoryAnchorCache.get(articleKey)!;
  }
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(`${TOC_STORAGE_PREFIX}${articleKey}`);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>;
        if (parsed && typeof parsed === 'object') {
          memoryAnchorCache.set(articleKey, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }
  const empty: Record<string, string> = {};
  memoryAnchorCache.set(articleKey, empty);
  return empty;
}

function saveArticleAnchorCache(articleKey: string, map: Record<string, string>): void {
  if (!articleKey) return;
  memoryAnchorCache.set(articleKey, map);
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      window.localStorage.setItem(`${TOC_STORAGE_PREFIX}${articleKey}`, JSON.stringify(map));
    } catch {
      // Ignore storage quota errors
    }
  }
}

/**
 * Ensures uniqueness on the page (Steps 9–11):
 * - First occurrence of `ai-benefits` -> `ai-benefits`
 * - Second occurrence -> `ai-benefits-2`
 * - Third occurrence -> `ai-benefits-3`
 */
export function resolveUniqueAnchorId(
  baseSlug: string,
  usedIds: Set<string>,
  fallbackCounterRef: { count: number }
): string {
  let candidateBase = baseSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!candidateBase) {
    fallbackCounterRef.count += 1;
    candidateBase = `section-${fallbackCounterRef.count}`;
    while (usedIds.has(candidateBase)) {
      fallbackCounterRef.count += 1;
      candidateBase = `section-${fallbackCounterRef.count}`;
    }
    usedIds.add(candidateBase);
    return candidateBase;
  }

  if (!usedIds.has(candidateBase)) {
    usedIds.add(candidateBase);
    return candidateBase;
  }

  let suffix = 2;
  while (usedIds.has(`${candidateBase}-${suffix}`)) {
    suffix += 1;
  }
  const uniqueId = `${candidateBase}-${suffix}`;
  usedIds.add(uniqueId);
  return uniqueId;
}

/**
 * Builds a hierarchical tree where H3 headings are nested as children under their preceding H2 heading.
 * Any H3 appearing before the first H2 is kept at top level in exact document order.
 */
export function buildTocHierarchy(headings: TocHeading[]): TocTreeNode[] {
  const tree: TocTreeNode[] = [];
  let currentH2: TocTreeNode | null = null;

  for (const heading of headings) {
    if (heading.level === 'h2') {
      currentH2 = {
        ...heading,
        children: [],
      };
      tree.push(currentH2);
    } else {
      if (currentH2) {
        currentH2.children.push({
          ...heading,
          parentId: currentH2.id,
        });
      } else {
        tree.push({
          ...heading,
          children: [],
        });
      }
    }
  }

  return tree;
}

/**
 * Extracts H2 and H3 headings from HTML or structured sections, injects unique semantic English IDs
 * and `scroll-mt-24` into the HTML headings without altering heading text, and returns the
 * processed HTML, flat ordered headings, and hierarchical H2->H3 tree.
 */
export function processArticleContentAndToc(
  rawHtml: string,
  sectionsFallback?: Array<{ id?: string; title: string }>,
  articleKey = 'default',
  optimizeImageUrl?: (url: string, width: number, quality: number) => string
): {
  processedHtml: string;
  tocHeadings: TocHeading[];
  tocTree: TocTreeNode[];
} {
  const cachedMap = { ...loadArticleAnchorCache(articleKey) };
  let cacheUpdated = false;
  const usedIds = new Set<string>();
  const fallbackCounterRef = { count: 0 };

  // Case 1: Structured sections fallback when rawHtml is empty
  if (!rawHtml) {
    const headings: TocHeading[] = [];
    let currentParentId: string | undefined;

    if (sectionsFallback && sectionsFallback.length > 0) {
      sectionsFallback.forEach((sec, idx) => {
        const cleanText = (sec.title || '').replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return;

        const cacheKey = `sec:${idx}:${normalizeArabicText(cleanText)}`;
        let finalId: string;

        if (isValidPublishedSemanticId(sec.id) && !usedIds.has(sec.id!.trim())) {
          finalId = sec.id!.trim();
          usedIds.add(finalId);
        } else if (cachedMap[cacheKey] && !usedIds.has(cachedMap[cacheKey])) {
          finalId = cachedMap[cacheKey];
          usedIds.add(finalId);
        } else {
          const baseSlug = generateSemanticBaseSlug(cleanText);
          finalId = resolveUniqueAnchorId(baseSlug, usedIds, fallbackCounterRef);
          cachedMap[cacheKey] = finalId;
          cacheUpdated = true;
        }

        currentParentId = finalId;
        headings.push({
          id: finalId,
          text: cleanText,
          level: 'h2',
          parentId: currentParentId,
        });
      });
    }

    if (cacheUpdated) {
      saveArticleAnchorCache(articleKey, cachedMap);
    }

    return {
      processedHtml: '',
      tocHeadings: headings,
      tocTree: buildTocHierarchy(headings),
    };
  }

  // Case 2: Browser DOMParser for 100% accurate HTML parsing & attribute injection
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // Remove legacy hardcoded AdSense scripts/ins inside rawContent
      doc.querySelectorAll('ins.adsbygoogle, script').forEach((el) => el.remove());

      // Collect any non-heading existing IDs in the document so we never collide with them
      doc.querySelectorAll('[id]:not(h2):not(h3)').forEach((el) => {
        const existing = el.getAttribute('id')?.trim().toLowerCase();
        if (existing) usedIds.add(existing);
      });

      // Enforce Lazy Loading, async decoding, and CLS-safe dimensions on all in-article images
      doc.querySelectorAll('img').forEach((img) => {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        if (!img.getAttribute('width')) img.setAttribute('width', '800');
        if (!img.getAttribute('height')) img.setAttribute('height', '450');
        const rawSrc = img.getAttribute('src');
        if (rawSrc && optimizeImageUrl && rawSrc.includes('images.unsplash.com')) {
          img.setAttribute('src', optimizeImageUrl(rawSrc, 900, 80));
        }
      });

      // Extract ONLY valid H2 and H3 elements in exact document order
      const headingElements = doc.querySelectorAll('h2, h3');
      const headings: TocHeading[] = [];
      let currentH2Id: string | undefined;

      headingElements.forEach((el, index) => {
        // Read original text without altering the heading's innerHTML/textContent
        const text = (el.textContent || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
        // Exclude empty or invalid headings (only punctuation/whitespace)
        if (!text || !/[\u0621-\u064Aa-zA-Z0-9\u0660-\u0669]/.test(text)) {
          return;
        }

        const level = el.tagName.toLowerCase() as 'h2' | 'h3';
        const existingId = el.getAttribute('id')?.trim();
        const cacheKey = `${level}:${index}:${normalizeArabicText(text)}`;

        let finalId: string;
        if (isValidPublishedSemanticId(existingId)) {
          finalId = resolveUniqueAnchorId(existingId!, usedIds, fallbackCounterRef);
        } else if (cachedMap[cacheKey] && isValidPublishedSemanticId(cachedMap[cacheKey])) {
          finalId = resolveUniqueAnchorId(cachedMap[cacheKey], usedIds, fallbackCounterRef);
        } else {
          const baseSlug = generateSemanticBaseSlug(text);
          finalId = resolveUniqueAnchorId(baseSlug, usedIds, fallbackCounterRef);
        }

        if (cachedMap[cacheKey] !== finalId) {
          cachedMap[cacheKey] = finalId;
          cacheUpdated = true;
        }

        el.setAttribute('id', finalId);
        el.classList.add('scroll-mt-24', 'transition-all', 'duration-300');

        if (level === 'h2') {
          currentH2Id = finalId;
        }

        headings.push({
          id: finalId,
          text,
          level,
          parentId: level === 'h3' ? currentH2Id : undefined,
        });
      });

      if (cacheUpdated) {
        saveArticleAnchorCache(articleKey, cachedMap);
      }

      const h2OnlyHeadings = headings.filter((h) => h.level === 'h2');

      return {
        processedHtml: doc.body.innerHTML,
        tocHeadings: h2OnlyHeadings,
        tocTree: buildTocHierarchy(h2OnlyHeadings),
      };
    } catch (err) {
      console.warn('DOMParser TOC extraction failed, falling back to regex:', err);
    }
  }

  // Case 3: SSR / Prerender regex fallback
  const headings: TocHeading[] = [];
  let index = 0;
  let currentH2Id: string | undefined;

  const processedHtml = rawHtml
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<ins\b[^>]*class=["'][^"']*adsbygoogle[^"']*["'][^>]*>[\s\S]*?<\/ins>/gi, '')
    .replace(/<img\b([^>]*)>/gi, (_match, attrs) => {
      let updated = attrs;
      if (!/\bloading\s*=/i.test(updated)) updated += ' loading="lazy"';
      if (!/\bdecoding\s*=/i.test(updated)) updated += ' decoding="async"';
      if (!/\bwidth\s*=/i.test(updated)) updated += ' width="800"';
      if (!/\bheight\s*=/i.test(updated)) updated += ' height="450"';
      return `<img${updated}>`;
    })
    .replace(/<(h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
      const level = tag.toLowerCase() as 'h2' | 'h3';
      const cleanText = inner
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText || !/[\u0621-\u064Aa-zA-Z0-9\u0660-\u0669]/.test(cleanText)) {
        return match;
      }

      const existingIdMatch = attrs.match(/\bid=["']([^"']+)["']/i);
      const existingId = existingIdMatch ? existingIdMatch[1].trim() : '';
      const currentIdx = index++;
      const cacheKey = `${level}:${currentIdx}:${normalizeArabicText(cleanText)}`;

      let finalId: string;
      if (isValidPublishedSemanticId(existingId)) {
        finalId = resolveUniqueAnchorId(existingId, usedIds, fallbackCounterRef);
      } else if (cachedMap[cacheKey] && isValidPublishedSemanticId(cachedMap[cacheKey])) {
        finalId = resolveUniqueAnchorId(cachedMap[cacheKey], usedIds, fallbackCounterRef);
      } else {
        const baseSlug = generateSemanticBaseSlug(cleanText);
        finalId = resolveUniqueAnchorId(baseSlug, usedIds, fallbackCounterRef);
      }

      cachedMap[cacheKey] = finalId;
      cacheUpdated = true;

      if (level === 'h2') {
        currentH2Id = finalId;
      }

      headings.push({
        id: finalId,
        text: cleanText,
        level,
        parentId: level === 'h3' ? currentH2Id : undefined,
      });

      let cleanAttrs = attrs;
      if (/\bid=["'][^"']*["']/i.test(cleanAttrs)) {
        cleanAttrs = cleanAttrs.replace(/\bid=["'][^"']*["']/i, `id="${finalId}"`);
      } else {
        cleanAttrs = ` id="${finalId}"${cleanAttrs}`;
      }

      if (/\bclass=["']([^"']*)["']/i.test(cleanAttrs)) {
        cleanAttrs = cleanAttrs.replace(
          /\bclass=["']([^"']*)["']/i,
          (_m: string, cls: string) => `class="${cls} scroll-mt-24 transition-all duration-300"`
        );
      } else {
        cleanAttrs += ' class="scroll-mt-24 transition-all duration-300"';
      }

      return `<${tag}${cleanAttrs}>${inner}</${tag}>`;
    });

  if (cacheUpdated) {
    saveArticleAnchorCache(articleKey, cachedMap);
  }

  const h2OnlyHeadings = headings.filter((h) => h.level === 'h2');

  return {
    processedHtml,
    tocHeadings: h2OnlyHeadings,
    tocTree: buildTocHierarchy(h2OnlyHeadings),
  };
}
