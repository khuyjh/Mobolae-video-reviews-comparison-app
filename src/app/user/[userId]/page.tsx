'use client';

import { useParams } from 'next/navigation';

import ActivityCard from '@/features/mypage/components/activityCard';
import ProfileCard from '@/features/mypage/components/ProfileCard';
import ProfileTabsSection from '@/features/mypage/components/ProfileTabsSection';
import { useFollowMutations } from '@/features/user/hooks/useFollowMutaion';
import ProfilePageSkeleton from '@/shared/components/skeleton/PofilePageSkeleton';
import { TEAM_ID, PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';
import { mapToContentItem } from '@/shared/utils/mapToContentItem';

import { useUserDetail } from '../../../../openapi/queries/queries';

import type {
  UserDetailDefaultResponse,
  ListUserReviewedProductsDefaultResponse as ReviewedResp,
  ListUserCreatedProductsDefaultResponse as CreatedResp,
  ListUserFavoriteProductsDefaultResponse as FavoriteResp,
} from '../../../../openapi/queries/common';
import type { ContentItem } from '@/shared/types/content';

// 프로필 이미지가 없을 때 기본 이미지 반환
const toSrc = (url?: string | null): string =>
  url && url.trim() !== '' ? url : '/images/ProfileFallbackImg.png';

// 유저 상세 정보를 프로필 카드 데이터로 변환
const mapUserToCard = (userDetail?: UserDetailDefaultResponse) => ({
  name: userDetail?.nickname ?? '',
  avatarSrc: toSrc(userDetail?.image ?? null),
  bio: userDetail?.description ?? '',
  followers: Number(userDetail?.followersCount ?? 0),
  following: Number(userDetail?.followeesCount ?? 0),
  isMe: false,
  isFollowing: Boolean(userDetail?.isFollowing),
});

// API 응답 타입 별 아이템 타입 정의
type ReviewedItem = NonNullable<ReviewedResp>['list'][number];
type CreatedItem = NonNullable<CreatedResp>['list'][number];
type FavoriteItem = NonNullable<FavoriteResp>['list'][number];

// 제품 관련 공통 타입
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

// 안전한 객체 접근 유틸
const asRecord = (x: unknown): Record<string, unknown> | null =>
  x && typeof x === 'object' ? (x as Record<string, unknown>) : null;

const getProp = <T,>(obj: unknown, key: string): T | undefined => {
  const r = asRecord(obj);
  return r && key in r ? (r[key] as T) : undefined;
};

// 제품 데이터 변환
const getProductLike = (x: unknown): ProductLike | undefined => {
  const maybeProduct = getProp<unknown>(x, 'product');
  const base = maybeProduct ?? x;
  const r = asRecord(base);
  if (r && 'id' in r && typeof r.id === 'number') {
    return r as unknown as ProductLike;
  }
  return undefined;
};

// 아이템 매핑 함수들
const mapReviewed = (it: ReviewedItem): ContentItem =>
  mapToContentItem(it, { preferSelfRating: true });

const mapCreated = (it: CreatedItem): ContentItem => mapToContentItem(it);
const mapFavorite = (it: FavoriteItem): ContentItem => mapToContentItem(it);

export default function UserPage() {
  // URL 파라미터에서 userId 추출
  const { userId } = useParams<{ userId: string }>();
  const uidNum = Number(userId);
  const enabled = Number.isFinite(uidNum) && !!TEAM_ID;

  // 로그인 사용자 정보
  const { isLoggedIn, user } = useUserStore();
  const meId = user?.id;

  // 유저 상세 API 호출
  const { data: userDetail, isLoading: isUserLoading } = useUserDetail(
    { ...PATH_OPTION, path: { ...PATH_OPTION.path, userId: uidNum } },
    undefined,
    { enabled, retry: false },
  );
  const toastLabel = userDetail?.nickname ?? undefined;

  // 팔로우/언팔로우 훅
  const fm = useFollowMutations(uidNum, isLoggedIn ? meId : undefined, toastLabel);
  const followBtnDisabled = isLoggedIn ? fm.actionDisabled : false;

  // 로딩/데이터 없을 때 스켈레톤 표시
  if (isUserLoading || !userDetail) {
    return <ProfilePageSkeleton />;
  }

  // 프로필 카드 데이터 변환
  const card = mapUserToCard(userDetail);
  const isFollowing = card.isFollowing;

  // 팔로우 토글 핸들러
  const handleFollowToggle = () => {
    isFollowing ? fm.unfollow() : fm.follow();
  };

  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-[0px]'>
      {/* 프로필 카드 */}
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
          onFollowToggle={handleFollowToggle}
        />
      </div>

      <div className='flex-1'>
        {/* 활동 요약 카드 */}
        <div className='mb-[60px]'>
          <h2 className='text-lg-semibold mb-[30px] text-white'>활동 내역</h2>
          <ActivityCard
            rating={userDetail.averageRating}
            reviewCount={userDetail.reviewCount}
            topCategoryId={userDetail.mostFavoriteCategory?.id ?? null}
          />
        </div>

        {/* 리뷰/생성/즐겨찾기 탭 섹션 */}
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
