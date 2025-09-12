// 비교 콘텐츠 a,b의 상태를 한 곳에서 일관되게 관리하는 zustand 스토어
// - a,b: 선택된 후보(입력창에 확정된 값)
// - 동일 categoryId끼리만 비교 가능 로직 추가
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { CompareCandidate } from '../../features/compare/types/compareTypes';

/** 유틸/타입 */

/** 동일 아이템 선택 방지 + 카테고리 규칙 */
export type TrySetResult =
  | { ok: true }
  | { ok: false; reason: 'duplicate' } // 동일 id 선택
  | { ok: false; reason: 'category-mismatch' } // a/b categoryId 불일치
  | { ok: false; reason: 'missing-category' }; // a/b 중 하나라도 categoryId 없음

/** 모달에서 비교 교체 의도 사전 평가 결과 타입  */
export type ReplaceEval =
  | 'ok' // 같은 카테고리 → 즉시 교체(또는 담기) 가능
  | 'duplicate' // 이미 담긴 항목
  | 'missing-category' // next 또는 상대 슬롯에 categoryId가 없음
  | 'needs-clear'; // 다른 카테고리 → "비우고 시작" 필요

/**
 * 비교 페이지 전역 상태 정의
 * - a, b: 선택된 후보(입력창에 확정된 값)
 * - requested: "비교하기" 버튼을 눌렀는지 여부(결과 섹션 노출 트리거)
 * - trySetA/trySetB (선택 즉시 피드백이 필요한 UI에서 사용)
 * - canCompare/isDuplicate/invalidReason 여러 컴포넌트에서 동일 규칙 공유
 * - persist 저장 포맷은 a,b만 저장(requested는 UX상 새로고침 시 항상 false로 시작).
 */
