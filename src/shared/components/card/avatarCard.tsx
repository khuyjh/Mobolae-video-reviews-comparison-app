import clsx from 'clsx';
import { Star } from 'lucide-react';
import React from 'react';

import { Chip } from '@/shared/components/chip';
import { toRankingChip } from '@/shared/utils/rankingUtil';

/***************** 메인페이지 랭킹 / 팔로워 목록 / 리뷰   **************/
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

/***************** css 스타일  **************/
const AVATAR_WRAPPER =
  'mr-[10px] h-[36px] w-[36px] overflow-hidden rounded-full xl:h-[42px] xl:w-[42px]';
const AVATAR_IMG = 'h-full w-full object-cover';
const AVATAR_SIZE_FOLLOWER =
  'mr-[10px] h-[48px] w-[48px] overflow-hidden rounded-full xl:h-[52px] xl:w-[52px]';

const HEADER_ROW = 'flex items-center gap-[5px]';
const BADGE_BASE =
  'rounded-[50px] px-[6px] py-[2px] text-xxs-regular xl:px-[8px] xl:text-xs-regular';

const NAME_TEXT = ' text-white text-md-regular xl:text-base-medium';
const FOLLOWER_NAME_TEXT = 'text-white text-base-medium xl:text-lg-medium';

const META_ROW = 'flex gap-[10px] text-xxs-light text-gray-600 xl:text-xs-light';
const CENTER_ROW = 'flex items-center';

const STAR_ICON_STYLE = 'h-[12px] w-[12px] text-yellow-400 xl:h-[18px] xl:w-[18px]';
const STAR_ICON_EMPTY_STYLE = 'text-gray-500 opacity-40';

/***************** 리뷰 별점 **************/
type StarRowProps = {
  count: number;
};

export function StarRow({ count }: StarRowProps) {
  const stars = count;

  return (
    <div className={CENTER_ROW}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < stars;
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

/***************** 컴포넌트 시작  **************/
export default function ProfileBadge({
  variant,
  id,
  name,
  avatarSrc,
  followers = 0,
  review = 0,
  rating = 0,
  rankingMap,
}: ProfileBadgeProps) {
  const rankingChip = variant === 'ranking' && rankingMap ? toRankingChip(id, rankingMap) : null;
  return (
    <div className='flex'>
      {/*아바타*/}
      <div
        className={clsx(
          variant === 'ranking' && AVATAR_WRAPPER,
          variant === 'reviewProfile' && AVATAR_WRAPPER,
          variant === 'follower' && AVATAR_SIZE_FOLLOWER,
        )}
      >
        <img src={avatarSrc} alt='프로필 이미지' draggable={false} className={AVATAR_IMG} />
      </div>
      {/*메인페이지에 들어 갈 아바타 카드*/}
      {variant === 'ranking' && (
        <div>
          <div className={HEADER_ROW}>
            {rankingChip ? (
              <Chip {...rankingChip} className={BADGE_BASE} />
            ) : (
              <span className={BADGE_BASE + ' bg-gray-200 text-gray-600'}>등수</span>
            )}
            <span className={NAME_TEXT}>{name}</span>
          </div>
          <div className={META_ROW}>
            <span>팔로워 {followers}</span>
            <span>리뷰 {review}</span>
          </div>
        </div>
      )}

      {/*리뷰페이지 들어 갈 아바타 카드*/}
      {variant === 'reviewProfile' && (
        <div>
          <div className={CENTER_ROW}>
            <span className={NAME_TEXT}>{name}</span>
          </div>
          <StarRow count={rating} />
        </div>
      )}

      {/*팔로우목록에 들어 갈 아바타 카드*/}
      {variant === 'follower' && (
        <div className={CENTER_ROW}>
          <span className={FOLLOWER_NAME_TEXT}>{name}</span>
        </div>
      )}
    </div>
  );
}
