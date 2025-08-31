// 비교 입력창 리팩토링 버전. 비교 셀렉트 컴포넌트
// 기본은 드롭다운 형식
// 입력창 및 연관 검색어 드롭다운으로 보여줌
// chip으로 변환 기능

'use client';

import { X } from 'lucide-react';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

export type CompareOption = {
  id: string | number;
  name: string;
  disabled?: boolean;
};

type Props = {
  label?: string;
  value: CompareOption | null; // Chip 한번에 1개로 제한
  onChange: (next: CompareOption | null) => void; // Chip 선택/삭제
  options: CompareOption[]; // 전체 후보
  placeholder?: string;
  disabled?: boolean;
  className?: string; // 외곽 컨테이너 스타일
  inputClassName?: string; // 인풋 스타일
  dropdownClassName?: string; // 드롭다운 패널 스타일
  filterFn?: (opt: CompareOption, query: string) => boolean;
};
/** 커스텀 필터 (기본: 공백/대소문자 무시 매칭) */
const defaultFilter: Props['filterFn'] = (opt, q) => {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
  return norm(opt.name).includes(norm(q));
};

const CompareSelect = forwardRef<HTMLInputElement, Props>(function CompareSelect(
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

  const handleSelect = (opt: CompareOption) => {
    if (opt.disabled) return;
    onChange(opt);
    setOpen(false);
    setQuery('');
  };

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
      {label && (
        <label htmlFor={inputId} className='mb-2 block text-sm text-zinc-300'>
          {label}
        </label>
      )}

      <div
        ref={wrapperRef}
        className={cn(
          'relative',
          // 포커스 시 테두리 강조를 위해 focus-within 사용
          'rounded-xl border border-zinc-700 bg-zinc-900',
          'focus-within:ring-2 focus-within:ring-emerald-400/70',
          value ? 'p-3' : 'p-0',
        )}
      >
        {/* Chip (선택된 상태) */}
        {value && (
          <div
            className={cn(
              'flex items-center justify-between gap-2',
              'rounded-lg bg-emerald-600/15',
              'px-4 py-3 text-emerald-300',
            )}
          >
            <span className='truncate'>{value.name}</span>
            <button
              type='button'
              onClick={handleClear}
              aria-label='선택 값 제거'
              className='grid size-7 place-items-center rounded-full bg-zinc-800 hover:bg-zinc-700'
            >
              <X className='size-4' aria-hidden />
            </button>
          </div>
        )}

        {/* Input (선택되지 않았을 때만 표시) */}
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
              'h-[52px] w-full rounded-xl bg-transparent px-4 text-zinc-200 outline-none',
              'placeholder:text-zinc-500',
              inputClassName,
            )}
          />
        )}

        {/* Dropdown */}
        {open && !value && (
          <div
            className={cn(
              'absolute right-0 left-0 z-50 mt-2',
              'rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur',
              'shadow-xl',
              dropdownClassName,
            )}
          >
            <ul
              id={listboxId}
              role='listbox'
              aria-labelledby={inputId}
              className='max-h-[300px] overflow-auto p-2'
            >
              {filtered.length === 0 && (
                <li
                  role='option'
                  aria-disabled='true'
                  className='rounded-lg px-4 py-3 text-sm text-zinc-500 select-none'
                >
                  결과가 없습니다
                </li>
              )}
              {filtered.map((opt, idx) => {
                const isActive = idx === activeIndex;
                const base =
                  'flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm';
                const active = 'bg-zinc-800 text-zinc-100';
                const normal = 'text-zinc-300 hover:bg-zinc-800/60';
                const disabledCls = 'cursor-not-allowed text-zinc-600 hover:bg-transparent';

                return (
                  <li
                    key={opt.id}
                    role='option'
                    aria-selected={isActive}
                    aria-disabled={opt.disabled || undefined}
                    className={cn(base, opt.disabled ? disabledCls : isActive ? active : normal)}
                    onMouseEnter={() => !opt.disabled && setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()} // 포커스 손실 방지
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
