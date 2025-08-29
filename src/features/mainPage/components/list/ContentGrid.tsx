'use client';

import React from 'react';

import HomeItemCard from '@/shared/components/HomeItemCard';
import { ContentItem } from '@/shared/types/content';

interface ContentGridProps {
  items: ContentItem[];
}

/**
 * 콘텐츠 카드들을 그리드 형태로 배치하는 컴포넌트
 *
 * @component
 * @example
 * ```tsx
 * <ContentGrid items={mockContents} />
 * ```
 *
 * @param {ContentGridProps} props - 콘텐츠 배열을 전달받는 props
 * @returns {JSX.Element} 콘텐츠 아이템 그리드 UI
 */
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
