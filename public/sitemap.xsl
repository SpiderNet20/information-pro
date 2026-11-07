<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="ar" dir="rtl">
      <head>
        <title>خريطة الموقع XML Sitemap | العنكبوت للمعلومات (information-net)</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f4f6fb;
            color: #1e293b;
            line-height: 1.6;
            padding: 24px 16px 48px;
          }
          .container {
            max-width: 1140px;
            margin: 0 auto;
          }
          .header {
            background: linear-gradient(135deg, #035dcd 0%, #1e40af 100%);
            color: #ffffff;
            border-radius: 16px;
            padding: 28px 32px;
            margin-bottom: 20px;
            box-shadow: 0 10px 25px -5px rgba(3, 93, 205, 0.25);
          }
          .header-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 10px;
          }
          .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.18);
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 999px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 6px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.92;
          }
          .nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;
          }
          .nav-links a {
            background: rgba(255, 255, 255, 0.14);
            color: #ffffff;
            text-decoration: none;
            font-size: 12px;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            transition: background 0.15s;
          }
          .nav-links a:hover {
            background: rgba(255, 255, 255, 0.28);
          }
          .stats-bar {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px 20px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 13px;
            font-weight: 700;
            color: #334155;
          }
          .stats-count {
            color: #035dcd;
            font-size: 15px;
            font-weight: 800;
          }
          .card {
            background: #ffffff;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: right;
          }
          th {
            background: #f8fafc;
            color: #475569;
            font-size: 12px;
            font-weight: 800;
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
            vertical-align: middle;
          }
          tr:hover td {
            background: #f8fafc;
          }
          td.url-cell {
            direction: ltr;
            text-align: left;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12.5px;
          }
          td.url-cell a {
            color: #035dcd;
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
          }
          td.url-cell a:hover {
            text-decoration: underline;
          }
          .pill {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            background: #eff6ff;
            color: #035dcd;
          }
          .priority-high {
            background: #ecfdf5;
            color: #059669;
          }
          .date-cell {
            direction: ltr;
            text-align: right;
            color: #64748b;
            font-size: 12px;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-top">
              <span class="badge">XML Sitemap الرسمي • متوافق مع Google Search Console</span>
              <span class="badge">information-net.com</span>
            </div>
            <h1>خريطة الموقع (XML Sitemap) — العنكبوت للمعلومات</h1>
            <p>هذا الملف مخصص لمحركات البحث (Googlebot / Bingbot) لفهرسة جميع صفحات الموقع، أقسام التحميلات، المقالات، والتطبيقات بشكل فوري.</p>
            <div class="nav-links">
              <a href="/">الصفحة الرئيسية</a>
              <a href="/sitemap">خريطة الموقع التفاعلية</a>
              <a href="/sitemap.xml">sitemap.xml (الشامل)</a>
              <a href="/sitemap_index.xml">sitemap_index.xml</a>
              <a href="/sitemap-downloads.xml">sitemap-downloads.xml</a>
              <a href="/sitemap-blog.xml">sitemap-blog.xml</a>
              <a href="/sitemap-services.xml">sitemap-services.xml</a>
              <a href="/sitemap-pages.xml">sitemap-pages.xml</a>
            </div>
          </div>

          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <div class="stats-bar">
              <span>إجمالي ملفات الخرائط الفرعية في الفهرس: <span class="stats-count"><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> ملفات XML</span></span>
              <span>الحالة: جاهز للأرشفة (200 OK)</span>
            </div>
            <div class="card">
              <table>
                <thead>
                  <tr>
                    <th style="width: 60px">#</th>
                    <th>رابط ملف الخريطة (Sitemap URL)</th>
                    <th style="width: 180px">آخر تحديث (Last Modified)</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <tr>
                      <td><xsl:value-of select="position()"/></td>
                      <td class="url-cell">
                        <xsl:variable name="sitemapURL"><xsl:value-of select="sitemap:loc"/></xsl:variable>
                        <a href="{$sitemapURL}"><xsl:value-of select="sitemap:loc"/></a>
                      </td>
                      <td class="date-cell"><xsl:value-of select="sitemap:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>

          <xsl:if test="count(sitemap:urlset/sitemap:url) &gt; 0">
            <div class="stats-bar">
              <span>إجمالي الروابط المفهرسة في هذه الخريطة: <span class="stats-count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> رابط (URL)</span></span>
              <span>النطاق الرسمي: https://www.information-net.com</span>
            </div>
            <div class="card">
              <table>
                <thead>
                  <tr>
                    <th style="width: 52px">#</th>
                    <th>الرابط الأساسي (Canonical URL)</th>
                    <th style="width: 110px">الأولوية (Priority)</th>
                    <th style="width: 120px">التكرار (Changefreq)</th>
                    <th style="width: 150px">آخر تحديث (Lastmod)</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td><xsl:value-of select="position()"/></td>
                      <td class="url-cell">
                        <xsl:variable name="itemURL"><xsl:value-of select="sitemap:loc"/></xsl:variable>
                        <a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a>
                      </td>
                      <td>
                        <span class="pill priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </td>
                      <td>
                        <span class="pill"><xsl:value-of select="sitemap:changefreq"/></span>
                      </td>
                      <td class="date-cell">
                        <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
