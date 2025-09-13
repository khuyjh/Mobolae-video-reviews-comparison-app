'use client';

import Skeleton from './Skeleton';

const HomeItemCardSkeleton = () => {
  return (
    <div className='border-black-700 bg-black-800 relative w-full rounded-lg border p-[10px]'>
      <div className='flex w-full flex-col gap-[10px]'>
        <div className='relative aspect-[14/9] w-full min-w-[140px] overflow-hidden rounded-lg'>
          <Skeleton className='absolute inset-0' />
        </div>
        <div className='w-full'>
          <Skeleton variant='text' className='w-3/4 md:w-2/3 xl:w-1/2' />
          <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 md:flex-nowrap md:gap-y-0'>
            <div className='flex items-center gap-1'>
              <Skeleton variant='text' className='w-10' />
              <Skeleton variant='text' className='w-6' />
            </div>
            <div className='flex items-center gap-1'>
              <Skeleton variant='text' className='w-6' />
              <Skeleton variant='text' className='w-6' />
            </div>
            <div className='order-last flex shrink-0 basis-full items-center gap-1 md:order-none md:ml-auto md:basis-auto'>
              <Skeleton className='h-[12px] w-[12px] md:w-[15px] xl:w-[16px]' />
              <Skeleton variant='text' className='w-8' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeItemCardSkeleton;
