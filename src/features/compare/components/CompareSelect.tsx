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

import { useListProduct } from '../../../../openapi/queries';

import type { ListProductDefaultResponse } from '../../../../openapi/queries/common';
import type { CompareCandidate } from '@/features/compare/types/compareTypes';

export type CompareSelectProps = {
  label?: string;
  value: CompareCandidate | null; // Chip 선택 값 한번에 1개로 제한
  onChange: (v: CompareCandidate | null) => void; // Chip 선택/해제 콜백
  options?: CompareCandidate[]; // 후보 목록
  placeholder?: string;
  disabled?: boolean;
  // 칩 색상용 prop (기본은 left 녹색)
  scheme?: 'left' | 'right';
  //선택을 시도하고 성공/실패를 알려주는 콜백
  onTryChange?: (v: CompareCandidate | null) => { ok: boolean; reason?: 'duplicate' };
  // 실패 사유를 외부에서 처리(토스트 등)하고 싶을 때 사용
  // ex) onError={(reason) => toast.error('동일 콘텐츠는 선택할 수 없습니다.')}
  onError?: (reason: 'duplicate' | string) => void;
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

// 리스트 아이템 최소 타입 + 타입가드 (any 금지)
type ContentList = { id: number; name: string };
const toContentList = (v: unknown): v is ContentList => {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as { id?: unknown; name?: unknown };
  return typeof o.id === 'number' && typeof o.name === 'string';
};

const toCandidates = (resp: ListProductDefaultResponse | undefined): CompareCandidate[] => {
  if (!resp) return [];
  const listUnknown: unknown = Array.isArray(resp) ? resp : (resp as { list?: unknown }).list;
  if (!Array.isArray(listUnknown)) return [];
  const listis = listUnknown.filter(toContentList);
  return listis.map((p) => ({ id: p.id, name: p.name }));
};

const SUGGESTION_COUNT = 5; // 입력이 비었을 때 보여줄 개수
const DEBOUNCE_MS = 300;

const CompareSelect = forwardRef<HTMLInputElement, CompareSelectProps>(function CompareSelect(
  {
    label,
    value,
    onChange,
    options = [], // ⬅️ 부모가 초기 추천을 내려줄 수도 있음(없어도 OK),\
    placeholder = '콘텐츠명을 입력해 주세요',
    disabled = false,
    className,
    inputClassName,
    dropdownClassName,
    filterFn = defaultFilter,
    scheme = 'left',
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
  const [activeIndex, setActiveIndex] = useState(0);

  // 디바운스된 검색어
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // 서버 검색 호출 (Swagger: keyword 파라미터!)
  //    - debounced 길이가 1~2+ 이상일 때 enabled (원하시는 기준으로)
  const { data: serverData, isLoading: isServerLoading } = useListProduct(
    {
      ...PATH_OPTION,
      query: {
        keyword: debounced || undefined, // ""이면 보내지 않음 → 초기 제안 모드와 구분
      },
    },
    [debounced],
    {
      enabled: debounced.length >= 1, // 1글자부터 검색(필요시 2로)
      staleTime: 30_000,
    },
  );

  // 서버 결과 → 후보
  const serverOptions = useMemo(() => toCandidates(serverData), [serverData]);

  //  최종 후보 소스 결정
  //   - 입력 있으면: 서버 결과
  //   - 입력 없으면: 초기 제안(부모 options 또는 서버 첫 페이지를 부모에서 내려주기)
  const baseOptions: CompareCandidate[] = useMemo(() => {
    if (debounced.length >= 1) return serverOptions;
    // 입력이 없을 땐 상위 N개 보여주기(UX 개선)
    return options.slice(0, SUGGESTION_COUNT);
  }, [debounced.length, serverOptions, options]);

  // 드롭다운에 보일 리스트 (입력이 없으면 baseOptions 그대로)
  const filtered = useMemo(() => {
    if (!baseOptions.length) return [];
    return debounced.length >= 1 ? baseOptions : baseOptions;
  }, [baseOptions, debounced.length]);
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

  // 드롭다운 열릴 때 첫 항목 활성화
  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, query]);

  /** 후보를 확정 선택 */
  const handleSelect = (opt: CompareCandidate) => {
    if (opt.disabled) return;

    // 1) onTryChange가 있으면 먼저 시도 → 실패(중복 등) 시 에러만 표시 후 종료
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

    // 2) fallback: 기존 onChange 사용(스토어 없이 로컬 사용 등)
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
