'use client';

import React, {
  ReactNode,
  KeyboardEvent,
  useRef,
  useEffect,
  Children,
  isValidElement,
  cloneElement,
  ReactElement,
} from 'react';

interface ArrowListProps {
  children: ReactNode;
}

type ElemWithRef = ReactElement<
  React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
>;

const ArrowList = ({ children }: ArrowListProps) => {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const focusedIndexRef = useRef<number>(-1);

  const childrenArray = Children.toArray(children);

  useEffect(() => {
    // children 개수에 맞춰 refs 길이 맞추기
    itemRefs.current = itemRefs.current.slice(0, childrenArray.length);
  }, [childrenArray.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const { key } = e;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') return;

    e.preventDefault();

    const items = itemRefs.current.filter((el): el is HTMLElement => el !== null);
    if (items.length === 0) return;

    // 현재 포커스된 요소 인덱스
    const active = document.activeElement as Element | null;
    let currentIndex = focusedIndexRef.current;
    const activeIndex = items.findIndex(
      (item) => item === active || (active instanceof Node && item.contains(active)),
    );
    if (activeIndex !== -1) currentIndex = activeIndex;

    // 다음 인덱스(루프)
    const nextIndex =
      key === 'ArrowDown'
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;

    const nextItem = items[nextIndex];
    if (nextItem) {
      // 내부에 포커스 가능한 놈이 있으면 그걸로, 아니면 자신에게 포커스
      const focusTarget = nextItem.matches('a,button,[tabindex]:not([tabindex="-1"])')
        ? nextItem
        : nextItem.querySelector<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])');
      (focusTarget ?? nextItem).focus();
      focusedIndexRef.current = nextIndex;
    }
  };

  // 자식에 ref/data-속성 주입 (타입 안전)
  const enhancedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;

    return cloneElement(
      child as ElemWithRef,
      {
        ref: (el: HTMLElement | null) => {
          itemRefs.current[index] = el;
        },
        'data-nav-index': index,
      } as React.Attributes &
        React.HTMLAttributes<HTMLElement> & {
          ref?: (el: HTMLElement | null) => void;
        },
    );
  });

  return (
    <ul tabIndex={-1} onKeyDown={handleKeyDown} className='outline-none'>
      {enhancedChildren}
    </ul>
  );
};

export default ArrowList;
