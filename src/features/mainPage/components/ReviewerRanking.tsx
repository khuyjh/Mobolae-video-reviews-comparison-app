'use client';

import React from 'react';

import { mockReviewers } from '@/features/mainPage/mock/contents';

export interface Reviewer {
  id: number;
  name: string;
  profileImageUrl: string;
}

/** 개별 카드 */
const RankingCard: React.FC<{
  reviewer: Reviewer;
  isHorizontalLayout?: boolean;
}> = ({ reviewer, isHorizontalLayout = false }) => {
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
};

/** 모바일·태블릿·소형 데스크탑: 가로 스크롤 바 (lg 미만에서 보이도록) */
export const ReviewerRankingHorizontal: React.FC<{
  reviewers?: Reviewer[];
}> = ({ reviewers = mockReviewers }) => {
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
};

/** 큰 화면(lg 이상): 좌측 레일 세로 리스트 */
export const ReviewerRankingSidebar: React.FC<{
  reviewers?: Reviewer[];
}> = ({ reviewers = mockReviewers }) => {
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
};
