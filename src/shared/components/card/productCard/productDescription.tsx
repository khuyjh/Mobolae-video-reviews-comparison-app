import React from 'react';

import { cn } from '@/shared/lib/cn';

const BASE_TEXT_STYLES =
  'text-md-regular xl:text-base-regular leading-[20px] text-white xl:leading-[22px]';

interface ProductDescriptionProps {
  description: string;
  className?: string;
}

const ProductDescription = ({ description, className }: ProductDescriptionProps) => {
  return <p className={cn(BASE_TEXT_STYLES, className)}>{description}</p>;
};

export default ProductDescription;
