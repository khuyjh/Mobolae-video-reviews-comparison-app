'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard, { type CardData } from '@/features/mypage/components/ProfileCard';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import ProfileUpdateModal from '@/features/mypage/components/ProfileUpdateModal';
import { fetchDummyPage } from '@/features/mypage/mock/dummyPager';
import { TEAM_ID } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useMe } from '../../../openapi/queries/queries';

import type { MeDefaultResponse } from '../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

type TabKey = 'reviews' | 'items' | 'wishlist';

const mapMeToCard = (meDetail?: MeDefaultResponse): CardData => ({
  name: meDetail?.nickname as string,
  avatarSrc: meDetail?.image ?? '',
  bio: meDetail?.description ?? '',
  followers: meDetail?.followersCount as number,
  following: meDetail?.followeesCount as number,
  isMe: true,
  isFollowing: false,
});

export default function MyPage() {
  const { data } = useMe({ path: { teamId: TEAM_ID as string } }, []);
  const card = mapMeToCard(data);
  const [tab, setTab] = useState<TabKey>('reviews');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

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

  if (!data) return;

  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
      <div className='mb-[60px] xl:mr-[60px]'>
        <ProfileCard
          name={card.name}
          avatarSrc={card.avatarSrc}
          bio={card.bio}
          followers={card.followers}
          following={card.following}
          isMe={true}
          isFollowing={false}
          onEdit={() => {
            setIsProfileModalOpen(true);
          }}
          onLogout={() => {
            clearUser();
            router.replace('/');
            toast.success('로그아웃 되었습니다.');
          }}
        />
      </div>
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        userDetail={data}
        onClose={() => {
          setIsProfileModalOpen(false);
        }}
      />

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
