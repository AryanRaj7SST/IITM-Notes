import { SubjectId, SubjectMeta } from '@/types';

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  mlt: {
    id: 'mlt',
    code: 'MLT',
    name: 'Machine Learning Techniques',
    description: 'Foundations of mathematical modeling, supervised & unsupervised algorithms, gradient optimization, and statistical learning theory.',
    accent: {
      name: 'emerald',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      bgSubtle: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
  },
  mad2: {
    id: 'mad2',
    code: 'MAD 2',
    name: 'Modern Application Development 2',
    description: 'Architecting scalable web applications, REST/GraphQL APIs, modern frontend frameworks (Vue/React), Celery asynchronous workers, and Redis caching.',
    accent: {
      name: 'sky',
      badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      border: 'border-sky-500/30 dark:border-sky-500/40',
      bgSubtle: 'bg-sky-50/50 dark:bg-sky-950/20',
      button: 'bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600',
      text: 'text-sky-600 dark:text-sky-400',
    },
  },
  bdm: {
    id: 'bdm',
    code: 'BDM',
    name: 'Business Data Management',
    description: 'Relational data modeling, ACID transactions, data warehousing, dimensional modeling (star/snowflake), and executive decision support systems.',
    accent: {
      name: 'violet',
      badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      border: 'border-violet-500/30 dark:border-violet-500/40',
      bgSubtle: 'bg-violet-50/50 dark:bg-violet-950/20',
      button: 'bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600',
      text: 'text-violet-600 dark:text-violet-400',
    },
  },
};

export const SUBJECT_LIST: SubjectMeta[] = Object.values(SUBJECTS);

