import React from 'react';

import Button from '@/shared/components/Button';

interface ProductButtonsProps {
  isEditable: boolean;
  className?: string;
}

const BUTTON_STYLES = 'w-full max-w-none rounded-[8px] md:flex-1';

const ProductButtons = ({ isEditable, className }: ProductButtonsProps) => {
  return (
    <div className={`flex flex-col gap-[15px] md:flex-row ${className}`}>
      <Button variant='primary' className={BUTTON_STYLES}>
        리뷰 작성하기
      </Button>
      <Button variant='secondary' className={BUTTON_STYLES}>
        비교하기
      </Button>
      {isEditable && (
        <Button variant='tertiary' className={BUTTON_STYLES}>
          편집하기
        </Button>
      )}
    </div>
  );
};

export default ProductButtons;
