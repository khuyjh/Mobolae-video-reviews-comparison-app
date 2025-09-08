// 콘텐츠 리스트 유틸 함수 (비교하기 페이지, CompareSelect에서 사용)
// 콘텐츠 리스트 아이템 최소 타입
import type { ListProductDefaultResponse } from '../../../../openapi/queries/common';
import type { CompareCandidate } from '@/features/compare/types/compareTypes';

type ContentList = { id: number; name: string };

// 타입 가드: unknown 값을 안전하게 toContentList로 좁히는 타입가드
export const toContentList = (value: unknown): value is ContentList => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { id?: unknown; name?: unknown };
  return typeof candidate.id === 'number' && typeof candidate.name === 'string';
};

// 응답 → CompareCandidate[] 로 변환
export const toCandidates = (
  response: ListProductDefaultResponse | undefined,
): CompareCandidate[] => {
  if (!response) return [];

  const rawList: unknown = Array.isArray(response)
    ? response
    : (response as { list?: unknown }).list;
  if (!Array.isArray(rawList)) return [];

  const contentList = rawList.filter(toContentList);
  return contentList.map((product) => ({
    id: product.id,
    name: product.name,
  }));
};
