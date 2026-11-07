import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Settings,
  Share2,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  Send,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  Tag,
  ArrowRight,
  FileCode,
  Sparkles,
  ExternalLink,
  Maximize2,
  Bookmark,
} from 'lucide-react';
import { Post, Comment, CategoryInfo } from '../types';
import { Sidebar } from './Sidebar';
import { AdSenseUnit } from './AdSenseUnit';
import { ReadingProgressBar } from './ReadingProgressBar';
import { useFavorites } from '../hooks/useFavorites';
import { TocHeading, processArticleContentAndToc } from '../utils/toc';

export type { TocHeading };

interface PostPageViewProps {
  post: Post;
  allPosts: Post[];
  categories: CategoryInfo[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectPost: (post: Post) => void;
  onBackToHome: () => void;
  onOpenSeoViewer: () => void;
  onOpenImage: (url: string, title?: string) => void;
  onOpenRedirectTool: () => void;
  onSearchQuery: (q: string) => void;
  renderAdSlot?: (
    slotType: 'top' | 'middle' | 'in-article-2' | 'bottom',
    postId: string | number
  ) => React.ReactNode;
}

const EXTERNAL_PRECONNECT_ORIGINS = [
  'https://images.unsplash.com',
  'https://blogger.googleusercontent.com',
  'https://pagead2.googlesyndication.com',
];

function optimizeExternalImageUrl(url: string, targetWidth = 1200, quality = 80): string {
  if (!url) return url;
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('w', String(targetWidth));
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
}

export const PostPageView: React.FC<PostPageViewProps> = ({
  post,
  allPosts,
  categories,
  activeCategory,
  onSelectCategory,
  onSelectPost,
  onBackToHome,
  onOpenSeoViewer,
  onOpenImage,
  onOpenRedirectTool,
  onSearchQuery,
  renderAdSlot,
}) => {
  const renderArticleAd = (
    slotType: 'top' | 'middle' | 'in-article-2' | 'bottom'
  ) =>
    renderAdSlot ? (
      renderAdSlot(slotType, post.id)
    ) : (
      <AdSenseUnit key={`ad-${slotType}-${post.id}`} slotType={slotType} postId={post.id} />
    );
  const [fontSize, setFontSize] = useState(17);
  const [lineHeight, setLineHeight] = useState(2);
  const [showSettings, setShowSettings] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [activeCommentTab, setActiveCommentTab] = useState<'blogger' | 'facebook' | 'disqus'>('blogger');
  const [copiedLink, setCopiedLink] = useState(false);
  const [articlePage, setArticlePage] = useState(1);
  const { isFavorite, toggleFavorite } = useFavorites();
  const isPostSaved = isFavorite(post.id);

  // Comments state
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Scroll to top & inject Preconnect / DNS-Prefetch hints for external image domains (Unsplash, Blogger, etc.)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setComments(post.comments || []);
    setArticlePage(1);
    setIsTocOpen(false);

    if (typeof document === 'undefined') return;

    const origins = new Set<string>(EXTERNAL_PRECONNECT_ORIGINS);
    try {
      if (post.thumbnail && post.thumbnail.startsWith('http')) {
        origins.add(new URL(post.thumbnail).origin);
      }
      if (post.rawContent) {
        const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
        let match: RegExpExecArray | null;
        while ((match = imgRegex.exec(post.rawContent)) !== null) {
          origins.add(new URL(match[1]).origin);
        }
      }
    } catch {
      // Ignore malformed URLs
    }

    origins.forEach((origin) => {
      if (!document.head.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = origin;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);
      }
      if (!document.head.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`)) {
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = origin;
        document.head.appendChild(dnsPrefetch);
      }
    });
  }, [post.id, post.thumbnail, post.rawContent]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCmt: Comment = {
      id: `comment-${Date.now()}`,
      author: newAuthor.trim() || 'زائر كريم',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      date: 'الآن',
      content: newCommentText.trim(),
    };

    setComments((prev) => [newCmt, ...prev]);
    setNewCommentText('');
    setNewAuthor('');
  };

  // Find previous and next posts
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Related posts
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.categoryIndex === post.categoryIndex))
    .slice(0, 3);

  // Pagination support
  const totalArticlePages = post.content?.sections && post.content.sections.length > 1 ? 2 : 1;
  const currentSections =
    totalArticlePages === 1
      ? post.content?.sections || []
      : articlePage === 1
      ? post.content.sections.slice(0, Math.ceil(post.content.sections.length / 2))
      : post.content.sections.slice(Math.ceil(post.content.sections.length / 2));

  // Ensure the featured image is displayed only once in the article.
  // The featured image is already displayed prominently at the top in the dedicated lightbox card.
  // Any duplicate cover/first image embedded inside the article body (rawContent) is cleanly stripped.
  const sanitizedRawContent = useMemo(() => {
    if (!post.rawContent) return '';

    // 1. Client-side browser DOMParser for 100% clean DOM removal
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(post.rawContent, 'text/html');
        const firstImg = doc.querySelector('img');

        if (firstImg) {
          // Identify the closest container for this image
          const table = firstImg.closest('table.tr-caption-container');
          const separator = firstImg.closest('.separator');
          const figure = firstImg.closest('figure');
          const link = firstImg.closest('a');

          if (table) {
            table.remove();
          } else if (separator) {
            separator.remove();
          } else if (figure) {
            figure.remove();
          } else if (link) {
            const parent = link.parentElement;
            if (parent && parent.children.length === 1 && (parent.tagName === 'P' || parent.tagName === 'DIV')) {
              parent.remove();
            } else {
              link.remove();
            }
          } else {
            firstImg.remove();
          }

          return doc.body.innerHTML;
        }
      } catch (err) {
        console.warn('DOMParser failed to clean duplicate image, falling back to string parser:', err);
      }
    }

    // 2. High-precision fallback
    const html = post.rawContent;
    const imgIndex = html.indexOf('<img');
    if (imgIndex === -1) return html;

    const before = html.substring(0, imgIndex);
    const after = html.substring(imgIndex);

    const figureIdx = before.lastIndexOf('<figure');
    const tableIdx = before.lastIndexOf('<table');
    const divSeparatorIdx =
      before.lastIndexOf('<div class="separator"') !== -1
        ? before.lastIndexOf('<div class="separator"')
        : before.lastIndexOf("<div class='separator'");
    const aIdx = before.lastIndexOf('<a');

    if (figureIdx !== -1 && figureIdx > before.lastIndexOf('</figure>')) {
      const endFigure = after.indexOf('</figure>');
      if (endFigure !== -1) {
        return html.substring(0, figureIdx) + after.substring(endFigure + 9);
      }
    }

    if (divSeparatorIdx !== -1 && divSeparatorIdx > before.lastIndexOf('</div>')) {
      const endDiv = after.indexOf('</div>');
      if (endDiv !== -1) {
        return html.substring(0, divSeparatorIdx) + after.substring(endDiv + 6);
      }
    }

    if (tableIdx !== -1 && tableIdx > before.lastIndexOf('</table>')) {
      const endTable = after.indexOf('</table>');
      if (endTable !== -1) {
        return html.substring(0, tableIdx) + after.substring(endTable + 8);
      }
    }

    if (aIdx !== -1 && aIdx > before.lastIndexOf('</a>')) {
      const endA = after.indexOf('</a>');
      if (endA !== -1) {
        return html.substring(0, aIdx) + after.substring(endA + 4);
      }
    }

    const endImg = after.indexOf('>');
    if (endImg !== -1) {
      return before + after.substring(endImg + 1);
    }

    return html;
  }, [post.rawContent]);

  // Automatically extract ONLY h2 and h3 headings, inject semantic English anchor IDs,
  // enforce Lazy Loading & async decoding on all embedded images, and clean legacy raw ad tags
  const { processedHtml, tocHeadings } = useMemo(() => {
    return processArticleContentAndToc(
      sanitizedRawContent,
      post.content?.sections,
      post.slug || String(post.id),
      optimizeExternalImageUrl
    );
  }, [sanitizedRawContent, post.content, post.slug, post.id]);

  // Smart multi-slot article content splitter for balanced in-article ad distribution
  const splitRawContent = useMemo(() => {
    const htmlToSplit = processedHtml || sanitizedRawContent;
    if (!htmlToSplit) return null;

    const pCloseRegex = /<\/p>/gi;
    const pEndPositions: number[] = [];
    let match: RegExpExecArray | null;
    while ((match = pCloseRegex.exec(htmlToSplit)) !== null) {
      pEndPositions.push(match.index + match[0].length);
    }

    if (pEndPositions.length === 0) {
      return { part1: htmlToSplit, part2: '', part3: '' };
    }

    if (pEndPositions.length <= 2) {
      const split1 = pEndPositions[0];
      return {
        part1: htmlToSplit.substring(0, split1),
        part2: htmlToSplit.substring(split1),
        part3: '',
      };
    }

    const firstAdAfterIdx = pEndPositions[1]; // After 2nd paragraph
    // For longer articles (6+ paragraphs), distribute a second in-article ad around 65% of the article
    if (pEndPositions.length >= 6) {
      const secondParagraphIdx = Math.min(
        pEndPositions.length - 2,
        Math.max(3, Math.floor(pEndPositions.length * 0.65))
      );
      const secondAdAfterIdx = pEndPositions[secondParagraphIdx];
      return {
        part1: htmlToSplit.substring(0, firstAdAfterIdx),
        part2: htmlToSplit.substring(firstAdAfterIdx, secondAdAfterIdx),
        part3: htmlToSplit.substring(secondAdAfterIdx),
      };
    }

    return {
      part1: htmlToSplit.substring(0, firstAdAfterIdx),
      part2: htmlToSplit.substring(firstAdAfterIdx),
      part3: '',
    };
  }, [processedHtml, sanitizedRawContent]);

  // Smooth scroll and highlight heading on TOC click, updating #anchor-id in URL without page reload
  const handleScrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      if (typeof window !== 'undefined') {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}#${id}`
        );
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('heading-active-target');
      setTimeout(() => {
        el.classList.remove('heading-active-target');
      }, 2000);
    }
  };

