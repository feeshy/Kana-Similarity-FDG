#!/bin/bash

# 1. 动态生成 sitemap.xml
BUILD_DATE=$(date -u +"%Y-%m-%d")
cat <<EOF > sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://kana.feeshy.top/</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://kana.feeshy.top/en"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://kana.feeshy.top/ja"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://kana.feeshy.top/zh"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://kana.feeshy.top/en"/>
  </url>
  <url>
    <loc>https://kana.feeshy.top/en</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://kana.feeshy.top/en"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://kana.feeshy.top/ja"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://kana.feeshy.top/zh"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://kana.feeshy.top/en"/>
  </url>
  <url>
    <loc>https://kana.feeshy.top/ja</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://kana.feeshy.top/en"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://kana.feeshy.top/ja"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://kana.feeshy.top/zh"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://kana.feeshy.top/en"/>
  </url>
  <url>
    <loc>https://kana.feeshy.top/zh</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://kana.feeshy.top/en"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://kana.feeshy.top/ja"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://kana.feeshy.top/zh"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://kana.feeshy.top/en"/>
  </url>
  <url>
    <loc>https://kana.feeshy.top/en/chart</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://kana.feeshy.top/en/chart"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://kana.feeshy.top/ja/chart"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://kana.feeshy.top/zh/chart"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://kana.feeshy.top/en/chart"/>
  </url>
  <url>
    <loc>https://kana.feeshy.top/ja/chart</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://kana.feeshy.top/en/chart"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://kana.feeshy.top/ja/chart"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://kana.feeshy.top/zh/chart"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://kana.feeshy.top/en/chart"/>
  </url>
  <url>
    <loc>https://kana.feeshy.top/zh/chart</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://kana.feeshy.top/en/chart"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://kana.feeshy.top/ja/chart"/>
    <xhtml:link rel="alternate" hreflang="zh" href="https://kana.feeshy.top/zh/chart"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://kana.feeshy.top/en/chart"/>
  </url>
</urlset>
EOF

# 2. 清理不需要部署到生产环境的说明和授权文件
rm -f README.md LICENSE* assets/*LICENSE* assets/*OFL*

# 3. 清理构建脚本自身，避免被打包发布
rm -f build.sh
