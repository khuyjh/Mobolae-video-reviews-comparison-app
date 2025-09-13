'use client';

import React, { useMemo, useState } from 'react';

import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import { TEAM_ID } from '@/shared/constants/constants';

import { useInfiniteApi } from '../../../../openapi/queries/infiniteQueries';

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
  mapReviewed: (i: ReviewedItem) => ContentItem;
  mapCreated: (i: CreatedItem) => ContentItem;
  mapFavorite: (i: FavoriteItem) => ContentItem;
};

function SectionBlock<T>({
  list,
  isLoading,
  isError,
  emptyText,
  mapFn,
  hasNextPage,
  fetchNextPage,
}: {
  list: T[];
  isLoading: boolean;
  isError: boolean;
  emptyText: string;
  mapFn: (it: T) => ContentItem;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}) {
  if (isLoading && list.length === 0) return <p className='text-gray-400'>불러오는 중…</p>;
  if (isError) return <p className='text-red-400'>불러오기에 실패했어요.</p>;
  if (list.length === 0) return <p className='text-gray-400'>{emptyText}</p>;
  return (
    <VirtualizedContentGrid
      items={list.map(mapFn)}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      itemHeightEstimate={276}
      rowGap={16}
    />
  );
}

export default function ProfileTabsSection({
  userId,
  mapReviewed,
  mapCreated,
  mapFavorite,
}: Props) {
  const [tab, setTab] = useState<TabKey>('reviews');

  const reviewedQ = useInfiniteApi<ReviewedItem>(
    ['user', userId, 'reviews'],
    '/{teamId}/users/{userId}/reviewed-products',
    { path: { teamId: TEAM_ID as string, userId } },
  );

  const createdQ = useInfiniteApi<CreatedItem>(
    ['user', userId, 'items'],
    '/{teamId}/users/{userId}/created-products',
    { path: { teamId: TEAM_ID as string, userId } },
  );

  const favoriteQ = useInfiniteApi<FavoriteItem>(
    ['user', userId, 'wishlist'],
    '/{teamId}/users/{userId}/favorite-products',
    { path: { teamId: TEAM_ID as string, userId } },
  );

  const tabMap = useMemo(
    () =>
      ({
        reviews: {
          list: reviewedQ.data?.items ?? [],
          isLoading: reviewedQ.isLoading || reviewedQ.isFetchingNextPage,
          isError: !!reviewedQ.isError,
          emptyText: '리뷰가 없어요',
          mapFn: mapReviewed,
          hasNextPage: !!reviewedQ.hasNextPage,
          fetchNextPage: () => reviewedQ.fetchNextPage(),
        },
        items: {
          list: createdQ.data?.items ?? [],
          isLoading: createdQ.isLoading || createdQ.isFetchingNextPage,
          isError: !!createdQ.isError,
          emptyText: '등록한 상품이 없어요',
          mapFn: mapCreated,
          hasNextPage: !!createdQ.hasNextPage,
          fetchNextPage: () => createdQ.fetchNextPage(),
        },
        wishlist: {
          list: favoriteQ.data?.items ?? [],
          isLoading: favoriteQ.isLoading || favoriteQ.isFetchingNextPage,
          isError: !!favoriteQ.isError,
          emptyText: '찜한 상품이 없어요',
          mapFn: mapFavorite,
          hasNextPage: !!favoriteQ.hasNextPage,
          fetchNextPage: () => favoriteQ.fetchNextPage(),
        },
      }) as const,
    [
      reviewedQ.data,
      reviewedQ.isLoading,
      reviewedQ.isFetchingNextPage,
      reviewedQ.isError,
      reviewedQ.hasNextPage,
      createdQ.data,
      createdQ.isLoading,
      createdQ.isFetchingNextPage,
      createdQ.isError,
      createdQ.hasNextPage,
      favoriteQ.data,
      favoriteQ.isLoading,
      favoriteQ.isFetchingNextPage,
      favoriteQ.isError,
      favoriteQ.hasNextPage,
      mapReviewed,
      mapCreated,
      mapFavorite,
    ],
  );

  const active = tabMap[tab];

  return (
    <div className='w-full'>
      <ProfileTabs value={tab} onChange={setTab} />
      <div className='mt-6 pb-[80px]'>
        <SectionBlock
          list={active.list}
          isLoading={active.isLoading}
          isError={active.isError}
          emptyText={active.emptyText}
          mapFn={active.mapFn}
          hasNextPage={active.hasNextPage}
          fetchNextPage={active.fetchNextPage}
        />
      </div>
    </div>
  );
}
