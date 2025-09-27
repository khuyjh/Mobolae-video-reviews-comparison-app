// 전체 상태 구독 상황 등 대비 안전하게 사용하기 위한 CompareState 표준 셀렉터 유틸들
import type { CompareState } from '@/shared/stores/useCompareStore';

export const selectA = (state: CompareState) => state.a;
export const selectB = (state: CompareState) => state.b;
export const selectRequested = (state: CompareState) => state.requested;
export const selectRequestTick = (state: CompareState) => state.requestTick;
export const selectCanCompare = (state: CompareState) => state.canCompare();
export const selectInvalidReason = (state: CompareState) => state.invalidReason();
export const selectInFlight = (state: CompareState) => state.inFlight;

const isNumber = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v);

type CategoryMini = {
  id: number | null;
  categoryId: number | null;
};

export const selectAForCategory = (state: CompareState): CategoryMini => {
  const a = state.a;
  if (!a) {
    return { id: null, categoryId: null };
  }
  return {
    id: isNumber(a.id) ? a.id : null,
    categoryId: isNumber(a.categoryId) ? a.categoryId : null,
  };
};

export const selectBForCategory = (state: CompareState): CategoryMini => {
  const b = state.b;
  if (!b) {
    return { id: null, categoryId: null };
  }
  return {
    id: isNumber(b.id) ? b.id : null,
    categoryId: isNumber(b.categoryId) ? b.categoryId : null,
  };
};

/** 카테고리 정보 컴포넌트에서 한 번에 분기할 수 있게 요약된 페어 파생값 */
export type CategoryPairSummary = {
  aId: number | null;
  bId: number | null;
  aCategoryId: number | null;
  bCategoryId: number | null;

  hasA: boolean; // A 슬롯에 후보 존재?
  hasB: boolean; // B 슬롯에 후보 존재?
  hasAny: boolean; // 둘 중 하나라도 존재?
  hasBoth: boolean; // 둘 다 존재?

  sameCategory: boolean; // 양쪽 다 categoryId가 있고, 서로 같은가?
  missingCategory: boolean; // 둘 중 하나라도 categoryId가 없는가?
};

export const selectCategoryPair = (state: CompareState): CategoryPairSummary => {
  const a = state.a;
  const b = state.b;

  const aId = a && isNumber(a.id) ? a.id : null;
  const bId = b && isNumber(b.id) ? b.id : null;

  const aCategoryId = a && isNumber(a.categoryId) ? a.categoryId : null;
  const bCategoryId = b && isNumber(b.categoryId) ? b.categoryId : null;

  const hasA = aId !== null;
  const hasB = bId !== null;
  const hasAny = hasA || hasB;
  const hasBoth = hasA && hasB;

  const bothHaveCategory = isNumber(aCategoryId) && isNumber(bCategoryId);
  const sameCategory = bothHaveCategory && aCategoryId === bCategoryId;
  const missingCategory = !isNumber(aCategoryId) || !isNumber(bCategoryId);

  return {
    aId,
    bId,
    aCategoryId,
    bCategoryId,
    hasA,
    hasB,
    hasAny,
    hasBoth,
    sameCategory,
    missingCategory,
  };
};
