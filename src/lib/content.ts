import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  SubjectId,
  LectureFrontmatter,
  LectureData,
  WeekSummary,
  SubjectSummary,
  SearchIndexItem,
} from '@/types';
import { SUBJECTS } from './subjects';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getSubjectContentDir(subject: SubjectId): string {
  return path.join(CONTENT_DIR, subject);
}

export function getAllSubjectSlugs(): { subject: string }[] {
  return (['mlt', 'mad2', 'bdm'] as SubjectId[]).map((subject) => ({ subject }));
}

export function getAllWeekSlugs(): { subject: string; week: string }[] {
  const slugs: { subject: string; week: string }[] = [];
  const subjects: SubjectId[] = ['mlt', 'mad2', 'bdm'];

  for (const subject of subjects) {
    const subjectDir = getSubjectContentDir(subject);
    if (!fs.existsSync(subjectDir)) continue;

    const entries = fs.readdirSync(subjectDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('week-')) {
        slugs.push({ subject, week: entry.name });
      }
    }
  }

  return slugs;
}

export function getAllLectureSlugs(): { subject: string; week: string; lecture: string }[] {
  const slugs: { subject: string; week: string; lecture: string }[] = [];
  const subjects: SubjectId[] = ['mlt', 'mad2', 'bdm'];

  for (const subject of subjects) {
    const subjectDir = getSubjectContentDir(subject);
    if (!fs.existsSync(subjectDir)) continue;

    const weekEntries = fs.readdirSync(subjectDir, { withFileTypes: true });
    for (const weekEntry of weekEntries) {
      if (!weekEntry.isDirectory() || !weekEntry.name.startsWith('week-')) continue;

      const weekPath = path.join(subjectDir, weekEntry.name);
      const lectureFiles = fs.readdirSync(weekPath).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

      for (const file of lectureFiles) {
        const lectureSlug = file.replace(/\.mdx?$/, '');
        slugs.push({
          subject,
          week: weekEntry.name,
          lecture: lectureSlug,
        });
      }
    }
  }

  return slugs;
}

export function getLectureData(
  subject: string,
  weekStr: string,
  lectureStr: string
): LectureData | null {
  const subjectId = subject as SubjectId;
  const weekNum = parseInt(weekStr.replace('week-', ''), 10);
  const lectureNum = parseInt(lectureStr.replace('lecture-', ''), 10);

  const subjectDir = getSubjectContentDir(subjectId);
  const mdxPath = path.join(subjectDir, weekStr, `${lectureStr}.mdx`);
  const mdPath = path.join(subjectDir, weekStr, `${lectureStr}.md`);

  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const meta: LectureFrontmatter = {
    subject: subjectId,
    week: weekNum,
    lecture: lectureNum,
    title: data.title || `Lecture ${lectureNum}`,
    duration: data.duration,
    topics: data.topics || [],
    selfTest: data.selfTest || [],
    resources: data.resources || [],
    formulas: data.formulas || [],
    codeSnippets: data.codeSnippets || [],
    projectTree: data.projectTree,
    overviewSummary: data.overviewSummary,
  };

  return {
    meta,
    content,
    slug: {
      subject,
      week: weekStr,
      lecture: lectureStr,
    },
  };
}

export function getWeekData(subject: string, weekStr: string): WeekSummary | null {
  const subjectId = subject as SubjectId;
  const weekNum = parseInt(weekStr.replace('week-', ''), 10);
  const subjectDir = getSubjectContentDir(subjectId);
  const weekPath = path.join(subjectDir, weekStr);

  if (!fs.existsSync(weekPath)) return null;

  const lectureFiles = fs
    .readdirSync(weekPath)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/[^0-9]/g, '') || '0', 10);
      const numB = parseInt(b.replace(/[^0-9]/g, '') || '0', 10);
      return numA - numB;
    });

  const lectures: WeekSummary['lectures'] = [];
  let totalTopics = 0;

  for (const file of lectureFiles) {
    const filePath = path.join(weekPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    const lecNum = parseInt(file.replace(/[^0-9]/g, '') || '1', 10);
    const topics = data.topics || [];
    totalTopics += topics.length;

    lectures.push({
      lecture: lecNum,
      title: data.title || `Lecture ${lecNum}`,
      topics,
      duration: data.duration,
    });
  }

  return {
    subject: subjectId,
    week: weekNum,
    title: `Week ${weekNum}`,
    lectures,
    totalTopics,
  };
}

