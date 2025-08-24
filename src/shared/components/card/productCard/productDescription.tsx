// 콘텐츠 설명
import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return <p>{description}</p>;
};

export default ProductDescription;
