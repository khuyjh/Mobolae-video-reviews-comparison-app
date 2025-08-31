import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryFunctionContext,
} from '@tanstack/react-query';

interface InfiniteListResponse<T> {
  nextCursor: number | null;
  list: T[];
}

type UseInfiniteListOptions<T> = Omit<
  UseInfiniteQueryOptions<
    InfiniteListResponse<T>,
    Error,
    InfiniteData<InfiniteListResponse<T>, number>,
    readonly unknown[],
    number
  >,
  'getNextPageParam' | 'initialPageParam'
> & {
  initialPageParam?: number;
};

export const useInfiniteList = <T>(options: UseInfiniteListOptions<T>) => {
  return useInfiniteQuery<
    InfiniteListResponse<T>,
    Error,
    InfiniteData<InfiniteListResponse<T>, number>,
    readonly unknown[],
    number
  >({
    ...options,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: options.initialPageParam ?? 0,
  });
};
