// 비교 입력창 리팩토링 버전. 비교 셀렉트 컴포넌트
// 기본은 드롭다운 형식
// 입력창 및 연관 검색어 드롭다운으로 보여줌
// 입력값 chip으로 토큰화

'use client';

import { X } from 'lucide-react';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

import type { CompareCandidate } from '@/features/compare/types/compareTypes';

export type CompareSelectProps = {
  label?: string;
  value: CompareCandidate | null; // Chip 선택 값 한번에 1개로 제한
  onChange: (v: CompareCandidate | null) => void; // Chip 선택/해제 콜백
  options: CompareCandidate[]; // 후보 목록
  placeholder?: string;
  disabled?: boolean;
  // 칩 색상용 prop (기본은 left 녹색)
  scheme?: 'left' | 'right';
  //커스텀 스타일
  className?: string; // 외곽 컨테이너 스타일
  inputClassName?: string; // 인풋 스타일
  dropdownClassName?: string; // 드롭다운 패널 스타일
  filterFn?: (opt: CompareCandidate, query: string) => boolean; // 검색 규칙 커스터마이징용 없으면 기본 커스텀 필터 사용
};

/** 커스텀 필터 (기본: 공백/영문 대소문자 무시 매칭) */
const defaultFilter = (opt: CompareCandidate, q: string) => {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
  return norm(opt.name).includes(norm(q));
};

const CompareSelect = forwardRef<HTMLInputElement, CompareSelectProps>(function CompareSelect(
  {
    label,
    value,
    onChange,
    options,
    placeholder = '콘텐츠명을 입력해 주세요',
    disabled = false,
    className,
    inputClassName,
    dropdownClassName,
    filterFn = defaultFilter,
    scheme = 'left',
  },
  _ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const inputId = useId();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    if (!query) return [];
    return options.filter((o) => filterFn(o, query));
  }, [options, query, filterFn]);

  // Chip이 있을 때 입력/검색 비활성
  const inputDisabled = disabled || !!value;

  // 바깥 클릭으로 닫기
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // 드롭다운 열릴 때 첫 항목 활성화
  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, query]);

  const handleSelect = (opt: CompareCandidate) => {
    if (opt.disabled) return;
    onChange(opt);
    setOpen(false);
    setQuery('');
  };

  // 칩 색상용 prop (기본은 left 녹색 글로벌 css chip 색상 사용)
  const ChipColor = {
    left: {
      chip: ' bg-green-50 text-green-500',
      ring: 'focus-within:ring-main', // 필요 시 입력창 포커스 컬러 변경용
    },
    right: {
      chip: ' bg-pink-50 text-pink-500',
      ring: 'focus-within:ring-fuchsia-400/70',
    },
  } as const;

  const handleClear = () => {
    onChange(null);
    setQuery('');
    // 포커스 되돌리기
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }

    if (!open) {
      if (e.key === 'Enter' && filtered[0] && !filtered[0].disabled) {
        // 필터 결과가 있을 때 Enter로 첫 항목 선택(일반 검색처럼 보이도록 UX 보완)
        handleSelect(filtered[0]);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!filtered.length) return;
      let next = activeIndex;
      do {
        next = (next + 1) % filtered.length;
      } while (filtered[next]?.disabled && next !== activeIndex);
      setActiveIndex(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!filtered.length) return;
      let prev = activeIndex;
      do {
        prev = (prev - 1 + filtered.length) % filtered.length;
      } while (filtered[prev]?.disabled && prev !== activeIndex);
      setActiveIndex(prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[activeIndex];
      if (target && !target.disabled) handleSelect(target);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 라벨 영역 - 접근성 연결용 for={inputId} */}
      {label && (
        <label htmlFor={inputId} className='text-md-medium mb-[8px] block text-white'>
          {label}
        </label>
      )}
      {/* 필드 래퍼 - 입력 프레임 + 포커스 링 + 드롭다운 앵커 (relative) 
      - w-full만 주고 반응형 크기는 부모(페이지)에서 처리하는 방식으로
      - 드롭다운은 여기 기준 absolute(left-0 right-0)로 폭을 따라감 */}
      <div
        ref={wrapperRef}
        className={cn(
          'relative flex w-full items-center',
          'bg-black-800 border-black-700 rounded-lg border',
          'focus-within:ring-main focus-within:ring-2',
          'h-[52px] md:h-[60px] xl:h-[70px]',
          'px-[16px]',
        )}
      >
        {/* [칩 상태] - 선택된 값 표시(길면 ...처리) + 제거 버튼  */}
        {value && (
          <div
            className={cn(
              'inline-flex items-center gap-[10px]',
              'rounded-lg',
              'px-[10px] py-[8px]',
              ChipColor[scheme].chip, // scheme에 따라 Chip 색 변경
            )}
          >
            <span className='text-md-regular md:text-base-regular truncate'>{value.name}</span>
            {/* Chip 제거 버튼 */}
            <button
              type='button'
              onClick={handleClear}
              aria-label='선택 값 제거'
              className='bg-black-50 cursor-pointer rounded-[6px] focus:outline-none'
            >
              <X className='aria-hidden="true" h-[17px] w-[17px] rounded-[6px] border border-black text-white md:h-[19px] md:w-[19px]' />
            </button>
          </div>
        )}

        {/* [입력창] - Chip이 없을 때만 보임
        - input은 항상 w-full, 높이만 관리
        - 반응형 폭은 바깥 컨테이너에서 제어 */}

        {!value && (
          <input
            id={inputId}
            ref={inputRef}
            type='text'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => !inputDisabled && setOpen(!!query)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={inputDisabled}
            role='combobox'
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete='list'
            className={cn(
              'h-full w-full rounded-xl bg-transparent text-white outline-none',
              'placeholder:text-gray-600',
              inputClassName,
            )}
          />
        )}

        {/* [드롭다운] - 필드 래퍼(relative) 기준으로 폭을 맞추는 absolute 레이어 z-index는 팀 컨벤션 기준 20 */}
        {open && !value && (
          <div
            className={cn(
              'absolute top-full right-0 left-0 z-20 mt-[5px]',
              'bg-black-800 border-black-700 rounded-lg border backdrop-blur',
              'shadow-xl',
              dropdownClassName,
            )}
          >
            <ul
              id={listboxId}
              role='listbox'
              aria-labelledby={inputId}
              className='max-h-[300px] overflow-auto p-[8px]'
            >
              {/* 결과 없음 */}
              {filtered.length === 0 && (
                <li
                  role='status'
                  aria-live='polite'
                  className='text-md-regular md:text-base-regular rounded-lg px-[16px] py-[12px] text-gray-600 select-none'
                >
                  일치하는 결과가 없습니다
                </li>
              )}
              {/* 결과 리스트 */}
              {filtered.map((opt, idx) => {
                const isActive = idx === activeIndex;
                const base =
                  'flex cursor-pointer items-center justify-between rounded-lg px-[16px] py-[12px] text-md-regular md:text-base-regular';
                const active = 'bg-black-700 text-white';
                const normal = 'text-gray-600 hover:bg-black-700';
                const disabledCls = 'cursor-not-allowed text-zinc-600 hover:bg-transparent';

                return (
                  <li
                    key={opt.id}
                    role='option'
                    aria-selected={isActive}
                    aria-disabled={opt.disabled || undefined}
                    className={cn(base, opt.disabled ? disabledCls : isActive ? active : normal)}
                    onMouseEnter={() => !opt.disabled && setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => !opt.disabled && handleSelect(opt)}
                  >
                    <span className='truncate'>{opt.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

export default CompareSelect;
