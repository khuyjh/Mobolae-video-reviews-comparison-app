'use client';

import React from 'react';

import { ContentItem } from '@/shared/types/content';

import ContentGrid from './ContentGrid';

type MostReviewedProps = {
  items: ContentItem[];
};

const MostReviewed = ({ items }: MostReviewedProps) => {
  return (
    <section className='mt-[60px]'>
      <h2 className='text-xl-semibold mb-[30px] text-white'>리뷰 많은 상품</h2>
      <ContentGrid items={items} />
    </section>
  );
};

export default MostReviewed;
