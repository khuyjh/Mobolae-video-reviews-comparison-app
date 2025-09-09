'use client';

import { useRouter } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard from '@/features/mypage/components/ProfileCard';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import ProfileUpdateModal from '@/features/mypage/components/ProfileUpdateModal';
import { fetchDummyPage, type PageResponse } from '@/features/mypage/mock/dummyPager';
import { useUserStore } from '@/shared/stores/userStore';

import type { ContentItem } from '@/shared/types/content';

const AVATAR = '/images/profileImg.jpg';
type TabKey = 'reviews' | 'items' | 'wishlist';

export default function MyPage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState<TabKey>('reviews');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['mypage', 'infinite', tab],
    queryFn: ({ pageParam = 0 }) => fetchDummyPage({ cursor: pageParam, limit: 12 }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  // 더미 → ContentItem 매핑
  const items: ContentItem[] = useMemo(
    () =>
      (data?.pages ?? []).flatMap((p) =>
        p.items.map((it) => ({
          contentId: it.id,
          title: it.title,
          contentImage: it.image,
          favoriteCount: it.favoriteCount,
          reviewCount: it.reviewCount,
          rating: it.rating,
        })),
      ),
    [data],
  );

  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
      <div className='mb-[60px] xl:mr-[60px]'>
        <ProfileCard
          name='surisuri마수리'
          avatarSrc={AVATAR}
          bio='자기소개 입니다자기소개 입니다자기소개 입니다자기소개 입니다자기소개 입니다'
          followers={762}
          following={102}
          isFollowing={isFollowing}
          onFollowToggle={() => setIsFollowing((p) => !p)}
          onEdit={() => {
            setIsProfileModalOpen(true);
          }}
          onLogout={() => {
            clearUser();
            router.replace('/');
          }}
        />
      </div>
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        //임시데이터
        userDetail={{
          id: 829,
          nickname: '몇글자까지되는지확인해보자스물이냐열이냐',
          description: '안녕하세요',
          image: 'https://example.com/...',
          createdAt: '2025-08-19T15:57:35.382Z',
          updatedAt: '2025-08-23T13:05:21.652Z',
          teamId: '16-7',
          isFollowing: false,
          followersCount: 0,
          followeesCount: 0,
          reviewCount: 0,
          averageRating: 0,
          mostFavoriteCategory: null,
        }}
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
