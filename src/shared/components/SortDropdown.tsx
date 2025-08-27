// 공용 정렬 드롭다운 컴포넌트

'use client';

import { ChevronDown } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/shared/lib/cn';

/** 드롭다운에서 사용할 옵션 타입 (라벨/값 최소 형태) */
export interface OrderOption<K extends string = string> {
  id: string; // 고유 식별자 (queryKey 등으로도 사용)
  label: string; // 화면에 보이는 텍스트
  value: K; // API에 넘길 값(문자열)
}

type Props<K extends string = string> = {
  /** 표시할 옵션 목록 */
  options: OrderOption<K>[];

  /** 언컨트롤드 기본 선택 id (없으면 options[0] 사용), 컨트롤드면 무시됨 */
  defaultId?: string;

  /** 컨트롤드 모드: 현재 선택값 (없으면 언컨트롤드 동작) */
  value?: OrderOption<K> | null;

  /** 선택 변경 콜백 (컨트롤드/언컨트롤드 모두 호출) */
  onChange?: (opt: OrderOption<K>) => void;

  /** 미선택 시 표시할 문구 */
  placeholder?: string;

  /** 스타일 커스터마이징 (전부 className만) */
  className?: string; // 래퍼
  buttonClassName?: string; // 트리거 버튼
  panelClassName?: string; // 패널(목록)
  itemClassName?: string; // 아이템 공통

  /** 패널 z-index (팀 규칙 z-20 기본) */
  panelZIndex?: number;
};

export default function SortDropdown<K extends string = string>({
  options,
  defaultId,
  value,
  onChange,
  placeholder = '정렬 옵션 선택',
  className,
  buttonClassName,
  panelClassName,
  itemClassName,
  panelZIndex = 20,
}: Props<K>) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // 언컨트롤드 내부 상태
  const [inner, setInner] = useState<OrderOption<K> | null>(() => {
    if (value !== undefined) return value; // 컨트롤드 시작 시 그대로
    if (defaultId) return options.find((o) => o.id === defaultId) ?? options[0] ?? null;
    return options[0] ?? null;
  });

  // 현재 선택(컨트롤드 우선)
  const selected = value !== undefined ? value : inner;

  // 바깥 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleSelect = (opt: OrderOption<K>) => {
    if (value === undefined) setInner(opt); // 언컨트롤드일 때만 내부 상태 변경
    onChange?.(opt);
    setOpen(false);
    requestAnimationFrame(() => btnRef.current?.focus());
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        ['bg-black-900 relative inline-block w-full max-w-[200px] min-w-[113px]', className]
          .filter(Boolean)
          .join(' '),
      )}
    >
      {/* 트리거 버튼 */}
      <button
        ref={btnRef}
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          [
            'flex w-full justify-end gap-5 focus:outline-none md:justify-between md:px-4 xl:px-5',
            buttonClassName,
          ].join(' '),
        )}
      >
        {/* 정렬 기준 라벨 - TODO 모바일 기본 텍스트 크기 적용 안되는 부분 해결할 것 */}
        <span
          className={cn('text-md-regular xl:text-base-regular text-gray-600', {
            'text-white': open,
          })}
        >
          {selected ? selected.label : placeholder}
        </span>
        {/* 화살표 - lucide 이용 */}
        <ChevronDown
          className={`aria-hidden="true" h-auto w-[20px] min-w-[20px] text-gray-600 transition-transform md:w-[22px] xl:w-[24px] ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {/* 옵션 패널 - z-index 20처리 트리거와 패널이 떨어져 있는 부분은 mt로 처리*/}
      {open && (
        <ul
          id={listId}
          role='listbox'
          aria-label='정렬 옵션'
          className={cn(
            [
              'bg-black-800 absolute top-[110%] left-0 z-20 mt-[10px] max-h-80 w-full overflow-auto rounded-md border border-gray-700 p-2 shadow-lg',
              panelClassName,
            ].join(' '),
          )}
          style={{ zIndex: panelZIndex }}
        >
          {options.map((opt) => {
            const isSelected = selected?.id === opt.id;
            return (
              <li
                key={opt.id}
                role='option'
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()} // blur로 인한 닫힘 방지
                onClick={() => handleSelect(opt)}
                className={cn(
                  [
                    'text-md-regular xl:text-base-regular cursor-pointer rounded-md px-3 py-2',
                    isSelected
                      ? 'bg-black-700 text-white'
                      : 'hover:bg-black-700 text-gray-400 hover:text-white',
                    itemClassName,
                  ].join(' '),
                )}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
