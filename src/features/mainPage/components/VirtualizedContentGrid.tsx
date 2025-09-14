'use client';

import React, { useMemo } from 'react';

import HomeItemCard from '@/shared/components/HomeItemCard';
import { InfinityScroll } from '@/shared/components/infinityScroll';
import FullGridSkeleton from '@/shared/components/skeleton/FullGridSkeleton';
import { ContentItem } from '@/shared/types/content';

import useColumnCount from '../hooks/useColumnCount';
import { chunkArray } from '../services/chunk';

type Props = {
  /** 콘텐츠 아이템 배열 */
  items: ContentItem[];
  /** 다음 페이지 여부 */
  hasNextPage: boolean;
  /** 다음 페이지 불러오기 함수 */
  fetchNextPage: () => void;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 카드 1행의 예상 높이(px) */
  itemHeightEstimate?: number;
  /** 행 간 간격(px), 기본 16 */
  rowGap?: number;
};

/**
 * VirtualizedContentGrid
 * - 아이템 배열을 열 수에 맞춰 행 단위로 묶고
 * - InfinityScroll로 행 단위 가상화 + 무한스크롤을 적용하는 컴포넌트
 */
const VirtualizedContentGrid = ({
  items,
  hasNextPage,
  fetchNextPage,
  isLoading,
  itemHeightEstimate = 276,
  rowGap = 16,
}: Props) => {
  const cols = useColumnCount();

  // 아이템을 열 수에 맞춰 행 단위 배열로 변환
  const rows = useMemo(() => chunkArray(items, cols), [items, cols]);

  if (isLoading && items.length === 0) {
    return <FullGridSkeleton />;
  }

  // InfinityScroll은 행 단위로 가상화 처리
  return (
    <InfinityScroll
      items={rows}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      itemHeightEstimate={itemHeightEstimate + rowGap}
      renderItem={(rowItems, _rowIndex) => (
        <div className='w-full'>
          {/* 열 단위 그리드, cols 값에 맞게 반복 */}
          <div
            className='grid gap-4'
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {rowItems.map((item) => (
              <div key={item.contentId}>
                <HomeItemCard {...item} />
              </div>
            ))}
          </div>
          {/* 행 간격 확보용 스페이서 */}
          <div style={{ height: rowGap }} />
        </div>
      )}
    />
  );
};

export default VirtualizedContentGrid;
