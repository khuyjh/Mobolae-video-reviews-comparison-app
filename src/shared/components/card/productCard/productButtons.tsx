// 하단 버튼들
import React from 'react';

interface ProductButtonsProps {
  isEditable: boolean;
}

const ProductButtons = ({ isEditable }: ProductButtonsProps) => {
  return (
    <div>
      <button>리뷰 작성하기</button>
      <button>비교하기</button>
      {isEditable && <button>편집하기</button>}
    </div>
  );
};

export default ProductButtons;
