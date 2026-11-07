import React, { useState, useEffect } from 'react';
import { ArrowUp, BookOpen, CheckCircle2 } from 'lucide-react';

interface ReadingProgressBarProps {
  targetId?: string;
  postTitle?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  targetId = 'article-body',
  postTitle,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const articleEl = document.getElementById(targetId) || document.querySelector('article');
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (articleEl) {
        const rect = articleEl.getBoundingClientRect();
        const articleTop = rect.top + scrollTop;
        const articleHeight = rect.height;
        // Start reading progress when user reaches the article start
        const startPoint = Math.max(0, articleTop - 140);
        // End reading progress when article content is finished
        const endPoint = articleTop + articleHeight - (window.innerHeight * 0.75);

        if (scrollTop <= startPoint) {
          setProgress(0);
          setIsVisible(false);
          setIsCompleted(false);
        } else if (scrollTop >= endPoint) {
          setProgress(100);
          setIsVisible(true);
          setIsCompleted(true);
        } else {
          const currentProgress = ((scrollTop - startPoint) / (endPoint - startPoint)) * 100;
          const rounded = Math.min(100, Math.max(0, Math.round(currentProgress)));
          setProgress(rounded);
          setIsVisible(scrollTop > 60);
          setIsCompleted(rounded >= 98);
        }
      } else {
        // Fallback to document scroll
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const p = Math.min(100, Math.max(0, Math.round((scrollTop / totalHeight) * 100)));
          setProgress(p);
          setIsVisible(scrollTop > 60);
          setIsCompleted(p >= 98);
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [targetId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Top Screen Progress Bar Track & Fill */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-1 sm:h-1.5 bg-gray-200/60 dark:bg-gray-800/80 backdrop-blur-xs pointer-events-none transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-l from-cyan-400 via-[#035dcd] to-blue-600 dark:from-cyan-300 dark:via-blue-500 dark:to-indigo-500 shadow-[0_0_10px_rgba(3,93,205,0.7)] relative transition-[width] duration-150 ease-out"
          style={{
            width: `${progress}%`,
            float: 'right', // In RTL, fills from right to left
          }}
        >
          {/* Glowing leading indicator */}
          {progress > 0 && progress < 100 && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_8px_#00e5ff] ring-2 ring-cyan-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* 2. Floating Compact Reading Status Indicator (Visible when reading) */}
      <div
        className={`fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 transition-all duration-300 transform ${
          isVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-white/95 dark:bg-[#1f244a]/95 backdrop-blur-md p-1.5 pl-3 rounded-full border border-gray-200/80 dark:border-[#2f366b] shadow-lg text-xs font-bold text-gray-800 dark:text-gray-100 group">
          {/* Progress Circle or Completion Icon */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            {isCompleted ? (
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-in zoom-in-75">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <svg className="w-7 h-7 transform -rotate-90">
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-gray-200 dark:text-gray-700 fill-none"
                />
                <circle
                  cx="14"
                  cy="14"
                  r="11"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={2 * Math.PI * 11}
                  strokeDashoffset={2 * Math.PI * 11 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className="text-[#035dcd] dark:text-blue-400 fill-none transition-all duration-200"
                />
              </svg>
            )}
            {!isCompleted && (
              <BookOpen className="w-3 h-3 text-[#035dcd] dark:text-blue-400 absolute" />
            )}
          </div>

          {/* Reading Percentage Text */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline">
              {isCompleted ? 'اكتملت القراءة' : 'تقدم القراءة:'}
            </span>
            <span className={`font-mono font-black ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#035dcd] dark:text-blue-400'}`}>
              {progress}%
            </span>
          </div>

          {/* Scroll to Top quick button */}
          <button
            onClick={scrollToTop}
            title="الرجوع لأعلى المقال"
            className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#282e5c] hover:bg-[#035dcd] hover:text-white dark:hover:bg-[#035dcd] text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer mr-1"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
