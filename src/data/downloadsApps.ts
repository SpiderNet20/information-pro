export interface AppScreenshot {
  url: string;
  caption: string;
}

export interface SimilarAppInfo {
  name: string;
  subtitle: string;
  rating: string;
  downloads: string;
  icon: string;
  slug?: string;
  externalUrl?: string;
}

export interface AppArticleSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subSections?: {
    subHeading: string;
    text: string;
  }[];
}

export interface AppFaqItem {
  question: string;
  answer: string;
}

export interface DownloadAppItem {
  id: string;
  slug: string;
  packageId: string;
  name: string;
  arabicName: string;
  h1Title: string;
  developer: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string[];
  features: string[];
  articleSections: AppArticleSection[];
  faqs: AppFaqItem[];
  category: string;
  breadcrumbCategory: string;
  categoryBadge: string;
  filterKey: 'games' | 'social' | 'system' | 'media' | 'entertainment' | 'education';
  rating: string;
  reviewsCountText: string;
  reviewsCountNumeric: number;
  downloads: string;
  ageRating: string;
  ageRatingLabel: string;
  version: string;
  size: string;
  updateDate: string;
  priceText: string;
  icon: string;
  googlePlayUrl: string;
  screenshots: AppScreenshot[];
  ratingBreakdown: {
    stars: number;
    label: string;
    percentage: number;
  }[];
  similarApps: SimilarAppInfo[];
  relatedPostSlug?: string;
  platform?: string;
}

