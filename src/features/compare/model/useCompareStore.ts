// 형제 컴포넌트들(CompareSelect 2개, CompareButton, CompareResult)사이의 상태 공유를 간단하게 만들고, 한 곳에서 일관되게 관리
'use client';

import { create } from 'zustand';

import type { CompareCandidate } from '../types/compareTypes';

/**
 * 비교 페이지 전역 상태 정의
 * - a, b: 선택된 후보(드롭다운에서 확정된 값)
 * - requested: "비교하기" 버튼을 눌렀는지 여부(결과 섹션 노출 트리거)
 */
type CompareState = {
  a: CompareCandidate | null;
  b: CompareCandidate | null;
  requested: boolean;
  setA: (a: CompareCandidate | null) => void;
  setB: (b: CompareCandidate | null) => void;
  requestCompare: () => void;
  clearAll: () => void;
};

export const useCompareStore = create<CompareState>()((set) => ({
  a: null,
  b: null,
  requested: false,

  // 후보 바꾸면 결과 테이블 닫힘
  setA: (a) => set({ a, requested: false }),
  setB: (b) => set({ b, requested: false }),

  // 버튼 눌러서 결과 불러오기
  requestCompare: () => set((s) => (s.a && s.b ? { requested: true } : s)),

  // 전체 초기화
  clearAll: () => set({ a: null, b: null, requested: false }),
}));
