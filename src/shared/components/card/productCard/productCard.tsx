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

const IMAGE_CONTAINER_STYLES =
  'relative aspect-[335/236] w-full bg-gray-300 md:h-[197px] md:w-[280px] xl:h-[250px] xl:w-[335px]';

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
    <div className='flex flex-col px-[20px] md:flex-row md:gap-5'>
      {/* 이미지 섹션 */}
      <div className={IMAGE_CONTAINER_STYLES}>
        <Image src={imageSrc} alt={title} fill className='object-cover' />
      </div>

      {/* 콘텐츠 섹션 */}
      <div className='mt-5 flex flex-1 flex-col md:mt-0 md:py-0 xl:px-[40px]'>
        <ProductHeader category={category} title={title} views={formattedViews} />
        {/* 설명 */}
        <ProductDescription description={description} className='mt-[20px]' />
        <ProductButtons isEditable={isEditable} className='mt-[40px] md:mt-[60px]' />
      </div>
    </div>
  );
};

export default ProductCard;
