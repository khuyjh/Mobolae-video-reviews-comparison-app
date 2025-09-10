'use client';

import Link from 'next/link';

import React, { useMemo } from 'react';

import ProfileBadge from '@/shared/components/card/avatarCard';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';
import { mapUserRankingToReviewer } from '@/shared/utils/reviewerMapper';

import { useUserRanking } from '../../../../openapi/queries';

import type { UserRanking } from '../../../../openapi/requests/types.gen';
import type { Reviewer } from '@/shared/types/reviewer';

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
  const meId = useUserStore((state) => state.user?.id);

  const sorted = useMemo(
    () => [...reviewers].sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0)),
    [reviewers],
  );

  const topN = 5;
  const top = useMemo(() => sorted.slice(0, topN), [sorted]);

  const rankingMap = useMemo(
    () => new Map(top.map((reviewer, i) => [reviewer.userId, i + 1])),
    [top],
  );

  const getHref = (userId: number) => (meId && userId === meId ? '/mypage' : `/user/${userId}`);

  if (direction === 'row') {
    return (
      <div className='flex w-full snap-x snap-mandatory flex-nowrap gap-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {top.map((reviewer) => (
          <Link
            key={reviewer.userId}
            href={getHref(reviewer.userId)}
            className='min-w-[147px] flex-none shrink-0 snap-start'
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

  return (
    <div className='space-y-[30px]'>
      {top.map((reviewer) => (
        <Link key={reviewer.userId} href={getHref(reviewer.userId)} className='block'>
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
 */
export const ReviewerRankingHorizontal: React.FC = () => {
  const { data, isLoading, isError } = useUserRanking(PATH_OPTION, [], {
    staleTime: 30_000,
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
 */
export const ReviewerRankingSidebar: React.FC = () => {
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
