import React from 'react';
import { notFound } from 'next/navigation';
import { getAllLectureSlugs, getLectureData, getAdjacentLectures } from '@/lib/content';
import { LectureClientView } from '@/components/lecture/LectureClientView';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { mdxComponents } from '@/components/lecture/MDXComponents';

export function generateStaticParams() {
  return getAllLectureSlugs();
}

interface LecturePageProps {
  params: Promise<{
    subject: string;
    week: string;
    lecture: string;
  }>;
}

export default async function LecturePage({ params }: LecturePageProps) {
  const resolvedParams = await params;
  const { subject, week, lecture } = resolvedParams;

  const lectureData = getLectureData(subject, week, lecture);
  if (!lectureData) {
    notFound();
  }

  const { prev, next } = getAdjacentLectures(subject, week, lecture);

  return (
    <LectureClientView
      meta={lectureData.meta}
      prevLecture={prev}
      nextLecture={next}
      contentChildren={
        <MDXRemote
          source={lectureData.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      }
    />
  );
}
