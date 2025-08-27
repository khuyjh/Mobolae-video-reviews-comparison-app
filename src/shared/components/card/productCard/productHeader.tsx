// 칩 + 제목 + 찜 + 조회수
'use client';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';

import { toCategoryChip } from '@/shared/utils/categoryUtil';

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
    <div className='my-[20px] flex flex-col items-start gap-[10px] md:my-0 md:gap-[10px]'>
      <Chip {...toCategoryChip(category)} />
      {/* 제목과 찜 버튼을 flex 컨테이너로 묶기 */}
      <div className='flex items-center gap-[10px] md:gap-[15px]'>
        <h2 className='text-xl-semibold text-white'>{title}</h2>
        <button onClick={handleLikeClick} className='cursor-pointer'>
          <Heart
            className={`h-6 w-6 xl:h-7 xl:w-7 ${isLiked ? 'text-main' : 'text-gray-600'}`}
            fill={isLiked ? 'red' : 'none'}
          />
        </button>
      </div>
      <p className='text-md-light text-gray-600'>조회 {views}</p>
    </div>
  );
};

export default ProductHeader;
