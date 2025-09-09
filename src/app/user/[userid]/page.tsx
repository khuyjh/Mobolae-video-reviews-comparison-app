'use client';

import { useParams, usePathname } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';

import VirtualizedContentGrid from '@/features/mainPage/components/VirtualizedContentGrid';
import ActivityCard from '@/features/mypage/components/activityCard';
import { UserProfileCard } from '@/features/mypage/components/ProfileCard';
import ProfileTabs from '@/features/mypage/components/ProfileTabs';
import { fetchDummyPage } from '@/features/mypage/mock/dummyPager';

import type { ContentItem } from '@/shared/types/content';

type TabKey = 'reviews' | 'items' | 'wishlist';

export default function UserPage() {
  const params = useParams<Record<string, string>>();

  const rawId = params.useId ?? params.id ?? params.userId ?? '';

  const [tab, setTab] = useState<TabKey>('reviews');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['mypage', 'infinite', tab],
    queryFn: ({ pageParam = 0 }) => fetchDummyPage({ cursor: pageParam, limit: 12 }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

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
        <UserProfileCard userId={rawId} />
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
