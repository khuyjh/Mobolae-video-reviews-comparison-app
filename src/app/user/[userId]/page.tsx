'use client';

import { useParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard from '@/features/mypage/components/ProfileCard';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import { fetchDummyPage } from '@/features/mypage/mock/dummyPager';
import { useFollowMutations } from '@/features/user/hooks/useFollowMutaion';
import { TEAM_ID, PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useUserDetail } from '../../../../openapi/queries/queries';

import type { UserDetailDefaultResponse } from '../../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

type TabKey = 'reviews' | 'items' | 'wishlist';

const mapUserToCard = (userDetail?: UserDetailDefaultResponse) => ({
  name: userDetail?.nickname ?? '',
  avatarSrc: userDetail?.image ?? '',
  bio: userDetail?.description ?? '',
  followers: (userDetail?.followersCount ?? 0) as number,
  following: (userDetail?.followeesCount ?? 0) as number,
  isMe: false,
  isFollowing: Boolean(userDetail?.isFollowing),
});

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const uidNum = Number(userId);
  const enabled = Number.isFinite(uidNum) && !!TEAM_ID;

  const { isLoggedIn, user } = useUserStore();
  const meId = user?.id;

  const fm = useFollowMutations(uidNum, isLoggedIn ? meId : undefined);
  const followBtnDisabled = !isLoggedIn || fm.actionDisabled;

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

  const { data: userDetail, isLoading: isUserLoading } = useUserDetail(
    { ...PATH_OPTION, path: { ...PATH_OPTION.path, userId: uidNum } },
    undefined,
    { enabled, retry: false },
  );

  if (isUserLoading || !userDetail) return null;

  const card = mapUserToCard(userDetail);
  const isFollowing = card.isFollowing;

  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
      <div className='mb-[60px] xl:mr-[60px]'>
        <ProfileCard
          userId={uidNum}
          meId={meId}
          name={card.name}
          avatarSrc={card.avatarSrc}
          bio={card.bio}
          followers={card.followers}
          following={card.following}
          isMe={false}
          isFollowing={isFollowing}
          actionDisabled={followBtnDisabled}
          onFollowToggle={() => (isFollowing ? fm.unfollow() : fm.follow())}
        />
      </div>

      <div className='flex-1'>
        <div className='mb-[60px]'>
          <h2 className='text-lg-semibold mb-[30px] text-white'>활동 내역</h2>
          <ActivityCard
            rating={userDetail.averageRating}
            reviewCount={userDetail.reviewCount}
            topCategoryId={userDetail.mostFavoriteCategory?.id ?? null}
          />
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
