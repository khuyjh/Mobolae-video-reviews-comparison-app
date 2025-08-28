// features/mainPage/components/ReviewerRanking.tsx
'use client';

import React from 'react';

export interface Reviewer {
  id: number;
  name: string;
  profileImageUrl: string;
}

const sampleReviewerList: Reviewer[] = [
  { id: 1, name: '무비덕', profileImageUrl: 'https://i.pravatar.cc/40?img=1' },
  { id: 2, name: '더라마요정', profileImageUrl: 'https://i.pravatar.cc/40?img=2' },
  { id: 3, name: '시네필', profileImageUrl: 'https://i.pravatar.cc/40?img=3' },
  { id: 4, name: '빙의장인', profileImageUrl: 'https://i.pravatar.cc/40?img=4' },
  { id: 5, name: '감성장전', profileImageUrl: 'https://i.pravatar.cc/40?img=5' },
];

/** 개별 카드 */
function RankingCard({
  reviewer,
  isHorizontalLayout = false,
}: {
  reviewer: Reviewer;
  isHorizontalLayout?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 ${isHorizontalLayout ? 'min-w-[147px]' : ''}`}>
      <div className='flex items-center space-x-3'>
        <img
          src={reviewer.profileImageUrl}
          alt={reviewer.name}
          className='h-8 w-8 rounded-full object-cover'
        />
        <div className='text-sm-medium truncate text-white'>{reviewer.name}</div>
      </div>
    </div>
  );
}

/** 모바일·태블릿·소형 데스크탑: 가로 스크롤 바 (lg 미만에서 보이도록) */
export function ReviewerRankingHorizontal({
  reviewers = sampleReviewerList,
}: {
  reviewers?: Reviewer[];
}) {
  return (
    <section
      aria-labelledby='reviewer-ranking-title-horizontal'
      className='mt-[30px] md:mt-[40px] lg:hidden'
    >
      <h2 id='reviewer-ranking-title-horizontal' className='text-lg-semibold mb-3 text-white'>
        리뷰어 랭킹
      </h2>
      <div className='flex w-full gap-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {reviewers.map((reviewer) => (
          <RankingCard key={reviewer.id} reviewer={reviewer} isHorizontalLayout />
        ))}
      </div>
    </section>
  );
}

/** 큰 화면(lg 이상): 좌측 레일 세로 리스트 */
export function ReviewerRankingSidebar({
  reviewers = sampleReviewerList,
}: {
  reviewers?: Reviewer[];
}) {
  return (
    <aside
      aria-labelledby='reviewer-ranking-title-sidebar'
      className='mt-[45px] h-fit px-[30px] lg:min-w-[250px]'
    >
      <div className='sticky top-24'>
        <h2 id='reviewer-ranking-title-sidebar' className='text-lg-semibold mb-3 text-white'>
          리뷰어 랭킹
        </h2>
        <div className='space-y-3'>
          {reviewers.map((reviewer) => (
            <RankingCard key={reviewer.id} reviewer={reviewer} />
          ))}
        </div>
      </div>
    </aside>
  );
}
