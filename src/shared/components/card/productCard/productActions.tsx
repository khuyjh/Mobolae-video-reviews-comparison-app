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
    <div className='my-[20px] flex flex-col items-end gap-[10px]'>
      {/* 공유 버튼 그룹 */}
      <div className='flex gap-[10px]'>
        <button className='bg-black-800 rounded-[6px] p-[5px]'>
          <KakaotalkIcon />
        </button>
        <button className='bg-black-800 rounded-[6px] p-[5px]'>
          <ShareIcon />
        </button>
      </div>
      {/* 찜 버튼 */}
      <button onClick={handleLikeClick}>
        <Heart
          className={isLiked ? 'text-red-500' : 'text-gray-600'}
          fill={isLiked ? 'red' : 'none'}
        />
      </button>
    </div>
  );
};

export default ProductActions;
