import React from 'react';
import {
  Send,
  Facebook,
  Youtube,
  Twitter,
  ExternalLink,
  Shield,
  FileText,
  Mail,
  Info,
  Sparkles,
} from 'lucide-react';
import { StandalonePageType } from '../types';

interface FooterProps {
  onOpenStandalonePage: (page: StandalonePageType) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStandalonePage,
  onSelectCategory,
}) => {
  return (
    <footer className="mt-16 bg-white dark:bg-[#202442] border-t border-gray-200 dark:border-[#262b52] text-right transition-colors pb-16 lg:pb-0">
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About the Site (Exact text from HTML6 widget) */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="/logo-spider.png"
                alt="العنكبوت للمعلومات"
                className="w-8 h-8 rounded-full object-contain drop-shadow-sm"
              />
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                العنكبوت للمعلومات
              </h4>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
              موقع العنكبوت للمعلومات "information-net" هو مدونة تعليمية شاملة تغطي مواضيع مختلفة ومتنوعة، مثل الألعاب، البرامج، الكتب، التكنولوجيا، الذكاء الاصطناعي، الأخبار، المعلومات، الربح، ببجي موبايل، وتطوير الويب. يعمل الموقع على تقديم معلومات قيمة وموثوقة لجميع فئات المجتمع العربي.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white pb-2 border-b-2 border-[#035dcd] inline-block">
              صفحات هامة
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li>
                <button
                  onClick={() => onOpenStandalonePage('about')}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>من نحن</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStandalonePage('privacy')}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>سياسة الخصوصية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStandalonePage('terms')}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>اتفاقية المستخدم</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStandalonePage('contact')}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>اتصل بنا</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenStandalonePage('sitemap')}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>خريطة الموقع</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Site Categories (4 Main Sections) */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white pb-2 border-b-2 border-[#035dcd] inline-block">
              أقسام الموقع الرسمية
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li>
                <a
                  href="/AI/"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('AI');
                  }}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 w-full cursor-pointer font-medium"
                  title="https://www.information-net.com/AI/"
                >
                  <span>• الذكاء الاصطناعي</span>
                </a>
              </li>
              <li>
                <a
                  href="/Business/"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Business');
                  }}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 w-full cursor-pointer font-medium"
                  title="https://www.information-net.com/Business/"
                >
                  <span>• المال والأعمال</span>
                </a>
              </li>
              <li>
                <a
                  href="/Blog/"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Blog');
                  }}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 w-full cursor-pointer font-medium"
                  title="https://www.information-net.com/Blog/"
                >
                  <span>• المدونة</span>
                </a>
              </li>
              <li>
                <a
                  href="/Downloads/"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Downloads');
                  }}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 w-full cursor-pointer font-medium"
                  title="https://www.information-net.com/Downloads/"
                >
                  <span>• التحميلات</span>
                </a>
              </li>
              <li>
                <a
                  href="/tools/"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('tools');
                  }}
                  className="hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 w-full cursor-pointer font-medium"
                  title="https://www.information-net.com/tools/"
                >
                  <span>• الأدوات المجانية</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Features & Social Channels */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white pb-2 border-b-2 border-[#035dcd] inline-block">
              أدوات وتواصل
            </h4>
            
            <div className="space-y-2 text-xs">
              <a
                href="/tools/"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory('tools');
                }}
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-[#252a54] hover:bg-blue-50 dark:hover:bg-[#2d3368] text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-[#2f366b] flex items-center justify-between font-bold transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>قسم الأدوات المجانية (9 أدوات)</span>
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              <a
                href="https://ai.information-net.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-[#252a54] hover:bg-purple-50 dark:hover:bg-[#2d3368] text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-[#2f366b] flex items-center justify-between font-medium transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>بوابة العنكبوت AI</span>
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>

            {/* Social Icons row */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://t.me/arb_1xbet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#0088cc] text-white hover:scale-105 transition-transform"
                title="تيليجرام"
              >
                <Send className="w-3.5 h-3.5 -rotate-90" />
              </a>
              <a
                href="https://www.facebook.com/informationspider/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#1877F2] text-white hover:scale-105 transition-transform"
                title="فيسبوك"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCMNj0yd5HpbesN8wWh8167Q"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#FF0000] text-white hover:scale-105 transition-transform"
                title="يوتيوب"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#1DA1F2] text-white hover:scale-105 transition-transform"
                title="تويتر"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-100 dark:bg-[#1b1e38] border-t border-gray-200 dark:border-[#262b52] py-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()}{' '}
            <span className="font-bold text-gray-800 dark:text-white">
              العنكبوت للمعلومات (information-net)
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
