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
 *
 *  변경 요약
 * 1) setA/setB는 그대로 두되, 내부에서 "중복이면 무시"하도록 방어 로직 추가
 * 2) trySetA/trySetB를 추가로 제공(선택 즉시 피드백이 필요한 UI에서 사용)
 * 3) canCompare/isDuplicate/invalidReason 파생 셀렉터 제공
 */
type CompareState = {
  a: CompareCandidate | null;
  b: CompareCandidate | null;
  requested: boolean;

  // 기존 API (호환 유지)
  setA: (a: CompareCandidate | null) => void;
  setB: (b: CompareCandidate | null) => void;
  requestCompare: () => void;
  clearAll: () => void;

  // 신규 API (권장) - UI에서 즉시 피드백 줄 때 사용
  trySetA: (a: CompareCandidate | null) => TrySetResult;
  trySetB: (b: CompareCandidate | null) => TrySetResult;

  // 파생 상태(함수형 셀렉터) - 한 곳의 규칙을 모든 UI가 공유
  canCompare: () => boolean;
  isDuplicate: () => boolean;
  invalidReason: () => string | null;
};

// 중복 상황
const isDup = (a: CompareCandidate | null, b: CompareCandidate | null) =>
  !!(a && b && a.id === b.id);

export const useCompareStore = create<CompareState>()((set, get) => ({
  a: null,
  b: null,
  requested: false,

  // -------------------------
  // 내부 유틸: 중복 검사
  // -------------------------
  // 동일 콘텐츠를 양쪽에 둘 수 없도록 체크
  // -----------------------------------------------
  // 사용 예: if (isDup(next, other)) => 중복이므로 차단
  // -----------------------------------------------

  isDup: (x: CompareCandidate | null, y: CompareCandidate | null) => !!(x && y && x.id === y.id),

  // -------------------------
  // 기존 API (호환 유지)
  // -------------------------
  setA: (next) => {
    const { b } = get();
    if (isDup(next, b)) {
      set({ requested: false });
      return;
    }
    set({ a: next, requested: false });
  },

  setB: (next) => {
    const { a } = get();
    if (isDup(next, a)) {
      set({ requested: false });
      return;
    }
    set({ b: next, requested: false });
  },

  // 버튼 눌러서 결과 불러오기
  // a/b가 모두 있고 서로 다를 때만 requested: true
  requestCompare: () => set((s) => (s.a && s.b && s.a.id !== s.b.id ? { requested: true } : s)),

  // 전체 초기화
  clearAll: () => set({ a: null, b: null, requested: false }),

  // -------------------------
  // 신규 API (권장)
  // -------------------------
  // 주석: UI에서 선택 시도 → 실패 사유를 받고 인라인 에러/토스트를 표시하기 좋습니다.
  trySetA: (next) => {
    const { b } = get();
    if (next && b && next.id === b.id) {
      set({ requested: false });
      return { ok: false, reason: 'duplicate' };
    }
    set({ a: next, requested: false });
    return { ok: true };
  },

  trySetB: (next) => {
    const { a } = get();
    if (next && a && next.id === a.id) {
      set({ requested: false });
      return { ok: false, reason: 'duplicate' };
    }
    set({ b: next, requested: false });
    return { ok: true };
  },

  // -------------------------
  // 파생 상태 (한 곳의 규칙을 모든 UI에서 재사용)
  // -------------------------
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
