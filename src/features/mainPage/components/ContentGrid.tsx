'use client';

import React from 'react';

import HomeItemCard from '@/shared/components/HomeItemCard';

interface ContentGridProps {
  items: {
    contentId: number;
    title: string;
    contentImage: string;
    favoriteCount: number;
    reviewCount: number;
    rating: number;
  }[];
}

const ContentGrid = ({ items }: ContentGridProps) => {
  if (!items?.length) {
    return <div className='text-sm text-gray-500'>표시할 콘텐츠가 없습니다.</div>;
  }

  return (
    <ul className='grid grid-cols-2 gap-4 xl:grid-cols-3'>
      {items.map((item) => (
        <li key={item.contentId}>
          <HomeItemCard {...item} />
        </li>
      ))}
    </ul>
  );
};

export default ContentGrid;
