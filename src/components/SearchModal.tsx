import React, { useState, useMemo } from 'react';
import { Search, X, Clock, Tag } from 'lucide-react';
import { Post } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
}) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const quickTags = [
    'ببجي موبايل',
    'الألعاب',
    'الذكاء الاصطناعي',
    'شروحات وحلول',
    'ألعاب بدون نت',
    'تسريع الهاتف',
    'أمان رقمي',
    'حساسية ببجي',
  ];

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedTag) {
      result = result.filter(
        (p) => p.category === selectedTag || p.tags.includes(selectedTag)
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.snippet.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, query, selectedTag]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#252a54] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#2f366b] flex flex-col text-right">
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3 bg-white dark:bg-[#252a54] border-b border-gray-100 dark:border-[#2f366b]">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-400 ml-3 shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مقال، لعبة، شرح، أو أداة ذكاء اصطناعي..."
            className="w-full bg-transparent text-gray-800 dark:text-white placeholder-gray-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
            >
              مسح
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e2348] text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tag Pills (SeoPlus Label002 Cloud) */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-[#1f244a] border-b border-gray-100 dark:border-[#2f366b] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 shrink-0 font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> الوسوم الشائعة:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedTag === null
                ? 'bg-[#035dcd] text-white font-bold'
                : 'bg-gray-200 dark:bg-[#2d325a] text-gray-600 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            الكل
          </button>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-[#035dcd] text-white font-bold'
                  : 'bg-gray-200 dark:bg-[#2d325a] text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#384180]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500">
              <p className="text-base font-semibold">لم يتم العثور على أي نتائج تطابق بحثك</p>
              <p className="text-xs mt-1">جرب كلمات بحث أخرى أو اختر أحد الوسوم المقترحة أعلاه.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  onSelectPost(post);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/60 dark:hover:bg-[#1e2348] border border-transparent hover:border-blue-100 dark:hover:border-[#384180] cursor-pointer transition-all group"
              >
                <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-1 right-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${post.categoryIndex === 0 ? 'bg-[#95281C]' : 'bg-[#035dcd]'}`}>
                    {post.category}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                    {post.snippet}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.date}
                    </span>
                    <span>• {post.readTime}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
