'use client';

import React, { useMemo, useState } from 'react';

import ContentEmpty from '@/features/mainPage/components/ContentEmpty';
import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import { PATH_OPTION } from '@/shared/constants/constants';

import { useInfiniteApi } from '../../../../openapi/queries/infiniteQueries';

import type {
  ListUserReviewedProductsDefaultResponse as ReviewedResp,
  ListUserCreatedProductsDefaultResponse as CreatedResp,
  ListUserFavoriteProductsDefaultResponse as FavoriteResp,
} from '../../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

// 유저별 콘텐츠 API 엔드포인트 정의
const USER_ENDPOINT = {
  reviews: '/{teamId}/users/{userId}/reviewed-products',
  items: '/{teamId}/users/{userId}/created-products',
  wishlist: '/{teamId}/users/{userId}/favorite-products',
} as const;

// userId를 포함한 path 옵션 생성
const withUserPath = (userId: number | string) => ({
  path: { ...PATH_OPTION.path, userId },
});

// 탭 키 타입
type TabKey = 'reviews' | 'items' | 'wishlist';

// API 응답 타입에서 리스트 아이템 타입 추출
type ReviewedItem = NonNullable<ReviewedResp>['list'][number];
type CreatedItem = NonNullable<CreatedResp>['list'][number];
type FavoriteItem = NonNullable<FavoriteResp>['list'][number];

type Props = {
  userId: number;
  mapReviewed: (i: ReviewedItem) => ContentItem;
  mapCreated: (i: CreatedItem) => ContentItem;
  mapFavorite: (i: FavoriteItem) => ContentItem;
};

// 섹션 블록 (탭 내용)
// 로딩, 에러, 빈 상태, 정상 목록 UI 처리
function SectionBlock<T>({
  list,
  isLoading,
  isError,
  emptyText,
  errorText,
  mapFn,
  hasNextPage,
  fetchNextPage,
}: {
  list: T[];
  isLoading: boolean;
  isError: boolean;
  emptyText: string;
  errorText: string;
  mapFn: (it: T) => ContentItem;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}) {
  if (isError) {
    return (
      <ContentEmpty variant='error' title={errorText} description='잠시 후 다시 시도해주세요' />
    );
  }
  if (list.length === 0) {
    return <ContentEmpty title={emptyText} />;
  }
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

// 유저 프로필 탭 섹션
export default function ProfileTabsSection({
  userId,
  mapReviewed,
  mapCreated,
  mapFavorite,
}: Props) {
  // 현재 선택된 탭 상태
  const [tab, setTab] = useState<TabKey>('reviews');

  // 무한 스크롤 API 훅: 리뷰 / 생성 콘텐츠 / 찜
  const reviewedQ = useInfiniteApi<ReviewedItem>(
    ['user', userId, 'reviews'],
    USER_ENDPOINT.reviews,
    withUserPath(userId),
  );

  const createdQ = useInfiniteApi<CreatedItem>(
    ['user', userId, 'items'],
    USER_ENDPOINT.items,
    withUserPath(userId),
  );

  const favoriteQ = useInfiniteApi<FavoriteItem>(
    ['user', userId, 'wishlist'],
    USER_ENDPOINT.wishlist,
    withUserPath(userId),
  );

  // 탭에 따라 데이터/상태/메시지를 매핑
  const tabMap = useMemo(
    () =>
      ({
        reviews: {
          list: reviewedQ.data?.items ?? [],
          isLoading: reviewedQ.isLoading || reviewedQ.isFetchingNextPage,
          isError: !!reviewedQ.isError,
          emptyText: '아직 등록한 리뷰가 없어요',
          errorText: '리뷰 목록을 불러오지 못했어요',
          mapFn: mapReviewed,
          hasNextPage: !!reviewedQ.hasNextPage,
          fetchNextPage: () => reviewedQ.fetchNextPage(),
        },
        items: {
          list: createdQ.data?.items ?? [],
          isLoading: createdQ.isLoading || createdQ.isFetchingNextPage,
          isError: !!createdQ.isError,
          emptyText: '아직 등록한 콘텐츠가 없어요',
          errorText: '등록한 콘텐츠를 불러오지 못했어요',
          mapFn: mapCreated,
          hasNextPage: !!createdQ.hasNextPage,
          fetchNextPage: () => createdQ.fetchNextPage(),
        },
        wishlist: {
          list: favoriteQ.data?.items ?? [],
          isLoading: favoriteQ.isLoading || favoriteQ.isFetchingNextPage,
          isError: !!favoriteQ.isError,
          emptyText: '아직 찜한 콘텐츠가 없어요',
          errorText: '찜한 콘텐츠를 불러오지 못했어요',
          mapFn: mapFavorite,
          hasNextPage: !!favoriteQ.hasNextPage,
          fetchNextPage: () => favoriteQ.fetchNextPage(),
        },
      }) as const,
    [reviewedQ, createdQ, favoriteQ, mapReviewed, mapCreated, mapFavorite],
  );

  const active = tabMap[tab]; // 현재 탭에 해당하는 데이터

  return (
    <div className='w-full'>
      {/* 탭 UI */}
      <ProfileTabs value={tab} onChange={setTab} />
      <div className='mt-6 pb-[80px]'>
        {/* 탭 컨텐츠 */}
        <SectionBlock
          list={active.list}
          isLoading={active.isLoading}
          isError={active.isError}
          emptyText={active.emptyText}
          errorText={active.errorText}
          mapFn={active.mapFn}
          hasNextPage={active.hasNextPage}
          fetchNextPage={active.fetchNextPage}
        />
      </div>
    </div>
  );
}
