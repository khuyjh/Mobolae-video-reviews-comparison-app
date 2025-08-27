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
    // 전체를 감싸는 컨테이너: 모바일에서는 세로, 태블릿부터 가로
    <div className='flex w-full flex-col items-start md:flex-row md:items-start md:justify-between'>
      {/* 칩 + 제목 + 조회수 그룹 */}
      <div className='my-[20px] flex flex-col items-start gap-[10px] md:my-0'>
        <Chip {...toCategoryChip(category)} />
        <h2 className='text-xl-semibold text-white'>{title}</h2>
        <p className='text-md-light text-gray-600'>조회 {views}</p>
      </div>

      {/* 찜 버튼 + 공유 버튼 그룹 */}
      <div className='my-[20px] flex flex-col items-end gap-[10px] md:my-0 md:flex-row md:items-center'>
        <button onClick={handleLikeClick} className='cursor-pointer'>
          <Heart
            className={`h-6 w-6 xl:h-7 xl:w-7 ${isLiked ? 'text-main' : 'text-gray-600'}`}
            fill={isLiked ? 'red' : 'none'}
          />
        </button>
        {/* 공유 버튼 그룹 */}
        <div className='flex gap-[10px]'>
          <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
            <KakaotalkIcon className='h-6 w-6 xl:h-7 xl:w-7' />
          </button>
          <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
            <ShareIcon className='h-6 w-6 xl:h-7 xl:w-7' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
