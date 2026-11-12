import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

async function diagnose() {
  const dir = 'content/mad2/week-1';
  const files = ['lecture-1.mdx', 'lecture-2.mdx', 'lecture-3.mdx', 'lecture-4.mdx', 'lecture-5.mdx'];

  console.log('--- DIAGNOSING MAD 2 WEEK 1 FILES ---\n');

  for (const f of files) {
    const filePath = path.join(dir, f);
    console.log(`Checking ${filePath}...`);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(raw);

    // 1. Check Frontmatter fields
    const requiredKeys = ['subject', 'week', 'lecture', 'title', 'topics'];
    const missingKeys = requiredKeys.filter(k => !(k in frontmatter));
    if (missingKeys.length > 0) {
      console.log(`  [FRONTMATTER ISSUE] Missing keys: ${missingKeys.join(', ')}`);
    } else {
      console.log(`  ✓ Frontmatter: OK (title: "${frontmatter.title}", topics: ${frontmatter.topics?.length || 0})`);
    }

    // 2. Check MDX compilation
    try {
      await compile(content, {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      });
      console.log(`  ✓ MDX Compilation: OK`);
    } catch (err) {
      console.log(`  ✗ [MDX COMPILE ERROR] in ${f}:`);
      console.log(`    Message: ${err.message}`);
      if (err.line) console.log(`    Line: ${err.line}, Column: ${err.column}`);
      if (err.place) console.log(`    Place:`, JSON.stringify(err.place));
    }

    // 3. Scan for component tags used in content
    const tagMatches = content.matchAll(/<([A-Z][a-zA-Z0-9]*)/g);
    const tagsUsed = new Set([...tagMatches].map(m => m[1]));
    console.log(`  Components used: ${Array.from(tagsUsed).join(', ') || 'none'}`);

    // 4. Scan for images and check existence
    const imgMatches = content.matchAll(/!\[(.*?)\]\((.*?)\)/g);
    for (const match of imgMatches) {
      const alt = match[1];
      const src = match[2];
      const cleanPath = src.split('?')[0].split('#')[0];
      const publicPath = path.join('public', cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath);
      const exists = fs.existsSync(publicPath);
      if (!exists && !src.startsWith('http')) {
        console.log(`  ✗ [MISSING IMAGE] Alt: "${alt}", Src: "${src}" -> Checked: ${publicPath}`);
      } else {
        console.log(`  ✓ Image found: ${src}`);
      }
    }

    // 5. Scan for unrendered math / edge cases
    const dollarMatches = [...content.matchAll(/(\${1,2})([^\$]+?)(\${1,2})/g)];
    if (dollarMatches.length > 0) {
      console.log(`  Math blocks found: ${dollarMatches.length}`);
    }

    console.log('');
  }
}

diagnose();

