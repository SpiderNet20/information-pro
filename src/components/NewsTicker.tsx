import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { Post } from '../types';

interface NewsTickerProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ posts, onSelectPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || posts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, posts.length]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full my-4 bg-white dark:bg-[#252a54] rounded-xl shadow-sm border border-gray-100 dark:border-[#2f366b] overflow-hidden flex items-center transition-colors"
    >
      {/* Badge (ShreetTitle in SeoPlus) */}
      <div className="bg-[#035dcd] text-white px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 select-none">
        <Newspaper className="w-4 h-4" />
        <span>أخر الأخبار</span>
      </div>

      {/* Ticker Text */}
      <div className="flex-1 px-4 py-2 overflow-hidden text-right">
        <div
          onClick={() => onSelectPost(currentPost)}
          className="cursor-pointer group flex items-center gap-2 text-xs sm:text-sm text-gray-800 dark:text-gray-200"
        >
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
            <Clock className="w-3 h-3 text-[#035dcd]" /> {currentPost.date}
          </span>
          <span className="font-semibold group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors truncate">
            {currentPost.title}
          </span>
        </div>
      </div>

      {/* Prev / Next controls */}
      <div className="flex items-center gap-1 px-2 shrink-0 border-r border-gray-100 dark:border-[#2f366b]">
        <button
          onClick={handlePrev}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1e2348] text-gray-500 transition-colors"
          title="السابق"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1e2348] text-gray-500 transition-colors"
          title="التالي"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
