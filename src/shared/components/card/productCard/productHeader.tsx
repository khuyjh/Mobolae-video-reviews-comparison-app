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
    <div>
      <Chip>{chipLabel}</Chip>
      <h2>{title}</h2>
      <p>조회 {views}</p>
    </div>
  );
};

export default ProductHeader;
