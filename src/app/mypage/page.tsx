'use client';

import { useRouter } from 'next/navigation';

import React, { useState } from 'react';
import { toast } from 'react-toastify';

import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard from '@/features/mypage/components/ProfileCard';
import ProfileTabsSection from '@/features/mypage/components/ProfileTabsSection';
import ProfileUpdateModal from '@/features/mypage/components/ProfileUpdateModal';
import { TEAM_ID } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';
import { mapToContentItem } from '@/shared/utils/mapToContentItem';

import { useMe } from '../../../openapi/queries/queries';
import ProfilePageSkeleton from '../../shared/components/skeleton/PofilePageSkeleton';

import type {
  MeDefaultResponse,
  ListUserReviewedProductsDefaultResponse as ReviewedResp,
  ListUserCreatedProductsDefaultResponse as CreatedResp,
  ListUserFavoriteProductsDefaultResponse as FavoriteResp,
} from '../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

const toSrc = (url?: string | null): string =>
  url && url.trim() !== '' ? url : '/images/ProfileFallbackImg.png';

const mapMeToCard = (meDetail?: MeDefaultResponse) => ({
  name: meDetail?.nickname ?? '',
  avatarSrc: toSrc(meDetail?.image ?? null),
  bio: meDetail?.description ?? '',
  followers: Number(meDetail?.followersCount ?? 0),
  following: Number(meDetail?.followeesCount ?? 0),
  isMe: true,
  isFollowing: false,
});

type ReviewedItem = NonNullable<ReviewedResp>['list'][number];
type CreatedItem = NonNullable<CreatedResp>['list'][number];
type FavoriteItem = NonNullable<FavoriteResp>['list'][number];

type ProductLike = {
  id: number;
  name?: string;
  title?: string;
  image?: string | null;
  favoriteCount?: number;
  reviewCount?: number;
  averageRating?: number;
  rating?: number;
};
const asRecord = (x: unknown): Record<string, unknown> | null =>
  x && typeof x === 'object' ? (x as Record<string, unknown>) : null;

const getProp = <T,>(obj: unknown, key: string): T | undefined => {
  const r = asRecord(obj);
  return r && key in r ? (r[key] as T) : undefined;
};

const getProductLike = (x: unknown): ProductLike | undefined => {
  const maybeProduct = getProp<unknown>(x, 'product');
  const base = maybeProduct ?? x;
  const r = asRecord(base);
  if (r && 'id' in r && typeof r.id === 'number') {
    return r as unknown as ProductLike;
  }
  return undefined;
};

const mapReviewed = (it: ReviewedItem): ContentItem =>
  mapToContentItem(it, { preferSelfRating: true });
const mapCreated = (it: CreatedItem): ContentItem => mapToContentItem(it);
const mapFavorite = (it: FavoriteItem): ContentItem => mapToContentItem(it);

export default function MyPage() {
  // 내 정보
  const { data: meData, isLoading: isMeLoading } = useMe(
    { path: { teamId: TEAM_ID as string } },
    [],
  );
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const clearUser = useUserStore((s) => s.clearUser);

  // 로딩/데이터 없음: 스켈레톤 렌더 (레이아웃 고정)
  if (isMeLoading || !meData) {
    return (
      <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
        <ProfilePageSkeleton />
      </div>
    );
  }

  const card = mapMeToCard(meData);

  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
      <div className='mb-[60px] xl:mr-[60px]'>
        <ProfileCard
          userId={meData.id}
          name={card.name}
          avatarSrc={card.avatarSrc}
          bio={card.bio}
          followers={card.followers}
          following={card.following}
          isMe
          isFollowing={false}
          onEdit={() => setIsProfileModalOpen(true)}
          onLogout={() => {
            clearUser();
            router.replace('/');
            toast.success('로그아웃 되었습니다.');
          }}
        />
      </div>

      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        userDetail={meData}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <div className='flex-1'>
        <div className='mb-[60px]'>
          <h2 className='text-lg-semibold mb-[30px] text-white'>활동 내역</h2>
          <ActivityCard
            rating={meData.averageRating}
            reviewCount={meData.reviewCount}
            topCategoryId={meData.mostFavoriteCategory?.id ?? null}
          />
        </div>

        <ProfileTabsSection
          userId={meData.id}
          mapReviewed={mapReviewed}
          mapCreated={mapCreated}
          mapFavorite={mapFavorite}
        />
      </div>
    </div>
  );
}
