'use client';

import { ReactNode } from 'react';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/cn';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * MobileBottomSheet props
 */
export interface MobileBottomSheetProps {
  trigger: ReactNode; // 시트를 여는 트리거
  children: ReactNode; // 시트 내부 콘텐츠
  side?: SheetSide; // 열리는 방향 (기본 bottom)
  className?: string; // 추가 스타일
  a11yTitle?: string; // 접근성용 제목
  a11yDescription?: string; // 접근성용 설명
}

const BASE_STYLE = 'p-4 bg-black-900 border-none rounded-t-lg';

/**
 * MobileBottomSheet 컴포넌트
 *
 * 모바일 환경에서 사용하는 바텀시트 UI
 * - Radix UI의 Sheet를 래핑하여 구현
 * - 접근성(스크린리더)을 위한 숨김 제목/설명 지원
 * - side 속성으로 열리는 방향 지정 가능 (기본 bottom)
 */
const MobileBottomSheet = ({
  trigger,
  children,
  side = 'bottom',
  className,
  a11yTitle = '모바일 바텀시트',
  a11yDescription,
}: MobileBottomSheetProps) => {
  const titleId = 'mobile-sheet-title'; // 접근성 ID (제목)
  const descId = 'mobile-sheet-desc'; // 접근성 ID (설명)

  return (
    <div>
      <Sheet>
        {/* 트리거 버튼 */}
        <SheetTrigger asChild>{trigger}</SheetTrigger>

        {/* 시트 콘텐츠 */}
        <SheetContent
          side={side}
          className={cn(BASE_STYLE, className)}
          aria-labelledby={titleId}
          aria-describedby={a11yDescription ? descId : undefined}
        >
          {/* 스크린리더 전용 제목/설명 */}
          <SheetHeader className='sr-only'>
            <SheetTitle id={titleId}>{a11yTitle}</SheetTitle>
            {a11yDescription && <SheetDescription id={descId}>{a11yDescription}</SheetDescription>}
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileBottomSheet;
