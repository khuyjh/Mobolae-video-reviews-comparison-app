import type { Reviewer } from '@/shared/types/reviewer';

/**
 * 리뷰어 랭킹 정렬 함수
 * - followers → review → createdAt → name 기준
 */
export const sortReviewers = (a: Reviewer, b: Reviewer): number => {
  // 1) followers 많은 순
  if ((b.followers ?? 0) !== (a.followers ?? 0)) {
    return (b.followers ?? 0) - (a.followers ?? 0);
  }
  // 2) 리뷰 수 많은 순
  if ((b.review ?? 0) !== (a.review ?? 0)) {
    return (b.review ?? 0) - (a.review ?? 0);
  }
  // 3) 가입일 빠른 순
  if (a.createdAt && b.createdAt) {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (dateA !== dateB) return dateA - dateB;
  }
  // 4) 마지막: 이름 오름차순
  return a.name.localeCompare(b.name);
};
