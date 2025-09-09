import { toNumber } from './formatters';

import type { ContentApi } from '@/shared/types/content';

/** 리뷰 많은 순 */
export const sortByReviewCountDescending = (a: ContentApi, b: ContentApi): number => {
  // 1) 리뷰 수 많은 순
  const reviewA = toNumber(a.reviewCount);
  const reviewB = toNumber(b.reviewCount);
  if (reviewB !== reviewA) return reviewB - reviewA;

  // 2) 리뷰 수가 같으면 → 별점 높은 순
  const ratingA = toNumber(a.rating);
  const ratingB = toNumber(b.rating);
  if (ratingB !== ratingA) return ratingB - ratingA;

  // 3) 별점도 같으면 → 생성일 최신 순
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  if (dateB !== dateA) return dateB - dateA;

  // 4) 그래도 같으면 → 이름 오름차순
  return a.name.localeCompare(b.name);
};

/** 별점 높은 순 */
export const sortByRatingDescending = (a: ContentApi, b: ContentApi): number => {
  // 1) 별점 높은 순
  const ratingA = toNumber(a.rating);
  const ratingB = toNumber(b.rating);
  if (ratingB !== ratingA) return ratingB - ratingA;

  // 2) 별점이 같으면 → 리뷰 수 많은 순
  const reviewA = toNumber(a.reviewCount);
  const reviewB = toNumber(b.reviewCount);
  if (reviewB !== reviewA) return reviewB - reviewA;

  // 3) 리뷰 수도 같으면 → 생성일 최신 순
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  if (dateB !== dateA) return dateB - dateA;

  // 4) 마지막으로 이름 오름차순
  return a.name.localeCompare(b.name);
};
