// 칩 + 제목 + 찜 + 조회수 + 공유 버튼
'use client';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';

import { toCategoryChip } from '@/shared/utils/categoryUtil';

import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';
import { Chip } from '../../chip';

interface ProductHeaderProps {
  category: { id: number; name: string };
  title: string;
  views: number | string;
}

const ProductHeader = ({ category, title, views }: ProductHeaderProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    /* 전체 컨테이너 */
    <div className='flex w-full flex-col'>
      {/* 모바일 -> 칩+ 공유버튼 태블릿/pc -> 칩*/}
      <div className='flex w-full items-center justify-between md:block'>
        <Chip {...toCategoryChip(category)} />
        {/* 공유 버튼 (모바일) */}
        <div className='flex gap-[10px] md:hidden'>
          <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
            <KakaotalkIcon className='h-6 w-6 xl:h-7 xl:w-7' />
          </button>
          <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
            <ShareIcon className='h-6 w-6 xl:h-7 xl:w-7' />
          </button>
        </div>
      </div>

      {/* 모바일 -> 제목+찜, 태블릿/pc -> 제목+찜+공유버튼 */}
      <div className='mt-[10px] flex w-full items-center justify-between'>
        <div className='flex w-full items-center justify-between'>
          <h2 className='text-xl-semibold text-white'>{title}</h2>
          <button onClick={handleLikeClick} className='cursor-pointer'>
            <Heart
              className={`h-6 w-6 xl:h-7 xl:w-7 ${isLiked ? 'text-main' : 'text-gray-600'}`}
              fill={isLiked ? 'red' : 'none'}
            />
          </button>
        </div>
        {/* 공유 버튼 (태블릿/PC) */}
        <div className='hidden gap-[10px] md:flex'>
          <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
            <KakaotalkIcon className='h-6 w-6 xl:h-7 xl:w-7' />
          </button>
          <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
            <ShareIcon className='h-6 w-6 xl:h-7 xl:w-7' />
          </button>
        </div>
      </div>

      {/* 조회수 */}
      <p className='text-md-light mt-[10px] text-gray-600'>조회 {views}</p>
    </div>
  );
};

export default ProductHeader;
