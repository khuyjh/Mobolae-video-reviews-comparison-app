'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 스크롤 방향을 감지하는 커스텀 훅
 * - 반환값: 'up' | 'down' | null
 * - 최초에는 null, 이후 스크롤에 따라 방향 갱신
 * - requestAnimationFrame(rAF) 스로틀 적용 → 불필요한 setState 연속 호출 방지
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  // 이전 scrollY 저장용 (렌더와 무관하므로 useRef 사용)
  const prevYRef = useRef(0);
  // 이미 rAF 대기 중인지 여부 플래그
  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    prevYRef.current = window.scrollY; // 초기 스크롤 위치 저장

    const onScroll = () => {
      // 이미 rAF 예약이 잡혀 있으면 무시
      if (tickingRef.current) return;
      tickingRef.current = true;

      // 다음 animation frame에서 실행 (스로틀 역할)
      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY > prevYRef.current) {
          setDirection('down'); // 아래로 스크롤
        } else if (currentY < prevYRef.current) {
          setDirection('up'); // 위로 스크롤
        }
        // 이전 위치 갱신
        prevYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return direction;
}
