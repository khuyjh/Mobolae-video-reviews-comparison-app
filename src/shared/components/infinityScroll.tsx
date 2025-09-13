import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useState } from 'react';

/**
 * items: 표시할 아이템 배열
 * renderItem: 각 아이템을 렌더링하는 함수
 * hasNextPage: 다음 페이지가 있는지 여부
 * fetchNextPage: 다음 페이지를 불러오는 함수
 * isLoading: 현재 로딩 중인지 여부
 * itemHeightEstimate: 각 아이템의 예상 높이
 * maxItems: 최대 표시할 아이템 개수 (기본값: 1000)
 * scrollKey: 스크롤 위치 저장에 사용
 */
interface InfinityScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  itemHeightEstimate: number;
  maxItems?: number;
  scrollKey?: string;
}

export function InfinityScroll<T>({
  items,
  renderItem,
  hasNextPage,
  fetchNextPage,
  isLoading,
  itemHeightEstimate,
  maxItems = 1000,
  scrollKey,
}: InfinityScrollProps<T>) {
  /* 실제 화면에 표시할 아이템 */
  const [displayItems, setDisplayItems] = useState<T[]>([]);

  useEffect(() => {
    if (items.length > maxItems) {
      setDisplayItems(items.slice(items.length - maxItems));
    } else {
      setDisplayItems(items);
    }
  }, [items, maxItems]);

  /* 스크롤 위치 저장 (새로고침 시 복원 방지) */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey ?? `${location.pathname}${location.search}`}`;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          sessionStorage.setItem(key, String(window.scrollY));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollKey]);

  /* 가상화 설정 */
  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? displayItems.length + 1 : displayItems.length,
    estimateSize: () => itemHeightEstimate,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  /* 무한 스크롤 로직 */
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= displayItems.length - 1 && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, displayItems.length, isLoading, virtualItems]);

  return (
    <>
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
                {isLoading ? (
                  <div className='text-xl-regular inline-flex h-21 flex-row items-center justify-between gap-0 text-white'>
                    {'Loading...'.split('').map((letter, i) => (
                      <span
                        className='bounce-delay inline-block'
                        key={i}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                ) : null}
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
    </>
  );
}
