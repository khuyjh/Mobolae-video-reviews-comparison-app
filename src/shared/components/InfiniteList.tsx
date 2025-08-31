'use client';

import { InfiniteData } from '@tanstack/react-query';
import { Fragment, ReactNode } from 'react';

import { useInfiniteList } from '@/shared/hooks/useInfiniteList';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

interface InfiniteListResponse<T> {
  nextCursor: number | null;
  list: T[];
}

interface InfiniteListProps<T> {
  queryKey: (string | number)[];
  queryFn: ({ pageParam }: { pageParam?: number }) => Promise<InfiniteListResponse<T>>;
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  initialPageParam?: number;
  isInitialLoading?: boolean;
}

const InfiniteList = <T,>({
  queryKey,
  queryFn,
  renderItem,
  emptyState,
  initialPageParam,
  isInitialLoading = false,
}: InfiniteListProps<T>) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading } =
    useInfiniteList<T>({
      queryKey,
      queryFn,
      initialPageParam,
    });

  const loadMoreRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isInitialLoading || isLoading) {
    return <div>초기 데이터 로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }

  const isEmpty = data?.pages.every((page) => page.list.length === 0);
  if (isEmpty) {
    return emptyState || <div>데이터가 없습니다.</div>;
  }

  return (
    <>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>{page.list.map((item, index) => renderItem(item, index))}</Fragment>
      ))}

      <div ref={loadMoreRef} style={{ height: '10px' }}>
        {isFetchingNextPage && <div>추가 데이터 로딩 중...</div>}
      </div>

      {!hasNextPage && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>마지막 페이지입니다.</div>
      )}
    </>
  );
};

export default InfiniteList;
