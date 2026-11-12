'use client';

import { useState, useEffect } from 'react';
import { SubjectId } from '@/types';

const TOPIC_STORAGE_KEY_PREFIX = 'iitm_notes_topic_';
const QUIZ_STORAGE_KEY_PREFIX = 'iitm_notes_quiz_';
const PROGRESS_UPDATE_EVENT = 'iitm_notes_progress_updated';

function getTopicKey(subject: string, week: string | number, lecture: string | number, topicId: string): string {
  const w = typeof week === 'number' ? `week-${week}` : week;
  const l = typeof lecture === 'number' ? `lecture-${lecture}` : lecture;
  return `${TOPIC_STORAGE_KEY_PREFIX}${subject}_${w}_${l}_${topicId}`;
}

function getQuizKey(subject: string, week: string | number, lecture: string | number): string {
  const w = typeof week === 'number' ? `week-${week}` : week;
  const l = typeof lecture === 'number' ? `lecture-${lecture}` : lecture;
  return `${QUIZ_STORAGE_KEY_PREFIX}${subject}_${w}_${l}`;
}

export function isTopicCompleted(
  subject: string,
  week: string | number,
  lecture: string | number,
  topicId: string
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const key = getTopicKey(subject, week, lecture, topicId);
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function setTopicCompleted(
  subject: string,
  week: string | number,
  lecture: string | number,
  topicId: string,
  completed: boolean
): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getTopicKey(subject, week, lecture, topicId);
    if (completed) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
    window.dispatchEvent(new Event(PROGRESS_UPDATE_EVENT));
  } catch (e) {
    console.error('Error saving topic completion:', e);
  }
}

export function getQuizScore(
  subject: string,
  week: string | number,
  lecture: string | number
): Record<number, 'known' | 'review'> {
  if (typeof window === 'undefined') return {};
  try {
    const key = getQuizKey(subject, week, lecture);
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
}

export function saveQuizScore(
  subject: string,
  week: string | number,
  lecture: string | number,
  questionIdx: number,
  status: 'known' | 'review'
): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getQuizKey(subject, week, lecture);
    const current = getQuizScore(subject, week, lecture);
    current[questionIdx] = status;
    localStorage.setItem(key, JSON.stringify(current));
    window.dispatchEvent(new Event(PROGRESS_UPDATE_EVENT));
  } catch (e) {
    console.error('Error saving quiz score:', e);
  }
}

// React Hook to subscribe to localStorage progress updates
export function useProgressNotifier() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((prev) => prev + 1);
    window.addEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return tick;
}

