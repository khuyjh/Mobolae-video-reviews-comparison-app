'use client';

import React from 'react';

import { ContentItem } from '@/shared/types/content';

import ContentGrid from './ContentGrid';

/**
 * MostReviewed 컴포넌트 Props
 *
 * @property {ContentItem[]} items - 보여줄 콘텐츠 아이템 배열
 */
type MostReviewedProps = {
  /** 보여줄 콘텐츠 아이템 배열 */
  items: ContentItem[];
};

/**
 * MostReviewed 컴포넌트
 *
 * - "리뷰 많은 상품" 섹션을 표시
 * - 전달받은 콘텐츠 아이템 배열을 ContentGrid로 렌더링
 *
 * @component
 * @example
 * ```tsx
 * <MostReviewed items={mockContents} />
 * ```
 */
const MostReviewed = ({ items }: MostReviewedProps) => {
  return (
    <section className='mt-[60px]'>
      <h2 className='text-xl-semibold mb-[30px] text-white'>리뷰 많은 상품</h2>
      <ContentGrid items={items} />
    </section>
  );
};

export default MostReviewed;
