'use client';

import { useEffect, useState } from 'react';

/**
 * 브라우저 matchMedia 기반 반응형 훅
 *
 * @param query CSS 미디어쿼리 (예: '(min-width: 768px)')
 * @returns boolean - 조건 일치 여부
 */
export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);

    const onChange = () => setMatches(mq.matches);
    onChange(); // 초기 동기화

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
