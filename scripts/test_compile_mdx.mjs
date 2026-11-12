import fs from 'fs';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { mdxComponents } from '../src/components/lecture/MDXComponents.js';

async function test() {
  const raw = fs.readFileSync('content/mlt/week-1/lecture-1.mdx', 'utf8');
  const { content } = matter(raw);

  try {
    const res = await compileMDX({
      source: content,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      },
    });
    console.log('compileMDX with components SUCCESS!');
  } catch (err) {
    console.error('compileMDX with components FAILED:', err);
  }
}

test();
