'use client';

import HomeItemCardSkeleton from './HomeItemCardSkeleton';

export default function FullGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className='grid grid-cols-2 gap-4 xl:grid-cols-3'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <HomeItemCardSkeleton />
        </div>
      ))}
    </div>
  );
}
