import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect, useState } from 'react';

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
  const [displayItems, setDisplayItems] = useState<T[]>([]);

  useEffect(() => {
    if (items.length > maxItems) {
      setDisplayItems(items.slice(items.length - maxItems));
    } else {
      setDisplayItems(items);
    }
  }, [items, maxItems]);

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

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? displayItems.length + 1 : displayItems.length,
    estimateSize: () => itemHeightEstimate + itemSpacing,
    scrollMargin: 0,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

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
