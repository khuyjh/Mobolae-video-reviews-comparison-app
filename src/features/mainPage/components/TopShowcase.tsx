// TopShowcase.tsx
'use client';

import React from 'react';

import ContentGrid from './ContentGrid';

type TopShowcaseProps = {
  items: {
    contentId: number;
    title: string;
    contentImage: string;
    favoriteCount: number;
    reviewCount: number;
    rating: number;
  }[];
};

const TopShowcase = ({ items }: TopShowcaseProps) => {
  return (
    <section className='mt-[60px]'>
      <div className='mb-[30px] flex justify-between'>
        <h2 className='text-xl-semibold text-white'>Top 6</h2>
        <div id='mobile-category-slot' className='mb-4 md:hidden' />
      </div>
      <ContentGrid items={items} />
    </section>
  );
};

export default TopShowcase;
