// 선택한 콘텐츠 카테고리 정보 제공 컴포넌트
'use client';

import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import Skeleton from '@/shared/components/skeleton/Skeleton';
import { useCompareStore } from '@/shared/stores/useCompareStore';
import {
  selectAForCategory,
  selectBForCategory,
  selectInFlight,
  selectRequested,
} from '@/shared/stores/useCompareStoreSelectors';

export interface Category {
  id: number;
  name: string;
  value: string;
}

type Props = {
  side: 'A' | 'B';
  categories?: Category[];
  className?: string;
  hideWhenRequested?: boolean;
  showHintText?: boolean;
};

const CHIP_BASE = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium';
const CHIP_A = 'bg-green-50 text-green-600';
const CHIP_B = 'bg-pink-50 text-pink-600';
const HINT_TEXT = 'text-xs text-gray-400';

const resolveCategory = (categoryId: number | null, categories?: Category[]) => {
  if (categoryId == null || !categories) return { name: null, value: null };
  const found = categories.find((c) => c.id === categoryId);
  return { name: found?.name ?? null, value: found?.value ?? null };
};

const CompareCategoryNoticeChip: React.FC<Props> = ({
  side,
  categories,
  className,
  hideWhenRequested = true,
  showHintText = true,
}) => {
  const requested = useCompareStore(selectRequested);
  const inFlight = useCompareStore(selectInFlight);
  const { id, categoryId } = useCompareStore(
    useShallow(side === 'A' ? selectAForCategory : selectBForCategory),
  );

  if (hideWhenRequested && requested) return null;

  /** 미선택 시: 자리만 확보(레이아웃 점프 방지) */
  if (id == null) {
    return <div className={className} aria-hidden />;
  }

  const { name, value } = resolveCategory(categoryId, categories);
  const label = name ?? value ?? (categoryId != null ? `#${categoryId}` : '—');

  const chipColor = side === 'A' ? CHIP_A : CHIP_B;

  return (
    <div
      className={`flex items-center gap-2 ${className ?? ''}`}
      aria-live='polite'
      aria-atomic='true'
      role='status'
    >
      {showHintText && label !== '—' && <span className={HINT_TEXT}>카테고리:</span>}
      {inFlight ? (
        <Skeleton className='h-[22px] w-16 rounded-full' />
      ) : (
        <span
          className={`${CHIP_BASE} ${chipColor}`}
          aria-label={`${side} 카테고리: ${label}`}
          title={label}
        >
          <span className='sr-only uppercase'>{side}</span>
          <span>{label}</span>
        </span>
      )}
    </div>
  );
};

export default memo(CompareCategoryNoticeChip);
