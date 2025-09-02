'use client';
// 형제 컴포넌트들(CompareSelect 2개, CompareButton, CompareResult)사이의 상태 공유를 간단하게 만들고, 한 곳에서 일관되게 관리

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { CompareCandidate } from '../types/compareTypes';

/**
 * 비교 페이지 전역 상태 정의
 * - a, b: 선택된 후보(드롭다운에서 확정된 값)
 * - requested: "비교하기" 버튼을 눌렀는지 여부(결과 섹션 노출 트리거)
 */
export interface CompareState {
  a: CompareCandidate | null;
  b: CompareCandidate | null;
  requested: boolean;

  // 선택 액션
  setA: (v: CompareCandidate | null) => void;
  setB: (v: CompareCandidate | null) => void;

  // "비교하기" 버튼 액션
  requestCompare: () => void;

  // 후보 변경 시, 다시 버튼을 눌러야 하므로 requested=false로 리셋
  resetRequest: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      a: null,
      b: null,
      requested: false,

      //  후보가 바뀌면 결과 요청 상태를 초기화(다시 버튼을 누르게)
      setA: (candidate) => set(() => ({ a: candidate, requested: false })),
      setB: (candidate) => set(() => ({ b: candidate, requested: false })),

      //  두 슬롯이 모두 채워졌을 때만 requested를 true로
      requestCompare: () => {
        const { a, b } = get();
        if (a && b) set({ requested: true });
      },

      resetRequest: () => set({ requested: false }),
      resetAll: () => set({ a: null, b: null, requested: false }),
    }),
    {
      name: 'compare-store', // localStorage key (요구사항: 사이트 닫아도 유지)
      // Next.js SSR 안전 설정: 서버에서는 storage를 만들지 않음
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      // 필요 시 저장할 필드 제한 가능
      // partialize: (s) => ({ a: s.a, b: s.b, requested: s.requested }),
    },
  ),
);
