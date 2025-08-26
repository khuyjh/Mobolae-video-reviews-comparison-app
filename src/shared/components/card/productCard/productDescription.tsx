// 콘텐츠 설명
import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <p className='text-md-regular mb-[40px] w-full leading-[20px] text-white'>{description}</p>
  );
};

export default ProductDescription;
