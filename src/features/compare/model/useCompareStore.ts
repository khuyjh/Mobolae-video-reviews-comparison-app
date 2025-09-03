// 형제 컴포넌트들(CompareSelect 2개, CompareButton, CompareResult)사이의 상태 공유를 간단하게 만들고, 한 곳에서 일관되게 관리
'use client';

import { create } from 'zustand';

import type { CompareCandidate } from '../types/compareTypes';

/** 동일 아이템 선택 방지 결과 타입 */
type TrySetResult = { ok: true } | { ok: false; reason: 'duplicate' };

/**
 * 비교 페이지 전역 상태 정의
 * - a, b: 선택된 후보(드롭다운에서 확정된 값)
 * - requested: "비교하기" 버튼을 눌렀는지 여부(결과 섹션 노출 트리거)
 * - trySetA/trySetB (선택 즉시 피드백이 필요한 UI에서 사용)
 * - canCompare/isDuplicate/invalidReason 파생 셀렉터 제공
 */
type CompareState = {
  a: CompareCandidate | null;
  b: CompareCandidate | null;
  requested: boolean;

  trySetA: (a: CompareCandidate | null) => TrySetResult;
  trySetB: (b: CompareCandidate | null) => TrySetResult;

  requestCompare: () => void;
  clearAll: () => void;
  // 파생 상태(함수형 셀렉터) - 한 곳의 규칙을 모든 UI가 공유
  canCompare: () => boolean;
  isDuplicate: () => boolean;
  invalidReason: () => string | null;
};

// 비교 금지(동일 선택) 판단 유틸
const isDup = (a: CompareCandidate | null, b: CompareCandidate | null) =>
  !!(a && b && a.id === b.id);

export const useCompareStore = create<CompareState>()((set, get) => ({
  a: null,
  b: null,
  requested: false,

  isDup: (x: CompareCandidate | null, y: CompareCandidate | null) => !!(x && y && x.id === y.id),

  trySetA: (next) => {
    const { b } = get();
    if (isDup(next, b)) {
      set({ requested: false });
      return { ok: false, reason: 'duplicate' };
    }
    set({ a: next, requested: false });
    return { ok: true };
  },

  trySetB: (next) => {
    const { a } = get();
    if (isDup(next, a)) {
      set({ requested: false });
      return { ok: false, reason: 'duplicate' };
    }
    set({ b: next, requested: false });
    return { ok: true };
  },

  requestCompare: () => set((s) => (s.a && s.b && s.a.id !== s.b.id ? { requested: true } : s)),

  clearAll: () => set({ a: null, b: null, requested: false }),

  canCompare: () => {
    const { a, b } = get();
    return !!(a && b && a.id !== b.id);
  },
  isDuplicate: () => {
    const { a, b } = get();
    return !!(a && b && a.id === b.id);
  },
  invalidReason: () => {
    const { a, b } = get();
    if (!a || !b) return '두 콘텐츠를 모두 선택해 주세요.';
    if (a.id === b.id) return '동일한 콘텐츠끼리는 비교할 수 없어요.';
    return null;
  },
}));
