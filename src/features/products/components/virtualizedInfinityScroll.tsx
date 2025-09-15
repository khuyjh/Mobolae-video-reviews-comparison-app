/* 상세 페이지 무한스크롤 로직 분리 */

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect } from 'react';

import LoadingText from '@/shared/components/loadingText';

interface VirtualizedInfinityScrollProps<T extends { id?: string | number }> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  itemHeightEstimate: number;
  overscan?: number;
  loadingText?: string;
  loadMoreText?: string;
}

export function VirtualizedInfinityScroll<T extends { id?: string | number }>({
  items,
  renderItem,
  hasNextPage,
  fetchNextPage,
  isLoading,
  itemHeightEstimate,
  overscan = 10,
  loadMoreText = '',
  loadingText = 'Loading...',
}: VirtualizedInfinityScrollProps<T>) {
  const displayItems = items;

  /* 가상화 설정 */
  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? displayItems.length + 1 : displayItems.length,
    estimateSize: () => itemHeightEstimate, // 초기 추정치
    overscan, // 화면 위/아래 추가로 유지할 DOM 범위
    getItemKey: (index) =>
      displayItems[index]?.id != null ? String(displayItems[index]!.id) : String(index),

    /* 실제 DOM 높이를 자동 측정 */
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= displayItems.length - 1 && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, displayItems.length, isLoading, virtualItems]);

  return (
    <div
      style={{
        height: rowVirtualizer.getTotalSize(),
        width: '100%',
        position: 'relative',
      }}
    >
      {virtualItems.map((virtualItem) => {
        const isLoaderRow = virtualItem.index > displayItems.length - 1;

        if (isLoaderRow) {
          return hasNextPage ? (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
                textAlign: 'center',
                padding: '2rem 0',
              }}
            >
              {isLoading ? <LoadingText text={loadingText} /> : loadMoreText}
            </div>
          ) : null;
        }

        const item = displayItems[virtualItem.index];
        if (!item) return null;

        return (
          <div
            key={virtualItem.key}
            ref={rowVirtualizer.measureElement}
            data-index={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(item, virtualItem.index)}
          </div>
        );
      })}
    </div>
  );
}
