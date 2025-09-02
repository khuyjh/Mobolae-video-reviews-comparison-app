'use client';

import React from 'react';

import { ContentItem } from '@/shared/types/content';

import ContentGrid from './ContentGrid';

/**
 * TopShowcase 컴포넌트 Props
 *
 * @property {ContentItem[]} items - 보여줄 콘텐츠 아이템 배열
 */
type TopShowcaseProps = {
  /** 보여줄 콘텐츠 아이템 배열 */
  items: ContentItem[];
};

/**
 * TopShowcase 컴포넌트
 *
 * - 상단에 "Top 6" 제목과 모바일 전용 카테고리 슬롯을 표시
 * - 전달받은 콘텐츠 아이템 배열을 ContentGrid를 통해 렌더링
 *
 * @component
 * @example
 * ```tsx
 * <TopShowcase items={mockContents} />
 * ```
 */
const TopShowcase = ({ items }: TopShowcaseProps) => {
  return (
    <section>
      <div className='mb-[30px] flex justify-between'>
        <h2 className='text-xl-semibold text-white'>Top 6</h2>
        <div id='mobile-category-slot' className='mb-4 md:hidden' />
      </div>
      <ContentGrid items={items} />
    </section>
  );
};

export default TopShowcase;
