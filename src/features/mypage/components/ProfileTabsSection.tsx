'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import { TEAM_ID } from '@/shared/constants/constants';

import {
  listUserReviewedProducts,
  listUserCreatedProducts,
  listUserFavoriteProducts,
} from '../../../../openapi/requests/services.gen';

import type {
  ListUserReviewedProductsDefaultResponse as ReviewedResp,
  ListUserCreatedProductsDefaultResponse as CreatedResp,
  ListUserFavoriteProductsDefaultResponse as FavoriteResp,
} from '../../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

type TabKey = 'reviews' | 'items' | 'wishlist';

type ReviewedItem = NonNullable<ReviewedResp>['list'][number];
type CreatedItem = NonNullable<CreatedResp>['list'][number];
type FavoriteItem = NonNullable<FavoriteResp>['list'][number];

type Props = {
  userId: number;
  mapReviewed: (item: ReviewedItem) => ContentItem;
  mapCreated: (item: CreatedItem) => ContentItem;
  mapFavorite: (item: FavoriteItem) => ContentItem;
};

type SectionProps<T> = {
  list: T[];
  isLoading: boolean;
  isError: boolean;
  emptyText: string;
  mapFn: (it: T) => ContentItem;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

const SectionBlock = <T,>({
  list,
  isLoading,
  isError,
  emptyText,
  mapFn,
  hasNextPage,
  fetchNextPage,
}: SectionProps<T>) => {
  if (isLoading && list.length === 0) return <p className='text-gray-400'>불러오는 중…</p>;
  if (isError) return <p className='text-red-400'>불러오기에 실패했어요.</p>;
  if (list.length === 0) return <p className='text-gray-400'>{emptyText}</p>;

  const items = list.map(mapFn);
  return (
    <VirtualizedContentGrid
      items={items}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      itemHeightEstimate={276}
      rowGap={16}
    />
  );
};

export default function ProfileTabsSection({
  userId,
  mapReviewed,
  mapCreated,
  mapFavorite,
}: Props) {
  const [tab, setTab] = useState<TabKey>('reviews');

  const fetchReviewed = async ({ pageParam }: { pageParam: number | null | undefined }) => {
    const res = await listUserReviewedProducts({
      path: { teamId: TEAM_ID as string, userId },
      query: pageParam ? { cursor: pageParam } : undefined,
    });
    return res.data as ReviewedResp;
  };

  const fetchCreated = async ({ pageParam }: { pageParam: number | null | undefined }) => {
    const res = await listUserCreatedProducts({
      path: { teamId: TEAM_ID as string, userId },
      query: pageParam ? { cursor: pageParam } : undefined,
    });
    return res.data as CreatedResp;
  };

  const fetchFavorite = async ({ pageParam }: { pageParam: number | null | undefined }) => {
    const res = await listUserFavoriteProducts({
      path: { teamId: TEAM_ID as string, userId },
      query: pageParam ? { cursor: pageParam } : undefined,
    });
    return res.data as FavoriteResp;
  };

  const reviewedQ = useInfiniteQuery({
    queryKey: ['user', userId, 'reviews'],
    queryFn: fetchReviewed,
    initialPageParam: null as number | null,
    getNextPageParam: (last) => last?.nextCursor ?? undefined,
    enabled: tab === 'reviews',
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  const createdQ = useInfiniteQuery({
    queryKey: ['user', userId, 'items'],
    queryFn: fetchCreated,
    initialPageParam: null as number | null,
    getNextPageParam: (last) => last?.nextCursor ?? undefined,
    enabled: tab === 'items',
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  const favoriteQ = useInfiniteQuery({
    queryKey: ['user', userId, 'wishlist'],
    queryFn: fetchFavorite,
    initialPageParam: null as number | null,
    getNextPageParam: (last) => last?.nextCursor ?? undefined,
    enabled: tab === 'wishlist',
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  const reviewedList: ReviewedItem[] =
    reviewedQ.data?.pages?.flatMap((p) => (p ? p.list : [])) ?? [];

  const createdList: CreatedItem[] = createdQ.data?.pages?.flatMap((p) => (p ? p.list : [])) ?? [];

  const favoriteList: FavoriteItem[] =
    favoriteQ.data?.pages?.flatMap((p) => (p ? p.list : [])) ?? [];

  return (
    <div className='w-full'>
      <ProfileTabs value={tab} onChange={setTab} />

      <div className='mt-6 pb-[80px]'>
        {tab === 'reviews' && (
          <SectionBlock
            list={reviewedList}
            isLoading={reviewedQ.isLoading || reviewedQ.isFetchingNextPage}
            isError={!!reviewedQ.isError}
            emptyText='리뷰가 없어요'
            mapFn={mapReviewed}
            hasNextPage={!!reviewedQ.hasNextPage}
            fetchNextPage={() => reviewedQ.fetchNextPage()}
          />
        )}

        {tab === 'items' && (
          <SectionBlock
            list={createdList}
            isLoading={createdQ.isLoading || createdQ.isFetchingNextPage}
            isError={!!createdQ.isError}
            emptyText='등록한 상품이 없어요'
            mapFn={mapCreated}
            hasNextPage={!!createdQ.hasNextPage}
            fetchNextPage={() => createdQ.fetchNextPage()}
          />
        )}

        {tab === 'wishlist' && (
          <SectionBlock
            list={favoriteList}
            isLoading={favoriteQ.isLoading || favoriteQ.isFetchingNextPage}
            isError={!!favoriteQ.isError}
            emptyText='찜한 상품이 없어요'
            mapFn={mapFavorite}
            hasNextPage={!!favoriteQ.hasNextPage}
            fetchNextPage={() => favoriteQ.fetchNextPage()}
          />
        )}
      </div>
    </div>
  );
}
