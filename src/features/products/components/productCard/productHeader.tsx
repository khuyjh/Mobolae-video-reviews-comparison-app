'use client';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@/shared/lib/cn';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';
import { Chip } from '../../../../shared/components/chip';

const ICON_BUTTON_STYLES = 'bg-black-800 cursor-pointer rounded-[6px] p-[5px]';
const ICON_SIZE = 'h-6 w-6 xl:h-7 xl:w-7';

interface ProductHeaderProps {
  category: { id: number; name: string };
  title: string;
}

const ProductHeader = ({ category, title }: ProductHeaderProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const heartIconColor = isLiked ? 'text-red' : 'text-gray-600';

  return (
    <div className='flex w-full flex-col'>
      {/* 모바일 -> 칩 + 공유버튼 | 태블릿/PC -> 칩 */}
      <div className='flex w-full items-center justify-between md:block'>
        <Chip {...toCategoryChip(category)} />
        {/* 공유 버튼 (모바일) */}
        <div className='flex gap-[10px] md:hidden'>
          <button className={ICON_BUTTON_STYLES} aria-label='카카오톡으로 공유하기'>
            <KakaotalkIcon className={ICON_SIZE} />
          </button>
          <button className={ICON_BUTTON_STYLES} aria-label='링크 복사 및 공유하기'>
            <ShareIcon className={ICON_SIZE} />
          </button>
        </div>
      </div>

      {/* 모바일 -> 제목+찜 | 태블릿/PC -> 제목+찜+공유버튼 */}
      <div className='mt-[10px] flex w-full items-center justify-between'>
        <div className='flex w-full items-center justify-between md:w-auto md:justify-start md:gap-[15px]'>
          <h2 className='text-xl-semibold xl:text-2xl-semibold text-white'>{title}</h2>
          <button
            onClick={handleLikeClick}
            className='flex-shrink-0 cursor-pointer'
            aria-label={isLiked ? '찜하기 취소' : '찜하기'}
            aria-pressed={isLiked}
          >
            <Heart className={cn(ICON_SIZE, heartIconColor)} fill={isLiked ? 'red' : 'none'} />
          </button>
        </div>
        {/* 공유 버튼 (태블릿/PC) */}
        <div className='hidden md:flex md:gap-[10px]'>
          <button className={ICON_BUTTON_STYLES} aria-label='카카오톡으로 공유하기'>
            <KakaotalkIcon className={ICON_SIZE} />
          </button>
          <button className={ICON_BUTTON_STYLES} aria-label='링크 복사 및 공유하기'>
            <ShareIcon className={ICON_SIZE} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
