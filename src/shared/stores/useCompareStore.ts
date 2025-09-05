// 비교 콘텐츠 a,b의 상태를 한 곳에서 일관되게 관리하는 zustand 스토어
// - a,b: 선택된 후보(입력창에 확정된 값)
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { CompareCandidate } from '../../features/compare/types/compareTypes';

/** 동일 아이템 선택 방지 결과 타입 */
type TrySetResult = { ok: true } | { ok: false; reason: 'duplicate' };

/**
 * 비교 페이지 전역 상태 정의
 * - a, b: 선택된 후보(입력창에 확정된 값)
 * - requested: "비교하기" 버튼을 눌렀는지 여부(결과 섹션 노출 트리거)
 * - trySetA/trySetB (선택 즉시 피드백이 필요한 UI에서 사용)
 * - canCompare/isDuplicate/invalidReason 파생 셀렉터 제공
 * - persist 저장 포맷은 a,b만 저장(requested는 UX상 새로고침 시 항상 false로 시작).
 */
type CompareState = {
  a: CompareCandidate | null;
  b: CompareCandidate | null;
  requested: boolean;

  trySetA: (a: CompareCandidate | null) => TrySetResult;
  trySetB: (b: CompareCandidate | null) => TrySetResult;

  requestCompare: () => void;
  /** 전체 초기화 */
  clearAll: () => void;
  // 파생 상태(함수형 셀렉터) - 한 곳의 규칙을 모든 UI가 공유
  canCompare: () => boolean;
  isDuplicate: () => boolean;
  invalidReason: () => string | null;

  /**
   * [유저 전환 동기화 액션]
   * 로그인/로그아웃/계정 전환 등으로 현재 사용자 id가 바뀌었을 때,
   * 해당 유저 네임스페이스의 저장값을 읽어 와서 메모리 상태(a,b)로 반영.
   * 루트에서 userId 변화(useUserStore 구독)를 감지해 이 함수를 호출.
   */
  syncWithCurrentUser: () => void;
};

/** 저장 포맷 - persist에는 이 형태만 저장 */
type PersistedCompare = Pick<CompareState, 'a' | 'b'>;

// 비교 금지(동일 선택) 판단 유틸
const isDup = (a: CompareCandidate | null, b: CompareCandidate | null) =>
  !!(a && b && a.id === b.id);

/** 추후 스키마 변경 대비 버전 */
const PERSIST_VERSION = 1;

/**
 * 현재 로그인한 유저 id를 userStore의 persist 값(auth-storage)에서 읽어옵니다.
 * - auth-storage 포맷은 zustand persist 기본 형태: { state: {...}, version: N }
 * - user.id 경로가 바뀌면 이 함수만 수정
 * - 값이 없거나 파싱 실패 시 null 반환.
 */
function getCurrentUserIdFromAuthStorage(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.id ?? null;
  } catch {
    return null;
  }
}

/** compare persist 기본 키(실제 저장 시에는 :<userId>/guest suffix를 붙입니다) */
const BASE_KEY = 'compare-storage';

/**
 * 커스텀 스토리지 어댑터
 * - zustand의 storage 인터페이스(getItem/setItem/removeItem)를 구현해서
 *   호출 시점마다 현재 userId를 읽어 key를 `compare-storage:<userId|guest>`로 바꿔줍니다.
 * - 이렇게 하면 같은 브라우저에서도 “유저별로 다른 로컬스토리지 키”에 저장됩니다.
 */
