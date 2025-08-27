// 카카오 공유 + 클립보드 복사
'use client';
import React from 'react';

import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';

const ProductActions = () => {
  return (
    <div className='my-[20px] flex flex-col items-end gap-[10px] md:my-[32px] md:flex-row md:items-start'>
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
  );
};

export default ProductActions;
