// src/features/content/components/ContentList.tsx
'use client';

import React from 'react';

import { mockContents } from '@/features/mainPage/mock/contents'; // 임시 목데이터

import ContentGrid from './ContentGrid';

/**
 * ContentList
 * - 콘텐츠 아이템들을 그리드 형태로 보여주는 기본 리스트
 * - 이후 정렬/검색/카테고리/무한스크롤이 붙을 예정
 */
export default function ContentList() {
  return (
    <main className='mx-auto w-full max-w-[1540px] px-5 md:px-[30px]'>
      <h2 className='text-xl-semibold mb-6 text-white'>콘텐츠 리스트</h2>
      <ContentGrid items={mockContents} />
    </main>
  );
}
