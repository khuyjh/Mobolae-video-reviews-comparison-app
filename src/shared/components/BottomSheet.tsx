'use client';

// src/components/common/MobileBottomSheet.tsx
import React, { ReactNode, CSSProperties } from 'react';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/cn';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export interface MobileBottomSheetProps {
  /** 시트를 여는 트리거(버튼/아이콘). asChild로 감싸짐 */
  trigger?: ReactNode;
  /** 헤더 타이틀/설명(접근성) */
  title?: ReactNode;
  description?: ReactNode;
  /** 본문/푸터 슬롯 */
  children?: ReactNode;
  footer?: ReactNode;

  /** 시트 방향 (기본 bottom) */
  side?: SheetSide;

  /** 제어 모드 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** 스타일 */
  className?: string; // SheetContent 용
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  /** md 이상 숨김 여부 (기본 true) */
  mobileOnly?: boolean;
  /** 본문 최대 높이 (기본 70vh) */
  maxBodyHeight?: CSSProperties['maxHeight'];
}

export default function MobileBottomSheet({
  trigger,
  title,
  description,
  children,
  footer,
  side = 'bottom',
  open,
  onOpenChange,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  mobileOnly = true,
  maxBodyHeight = '70vh',
}: MobileBottomSheetProps) {
  return (
    <div className={cn(mobileOnly && 'md:hidden')}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

        <SheetContent side={side} className={cn('p-0', className)}>
          {(title || description) && (
            <SheetHeader className={cn('p-4', headerClassName)}>
              {title && <SheetTitle>{title}</SheetTitle>}
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
          )}

          <div
            className={cn('overflow-auto px-4 pb-4', bodyClassName)}
            style={{ maxHeight: maxBodyHeight }}
          >
            {children}
          </div>

          {footer && <SheetFooter className={cn('p-4', footerClassName)}>{footer}</SheetFooter>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
