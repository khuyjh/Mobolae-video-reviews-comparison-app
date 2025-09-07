'use client';

export type ReviewItem = {
  id: number;
  title: string;
  cursor?: number;
  image: string;
  favoriteCount: number;
  reviewCount: number;
  rating: number; // 1~5
};

export type PageResponse = {
  items: ReviewItem[];
  nextCursor: number | null; // 다음 페이지 시작 인덱스
};

/** 시드 고정 난수 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20250905);

const AVATAR = '/images/profileImg.jpg';
const TOTAL_ITEMS = 1000;

/** 개별 아이템 생성 */
function makeItem(id: number): ReviewItem {
  return {
    id,
    title: `아이템 ${id}`,
    image: AVATAR,
    favoriteCount: 50 + Math.floor(rng() * 9900),
    reviewCount: Math.floor(rng() * 500),
    rating: 1 + Math.floor(rng() * 5), // 1~5
  };
}

/** 전체 풀 */
const ALL_ITEMS: ReviewItem[] = Array.from({ length: TOTAL_ITEMS }, (_, i) => makeItem(i + 1));

/**
 * 무한스크롤 테스트용
 */
export async function fetchDummyPage({
  cursor = 0,
  limit = 12,
  delayMs = 300,
}: {
  cursor?: number;
  limit?: number;
  delayMs?: number;
}): Promise<PageResponse> {
  const start = Math.max(0, cursor);
  const end = Math.min(start + limit, ALL_ITEMS.length);

  if (delayMs > 0) {
    await new Promise((r) => setTimeout(r, delayMs));
  }

  return {
    items: ALL_ITEMS.slice(start, end),
    nextCursor: end < ALL_ITEMS.length ? end : null,
  };
}
