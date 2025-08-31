// 비교하기 페이지
'use client';

import { useState } from 'react';

import { cn } from '@/shared/lib/cn';

// Update the path below to match the actual location and filename of CompareSelect
import CompareSelect, { CompareOption } from '../../features/compare/components/CompareSelect';

const MOCK: CompareOption[] = [
  { id: 1, name: 'Air Pods Max' },
  { id: 2, name: 'Air Pods 1', disabled: true },
  { id: 3, name: 'Air Pods Pro' },
  { id: 4, name: 'Air Pods Pro 2' },
  { id: 5, name: 'Sony WH-1300XM3' },
];

export default function ComparePage() {
  const [left, setLeft] = useState<CompareOption | null>({ id: 5, name: 'Sony WH-1300XM3' });
  const [right, setRight] = useState<CompareOption | null>(null);

  const canCompare = !!left && !!right;

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <CompareSelect
          label='콘텐츠 1'
          value={left}
          onChange={setLeft}
          options={MOCK}
          placeholder='콘텐츠명을 입력해 주세요'
        />
        <CompareSelect
          label='콘텐츠 2'
          value={right}
          onChange={setRight}
          options={MOCK}
          placeholder='콘텐츠명을 입력해 주세요'
        />
      </div>

      <button
        type='button'
        disabled={!canCompare}
        className={cn(
          'w-full rounded-xl px-5 py-4 text-base font-semibold',
          canCompare
            ? 'bg-emerald-500 text-white hover:bg-emerald-400'
            : 'cursor-not-allowed bg-zinc-800 text-zinc-500',
        )}
        onClick={() => {
          // 비교 실행
          console.log('COMPARE', left, right);
        }}
      >
        비교하기
      </button>
    </div>
  );
}
