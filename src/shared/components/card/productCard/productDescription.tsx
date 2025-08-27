// 콘텐츠 설명
import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <p className='text-md-regular xl:text-base-regular mt-[20px] mb-[40px] leading-[20px] text-white md:mt-[20px] md:mb-[60px] md:max-w-[384px] xl:max-w-[545px] xl:leading-[22px]'>
      {description}
    </p>
  );
};

export default ProductDescription;
