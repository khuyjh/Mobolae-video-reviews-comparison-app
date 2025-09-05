'use client';

import React, { useMemo, useState } from 'react';

import { cn as classNames } from '@/shared/lib/cn';

/**
 * 사용자 입력을 비교 가능한 형태로 정규화
 * - 모든 문자를 소문자로 통일
 * - 모든 공백 제거
 */
const normalizeForCompare = (text: string) => (text ?? '').toLowerCase().replace(/\s+/g, '');

export default function NameDuplicateGuideInput({
  value,
  onChange,
  onBlur,
  names, // 서버에서 받아온 기존 상품 이름 목록 (안내 전용, 선택 불가)
  isLoading,
  maxLength,
  onDuplicate, // blur 시 완전 일치하면 호출
  className,
  inputClassName,
  'aria-invalid': ariaInvalid,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  names: string[];
  isLoading?: boolean;
  maxLength: number;
  onDuplicate?: () => void;
  className?: string;
  inputClassName?: string;
  'aria-invalid'?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const trimmedValue = (value ?? '').trim();

  /**
   * 화면에 보여줄 안내 후보 목록
   * - 서버에서 keyword로 1차 필터된 데이터라고 가정
   * - 클라이언트에서 한 번 더 includes로 필터(사용자 경험 안정)
   */
  const filteredCandidates = useMemo(() => {
    if (!trimmedValue) return [];
    const query = normalizeForCompare(trimmedValue);
    return names.filter((name) => normalizeForCompare(name).includes(query));
  }, [names, trimmedValue]);

  return (
    <div className={classNames('relative w-full', className)}>
      <input
        value={value}
        onChange={(e) => onChange((e.target.value || '').slice(0, maxLength))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur(); // React Hook Form blur → zod 검증 트리거(필수/최대 등)
          // blur 시 완전 일치하면 중복 경고
          if (
            trimmedValue &&
            filteredCandidates.some(
              (name) => normalizeForCompare(name) === normalizeForCompare(trimmedValue),
            )
          ) {
            onDuplicate?.();
          }
        }}
        placeholder='상품명 (상품 등록 여부를 확인해 주세요)'
        aria-invalid={ariaInvalid}
        className={classNames(
          'border-black-700 bg-black-800 focus:ring-main text-md-regular placeholder:text-md-regular h-[60px] w-full rounded-lg border px-4 text-white transition-colors placeholder:text-gray-500 focus:ring-1 focus:outline-none',
          inputClassName,
        )}
      />

      {/* 입력 글자 수 표시 (우측 하단) */}
      <span className='text-xs-light pointer-events-none absolute right-3 bottom-2 text-gray-600'>
        {value.length}/{maxLength}
      </span>

      {/* 안내 패널: 포커스 중이고 2자 이상 입력했을 때만 표시 */}
      {isFocused && trimmedValue.length >= 2 && (
        <div className='border-black-700 bg-black-800 absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border p-2 shadow-xl'>
          {isLoading ? (
            <div className='px-2 py-1 text-sm text-gray-400'>검색 중…</div>
          ) : filteredCandidates.length === 0 ? (
            <div className='px-2 py-1 text-sm text-gray-600'>일치하는 결과가 없습니다</div>
          ) : (
            filteredCandidates.map((candidateName, index) => (
              <div
                key={`${candidateName}-${index}`}
                className='pointer-events-none flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-300'
                title='선택은 불가합니다 (중복 안내 전용)'
              >
                <span className='truncate'>{candidateName}</span>
                <span className='rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] text-red-400'>
                  이미 등록됨
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
