import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const files = [
  'content/mad2/week-1/lecture-1.mdx',
  'content/mad2/week-1/lecture-2.mdx',
  'content/mad2/week-1/lecture-3.mdx',
  'content/mad2/week-1/lecture-4.mdx',
  'content/mad2/week-1/lecture-5.mdx',
];

for (const filePath of files) {
  console.log(`\n========================================`);
  console.log(`INSPECTING: ${filePath}`);
  console.log(`========================================`);

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  const { data: frontmatter } = matter(fileContent);

  // 1. Check topics alignment between frontmatter and body
  const frontmatterTopicIds = (frontmatter.topics || []).map(t => t.id);
  const bodyTopicSections = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    // Check TopicSection
    const match = line.match(/<TopicSection\s+id=["']([^"']+)["']/);
    if (match) {
      bodyTopicSections.push({ id: match[1], line: lineNum });
    }

    // Check images
    const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      const src = imgMatch[2];
      const cleanSrc = src.split('?')[0].split('#')[0];
      const pubPath = path.join('public', cleanSrc.startsWith('/') ? cleanSrc.slice(1) : cleanSrc);
      if (!fs.existsSync(pubPath) && !src.startsWith('http')) {
        console.log(`[MISSING IMAGE] Line ${lineNum}: src="${src}" not found in public/`);
      }
    }

    // Check potential unrendered math ($ with spaces or unclosed)
    if (line.includes('$')) {
      // Check if it's math or currency or shell
      console.log(`[MATH / DOLLAR NOTATION] Line ${lineNum}: ${line.trim()}`);
    }

    // Check wide tables (more than 4 columns or very long cell contents)
    if (line.trim().startsWith('|')) {
      const pipes = (line.match(/\|/g) || []).length;
      if (line.length > 100) {
        console.log(`[POTENTIAL OVERFLOW TABLE ROW] Line ${lineNum} (${line.length} chars): ${line.slice(0, 80)}...`);
      }
    }

    // Check wide code lines
    if (line.length > 110 && !line.trim().startsWith('|')) {
      console.log(`[LONG LINE > 110 chars] Line ${lineNum} (${line.length} chars): ${line.slice(0, 80)}...`);
    }

    // Check unclosed or suspicious tags
    if (line.includes('<') && !line.includes('</') && !line.includes('/>')) {
      // Check if tag is in known set or raw html
      const tagMatch = line.match(/<([a-zA-Z0-9]+)/);
      if (tagMatch) {
        const tag = tagMatch[1];
        if (!['TopicSection', 'KeyIdea', 'AddedByTutor', 'CheckBadge', 'Collapsible', 'CodeBlock', 'table', 'thead', 'th', 'tr', 'td', 'div', 'p', 'span', 'ul', 'li', 'button', 'a', 'h1', 'h2', 'h3', 'h4', 'hr', 'br', 'strong', 'em', 'code', 'pre', 'input', 'label', 'select', 'option', 'form'].includes(tag)) {
          console.log(`[SUSPICIOUS TAG] Line ${lineNum}: <${tag}> in "${line.trim()}"`);
        }
      }
    }
  });

  // Verify all frontmatter topics exist in body
  const bodyIds = bodyTopicSections.map(b => b.id);
  frontmatterTopicIds.forEach(id => {
    if (!bodyIds.includes(id)) {
      console.log(`[TOPIC MISMATCH] Frontmatter topic "${id}" does not have a matching <TopicSection id="${id}"> in body!`);
    }
  });

  // Check body topics not in frontmatter
  bodyIds.forEach(id => {
    if (!frontmatterTopicIds.includes(id)) {
      console.log(`[TOPIC MISMATCH] Body <TopicSection id="${id}"> is not listed in frontmatter topics!`);
    }
  });
}

