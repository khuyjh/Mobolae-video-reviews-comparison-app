import type { ContentApi } from '@/shared/types/content';

/**
 * 콘텐츠 리스트를 조건(category, keyword)에 맞게 필터링하는 함수
 *
 * - list - 전체 콘텐츠 배열
 * - options - 필터 옵션 (category: 카테고리 ID, keyword: 검색 키워드)
 * - 필터링된 콘텐츠 배열을 리턴
 */
export const filterContents = (
  list: ContentApi[],
  options: { category?: number | null; keyword?: string | null },
) => {
  const { category, keyword } = options;

  // 결과 배열을 가변적으로 조작하기 위해 복사
  let result = list;

  // 1. 카테고리 필터: category 값이 유효하면 해당 categoryId만 남김
  if (category && !Number.isNaN(category)) {
    result = result.filter((content) => content.categoryId === category);
  }

  // 2. 키워드 필터: keyword가 비어있지 않으면 name에 포함되는 항목만 남김
  if (keyword && keyword.trim()) {
    const query = keyword.trim().toLowerCase();
    result = result.filter((content) => content.name.toLowerCase().includes(query));
  }

  // 3. 최종 결과 반환
  return result;
};
