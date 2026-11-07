import React from 'react';
import { X, Shield, FileText, Info } from 'lucide-react';

export type PageType = 'about' | 'privacy' | 'terms';

interface PagesModalProps {
  pageType: PageType | null;
  onClose: () => void;
}

export const PagesModal: React.FC<PagesModalProps> = ({ pageType, onClose }) => {
  if (!pageType) return null;

  const pageData = {
    about: {
      title: 'من نحن - موقع العنكبوت للمعلومات',
      icon: Info,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="font-semibold text-base text-[#035dcd] dark:text-blue-400">
            مرحباً بكم في موقع العنكبوت للمعلومات (information-net.com)
          </p>
          <p>
            موقع العنكبوت للمعلومات "information-net" هو مدونة تعليمية شاملة تغطي مواضيع مختلفة ومتنوعة، مثل الألعاب، البرامج، الكتب، التكنولوجيا، الذكاء الاصطناعي، الأخبار، المعلومات، الربح، الهندسة، ببجي موبايل، الهواتف، التطبيقات، التقنية الحديثة، التجارة، التسوق، السياحة، والتعليم.
          </p>
          <p>
            نهدف في "العنكبوت للمعلومات" إلى إثراء المحتوى العربي التقني بمقالات وشروحات حصرية ومجربة تهم المستخدم اليومي والمحترف على حد سواء. نعمل جاهدين على تقديم حلول للمشاكل التقنية المعقدة بأسلوب مبسط وموثوق.
          </p>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
            <h5 className="font-bold text-gray-800 dark:text-white mb-1">رسالتنا وقيمنا</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              تقديم المعلومة الصادقة وتجنب التضليل، ومواكبة أحدث التطورات العالمية في عالم التكنولوجيا والذكاء الاصطناعي بلغة عربية فصيحة وسهلة الفهم.
            </p>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'سياسة الخصوصية - Privacy Policy',
      icon: Shield,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            في موقع "العنكبوت للمعلومات"، نولي خصوصية زوارنا أهمية بالغة. توضح هذه الوثيقة أنواع المعلومات الشخصية التي يتم جمعها وكيفية استخدامها وحمايتها.
          </p>
          <h5 className="font-bold text-gray-900 dark:text-white">ملفات الدخول (Log Files)</h5>
          <p>
            مثل العديد من المواقع، نستخدم ملفات السجل التي تشمل عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت (ISP)، طابع التاريخ والوقت، وصفحات الإحالة/الخروج لغرض تحسين تجربة التصفح فقط.
          </p>
          <h5 className="font-bold text-gray-900 dark:text-white">ملفات تعريف الارتباط (Cookies)</h5>
          <p>
            يستخدم موقعنا ملفات تعريف الارتباط لتخزين معلومات حول تفضيلات الزوار والصفحات التي يدخلون إليها، بالإضافة إلى تخصيص محتوى صفحات الويب بما يناسب رغباتكم.
          </p>
          <h5 className="font-bold text-gray-900 dark:text-white">شركاء الإعلانات (Google AdSense)</h5>
          <p>
            قد يستخدم أطراف ثالثة مثل شبكة Google ملفات تعريف الارتباط لعرض الإعلانات على موقعنا بناءً على زيارات المستخدمين السابقة لهذا الموقع أو لمواقع أخرى على شبكة الإنترنت.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'اتفاقية الاستخدام - User Agreement',
      icon: FileText,
      content: (
        <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            باستخدامك لموقع "العنكبوت للمعلومات"، فإنك توافق على الالتزام بكافة الشروط والأحكام الواردة في هذه الاتفاقية:
          </p>
          <ul className="list-disc pr-5 space-y-2 text-xs">
            <li>
              <strong>حقوق الملكية الفكرية:</strong> كافة المقالات والشروحات المنشورة في الموقع هي ملك لموقع العنكبوت للمعلومات ولا يجوز نسخها أو إعادة نشرها دون ذكر المصدر المباشر مع رابط المقال الأصلي.
            </li>
            <li>
              <strong>إخلاء المسؤولية:</strong> جميع البرامج والألعاب والشروحات المقدمة هي لأغراض تعليمية وإرشادية، ولا يتحمل الموقع أي مسؤولية عن الاستخدام الخاطئ لأي من الأدوات المشروحة.
            </li>
            <li>
              <strong>التعليقات:</strong> نرحب بالتعليقات الهادفة والاستفسارات البناءة، ونحتفظ بالحق الكامل في حذف أي تعليق يحتوي على عبارات مسيئة أو روابط إعلانية مشبوهة.
            </li>
          </ul>
        </div>
      ),
    },
  }[pageType];

  const Icon = pageData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-white dark:bg-[#252a54] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#2f366b] flex flex-col text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#035dcd] text-white shrink-0">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <h3 className="font-bold text-base">{pageData.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with scroll */}
        <div className="p-6 overflow-y-auto">
          {pageData.content}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-[#1f244a] border-t border-gray-100 dark:border-[#2f366b] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#035dcd] text-white text-xs font-bold hover:bg-[#02479e] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
