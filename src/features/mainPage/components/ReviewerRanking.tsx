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
 * - reviewers 데이터를 받아 정렬 후 상위 5명만 표시
 * - direction 값에 따라 가로 스크롤 / 세로 리스트 UI로 분기
 * - 현재 로그인한 유저(meId)일 경우 링크는 `/mypage`, 그 외는 `/user/:id`
 * - 가로 모드(row)에서는 hover 시 → 끝까지 자동 스크롤, hover 해제 시 → 처음으로 복귀
 */
const ReviewerRankingList = ({ reviewers, direction = 'row' }: ReviewerRankingListProps) => {
  const meId = useUserStore((state) => state.user?.id);

  // 정렬 후 상위 5명 추출
  const top = useMemo(() => {
    return [...reviewers].sort(sortReviewers).slice(0, 5);
  }, [reviewers]);

  // 등수 매핑: userId → 1위~5위
  const rankingMap = useMemo(
    () => new Map(top.map((reviewer, i) => [reviewer.userId, i + 1])),
    [top],
  );

  // 현재 로그인한 유저면 `/mypage`, 아니면 `/user/:id`
  const getHref = (userId: number) => (meId && userId === meId ? '/mypage' : `/user/${userId}`);

  // 가로 스크롤 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);

  if (direction === 'row') {
    return (
      <div
        ref={containerRef}
        className='flex w-full flex-nowrap gap-5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        // hover 시작 → 끝으로 스크롤
        onMouseEnter={() => {
          if (containerRef.current) {
            containerRef.current.scrollTo({
              left: containerRef.current.scrollWidth - containerRef.current.clientWidth,
              behavior: 'smooth',
            });
          }
        }}
        // hover 해제 → 처음으로 스크롤
        onMouseLeave={() => {
          if (containerRef.current) {
            containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }}
      >
        {top.map((reviewer) => (
          <Link
            key={reviewer.userId}
            href={getHref(reviewer.userId)}
            className='min-w-[147px] flex-none shrink-0'
            draggable={false} // 드래그 시 요소 따라오는 것 방지
          >
            <ProfileBadge
              variant='ranking'
              id={reviewer.userId}
              name={reviewer.name}
              avatarSrc={reviewer.profileImageUrl}
              followers={reviewer.followers ?? 0}
              review={reviewer.review ?? 0}
              rankingMap={rankingMap}
            />
          </Link>
        ))}
      </div>
    );
  }

  // 세로 모드(col)
  return (
    <div className='space-y-[30px]'>
      {top.map((reviewer) => (
        <Link
          key={reviewer.userId}
          href={getHref(reviewer.userId)}
          className='block'
          draggable={false}
        >
          <ProfileBadge
            variant='ranking'
            id={reviewer.userId}
            name={reviewer.name}
            avatarSrc={reviewer.profileImageUrl}
            followers={reviewer.followers ?? 0}
            review={reviewer.review ?? 0}
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
 * - useUserRanking API 훅으로 데이터 요청 후 ReviewerRankingList(row 모드)에 전달
 */
export const ReviewerRankingHorizontal = () => {
  const { data, isLoading, isError } = useUserRanking(PATH_OPTION, [], {
    staleTime: 30_000, // 30초 캐시 유지
  });

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
 * - 데스크탑 전용 세로 리스트 랭킹 사이드바
 * - useUserRanking API 훅으로 데이터 요청 후 ReviewerRankingList(col 모드)에 전달
 */
export const ReviewerRankingSidebar = () => {
  const { data, isLoading, isError } = useUserRanking(PATH_OPTION, [], {
    staleTime: 30_000,
  });

  if (isLoading) return <div>리뷰어 랭킹 불러오는 중...</div>;
  if (isError || !data) return <div>리뷰어 랭킹 불러오기 실패</div>;

  const reviewers: Reviewer[] = (data ?? []).map(mapUserRankingToReviewer);

  return (
    <aside className='border-black-800 h-fit border-l px-[30px] py-[45px] xl:min-w-[250px]'>
      <div className='sticky top-24'>
        <h2 className='text-base-regular mb-[30px] text-white'>리뷰어 랭킹</h2>
        <ReviewerRankingList reviewers={reviewers} direction='col' />
      </div>
    </aside>
  );
};
