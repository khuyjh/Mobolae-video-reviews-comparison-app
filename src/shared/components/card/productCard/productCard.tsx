// 이미지 + 메인

import React from 'react';

import ProductActions from './productActions';
import ProductButtons from './productButtons';
import ProductDescription from './productDescription';
import ProductHeader from './productHeader';

interface ProductCardProps {
  imageSrc: string;
  chipLabel: string;
  title: string;
  views: number;
  description: string;
}

const ProductCard = ({ imageSrc, chipLabel, title, views, description }: ProductCardProps) => {
  return (
    <div>
      {/* 이미지 섹션 */}
      <div>
        <img src={imageSrc} alt='' />
      </div>

      {/* 콘텐츠 섹션 */}
      <div>
        {/* 헤더 (칩, 제목, 조회수) */}
        <ProductHeader chipLabel={chipLabel} title={title} views={views} />
        {/* 액션 버튼 (찜, 공유) */}
        <ProductActions />
        {/* 설명 */}
        <ProductDescription description={description} />
        <ProductButtons />
      </div>
    </div>
  );
};

export default ProductCard;
