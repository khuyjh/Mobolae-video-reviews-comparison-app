// 콘텐츠 리스트 유틸 함수 (비교하기 페이지, CompareSelect에서 사용)
// 콘텐츠 리스트 아이템 최소 타입
import type { ListProductDefaultResponse } from '../../../../openapi/queries/common';
import type { CompareCandidate } from '@/features/compare/types/compareTypes';

// API 항목 원시 형태 (응답 항목에 들어있는 최소 키들; 타입은 아직 unknown -> 런타임 타입 가드로 좁히기)
type ContentListRaw = { id?: unknown; name?: unknown; categoryId?: unknown };
// 2) "정제된 형태" (최종적으로 보장하고 싶은 타입)
type ContentList = { id: number; name: string; categoryId: number };

// 런타임 타입 가드: unknown → ContentList 로 좁히는 타입가드
export const toContentList = (value: unknown): value is ContentList => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as ContentListRaw;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.categoryId === 'number'
  );
};

// 응답 → CompareCandidate[] 로 변환
export const toCandidates = (
  response: ListProductDefaultResponse | undefined,
): CompareCandidate[] => {
  if (!response) return [];

  // 배열/객체(list 속성) 케이스를 분리해 ESLint/TS가 이해하도록 변환
  const maybeListProp = (response as { list?: unknown }).list;
  const rawList: unknown[] = Array.isArray(response)
    ? (response as unknown[])
    : Array.isArray(maybeListProp)
      ? (maybeListProp as unknown[])
      : [];

  // 타입가드로 정제 후 매핑
  const contentList: ContentList[] = rawList.filter(toContentList);
  return contentList.map((product) => ({
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
  }));
};
