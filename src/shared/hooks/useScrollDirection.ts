'use client';

import { useEffect, useState } from 'react';

/**
 * 스크롤 방향을 감지하는 커스텀 훅
 * - 반환값: 'up' | 'down' | null
 * - 최초에는 null, 이후 스크롤에 따라 방향 갱신
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > prevY) setDirection('down');
      else if (currentY < prevY) setDirection('up');
      prevY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
}
