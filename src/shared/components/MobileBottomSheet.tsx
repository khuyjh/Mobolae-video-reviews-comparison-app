'use client';

import { ReactNode } from 'react';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/cn';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * MobileBottomSheet props
 */
export interface MobileBottomSheetProps {
  trigger: ReactNode; // 트리거 요소
  children: ReactNode; // 본문 콘텐츠
  title: ReactNode; // 시트 타이틀
  description?: ReactNode; // 시트 설명 (선택)
  side?: SheetSide; // 열리는 방향 (기본 bottom)
  className?: string; // SheetContent 클래스
}

/**
 * MobileBottomSheet 컴포넌트
 *
 * 모바일 환경에서 사용하는 바텀시트 UI
 * - Radix UI의 Sheet를 래핑하여 구현
 * - side 속성으로 열리는 방향 지정 가능 (기본 bottom)
 */
const MobileBottomSheet = ({
  trigger,
  children,
  title,
  description,
  side = 'bottom',
  className,
}: MobileBottomSheetProps) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>

        <SheetContent
          side={side}
          className={cn('bg-black-900 rounded-t-lg border-none p-0', className)}
        >
          {/* 헤더 */}
          <div className='border-black-800 border-b p-4'>
            <SheetTitle className='text-base-semibold text-white'>{title}</SheetTitle>
            {description && (
              <SheetDescription className='mt-1 text-sm text-gray-500'>
                {description}
              </SheetDescription>
            )}
          </div>

          {/* 본문 */}
          <div className='p-4'>{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileBottomSheet;
