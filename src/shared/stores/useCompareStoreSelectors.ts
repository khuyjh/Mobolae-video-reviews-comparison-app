// 전체 상태 구독 상황 등 대비 안전하게 사용하기 위한 CompareState 표준 셀렉터 유틸들
import type { CompareState } from '@/shared/stores/useCompareStore';

export const selectA = (state: CompareState) => state.a;
export const selectB = (state: CompareState) => state.b;
export const selectRequested = (state: CompareState) => state.requested;
export const selectRequestTick = (state: CompareState) => state.requestTick;
export const selectCanCompare = (state: CompareState) => state.canCompare();
export const selectInvalidReason = (state: CompareState) => state.invalidReason();
export const selectInFlight = (state: CompareState) => state.inFlight;

/** 사용 팁
 * 셀렉터가 객체를 반환해야 할 때는 shallow를 꼭 함께 사용하세요.
 *  예시
 *  import { shallow } from 'zustand/shallow';
 *   const pair = useCompareStore(
 *   (state) => ({ a: state.a, b: state.b }),
 *   shallow,
 *   );
 */
