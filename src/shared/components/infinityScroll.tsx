import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect, useState } from 'react';

/**
 * items: 표시할 아이템 배열
 * renderItem: 각 아이템을 렌더링하는 함수
 * hasNextPage: 다음 페이지를 불러오는 함수
 * fetchNextPage: 다음 페이지를 불러오는 함수
 * isLoading: 현재 로딩 중인지 여부
 * itemHeightEstimate: 각 아이템의 예상 높이
 * itemSpacing: 아이템 간 간격
 * maxItems: 최대 표시할 아이템 개수 (기본값: 1000)
 * initialSSRItems: SSR 렌더링용 초기 아이템들
 * scrollKey: 스크롤 위치 저장에 사용
 */

interface InfinityScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  itemHeightEstimate: number;
  itemSpacing: number;
  maxItems?: number;
  initialSSRItems?: T[];
  scrollKey?: string;
}

export function InfinityScroll<T>({
  items,
  renderItem,
  hasNextPage,
  fetchNextPage,
  isLoading,
  itemHeightEstimate,
  itemSpacing,
  maxItems = 1000,
  initialSSRItems,
  scrollKey,
}: InfinityScrollProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  /* 실제 화면에 표시할 아이템 */
  const [displayItems, setDisplayItems] = useState<T[]>([]);

  useEffect(() => {
    if (items.length > maxItems) {
      setDisplayItems(items.slice(items.length - maxItems));
    } else {
      setDisplayItems(items);
    }
  }, [items, maxItems]);

  /* 스크롤 위치 저장 및 복원 */
  useEffect(() => {
    const key = `scroll-pos:${scrollKey ?? `${location.pathname}${location.search}`}`;

    const onPopState = () => {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        const y = parseInt(saved, 10);
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
    };

    const onScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollKey]);

  /* 가상화 설정 */
  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? displayItems.length + 1 : displayItems.length,
    estimateSize: () => itemHeightEstimate + itemSpacing,
    scrollMargin: 0,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  /* 무한 스크롤 로직 */
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (lastItem.index >= displayItems.length - 1 && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, displayItems.length, isLoading, virtualItems]);

  return (
    <>
      <div
        ref={parentRef}
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
                {isLoading ? '로딩 중...' : '더 불러오기'}
              </div>
            ) : null;
          }

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
              {renderItem(displayItems[virtualItem.index], virtualItem.index)}
            </div>
          );
        })}
      </div>

      {initialSSRItems && (
        <noscript>
          <div>
            {initialSSRItems.map((item, i) => (
              <div key={i}>{renderItem(item, i)}</div>
            ))}
          </div>
        </noscript>
      )}
    </>
  );
}
