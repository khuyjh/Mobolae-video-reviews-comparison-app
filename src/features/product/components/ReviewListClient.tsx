// ReviewListClient.tsx
'use client';

import {
  useInfiniteQuery,
  useQueryClient,
  QueryFunctionContext,
  InfiniteData,
} from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import ReviewCard from '@/features/product/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/product/components/reviewSortDropdown';
import { publicApiClient } from '@/shared/api/apiClients';
import { InfinityScroll } from '@/shared/components/infinityScroll';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

// 인터페이스 정의는 그대로 유지
interface ReviewItem {
  id: string;
  reviewContent: string;
  Images: string[];
  likeCount: number;
  isLiked: boolean;
  showActions: boolean;
  createdAt: string;
  name: string;
  avatarSrc: string;
  rating: number;
}

interface ApiResponse {
  list: ReviewItem[];
  nextCursor?: number;
}

interface InfiniteQueryData {
  pages: ApiResponse[];
  pageParams: (number | undefined)[];
}

// 1. `fetchReviews` 함수의 인자에 `QueryFunctionContext` 제네릭 타입 명시
const fetchReviews = async ({
  pageParam,
  queryKey,
}: QueryFunctionContext<['reviews', string, string], number | undefined>): Promise<ApiResponse> => {
  const [_, productId, sort] = queryKey;
  // `pageParam`은 이미 `number | undefined` 타입으로 명확하므로 별도 처리 없이 사용
  const res = await publicApiClient.get(
    `/products/${productId}/reviews?sort=${sort}&page=${pageParam}`,
  );
  return res.data;
};

export default function ReviewListClient({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: ApiResponse;
}) {
  const queryClient = useQueryClient();
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');

  // 2. `useInfiniteQuery`에 모든 제네릭 타입 인자 명시
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    ApiResponse, // TQueryFnData: 쿼리 함수가 반환하는 데이터 타입
    Error, // TError: 에러 타입
    InfiniteData<ApiResponse, number | undefined>, // TData: 전체 데이터 구조
    ['reviews', string, string], // TQueryKey: 쿼리 키 배열 타입
    number | undefined // TPageParam: 페이지 파라미터 타입
  >({
    queryKey: ['reviews', productId, sort],
    queryFn: fetchReviews,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialReviews],
      pageParams: [1],
    },
  });

  const allReviews = useMemo(() => data?.pages.flatMap((page) => page.list) ?? [], [data]);

  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');
  const isPC = useMediaQuery('(min-width: 1280px)');
  let itemHeightEstimate;
  let itemSpacing;

  if (isPC) {
    itemHeightEstimate = 225;
    itemSpacing = 20;
  } else if (isTablet) {
    itemHeightEstimate = 175;
    itemSpacing = 15;
  } else {
    itemHeightEstimate = 250;
    itemSpacing = 15;
  }

  const onLikeClick = (reviewId: string) => {
    queryClient.setQueryData<InfiniteQueryData>(['reviews', productId, sort], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          list: page.list.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  isLiked: !review.isLiked,
                  likeCount: review.isLiked ? review.likeCount - 1 : review.likeCount + 1,
                }
              : review,
          ),
        })),
      };
    });
  };

  return (
    <div className='flex flex-col gap-[30px]'>
      <section className='flex items-center justify-between'>
        <h2 className='text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white'>
          콘텐츠 리뷰
        </h2>
        <ReviewSortDropdown />
      </section>

      <InfinityScroll
        items={allReviews}
        renderItem={(review, index) => (
          <div
            key={review.id}
            style={{ marginBottom: index === allReviews.length - 1 ? 0 : itemSpacing }}
          >
            <ReviewCard {...review} data-index={index} onLikeClick={() => onLikeClick(review.id)} />
          </div>
        )}
        hasNextPage={hasNextPage ?? false}
        fetchNextPage={fetchNextPage}
        isLoading={isFetchingNextPage}
        itemHeightEstimate={itemHeightEstimate}
        scrollKey='product-reviews'
      />
    </div>
  );
}
