// src/features/mainPage/mock/mockContents.ts
'use client';

import { ContentApi, ContentItem, ContentListResponse } from '@/shared/types/content';
import { filterContents } from '@/shared/utils/filterContents';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import sortContents from '@/shared/utils/sortContents';

import type { ProductOrderKey } from '@/shared/types/SortDropdownTypes';

/** 재현 가능한 난수 생성기(시드 고정) */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20250902);

/** 카테고리 개수(실 서비스 CATEGORIES 길이와 맞추는 것을 권장) */
const CATEGORY_COUNT = 7;

/** 타이틀 풀 */
const TITLES_A = [
  '오징어 게임',
  '더 글로리',
  'DP',
  '킹덤',
  '스위트홈',
  '마이 네임',
  '나의 해방일지',
  '우영우',
  '미스터 션샤인',
  '시그널',
  '호텔 델루나',
  '비밀의 숲',
  '눈물의 여왕',
  '사랑의 불시착',
  '그 해 우리는',
  '미생',
  '청춘시대',
  '슬기로운 의사생활',
  '응답하라',
  '구르미 그린 달빛',
  '동백꽃 필 무렵',
  '괴물',
  '빈센조',
  '스타트업',
  '더 킹',
  '의사 요한',
  '로스쿨',
  '인사이더',
  '자백',
  '빅마우스',
  '수리남',
  '도깨비',
  '낭만닥터',
  '닥터 차정숙',
  '검사내전',
  '법쩐',
  '트레이서',
  '송곳',
  '머니게임',
  '라이프',
  '아무도 모른다',
  '메모리스트',
  '모범택시',
  '미남당',
  '너목들',
  '피노키오',
];
const TITLES_B = ['시즌1', '시즌2', '리부트', '스페셜', '디렉터스컷', '리마스터', '프로젝트'];
const TITLES_C = ['극장판', '확장판', '콜렉션', '파트1', '파트2', '파이널'];

/** 총 아이템 수 */
const TOTAL_ITEMS = 5000;

/** 생성 시각 분포(최신→과거) */
const now = Date.now();
const HOUR_GAP = 6;
const createdAtOf = (i: number) => new Date(now - i * HOUR_GAP * 60 * 60 * 1000).toISOString();

/** 점수/카운트 분포 */
const ratingOf = () => Number((2.5 + rng() * 2.5).toFixed(1)); // 2.5~5.0
const reviewCountOf = () => Math.floor(rng() * 4000); // 0~4000
const favoriteCountOf = () => 100 + Math.floor(rng() * 9900); // 100~10000

/** 제목 생성 */
const makeTitle = (id: number) => {
  const a = TITLES_A[id % TITLES_A.length];
  const r = rng();
  if (r < 0.33) return `${a} ${TITLES_B[id % TITLES_B.length]} #${id}`;
  if (r < 0.66) return `${a} ${TITLES_C[id % TITLES_C.length]} #${id}`;
  return `${a} #${id}`;
};

/** 단일 콘텐츠 생성 */
const makeContent = (
  id: number,
  name: string,
  categoryId: number,
  writerId: number,
  overrides?: Partial<ContentApi>,
): ContentApi => {
  const createdAt = createdAtOf(id);
  return {
    id,
    name,
    image: `https://picsum.photos/400/300`,
    favoriteCount: favoriteCountOf(),
    reviewCount: reviewCountOf(),
    rating: ratingOf(),
    categoryId,
    writerId,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
};

/** 원본 API 데이터(목) */
const baseContents: ContentApi[] = Array.from({ length: TOTAL_ITEMS }).map((_, idx) => {
  const id = idx + 1;
  return makeContent(
    id,
    makeTitle(id),
    (idx % CATEGORY_COUNT) + 1, // 1..CATEGORY_COUNT
    (idx % 27) + 1, // 1..27
  );
});

/** UI 변환본(카드용) */
export const mockContents: ContentItem[] = baseContents.map(toContentItem);

/**
 * 단순 커서 페이지네이션 응답
 * @param cursor 시작 인덱스
 * @param limit 개수
 */
export function getMockContentApiResponse(
  cursor: number | null = 0,
  limit = 12,
): ContentListResponse {
  const start = cursor ?? 0;
  const end = Math.min(start + limit, baseContents.length);
  return {
    list: baseContents.slice(start, end),
    nextCursor: end < baseContents.length ? end : null,
  };
}

/**
 * 서버 시뮬레이션: 필터 + 정렬 + 커서 (테스트 지연 포함)
 */
export async function serverListContents(params: {
  category: number | null;
  keyword: string;
  order: ProductOrderKey;
  cursor: number | null;
  limit: number;
}): Promise<ContentListResponse> {
  const { category, keyword, order, cursor, limit } = params;

  const filtered = filterContents(baseContents, { category, keyword });
  const sorted = sortContents(filtered, order);

  const start = cursor ?? 0;
  const end = Math.min(start + limit, sorted.length);

  // 테스트용 지연
  await new Promise((r) => setTimeout(r, 300));

  return {
    list: sorted.slice(start, end),
    nextCursor: end < sorted.length ? end : null,
  };
}

/** 샘플 초기 응답 */
export const mockContentApiResponse: ContentListResponse = getMockContentApiResponse(0, 50);

/** 리뷰어 목업 */
export const mockReviewers = Array.from({ length: 40 }).map((_, i) => ({
  userId: i + 1,
  name: `리뷰어#${i + 1}`,
  profileImageUrl: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
  followers: 300 + Math.floor(rng() * 5000),
  review: 30 + Math.floor(rng() * 1200),
  rating: Number((3 + rng() * 2).toFixed(1)),
}));
