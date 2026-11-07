import React from 'react';
import { Clock, Sparkles, Bookmark } from 'lucide-react';
import { Post } from '../types';
import { useFavorites } from '../hooks/useFavorites';

interface FeaturedSliderProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ posts, onSelectPost }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 4);

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="headline-seo pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#035dcd]" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            احدث المقالات المميزة
          </h2>
        </div>
        <span className="hidden sm:block text-xs text-gray-400 font-medium">مختارات المحررين</span>
      </div>

      {/* Sp-slide4 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Main Prominent Post (Spans 2 columns on desktop) */}
        {mainPost && (
          <div
            onClick={() => onSelectPost(mainPost)}
            className="md:col-span-2 group relative h-60 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md bg-gray-900"
          >
            {/* Background Image */}
            <img
              src={mainPost.thumbnail}
              alt={mainPost.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-85"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Bookmark Button */}
            <button
              onClick={(e) => toggleFavorite(mainPost.id, e)}
              className={`absolute top-4 left-4 z-20 p-2 rounded-xl backdrop-blur-xs transition-all cursor-pointer ${
                isFavorite(mainPost.id)
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-black/50 text-white hover:bg-[#035dcd]'
              }`}
              title={isFavorite(mainPost.id) ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite(mainPost.id) ? 'fill-white' : ''}`} />
            </button>

            {/* Content info */}
            <div className="absolute bottom-0 right-0 left-0 p-5 sm:p-7 text-white text-right z-10 flex flex-col justify-end">
              <span className={`self-start text-xs font-bold text-white px-3 py-1 rounded mb-2.5 shadow-sm cat-badge-${mainPost.categoryIndex}`}>
                {mainPost.category}
              </span>

              <h3 className="text-base sm:text-2xl font-black leading-snug group-hover:text-blue-300 transition-colors drop-shadow-md">
                {mainPost.title}
              </h3>

              <p className="hidden sm:block text-xs text-gray-200 mt-2 line-clamp-2 max-w-2xl opacity-90">
                {mainPost.snippet}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-300 mt-3 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> {mainPost.date}
                </span>
                <span>• {mainPost.readTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Side Stack - Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-3 px-3 gap-3.5 md:mx-0 md:px-0 md:grid md:grid-cols-1 md:overflow-visible">
          {sidePosts.map((post) => {
            const saved = isFavorite(post.id);
            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="shrink-0 w-[78%] snap-start md:w-auto group relative h-40 sm:h-44 md:h-full rounded-2xl overflow-hidden cursor-pointer shadow-md bg-gray-900"
              >
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <button
                  onClick={(e) => toggleFavorite(post.id, e)}
                  className={`absolute top-3 left-3 z-20 p-1.5 rounded-lg backdrop-blur-xs transition-all cursor-pointer ${
                    saved
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-black/50 text-white hover:bg-[#035dcd]'
                  }`}
                  title={saved ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
                </button>

                <div className="absolute bottom-0 right-0 left-0 p-4 text-white text-right z-10">
                  <span className={`inline-block text-[10px] font-bold text-white px-2 py-0.5 rounded mb-1.5 cat-badge-${post.categoryIndex}`}>
                    {post.category}
                  </span>

                  <h4 className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-gray-300 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" /> {post.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

