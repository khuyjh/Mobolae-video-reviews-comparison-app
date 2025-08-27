// 칩 + 제목 + 조회수

import React from 'react';

import { toCategoryChip } from '@/shared/utils/categoryUtil';

import { Chip } from '../../chip';

interface ProductHeaderProps {
  category: { id: number; name: string };
  title: string;
  views: number | string;
}

const ProductHeader = ({ category, title, views }: ProductHeaderProps) => {
  return (
    <div className='my-[20px] flex flex-col items-start gap-[10px] md:my-0'>
      <Chip {...toCategoryChip(category)} />
      <h2 className='text-xl-semibold text-white'>{title}</h2>
      <p className='text-md-light text-gray-600'>조회 {views}</p>
    </div>
  );
};

export default ProductHeader;
