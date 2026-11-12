import fs from 'fs';

console.log('--- Inspecting Code Blocks & Elements in MAD 2 Week 1 ---');

for (let i = 1; i <= 5; i++) {
  const filePath = `content/mad2/week-1/lecture-${i}.mdx`;
  const text = fs.readFileSync(filePath, 'utf8');
  const parts = text.split(/^---$/m);
  const body = parts.slice(2).join('---');

  const codeFences = (body.match(/```[a-z]*/g) || []);
  console.log(`Lecture ${i}: ${codeFences.length} code block fences found in body.`);
}
