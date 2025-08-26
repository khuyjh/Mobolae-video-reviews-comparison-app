// 이미지 + 메인

import React from 'react';

import { formatNumber } from '@/shared/utils/formatters';

import ProductActions from './productActions';
import ProductButtons from './productButtons';
import ProductDescription from './productDescription';
import ProductHeader from './productHeader';

interface ProductCardProps {
  imageSrc: string;
  chipLabel: string;
  title: string;
  views: number | string;
  description: string;
  isEditable: boolean;
}

const ProductCard = ({
  imageSrc,
  chipLabel,
  title,
  views,
  description,
  isEditable,
}: ProductCardProps) => {
  const formattedViews = formatNumber(views);

  return (
    <div className='flex flex-col md:flex-row'>
      {/* 이미지 섹션 */}
      <div>
        <img src={imageSrc} alt='' className='h-full w-full object-cover' />
      </div>

      {/* 콘텐츠 섹션 */}
      <div className='flex flex-1 flex-col p-[20px]'>
        <div className='flex items-start justify-between'>
          {/* 헤더 (칩, 제목, 조회수) */}
          <ProductHeader chipLabel={chipLabel} title={title} views={formattedViews} />
          {/* 액션 버튼 (찜, 공유) */}
          <ProductActions />
        </div>
        {/* 설명 */}
        <ProductDescription description={description} />
        <ProductButtons isEditable={isEditable} />
      </div>
    </div>
  );
};

export default ProductCard;
