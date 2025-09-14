// src/features/home/components/HomeQueryGuard.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useEffect, useMemo, type PropsWithChildren } from 'react';

import { buildCanonicalQuery, normalizeOnClient } from '../services/queryNorm';

/**
 * 메인 페이지 전용 쿼리 가드
 * - 현재 경로가 "/"일 때만 동작
 * - 주소창 쿼리가 "표준 쿼리"와 다르면 router.replace로 조용히 교체
 */
export const HomeQueryGuard = ({ children }: PropsWithChildren) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isHomePath = pathname === '/' || pathname === '';

  // 현재 쿼리를 안전값으로 정규화
  const safeQuery = useMemo(
    () => (isHomePath ? normalizeOnClient(searchParams) : null),
    [isHomePath, searchParams],
  );

  useEffect(() => {
    if (!isHomePath || !safeQuery) return;

    const canonical = buildCanonicalQuery(safeQuery);
    const current = searchParams.toString();

    if (canonical !== current) {
      // replace로 교체하여 히스토리 오염 방지
      const href = canonical ? `${pathname}?${canonical}` : pathname || '/';
      router.replace(href);
    }
  }, [isHomePath, safeQuery, pathname, searchParams, router]);

  return <>{children}</>;
};
