import { cva, type VariantProps } from 'class-variance-authority';
import { ThumbsUp, Shapes, X } from 'lucide-react';
import React from 'react';

import { cn } from '@/shared/lib/cn';

const chipVariants = cva('inline-flex items-center justify-center whitespace-nowrap', {
  variants: {
    /* 칩의 모양 */
    variant: {
      ranking: 'rounded-[50px]',
      category: 'rounded-[8px]',
      filter: 'rounded-full',
      thumbs: 'rounded-full',
      compare: 'rounded-[6px]',
    },
    /* 칩의 크기 */
    size: {
      ranking: 'px-[6px] py-[2px] xl:px-[8px] xl:py-[2px]',
      category: 'px-[10px] py-[4px] ',
      filter: 'px-[12px] py-[6px] ',
      thumbs: 'px-[12px] py-[6px] ',
      compare: 'px-[10px] py-[8px]',
    },
    /* 텍스트 사이즈 */
    textSize: {
      ranking: 'text-xs-regular',
      category: 'text-lg-medium',
      filter: 'text-md-regular',
      thumbs: 'text-md-regular',
      compare: 'text-base-regular',
    },
    /* 칩의 상호작용 */
    clickable: {
      true: 'cursor-pointer transition-all duration-100 ease-in-out',
    },
  },
  defaultVariants: {
    variant: 'category',
    size: 'category',
  },
});

/* 색상 매핑 (category, ranking, compare용) */
export const colorSchemes = {
  // Category
  영화: 'bg-green-50 text-green-500',
  드라마: 'bg-purple-50 text-purple-500',
  '공연/뮤지컬': 'bg-pink-50 text-pink-500',
  애니메이션: 'bg-pink-100 text-pink-400',
  다큐멘터리: 'bg-orange-50 text-orange-500',
  키즈: 'bg-blue-50 text-blue-500',
  예능: 'bg-yellow-50 text-yellow-500',

  // Ranking
  '1등': 'bg-pink-50 text-pink',
  '2등': 'bg-green-50 text-green',
  '3등': 'bg-red-100 text-red-500',
  '4등': 'bg-gray-50 text-gray-400',
  '5등': 'bg-gray-50 text-gray-400',

  // Compare
  '1번': 'bg-pink-50 text-pink',
  '2번': 'bg-green-50 text-green',
};

type ColorSchemeKey = keyof typeof colorSchemes;

type BaseChipProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof chipVariants>;

/**
 * variant 값에 따라 달라지는 조건부 props 정의
 * - thumbs: isToggled 허용
 * - compare: onRemove 필수, colorKey 제한
 * - filter/ranking/category: 각각 조건 맞는 props만 허용
 */
type ConditionalChipProps =
  | (BaseChipProps & { variant: 'thumbs'; isToggled?: boolean; onRemove?: never; colorKey?: never })
  | (BaseChipProps & {
      variant: 'compare';
      onRemove?: () => void;
      isToggled?: never;
      colorKey: '1번' | '2번';
      textSize?: 'compare';
    })
  | (BaseChipProps & { variant: 'filter'; colorKey?: never; isToggled?: never; onRemove?: never })
  | (BaseChipProps & {
      variant: 'ranking';
      colorKey?: '1등' | '2등' | '3등' | '4등' | '5등';
      isToggled?: never;
      onRemove?: never;
      textSize?: 'ranking';
    })
  | (BaseChipProps & {
      variant: 'category';
      colorKey?: ColorSchemeKey;
      isToggled?: never;
      onRemove?: never;
      textSize?: 'category';
    });

export type ChipProps = ConditionalChipProps;

const _Chip = ({
  className,
  size,
  variant,
  clickable,
  colorKey,
  children,
  isToggled,
  onRemove,
  textSize,
  ...props
}: ChipProps) => {
  let colorClass = '';
  let iconColorClass = '';

  switch (variant) {
    case 'thumbs':
      iconColorClass = isToggled ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300';
      colorClass = isToggled
        ? 'bg-black-800 border border-black-700 text-pink gap-[5px]'
        : 'bg-black-800 border border-black-700 text-gray-400 hover:text-gray-300 gap-[5px]';
      break;
    case 'filter':
      iconColorClass = 'text-gray-400 group-hover:text-gray-300';
      colorClass =
        'bg-black-800 border-black-700 text-gray-400 hover:text-gray-300 border border-black-700';
      break;
    default:
      colorClass = colorKey
        ? colorSchemes[colorKey as ColorSchemeKey]
        : 'bg-gray-200 text-gray-600';
  }

  const renderContent = () => {
    const thumbsIconClasses = 'w-[14px] h-[14px] md:w-[18px] md:h-[18px]';
    const compareIconClasses = 'w-[17px] h-[17px] md:w-[19px] md:h-[19px]';
    switch (variant) {
      case 'filter':
        return (
          <>
            <Shapes size={18} className={iconColorClass} />
            {children}
          </>
        );
      case 'thumbs':
        return (
          <>
            <ThumbsUp className={cn(iconColorClass, thumbsIconClasses)} />
            {children}
          </>
        );
      case 'compare':
        if (onRemove) {
          return (
            <div className='inline-flex items-center gap-[10px]'>
              {children}
              <button onClick={onRemove} className='bg-black-50 rounded-[6px] focus:outline-none'>
                <X
                  className={cn('rounded-sm border border-black text-white', compareIconClasses)}
                />
              </button>
            </div>
          );
        }
        return children;
      default:
        return children;
    }
  };

  return (
    <div
      className={cn(chipVariants({ size, variant, clickable, textSize }), colorClass, className)}
      {...props}
    >
      {renderContent()}
    </div>
  );
};

/* props가 바뀌지 않으면 리렌더링 방지 */
export const Chip = React.memo(_Chip);

export { chipVariants };
