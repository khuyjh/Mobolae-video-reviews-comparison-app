// 이미지 + 메인
import Image from 'next/image';

import React from 'react';

import { formatNumber } from '@/shared/utils/formatters';

import ProductButtons from './productButtons';
import ProductDescription from './productDescription';
import ProductHeader from './productHeader';

interface ProductCardProps {
  imageSrc: string;
  category: { id: number; name: string };
  title: string;
  views: number | string;
  description: string;
  isEditable: boolean;
}

const ProductCard = ({
  imageSrc,
  category,
  title,
  views,
  description,
  isEditable,
}: ProductCardProps) => {
  const formattedViews = formatNumber(views);

  return (
    <div className='flex flex-col md:flex-row'>
      {/* 이미지 섹션 */}
      <div className='relative aspect-[335/236] w-full bg-gray-300 md:h-[197px] md:w-[280px] xl:h-[250px] xl:w-[335px]'>
        <Image src={imageSrc} alt={title} layout='fill' objectFit='cover' />
      </div>

      {/* 콘텐츠 섹션 */}
      <div className='flex flex-1 flex-col p-[20px] md:px-[20px] md:py-0 xl:px-[40px]'>
        <ProductHeader category={category} title={title} views={formattedViews} />
        {/* 설명 */}
        <ProductDescription description={description} />
        <ProductButtons isEditable={isEditable} />
      </div>
    </div>
  );
};

export default ProductCard;