export type CompareState = {
  a: CompareCandidate | null;
  b: CompareCandidate | null;
  requested: boolean;

  trySetA: (a: CompareCandidate | null) => TrySetResult;
  trySetB: (b: CompareCandidate | null) => TrySetResult;

  /** 비교하기 버튼 누를 때마다 증가 → 쿼리 키에 포함해서 최신화 트리거 */
  requestTick: number;
  /** 성공 시 requested=true + requestTick++ */
  requestCompare: () => boolean;

  /** 현재 비교 데이터 fetch 진행 중 여부 (A/B 둘 중 하나라도 fetching이면 true) */
  inFlight: boolean;
  setInFlight: (isInFlight: boolean) => void;

  // 파생 상태(함수형 셀렉터) - 한 곳의 규칙을 모든 UI가 공유
  canCompare: () => boolean;
  isDuplicate: () => boolean;
  invalidReason: () => string | null;

  /**
   * 초기화 계층
   * - resetCandidates: a,b 선택지 + requested 초기화
   * - resetAllState:   완전 초기화 (선택/요청/진행상태/쿼리키 카운터 초기화, 기존 clearAll과 동일)
   * - clearAll:        호환용 alias로 남겨둠, 내부에서 resetAllState 호출
   */
  resetCandidates: () => void;
  resetAllState: () => void;
  clearAll: () => void; //(호환용 alias)

  /**
   * 유저 전환 동기화 액션
   * 로그인/로그아웃/계정 전환 등으로 현재 사용자 id가 바뀌었을 때,
   * 해당 유저 네임스페이스의 저장값을 읽어 와서 메모리 상태(a,b)로 반영.
   * 루트에서 userId 변화(useUserStore 구독)를 감지해 이 함수를 호출.
   */
  syncWithCurrentUser: () => void;

  /**
   * 모달에서 교체 의도 사전 평가
   * 상태 변경 없이 교체 가능성만 판단하여 UI에서 분기 처리 가능.
   */
  evaluateReplace: (side: 'A' | 'B', next: CompareCandidate) => ReplaceEval;

  /**
   *  명시적으로 현재 로그인한 유저의 compare-storage를 지우고 싶을 때만 호출
   * (persist 내부 removeItem은 no-op으로 막았으므로, 삭제는 이 액션으로만 수행)
   */
  wipeCurrentUserStorage: () => void;
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
    console.log('getCurrentUserIdFrom...');
    const raw = localStorage.getItem('auth-storage');
    console.log('raw', raw);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.id ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

/** compare persist 기본 키(로그인 상태에서만 저장, 비로그인 시 저장 안 함) */
const BASE_KEY = 'compare-storage';

/** 추가: userId 변경 감지 & 동기화 유틸 (모듈 스코프), 마지막으로 확인한 userId를 기억하기 위함 */
let __lastUserId: string | null | undefined = undefined;

// 현재 auth-storage 기준 userId를 읽어와, 바뀌었으면 sync 실행
function __trySyncCompareOnUserChange() {
  try {
    const current = getCurrentUserIdFromAuthStorage();
    if (__lastUserId === current) return; // 변화 없음

    __lastUserId = current;

    // zustand 스토어 액션 호출: B 유저 스냅샷 있으면 복원, 없으면 초기화
    // (아래 useCompareStore 정의 이후에 바인딩되므로, 안전하게 microtask로 미룸)
    queueMicrotask(() => {
      try {
        useCompareStore.getState().syncWithCurrentUser();
      } catch (e) {
        // 아직 스토어가 초기화 안 된 아주 이른 타이밍 대비
        setTimeout(() => {
          try {
            useCompareStore.getState().syncWithCurrentUser();
          } catch {}
        }, 0);
      }
    });
  } catch {}
}
/**
 * 커스텀 스토리지 어댑터
 * - zustand의 storage 인터페이스(getItem/setItem/removeItem)를 구현해서
 * - 호출 시점마다 현재 userId를 읽어 key를 `compare-storage:<userId>`로 바꿔줍니다.
 * - 로그아웃 상태에서는 읽기/쓰기를 수행하지 않습니다(=persist 비활성)
 */
const namespacedStorage = {
  getItem: (_name: string) => {
    const userId = getCurrentUserIdFromAuthStorage();
    console.log(userId, 'getitem');
    console.log(localStorage.getItem(`${BASE_KEY}:${userId}`), 'getitem');
    if (!userId) return null;
    return localStorage.getItem(`${BASE_KEY}:${userId}`);
  },
  setItem: (_name: string, value: string) => {
    const userId = getCurrentUserIdFromAuthStorage();
    const key = userId ? `${BASE_KEY}:${userId}` : '(no user)';
    try {
      const parsed = JSON.parse(value);
      console.log('setItem', key, parsed);
      // ★ a/b가 null로 저장될 때만 로그
      if (parsed?.state?.a === null && parsed?.state?.b === null) {
        // console.warn('[compare:setItem NULL SAVE]', { key, value: parsed });
        // console.trace('[compare: NULL save stack]');
      } else {
      }
    } catch {}
    if (!userId) return; // 비로그인 상태에선 저장 안 함
    localStorage.setItem(`${BASE_KEY}:${userId}`, value);
  },
  removeItem: (_name: string) => {
    //의도치 않은 시점에 유저 키가 삭제되는 문제 예방하기 위해 no-op 처리
  },
};

/** 추가: 같은 탭에서 auth-storage가 갱신될 때를 감지하기 위한 후킹
   - localStorage.setItem('auth-storage', ...) 이후 즉시 동기화
   - 다른 키에는 영향 없음
 */
(() => {
  if (typeof window === 'undefined') return;

  const _origSetItem = localStorage.setItem.bind(localStorage);

  localStorage.setItem = function (key: string, value: string) {
    _origSetItem(key, value);
    if (key === 'auth-storage') {
      // 로그인/로그아웃/유저전환 직후, 같은 탭에서도 확실히 감지
      __trySyncCompareOnUserChange();
    }
  };

  // 다른 탭에서 auth-storage가 바뀐 경우(브라우저 표준 storage 이벤트)
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth-storage') {
      __trySyncCompareOnUserChange();
    }
  });

  // 탭 포커스나 가시성 전환 시에도 한 번 동기화 (백그라운드에서 바뀐 경우 대비)
  const onWake = () => __trySyncCompareOnUserChange();
  window.addEventListener('focus', onWake);
  document.addEventListener('visibilitychange', onWake);

  // 초기 1회 동기화 (앱 로드 시 현재 유저 스냅샷 반영)
  queueMicrotask(__trySyncCompareOnUserChange);
})();

