'use client';

import React from 'react';

const ReviewSkeleton = () => (
  <div className='bg-black-800 w-full animate-pulse rounded-[12px] p-5 xl:p-7.5'>
    <div className='flex flex-col md:flex-row md:gap-[30px] xl:gap-[80px]'>
      {/* 좌측 유저 영역 */}
      <div className='mb-[30px] flex-shrink-0'>
        <div className='bg-black-700/50 mb-3 h-[48px] w-[48px] rounded-full' />
        <div className='bg-black-700/40 h-4 w-24 rounded' />
      </div>

      {/* 우측 리뷰 영역 */}
      <div className='flex flex-1 flex-col gap-4'>
        <div className='bg-black-700/40 h-4 w-full rounded' />
        <div className='bg-black-700/40 h-4 w-3/4 rounded' />
        <div className='bg-black-700/40 h-4 w-2/5 rounded' />
      </div>
    </div>
  </div>
);

export const ReviewListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className='flex flex-col gap-4'>
    {Array.from({ length: count }).map((_, i) => (
      <ReviewSkeleton key={i} />
    ))}
  </div>
);