  // Support scrolling to #anchor-id when an article URL is opened directly with a hash
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return;
    const rawAnchor = decodeURIComponent(window.location.hash.replace(/^#/, '')).trim();
    if (!rawAnchor || rawAnchor.includes('/')) return;

    const timer = setTimeout(() => {
      const targetEl = document.getElementById(rawAnchor);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEl.classList.add('heading-active-target');
        setTimeout(() => {
          targetEl.classList.remove('heading-active-target');
        }, 2000);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [post.id, processedHtml]);

  return (
    <div className="w-full text-right animate-in fade-in duration-300">
      {/* Scroll-linked progress bar at the top of the screen */}
      <ReadingProgressBar targetId="article-body" postTitle={post.title} />
      
      {/* 1. Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start w-full max-w-full">
        
        {/* Left/Main Column: Complete Article */}
        <div className="lg:col-span-2 w-full space-y-4 sm:space-y-6 overflow-visible">
          
          <article className="bg-white dark:bg-[#252a54] rounded-2xl shadow-sm border border-gray-100 dark:border-[#2f366b] overflow-visible p-4 sm:p-8">
            
            {/* Top Breadcrumb Hierarchy & Action Controls (الرئيسية / القسم / عنوان المقال) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-[#2f366b] mb-5">
              <nav
                aria-label="التسلسل الهرمي للمقال"
                className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 min-w-0 flex-1"
              >
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('all');
                  }}
                  className="text-[#035dcd] dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>الرئيسية</span>
                </a>
                <span className="text-gray-300 dark:text-gray-600 shrink-0">/</span>
                <a
                  href={`/${post.categorySlug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(post.categorySlug);
                  }}
                  className="text-[#035dcd] dark:text-blue-400 hover:underline shrink-0 cursor-pointer"
                >
                  {post.category}
                </a>
                <span className="text-gray-300 dark:text-gray-600 shrink-0">/</span>
                <span className="text-gray-800 dark:text-gray-100 font-bold truncate max-w-[220px] sm:max-w-md">
                  {post.title}
                </span>
              </nav>

              {/* Action Controls: Save to Favorites & Reading Settings */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => toggleFavorite(post.id, e)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isPostSaved
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-gray-50 dark:bg-[#1f244a] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#384180] hover:border-[#035dcd] hover:text-[#035dcd] dark:hover:text-blue-400'
                  }`}
                  title={isPostSaved ? 'إزالة المقال من المفضلات' : 'حفظ المقال في المفضلات'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isPostSaved ? 'fill-white' : ''}`} />
                  <span>{isPostSaved ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}</span>
                </button>

                <button
                  onClick={() => setShowSettings((prev) => !prev)}
                  className="p-1.5 rounded-xl bg-gray-50 dark:bg-[#1f244a] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#384180] hover:text-[#035dcd] transition-colors cursor-pointer"
                  title="إعدادات القراءة والخط"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reading Settings Drawer (SeoPlus .PostSittings) */}
            {showSettings && (
              <div className="p-4 mb-6 bg-blue-50/70 dark:bg-[#1e2348] rounded-xl border border-blue-100 dark:border-[#2f366b] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">حجم الخط:</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-[#252a54] rounded-lg border border-gray-200 dark:border-[#384180] p-1">
                      <button
                        onClick={() => setFontSize((f) => Math.max(14, f - 1))}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-[#035dcd]">
                        {fontSize}px
                      </span>
                      <button
                        onClick={() => setFontSize((f) => Math.min(28, f + 1))}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">تباعد الأسطر:</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-[#252a54] rounded-lg border border-gray-200 dark:border-[#384180] p-1">
                      <button
                        onClick={() => setLineHeight((l) => Math.max(1.6, Math.round((l - 0.2) * 10) / 10))}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-[#035dcd]">
                        {lineHeight}
                      </span>
                      <button
                        onClick={() => setLineHeight((l) => Math.min(2.8, Math.round((l + 0.2) * 10) / 10))}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFontSize(17);
                    setLineHeight(2);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
                >
                  استعادة الافتراضي
                </button>
              </div>
            )}

            {/* Title ABOVE Featured Image (عنوان المقال فوق الصورة) */}
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white leading-snug mb-5">
              {post.title}
            </h1>

            {/* Featured Image - Full uncropped display */}
            <div className="mb-8 relative group overflow-hidden rounded-2xl border border-gray-100 dark:border-[#2f366b] shadow-md bg-slate-100 dark:bg-[#1e2348] flex items-center justify-center">
              <img
                src={optimizeExternalImageUrl(post.thumbnail, 1200, 82)}
                alt={post.title}
                width={1200}
                height={630}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-contain cursor-pointer block"
                onClick={() => onOpenImage(post.thumbnail, post.title)}
              />
            </div>

            {/* 1. إعلان بداية المقال (قبل النص الأساسي لتحسين تجربة القراءة وCLS) */}
            {renderArticleAd('top')}

            {/* Article Content Area */}
            <div
              id="article-body"
              className="article-text-body space-y-6 text-gray-800 dark:text-gray-200 leading-relaxed"
              style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}em` }}
            >
              {post.rawContent && splitRawContent ? (
                <>
                  {/* المقدمة (Introduction) */}
                  <div
                    className="article-raw-html overflow-x-auto"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'IMG') {
                        const img = target as HTMLImageElement;
                        onOpenImage(img.src, post.title);
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: splitRawContent.part1 }}
                  />

                  {/* Table of Contents (محتوى المقال - بعد المقدمة، مغلق افتراضياً، عناوين H2 فقط) */}
                  {tocHeadings.length > 0 && (
                    <div className="my-6 rounded-2xl border border-gray-200 dark:border-[#384180] bg-gray-50/90 dark:bg-[#1f244a] overflow-hidden shadow-xs text-base">
                      <button
                        type="button"
                        aria-expanded={isTocOpen}
                        aria-controls="article-toc-list"
                        onClick={() => setIsTocOpen(!isTocOpen)}
                        className="w-full flex items-center justify-between px-5 py-3.5 font-bold text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a3160] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#035dcd] shadow-[0_0_8px_rgba(3,93,205,0.6)]" />
                          <span className="font-extrabold text-sm sm:text-base">محتوى المقال (فهرس العناوين)</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#035dcd] dark:text-blue-300">
                            {tocHeadings.length} {tocHeadings.length === 1 ? 'عنوان' : 'عناوين'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#035dcd] dark:text-blue-400 font-semibold">
                          <span>{isTocOpen ? 'إخفاء الفهرس' : 'عرض الفهرس'}</span>
                          {isTocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isTocOpen && (
                        <nav
                          id="article-toc-list"
                          aria-label="جدول محتويات المقال"
                          dir="rtl"
                          className="p-5 pt-3 border-t border-gray-200 dark:border-[#2f366b]"
                        >
                          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            {tocHeadings.map((heading, idx) => (
                              <li key={heading.id} className="font-bold text-gray-900 dark:text-white">
                                <a
                                  href={`#${heading.id}`}
                                  onClick={(e) => handleScrollToHeading(e, heading.id)}
                                  className="group flex items-start gap-2 hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer py-0.5"
                                >
                                  <span className="shrink-0 w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-[#035dcd] dark:text-blue-300 text-[11px] font-black flex items-center justify-center mt-0.5 group-hover:bg-[#035dcd] group-hover:text-white transition-colors">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed group-hover:underline decoration-[#035dcd]/40 underline-offset-4">
                                    {heading.text}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ol>
                        </nav>
                      )}
                    </div>
                  )}

                  {/* 2. إعلان وسط المقال الأول (بعد المقدمة والفهرس) */}
                  {renderArticleAd('middle')}

                  {splitRawContent.part2 && (
                    <div
                      className="article-raw-html overflow-x-auto"
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.tagName === 'IMG') {
                          const img = target as HTMLImageElement;
                          onOpenImage(img.src, post.title);
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: splitRawContent.part2 }}
                    />
                  )}

