// 비교 셀렉트 컴포넌트
// 기본은 드롭다운 형식
// 입력창 및 연관 검색어 드롭다운으로 보여줌
// 입력값 chip으로 토큰화
// 서버 검색
'use client';

import { X } from 'lucide-react';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';

import { PATH_OPTION } from '@/shared/constants/constants';
import { cn } from '@/shared/lib/cn';
import { createQueryComparator } from '@/shared/utils/querySort';

import { useListProduct } from '../../../../openapi/queries';
import { toCandidates } from '../utils/contentMapper';

import type { CompareCandidate } from '@/features/compare/types/compareTypes';
type TrySetReason = 'duplicate' | 'category-mismatch' | 'missing-category' | 'unknown';

export type CompareSelectProps = {
  label?: string;
  value: CompareCandidate | null; // Chip 선택 값 한번에 1개로 제한
  onChange: (v: CompareCandidate | null) => void; // Chip 선택/해제 콜백
  placeholder?: string;
  disabled?: boolean;
  // 칩 색상용 prop (기본은 a 녹색)
  scheme?: 'a' | 'b';
  //선택을 시도하고 성공/실패를 알려주는 콜백
  onTryChange?: (v: CompareCandidate | null) => {
    ok: boolean;
    reason?: Exclude<TrySetReason, 'unknown'>;
  };
  onError?: (reason: TrySetReason) => void; // 3가지 에러 이유 + 'unknown'

  //커스텀 스타일
  className?: string; // 외곽 컨테이너 스타일
  inputClassName?: string; // 인풋 스타일
  dropdownClassName?: string; // 드롭다운 패널 스타일
};

// 사용자가 입력한 값(query)을 DEBOUNCE_MS(ms기준) 기다린 후 debounced에 반영
const DEBOUNCE_MS = 150;

// 문자열 비교 유틸: 공백/대소문자/유니코드 정규화 등을 정리해서 완전 일치 판정 신뢰도 높임
const normalizeForExactMatch = (input: string, locale: string = 'ko-KR'): string =>
  input.normalize('NFKC').trim().toLocaleLowerCase(locale);

// 완전 일치 항목의 인덱스를 찾아주는 헬퍼
const findExactMatchIndex = (options: CompareCandidate[], query: string): number => {
  const normalizedQuery = normalizeForExactMatch(query);
  return options.findIndex((option) => normalizeForExactMatch(option.name) === normalizedQuery);
};

// IME(한글 등) 조합 중 여부를 추적하는 ref
const isComposingRefGlobal = { current: false } as { current: boolean };

// KeyboardEvent.isComposing 존재 여부 타입가드 (any 타입 사용 금지)
const hasIsComposing = (evt: unknown): evt is { isComposing: boolean } => {
  return (
    typeof evt === 'object' &&
    evt !== null &&
    'isComposing' in evt &&
    typeof (evt as { isComposing: unknown }).isComposing === 'boolean'
  );
};

