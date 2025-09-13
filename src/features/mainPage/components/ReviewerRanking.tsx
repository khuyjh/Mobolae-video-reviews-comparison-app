'use client';

import Link from 'next/link';

import React, { useMemo, useRef } from 'react';

import ProfileBadge from '@/shared/components/card/avatarCard';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';
import { mapUserRankingToReviewer } from '@/shared/utils/reviewerMapper';
import { sortReviewers } from '@/shared/utils/reviewerSort';

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
 * - row: hover 시 끝까지 스크롤, 해제 시 처음으로 복귀
 */
const ReviewerRankingList = ({ reviewers, direction = 'row' }: ReviewerRankingListProps) => {
  const meId = useUserStore((state) => state.user?.id);

  const top = useMemo(() => [...reviewers].sort(sortReviewers).slice(0, 5), [reviewers]);

  const rankingMap = useMemo(() => new Map(top.map((r, i) => [r.userId, i + 1])), [top]);

  const getHref = (userId: number) => (meId && userId === meId ? '/mypage' : `/user/${userId}`);

  const containerRef = useRef<HTMLDivElement>(null);

  if (direction === 'row') {
    return (
      <div
        ref={containerRef}
        role='list'
        className='flex w-full flex-nowrap gap-5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        onMouseEnter={() => {
          const el = containerRef.current;
          if (el) el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: 'smooth' });
        }}
        onMouseLeave={() => {
          const el = containerRef.current;
          if (el) el.scrollTo({ left: 0, behavior: 'smooth' });
        }}
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

  if (isLoading) return <div>리뷰어 랭킹 불러오는 중...</div>;
  if (isError || !data) return <div>리뷰어 랭킹 불러오기 실패</div>;

  const reviewers: Reviewer[] = (data ?? []).map(mapUserRankingToReviewer);

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

  if (isLoading) return <div>리뷰어 랭킹 불러오는 중...</div>;
  if (isError || !data) return <div>리뷰어 랭킹 불러오기 실패</div>;

  const reviewers: Reviewer[] = (data ?? []).map(mapUserRankingToReviewer);

  return (
    <aside className='border-black-800 sticky top-26 max-h-[calc(100vh-80px)] max-w-[250px] min-w-[250px] self-start overflow-auto border-l px-[30px] py-[45px]'>
      <h2 className='text-base-regular mb-[30px] text-white'>리뷰어 랭킹</h2>
      <ReviewerRankingList reviewers={reviewers} direction='col' />
    </aside>
  );
};
