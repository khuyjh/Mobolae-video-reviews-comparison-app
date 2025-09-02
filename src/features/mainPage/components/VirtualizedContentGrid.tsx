'use client';

import React, { useMemo } from 'react';

import HomeItemCard from '@/shared/components/HomeItemCard';
import { InfinityScroll } from '@/shared/components/infinityScroll';
import { ContentItem } from '@/shared/types/content';

import useColumnCount from '../hooks/useColumnCount';
import { chunkArray } from '../services/chunk';
// import type { ContentItem } from '@/shared/types/content';

type Props = {
  items: ContentItem[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  /** 카드(한 행의 평균 높이) 추정치 – 카드 자체 높이 기준 */
  itemHeightEstimate?: number;
  /** 행 간 간격(px) – 기본 16px (gap-4와 시각 밸런스 맞춤) */
  rowGap?: number;
};

export default function VirtualizedContentGrid({
  items,
  hasNextPage,
  fetchNextPage,
  isLoading,
  itemHeightEstimate = 276,
  rowGap = 16, // ★ 행 간 간격
}: Props) {
  const cols = useColumnCount();

  // 열 수에 맞춰 행으로 쪼갬
  const rows = useMemo(() => chunkArray(items, cols), [items, cols]);

  // InfinityScroll은 “한 행”을 1 아이템으로 가상화
  return (
    <InfinityScroll
      items={rows}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      // ★ 가상화 높이 추정치에 행 간 간격을 포함시켜 계산 오차↓
      itemHeightEstimate={itemHeightEstimate + rowGap}
      renderItem={(rowItems, _rowIndex) => (
        // 이 div 전체가 "한 행"의 박스(측정 대상)
        <div className='w-full'>
          {/* 열 그리드: cols와 동기화, 열 간격은 gap으로 처리 */}
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
          {/* 행 간 간격을 실제 높이에 포함시키는 스페이서 */}
          <div style={{ height: rowGap }} />
        </div>
      )}
    />
  );
}