export function getSubjectSummary(subject: SubjectId): SubjectSummary {
  const meta = SUBJECTS[subject];
  const subjectDir = getSubjectContentDir(subject);
  const weeks: WeekSummary[] = [];
  let totalLectures = 0;
  let totalTopics = 0;

  if (fs.existsSync(subjectDir)) {
    const weekEntries = fs
      .readdirSync(subjectDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith('week-'))
      .sort((a, b) => {
        const numA = parseInt(a.name.replace('week-', ''), 10);
        const numB = parseInt(b.name.replace('week-', ''), 10);
        return numA - numB;
      });

    for (const weekEntry of weekEntries) {
      const weekData = getWeekData(subject, weekEntry.name);
      if (weekData) {
        weeks.push(weekData);
        totalLectures += weekData.lectures.length;
        totalTopics += weekData.totalTopics;
      }
    }
  }

  return {
    meta,
    weeks,
    totalLectures,
    totalTopics,
  };
}

export function getAllSubjectsSummary(): SubjectSummary[] {
  return (['mlt', 'mad2', 'bdm'] as SubjectId[]).map((id) => getSubjectSummary(id));
}

export function getAdjacentLectures(
  subject: string,
  weekStr: string,
  lectureStr: string
): { prev: { url: string; title: string } | null; next: { url: string; title: string } | null } {
  const allLectures = getAllLectureSlugs();
  const currentIndex = allLectures.findIndex(
    (l) => l.subject === subject && l.week === weekStr && l.lecture === lectureStr
  );

  let prev = null;
  let next = null;

  if (currentIndex > 0) {
    const p = allLectures[currentIndex - 1];
    const data = getLectureData(p.subject, p.week, p.lecture);
    prev = {
      url: `/${p.subject}/${p.week}/${p.lecture}/`,
      title: data?.meta.title || `Lecture ${p.lecture}`,
    };
  }

  if (currentIndex >= 0 && currentIndex < allLectures.length - 1) {
    const n = allLectures[currentIndex + 1];
    const data = getLectureData(n.subject, n.week, n.lecture);
    next = {
      url: `/${n.subject}/${n.week}/${n.lecture}/`,
      title: data?.meta.title || `Lecture ${n.lecture}`,
    };
  }

  return { prev, next };
}

export function generateSearchIndex(): SearchIndexItem[] {
  const index: SearchIndexItem[] = [];
  const subjects: SubjectId[] = ['mlt', 'mad2', 'bdm'];

  for (const subject of subjects) {
    const subjectMeta = SUBJECTS[subject];
    const subjectDir = getSubjectContentDir(subject);
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
          subjectCode: subjectMeta.code,
          subjectName: subjectMeta.name,
          week: weekNum,
          lecture: lectureNum,
          lectureTitle: data.title || `Lecture ${lectureNum}`,
          title: data.title || `Lecture ${lectureNum}`,
          snippet: (data.overviewSummary || content.slice(0, 160)).replace(/[\r\n#*`$]/g, ' ').trim(),
          url: `/${subject}/${weekStr}/${lectureStr}/`,
        });

        // Topic entries
        if (Array.isArray(data.topics)) {
          data.topics.forEach((t: { id: string; title: string; keyIdea: string }) => {
            index.push({
              id: `${subject}-${weekStr}-${lectureStr}-${t.id}`,
              subject,
              subjectCode: subjectMeta.code,
              subjectName: subjectMeta.name,
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

  return index;
}

