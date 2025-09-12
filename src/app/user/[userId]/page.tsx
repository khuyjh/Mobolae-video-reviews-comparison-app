'use client';

import { useParams } from 'next/navigation';

import React from 'react';

import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard from '@/features/mypage/components/ProfileCard';
import ProfileTabsSection from '@/features/mypage/components/ProfileTabsSection';
import { useFollowMutations } from '@/features/user/hooks/useFollowMutaion';
import { TEAM_ID, PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useUserDetail } from '../../../../openapi/queries/queries';

import type {
  UserDetailDefaultResponse,
  ListUserReviewedProductsDefaultResponse as ReviewedResp,
  ListUserCreatedProductsDefaultResponse as CreatedResp,
  ListUserFavoriteProductsDefaultResponse as FavoriteResp,
} from '../../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

const toSrc = (url?: string | null): string =>
  url && url.trim() !== '' ? url : '/images/ProfileFallbackImg.png';

const mapUserToCard = (userDetail?: UserDetailDefaultResponse) => ({
  name: userDetail?.nickname ?? '',
  avatarSrc: toSrc(userDetail?.image ?? null),
  bio: userDetail?.description ?? '',
  followers: Number(userDetail?.followersCount ?? 0),
  following: Number(userDetail?.followeesCount ?? 0),
  isMe: false,
  isFollowing: Boolean(userDetail?.isFollowing),
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
  // 응답이 { product: {...} } 이면 product, 아니면 자기 자신
  const maybeProduct = getProp<unknown>(x, 'product');
  const base = maybeProduct ?? x;
  const r = asRecord(base);
  if (r && 'id' in r && typeof r.id === 'number') {
    return r as unknown as ProductLike;
  }
  return undefined;
};

const mapReviewed = (it: ReviewedItem): ContentItem => {
  const p = getProductLike(it);
  const selfRating = getProp<number>(it, 'rating');
  return {
    contentId: p?.id ?? 0,
    title: p?.name ?? p?.title ?? '이름 없는 상품',
    contentImage: toSrc(p?.image ?? null), // ✅ 항상 string
    favoriteCount: Number(p?.favoriteCount ?? 0),
    reviewCount: Number(p?.reviewCount ?? 0),
    rating: Number(selfRating ?? p?.averageRating ?? p?.rating ?? 0),
  };
};

const mapCreated = (it: CreatedItem): ContentItem => {
  const p = getProductLike(it);
  return {
    contentId: p?.id ?? 0,
    title: p?.name ?? p?.title ?? '이름 없는 상품',
    contentImage: toSrc(p?.image ?? null),
    favoriteCount: Number(p?.favoriteCount ?? 0),
    reviewCount: Number(p?.reviewCount ?? 0),
    rating: Number(p?.averageRating ?? p?.rating ?? 0),
  };
};

const mapFavorite = (it: FavoriteItem): ContentItem => {
  const p = getProductLike(it);
  return {
    contentId: p?.id ?? 0,
    title: p?.name ?? p?.title ?? '이름 없는 상품',
    contentImage: toSrc(p?.image ?? null),
    favoriteCount: Number(p?.favoriteCount ?? 0),
    reviewCount: Number(p?.reviewCount ?? 0),
    rating: Number(p?.averageRating ?? p?.rating ?? 0),
  };
};

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const uidNum = Number(userId);
  const enabled = Number.isFinite(uidNum) && !!TEAM_ID;

  const { isLoggedIn, user } = useUserStore();
  const meId = user?.id;

  const fm = useFollowMutations(uidNum, isLoggedIn ? meId : undefined);
  const followBtnDisabled = !isLoggedIn || fm.actionDisabled;

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

        <ProfileTabsSection
          userId={uidNum}
          mapReviewed={mapReviewed}
          mapCreated={mapCreated}
          mapFavorite={mapFavorite}
        />
      </div>
    </div>
  );
}
