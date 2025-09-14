// src/features/home/utils/queryNorm.home.ts
import { redirect } from 'next/navigation';

import type { ReadonlyURLSearchParams } from 'next/navigation';

/** 허용 범위 및 값 정의 */
const CATEGORY_MIN = 1;
const CATEGORY_MAX = 7;

/** order 허용 값(리터럴)과 타입 */
const ORDER_VALUES = ['recent', 'rating', 'reviewCount'] as const;
type OrderValue = (typeof ORDER_VALUES)[number];

/** 메인 페이지 쿼리의 안전 형태 타입 */
export type HomeSafeQuery = {
  category: number | null;
  keyword: string | null;
  order: OrderValue;
};

/** 배열 또는 단일 값 형태의 입력에서 "첫 값"만 일관되게 추출 */
const getFirstValue = (value: string | string[] | null | undefined): string | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

/** category 정규화: 1~7 정수만 허용, 아니면 null */
const normalizeCategory = (rawCategory: string | string[] | null | undefined): number | null => {
  const rawValue = getFirstValue(rawCategory);
  if (rawValue == null || rawValue === '') return null;

  const numberValue = Number(rawValue);
  if (!Number.isInteger(numberValue)) return null;
  if (numberValue < CATEGORY_MIN || numberValue > CATEGORY_MAX) return null;

  return numberValue;
};

/** keyword 정규화: 공백 제거 후 비었으면 null, 너무 길면 자름(기본 100자) */
const normalizeKeyword = (
  rawKeyword: string | string[] | null | undefined,
  maxLength = 100,
): string | null => {
  const rawValue = getFirstValue(rawKeyword);
  if (rawValue == null) return null;

  const trimmed = rawValue.trim();
  if (trimmed.length === 0) return null;

  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

/** order 타입 가드: 문자열이 허용된 OrderValue인지 판별 */
const isOrderValue = (value: string | null): value is OrderValue =>
  value === 'recent' || value === 'rating' || value === 'reviewCount';

/** order 정규화: 허용 목록 외 값은 'recent' */
const normalizeOrder = (rawOrder: string | string[] | null | undefined): OrderValue => {
  const rawValue = getFirstValue(rawOrder);
  if (rawValue == null || rawValue === '') return 'recent';
  return isOrderValue(rawValue) ? rawValue : 'recent';
};

/** 표준 URL 쿼리 문자열 생성: order가 'recent'면 생략 */
export const buildCanonicalQuery = (params: HomeSafeQuery): string => {
  const search = new URLSearchParams();
  if (params.category != null) search.set('category', String(params.category));
  if (params.keyword != null) search.set('keyword', params.keyword);
  if (params.order !== 'recent') search.set('order', params.order);
  return search.toString();
};

/**
 * 서버 전용: 들어온 searchParams(Record 형태)를 정규화하고,
 * "표준 쿼리"와 다르면 즉시 redirect; 동일하면 안전값 반환
 */
export const normalizeOrRedirectOnServer = (
  searchParams: Record<string, string | string[] | undefined>,
  currentPath: string,
): HomeSafeQuery => {
  const safe: HomeSafeQuery = {
    category: normalizeCategory(searchParams.category),
    keyword: normalizeKeyword(searchParams.keyword),
    order: normalizeOrder(searchParams.order),
  };

  const canonical = buildCanonicalQuery(safe);

  // 요청으로 들어온 쿼리를 문자열로 재구성(첫 값만 반영)
  const incoming = (() => {
    const s = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      const first = getFirstValue(value);
      if (first != null) s.set(key, first);
    }
    return s.toString();
  })();

  if (canonical !== incoming) {
    const href = canonical ? `${currentPath}?${canonical}` : currentPath;
    redirect(href);
  }

  return safe;
};

/**
 * 클라이언트 전용: ReadonlyURLSearchParams → 안전값
 * (내부 내비게이션/뒤로가기 등으로 들어오는 비표준 쿼리 보호)
 */
export const normalizeOnClient = (searchParams: ReadonlyURLSearchParams): HomeSafeQuery => ({
  category: normalizeCategory(searchParams.getAll('category')),
  keyword: normalizeKeyword(searchParams.getAll('keyword')),
  order: normalizeOrder(searchParams.getAll('order')),
});