const namespacedStorage = {
  getItem: (_name: string) => {
    const userId = getCurrentUserIdFromAuthStorage();
    if (!userId) return null;
    const key = `${BASE_KEY}:${userId}`;
    return localStorage.getItem(key);
  },
  setItem: (_name: string, value: string) => {
    const userId = getCurrentUserIdFromAuthStorage();
    if (!userId) return;
    const key = `${BASE_KEY}:${userId}`;
    localStorage.setItem(key, value);
  },
  removeItem: (_name: string) => {
    const userId = getCurrentUserIdFromAuthStorage();
    if (!userId) return;
    const key = `${BASE_KEY}:${userId}`;
    localStorage.removeItem(key);
  },
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      a: null,
      b: null,
      requested: false,

      // 후보 A 설정(동일 선택 방지 포함). 후보가 바뀌면 결과 테이블 닫힘
      trySetA: (next) => {
        const { b } = get();
        if (isDup(next, b)) {
          set({ requested: false });
          return { ok: false, reason: 'duplicate' };
        }
        set({ a: next, requested: false });
        return { ok: true };
      },

      // 후보 B 설정(동일 선택 방지 포함). 후보가 바뀌면 결과 테이블 닫힘
      trySetB: (next) => {
        const { a } = get();
        if (isDup(next, a)) {
          set({ requested: false });
          return { ok: false, reason: 'duplicate' };
        }
        set({ b: next, requested: false });
        return { ok: true };
      },

      // 버튼 눌러서 결과 불러오기(동일 선택/미선택 시 무시)
      requestCompare: () => {
        const { a, b } = get();
        if (a && b && a.id !== b.id) set({ requested: true });
      },

      // 전체 초기화
      clearAll: () => set({ a: null, b: null, requested: false }),

      // 파생 셀렉터들 (한 곳에서 규칙 유지)
      canCompare: () => {
        const { a, b } = get();
        return !!(a && b && a.id !== b.id);
      },
      isDuplicate: () => {
        const { a, b } = get();
        return isDup(a, b);
      },
      invalidReason: () => {
        const { a, b } = get();
        if (!a || !b) return '두 콘텐츠를 모두 선택해 주세요.';
        if (isDup(a, b)) return '동일한 콘텐츠끼리는 비교할 수 없어요.';
        return null;
      },

      /**
       *  유저 전환 시: 로그인 상태면 해당 유저 키에서 복원, 아니면 메모리 초기화
       * - layout 등 공통 클라이언트에서 userId가 바뀔 때 마다 한 번 호출해 주세요.
       */
      syncWithCurrentUser: () => {
        try {
          const userId = getCurrentUserIdFromAuthStorage();
          if (!userId) {
            // 로그아웃 상태: persist 비활성. 메모리만 초기화.
            set({ a: null, b: null, requested: false });
            return;
          }
          const key = `${BASE_KEY}:${userId}`;
          const raw = localStorage.getItem(key);
          const parsed = raw ? JSON.parse(raw) : null;
          const a = parsed?.state?.a ?? null;
          const b = parsed?.state?.b ?? null;
          set({ a, b, requested: false });
        } catch {
          set({ a: null, b: null, requested: false });
        }
      },
    }),
    {
      /**
       * name은 의미상으로만 사용됩니다.
       * 실제 저장 키는 namespacedStorage가 `compare-storage:<userId|guest>`로 바꿔서 씁니다.
       */
      name: BASE_KEY,
      version: PERSIST_VERSION,

      // 커스텀 네임스페이스 스토리지 적용
      storage: createJSONStorage(() => namespacedStorage),

      /**
       * 부분 영속화: a, b만 저장
       * - requested/함수형 셀렉터는 직렬화/복원 대상이 아님
       */
      partialize: (s): PersistedCompare => ({ a: s.a, b: s.b }),

      /**
       *  마이그레이션: 저장 포맷을 { a, b }로 고정
       */
      migrate: (persistedState: unknown): PersistedCompare => {
        const state = persistedState as Partial<PersistedCompare> | null | undefined;
        return {
          a: state?.a ?? null,
          b: state?.b ?? null,
        };
      },
    },
  ),
);

//userStore, useCompareStore 사용 예시 TODO 삭제 예정
// 'use client';
// import { useEffect } from 'react';
// import { useUserStore } from '@/features/auth/stores/useUserStore';
// import { useCompareStore } from '@/features/compare/stores/useCompareStore';

// export function CompareSyncOnUserChange() {
//   const userId = useUserStore((s) => s.user?.id ?? null);
//   const syncWithCurrentUser = useCompareStore((s) => s.syncWithCurrentUser);

//   useEffect(() => {
//     // userId가 바뀌는 순간, 해당 유저 네임스페이스로 a,b를 재동기화
//     syncWithCurrentUser();
//   }, [userId, syncWithCurrentUser]);

//   return null;
// }
