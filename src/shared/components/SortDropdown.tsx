// 공용 정렬 드롭다운 컴포넌트

'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';

/** 드롭다운에서 사용할 옵션 타입 (라벨/값) */
export interface OrderOption<K extends string = string> {
  id: string; // 고유 식별 id (queryKey 등으로도 사용)
  label: string; // 화면에 보이는 옵션 이름
  value: K; // API에 넘길 값(문자열)
}
// 내부/외부 제어 방식을 구분하기 위해 컨트롤드/언컨트롤드 모드 패턴을 사용했습니다.
// props.value값이 정의되어 있어서 undefined가 아니면 컨트롤드 모드로 간주합니다.
// 그렇지 않으면 언컨트롤드 모드로 간주하고 내부 state값을 통해 관리합니다.
type Props<K extends string = string> = {
  /** 표시할 옵션 목록 */
  options: OrderOption<K>[];

  /** 언컨트롤드 기본 선택 id (없으면 options[0] 사용), 컨트롤드면 무시 */
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
};

//상품과 상품 리뷰
const SortDropdown = <K extends string = string>({
  options,
  defaultId,
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

  // 언컨트롤드 내부 상태
  const [inner, setInner] = useState<OrderOption<K> | null>(() => {
    if (value !== undefined) return value; // 컨트롤드 모드라면, 부모가 부모가 준 value로 초기화
    if (defaultId) return options.find((o) => o.id === defaultId) ?? options[0] ?? null; // defaultId가 있는 경우
    return options[0] ?? null; // 둘 다 없으면 첫 번째 옵션
  });

  // 현재 선택(컨트롤드 우선)
  const selected = value !== undefined ? value : inner;

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

  const handleSelect = (opt: OrderOption<K>) => {
    if (value === undefined) setInner(opt); // 언컨트롤드일 때만 내부 상태 변경
    onChange?.(opt);
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
          {selected ? selected.label : placeholder}
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
            const isSelected = selected?.id === opt.id;
            return (
              <li
                key={opt.id}
                role='option'
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()} // blur로 인한 닫힘 방지
                onClick={() => handleSelect(opt)}
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
