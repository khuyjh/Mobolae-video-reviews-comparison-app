'use client';

import clsx from 'clsx';
import { Star } from 'lucide-react';
import React from 'react';

import { Chip } from '@/shared/components/chip';
import { toRankingChip } from '@/shared/utils/rankingUtil';

import SafeProfileImage from '../SafeProfileImage';

type Variant = 'ranking' | 'follower' | 'reviewProfile';

type ProfileBadgeProps = {
  variant: Variant;
  id: number;
  name: string;
  avatarSrc: string;
  rank?: string;
  followers?: number;
  review?: number;
  rating?: number;
  rankingMap?: Map<number, number>;
  className?: string;
};

const AVATAR_WRAPPER =
  'mr-[10px] h-[36px] w-[36px] overflow-hidden rounded-full xl:h-[42px] xl:w-[42px]';
const AVATAR_IMG = 'h-full w-full object-cover';
const AVATAR_SIZE_FOLLOWER =
  'mr-[20px] h-[48px] w-[48px] overflow-hidden rounded-full xl:h-[52px] xl:w-[52px]';

const HEADER_ROW = 'flex min-w-0 items-center gap-[5px]';
const BADGE_BASE =
  'rounded-[50px] px-[6px] py-[2px] text-xxs-regular xl:px-[8px] xl:text-xs-regular';

const NAME_TEXT = 'text-white text-md-regular xl:text-base-medium';
const FOLLOWER_NAME_TEXT = 'text-white text-base-medium xl:text-lg-medium';

const META_ROW = 'flex gap-[10px] text-xxs-light text-gray-600 xl:text-xs-light';
const CENTER_ROW = 'flex items-center';

const STAR_ICON_STYLE = 'h-[12px] w-[12px] text-yellow-400 xl:h-[18px] xl:w-[18px]';
const STAR_ICON_EMPTY_STYLE = 'text-gray-500 opacity-40';

export function StarRow({ count }: { count: number }) {
  return (
    <div className={CENTER_ROW} aria-label={`별점 ${count}점`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < count;
        return (
          <Star
            key={i}
            className={`${STAR_ICON_STYLE} ${filled ? '' : STAR_ICON_EMPTY_STYLE}`}
            fill='currentColor'
            stroke='none'
            aria-hidden
          />
        );
      })}
    </div>
  );
}

export default function ProfileBadge({
  variant,
  id,
  name,
  avatarSrc,
  followers = 0,
  review = 0,
  rating = 0,
  rankingMap,
  className,
}: ProfileBadgeProps) {
  const rankingChip = variant === 'ranking' && rankingMap ? toRankingChip(id, rankingMap) : null;

  const getImageSize = () => {
    if (variant === 'follower') return { width: 52, height: 52 };
    return { width: 42, height: 42 };
  };

  return (
    <div className={clsx('flex min-w-0', variant === 'follower' && 'mb-[40px]')}>
      {/* 아바타 */}
      <div
        className={clsx(
          variant === 'ranking' && AVATAR_WRAPPER,
          variant === 'reviewProfile' && AVATAR_WRAPPER,
          variant === 'follower' && AVATAR_SIZE_FOLLOWER,
        )}
      >
        <SafeProfileImage
          src={avatarSrc}
          alt='프로필 이미지'
          draggable={false}
          imgClassName={AVATAR_IMG}
          {...getImageSize()}
        />
      </div>

      {/* ranking 카드 (사이드바 등) */}
      {variant === 'ranking' && (
        <div className='min-w-0 flex-1'>
          <div className={HEADER_ROW}>
            {rankingChip ? (
              <Chip {...rankingChip} className={`${BADGE_BASE} shrink-0`} />
            ) : (
              <span className={`${BADGE_BASE} shrink-0 bg-gray-200 text-gray-600`}>등수</span>
            )}
            {/* 닉네임: 최대 94px, 넘치면 … */}
            <span className={`${NAME_TEXT} max-w-[94px] truncate`}>{name}</span>
          </div>

          {/* 메타줄: 인라인 요소만, gap으로 간격 */}
          <div className={META_ROW}>
            <span className='inline-flex items-center'>
              <span className='pr-[5px]'>팔로워</span>
              {followers}
            </span>
            <span className='inline-flex items-center'>
              <span className='pr-[5px]'>리뷰</span>
              {review}
            </span>
          </div>
        </div>
      )}

      {/* 리뷰 프로필 카드 */}
      {variant === 'reviewProfile' && (
        <div>
          <div className={`${CENTER_ROW} min-w-0`}>
            <span className={NAME_TEXT}>{name}</span>
          </div>
          <StarRow count={rating} />
        </div>
      )}

      {/* 팔로워 카드 */}
      {variant === 'follower' && (
        <div className={clsx(`${CENTER_ROW} min-w-0`, className)}>
          <span className={FOLLOWER_NAME_TEXT}>{name}</span>
        </div>
      )}
    </div>
  );
}
