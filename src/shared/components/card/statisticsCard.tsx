import { Star, Heart, MessageSquare } from 'lucide-react';
import React, { useMemo } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatNumber } from '@/shared/utils/formatters';

const CARD_CONTAINER_STYLE = `
  bg-black-800 border-black-700 border flex h-[82px] w-full flex-col rounded-[12px] px-[20px] py-[20px]
  justify-center items-start md:justify-center md:items-center
  md:h-[169px] md:px-[40px] md:gap-y-[15px] md:py-[30px]
  xl:h-[190px] xl:px-[70px] xl:py-[30px]
`;

const ICON_VALUE_CONTAINER_STYLE = 'flex items-center space-x-[5px] md:space-x-[7px]';
const ICON_STYLE =
  'flex items-center justify-center h-[19px] w-[19px] md:h-[20px] md:w-[20px] xl:h-[24px] xl:w-[24px]';
const VALUE_STYLE = 'text-base-light md:text-xl-light xl:text-2xl-light text-gray-400';

const iconMap = {
  heart: {
    component: <Heart fill='currentColor' />,
    colorClass: 'text-red',
    unit: '개',
    moreText: '더 많아요!',
    lessText: '더 적어요!',
    sameText: '로 같아요!',
  },
  star: {
    component: <Star fill='currentColor' />,
    colorClass: 'text-yellow',
    unit: '점',
    moreText: '더 높아요!',
    lessText: '더 낮아요!',
    sameText: '으로 같아요!',
  },
  message: {
    component: <MessageSquare fill='currentColor' />,
    colorClass: 'text-blue-600',
    unit: '개',
    moreText: '더 많아요!',
    lessText: '더 적어요!',
    sameText: '로 같아요!',
  },
};

/**
 * title: 제목
 * value: 표시할 통계 값 (null인 경우 '-'로 표시)
 * iconType: 아이콘 타입
 * comparisonValue: 차이값
 */
export interface StatisticsCardProps {
  title: string;
  value: number | null;
  iconType: 'star' | 'heart' | 'message';
  comparisonValue: number | null;
  className?: string;
}

/* 통계 정보 표시 */
const StatisticsCard = ({
  title,
  value,
  iconType,
  comparisonValue,
  className,
}: StatisticsCardProps) => {
  const config = iconMap[iconType];
  const formattedValue = value !== null ? formatNumber(value) : '-';

  const comparisonText = useMemo(() => {
    const { unit, moreText, lessText, sameText } = config;

    if (comparisonValue === null) {
      return (
        <>
          <span className='text-white'>-</span>
          {unit} {lessText}
        </>
      );
    }
    /* 비교값의 절댓값,포맷팅 */
    const absValue = Math.abs(comparisonValue);
    const formattedComparison = formatNumber(absValue);

    if (comparisonValue === 0) {
      return (
        <>
          <span className='text-white'>
            {formattedComparison}
            {unit}
          </span>
          {sameText}
        </>
      );
    }

    const text = comparisonValue > 0 ? moreText : lessText;
    return (
      <>
        <span className='text-white'>
          {formattedComparison}
          {unit}
        </span>{' '}
        {text}
      </>
    );
  }, [comparisonValue, config]);

  return (
    <div className={cn(CARD_CONTAINER_STYLE, className)}>
      {/* 제목+아이콘+값*/}
      <div className='mb-[5px] flex items-center justify-between space-x-2.5 md:flex-col md:items-center md:space-x-0 md:gap-y-[15px]'>
        <p className='text-md-medium md:text-base-medium xl:text-lg-medium text-white'>{title}</p>
        <div className={ICON_VALUE_CONTAINER_STYLE}>
          <div className={cn(ICON_STYLE, config.colorClass)}>{config.component}</div>
          <span className={VALUE_STYLE}>{formattedValue}</span>
        </div>
      </div>

      {/* 비교 텍스트 */}
      <p className='text-xs-light xl:text-md-light text-gray-400 md:text-center'>
        같은 카테고리의 제품들보다&nbsp;
        <br className='hidden md:block' />
        {comparisonText}
      </p>
    </div>
  );
};
/**
 * favoriteCount: 찜한 사용자 수
 * rating: 별점 평균
 * reviewCount: 총 리뷰 개수
 * favoriteComparison: 찜 평균 차이
 * ratingComparison: 별점 평균 차이
 * reviewComparison: 리뷰 평균 차이
 *
 */
export interface StatisticsProps {
  favoriteCount: number | null;
  rating: number | null;
  reviewCount: number | null;
  favoriteComparison: number | null;
  ratingComparison: number | null;
  reviewComparison: number | null;
  className?: string;
}

const Statistics = ({
  favoriteCount,
  rating,
  reviewCount,
  favoriteComparison,
  ratingComparison,
  reviewComparison,
  className,
}: StatisticsProps) => {
  // 구조 개선: 반복되는 카드들을 배열로 관리
  const statisticsData = useMemo(
    () => [
      {
        title: '별점 평균',
        value: rating,
        iconType: 'star' as const,
        comparisonValue: ratingComparison,
      },
      {
        title: '찜',
        value: favoriteCount,
        iconType: 'heart' as const,
        comparisonValue: favoriteComparison,
      },
      {
        title: '리뷰',
        value: reviewCount,
        iconType: 'message' as const,
        comparisonValue: reviewComparison,
      },
    ],
    [favoriteCount, rating, reviewCount, favoriteComparison, ratingComparison, reviewComparison],
  );

  return (
    <div
      className={cn('grid w-full grid-cols-1 gap-[10px] md:grid-cols-3 xl:gap-[20px]', className)}
    >
      {statisticsData.map((stat) => (
        <StatisticsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default Statistics;
