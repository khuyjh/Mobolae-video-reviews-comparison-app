import { useEffect, useRef } from 'react';

import type { UseInfiniteQueryResult } from '@tanstack/react-query';

interface InfiniteScrollQuery<T> {
  fetchNextPage: UseInfiniteQueryResult<T>['fetchNextPage'];
  hasNextPage: UseInfiniteQueryResult<T>['hasNextPage'];
  isFetchingNextPage: UseInfiniteQueryResult<T>['isFetchingNextPage'];
}

export const useInfiniteScroll = <T>(
  query: InfiniteScrollQuery<T>,
  options?: IntersectionObserverInit,
) => {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, options);

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, options]);

  return loadMoreRef;
};
