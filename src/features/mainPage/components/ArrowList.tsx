'use client';

import React, { ReactNode, KeyboardEvent } from 'react';

/**
 * ArrowList 컴포넌트
 *
 * - 자식 버튼들(리스트 메뉴뉴)을 ↑/↓ 키로 이동 가능하게 만들어 줌
 * - 버튼(리스트 메뉴)에는 반드시 className="nav-item"을 붙여야 탐색 대상이 됨
 */
interface ArrowListProps {
  children: ReactNode;
}

const ArrowList = ({ children }: ArrowListProps) => {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key, currentTarget } = e;

    // ↑/↓ 키만 처리
    if (key !== 'ArrowDown' && key !== 'ArrowUp') return;

    // 현재 ArrowList 내부의 요소를 모두 가져옴
    const items = currentTarget.querySelectorAll<HTMLElement>('.nav-item');
    if (!items.length) return;

    // NodeList → 배열
    const list = Array.from(items);

    // 현재 focus된 버튼의 인덱스 찾기
    let idx = list.indexOf(document.activeElement as HTMLButtonElement);
    if (idx < 0) idx = 0; // focus 없으면 첫 번째부터 시작

    // ↑/↓ 방향에 따라 다음 인덱스 계산 (루프 이동)
    e.preventDefault();
    const next =
      key === 'ArrowDown' ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length;

    // 해당 버튼으로 포커스 이동
    list[next].focus();
  };

  return (
    <div
      role='listbox' // 접근성 역할 지정
      tabIndex={0} // div 자체가 포커스를 받을 수 있게 함
      onKeyDown={onKeyDown}
      className='outline-none'
    >
      {children}
    </div>
  );
};

export default ArrowList;
