'use client';

import Link from 'next/link';

import React, { useMemo } from 'react';

import ProfileBadge from '@/shared/components/card/avatarCard';
import ReviewerRankingSkeleton from '@/shared/components/skeleton/ReviewerRankingSkeleton';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';
import { mapUserRankingToReviewer } from '@/shared/utils/reviewerMapper';
import { sortReviewers } from '@/shared/utils/reviewerSort';

import ContentEmpty from './ContentEmpty';
import { useUserRanking } from '../../../../openapi/queries';

import type { Reviewer } from '@/shared/types/reviewer';

type Direction = 'row' | 'col';

type ReviewerRankingListProps = {
  reviewers: Reviewer[];
  direction?: Direction; // 기본값: 'row'
};

/**
 * ReviewerRankingList
 * - reviewers 정렬 후 상위 5명만 표시
 * - direction: 'row' 가로 스크롤 / 'col' 세로 리스트
 * - me는 /mypage, 그 외는 /user/:id
 * - row: 수평 스크롤 가능 (hover 애니메이션 제거, 사용자가 직접 스크롤)
 */
const ReviewerRankingList = ({ reviewers, direction = 'row' }: ReviewerRankingListProps) => {
  const meId = useUserStore((state) => state.user?.id);
  const top = useMemo(() => [...reviewers].sort(sortReviewers).slice(0, 5), [reviewers]);
  const rankingMap = useMemo(() => new Map(top.map((r, i) => [r.userId, i + 1])), [top]);
  const getHref = (userId: number) => (meId && userId === meId ? '/mypage' : `/user/${userId}`);

  if (direction === 'row') {
    return (
      <div
        role='list'
        className='flex w-full flex-nowrap gap-5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {top.map((r) => (
          <Link
            key={r.userId}
            href={getHref(r.userId)}
            role='listitem'
            className='min-w-[147px] flex-none shrink-0'
            draggable={false}
          >
            <ProfileBadge
              variant='ranking'
              id={r.userId}
              name={r.name}
              avatarSrc={r.profileImageUrl}
              followers={r.followers ?? 0}
              review={r.review ?? 0}
              rankingMap={rankingMap}
            />
          </Link>
        ))}
      </div>
    );
  }

  // 세로 모드(col)
  return (
    <div role='list' className='space-y-[30px]'>
      {top.map((r) => (
        <Link
          key={r.userId}
          href={getHref(r.userId)}
          role='listitem'
          className='block'
          draggable={false}
        >
          <ProfileBadge
            variant='ranking'
            id={r.userId}
            name={r.name}
            avatarSrc={r.profileImageUrl}
            followers={r.followers ?? 0}
            review={r.review ?? 0}
            rankingMap={rankingMap}
          />
        </Link>
      ))}
    </div>
  );
};

/**
 * ReviewerRankingHorizontal
 * - 모바일/태블릿 전용 가로 스크롤 랭킹 리스트
 */
export const ReviewerRankingHorizontal = () => {
  const { data, isLoading, isError } = useUserRanking(PATH_OPTION, [], { staleTime: 30_000 });

  if (isLoading) return <ReviewerRankingSkeleton direction='row' />;

  if (isError) {
    return (
      <ContentEmpty
        variant='error'
        title='리뷰어 랭킹을 불러오지 못했어요'
        description='잠시 후 다시 시도해주세요.'
      />
    );
  }

  const reviewers: Reviewer[] = (data ?? []).map(mapUserRankingToReviewer);

  if (reviewers.length === 0) {
    return (
      <ContentEmpty
        title='랭킹 데이터가 없어요'
        description='리뷰가 더 쌓이면 랭킹에 표시됩니다.'
      />
    );
  }

  return (
    <section>
      <h2 className='text-md-regular mb-3 text-white'>리뷰어 랭킹</h2>
      <ReviewerRankingList reviewers={reviewers} direction='row' />
    </section>
  );
};

/**
 * ReviewerRankingSidebar
 * - md 이상에서 sticky로 따라오는 세로 랭킹 사이드바
 */
export const ReviewerRankingSidebar = () => {
  const { data, isLoading, isError } = useUserRanking(PATH_OPTION, [], { staleTime: 30_000 });

  if (isLoading) return <ReviewerRankingSkeleton direction='col' />;

  if (isError) {
    return (
      <aside className='border-black-800 sticky top-26 max-h-[calc(100vh-80px)] max-w-[250px] min-w-[250px] self-start overflow-auto border-l px-[30px] py-[45px]'>
        <h2 className='text-base-regular mb-[30px] text-white'>리뷰어 랭킹</h2>
        <ContentEmpty
          variant='error'
          title='리뷰어 랭킹을 불러오지 못했어요'
          description='잠시 후 다시 시도해주세요.'
        />
      </aside>
    );
  }

  const reviewers: Reviewer[] = (data ?? []).map(mapUserRankingToReviewer);

  if (reviewers.length === 0) {
    return (
      <aside className='border-black-800 sticky top-26 max-h-[calc(100vh-80px)] max-w-[250px] min-w-[250px] self-start overflow-auto border-l px-[30px] py-[45px]'>
        <h2 className='text-base-regular mb-[30px] text-white'>리뷰어 랭킹</h2>
        <ContentEmpty
          title='랭킹 데이터가 없어요'
          description='리뷰가 더 쌓이면 랭킹에 표시됩니다.'
        />
      </aside>
    );
  }

  return (
    <aside className='border-black-800 sticky top-26 max-h-[calc(100vh-80px)] max-w-[250px] min-w-[250px] self-start overflow-auto border-l px-[30px] py-[45px]'>
      <h2 className='text-base-regular mb-[30px] text-white'>리뷰어 랭킹</h2>
      <ReviewerRankingList reviewers={reviewers} direction='col' />
    </aside>
  );
};
