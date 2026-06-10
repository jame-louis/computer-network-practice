import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: 'https://jame-louis.github.io',
  base: '/computer-network-practice/',
  output: 'static',
  integrations: [
    sitemap(),
    mermaid({
      theme: 'forest',
      autoTheme: true,  // 自动适配暗黑模式
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }]
    ]
  }
});
