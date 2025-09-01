/**
 * 카테고리 하이퍼링크 목적지를 생성하는 공용 함수
 *
 * 규칙:
 * - 같은 카테고리를 다시 누르면 category를 비움 (해제)
 * - 다른 카테고리를 누르면 category를 설정
 * - 목록 페이지 이동을 초기화하기 위해 cursor는 항상 제거
 */
export function buildCategoryHref(
  currentSearchParameters: URLSearchParams,
  nextCategoryId: number | null,
): string {
  const updatedSearchParameters = new URLSearchParams(currentSearchParameters);

  if (nextCategoryId === null) {
    updatedSearchParameters.delete('category');
  } else {
    updatedSearchParameters.set('category', String(nextCategoryId));
  }

  // 무한 스크롤, 페이지네이션 등을 초기화하기 위한 규칙
  updatedSearchParameters.delete('cursor');

  const fullQueryString = updatedSearchParameters.toString();
  return fullQueryString ? `?${fullQueryString}` : '?';
}
