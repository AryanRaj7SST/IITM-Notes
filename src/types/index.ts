export type SubjectId = 'mlt' | 'mad2' | 'bdm';

export interface SubjectMeta {
  id: SubjectId;
  code: string;
  name: string;
  description: string;
  accent: {
    name: string;
    badge: string;
    border: string;
    bgSubtle: string;
    button: string;
    text: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  keyIdea: string;
}

export interface SelfTestQuestion {
  question: string;
  answer: string;
  explanation: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: string;
  description: string;
  verified: boolean;
}

export interface FormulaItem {
  name: string;
  latex: string;
  description: string;
  symbols: { symbol: string; meaning: string }[];
}

export interface CodeSnippetItem {
  title: string;
  filename: string;
  language: string;
  code: string;
  explanations: { lines: string; explanation: string }[];
  output?: string;
  tested?: boolean;
}

export interface LectureFrontmatter {
  subject: SubjectId;
  week: number;
  lecture: number;
  title: string;
  duration?: string;
  topics: Topic[];
  selfTest?: SelfTestQuestion[];
  resources?: ResourceLink[];
  formulas?: FormulaItem[];
  codeSnippets?: CodeSnippetItem[];
  projectTree?: string;
  overviewSummary?: string;
}

export interface LectureData {
  meta: LectureFrontmatter;
  content: string;
  slug: {
    subject: string;
    week: string;
    lecture: string;
  };
}

export interface WeekSummary {
  subject: SubjectId;
  week: number;
  title: string;
  lectures: {
    lecture: number;
    title: string;
    topics: Topic[];
    duration?: string;
  }[];
  totalTopics: number;
}

export interface SubjectSummary {
  meta: SubjectMeta;
  weeks: WeekSummary[];
  totalLectures: number;
  totalTopics: number;
}

export interface SearchIndexItem {
  id: string;
  subject: SubjectId;
  subjectCode: string;
  subjectName: string;
  week: number;
  lecture: number;
  lectureTitle: string;
  topicId?: string;
  title: string;
  snippet: string;
  url: string;
}

