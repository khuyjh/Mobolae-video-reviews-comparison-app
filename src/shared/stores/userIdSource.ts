// useCompareStore에서 useStore를 단뱡향 참조하기 위한 헬퍼 모듈

import { useUserStore } from '@/shared/stores/userStore';

export type UserId = number;

/** 1) useUserStore userId 읽기 */
export function readUserIdFromStore(): UserId | null {
  try {
    // 현재 시점의 user 스토어 상태 스냅샷
    const userStoreState = useUserStore.getState();
    return (userStoreState.user?.id ?? null) as UserId | null;
  } catch {
    return null;
  }
}

/** 2) 폴백: persist된 auth-storage에서 userId 읽기(읽기 전용) */
export function readUserIdFromAuthStorage(): UserId | null {
  if (typeof window === 'undefined') return null;
  try {
    // useUserStore의 persist name이 'auth-storage'이므로 동일 키 사용
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (parsed?.state?.user?.id ?? null) as UserId | null;
  } catch {
    return null;
  }
}

/**  userStore 스토어 우선 실패 시 로컬 폴백 */
export function readCurrentUserId(): UserId | null {
  const fromStore = readUserIdFromStore();
  return fromStore ?? readUserIdFromAuthStorage();
}

/**
 * userId 변경 구독 (미들웨어 없는 환경에서도 작동하는 안전 버전)
 * - 단일 인자 subscribe(listener)만 사용
 * - 내부에서 prev/next를 직접 비교해 변할 때만 onChange 호출
 * - 반환: 구독 해제 함수
 */
export function subscribeUserId(
  onChange: (nextUserId: UserId | null, prevUserId: UserId | null) => void,
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let prevUserId: UserId | null = readUserIdFromStore();

  return useUserStore.subscribe((nextState) => {
    const nextUserId: UserId | null = (nextState?.user?.id ?? null) as UserId | null;

    if (Object.is(nextUserId, prevUserId)) return;

    const prev = prevUserId;
    prevUserId = nextUserId;
    onChange(nextUserId, prev);
  });
}
