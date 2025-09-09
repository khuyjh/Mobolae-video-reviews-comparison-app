// 공용 정렬 드롭다운 컴포넌트

'use client';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useId, useRef, useState, useMemo } from 'react';

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
  labelClassName?: string; // 라벨 텍스트
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
  labelClassName,
}: Props<K>) => {
  const [open, setOpen] = useState(false);

  /** 현재 선택된 값의 인덱스. 없으면 0을 기본값으로 사용 */
  const selectedIndex = useMemo(
    () =>
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    [options, value],
  );

  /** 키보드 탐색 중 "활성(하이라이트)"된 항목 인덱스. `aria-activedescendant`로 연결됨 */
  const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);

  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  /** 내부 전용: 각 li의 고유 id 생성기 */
  const optionId = (i: number) => `${listId}-opt-${i}`;

  // 현재 value와 매칭되는 라벨(없으면 placeholder 노출)
  const selectedOpt = options.find((o) => o.value === value) ?? null;

  // 바깥 클릭 닫기 기능
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

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

  // 패널이 열릴 때 listbox로 포커스 이동 + activeIndex를 선택값으로 동기화
  useEffect(() => {
    if (!open) return;

    // 1) 선택값 기준으로 활성 인덱스 초기화
    setActiveIndex(selectedIndex);

    // 2) 다음 페인트 타이밍에 listbox로 포커스 이동
    const id = requestAnimationFrame(() => {
      const ul = listRef.current;

      // 활성 항목이 보이도록 스크롤
      document.getElementById(optionId(selectedIndex))?.scrollIntoView({ block: 'nearest' });
    });
    return () => cancelAnimationFrame(id);
  }, [open, selectedIndex]);

  // 옵션 집합이 변해도 activeIndex가 안전 범위를 벗어나지 않도록 보정
  useEffect(() => {
    if (!open) return;
    setActiveIndex((i) => {
      if (options.length === 0) return 0;
      return Math.min(Math.max(i, 0), options.length - 1);
    });
  }, [open, options.length]);

  // ===================== 활성 항목 변경 시 가시영역 유지 =====================
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  // ===================== 선택 처리 =====================
  const handleSelect = (val: K) => {
    onChange(val); // 부모에 알림
    setOpen(false); // 패널 닫기
    requestAnimationFrame(() => btnRef.current?.focus()); // 버튼으로 포커스 복귀
  };

  // ===================== 버튼 키 핸들러 =====================
  const onButtonKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
      requestAnimationFrame(() => {
        listRef.current?.focus({ preventScroll: true });
      });
    }
  };

  // ===================== 리스트 키 핸들러 =====================
  // 포커스는 항상 ul에, 활성 항목은 aria-activedescendant로 전달
  const onListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if ((e.key === 'Enter' || e.key === ' ') && options.length) {
      e.preventDefault();
      handleSelect(options[activeIndex].value);
    }
    // Tab은 자연 흐름: 리스트 밖 다음 요소로 나감(별도 처리 X)
  };

  // 드롭다운 내부 css값 상수화로 정리
  const BASE_STYLE = 'bg-black-900 relative inline-block w-full max-w-[200px] min-w-[113px]';
  const TRIGGER_STYLE =
    'flex w-full justify-end gap-5 md:justify-between md:px-4 xl:px-5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)] cursor-pointer';
  const ARROW_STYLE = `h-auto w-[20px] min-w-[20px] text-gray-600 transition-transform md:w-[22px] xl:w-[24px] ${open ? 'rotate-180' : ''}`;
  const PANEL_STYLE =
    'bg-black-800 absolute top-[110%] left-0 z-20 mt-[10px] max-h-80 w-full overflow-auto rounded-md border border-gray-700 p-2 shadow-lg outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0';

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
        onKeyDown={onButtonKeyDown}
        className={clsx(TRIGGER_STYLE, buttonClassName)}
      >
        {/* 정렬 기준 라벨 - cn 함수를 clsx로 대체 */}
        <span
          className={clsx(
            'text-md-regular xl:text-base-regular truncate text-gray-600',
            open ? 'text-white' : 'text-gray-600',
            labelClassName,
          )}
        >
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        {/* 화살표 - lucide 이용 */}
        <ChevronDown aria-hidden='true' className={ARROW_STYLE} />
      </button>
      {/* 옵션 패널 - z-index 20처리 트리거와 패널이 떨어져 있는 부분은 mt로 처리*/}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role='listbox'
          aria-label='정렬 옵션'
          // 포커스 컨테이너: 실제 포커스는 항상 ul에 유지
          tabIndex={-1}
          // 현재 활성 항목의 id를 스크린리더에 알려줌
          aria-activedescendant={optionId(activeIndex)}
          className={clsx(PANEL_STYLE, panelClassName)}
          onKeyDown={onListKeyDown}
        >
          {options.map((opt, i) => {
            const isSelected = value === opt.value;
            const isActive = activeIndex === i;
            return (
              <li
                key={opt.value}
                id={optionId(i)}
                role='option'
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={clsx(
                  'text-md-regular xl:text-base-regular cursor-pointer rounded-md px-3 py-2 outline-none',
                  isActive && 'bg-black-700',
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