                  {splitRawContent.part3 && (
                    <>
                      {/* 3. إعلان وسط المقال الثاني للمقالات الطويلة */}
                      {renderArticleAd('in-article-2')}
                      <div
                        className="article-raw-html overflow-x-auto"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.tagName === 'IMG') {
                            const img = target as HTMLImageElement;
                            onOpenImage(img.src, post.title);
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: splitRawContent.part3 }}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  {articlePage === 1 && (
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 border-r-4 border-[#035dcd] pr-4 bg-blue-50/40 dark:bg-[#1f244a] py-3 rounded-l-lg">
                      {post.content.intro}
                    </p>
                  )}

                  {/* Table of Contents after Intro in structured articles */}
                  {tocHeadings.length > 0 && (
                    <div className="my-6 rounded-2xl border border-gray-200 dark:border-[#384180] bg-gray-50/90 dark:bg-[#1f244a] overflow-hidden shadow-xs text-base">
                      <button
                        type="button"
                        aria-expanded={isTocOpen}
                        aria-controls="article-toc-list"
                        onClick={() => setIsTocOpen(!isTocOpen)}
                        className="w-full flex items-center justify-between px-5 py-3.5 font-bold text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2a3160] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#035dcd] shadow-[0_0_8px_rgba(3,93,205,0.6)]" />
                          <span className="font-extrabold text-sm sm:text-base">محتوى المقال (فهرس العناوين)</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#035dcd] dark:text-blue-300">
                            {tocHeadings.length} {tocHeadings.length === 1 ? 'عنوان' : 'عناوين'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#035dcd] dark:text-blue-400 font-semibold">
                          <span>{isTocOpen ? 'إخفاء الفهرس' : 'عرض الفهرس'}</span>
                          {isTocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isTocOpen && (
                        <nav
                          id="article-toc-list"
                          aria-label="جدول محتويات المقال"
                          dir="rtl"
                          className="p-5 pt-3 border-t border-gray-200 dark:border-[#2f366b]"
                        >
                          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            {tocHeadings.map((heading, idx) => (
                              <li key={heading.id} className="font-bold text-gray-900 dark:text-white">
                                <a
                                  href={`#${heading.id}`}
                                  onClick={(e) => handleScrollToHeading(e, heading.id)}
                                  className="group flex items-start gap-2 hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer py-0.5"
                                >
                                  <span className="shrink-0 w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-[#035dcd] dark:text-blue-300 text-[11px] font-black flex items-center justify-center mt-0.5 group-hover:bg-[#035dcd] group-hover:text-white transition-colors">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed group-hover:underline decoration-[#035dcd]/40 underline-offset-4">
                                    {heading.text}
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ol>
                        </nav>
                      )}
                    </div>
                  )}

                  {currentSections.map((sec, secIdx) => {
                    const resolvedSectionId = tocHeadings[secIdx]?.id || sec.id || `section-${secIdx + 1}`;
                    return (
                    <React.Fragment key={resolvedSectionId}>
                      <section className="pt-4">
                        <h2
                          id={resolvedSectionId}
                          className="scroll-mt-24 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 transition-all duration-300"
                        >
                          <span className="w-1.5 h-6 bg-[#035dcd] rounded-full inline-block" />
                          <span>{sec.title}</span>
                        </h2>

                        <div className="space-y-3">
                          {sec.body.map((para, pIdx) => (
                            <p key={pIdx}>{para}</p>
                          ))}
                        </div>

                        {/* Note Callout (SeoPlus .note) */}
                        {sec.note && (
                          <div
                            className={`my-4 p-4 rounded-xl flex items-start gap-3 border text-sm ${
                              sec.note.type === 'warn'
                                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200'
                                : sec.note.type === 'success'
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200'
                                : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-200'
                            }`}
                          >
                            {sec.note.type === 'warn' ? (
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            ) : sec.note.type === 'success' ? (
                              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            ) : (
                              <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            )}
                            <div>{sec.note.text}</div>
                          </div>
                        )}

                        {/* Code snippet with copy area (SeoPlus .areacode) */}
                        {sec.code && (
                          <div className="my-5 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 text-gray-100 shadow-inner">
                            <div className="px-4 py-2 bg-gray-800 flex items-center justify-between text-xs text-gray-300 border-b border-gray-700">
                              <span className="font-mono text-blue-400">&lt;/&gt; كود المشاركة</span>
                              <button
                                onClick={() => {
                                  if (sec.code) navigator.clipboard.writeText(sec.code);
                                }}
                                className="hover:text-white transition-colors"
                              >
                                أضغط لنسخ المحتويات
                              </button>
                            </div>
                            <div className="p-4 font-mono text-xs direction-ltr text-left overflow-x-auto">
                              <code>{sec.code}</code>
                            </div>
                          </div>
                        )}

                        {/* SeoPlus Slide Buttons */}
                        {sec.downloadUrl && (
                          <div className="my-8 text-center flex flex-wrap items-center justify-center gap-4">
                            <a
                              href={sec.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-flex items-center justify-between px-6 py-3.5 w-60 rounded-full border-2 border-[#0099cc] bg-white dark:bg-[#1f244a] text-[#0099cc] hover:bg-[#0099cc] hover:text-white transition-all duration-300 shadow-md font-bold text-sm"
                            >
                              <span>تحميل التحديث المباشر</span>
                              <div className="w-8 h-8 rounded-full bg-[#0099cc] text-white group-hover:bg-white group-hover:text-[#0099cc] flex items-center justify-center transition-all">
                                <Download className="w-4 h-4" />
                              </div>
                            </a>

                            <a
                              href={sec.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative inline-flex items-center justify-between px-6 py-3.5 w-60 rounded-full border-2 border-[#efa666] bg-white dark:bg-[#1f244a] text-[#efa666] hover:bg-[#efa666] hover:text-white transition-all duration-300 shadow-md font-bold text-sm"
                            >
                              <span>رابط بديل وسريع</span>
                              <div className="w-8 h-8 rounded-full bg-[#efa666] text-white group-hover:bg-white group-hover:text-[#efa666] flex items-center justify-center transition-all">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </a>
                          </div>
                        )}
                      </section>

                      {secIdx === 0 && renderArticleAd('middle')}
                      {currentSections.length >= 4 &&
                        secIdx === Math.floor(currentSections.length / 2) &&
                        renderArticleAd('in-article-2')}
                    </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>

            {/* SeoPlus Multi-page Article Navigation (↚ PageBreak) */}
            {totalArticlePages > 1 && (
              <div className="my-8 p-4 rounded-xl bg-gray-50 dark:bg-[#1e2348] border border-gray-200 dark:border-[#2f366b] flex items-center justify-between">
                <button
                  onClick={() => setArticlePage(1)}
                  disabled={articlePage === 1}
                  className="px-4 py-2 rounded-lg bg-[#035dcd] text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الصفحة السابقة</span>
                </button>

                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  صفحة {articlePage} من {totalArticlePages}
                </span>

                <button
                  onClick={() => setArticlePage(2)}
                  disabled={articlePage === 2}
                  className="px-4 py-2 rounded-lg bg-[#035dcd] text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>الصفحة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tags Pills (SeoPlus .post-tags) */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2f366b] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 ml-2">
                <Tag className="w-3.5 h-3.5" /> الأقسام والوسوم:
              </span>
              {post.tags.map((tag) => {
                const cleanTag = tag.replace(/\s*AI$/i, '').trim();
                const aiTagPaths: Record<string, string> = {
                  'الذكاء الاصطناعي': '/AI/',
                  'أدوات': '/AI/Tools/',
                  'تحميلات': '/AI/Downloads/',
                  'الربح': '/AI/Earning/',
                  'مقارنات': '/AI/Tools-Comparison/',
                };
                const tagHref =
                  post.categorySlug === 'AI' && aiTagPaths[cleanTag]
                    ? aiTagPaths[cleanTag]
                    : `/${post.categorySlug}/`;
                const displayTag =
                  post.categorySlug === 'AI' && !/\s*AI$/i.test(tag)
                    ? `${tag} AI`
                    : tag;
                return (
                  <a
                    key={tag}
                    href={tagHref}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCategory(cleanTag);
                    }}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#1e2348] text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-[#035dcd] hover:text-white transition-colors cursor-pointer"
                  >
                    #{displayTag}
                  </a>
                );
              })}

              <button
                onClick={(e) => toggleFavorite(post.id, e)}
                className={`mr-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isPostSaved
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-blue-50 dark:bg-[#1e2348] text-[#035dcd] dark:text-blue-300 hover:bg-[#035dcd] hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isPostSaved ? 'fill-white' : ''}`} />
                <span>{isPostSaved ? 'محفوظ في المفضلات' : 'أضف إلى المفضلات'}</span>
              </button>
            </div>

            {/* Next / Previous Post Navigation (SeoPlus .page-navigation) */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-100 dark:border-[#2f366b] py-6">
              {prevPost ? (
                <div
                  onClick={() => onSelectPost(prevPost)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-[#1f244a] hover:bg-blue-50/60 dark:hover:bg-[#2d325a] border border-gray-100 dark:border-[#2f366b] cursor-pointer transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#035dcd] text-white flex items-center justify-center shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 block font-semibold">المقال السابق</span>
                    <h5 className="text-xs font-bold text-gray-800 dark:text-white truncate group-hover:text-[#035dcd]">
                      {prevPost.title}
                    </h5>
                  </div>
                </div>
              ) : <div />}

              {nextPost ? (
                <div
                  onClick={() => onSelectPost(nextPost)}
                  className="flex items-center justify-end gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-[#1f244a] hover:bg-blue-50/60 dark:hover:bg-[#2d325a] border border-gray-100 dark:border-[#2f366b] cursor-pointer transition-all group text-left"
                >
                  <div className="min-w-0 text-right">
                    <span className="text-[10px] text-gray-400 block font-semibold">المقال التالي</span>
                    <h5 className="text-xs font-bold text-gray-800 dark:text-white truncate group-hover:text-[#035dcd]">
                      {nextPost.title}
                    </h5>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#035dcd] text-white flex items-center justify-center shrink-0">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </div>
              ) : <div />}
            </div>

            {/* Related Posts (SeoPlus .RelatedPosts) */}
            {relatedPosts.length > 0 && (
              <div className="mt-8">
                <div className="headline-seo pb-3 mb-5 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    مقالات قد تهمك في نفس القسم
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPosts.map((rPost) => {
                    const rSaved = isFavorite(rPost.id);
                    return (
                      <div
                        key={rPost.id}
                        onClick={() => onSelectPost(rPost)}
                        className="group cursor-pointer rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] hover:shadow-lg transition-all"
                      >
                        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-[#1e2348] flex items-center justify-center">
                          <img
                            src={optimizeExternalImageUrl(rPost.thumbnail, 480, 75)}
                            alt={rPost.title}
                            width={480}
                            height={270}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={(e) => toggleFavorite(rPost.id, e)}
                            className={`absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-xs transition-all cursor-pointer ${
                              rSaved
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-black/50 text-white hover:bg-[#035dcd]'
                            }`}
                            title={rSaved ? 'إزالة من المفضلات' : 'إضافة إلى المفضلات'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${rSaved ? 'fill-white' : ''}`} />
                          </button>
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-bold text-gray-800 dark:text-white line-clamp-2 group-hover:text-[#035dcd] transition-colors">
                            {rPost.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 mt-2 block">
                            {rPost.date}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. إعلان آخر المقال (يُوضع قبل قسم التعليقات مباشرة) */}
            {renderArticleAd('bottom')}

            {/* Multi-Tab Comments Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-[#2f366b]">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#035dcd]" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    التعليقات ({comments.length})
                  </h3>
                </div>

                {/* Tabs Switcher: Blogger, Facebook, Disqus */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-[#1e2348] text-xs">
                  <button
                    onClick={() => setActiveCommentTab('blogger')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeCommentTab === 'blogger'
                        ? 'bg-[#fc9644] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                    }`}
                  >
                    تعليقات Blogger
                  </button>
                  <button
                    onClick={() => setActiveCommentTab('facebook')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeCommentTab === 'facebook'
                        ? 'bg-[#1877F2] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                    }`}
                  >
                    تعليقات Facebook
                  </button>
                  <button
                    onClick={() => setActiveCommentTab('disqus')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      activeCommentTab === 'disqus'
                        ? 'bg-[#2e9fff] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                    }`}
                  >
                    تعليقات Disqus
                  </button>
                </div>
              </div>

              {/* Tab 1: Blogger Real Interactive Form */}
              {activeCommentTab === 'blogger' && (
                <div className="space-y-6">
                  {/* Add Comment Form */}
                  <form
                    onSubmit={handleAddComment}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      <span>إضافة تعليق جديد على هذا المقال:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="اسمك الكريم (اختياري)..."
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-gray-200 dark:border-[#384180] bg-white dark:bg-[#252a54] text-gray-800 dark:text-white focus:outline-none focus:border-[#035dcd]"
                      />
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="اكتب تعليقك أو استفسارك هنا بكل احترام..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 dark:border-[#384180] bg-white dark:bg-[#252a54] text-gray-800 dark:text-white focus:outline-none focus:border-[#035dcd] resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 -rotate-90" />
                        <span>نشر التعليق</span>
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <p className="text-center py-6 text-xs text-gray-400">
                        كن أول من يعلق على هذا المقال!
                      </p>
                    ) : (
                      comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="p-4 rounded-xl bg-white dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] flex items-start gap-3 shadow-sm"
                        >
                          <img
                            src={optimizeExternalImageUrl(cmt.avatar, 96, 75)}
                            alt={cmt.author}
                            width={36}
                            height={36}
                            loading="lazy"
                            decoding="async"
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-gray-900 dark:text-white">
                                {cmt.author}
                              </span>
                              <span className="text-[10px] text-gray-400">{cmt.date}</span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                              {cmt.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Facebook Comments Simulator */}
              {activeCommentTab === 'facebook' && (
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] text-center text-xs text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                    <ThumbsUp className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                    إضافة تعليقات Facebook الاجتماعية مفعّلة
                  </p>
                  <p className="text-gray-400">
                    يمكن للمستخدمين تسجيل الدخول بحساب Facebook وكتابة التعليق مباشرة ومشاركته على يومياتهم.
                  </p>
                </div>
              )}

              {/* Tab 3: Disqus Simulator */}
              {activeCommentTab === 'disqus' && (
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] text-center text-xs text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#2e9fff]/10 flex items-center justify-center text-[#2e9fff]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                    منظومة تعليقات Disqus العالمية
                  </p>
                  <p className="text-gray-400">
                    تدعم التفاعل السريع، التصويت الإيجابي/السلبي، وإشعارات البريد الفورية.
                  </p>
                </div>
              )}
            </div>

          </article>
        </div>

        {/* Right/Sidebar Column: SeoPlus Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar
            categories={categories}
            posts={allPosts}
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
            onSelectPost={onSelectPost}
            onOpenRedirectTool={onOpenRedirectTool}
            onOpenSeoViewer={onOpenSeoViewer}
            onSearchQuery={onSearchQuery}
          />
        </div>

      </div>

    </div>
  );
};
