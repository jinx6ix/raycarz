// app/blog/feed.xml/route.ts
import { NextResponse } from 'next/server';
import blogPosts from '@/data/blog-posts.json';
import type { BlogPost } from '../types';

export async function GET() {
  const posts = blogPosts as unknown as BlogPost[];
  const baseUrl = 'https://yoursafariwebsite.com';
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>African Safari Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert insights on wildlife, photography, conservation, and unforgettable African safari experiences.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    
    ${posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)
      .map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${post.author.name}</author>
      <category>${post.category}</category>
      ${post.tags?.map(tag => `<category>${tag}</category>`).join('')}
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}