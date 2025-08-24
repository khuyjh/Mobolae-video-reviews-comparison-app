import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/cn';

const chipVariants = cva(
  'inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors',
  {
    variants: {
      /* 칩의 모양 */
      variant: {
        ranking: 'rounded-[50px]',
        category: 'rounded-[8px]',
        filter: 'rounded-full',
        thumbs: 'rounded-full',
        compare: 'rounded-[6px]',
      },
      /* 칩의 크기 (패딩, 폰트 사이즈) */
      size: {
        ranking: 'px-[8px] py-[2px] text-xs-regular',
        category: 'px-[10px] py-[4px] text-lg-medium',
        filter: 'px-[12px] py-[6px] text-md-regular',
        thumbs: 'px-[12px] py-[6px] text-md-regular',
        compare: 'px-[10px] py-[8px] text-base-regular',
      },
      /* 칩의 상호작용 */
      clickable: {
        true: 'cursor-pointer',
      },
    },
    defaultVariants: {
      /* 기본값 */
      variant: 'category',
      size: 'category',
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, size, variant, clickable, ...props }, ref) => {
    return (
      <div
        className={cn(chipVariants({ size, variant, clickable }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Chip.displayName = 'Chip';

export { Chip, chipVariants };
