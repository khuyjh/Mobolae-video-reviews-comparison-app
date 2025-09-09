'use client';

import { useParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard, { type CardData } from '@/features/mypage/components/ProfileCard'; // ← 순수 UI 컴포넌트
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import { fetchDummyPage } from '@/features/mypage/mock/dummyPager';
import { TEAM_ID } from '@/shared/constants/constants';

import { useUserDetail } from '../../../../openapi/queries/queries';

import type { UserDetailDefaultResponse } from '../../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

type TabKey = 'reviews' | 'items' | 'wishlist';

const mapUserToCard = (userDetail?: UserDetailDefaultResponse): CardData => ({
  name: userDetail?.nickname ?? '',
  avatarSrc: userDetail?.image ?? '',
  bio: userDetail?.description ?? '',
  followers: userDetail?.followersCount as number,
  following: userDetail?.followeesCount as number,
  isMe: false,
  isFollowing: Boolean(userDetail?.isFollowing),
});

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const uidNum = Number(userId);
  const enabled = Number.isFinite(uidNum) && !!TEAM_ID;

  const { data } = useUserDetail(
    { path: { teamId: TEAM_ID as string, userId: uidNum } },
    undefined,
    { enabled, retry: false },
  );
  const card = mapUserToCard(data);

  const [tab, setTab] = useState<TabKey>('reviews');

  const {
    data: pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['mypage', 'infinite', tab],
    queryFn: ({ pageParam = 0 }) => fetchDummyPage({ cursor: pageParam, limit: 12 }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  const items: ContentItem[] = useMemo(
    () =>
      (pages?.pages ?? []).flatMap((p) =>
        p.items.map((it) => ({
          contentId: it.id,
          title: it.title,
          contentImage: it.image,
          favoriteCount: it.favoriteCount,
          reviewCount: it.reviewCount,
          rating: it.rating,
        })),
      ),
    [pages],
  );

  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
      <div className='mb-[60px] xl:mr-[60px]'>
        <ProfileCard
          name={card.name}
          avatarSrc={card.avatarSrc}
          bio={card.bio}
          followers={card.followers}
          following={card.following}
          isMe={false}
          isFollowing={card.isFollowing}
        />
      </div>

      <div className='flex-1'>
        <div className='mb-[60px]'>
          <h2 className='text-lg-semibold mb-[30px] text-white'>활동 내역</h2>
          <ActivityCard rating={5} reviewCount={156} topCategoryId={2} />
        </div>

        <ProfileTabs value={tab} onChange={setTab} />

        <div className='mt-6 pb-[80px]'>
          <VirtualizedContentGrid
            items={items}
            hasNextPage={!!hasNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading || isFetchingNextPage}
            itemHeightEstimate={276}
            rowGap={16}
          />
        </div>
      </div>
    </div>
  );
}