export const DOWNLOAD_APPS: DownloadAppItem[] = [
  {
    id: 'app-pubg-mobile',
    slug: 'pubg-mobile',
    packageId: 'com.tencent.ig',
    name: 'PUBG MOBILE',
    arabicName: 'ببجي موبايل - PUBG MOBILE',
    h1Title: 'تحميل PUBG MOBILE للاندرويد والآيفون – ببجي موبايل',
    developer: 'Level Infinite',
    tagline: 'أفضل لعبة معركة ملكية للهاتف المحمول - اختيار أكثر من مليار لاعب',
    shortDescription:
      'لعبة المعركة الملكية الأصلية على الهاتف المحمول بمعارك ملحمية تضم 100 لاعب وخرائط متنوعة ورسومات واقعية فائقة الدقة.',
    fullDescription: [
      'اصعد إلى القمة، واجمع الأسلحة، وواجه المنافسين في معارك مليئة بالإثارة والتشويق! تُعد لعبة ببجي موبايل (PUBG MOBILE) واحدة من أشهر ألعاب الباتل رويال وإطلاق النار على الهواتف المحمولة، حيث تمنح اللاعبين تجربة تنافسية تجمع بين البقاء والاستراتيجية وسرعة رد الفعل.',
      'تتيح لك اللعبة الدخول إلى ساحة معركة واسعة تضم لاعبين آخرين، والبحث عن الأسلحة والمعدات والمركبات، ثم مواجهة المنافسين بهدف أن تكون آخر لاعب أو فريق صامد حتى نهاية المباراة. ويمكنك اللعب بمفردك أو التعاون مع أصدقائك لتكوين فريق والعمل معًا لتحقيق الفوز.',
      'تتميز PUBG MOBILE برسومات ثلاثية الأبعاد ومؤثرات صوتية واقعية وخرائط متنوعة، إلى جانب أوضاع لعب متعددة وعناصر تحكم قابلة للتخصيص، لتتمكن من ضبط طريقة اللعب بما يناسب أسلوبك وإمكانيات هاتفك.',
    ],
    features: [
      'معارك باتل رويال تنافسية تضم عددًا كبيرًا من اللاعبين في ساحة قتال واسعة',
      'خرائط متعددة بتضاريس وأجواء متنوعة (إيرانغل، ميرامار، سانهوك، فيكندي، وليفيك)',
      'ترسانة ضخمة من الأسلحة النارية والدروع والملحقات والمركبات البرية والبحرية الواقعية',
      'أوضاع لعب متنوعة تشمل الوضع الكلاسيكي، ومعارك الساحة 4 ضد 4، والأوضاع الترفيهية السريعة',
      'عناصر تحكم قابلة للتخصيص بالكامل مع وضع تدريب ودردشة صوتية فورية مع الفريق',
      'رسومات ثلاثية الأبعاد عالية الدقة ومؤثرات صوتية محيطية وتحديثات موسمية مستمرة',
    ],
    articleSections: [
      {
        heading: 'ما هي لعبة PUBG MOBILE؟',
        paragraphs: [
          'PUBG MOBILE هي لعبة إطلاق نار وبقاء تعتمد على أسلوب المعركة الملكية (Battle Royale). تبدأ المواجهة بالنزول إلى خريطة واسعة، ثم يتعين عليك البحث عن الأسلحة والذخيرة والدروع والأدوات التي تساعدك على الاستمرار في القتال.',
          'مع مرور الوقت، تضيق منطقة اللعب الآمنة، ما يدفع اللاعبين إلى التحرك والاشتباك مع بعضهم البعض. ويحتاج الفوز إلى الجمع بين التصويب الدقيق، واختيار موقع مناسب، وإدارة الموارد، واتخاذ القرارات الصحيحة في اللحظات الحاسمة.',
          'يمكنك اختيار اللعب الفردي أو الانضمام إلى فريق، والتواصل مع زملائك باستخدام الدردشة الصوتية أثناء المعركة. وتوفر اللعبة تحديثات وفعاليات ومحتوى متجددًا، مع اختلاف الأوضاع والخرائط المتاحة بحسب إصدار اللعبة والتحديثات الحالية.',
        ],
      },
      {
        heading: 'أبرز مميزات لعبة ببجي موبايل',
        bullets: [
          'معارك باتل رويال تنافسية تضم عددًا كبيرًا من اللاعبين في مواجهة حماسية للبقاء حتى النهاية.',
          'تنوع كبير في الخرائط والمناطق القتالية، حيث تختلف كل خريطة في المساحة والتضاريس والطقس وأسلوب المواجهات.',
          'مجموعة واسعة من الأسلحة النارية مثل البنادق الهجومية وبنادق القنص والرشاشات والمسدسات، مع إمكانية إضافة المناظير والملحقات لتحسين الأداء.',
          'توفير مركبات متنوعة برية وبحرية تتيح التنقل السريع داخل الخريطة والوصول إلى المنطقة الآمنة أو الهروب من الكمائن.',
          'أوضاع لعب متعددة تناسب جميع الأذواق، سواء كنت تفضل المباريات الطويلة التكتيكية أو المواجهات السريعة المباشرة.',
          'إمكانية تخصيص أزرار التحكم وحساسية التصويب والكاميرا بحرية تامة لتناسب حجم شاشة هاتفك وطريقة لعبك.',
          'نظام لعب جماعي متكامل يدعم تكوين الفرق (ثنائي أو رباعي) مع ميزة الدردشة الصوتية الفورية وتحديد المواقع للفريق.',
          'رسومات ثلاثية الأبعاد متقنة ومؤثرات صوتية واقعية تساعد اللاعب على سماع خطوات الأعداء وتحديد اتجاه إطلاق النار بدقة.',
        ],
      },
      {
        heading: 'أوضاع اللعب والخرائط في PUBG MOBILE',
        paragraphs: [
          'تقدم لعبة ببجي موبايل تجربة متنوعة لا تقتصر على نمط واحد، بل تشمل عدة أوضاع وخرائط تمنح اللاعب خيارات متجددة في كل مباراة:',
        ],
        subSections: [
          {
            subHeading: '1. الوضع الكلاسيكي (Classic Mode)',
            text: 'الوضع الأساسي في اللعبة، حيث يهبط اللاعبون بالمظلات على إحدى الخرائط الكبرى أو المتوسطة مثل إيرانغل (Erangel) أو ميرامار (Miramar) أو سانهوك (Sanhok) أو فيكندي (Vikendi) أو ليفيك (Livik)، ويبحثون عن العتاد والأسلحة للبقاء على قيد الحياة حتى الفوز بالمباراة.',
          },
          {
            subHeading: '2. معارك الساحة (Arena 4v4)',
            text: 'مواجهات سريعة ومباشرة بين فريقين يتكون كل منهما من 4 لاعبين في خرائط صغيرة مخصصة للاشتباك القريب، مع إعادة ظهور مستمرة، وهو وضع مثالي لتطوير سرعة التصويب ورد الفعل.',
          },
          {
            subHeading: '3. الأوضاع الخاصة والفعاليات الموسمية',
            text: 'تضيف اللعبة مع كل تحديث موسمي فعاليات خاصة وأوضاعًا إضافية مثل وضع الحمولة (Payload) وأوضاع الترفيه السريعة التي تقدم قدرات وأدوات جديدة تضفي مزيدًا من الحماس.',
          },
        ],
      },
      {
        heading: 'نصائح مهمة للمبتدئين والاحتراف في ببجي موبايل',
        bullets: [
          'اختر نقطة هبوط مناسبة في بداية المباراة؛ إذا كنت مبتدئًا، يُفضل النزول في مناطق متوسطة الازدحام لجمع الأسلحة والدروع بهدوء قبل الدخول في الاشتباكات.',
          'احرص على حمل توازن جيد في حقيبتك بين الذخيرة، وأدوات العلاج والضمادات، والقنابل اليدوية والدخانية التي تساعدك في التغطية أثناء التحرك.',
          'راقب خريطة اللعبة المصغرة والوقت المتبقي لتقلص المنطقة الآمنة (الزون) باستمرار حتى لا تتعرض لفقدان الصحة خارج الدائرة.',
          'استخدم وضع التدريب (Training Grounds) لضبط إعدادات الحساسية (Sensitivity) وتجربة ارتداد الأسلحة المختلفة قبل خوض المباريات المصنفة.',
          'عند اللعب ضمن فريق، ابقَ قريبًا من زملائك وشاركهم الموارد والمعلومات عبر الإشارات السريعة أو الدردشة الصوتية.',
        ],
      },
      {
        heading: 'متطلبات التشغيل وملاحظات التحميل',
        paragraphs: [
          'تعمل لعبة PUBG MOBILE على معظم الهواتف الذكية الحديثة بنظامي أندرويد و iOS، وتوفر داخل إعداداتها خيارات متعددة لجودة الرسومات ومعدل الإطارات، مما يسمح بتشغيلها بسلاسة على الهواتف المتوسطة والقوية على حدٍ سواء.',
          'للحصول على أفضل أداء، يُنصح بتوفير مساحة تخزين خالية كافية على الهاتف لتحميل ملفات اللعبة الأساسية وحزم الخرائط الإضافية، إلى جانب استخدام اتصال إنترنت مستقر لتقليل زمن الاستجابة (Ping) أثناء المباريات الجماعية.',
        ],
      },
      {
        heading: 'طريقة تحميل وتثبيت PUBG MOBILE للاندرويد والآيفون',
        bullets: [
          'اضغط على زر "تحميل الآن" الموجود في أعلى هذه الصفحة للانتقال مباشرة إلى صفحة اللعبة الرسمية والمعتمدة على متجر Google Play.',
          'تأكد من وجود مساحة تخزينية كافية على هاتفك واتصال مستقر بشبكة الواي فاي (Wi-Fi) لتنزيل ملفات اللعبة بسرعة وأمان.',
          'بعد اكتمال التثبيت من المتجر الرسمي، افتح اللعبة وقم بتسجيل الدخول وتنزيل حزم الموارد المناسبة لجهازك، ثم ابدأ اللعب فورًا.',
        ],
      },
    ],
    faqs: [
      {
        question: 'هل تحميل لعبة PUBG MOBILE مجاني؟',
        answer:
          'نعم، اللعبة متاحة للتحميل واللعب مجانًا بالكامل على هواتف أندرويد والآيفون عبر المتاجر الرسمية، مع وجود عناصر تجميلية اختيارية للشراء داخل التطبيق.',
      },
      {
        question: 'هل تحتاج لعبة ببجي موبايل إلى اتصال بالإنترنت؟',
        answer:
          'نعم، تتطلب PUBG MOBILE اتصالًا مستمرًا بالإنترنت لأن جميع مبارياتها تعتمد على اللعب الجماعي المباشر عبر الإنترنت مع لاعبين حقيقيين.',
      },
      {
        question: 'كيف يمكنني تشغيل اللعبة بسلاسة على الهواتف المتوسطة؟',
        answer:
          'يمكنك الدخول إلى إعدادات الرسومات داخل اللعبة واختيار جودة "سلسة" (Smooth) مع رفع معدل الإطارات، وعدم تحميل حزم الموارد الاختيارية غير الضرورية لتوفير المساحة والذاكرة.',
      },
    ],
    category: 'ألعاب',
    breadcrumbCategory: 'ألعاب أكشن ومعركة ملكية',
    categoryBadge: 'ألعاب المعركة الملكية',
    filterKey: 'games',
    rating: '4.6',
    reviewsCountText: '48.7 مليون مراجعة',
    reviewsCountNumeric: 48691485,
    downloads: '+1B',
    ageRating: '16+',
    ageRatingLabel: 'مناسب لعمر 16 فما فوق',
    version: '3.7.0',
    size: '890 MB',
    updateDate: '2026-03-15',
    priceText: 'مجاني · يتضمن عمليات شراء داخل التطبيق',
    icon: 'https://play-lh.googleusercontent.com/Se7jR6A5R0Mk9ClaIguf46yi2K3k32JsqKb3gAtrktIh3JwnFfxrQRmG9GLvdMpbxbMrReUOxzDkStxGxNo-5Q=s256-rw',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.tencent.ig&hl=ar',
    screenshots: [
      {
        url: 'https://play-lh.googleusercontent.com/SP1Dj12hP2EmdOEVlhl_Ukrp0JT4chMEmLAg9Z16naJnBy_ceg-OLOxrOanIwCpK9It-LtjAq1hj-4B6pZo=w800-h500-rw',
        caption: 'تحفة المعركة الملكية الملحمية',
      },
      {
        url: 'https://play-lh.googleusercontent.com/KegkqEpEl6ui6msMHnvp-p53RYK6dADy-rHaNh-gtPvZtjIN0d0SAkr7HhM2ev4nzMYWE-LgsA6aTVAM4LR4=w800-h500-rw',
        caption: 'معارك قوية في مباريات من 10 دقائق',
      },
      {
        url: 'https://play-lh.googleusercontent.com/Bj5Uu833dFn9X5tJSlkiYYSGD-zTz7GdUoufF0sTRliMAdbc7KDZ463oz3-KnsnD3GwdSlNTTWhgrO5f7hajtg=w800-h500-rw',
        caption: 'خرائط متعددة وأوضاع لعب متنوعة',
      },
      {
        url: 'https://play-lh.googleusercontent.com/7TSa0BggycDZqmiaq-h75SN02G4h-hr7shY9a36NZy57A8wSovZfGaeEntn39wMXc2c_aJWI3xvD511eUa2Zew=w800-h500-rw',
        caption: 'أسلحة نارية ومركبات واقعية للغاية',
      },
      {
        url: 'https://play-lh.googleusercontent.com/5AnlCJoNtBVpNEMW_zXA-JrCjGITZD9DGMtb4BDrLMYJ__EtoqH0yrLUIk3lgr3tLz9xXFapEg6-d60Rc8LEJds=w800-h500-rw',
        caption: 'لعب جماعي ودردشة صوتية مع الأصدقاء',
      },
    ],
    ratingBreakdown: [
      { stars: 5, label: '5 نجوم', percentage: 76 },
      { stars: 4, label: '4 نجوم', percentage: 12 },
      { stars: 3, label: '3 نجوم', percentage: 5 },
      { stars: 2, label: '2 نجوم', percentage: 2 },
      { stars: 1, label: '1 نجمة', percentage: 5 },
    ],
    similarApps: [
      {
        name: 'Free Fire',
        subtitle: 'بقاء وإطلاق نار في 10 دقائق',
        rating: '4.7',
        downloads: '+1B',
        icon: '/app-freefire.png',
        slug: 'free-fire',
      },
      {
        name: 'دوري كرة القدم 2026',
        subtitle: 'ابنِ فريق أحلامك الكروي',
        rating: '4.3',
        downloads: '+100M',
        icon: 'https://play-lh.googleusercontent.com/Xqw-bVNUk7xbmqyhuKwypUvqumDjmkVYZgXKmFREbCiIIn9Z_tmuSH6aAZXJ4yULWTjqX_2J5G3vLOF9edD9QQ=s256-rw',
        slug: 'football-league-2026',
      },
      {
        name: 'WhatsApp Messenger',
        subtitle: 'مراسلة فورية آمنة وسريعة',
        rating: '4.5',
        downloads: '+1B',
        icon: '/app-whatsapp.png',
        slug: 'whatsapp-messenger',
      },
      {
        name: 'Call of Duty: Mobile',
        subtitle: 'أكشن وتصويب من منظور الشخص الأول',
        rating: '4.4',
        downloads: '+100M',
        icon: 'https://play-lh.googleusercontent.com/Se7jR6A5R0Mk9ClaIguf46yi2K3k32JsqKb3gAtrktIh3JwnFfxrQRmG9GLvdMpbxbMrReUOxzDkStxGxNo-5Q=s256-rw',
        slug: 'pubg-mobile',
      },
    ],
    relatedPostSlug: 'earning-from-pubg-mobile',
  },
  {
    id: 'app-football-league-2026',
    slug: 'football-league-2026',
    packageId: 'com.football.soccer.league',
    name: 'دوري كرة القدم 2026',
    arabicName: 'دوري كرة القدم 2026 - Football League 2026',
    h1Title: 'تحميل لعبة دوري كرة القدم 2026 للاندرويد والآيفون – Football League 2026',
    developer: 'MOBILE SOCCER',
    tagline: 'ابنِ فريقك المثالي! تجربة كرة القدم المحمولة للجيل القادم أونلاين وأوفلاين',
    shortDescription:
      'شارك في الملعب مع أكثر من 40,000 لاعب و1,500 نادي و150 منتخباً عالمياً وعربياً مع تعليق صوتي وحركة ثلاثية الأبعاد.',
    fullDescription: [
      'ادخل أرض الملعب، وابنِ فريق أحلامك، وعِش أجواء المنافسات الكروية الحماسية! تُعد لعبة دوري كرة القدم 2026 (Football League 2026) واحدة من أبرز ألعاب كرة القدم على الهواتف المحمولة، حيث تقدم تجربة رياضية متكاملة تجمع بين سلاسة التحكم، والرسوم المتحركة ثلاثية الأبعاد، وتنوع البطولات المحلية والعالمية.',
      'تتيح لك اللعبة قيادة ناديك المفضل أو منتخبك الوطني في مباريات ومواسم كاملة، مع إمكانية الاختيار من بين أكثر من 40,000 لاعب و1,500 نادٍ و150 منتخبًا وطنيًا، بما في ذلك نادي مانشستر سيتي ونادي موناكو المرخصين رسميًا داخل إصدار FL26.',
      'تتميز Football League 2026 بإمكانية اللعب أونلاين أو أوفلاين بدون إنترنت، إلى جانب واجهة أنيقة وملاعب جديدة وتعليق صوتي متعدد اللغات ودعم كامل ليد التحكم الخارجية، لتستمتع بمباريات كرة قدم واقعية في أي وقت ومكان.',
    ],
    features: [
      'أكثر من 40,000 لاعب و1,500 نادٍ و150 منتخبًا وطنيًا مع ترخيص رسمي لمانشستر سيتي وموناكو',
      'حركة لاعبين ثلاثية الأبعاد بالكامل وذكاء اصطناعي متطور يمنح المباريات واقعية عالية',
      'إمكانية خوض المباريات والبطولات أوفلاين (بدون إنترنت) أو المنافسة أونلاين',
      'تضم الدوريات العربية (السعودية، مصر، المغرب، الجزائر) والدوريات الأوروبية الكبرى وكأس العالم',
      'تعليق صوتي متعدد اللغات وخطط تكتيكية مرنة ودعم كامل لأذرع التحكم (Gamepad)',
    ],
    articleSections: [
      {
        heading: 'ما هي لعبة دوري كرة القدم 2026 (Football League 2026)؟',
        paragraphs: [
          'Football League 2026 هي لعبة محاكاة ومنافسات كرة قدم للهواتف الذكية تمنحك السيطرة الكاملة على فريقك داخل الملعب وخارجه. يمكنك اختيار تشكيلتك الأساسية، وضبط الخطط التكتيكية، وتنفيذ التمريرات الدقيقة والتسديدات القوية لتحقيق الانتصارات وحصد الألقاب.',
          'يقدم إصدار 2026 تحسينات واسعة في حركة اللاعبين بالاعتماد على الرسوم المتحركة ثلاثية الأبعاد، إلى جانب ذكاء اصطناعي أكثر تفاعلًا يجعل تحركات المدافعين والمهاجمين وحراس المرمى أقرب إلى المباريات الحقيقية.',
          'سواء كنت تفضل اللعب السريع بدون اتصال بالإنترنت أثناء التنقل، أو خوض مواسم كاملة في الدوريات العربية والأوروبية والبطولات القارية، توفر لك اللعبة محتوى غنيًا يناسب عشاق كرة القدم على مختلف الهواتف.',
        ],
      },
      {
        heading: 'أبرز مميزات لعبة دوري كرة القدم 2026',
        bullets: [
          'قاعدة بيانات ضخمة تضم أكثر من 40,000 لاعب كرة قدم (رجال وسيدات)، وأكثر من 1,500 نادٍ، و150 منتخبًا وطنيًا من مختلف قارات العالم.',
          'حضور رسمي مرخص بالكامل لنجوم نادي مانشستر سيتي (Manchester City) ونادي موناكو (AS Monaco) في نسخة FL26.',
          'إمكانية اللعب بدون إنترنت (Offline) في المباريات والبطولات المحلية، بالإضافة إلى أوضاع اللعب والتحديات عبر الإنترنت.',
          'رسوم متحركة ثلاثية الأبعاد بالكامل وملاعب جديدة مصممة بعناية مع مؤثرات جماهيرية وتعليق صوتي يضيف أجواءً حماسية للمباراة.',
          'تحكم سلس وقابل للتخصيص على شاشة اللمس، مع دعم كامل لتوصيل يد التحكم الخارجية (Controller / Gamepad).',
          'حجم تحميل خفيف مقارنةً بألعاب كرة القدم الأخرى، مما يجعلها تعمل بكفاءة عالية على الهواتف المتوسطة والاقتصادية.',
          'إمكانية تخصيص أطقم الفرق والكرات وتطوير قدرات اللاعبين وبناء تشكيلة أحلامك الخاصة.',
        ],
      },
      {
        heading: 'الدوريات والبطولات المتاحة في Football League 2026',
        paragraphs: [
          'تجمع اللعبة مجموعة واسعة من المسابقات الكروية على مستوى الأندية والمنتخبات لتعيش تجربة البطولات الكبرى كاملة:',
        ],
        subSections: [
          {
            subHeading: '1. الدوريات العربية والأفريقية والآسيوية',
            text: 'تتضمن اللعبة منافسات الدوريات العربية الشهيرة مثل الدوري السعودي، والدوري المصري، والدوري المغربي، والدوري الجزائري، إلى جانب بطولات دوري أبطال أفريقيا ودوري أبطال آسيا.',
          },
          {
            subHeading: '2. الدوريات والبطولات الأوروبية الكبرى',
            text: 'يمكنك المشاركة في الدوريات الأوروبية الخمسة الكبرى (الإنجليزي، الإسباني، الإيطالي، الألماني، والفرنسي) وخوض منافسات كأس أبطال أوروبا بنظامه الحديث.',
          },
          {
            subHeading: '3. بطولات المنتخبات الوطنية وكأس العالم',
            text: 'قُد منتخبك الوطني في الكأس الدولية الكبرى (كأس العالم)، وكأس أمم أفريقيا، وكأس آسيا، وكأس أمم أوروبا، وكوبا أمريكا للمنافسة على اللقب القاري والعالمي.',
          },
        ],
      },
      {
        heading: 'طريقة تحميل وتثبيت دوري كرة القدم 2026 للاندرويد والآيفون',
        bullets: [
          'انقر على زر "تحميل الآن" في أعلى الصفحة للانتقال مباشرة إلى صفحة اللعبة الرسمية على متجر Google Play.',
          'اضغط على "تثبيت" وانتظر بضع لحظات حتى يكتمل تنزيل اللعبة على هاتفك بفضل حجمها المناسب.',
          'افتح اللعبة، واختر لغتك المفضلة وفريقك المفضل، واضبط إعدادات التحكم والرسومات لتبدأ أولى مبارياتك فورًا.',
        ],
      },
    ],
    faqs: [
      {
        question: 'هل تعمل لعبة دوري كرة القدم 2026 بدون إنترنت؟',
        answer:
          'نعم، يمكنك لعب المباريات الودية ومنافسات الدوريات والبطولات في Football League 2026 أوفلاين بدون الحاجة إلى اتصال دائم بالإنترنت.',
      },
      {
        question: 'هل تحتوي اللعبة على الدوريات والمنتخبات العربية؟',
        answer:
          'نعم، تضم اللعبة مجموعة من أبرز الدوريات العربية مثل الدوري السعودي والمصري والمغربي والجزائري، بالإضافة إلى المنتخبات العربية في بطولتي كأس آسيا وكأس أمم أفريقيا.',
      },
      {
        question: 'هل اللعبة مجانية وتناسب الهواتف المتوسطة؟',
        answer:
          'اللعبة متاحة للتحميل مجانًا عبر متجر Google Play، وتتميز بحجمها الخفيف (~145 ميجابايت) الذي يتيح تشغيلها بسلاسة على أغلب هواتف أندرويد.',
      },
    ],
    category: 'ألعاب',
    breadcrumbCategory: 'ألعاب رياضية وكرة قدم',
    categoryBadge: 'ألعاب كرة القدم',
    filterKey: 'games',
    rating: '4.3',
    reviewsCountText: '2.2 مليون مراجعة',
    reviewsCountNumeric: 2199014,
    downloads: '+100M',
    ageRating: '3+',
    ageRatingLabel: 'مناسب لجميع الأعمار',
    version: '0.1.68',
    size: '145 MB',
    updateDate: '2026-04-10',
    priceText: 'مجاني · يتضمن إعلانات',
    icon: 'https://play-lh.googleusercontent.com/Xqw-bVNUk7xbmqyhuKwypUvqumDjmkVYZgXKmFREbCiIIn9Z_tmuSH6aAZXJ4yULWTjqX_2J5G3vLOF9edD9QQ=s256-rw',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.football.soccer.league&hl=ar',
    screenshots: [
      {
        url: 'https://play-lh.googleusercontent.com/riC6PvXuW1ujp3IiU6Ts-G36MzG0e0EpjXQpYlILLmCHxyNb9ZGHN2RUwJeahLDlZ97fKrZcxmwNuqoFX34=w800-h500-rw',
        caption: 'ابنِ فريق أحلامك من 40,000 لاعب',
      },
      {
        url: 'https://play-lh.googleusercontent.com/8rh4nMSnDWFiyAtvodNv1ZEmXeFBZDWsANMPQZAqGS2LN5wJI7Oa_u3QwFkwDe4H30vvMGzCeIRisQeSobOxCQ=w800-h500-rw',
        caption: 'رسوم متحركة ثلاثية الأبعاد وملاعب واقعية',
      },
      {
        url: 'https://play-lh.googleusercontent.com/zZjVpFTTSwvMWyzU83k1GJFCTjGBQtgsClogNKBtsYZAJv2bhcU_jMt16yRdd2kWqPD0ZVOJe13Ozsi08ji-sDg=w800-h500-rw',
        caption: 'دوري أبطال أوروبا والدوريات العربية',
      },
      {
        url: 'https://play-lh.googleusercontent.com/ih0SKd7I0fn4VQ_qa6LVQC2K_HgLXIIVVVqgJAz7UGT4Oo9ep4qtMFTX_S9lFcGGT9aFW9FroyHzmUHkF80WiQ=w800-h500-rw',
        caption: 'خطط وتكتيكات قابلة للتخصيص بالكامل',
      },
      {
        url: 'https://play-lh.googleusercontent.com/C5l9CXXh3FUu0c-629szbj7EJijpZEXp3jA4oV0LqeTBuDc5bKrwNH-e1bAlEnbG-4RJebvKE6F6AGM_ZrHIpA=w800-h500-rw',
        caption: 'العب أونلاين أو أوفلاين بتعليق متعدد اللغات',
      },
    ],
    ratingBreakdown: [
      { stars: 5, label: '5 نجوم', percentage: 68 },
      { stars: 4, label: '4 نجوم', percentage: 16 },
      { stars: 3, label: '3 نجوم', percentage: 8 },
      { stars: 2, label: '2 نجوم', percentage: 3 },
      { stars: 1, label: '1 نجمة', percentage: 5 },
    ],
    similarApps: [
      {
        name: 'PUBG MOBILE',
        subtitle: 'أفضل لعبة معركة ملكية للهاتف',
        rating: '4.6',
        downloads: '+1B',
        icon: 'https://play-lh.googleusercontent.com/Se7jR6A5R0Mk9ClaIguf46yi2K3k32JsqKb3gAtrktIh3JwnFfxrQRmG9GLvdMpbxbMrReUOxzDkStxGxNo-5Q=s256-rw',
        slug: 'pubg-mobile',
      },
      {
        name: 'Free Fire',
        subtitle: 'بقاء وإطلاق نار في 10 دقائق',
        rating: '4.7',
        downloads: '+1B',
        icon: '/app-freefire.png',
        slug: 'free-fire',
      },
      {
        name: 'WhatsApp Messenger',
        subtitle: 'مراسلة فورية آمنة وسريعة',
        rating: '4.5',
        downloads: '+1B',
        icon: '/app-whatsapp.png',
        slug: 'whatsapp-messenger',
      },
      {
        name: 'EA SPORTS FC Mobile',
        subtitle: 'مباريات كرة قدم عالمية',
        rating: '4.4',
        downloads: '+100M',
        icon: 'https://play-lh.googleusercontent.com/Xqw-bVNUk7xbmqyhuKwypUvqumDjmkVYZgXKmFREbCiIIn9Z_tmuSH6aAZXJ4yULWTjqX_2J5G3vLOF9edD9QQ=s256-rw',
        slug: 'football-league-2026',
      },
    ],
    relatedPostSlug: 'best-5-entertainment-games-kwait',
  },
  {
    id: 'app-whatsapp',
    slug: 'whatsapp-messenger',
    packageId: 'com.whatsapp',
    name: 'WhatsApp Messenger',
    arabicName: 'واتساب مسنجر - WhatsApp Messenger',
    h1Title: 'تحميل WhatsApp Messenger للاندرويد والآيفون – واتساب مسنجر',
    developer: 'Meta Platforms, Inc.',
    tagline: 'مراسلة فورية آمنة وسريعة',
    shortDescription:
      'تطبيق المراسلة الفورية الأكثر استخداماً في العالم لإرسال الرسائل النصية والصوتية ومكالمات الفيديو المشفرة مجاناً.',
    fullDescription: [
      'تواصل مع عائلتك وأصدقائك وزملاء العمل بسهولة وأمان! يُعد تطبيق واتساب مسنجر (WhatsApp Messenger) من شركة Meta تطبيق المراسلة الفورية والمكالمات الأكثر انتشارًا وموثوقية على الهواتف الذكية حول العالم.',
      'يتيح لك التطبيق إرسال الرسائل النصية والصوتية، ومشاركة الصور ومقاطع الفيديو والمستندات والموقع الجغرافي، بالإضافة إلى إجراء مكالمات صوتية ومرئية فردية وجماعية عالية الوضوح مجانًا باستخدام اتصال الإنترنت.',
      'تخضع جميع المحادثات والمكالمات الشخصية على WhatsApp Messenger للتشفير التام بين الطرفين (End-to-End Encryption)، مما يضمن خصوصية رسائلك وأمان بياناتك على مدار الساعة.',
    ],
    features: [
      'مراسلة فورية وآمنة بتشفير تام بين الطرفين لحماية الخصوصية',
      'مكالمات صوتية ومرئية عالية الجودة مجاناً حتى مع سرعات الإنترنت المنخفضة',
      'مشاركة الملفات والصور والفيديو والمستندات بحجم يصل إلى 2 جيجابايت',
      'مجموعات ومجتمعات متكاملة وقنوات متابعة ومكالمات جماعية تصل إلى 32 شخصاً',
      'متوفر على أندرويد و iOS وأجهزة الكمبيوتر والساعات الذكية مع مزامنة فورية',
    ],
    articleSections: [
      {
        heading: 'ما هو تطبيق WhatsApp Messenger؟',
        paragraphs: [
          'WhatsApp Messenger هو تطبيق تواصل ومراسلة مجاني يعتمد على رقم الهاتف والاتصال بالإنترنت لإرسال الرسائل وإجراء المكالمات دون أي رسوم على الرسائل القصيرة التقليدية.',
          'يوفر التطبيق بيئة متكاملة للتواصل اليومي تشمل الدردشات الفردية، والمجموعات العائلية ومجموعات العمل، وميزة "الحالة" (Status) لمشاركة التحديثات المصورة والنصية التي تختفي بعد 24 ساعة، إلى جانب ميزة "القنوات" لمتابعة الأخبار والصفحات المفضلة.',
        ],
      },
      {
        heading: 'أبرز مميزات تطبيق واتساب مسنجر',
        bullets: [
          'تشفير تام بين الطرفين للرسائل والمكالمات والصور والملفات لضمان عدم اطلاع أي طرف ثالث عليها.',
          'مكالمات فيديو وصوت جماعية عالية الدقة تدعم حتى 32 مشاركًا مع إمكانية مشاركة الشاشة.',
          'إمكانية ربط الحساب واستخدامه على عدة أجهزة في الوقت نفسه عبر واتساب ويب وتطبيق سطح المكتب.',
          'أدوات خصوصية متقدمة مثل قفل الدردشات بكلمة مرور أو البصمة، والرسائل ذاتية الاختفاء.',
          'نسخ احتياطي سحابي مشفر للمحادثات والوسائط لاستعادتها بسهولة عند تغيير الهاتف.',
        ],
      },
    ],
    faqs: [
      {
        question: 'هل تطبيق واتساب مسنجر مجاني بالكامل؟',
        answer:
          'نعم، تحميل واستخدام WhatsApp Messenger مجاني تمامًا ولا يتطلب أي رسوم اشتراك، ويعتمد فقط على باقة البيانات أو شبكة Wi-Fi.',
      },
      {
        question: 'هل يمكن تشغيل واتساب على الكمبيوتر والهاتف معًا؟',
        answer:
          'نعم، يتيح التطبيق ميزة الأجهزة المرتبطة لربط حسابك بما يصل إلى 4 أجهزة إضافية بسهولة وأمان.',
      },
    ],
    category: 'تواصل اجتماعي',
    breadcrumbCategory: 'تواصل اجتماعي',
    categoryBadge: 'تطبيقات التواصل الإجتماعي',
    filterKey: 'social',
    rating: '4.5',
    reviewsCountText: '12.4 مليون مراجعة',
    reviewsCountNumeric: 12400000,
    downloads: '+1B',
    ageRating: '3+',
    ageRatingLabel: 'مناسب لجميع الأعمار',
    version: '2.25.18',
    size: '45 MB',
    updateDate: '2025-05-10',
    priceText: 'مجاني · يتضمن إعلانات',
    icon: '/app-whatsapp.png',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp&hl=ar',
    screenshots: [
      {
        url: 'https://play-lh.googleusercontent.com/QMII6a27D3wNv5lBrfnnDgZK1DhX9XW8-ZaE68dzoNjMPdpnQLWzKhnznb7YzsO5bvTfntpj8i-q8M94=w600-h1000-rw',
        caption: 'محادثات سريعة وآمنة',
      },
      {
        url: 'https://play-lh.googleusercontent.com/M27Pc7MpLOjFuuCZDCQKBtQRszDBIS9mfB-9AeYkaH7Wuujc2KRysvJ5WKlV7GFh2ypDjYRXtl-Aoh--bZobWA=w600-h1000-rw',
        caption: 'مكالمات صوتية ومرئية عالية الجودة',
      },
      {
        url: 'https://play-lh.googleusercontent.com/CaFW5mQnnwQYaaTPOMCQDq0F0hKD5-JfNzowC_HtdFA9z_fBH-jazwarSBkT82U8GQYal4Ovj9XyTvP_R8Q4kQ=w600-h1000-rw',
        caption: 'مشاركة الملفات بسهولة',
      },
      {
        url: 'https://play-lh.googleusercontent.com/1Qow1HzVMGvu66iIWUDB2A48j_onyzOSIR8UDx5d6PKhOzVW_c5PbdlXeNb7oISrRl-9SdMLbg5cBXuZ_HrAFw=w600-h1000-rw',
        caption: 'وضع مظلم مريح للعين',
      },
      {
        url: 'https://play-lh.googleusercontent.com/M0aHhsM5HvFMs9_kt8BkC9zLOJ60htiz3KFZ61wqSR4gMFCqu6uwPodeEY6PdIOJEcvjvqIxWeTvQFsSUaY1=w600-h1000-rw',
        caption: 'مكالمات جماعية تصل إلى 32 شخصاً',
      },
    ],
    ratingBreakdown: [
      { stars: 5, label: '5 نجوم', percentage: 72 },
      { stars: 4, label: '4 نجوم', percentage: 17 },
      { stars: 3, label: '3 نجوم', percentage: 6 },
      { stars: 2, label: '2 نجوم', percentage: 2 },
      { stars: 1, label: '1 نجمة', percentage: 3 },
    ],
    similarApps: [
      {
        name: 'Telegram',
        subtitle: 'مراسلة سريعة وآمنة',
        rating: '4.5',
        downloads: '+1B',
        icon: 'https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q=s256-rw',
        slug: 'whatsapp-messenger',
      },
      {
        name: 'PUBG MOBILE',
        subtitle: 'معركة ملكية ولعب جماعي',
        rating: '4.6',
        downloads: '+1B',
        icon: 'https://play-lh.googleusercontent.com/Se7jR6A5R0Mk9ClaIguf46yi2K3k32JsqKb3gAtrktIh3JwnFfxrQRmG9GLvdMpbxbMrReUOxzDkStxGxNo-5Q=s256-rw',
        slug: 'pubg-mobile',
      },
      {
        name: 'دوري كرة القدم 2026',
        subtitle: 'لعبة كرة القدم الجديدة 2026',
        rating: '4.3',
        downloads: '+100M',
        icon: 'https://play-lh.googleusercontent.com/Xqw-bVNUk7xbmqyhuKwypUvqumDjmkVYZgXKmFREbCiIIn9Z_tmuSH6aAZXJ4yULWTjqX_2J5G3vLOF9edD9QQ=s256-rw',
        slug: 'football-league-2026',
      },
      {
        name: 'Free Fire',
        subtitle: 'أكشن وبقاء في 10 دقائق',
        rating: '4.7',
        downloads: '+1B',
        icon: '/app-freefire.png',
        slug: 'free-fire',
      },
    ],
    relatedPostSlug: 'threads-instagram',
  },
  {
    id: 'app-freefire',
    slug: 'free-fire',
    packageId: 'com.dts.freefireth',
    name: 'Free Fire',
    arabicName: 'فري فاير - Garena Free Fire',
    h1Title: 'تحميل Free Fire للاندرويد والآيفون – لعبة فري فاير',
    developer: 'GARENA INTERNATIONAL I',
    tagline: 'بقاء وإطلاق نار في 10 دقائق على الأجهزة المحمولة',
    shortDescription:
      'لعبة إطلاق نار وبقاء عالمية تضعك في مواجهة 49 لاعباً آخر في مباريات سريعة مدتها 10 دقائق مع وضع كلاش سكواد 4 ضد 4.',
    fullDescription: [
      'انطلق في مواجهات سريعة ومليئة بالحماس! تُعد لعبة فري فاير (Garena Free Fire) واحدة من أكثر ألعاب البقاء وإطلاق النار شعبية على الهواتف الذكية، حيث صُممت لتمنح اللاعبين مباريات باتل رويال سريعة ومكثفة مدتها 10 دقائق فقط.',
      'يهبط 50 لاعبًا بالمظلات على جزيرة نائية للبحث عن الأسلحة والإمدادات والمركبات، والبقاء داخل المنطقة الآمنة ومواجهة الخصوم حتى يتبقى ناجٍ واحد في النهاية.',
      'تتميز Free Fire بنظام الشخصيات ذات المهارات الخاصة، ووضع كلاش سكواد (4 ضد 4) السريع، وأداء سلس يعمل بكفاءة ممتازة حتى على الهواتف الاقتصادية والمتوسطة.',
    ],
    features: [
      'مباريات بقاء سريعة مدتها 10 دقائق بمشاركة 50 لاعباً على جزيرة نائية',
      'وضع كلاش سكواد (Clash Squad) سريع الوتيرة 4 ضد 4 لإدارة الموارد والقتال',
      'فريق من 4 لاعبين مع دردشة صوتية مباشرة ونظام شخصيات بقدرات متنوعة',
      'رسومات سلسة وعناصر تحكم سهلة الاستخدام مصممة لجميع الهواتف',
      'متوفرة مجاناً لأجهزة أندرويد و iOS بروابط رسمية آمنة',
    ],
    articleSections: [
      {
        heading: 'ما هي لعبة Garena Free Fire؟',
        paragraphs: [
          'Free Fire هي لعبة باتل رويال وإطلاق نار من منظور الشخص الثالث تركز على السرعة والحركة المستمرة. بفضل قصر مدة المباراة (10 دقائق) وعدد اللاعبين المتوازن (50 لاعبًا)، تبدأ المواجهات الحماسية منذ اللحظات الأولى للهبوط.',
          'تتيح لك اللعبة الاختيار من بين شخصيات متعددة يمتلك كل منها مهارة خاصة تساعدك في القتال أو العلاج أو الحركة، مع إمكانية اللعب الفردي أو ضمن فريق مكون من 4 لاعبين مع دردشة صوتية مباشرة.',
        ],
      },
      {
        heading: 'أبرز مميزات لعبة فري فاير',
        bullets: [
          'مباريات باتل رويال سريعة ومكثفة تناسب اللعب في أي وقت.',
          'وضع كلاش سكواد (4 ضد 4) التنافسي لشراء الأسلحة وخوض جولات حاسمة.',
          'نظام شخصيات ومرافقين يضيف بعدًا تكتيكيًا لأسلوب اللعب.',
          'توافق ممتاز مع الهواتف الضعيفة والمتوسطة واستهلاك متوازن للبطارية.',
        ],
      },
    ],
    faqs: [
      {
        question: 'هل تعمل لعبة فري فاير على الهواتف الضعيفة؟',
        answer:
          'نعم، صُممت Garena Free Fire برسومات مرنة وحجم مناسب لتعمل بسلاسة عالية على مختلف الهواتف الذكية بما فيها الأجهزة الاقتصادية.',
      },
    ],
    category: 'ألعاب',
    breadcrumbCategory: 'ألعاب أكشن وبقاء',
    categoryBadge: 'ألعاب الأكشن والبقاء',
    filterKey: 'games',
    rating: '4.7',
    reviewsCountText: '130.2 مليون مراجعة',
    reviewsCountNumeric: 130188227,
    downloads: '+1B',
    ageRating: '16+',
    ageRatingLabel: 'مناسب لعمر 16 فما فوق',
    version: '1.108.1',
    size: '620 MB',
    updateDate: '2026-02-20',
    priceText: 'مجاني · يتضمن عمليات شراء داخل التطبيق',
    icon: '/app-freefire.png',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.dts.freefireth&hl=ar',
    screenshots: [
      {
        url: 'https://play-lh.googleusercontent.com/d8zJKuZJduea8WoQYVzbfyAdulYWxMonuuw8zQbooeQaPEd9pmGTmJlEZwNNgT9USKehT6pGvColD7EVFYkcTa4=w800-h500-rw',
        caption: 'بقاء وإطلاق نار في 10 دقائق',
      },
      {
        url: 'https://play-lh.googleusercontent.com/ByvKYjmOO0f-qCAErEGwH3qdyJkjCwTz0glYMSklCrtCqyC475ATpC09-0DZ7g-nrCIUcwp-x2ou4S0eyElpfA=w800-h500-rw',
        caption: 'تعاونات وفعاليات نينجا أسطورية',
      },
      {
        url: 'https://play-lh.googleusercontent.com/qJl8El4nMygPoYAmiaicjWOupeeofac9fIKr_oV5P4InuCm7urpjBlVNnOgznk0rJpeX-_NPNrKekS__-Xvud7Q=w800-h500-rw',
        caption: 'فريق من 4 لاعبين مع دردشة صوتية',
      },
      {
        url: 'https://play-lh.googleusercontent.com/QDakO7vLeu-mvRp6GLzP0I-8ylbsdEkVwx_8Eg2ox0EIHGNDOaKeJQ1wajb2aMD_jvnLO99SWN-4bhgQ8KkYBtM=w800-h500-rw',
        caption: 'وضع كلاش سكواد الحماسي 4 ضد 4',
      },
      {
        url: 'https://play-lh.googleusercontent.com/kPfHSr5Wm_AP0CCmWH31uTRbxAxjJ7l8TjDbRhpUnwqKzdwrzgIjAYGQzAStbnLS0a3RTEmVY6dQ_dW2Masw=w800-h500-rw',
        caption: 'رسومات واقعية وسلسة على جميع الأجهزة',
      },
    ],
    ratingBreakdown: [
      { stars: 5, label: '5 نجوم', percentage: 78 },
      { stars: 4, label: '4 نجوم', percentage: 11 },
      { stars: 3, label: '3 نجوم', percentage: 4 },
      { stars: 2, label: '2 نجوم', percentage: 2 },
      { stars: 1, label: '1 نجمة', percentage: 5 },
    ],
    similarApps: [
      {
        name: 'PUBG MOBILE',
        subtitle: 'أفضل لعبة معركة ملكية للهاتف',
        rating: '4.6',
        downloads: '+1B',
        icon: 'https://play-lh.googleusercontent.com/Se7jR6A5R0Mk9ClaIguf46yi2K3k32JsqKb3gAtrktIh3JwnFfxrQRmG9GLvdMpbxbMrReUOxzDkStxGxNo-5Q=s256-rw',
        slug: 'pubg-mobile',
      },
      {
        name: 'دوري كرة القدم 2026',
        subtitle: 'ابنِ فريقك المثالي في FL26',
        rating: '4.3',
        downloads: '+100M',
        icon: 'https://play-lh.googleusercontent.com/Xqw-bVNUk7xbmqyhuKwypUvqumDjmkVYZgXKmFREbCiIIn9Z_tmuSH6aAZXJ4yULWTjqX_2J5G3vLOF9edD9QQ=s256-rw',
        slug: 'football-league-2026',
      },
      {
        name: 'WhatsApp Messenger',
        subtitle: 'مراسلة فورية آمنة وسريعة',
        rating: '4.5',
        downloads: '+1B',
        icon: '/app-whatsapp.png',
        slug: 'whatsapp-messenger',
      },
      {
        name: 'PUBG MOBILE LITE',
        subtitle: 'نسخة خفيفة وسريعة للأجهزة',
        rating: '4.4',
        downloads: '+100M',
        icon: 'https://play-lh.googleusercontent.com/Se7jR6A5R0Mk9ClaIguf46yi2K3k32JsqKb3gAtrktIh3JwnFfxrQRmG9GLvdMpbxbMrReUOxzDkStxGxNo-5Q=s256-rw',
        slug: 'pubg-mobile',
      },
    ],
    relatedPostSlug: 'best-free-game-recharge-sites',
  },
];
