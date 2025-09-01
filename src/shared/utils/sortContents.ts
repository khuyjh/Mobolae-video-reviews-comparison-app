import { ProductOrderKey } from '../types/SortDropdownTypes';

import type { ContentApi } from '@/shared/types/content';

/**
 * 콘텐츠 리스트를 정렬하는 함수
 * - list: 정렬할 콘텐츠 배열
 * - order:  정렬 기준 ('rating' | 'reviewCount' | 'recent')
 */
const sortContents = (list: ContentApi[], order: ProductOrderKey): ContentApi[] => {
  // 원본 배열 훼손 방지를 위해 얕은 복사본 생성
  const copy = [...list];

  switch (order) {
    case 'rating':
      // [별점 높은 순] → [리뷰 수 많은 순] → [좋아요 수 많은 순]
      return copy.sort(
        (a, b) =>
          b.rating - a.rating || b.reviewCount - a.reviewCount || b.favoriteCount - a.favoriteCount,
      );

    case 'reviewCount':
      // [리뷰 수 많은 순] → [별점 높은 순] → [좋아요 수 많은 순]
      return copy.sort(
        (a, b) =>
          b.reviewCount - a.reviewCount || b.rating - a.rating || b.favoriteCount - a.favoriteCount,
      );

    case 'recent':
    default:
      // [최신 생성일 순] (createdAt 내림차순)
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export default sortContents;
