import React from 'react';

export function RankedUserItem({
  avatarUrl,
  name,
  rank,
  followers,
  reviews,
  className = '',
}: {
  avatarUrl: string;
  name: string;
  rank?: number;
  followers?: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 text-white ${className}`}>
      <img src={avatarUrl} alt='' className='h-10 w-10 rounded-full object-cover' />
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          {rank != null && (
            <span className='rounded-full bg-pink-500/90 px-2 py-0.5 text-[10px] font-semibold text-white'>
              {rank}등
            </span>
          )}
          <span className='text-sm font-semibold'>{name}</span>
        </div>
        <div className='text-xs text-white/60'>
          팔로워 {followers ?? 0} <span className='mx-1'>·</span> 리뷰 {reviews ?? 0}
        </div>
      </div>
    </div>
  );
}

export function BasicUserItem({
  avatarUrl,
  name,
  className = '',
}: {
  avatarUrl: string;
  name: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 text-white ${className}`}>
      <img src={avatarUrl} alt='' className='h-10 w-10 rounded-full object-cover' />
      <span className='text-sm font-semibold'>{name}</span>
    </div>
  );
}

export function RatedUserItem({
  name,
  rating,
  className = '',
}: {
  name: string;
  rating: number; // 0~5
  className?: string;
}) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className={`flex items-center gap-3 text-white ${className}`}>
      <div className='flex flex-col gap-1'>
        <span className='text-sm font-semibold'>{name}</span>
        <div className='text-base leading-none text-yellow-400'>
          {'★'.repeat(r)}
          {'☆'.repeat(5 - r)}
        </div>
      </div>
    </div>
  );
}
