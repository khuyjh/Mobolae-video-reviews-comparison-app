// 하단 버튼들
import React from 'react';

import Button from '@/shared/components/Button';

interface ProductButtonsProps {
  isEditable: boolean;
}

const ProductButtons = ({ isEditable }: ProductButtonsProps) => {
  return (
    <div className='flex flex-col gap-[15px]'>
      <Button variant='primary' className='w-full max-w-none rounded-[8px]'>
        리뷰 작성하기
      </Button>
      <Button variant='secondary' className='w-full max-w-none rounded-[8px]'>
        비교하기
      </Button>
      {isEditable && (
        <Button variant='tertiary' className='w-full max-w-none rounded-[8px]'>
          편집하기
        </Button>
      )}
    </div>
  );
};

export default ProductButtons;
