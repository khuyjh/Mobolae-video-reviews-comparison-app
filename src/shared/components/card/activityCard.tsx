import { Star, MessageSquare } from 'lucide-react';
import React from 'react';

import { Chip } from '@/shared/components/chip';
import { cn } from '@/shared/lib/cn';
import { formatNumber } from '@/shared/utils/formatters';

/*
 * title: 상단 텍스트
 * variant: 하단 UI
 * value: 아이콘 -> 값
 * iconType: 아이콘
 * chipLabel: 칩 -> 텍스트
 * chipClassName: 칩 -> 스타일
 * className: 커스텀
 */
interface ActivityCardProps {
  title: React.ReactNode;
  variant: 'iconValue' | 'chip';
  value?: string | number;
  iconType?: 'star' | 'message';
  chipLabel?: string;
  chipClassName?: string;
  className?: string;
}

const CARD_BASE_STYLE =
  'bg-black-800 border-black-700 border flex w-full flex-col rounded-[12px] px-[26.5px] py-[20px] items-center gap-y-[15px] md:rounded-[8px] md:px-[41.5px] md:py-[30px] xl:rounded-[12px] xl:px-[104.5px] xl:py-[30px] xl:gap-y-[20px]';

const TOP_BASE_STYLE =
  'text-md-medium leading-5 text-center xl:text-base-medium xl:leading-6 text-gray-400 w-[52px] h-[40px] md:w-[80px] md:h-[40px] xl:w-[91px] xl:h-[38px] flex items-center justify-center [&_br]:block md:[&_br]:hidden';

const ICON_MAP = {
  star: { component: <Star fill='currentColor' />, colorClass: 'text-yellow' },
  message: { component: <MessageSquare fill='currentColor' />, colorClass: 'text-blue-500' },
};

const ICON_VALUE_CONTAINER_STYLE = 'flex items-center space-x-[5px]';
const ICON_CONTAINER_STYLE = 'flex items-center justify-center';
const ICON_SIZE_STYLE = 'h-[20px] w-[20px] xl:h-[24px] xl:w-[24px]';
const VALUE_STYLE = 'text-xl-regular xl:text-2xl-regular text-white';

const ActivityCard = ({
  title,
  variant,
  value,
  iconType,
  chipLabel,
  chipClassName,
  className,
}: ActivityCardProps) => {
  const renderContent = () => {
    /* 아이콘 + 값 */
    if (variant === 'iconValue' && iconType && value !== undefined) {
      const { component: IconComponent, colorClass } = ICON_MAP[iconType];
      return (
        <div className={ICON_VALUE_CONTAINER_STYLE}>
          {/* 아이콘 부분 */}
          <div className={cn(ICON_CONTAINER_STYLE, ICON_SIZE_STYLE, colorClass)}>
            {IconComponent}
          </div>
          <span className={VALUE_STYLE}>{formatNumber(value)}</span>
        </div>
      );
    }

    /* 칩 */
    if (variant === 'chip' && chipLabel) {
      return (
        <Chip variant='category' size='category' className={chipClassName}>
          {chipLabel}
        </Chip>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(CARD_BASE_STYLE, className)}
      role='group'
      aria-label={typeof title === 'string' ? title : undefined}
    >
      {/* 상단 텍스트 */}
      <p className={TOP_BASE_STYLE}>{title}</p>
      {/* 하단 컨텐츠 */}
      {renderContent()}
    </div>
  );
};

export default ActivityCard;