const CompareSelect = forwardRef<HTMLInputElement, CompareSelectProps>(function CompareSelect(
  {
    label,
    value,
    onChange,
    placeholder = '콘텐츠명을 입력해 주세요',
    disabled = false,
    className,
    inputClassName,
    dropdownClassName,
    scheme = 'a',
    onTryChange,
    onError, // 실패 알림(토스트 등)을 외부에서 처리할 수 있게 제공
  },
  _ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const inputId = useId();

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // 디바운스된 검색어
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  /* 탄스택 쿼리 선언 부분 */

  // 서버 검색 호출 (기본설정은 입력 1글자 이상일 때)
  const { data: serverData } = useListProduct(
    {
      ...PATH_OPTION,
      query: {
        keyword: debounced || undefined,
      },
    },
    [debounced],
    {
      enabled: debounced.length >= 1 && !value, // 1글자부터 검색(서버 요청이 너무 자주 일어닐 시 2글자로 수정), 칩이 있으면 검색 막기
      staleTime: 30_000, //30초, 같은 검색어를 다시 입력하면 30초 내에는 네트워크 요청 없이 캐시 사용
    },
  );

  // 서버 결과 → 후보
  const serverOptions = useMemo(() => toCandidates(serverData), [serverData]);

  // "완전 일치 > 접두 > 포함 > 불일치", disabled는 항상 하단
  const filtered: CompareCandidate[] = useMemo(() => {
    if (debounced.length < 1) return [];

    // 1) 정렬 비교기 생성 — 여기서 ‘어떤 텍스트로 비교할지’와 ‘disabled 판단’을 명시
    const comparator = createQueryComparator<CompareCandidate>(debounced, {
      getText: (item) => item.name, // 비교 기준 텍스트
      isDisabled: (item) => Boolean(item.disabled), // 선택 불가 항목은 아래로
      // normalizer: normalizeForCompare,     // ← 정규화 로직도 필요할 시 추가
    });

    return [...serverOptions].sort(comparator);
  }, [debounced, serverOptions]);

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

  // 칩 색상용 prop (기본은 a 녹색 글로벌 css chip 색상 사용)
  const ChipColor = {
    a: {
      chip: ' bg-green-50 text-green-500',
      ring: 'focus-within:ring-main', // 필요 시 입력창 포커스 컬러 변경용
    },
    b: {
      chip: ' bg-pink-50 text-pink-500',
      ring: 'focus-within:ring-main',
    },
  } as const;

  // 드롭다운이 열리거나(query가 안정화되거나) 목록이 바뀔 때 완전 일치가 있으면 그 항목을 하이라이트
  useEffect(() => {
    if (!open) return;
    if (filtered.length === 0) {
      setActiveIndex(-1);
      return;
    }
    const exactIdx = findExactMatchIndex(filtered, query);
    setActiveIndex(exactIdx !== -1 ? exactIdx : 0);
  }, [open, debounced, filtered, query]);

  // 리스트 길이가 바뀌었을 때 activeIndex 보정
  useEffect(() => {
    if (!open) return;
    if (filtered.length === 0) {
      setActiveIndex(-1);
      return;
    }
    if (activeIndex >= filtered.length) {
      setActiveIndex(filtered.length - 1);
    }
  }, [filtered.length, activeIndex, open]);

  /** 후보를 확정 선택 */
  const handleSelect = (opt: CompareCandidate) => {
    if (opt.disabled) return;

    // onTryChange가 있으면 먼저 시도 → 실패(중복 등) 시 에러만 표시 후 종료
    if (onTryChange) {
      const res = onTryChange(opt);
      if (!res.ok) {
        onError?.(res.reason ?? 'unknown');
        return; //  선택 무효
      }
      // 성공 시 에러 해제, 닫기/초기화만
      setOpen(false);
      setQuery('');
      return; //  onChange는 호출하지 않음 (이중 업데이트 방지)
    }

    // fallback: 기존 onChange 사용(스토어 없이 로컬 사용 등)
    onChange(opt);
    setOpen(false);
    setQuery('');
  };

  /** 현재 슬롯의 선택을 제거 */
  const handleClear = () => {
    if (onTryChange) {
      const res = onTryChange(null);
      if (!res.ok) {
        onError?.(res.reason ?? 'unknown');
        return;
      }
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }

    onChange(null);
    setQuery('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // 타입가드 + composition 이벤트(ref)로 IME 조합 안전 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME 조합 중이면 Enter는 조합 확정이므로 선택 로직을 실행시키지 않도록 수정
    const composing =
      isComposingRefGlobal.current || (hasIsComposing(e.nativeEvent) && e.nativeEvent.isComposing);

    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }

    // 드롭다운이 닫혀 있는 상태에서 Enter:
    // 1) 완전 일치가 있으면 그걸 선택, 2) 없으면 첫 항목(옵션)
    if (!open) {
      if (e.key === 'Enter' && !composing) {
        const exactIdx = findExactMatchIndex(filtered, query);
        if (exactIdx !== -1 && !filtered[exactIdx]?.disabled) {
          e.preventDefault();
          handleSelect(filtered[exactIdx]);
          return;
        }
        if (filtered[0] && !filtered[0].disabled) {
          e.preventDefault();
          handleSelect(filtered[0]);
        }
      }
      return;
    }

    // 드롭다운이 열려 있는 상태
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!filtered.length) return;
      let next = activeIndex < 0 ? 0 : activeIndex;
      do {
        next = (next + 1) % filtered.length;
      } while (filtered[next]?.disabled && next !== activeIndex);
      setActiveIndex(next);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!filtered.length) return;
      let prev = activeIndex < 0 ? 0 : activeIndex;
      do {
        prev = (prev - 1 + filtered.length) % filtered.length;
      } while (filtered[prev]?.disabled && prev !== activeIndex);
      setActiveIndex(prev);
      return;
    }

    if (e.key === 'Enter' && !composing) {
      e.preventDefault();

      // ★ 변경: 우선순위 — 1) 완전 일치 2) 활성 항목 3) 첫 항목(옵션)
      const exactIdx = findExactMatchIndex(filtered, query);
      if (exactIdx !== -1 && !filtered[exactIdx]?.disabled) {
        handleSelect(filtered[exactIdx]);
        return;
      }
      const target =
        activeIndex !== -1 && filtered[activeIndex] ? filtered[activeIndex] : filtered[0];
      if (target && !target.disabled) {
        handleSelect(target);
      }
      return;
    }

    if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
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
              <X
                aria-hidden='true'
                className='h-[17px] w-[17px] rounded-[6px] border border-black text-white md:h-[19px] md:w-[19px]'
              />
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
            onFocus={() => !inputDisabled && setOpen(true)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => {
              isComposingRefGlobal.current = true;
            }}
            onCompositionEnd={() => {
              isComposingRefGlobal.current = false;
            }}
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
                <li className='text-md-regular md:text-base-regular rounded-lg px-[16px] py-[12px] text-gray-600 select-none'>
                  {debounced.length >= 1 ? '일치하는 결과가 없습니다' : '입력 후 검색해 주세요'}
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
