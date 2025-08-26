// 하단 버튼들
import React from 'react';

interface ProductButtonsProps {
  isEditable: boolean;
}

const ProductButtons = ({ isEditable }: ProductButtonsProps) => {
  return (
    <div className='flex flex-col gap-[15px]'>
      <button className='bg-main h-[50px] w-full rounded-[8px] text-white'>리뷰 작성하기</button>
      <button className='text-main border-main h-[50px] w-full rounded-[8px] border'>
        비교하기
      </button>
      {isEditable && (
        <button className='h-[50px] w-full rounded-[8px] border border-gray-400 text-gray-400'>
          편집하기
        </button>
      )}
    </div>
  );
};

export default ProductButtons;
