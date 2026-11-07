import React, { useState, useMemo } from 'react';
import {
  X,
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
  ChevronRight,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { Post, Comment } from '../types';
import { AdSenseUnit } from './AdSenseUnit';
import { ReadingProgressBar } from './ReadingProgressBar';

interface ArticleModalProps {
  post: Post | null;
  onClose: () => void;
  onSelectPost: (post: Post) => void;
  onOpenSeoViewer?: () => void;
  allPosts: Post[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  post,
  onClose,
  onSelectPost,
  onOpenSeoViewer,
  allPosts,
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(2);
  const [showSettings, setShowSettings] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [activeCommentTab, setActiveCommentTab] = useState<'blogger' | 'facebook' | 'disqus'>('blogger');
  const [copiedLink, setCopiedLink] = useState(false);
  const [articlePage, setArticlePage] = useState(1); // For SeoPlus ↚ PageBreak

  // Comments state
  const [comments, setComments] = useState<Comment[]>(post?.comments || []);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  if (!post) return null;

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

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.categoryIndex === post.categoryIndex))
    .slice(0, 3);

  // Divide sections into two pages if there are 2 or more sections (simulating SeoPlus PageBreak)
  const totalArticlePages = post.content.sections.length > 1 ? 2 : 1;
  const currentSections =
    totalArticlePages === 1
      ? post.content.sections
      : articlePage === 1
      ? post.content.sections.slice(0, Math.ceil(post.content.sections.length / 2))
      : post.content.sections.slice(Math.ceil(post.content.sections.length / 2));

  // Automatically extract ONLY h2 and h3 headings and inject navigation anchor IDs
  const { processedHtml, tocHeadings } = useMemo(() => {
    if (!post?.rawContent) {
      const headings: { id: string; text: string; level: 'h2' | 'h3' }[] = [];
      if (post?.content?.sections) {
        post.content.sections.forEach((sec, idx) => {
          headings.push({
            id: sec.id || `section-modal-${idx}`,
            text: sec.title,
            level: 'h2',
          });
        });
      }
      return { processedHtml: '', tocHeadings: headings };
    }

    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(post.rawContent, 'text/html');
        // Extract ONLY h2 and h3 headings
        const headingElements = doc.querySelectorAll('h2, h3');
        const headings: { id: string; text: string; level: 'h2' | 'h3' }[] = [];

        headingElements.forEach((el, index) => {
          const text = el.textContent?.trim() || '';
          if (!text) return;

          const level = el.tagName.toLowerCase() as 'h2' | 'h3';
          const id = `modal-toc-${level}-${index}`;

          el.setAttribute('id', id);
          el.classList.add('scroll-mt-24', 'transition-all', 'duration-300');

          headings.push({
            id,
            text,
            level,
          });
        });

        return {
          processedHtml: doc.body.innerHTML,
          tocHeadings: headings,
        };
      } catch (err) {
        console.warn('Failed to parse headings in ArticleModal:', err);
      }
    }

    const headings: { id: string; text: string; level: 'h2' | 'h3' }[] = [];
    let index = 0;
    const processedHtml = post.rawContent.replace(
      /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attrs, inner) => {
        const level = tag.toLowerCase() as 'h2' | 'h3';
        const cleanText = inner.replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return match;

        const id = `modal-toc-${level}-${index++}`;
        headings.push({ id, text: cleanText, level });

        let cleanAttrs = attrs;
        if (/id=["'][^"']*["']/i.test(cleanAttrs)) {
          cleanAttrs = cleanAttrs.replace(/id=["'][^"']*["']/i, `id="${id}"`);
        } else {
          cleanAttrs = ` id="${id}" ${cleanAttrs}`;
        }

        return `<${tag}${cleanAttrs} class="scroll-mt-24 transition-all duration-300">${inner}</${tag}>`;
      }
    );

    return { processedHtml, tocHeadings: headings };
  }, [post?.rawContent, post?.content]);

  // Split processed HTML content after the second paragraph for in-article ad placement
  const splitRawContent = useMemo(() => {
    const htmlToSplit = processedHtml || post?.rawContent;
    if (!htmlToSplit) return null;

    const lower = htmlToSplit.toLowerCase();
    const pTag = '</p>';
    const firstP = lower.indexOf(pTag);

    if (firstP === -1) {
      return { before: htmlToSplit, after: '' };
    }

    const secondP = lower.indexOf(pTag, firstP + pTag.length);
    if (secondP === -1) {
      return {
        before: htmlToSplit.substring(0, firstP + pTag.length),
        after: htmlToSplit.substring(firstP + pTag.length),
      };
    }

    const splitIdx = secondP + pTag.length;
    return {
      before: htmlToSplit.substring(0, splitIdx),
      after: htmlToSplit.substring(splitIdx),
    };
  }, [processedHtml, post?.rawContent]);

  const handleScrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('heading-active-target');
      setTimeout(() => {
        el.classList.remove('heading-active-target');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Scroll-linked reading progress bar */}
      <ReadingProgressBar targetId="article-body" postTitle={post.title} />

      <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-6 flex items-center justify-center">
        <div className="relative w-full max-w-4xl bg-white dark:bg-[#252a54] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#2f366b] text-right">
          
          {/* Top Bar Navigation (SeoPlus Header for Post) */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 dark:bg-[#252a54]/95 backdrop-blur border-b border-gray-100 dark:border-[#2f366b]">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded text-xs font-bold text-white cat-badge-${post.categoryIndex}`}>
                {post.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Post Settings Trigger Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#384180] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1e2348] text-xs font-medium transition-colors"
                title="تخصيص الخط وقراءة المقال"
              >
                <Settings className="w-3.5 h-3.5 text-[#035dcd]" />
                <span className="hidden sm:inline">إعدادات القراءة</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e2348] text-gray-500 dark:text-gray-400 transition-colors"
                title="إغلاق المقال"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Floating Settings Panel (SeoPlus .PostSittings) */}
          {showSettings && (
            <div className="p-4 bg-blue-50/70 dark:bg-[#1e2348] border-b border-blue-100 dark:border-[#2f366b] flex flex-wrap items-center justify-between gap-4 text-xs">
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
                      onClick={() => setFontSize((f) => Math.min(26, f + 1))}
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
                  setFontSize(16);
                  setLineHeight(2);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                استعادة الافتراضي
              </button>
            </div>
          )}

          {/* Article Header (SeoPlus .bobxed) */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-snug mb-4">
              {post.title}
            </h1>

            {/* Author & Meta Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-[#2f366b]">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#035dcd]"
                />
                <div>
                  <div className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#035dcd]" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.date}
                    </span>
                    <span>• {post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-[#1e2348] hover:bg-gray-200 dark:hover:bg-[#384180] text-gray-700 dark:text-gray-200 text-xs flex items-center gap-1 transition-colors"
                  title="نسخ رابط المقال"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-[#1e2348] hover:bg-gray-200 dark:hover:bg-[#384180] text-gray-700 dark:text-gray-200 text-xs flex items-center gap-1 transition-colors"
                  title="طباعة المقال"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Top Ad Unit Box (SeoPlus #top-a3lan) */}
            <div className="my-5 p-3 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-dashed border-gray-300 dark:border-gray-700 text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                إعلان ممول
              </span>
              <div className="py-2 text-xs font-bold text-[#035dcd] dark:text-blue-400">
                العنكبوت للمعلومات: حمل أحدث التطبيقات والبرامج بروابط فحص آمنة ومباشرة 100%
              </div>
            </div>

            {/* Hero Image */}
            <div className="my-6 rounded-2xl overflow-hidden max-h-[420px] bg-gray-100 dark:bg-gray-800 shadow-md">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 1. إعلان أول المقال (تحت العنوان مباشرة أو أسفل صورة الغلاف) */}
            <AdSenseUnit key={`modal-ad-top-${post.id}`} slotType="top" postId={post.id} />

            {/* Table of Contents (محتوى المقال - فهرس العناوين: h2 و h3 فقط) */}
            {tocHeadings.length > 0 && (
              <div className="my-6 rounded-2xl border border-gray-200 dark:border-[#384180] bg-gray-50/90 dark:bg-[#1f244a] overflow-hidden shadow-xs">
                <button
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
                  <div className="p-5 pt-3 border-t border-gray-200 dark:border-[#2f366b]">
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {tocHeadings.map((heading, idx) => (
                        <li
                          key={heading.id}
                          className={`transition-all duration-150 ${
                            heading.level === 'h3'
                              ? 'pr-6 sm:pr-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400'
                              : 'font-bold text-gray-900 dark:text-white'
                          }`}
                        >
                          <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleScrollToHeading(e, heading.id)}
                            className="group flex items-start gap-2 hover:text-[#035dcd] dark:hover:text-blue-400 transition-colors cursor-pointer py-0.5"
                          >
                            {heading.level === 'h2' ? (
                              <span className="shrink-0 w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-[#035dcd] dark:text-blue-300 text-[11px] font-black flex items-center justify-center mt-0.5 group-hover:bg-[#035dcd] group-hover:text-white transition-colors">
                                {idx + 1}
                              </span>
                            ) : (
                              <span className="shrink-0 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 group-hover:bg-[#035dcd] dark:group-hover:bg-blue-400 transition-colors" />
                            )}
                            <span className="leading-relaxed group-hover:underline decoration-[#035dcd]/40 underline-offset-4">
                              {heading.text}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Article Content with Custom Font Size & Line Height */}
            <div
              className="article-text-body space-y-6 text-gray-800 dark:text-gray-200 leading-relaxed"
              style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}em` }}
            >
              {post.rawContent && splitRawContent ? (
                <>
                  <div
                    className="article-raw-html overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: splitRawContent.before }}
                  />

                  {/* 2. إعلان داخل المقالة (يُوضع بعد الفقرة الثانية أو الثالثة بين العناوين) */}
                  <AdSenseUnit key={`modal-ad-mid-${post.id}`} slotType="middle" postId={post.id} />

                  {splitRawContent.after && (
                    <div
                      className="article-raw-html overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: splitRawContent.after }}
                    />
                  )}
                </>
              ) : (
                <>
                  {articlePage === 1 && (
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 border-r-4 border-[#035dcd] pr-4 bg-blue-50/40 dark:bg-[#1f244a] py-3 rounded-l-lg">
                      {post.content.intro}
                    </p>
                  )}

                  {currentSections.map((sec, secIdx) => (
                    <React.Fragment key={sec.id}>
                      <section id={sec.id} className="scroll-mt-20 pt-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
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

                      {/* 2. إعلان داخل المقالة (يُوضع بعد الفقرة الثانية أو القسم الأول) */}
                      {secIdx === 0 && (
                        <AdSenseUnit key={`modal-ad-mid-${post.id}`} slotType="middle" postId={post.id} />
                      )}
                    </React.Fragment>
                  ))}
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
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#1e2348] text-gray-700 dark:text-gray-300 text-xs hover:bg-[#035dcd] hover:text-white transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Social Share Bar */}
            <div className="my-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#1e2348] dark:to-[#222750] border border-blue-100 dark:border-[#2f366b]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#035dcd]" />
                  <span className="font-bold text-sm text-gray-800 dark:text-white">
                    شارك المقال مع أصدقائك:
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    فيسبوك
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    واتساب
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-[#0088cc] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    تيليجرام
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-[#1DA1F2] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    تويتر (X)
                  </a>
                </div>
              </div>
            </div>

            {/* Author Box (SeoPlus .author-posts) */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] flex items-start gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#035dcd] shrink-0"
              />
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  عن الكاتب: {post.author.name}
                </h4>
                <span className="text-xs text-[#035dcd] dark:text-blue-400 font-semibold block mb-1">
                  {post.author.role}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>

            {/* Related Posts (SeoPlus .RelatedPosts) */}
            {relatedPosts.length > 0 && (
              <div className="mt-10">
                <div className="headline-seo pb-3 mb-5 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    مقالات قد تهمك في نفس القسم
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPosts.map((rPost) => (
                    <div
                      key={rPost.id}
                      onClick={() => onSelectPost(rPost)}
                      className="group cursor-pointer rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] hover:shadow-lg transition-all"
                    >
                      <div className="h-32 overflow-hidden bg-gray-200">
                        <img
                          src={rPost.thumbnail}
                          alt={rPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
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
                  ))}
                </div>
              </div>
            )}

            {/* 3. إعلان آخر المقال (يُوضع قبل قسم التعليقات مباشرة) */}
            <AdSenseUnit key={`modal-ad-bottom-${post.id}`} slotType="bottom" postId={post.id} />

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
                            src={cmt.avatar}
                            alt={cmt.author}
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

          </div>
        </div>
      </div>
    </div>
  );
};
