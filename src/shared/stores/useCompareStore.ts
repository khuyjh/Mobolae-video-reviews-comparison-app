// 비교 콘텐츠 a,b의 상태를 한 곳에서 일관되게 관리하는 zustand 스토어
// - a,b: 선택된 후보(입력창에 확정된 값)
// - 동일 categoryId끼리만 비교 가능 로직 추가
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { CompareCandidate } from '../../features/compare/types/compareTypes';

/** 동일 아이템 선택 방지 + 카테고리 규칙 */
type TrySetResult =
  | { ok: true }
  | { ok: false; reason: 'duplicate' } // 동일 id 선택
  | { ok: false; reason: 'category-mismatch' } // a/b categoryId 불일치
  | { ok: false; reason: 'missing-category' }; // a/b 중 하나라도 categoryId 없음

/**
 * 비교 페이지 전역 상태 정의
 * - a, b: 선택된 후보(입력창에 확정된 값)
 * - requested: "비교하기" 버튼을 눌렀는지 여부(결과 섹션 노출 트리거)
 * - trySetA/trySetB (선택 즉시 피드백이 필요한 UI에서 사용)
 * - canCompare/isDuplicate/invalidReason 여러 컴포넌트에서 동일 규칙 공유
 * - persist 저장 포맷은 a,b만 저장(requested는 UX상 새로고침 시 항상 false로 시작).
 */
type CompareState = {
  a: CompareCandidate | null;
  b: CompareCandidate | null;
  requested: boolean;

  trySetA: (a: CompareCandidate | null) => TrySetResult;
  trySetB: (b: CompareCandidate | null) => TrySetResult;

  requestCompare: () => boolean;
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

/* 동일 아이템 선택 금지 판단 */
const isDup = (a: CompareCandidate | null, b: CompareCandidate | null) =>
  !!(a && b && a.id === b.id);

/* 후보에 categoryId가 정상적으로 있는지 판단 */
const hasCategory = (x: CompareCandidate | null) => !!(x && typeof x.categoryId === 'number');

/* 두 후보의 categoryId가 모두 존재하고, 서로 같은지 판단 */
const isSameCategory = (a: CompareCandidate | null, b: CompareCandidate | null) =>
  !!(
    a &&
    b &&
    typeof a.categoryId === 'number' &&
    typeof b.categoryId === 'number' &&
    a.categoryId === b.categoryId
  );

/** 추후 스키마 변경 대비 버전 - V2로 변경 categoryId 없는 과거 저장본 방어 */
const PERSIST_VERSION = 2;

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

/** compare persist 기본 키(로그인 상태에서만 저장, 비로그인 시 저장 안 함) */
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

/* zustand store 부분 */

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      a: null,
      b: null,
      requested: false,

      // 후보 A 설정(동일 선택 방지 + 카테고리 규칙 포함). 후보가 바뀌면 결과 테이블 닫힘
      trySetA: (next) => {
        const { b } = get();

        // 선택 취소(next=null) 허용: 단순히 지우기
        if (!next) {
          set({ a: null, requested: false });
          return { ok: true } as const;
        }

        // 동일 콘텐츠 방지
        if (isDup(next, b)) {
          set({ requested: false });
          return { ok: false, reason: 'duplicate' } as const;
        }

        // 상대 슬롯이 이미 있고, 카테고리 정보가 빠져있다면 거부
        if (b && (!hasCategory(next) || !hasCategory(b))) {
          set({ requested: false });
          return { ok: false, reason: 'missing-category' } as const;
        }

        // 상대 슬롯이 이미 있고, 카테고리 불일치라면 거부
        if (b && !isSameCategory(next, b)) {
          set({ requested: false });
          return { ok: false, reason: 'category-mismatch' } as const;
        }

        // 통과 후 반영
        set({ a: next, requested: false });
        return { ok: true };
      },

      // 후보 B 설정(동일 선택 방지 포함). 후보가 바뀌면 결과 테이블 닫힘
      trySetB: (next) => {
        const { a } = get();

        if (!next) {
          set({ b: null, requested: false });
          return { ok: true } as const;
        }

        if (isDup(next, a)) {
          set({ requested: false });
          return { ok: false, reason: 'duplicate' } as const;
        }

        if (a && (!hasCategory(next) || !hasCategory(a))) {
          set({ requested: false });
          return { ok: false, reason: 'missing-category' } as const;
        }

        if (a && !isSameCategory(next, a)) {
          set({ requested: false });
          return { ok: false, reason: 'category-mismatch' } as const;
        }

        set({ b: next, requested: false });
        return { ok: true } as const;
      },

      /**
       * Compare 버튼 눌러서 결과 불러오기(최종 검증 포함)
       * - 동일 선택/미선택/카테고리 불일치 시 false 반환(요청 금지)
       * - 성공 시 requested=true로 전환하고 true 반환
       */
      requestCompare: () => {
        const can = get().canCompare();
        if (!can) {
          set({ requested: false });
          return false;
        }
        set({ requested: true });
        return true;
      },

      // 전체 초기화
      clearAll: () => set({ a: null, b: null, requested: false }),

      // 파생 셀렉터들 (한 곳에서 규칙 유지)
      canCompare: () => {
        const { a, b } = get();
        return !!(a && b && a.id !== b.id && isSameCategory(a, b));
      },
      isDuplicate: () => {
        const { a, b } = get();
        return isDup(a, b);
      },
      invalidReason: () => {
        const { a, b } = get();

        // - 순서: 존재 여부 → 동일 선택 → 카테고리 불일치
        if (!a || !b) return '두 콘텐츠를 모두 선택해 주세요.';
        if (isDup(a, b)) return '동일한 콘텐츠끼리는 비교할 수 없어요.';
        if (!hasCategory(a) || !hasCategory(b))
          return '카테고리 정보가 없는 콘텐츠가 있어 비교할 수 없어요.';
        if (!isSameCategory(a, b)) return '동일한 카테고리끼리만 비교할 수 있어요.';

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

          // 복원 시에도 categoryId가 없다면 무효화
          const safeA: CompareCandidate | null = a && typeof a.categoryId === 'number' ? a : null;
          const safeB: CompareCandidate | null = b && typeof b.categoryId === 'number' ? b : null;

          set({ a: safeA, b: safeB, requested: false });
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
       * 마이그레이션: 저장 포맷을 { a, b }로 고정
       * V2 마이그레이션: categoryId 없는 과거 저장본은 안전을 위해 null 처리
       */
      migrate: (persistedState: unknown): PersistedCompare => {
        const state = persistedState as Partial<PersistedCompare> | null | undefined;

        const a = state?.a ?? null;
        const b = state?.b ?? null;

        const safeA: CompareCandidate | null =
          a && typeof (a as CompareCandidate).categoryId === 'number'
            ? (a as CompareCandidate)
            : null;

        const safeB: CompareCandidate | null =
          b && typeof (b as CompareCandidate).categoryId === 'number'
            ? (b as CompareCandidate)
            : null;

        return {
          a: safeA,
          b: safeB,
        };
      },
    },
  ),
);
