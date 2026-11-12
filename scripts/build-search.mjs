import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const SUBJECT_NAMES = {
  mlt: { code: 'MLT', name: 'Machine Learning Techniques' },
  mad2: { code: 'MAD 2', name: 'Modern Application Development 2' },
  bdm: { code: 'BDM', name: 'Business Data Management' },
};

function generateSearchIndex() {
  const index = [];
  const subjects = ['mlt', 'mad2', 'bdm'];

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  for (const subject of subjects) {
    const meta = SUBJECT_NAMES[subject];
    const subjectDir = path.join(CONTENT_DIR, subject);
    if (!fs.existsSync(subjectDir)) continue;

    const weekEntries = fs.readdirSync(subjectDir, { withFileTypes: true });
    for (const weekEntry of weekEntries) {
      if (!weekEntry.isDirectory() || !weekEntry.name.startsWith('week-')) continue;
      const weekStr = weekEntry.name;
      const weekNum = parseInt(weekStr.replace('week-', ''), 10);
      const weekPath = path.join(subjectDir, weekStr);
      const lectureFiles = fs.readdirSync(weekPath).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

      for (const file of lectureFiles) {
        const lectureStr = file.replace(/\.mdx?$/, '');
        const lectureNum = parseInt(lectureStr.replace(/[^0-9]/g, '') || '1', 10);
        const filePath = path.join(weekPath, file);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(rawContent);

        // Lecture entry
        index.push({
          id: `${subject}-${weekStr}-${lectureStr}`,
          subject,
          subjectCode: meta.code,
          subjectName: meta.name,
          week: weekNum,
          lecture: lectureNum,
          lectureTitle: data.title || `Lecture ${lectureNum}`,
          title: data.title || `Lecture ${lectureNum}`,
          snippet: (data.overviewSummary || content.slice(0, 160)).replace(/[\r\n#*`$]/g, ' ').trim(),
          url: `/${subject}/${weekStr}/${lectureStr}/`,
        });

        // Topic entries
        if (Array.isArray(data.topics)) {
          data.topics.forEach((t) => {
            index.push({
              id: `${subject}-${weekStr}-${lectureStr}-${t.id}`,
              subject,
              subjectCode: meta.code,
              subjectName: meta.name,
              week: weekNum,
              lecture: lectureNum,
              lectureTitle: data.title || `Lecture ${lectureNum}`,
              topicId: t.id,
              title: t.title,
              snippet: t.keyIdea,
              url: `/${subject}/${weekStr}/${lectureStr}/#${t.id}`,
            });
          });
        }
      }
    }
  }

  const outputPath = path.join(PUBLIC_DIR, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Successfully generated search index with ${index.length} items at ${outputPath}`);
}

generateSearchIndex();

