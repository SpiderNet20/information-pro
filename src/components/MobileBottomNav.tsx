import React from 'react';
import { Home, Search, Menu, Moon, Sun, ArrowUp } from 'lucide-react';

interface MobileBottomNavProps {
  onGoHome: () => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onGoHome,
  onOpenSearch,
  onOpenMenu,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-[#1b1e38]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#2f366b] shadow-2xl safe-bottom">
      <div className="flex items-center justify-around h-14">
        {/* Home */}
        <button
          onClick={onGoHome}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-600 dark:text-gray-300 hover:text-[#035dcd] dark:hover:text-blue-400 cursor-pointer"
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-600 dark:text-gray-300 hover:text-[#035dcd] dark:hover:text-blue-400 cursor-pointer"
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">بحث</span>
        </button>

        {/* Drawer Menu */}
        <button
          onClick={onOpenMenu}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-600 dark:text-gray-300 hover:text-[#035dcd] dark:hover:text-blue-400 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-bold">القائمة</span>
        </button>

        {/* Dark Mode */}
        <button
          onClick={onToggleDarkMode}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-gray-600 dark:text-gray-300 hover:text-[#035dcd] dark:hover:text-blue-400 cursor-pointer"
        >
          {darkMode ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-blue-600" />}
          <span className="text-[10px] font-bold">{darkMode ? 'نهار' : 'ليل'}</span>
        </button>
      </div>
    </nav>
  );
};
