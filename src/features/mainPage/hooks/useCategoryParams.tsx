'use client';

import { useSearchParams } from 'next/navigation';

import { useMemo } from 'react';

/**
 * useCategoryParams 훅
 *
 * - URLSearchParams에서 category / keyword / order 값 파생
 * - 하이퍼링크 계산은 buildCategoryHref 유틸을 사용
 */
export function useCategoryParams() {
  const params = useSearchParams();

  /** 현재 선택된 카테고리 ID (없으면 null) */
  const selectedId = (() => {
    const raw = params.get('category');
    const id = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(id) ? id : null;
  })();

  /** 현재 검색 키워드 */
  const keyword = useMemo(() => params.get('keyword') ?? '', [params]);

  /** 현재 정렬 기준 */
  const order = useMemo(() => params.get('order') ?? 'recent', [params]);

  /** 링크 계산용 params (불변성 유지) */
  const searchParamsForLinks = useMemo(() => new URLSearchParams(params.toString()), [params]);

  return { selectedId, keyword, order, searchParamsForLinks };
}
