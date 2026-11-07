import React from 'react';
import { StandalonePageType } from '../types';

interface FooterProps {
  onOpenStandalonePage: (page: StandalonePageType) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStandalonePage,
}) => {
  return (
    <footer className="mt-16 bg-[#0b1120] text-slate-400 border-t border-slate-800/80 pb-16 lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-xs font-medium text-slate-400">
          © 2026 العنكبوت للمعلومات · التكنولوجيا بلا حدود
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          <button
            onClick={() => onOpenStandalonePage('about')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            من نحن
          </button>
          <span>·</span>
          <button
            onClick={() => onOpenStandalonePage('privacy')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            سياسة الخصوصية
          </button>
          <span>·</span>
          <button
            onClick={() => onOpenStandalonePage('terms')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            اتفاقية المستخدم
          </button>
          <span>·</span>
          <button
            onClick={() => onOpenStandalonePage('contact')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            اتصل بنا
          </button>
          <span>·</span>
          <button
            onClick={() => onOpenStandalonePage('sitemap')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            خريطة الموقع
          </button>
        </nav>
      </div>
    </footer>
  );
};