/* zustand store 부분 */

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      a: null,
      b: null,
      requested: false,

      // 클릭마다 최신화를 위한 Tick
      requestTick: 0,

      inFlight: false,
      setInFlight: (isInFlight) => set({ inFlight: isInFlight }),

      // 후보 A 설정(동일 선택 방지 + 카테고리 규칙 포함). 후보가 바뀌면 결과 테이블 닫힘
      trySetA: (next) => {
        const { b } = get();

        // 선택 취소(next=null) 허용: 단순히 지우기
        if (!next) {
          set({ a: null, requested: false });
          return { ok: true } as const;
        }

        if (!hasCategory(next)) {
          set({ requested: false });
          return { ok: false, reason: 'missing-category' } as const;
        }

        // 동일 콘텐츠 방지
        if (isDup(next, b)) {
          set({ requested: false });
          return { ok: false, reason: 'duplicate' } as const;
        }

        // 상대 슬롯이 이미 있고, 카테고리 정보가 빠져있다면 거부
        if (b && !hasCategory(b)) {
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

        if (!hasCategory(next)) {
          set({ requested: false });
          return { ok: false, reason: 'missing-category' } as const;
        }

        if (isDup(next, a)) {
          set({ requested: false });
          return { ok: false, reason: 'duplicate' } as const;
        }

        if (a) {
          if (!hasCategory(a)) {
            set({ requested: false });
            return { ok: false, reason: 'missing-category' } as const;
          }
          if (!isSameCategory(next, a)) {
            set({ requested: false });
            return { ok: false, reason: 'category-mismatch' } as const;
          }
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
        //zustand set 업데이터 콜백이라 이전 상태를 의미하는 prev 사용
        set((prev) => ({ requested: true, requestTick: prev.requestTick + 1 }));
        return true;
      },

      /**
       * 초기화 계층
       * - resetCandidates: a/b상태 및 requested 초기화 (쿼리키/플래그 보존)
       * - resetAllState:   완전 초기화 (기존 clearAll과 동일 모두 초기화)
       * - clearAll:        호환 alias
       */

      // 선택지만 초기화 (교체 UX에서 "비우고 시작" 시, 쿼리키 유지하고 싶을 때 권장)
      resetCandidates: () => set({ a: null, b: null, requested: false }),

      // 완전 초기화 (기존 clearAll과 같은 동작)
      resetAllState: () =>
        set({ a: null, b: null, requested: false, requestTick: 0, inFlight: false }),

      // 기존 호출처가 clearAll을 쓰더라도 안전
      clearAll: () => get().resetAllState(),

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
       * - 유저 전환 시: 로그인 상태면 해당 유저 키에서 복원, 아니면 메모리 초기화
       * - 이제 직접 JSON 파싱하여 set()하지 않고,zustand persist의 rehydrate 경로를 최우선으로 사용
       * - (migrate/partialize/version을 그대로 따르기 때문에 안전)
       */
      syncWithCurrentUser: () => {
        try {
          const userId = getCurrentUserIdFromAuthStorage();
          // 1) 로그아웃 상태: 메모리만 초기화.
          if (!userId) {
            set({ a: null, b: null, requested: false, requestTick: 0, inFlight: false });
            return;
          }

          const key = `${BASE_KEY}:${userId}`;
          const raw = localStorage.getItem(key);

          // 다음 틱에서 처리 → namespacedStorage가 '변경된 userId'로 읽도록 보장
          queueMicrotask(() => {
            if (raw) {
              // 스냅샷이 있으면 → rehydrate로 복원(migrate/partialize/version 로직 그대로 탑승)
              try {
                useCompareStore.persist.rehydrate();

                // (선택) 휘발성 플래그 정리: requested/inFlight 등
                set({ requested: false, inFlight: false });
              } catch {
                // rehydrate 실패 시 안전 초기화
                set({ a: null, b: null, requested: false, requestTick: 0, inFlight: false });
              }
            } else {
              // 스냅샷이 없으면 → 초기화
              set({ a: null, b: null, requested: false, requestTick: 0, inFlight: false });
            }
          });
        } catch {
          // 예외 대비: 안전 초기화
          set({ a: null, b: null, requested: false, requestTick: 0, inFlight: false });
        }
      },
      evaluateReplace: (side, next) => {
        const { a, b } = get();
        const other = side === 'A' ? b : a;

        // 카테고리 존재 체크
        if (!hasCategory(next)) return 'missing-category';

        // 중복 체크 (다른 슬롯 또는 같은 슬롯과의 중복)
        if (isDup(next, a) || isDup(next, b)) return 'duplicate';

        // 상대 슬롯 없으면 그냥 OK
        if (!other) return 'ok';

        if (!hasCategory(other)) return 'missing-category';

        return isSameCategory(next, other) ? 'ok' : 'needs-clear';
      },

      // 명시적 삭제 액션: 정말로 현재 유저의 compare-storage를 지워야 할 때만 사용
      wipeCurrentUserStorage: () => {
        const userId = getCurrentUserIdFromAuthStorage();
        if (!userId) return;
        const key = `${BASE_KEY}:${userId}`;
        localStorage.removeItem(key);
      },
    }),

    {
      /**
       * name은 의미상으로만 사용됩니다.
       * 실제 저장 키는 namespacedStorage가 `compare-storage:<userId>`로 바꿔서 씁니다.
       */
      name: BASE_KEY,
      version: PERSIST_VERSION,
      // 커스텀 네임스페이스 스토리지 적용
      storage: createJSONStorage(() => namespacedStorage),

      /**
       * 부분 영속화: a, b만 저장
       * requested/함수형 셀렉터는 직렬화/복원 대상이 아님
       * persist.partialize 콜백이고 현재 메모리 상태를 의미하므로 state 사용
       */
      partialize: (state): PersistedCompare => ({ a: state.a, b: state.b }),

      /**
       * 마이그레이션: 저장 포맷을 { a, b }로 고정
       * V2 마이그레이션: categoryId 없는 과거 저장본은 안전을 위해 null 처리
       * migrate 내부의 파싱된 저장값(로컬에 저장되어 있던 값)이므로 stored 사용
       */
      migrate: (persistedState: unknown): PersistedCompare => {
        const stored = persistedState as Partial<PersistedCompare> | null | undefined;

        const a = stored?.a ?? null;
        const b = stored?.b ?? null;

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
