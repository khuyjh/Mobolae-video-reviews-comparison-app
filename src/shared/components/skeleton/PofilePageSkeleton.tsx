'use client';

import React from 'react';

import FullGridSkeleton from '@/shared/components/skeleton/FullGridSkeleton';

const SkeletonBox = ({ className }: { className: string }) => (
  <div className={`bg-black-700/40 animate-pulse rounded-md ${className}`} />
);

const ProfilePageSkeleton = () => {
  return (
    <div className='mt-[30px] px-[20px] md:px-[117px] xl:mx-auto xl:flex xl:max-w-[1340px] xl:px-0'>
      {/* 좌측 프로필 카드 */}
      <div className='mb-[60px] xl:mr-[60px]'>
        <div className='bg-black-800 border-black-700 m-auto w-full rounded-[12px] border px-[30px] py-[20px] md:w-[509px] md:py-[30px] xl:w-[340px] xl:py-[20px] xl:pt-[40px] xl:pb-[30px]'>
          {/* 프로필 이미지 */}
          <SkeletonBox className='mx-auto h-[120px] w-[120px] rounded-full xl:h-[180px] xl:w-[180px]' />
          {/* 이름 + bio */}
          <SkeletonBox className='mx-auto mt-[30px] h-6 w-40' />
          <SkeletonBox className='mx-auto mt-[10px] h-4 w-60' />
          {/* 팔로워 / 팔로잉 */}
          <div className='mt-[30px] flex justify-between text-center'>
            <SkeletonBox className='h-5 w-20' />
            <SkeletonBox className='h-5 w-20' />
          </div>
          {/* 버튼 2개 */}
          <div className='mt-[30px] flex flex-col gap-[10px]'>
            <SkeletonBox className='h-10 w-full' />
            <SkeletonBox className='h-10 w-full' />
          </div>
        </div>
      </div>

      {/* 우측 콘텐츠 */}
      <div className='flex-1'>
        {/* 활동 내역 */}
        <div className='mb-[60px]'>
          <SkeletonBox className='mb-[30px] h-6 w-24' />
          <div className='grid w-full grid-cols-3 gap-[10px] xl:gap-[20px]'>
            {/* ActivityCard skeleton 맞춤 */}
            <div className='bg-black-800 border-black-700 flex min-h-[140px] flex-col items-center rounded-[12px] border px-[26.5px] py-[20px] md:min-h-[160px] md:px-[41.5px] md:py-[30px] xl:min-h-[180px] xl:px-[104.5px] xl:py-[30px]'>
              <SkeletonBox className='mb-4 h-5 w-16' />
              <SkeletonBox className='h-6 w-12' />
            </div>
            <div className='bg-black-800 border-black-700 flex min-h-[140px] flex-col items-center rounded-[12px] border px-[26.5px] py-[20px] md:min-h-[160px] md:px-[41.5px] md:py-[30px] xl:min-h-[180px] xl:px-[104.5px] xl:py-[30px]'>
              <SkeletonBox className='mb-4 h-5 w-20' />
              <SkeletonBox className='h-6 w-12' />
            </div>
            <div className='bg-black-800 border-black-700 flex min-h-[140px] flex-col items-center rounded-[12px] border px-[26.5px] py-[20px] md:min-h-[160px] md:px-[41.5px] md:py-[30px] xl:min-h-[180px] xl:px-[104.5px] xl:py-[30px]'>
              <SkeletonBox className='mb-4 h-5 w-20' />
              <SkeletonBox className='h-6 w-16' />
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className='mb-6 flex gap-6'>
          <SkeletonBox className='h-6 w-24' />
          <SkeletonBox className='h-6 w-24' />
          <SkeletonBox className='h-6 w-24' />
        </div>

        {/* 콘텐츠 리스트 → 기존 FullGridSkeleton 재사용 */}
        <FullGridSkeleton />
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
