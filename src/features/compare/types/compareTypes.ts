// 비교하기 페이지에서 쓰이는 타입들

// 승자 텍스트 색상 상수화
export const WINNER_TEXT_COLOR = {
  A: 'text-green-500',
  B: 'text-pink-500',
  TIE: 'text-gray-400',
} as const;

/** 승패 코드 공통 타입 */
export type WinnerCode = 'A' | 'B' | 'TIE';

/** 문구 + 색상을 한 번에 관리 (컴포넌트에서 이걸 주로 사용) */
export const WINNER_CONFIG: Record<WinnerCode, { text: string; color: string }> = {
  A: { text: '콘텐츠 1 우세', color: WINNER_TEXT_COLOR.A },
  B: { text: '콘텐츠 2 우세', color: WINNER_TEXT_COLOR.B },
  TIE: { text: '무승부', color: WINNER_TEXT_COLOR.TIE },
} as const;

// 사용자가 드롭다운에서 고르는 “후보” 타입 (Select 전용)
export type CompareCandidate = {
  id: number;
  name: string;
  disabled?: boolean; // 비활성 UI 제어용 혹시 모를 확장성 대비
};

// 실제 비교에 쓰이는 “지표” 타입 (Result 전용)
export type CompareMetrics = {
  id: number;
  rating: number; // 별점 0~5
  reviewCount: number; // 리뷰 개수
  favoriteCount: number; // 찜 개수
};

// 테이블 계산에 사용하는 키들
export type MetricKey = 'rating' | 'reviewCount' | 'favoriteCount';

// 테이블 한 행 타입(테이블/컨테이너가 공유)
export type CompareRow = {
  id: MetricKey;
  label: string;
  valueA: number;
  valueB: number;
  winner: WinnerCode; // 'A' | 'B' | 'TIE' 대신 WinnerCode 사용
};

// 승자 결정 헬퍼(반드시 리턴 타입을 유니언 리터럴로)
export function decideWinner(
  aVal: number,
  bVal: number,
  higherIsBetter: boolean,
): 'A' | 'B' | 'TIE' {
  if (aVal === bVal) return 'TIE';
  if (higherIsBetter) return aVal > bVal ? 'A' : 'B';
  return aVal < bVal ? 'A' : 'B';
}

// 레이블/정렬 규칙/표기 포맷을 한 군데서 관리
export const METRIC_CONFIG: Record<
  MetricKey,
  { label: string; higherIsBetter: boolean; formatter?: (n: number) => string }
> = {
  rating: { label: '별점', higherIsBetter: true, formatter: (n) => n.toFixed(1) },
  reviewCount: { label: '리뷰 개수', higherIsBetter: true, formatter: (n) => n.toLocaleString() },
  favoriteCount: { label: '찜 개수', higherIsBetter: true, formatter: (n) => n.toLocaleString() },
};
