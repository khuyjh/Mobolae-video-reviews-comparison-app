// 칩 + 제목 + 조회수

import React from 'react';

import { Chip } from '../../chip';

interface ProductHeaderProps {
  chipLabel: string;
  title: string;
  views: number;
}

const ProductHeader = ({ chipLabel, title, views }: ProductHeaderProps) => {
  return (
    <div className='flex flex-col items-start gap-[10px]'>
      <Chip className='text-xs-regular bg-[#23B5811A] text-[#23B581]'>{chipLabel}</Chip>
      <h2 className='text-xl-semibold text-white'>{title}</h2>
      <p className='text-md-light text-gray-600'>조회 {views}</p>
    </div>
  );
};

export default ProductHeader;
