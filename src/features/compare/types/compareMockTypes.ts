// api 연결전 테스트용 목데이터 파일 TODO api 연결 후 삭제
import type { CompareCandidate, CompareMetrics } from '../types/compareTypes';

export type CompareItem = CompareCandidate & Omit<CompareMetrics, 'id'>;
//  => { id, name } + { rating, reviewCount, favoriteCount }

export const MOCK_ITEMS: CompareItem[] = [
  { id: 1, name: '해리포터: 마법사의 돌', rating: 4.8, reviewCount: 100, favoriteCount: 110 },
  { id: 2, name: '해리포터: 비밀의 방', rating: 4.9, reviewCount: 300, favoriteCount: 100 },
  { id: 3, name: '해리포터: 아즈카반의 죄수', rating: 4.7, reviewCount: 180, favoriteCount: 90 },
  { id: 4, name: '해리포터: 불사조 기사단', rating: 4.5, reviewCount: 1020, favoriteCount: 70 },
  { id: 6, name: '존윅', rating: 4.4, reviewCount: 210, favoriteCount: 130 },
  { id: 7, name: '존윅: 리로드', rating: 4.2, reviewCount: 150, favoriteCount: 95 },
  { id: 8, name: '존윅: 파라벨룸', rating: 4.6, reviewCount: 260, favoriteCount: 1400 },
  { id: 9, name: '트루먼 쇼', rating: 4.9, reviewCount: 5000, favoriteCount: 10000 },
  { id: 10, name: '쇼생크 탈출', rating: 4.9, reviewCount: 5000, favoriteCount: 10000 }, // 이름 검색 및 동률 테스트용
];

// Select용 후보 리스트로 변환 (id/name만)
export const MOCK_CANDIDATES: CompareCandidate[] = MOCK_ITEMS.map(({ id, name }) => ({ id, name }));

// id로 지표 하나 꺼내오기
export function getMetricsById(id: CompareItem['id']): CompareMetrics {
  const f = MOCK_ITEMS.find((x) => x.id === id);
  if (!f) throw new Error('Item not found: ' + id);
  return { id: f.id, rating: f.rating, reviewCount: f.reviewCount, favoriteCount: f.favoriteCount };
}

// “API처럼” 두 개 비교 값 리턴(네트워크 흉내)
export async function fetchCompare(aId: number | string, bId: number | string) {
  // await new Promise((r) => setTimeout(r, 200)); // 지연 테스트 원하면 주석 해제
  return [getMetricsById(aId), getMetricsById(bId)] as const;
}
