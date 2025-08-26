import React from 'react';

import ActivityCard from '@/shared/components/card/activityCard';
import StatisticsCard from '@/shared/components/card/statisticsCard';

const StatisticsTestPage = () => {
  return (
    <>
      <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-900 p-6'>
        <h1 className='mb-6 text-2xl font-bold text-white'>StatisticsCard Test Page</h1>

        <div className='grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3'>
          <StatisticsCard
            title='찜'
            value={12345}
            iconType='heart'
            comparisonText='같은 카테고리의 제품들보다 23개 더 적어요!'
          />

          <StatisticsCard
            title='별점 평균'
            value={4.8}
            iconType='star'
            comparisonText='같은 카테고리의 제품들보다 0.8점 더 높아요!'
          />

          <StatisticsCard
            title='리뷰'
            value={987}
            iconType='message'
            comparisonText='같은 카테고리의 제품들보다 186개 더 많아요!'
          />
        </div>
      </div>
      <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-900 p-6'>
        <h1 className='mb-6 text-2xl font-bold text-white'>ActivityCard Test Page</h1>

        <div className='grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3'>
          {/* 아이콘 + 값 (star) */}
          <ActivityCard title='남긴 별점 평균' variant='iconValue' value={4.1} iconType='star' />

          {/* 아이콘 + 값 (message) */}
          <ActivityCard title='남긴 리뷰' variant='iconValue' value={125} iconType='message' />

          {/* 칩 */}
          <ActivityCard
            title='관심 카테고리'
            variant='chip'
            chipLabel='전자기기'
            chipClassName='bg-[#23B5811A] text-[#23B581]'
          />
        </div>
      </div>
    </>
  );
};

export default StatisticsTestPage;
