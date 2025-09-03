'use client';

import Link from 'next/link';

import React, { useMemo } from 'react';

import { mockReviewers } from '@/features/mainPage/mock/mockContents';
import ProfileBadge from '@/shared/components/card/avatarCard';

import type { Reviewer } from '@/shared/types/reviewer';

// 리뷰어 프로필 상세 페이지로 이동하는 라우트 생성 함수
const buildReviewerHref = (userId: number) => `/user/${userId}`;

type Direction = 'row' | 'col';

type ReviewerRankingListProps = {
  reviewers: Reviewer[];
  direction?: Direction; // 기본값: 'row'
};

/**
 * ReviewerRankingList
 * - reviewers 데이터를 받아 랭킹 순서대로 ProfileBadge를 렌더링하는 리스트 컴포넌트
 * - direction에 따라 'row'(가로 스크롤) / 'col'(세로 리스트) 배치 지원
 * - TODO: 팔로워 동률일 경우 처리
 */
const ReviewerRankingList: React.FC<ReviewerRankingListProps> = ({
  reviewers,
  direction = 'row',
}) => {
  // 팔로워 수 기준 내림차순 정렬
  // reviewers 배열을 얕은 복사 후 sort (원본 불변)
  const sorted = useMemo(
    () => [...reviewers].sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0)),
    [reviewers],
  );

  // 상위 5명만 제한
  const topN = 5;
  const top = useMemo(() => sorted.slice(0, topN), [sorted]);

  // 등수 매핑: userId → rank
  // 예: {1: 1위, 2: 2위, ...}
  const rankingMap = useMemo(
    () => new Map(top.map((reviewer, i) => [reviewer.userId, i + 1])),
    [top],
  );

  // --- 가로 스크롤 버전 ---
  if (direction === 'row') {
    return (
      <div className='flex w-full snap-x snap-mandatory flex-nowrap gap-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {top.map((reviewer) => (
          <Link
            key={reviewer.userId}
            href={buildReviewerHref(reviewer.userId)}
            className='min-w-[147px] flex-none shrink-0 snap-start'
          >
            <ProfileBadge
              variant='ranking'
              id={reviewer.userId} // ProfileBadge는 id prop 사용
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

  // --- 세로 리스트 버전 ---
  return (
    <div className='space-y-[30px]'>
      {top.map((reviewer) => (
        <Link key={reviewer.userId} href={buildReviewerHref(reviewer.userId)} className='block'>
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
 * - 모바일·태블릿 전용
 * - 가로 스크롤 리스트 형태로 리뷰어 랭킹을 표시
 */
export const ReviewerRankingHorizontal: React.FC<{ reviewers?: Reviewer[] }> = ({
  reviewers = mockReviewers as Reviewer[],
}) => (
  <section>
    <h2 className='text-md-regular mb-3 text-white'>리뷰어 랭킹</h2>
    <ReviewerRankingList reviewers={reviewers} direction='row' />
  </section>
);

/**
 * ReviewerRankingSidebar
 * - 데스크탑 전용
 * - 좌측 레일에 세로 리스트 형태로 리뷰어 랭킹을 표시
 */
export const ReviewerRankingSidebar: React.FC<{ reviewers?: Reviewer[] }> = ({
  reviewers = mockReviewers as Reviewer[],
}) => (
  <aside className='border-black-800 h-fit border-l px-[30px] py-[45px] xl:min-w-[250px]'>
    <div className='sticky top-24'>
      <h2 className='text-base-regular mb-[30px] text-white'>리뷰어 랭킹</h2>
      <ReviewerRankingList reviewers={reviewers} direction='col' />
    </div>
  </aside>
);
