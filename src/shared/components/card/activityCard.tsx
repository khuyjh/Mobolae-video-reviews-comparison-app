import { Star, MessageSquare } from 'lucide-react';
import React from 'react';

import { Chip } from '@/shared/components/chip';
import { cn } from '@/shared/lib/cn';
import { toCategoryChip } from '@/shared/utils/categoryUtil';
import { formatNumber } from '@/shared/utils/formatters';

interface ActivityCardProps {
  rating: number | null;
  reviewCount: number | null;
  topCategoryId: number | null;
  className?: string;
}

const CARD_BASE_STYLE =
  'bg-black-800 border-black-700 border flex w-full flex-col rounded-[12px] px-[26.5px] py-[20px] items-center gap-y-[15px] md:rounded-[8px] md:px-[41.5px] md:py-[30px] xl:rounded-[12px] xl:px-[104.5px] xl:py-[30px] xl:gap-y-[20px]';

const TOP_BASE_STYLE =
  'text-md-medium leading-5 text-center xl:text-base-medium xl:leading-6 text-gray-400 w-[52px] h-[40px] md:w-[80px] md:h-[40px] xl:w-[91px] xl:h-[38px] flex items-center justify-center [&_br]:block md:[&_br]:hidden';

const ICON_VALUE_CONTAINER_STYLE = 'flex items-center space-x-[5px]';
const ICON_CONTAINER_STYLE =
  'flex items-center justify-center h-[20px] w-[20px] xl:h-[24px] xl:w-[24px]';
const VALUE_STYLE = 'text-xl-regular xl:text-2xl-regular text-white';

const ActivityCard = ({ rating, reviewCount, topCategoryId, className }: ActivityCardProps) => {
  const categoryChip =
    topCategoryId !== null ? (
      <Chip {...toCategoryChip({ id: topCategoryId, name: '' })} />
    ) : (
      <Chip variant='category'>-</Chip>
    );

  return (
    <div className={cn('grid w-full grid-cols-3 gap-[10px] xl:gap-[20px]', className)}>
      {/* 별점 평균 */}
      <div className={CARD_BASE_STYLE}>
        <p className={TOP_BASE_STYLE}>
          남긴&nbsp;
          <br />
          별점 평균
        </p>
        <div className={ICON_VALUE_CONTAINER_STYLE}>
          <div className={cn(ICON_CONTAINER_STYLE, 'text-yellow')}>
            <Star fill='currentColor' />
          </div>
          <span className={VALUE_STYLE}>{rating !== null ? formatNumber(rating) : '-'}</span>
        </div>
      </div>

      {/* 리뷰 개수 */}
      <div className={CARD_BASE_STYLE}>
        <p className={TOP_BASE_STYLE}>남긴 리뷰</p>
        <div className={ICON_VALUE_CONTAINER_STYLE}>
          <div className={cn(ICON_CONTAINER_STYLE, 'text-blue-600')}>
            <MessageSquare fill='currentColor' />
          </div>
          <span className={VALUE_STYLE}>
            {reviewCount !== null ? formatNumber(reviewCount) : '-'}
          </span>
        </div>
      </div>

      {/* 관심 카테고리 */}
      <div className={CARD_BASE_STYLE}>
        <p className={TOP_BASE_STYLE}>
          관심&nbsp;
          <br />
          카테고리
        </p>
        {categoryChip}
      </div>
    </div>
  );
};

export default ActivityCard;
