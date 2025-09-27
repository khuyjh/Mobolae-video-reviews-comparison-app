import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { listProduct } from '../../../../openapi/requests';

/** 입력값 디바운스 */
const useDebouncedValue = (value: string, delayMs = 250) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);
  return debouncedValue;
};

/** 서버 응답 최소 타입(이름만 사용) */
type ProductsApiItem = { id: number; name: string };
type ListProductResponse = { nextCursor: number | null; list: ProductsApiItem[] };

type WithData<T> = { data: T };

function hasData<T>(value: unknown): value is WithData<T> {
  return typeof value === 'object' && value !== null && 'data' in value;
}

function isProductsApiItem(value: unknown): value is ProductsApiItem {
  if (typeof value !== 'object' || value === null) return false;
  const rec = value as Record<string, unknown>;
  return typeof rec.id === 'number' && typeof rec.name === 'string';
}

function isListProductResponse(value: unknown): value is ListProductResponse {
  if (typeof value !== 'object' || value === null) return false;
  const rec = value as Record<string, unknown>;
  const list = rec.list;
  const nextCursor = rec.nextCursor;
  const listOk = Array.isArray(list) && list.every((item) => isProductsApiItem(item));
  const cursorOk = nextCursor === null || typeof nextCursor === 'number';
  return listOk && cursorOk;
}

/**
 * 상품명 자동완성/검색 훅
 * - OpenAPI 클라이언트가 res 또는 {data:...} 둘 다 가능 → 타입 가드로 안전 파싱
 * - placeholderData로 이전 데이터 유지해 깜빡임 최소화
 */
export function useProductNameSearch(teamId: string | undefined, keyword: string, limit = 10) {
  const debouncedKeyword = useDebouncedValue(keyword, 250);
  const kw = debouncedKeyword.trim();
  const enabled = Boolean(teamId && kw.length >= 1);

  return useQuery<string[]>({
    queryKey: ['product-names', teamId ?? 'NA', kw],
    enabled,
    queryFn: async ({ signal }) => {
      // 반환 타입을 unknown으로 두고 타입 좁히기
      const raw: unknown = await listProduct({
        path: { teamId: teamId! },
        // 서버에는 limit 전달하지 않음 → 캐시 중복 방지
        query: { keyword: kw || undefined },
        signal,
      });

      const unwrapped: unknown = hasData<ListProductResponse>(raw)
        ? (raw as WithData<ListProductResponse>).data
        : raw;

      if (!isListProductResponse(unwrapped)) {
        // 예상치 못한 응답 형태면 빈 배열 반환(UX 안전)
        return [];
      }

      const names = unwrapped.list.map((item) => item.name).filter(Boolean);

      // 중복 제거 + 상한 적용 (클라이언트에서만 limit 처리)
      return Array.from(new Set(names)).slice(0, limit);
    },
    placeholderData: (previous) => previous,
    staleTime: 30_000,
    gcTime: 300_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
