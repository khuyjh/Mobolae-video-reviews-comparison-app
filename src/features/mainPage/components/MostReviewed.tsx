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
  generatedAt?: string;
};

/**
 * MostReviewed 컴포넌트
 * - "리뷰 많은 상품" 섹션을 표시
 * - 전달받은 콘텐츠 아이템 배열을 ContentGrid로 렌더링
 */
const MostReviewed = ({ items, generatedAt }: MostReviewedProps) => {
  return (
    <section className='my-[60px]'>
      <h2 className='text-xl-semibold mb-[30px] text-white'>
        가장 많이 리뷰된 콘텐츠 {generatedAt && <small className='opacity-60'>{generatedAt}</small>}
      </h2>
      <ContentGrid items={items.slice(0, 6)} />
    </section>
  );
};

export default MostReviewed;
