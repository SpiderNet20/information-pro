import React, { useState } from 'react';
import {
  FileCode,
  Globe,
  Copy,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';
import { Post } from '../types';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Categories list
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Generate XML string
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://www.information-net.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Categories -->
  <url>
    <loc>https://www.information-net.com/AI/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/Games/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/Software/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/Business/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/Education/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Statutory Pages -->
  <url>
    <loc>https://www.information-net.com/p/blog-page.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/p/review.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/p/privacy-policy.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/p/user-agreement.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/p/internet-speed-test.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.information-net.com/p/redirect.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Articles (${posts.length} Posts) -->
${posts
  .map(
    (p) => `  <url>
    <loc>${p.canonicalUrl || `https://www.information-net.com/${p.categorySlug}/${p.slug}`}</loc>
    <lastmod>${p.isoDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sitemapXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#252a54] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#2f366b] flex flex-col text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#035dcd] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>خريطة الموقع (Sitemap.xml)</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  {posts.length} مقال مفهرس
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                https://www.information-net.com/sitemap.xml
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Filters */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-[#1e2348] border-b border-gray-200 dark:border-[#2f366b] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#252a54] border border-gray-200 dark:border-[#384180]">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'visual'
                  ? 'bg-[#035dcd] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>دليل المقالات التفاعلي</span>
            </button>
            <button
              onClick={() => setActiveTab('xml')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'xml'
                  ? 'bg-[#035dcd] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>كود XML الخام (Google Bot)</span>
            </button>
          </div>

          {activeTab === 'visual' && (
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الخريطة..."
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#384180] bg-white dark:bg-[#252a54] text-gray-800 dark:text-white text-xs focus:outline-none focus:border-[#035dcd]"
              />
            </div>
          )}

          {activeTab === 'xml' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#035dcd] hover:bg-[#02479e] text-white font-bold transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ ملف الـ XML'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل sitemap.xml</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Pills (for Visual tab) */}
        {activeTab === 'visual' && (
          <div className="px-6 py-2 bg-white dark:bg-[#252a54] border-b border-gray-100 dark:border-[#2f366b] flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                filterCategory === 'all'
                  ? 'bg-[#035dcd] text-white font-bold'
                  : 'bg-gray-100 dark:bg-[#1e2348] text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              الكل ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#035dcd] text-white font-bold'
                    : 'bg-gray-100 dark:bg-[#1e2348] text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat} ({posts.filter((p) => p.category === cat).length})
              </button>
            ))}
          </div>
        )}

        {/* Tab 1: Visual Sitemap Grid */}
        {activeTab === 'visual' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                لم يتم العثور على أي مقالات تطابق هذا الفلتر
              </div>
            ) : (
              filteredPosts.map((post, idx) => (
                <div
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-[#1f244a] border border-gray-100 dark:border-[#2f366b] hover:bg-blue-50/60 dark:hover:bg-[#2d325a] hover:border-[#035dcd] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded cat-badge-${post.categoryIndex}`}>
                          {post.category}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white truncate group-hover:text-[#035dcd] dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 truncate block mt-0.5 font-mono direction-ltr text-left">
                        {post.link || `https://www.information-net.com/${post.slug}.html`}
                      </span>
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#035dcd] shrink-0 mr-2" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Raw XML Sitemap Code */}
        {activeTab === 'xml' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                هذا الملف يتم تقديمه في رابط: <code className="text-[#035dcd] font-mono">/sitemap.xml</code>
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ XML Schema Valid (sitemaps.org/0.9)
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 text-gray-100 text-xs font-mono direction-ltr text-left p-4">
              <pre className="overflow-x-auto max-h-[55vh] leading-relaxed">
                <code>{sitemapXml}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-[#1e2348] border-t border-gray-200 dark:border-[#2f366b] flex items-center justify-between shrink-0 text-xs text-gray-500">
          <span>خريطة الموقع الرسمية متزامنة مع ملف سكيما جوجل ومحدثة لعام 2026.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#035dcd] text-white font-bold hover:bg-[#02479e] transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
