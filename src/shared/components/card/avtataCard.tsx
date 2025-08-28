import clsx from 'clsx';
import { Star } from 'lucide-react';
import React from 'react';

/***************** 메인페이지 랭킹 / 팔로워 목록 / 리뷰   **************/
type Variant = 'ranking' | 'follower' | 'review_profile';

type ProfileBadgeProps = {
  variant: Variant;
  name: string;
  avatarSrc: string;
  rank?: number;
  followers?: number;
  review?: number;
  rating?: number;
  className?: string;
};

/***************** css 스타일  **************/
const AVATAR_WRAPPER =
  'mr-[10px] h-[36px] w-[36px] overflow-hidden rounded-full md:h-[42px] md:w-[42px]';
const AVATAR_IMG = 'h-full w-full object-cover';

const HEADER_ROW = 'flex items-center gap-[2px]';
const BADGE_BASE = 'rounded-[50px] px-[6px] py-[2px] text-[10px] md:px-[8px] md:text-[12px]';
const NAME_TEXT = 'text-[14px] text-white md:text-[16px]';

const META_ROW = 'flex gap-[10px] text-[10px] text-gray-600 md:text-[12px]';
const CENTER_ROW = 'flex items-center';

const STAR_ICON_STYLE = 'h-[12px] w-[12px] text-yellow-400 md:h-[18px] md:w-[18px]';

/***************** 리뷰 별점 **************/
function StarRow({ count = 5 }: { count?: number }) {
  /*음수면 0 5보다 크면 5로 만들기*/

  const stars = Math.max(0, Math.min(5, count));

  return (
    <div className={CENTER_ROW} aria-label={`별점 ${stars}점`}>
      {Array(stars)
        .fill({ length: stars })
        .map((_, i) => (
          <Star key={i} className={STAR_ICON_STYLE} fill='currentColor' stroke='none' />
        ))}
    </div>
  );
}

/***************** 등수별 색상  **************/
function rankStyles(rank?: number) {
  switch (rank) {
    case 1:
      return {
        badge: 'text-pink bg-pink/10',
      };
    case 2:
      return {
        badge: 'text-green bg-green/10',
      };

    default:
      return {
        badge: 'text-gray-400 bg-gray-400/10',
      };
  }
}

/***************** 컴포넌트 시작  **************/
export default function ProfileBadge({
  variant,
  name,
  avatarSrc,
  rank,
  followers = 0,
  review = 0,
  rating = 0,
}: ProfileBadgeProps) {
  const { badge } = rankStyles(rank);

  return (
    <div className='flex'>
      {/*아바타*/}
      <div className={AVATAR_WRAPPER}>
        <img src={avatarSrc} alt='프로필 이미지' draggable={false} className={AVATAR_IMG} />
      </div>
      {/*메인페이지에 들어 갈 아바타 카드*/}
      {variant === 'ranking' && (
        <div>
          <div className={HEADER_ROW}>
            <span className={clsx(BADGE_BASE, badge)}>{rank ? `${rank}등` : '등수'}</span>
            <span className={NAME_TEXT}>{name}</span>
          </div>
          <div className={META_ROW}>
            <span>팔로워 {followers}</span>
            <span>리뷰 {review}</span>
          </div>
        </div>
      )}

      {/*리뷰페이지 들어 갈 아바타 카드*/}
      {variant === 'review_profile' && (
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
          <span className={NAME_TEXT}>{name}</span>
        </div>
      )}
    </div>
  );
}
