// 좋아요 + 카카오 공유 + 클립보드 복사
'use client';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';

import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';

const ProductActions = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className='my-[20px] flex flex-col items-end gap-[10px] md:my-[40px] md:flex-row md:items-center md:gap-[101px] xl:gap-[214px]'>
      {/* 공유 버튼 그룹, 클릭 시 토스트 설정*/}
      <div className='flex gap-[10px] md:order-2'>
        <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
          <KakaotalkIcon className='h-6 w-6 xl:h-7 xl:w-7' />
        </button>
        <button className='bg-black-800 cursor-pointer rounded-[6px] p-[5px]'>
          <ShareIcon className='h-6 w-6 xl:h-7 xl:w-7' />
        </button>
      </div>
      {/* 찜 버튼 */}
      <button onClick={handleLikeClick} className='cursor-pointer md:order-1'>
        <Heart
          className={`h-6 w-6 xl:h-7 xl:w-7 ${isLiked ? 'text-main' : 'text-gray-600'}`}
          fill={isLiked ? 'red' : 'none'}
        />
      </button>
    </div>
  );
};

export default ProductActions;
