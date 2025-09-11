'use client';

import React, { useMemo, useState } from 'react';

import { normalizeForCompare } from '@/shared/utils/normalize';

type Props = {
  value: string;
  onChange: (v: string) => void;

  /** 부모 onBlur에서 중복/필수 판정 + 토스트 (여기는 표시만) */
  onBlur: () => void;

  /** 서버 후보 목록(안내 전용) */
  names: string[];
  isLoading?: boolean;

  maxLength: number;

  className?: string;
  inputClassName?: string;
  'aria-invalid'?: boolean;
};

const INPUT_CLASSES =
  'border-black-700 bg-black-800 focus:ring-main text-md-regular md:text-base-regular h-[60px] w-full rounded-lg border px-5 text-white transition-colors xl:h-[70px] placeholder:text-gray-500 focus:ring-1 focus:outline-none';

/**
 * 이름 입력 + "중복 안내 전용" 드롭다운
 * - 실제 중복 판정 및 토스트는 부모(onBlur) 1곳에서만
 */
const NameDuplicateGuideInput = ({
  value,
  onChange,
  onBlur,
  names,
  isLoading,
  maxLength,
  'aria-invalid': ariaInvalid,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const trimmed = (value ?? '').trim();

  /** 표시용 후보 필터(정규화 포함) */
  const filtered = useMemo(() => {
    if (!trimmed) return [];
    const q = normalizeForCompare(trimmed);
    return names.filter((n) => normalizeForCompare(n).includes(q));
  }, [names, trimmed]);

  return (
    <div className='relative w-full'>
      <input
        value={value}
        onChange={(e) => onChange((e.target.value || '').slice(0, maxLength))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        placeholder='콘텐츠 제목 (등록 여부를 확인해 주세요)'
        aria-invalid={ariaInvalid}
        className={INPUT_CLASSES}
      />

      {/* 글자수 */}
      <span className='text-xs-light pointer-events-none absolute right-3 bottom-2 text-gray-600'>
        {value.length}/{maxLength}
      </span>

      {/* 안내 패널: 포커스 중 + 1자 이상 */}
      {isFocused && trimmed.length >= 1 && (
        <div className='border-black-700 bg-black-800 absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border p-[10px] shadow-xl'>
          {/* 스크롤 박스: 높이 32px 고정 + overflow-y */}
          <div className='hide-scrollbar max-h-42 overflow-y-auto'>
            {isLoading ? (
              <div className='px-2 py-1 text-sm text-gray-400'>검색 중…</div>
            ) : filtered.length === 0 ? (
              <div className='px-2 py-1 text-sm text-gray-600'>일치하는 결과가 없습니다</div>
            ) : (
              filtered.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className='pointer-events-none mt-[5px] flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-gray-300 first:mt-0'
                  title='선택은 불가합니다 (중복 안내 전용)'
                >
                  <span className='truncate'>{name}</span>
                  <span className='rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] text-red-400'>
                    이미 등록됨
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NameDuplicateGuideInput;
