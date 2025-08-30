// 공용 정렬 드롭다운 컴포넌트

'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';

/** 드롭다운에서 사용할 옵션 타입 (라벨/값) 추후 다른 곳에서 타입 가져오는 식으로 변경 가능 */
export interface OrderOption<K extends string = string> {
  label: string; // 화면에 보이는 옵션 이름
  value: K; // 유일 키, API 전달 역할
}

type Props<K extends string = string> = {
  options: OrderOption<K>[];
  value: K;
  onChange: (value: K) => void; // 부모엔 value만 전달
  placeholder?: string;

  /** 스타일 커스터마이징 (전부 className만) */
  className?: string; // 래퍼
  buttonClassName?: string; // 트리거 버튼
  panelClassName?: string; // 패널(목록)
  itemClassName?: string; // 아이템 공통
};

//상품과 상품 리뷰
const SortDropdown = <K extends string = string>({
  options,
  value,
  onChange,
  placeholder = '정렬 옵션 선택',
  className,
  buttonClassName,
  panelClassName,
  itemClassName,
}: Props<K>) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // 현재 value와 매칭되는 라벨(없으면 placeholder 노출)
  const selectedOpt = options.find((o) => o.value === value) ?? null;

  // 바깥 클릭 닫기 기능
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ESC 닫기 기능
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

  const handleSelect = (val: K) => {
    onChange(val); // 부모에게 값 알림
    setOpen(false);
    requestAnimationFrame(() => btnRef.current?.focus());
  };
  // 드롭다운 내부 css값 상수화로 정리
  const BASE_STYLE = 'bg-black-900 relative inline-block w-full max-w-[200px] min-w-[113px]';
  const TRIGGER_STYLE =
    'flex w-full justify-end gap-5 focus:outline-none md:justify-between md:px-4 xl:px-5';
  const ARROW_STYLE = `aria-hidden="true" h-auto w-[20px] min-w-[20px] text-gray-600 transition-transform md:w-[22px] xl:w-[24px] ${open ? 'rotate-180' : ''}`;
  const PANEL_STYLE =
    'bg-black-800 absolute top-[110%] left-0 z-20 mt-[10px] max-h-80 w-full overflow-auto rounded-md border border-gray-700 p-2 shadow-lg';

  return (
    <div ref={wrapRef} className={clsx(BASE_STYLE, className)}>
      {/* 트리거 버튼 */}
      <button
        ref={btnRef}
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((p) => !p)}
        className={clsx(TRIGGER_STYLE, buttonClassName)}
      >
        {/* 정렬 기준 라벨 - cn 함수를 clsx로 대체 */}
        <span
          className={clsx(
            'text-md-regular xl:text-base-regular truncate text-gray-600',
            open ? 'text-white' : 'text-gray-600',
          )}
        >
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        {/* 화살표 - lucide 이용 */}
        <ChevronDown className={ARROW_STYLE} />
      </button>
      {/* 옵션 패널 - z-index 20처리 트리거와 패널이 떨어져 있는 부분은 mt로 처리*/}
      {open && (
        <ul
          id={listId}
          role='listbox'
          aria-label='정렬 옵션'
          className={clsx(PANEL_STYLE, panelClassName)}
        >
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <li
                key={opt.value}
                role='option'
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()} // blur로 인한 닫힘 방지
                onClick={() => handleSelect(opt.value)}
                className={clsx(
                  'text-md-regular xl:text-base-regular cursor-pointer rounded-md px-3 py-2',
                  isSelected
                    ? 'bg-black-700 text-white'
                    : 'hover:bg-black-700 text-gray-400 hover:text-white',
                  itemClassName,
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
};

export default SortDropdown;
