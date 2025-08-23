'use client';

// src/components/common/MobileBottomSheet.tsx
import { ReactNode } from 'react';

import { Sheet, SheetTrigger, SheetContent } from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/cn';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export interface MobileBottomSheetProps {
  trigger?: ReactNode; // 트리거
  children: ReactNode; // 콘텐츠
  side?: SheetSide; // 나오는 방향 (기본 'bottom')
  className?: string; // SheetContent 클래스
  mobileOnly?: boolean; // md 이상 숨김 (기본 true)
}

export default function MobileBottomSheet({
  trigger,
  children,
  side = 'bottom',
  className,
  mobileOnly = true,
}: MobileBottomSheetProps) {
  return (
    <div className={cn(mobileOnly && 'md:hidden')}>
      <Sheet>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent side={side} className={cn('p-0', className)}>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
}
