'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
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
  mobileOnly?: boolean; // 기본 true
}

const BASE_STYLE =
  'bg-black-900 focus-visible:ring-black-700 focus-visible:ring-offset-black-900 rounded-t-lg border-none p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

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
  mobileOnly = true,
}: MobileBottomSheetProps) => {
  const [open, setOpen] = useState(false);

  // 컨테이너 포커스 대상
  const contentRef = useRef<HTMLDivElement>(null);
  // 훅 사용: md 이상인지 여부
  const isDesktopUp = useMediaQuery('(min-width: 768px)');

  // md 이상으로 전환되면 자동 닫기
  useEffect(() => {
    if (isDesktopUp && open) setOpen(false);
  }, [isDesktopUp, open]);

  // 모바일 전용이면 데스크톱에서 아예 렌더 안 함
  if (mobileOnly && isDesktopUp) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        ref={contentRef}
        side={side}
        className={cn(BASE_STYLE, className)}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          requestAnimationFrame(() => contentRef.current?.focus());
        }}
        tabIndex={-1}
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
        <div className='p-4 pb-8'>{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileBottomSheet;
