// src/features/mainPage/mock/mockContents.ts
'use client';

import { ContentApi, ContentListResponse, ContentItem } from '@/shared/types/content';
import { filterContents } from '@/shared/utils/filterContents';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import sortContents from '@/shared/utils/sortContents';

import type { ProductOrderKey } from '@/shared/types/SortDropdownTypes';

/* ------------------------ 시드 고정 PRNG (재현 가능한 난수) ------------------------ */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20250902);

/* ------------------------------ 카테고리/타이틀 풀 ------------------------------ */
// 카테고리 개수(프로젝트의 CATEGORIES 개수와 맞추면 더 깔끔)
const CATEGORY_COUNT = 12;

// 베이스 타이틀(장르/수식어를 곱으로 늘려 5천개 커버)
const baseNamesA = [
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
const baseNamesB = ['시즌1', '시즌2', '리부트', '스페셜', '디렉터스컷', '리마스터', '프로젝트'];
const baseNamesC = ['극장판', '확장판', '콜렉션', '파트1', '파트2', '파이널'];

/* ------------------------------ 대량 생성 파라미터 ------------------------------ */
const TOTAL_ITEMS = 5000;

// 시간 분포(최신 ~ 과거로 자연스럽게)
const now = Date.now();
const hourGap = 6; // 항목 간 6h 간격
const createdAtOf = (i: number) => new Date(now - i * hourGap * 60 * 60 * 1000).toISOString();

// 평점/좋아요/리뷰수 분포(시드 난수 섞음)
const ratingOf = (i: number) => {
  // 2.5 ~ 5.0 범위
  const base = 2.5 + rng() * 2.5;
  return Number(base.toFixed(1));
};
const reviewCountOf = (i: number) => {
  // 0 ~ 4000
  return Math.floor(rng() * 4000);
};
const favoriteCountOf = (i: number) => {
  // 100 ~ 10000
  return 100 + Math.floor(rng() * 9900);
};

/* --------------------------------- 생성기 함수 --------------------------------- */
const makeTitle = (id: number) => {
  // 다양한 조합으로 제목 생성
  const a = baseNamesA[id % baseNamesA.length];
  const pick = rng();
  if (pick < 0.33) return `${a} ${baseNamesB[id % baseNamesB.length]} #${id}`;
  if (pick < 0.66) return `${a} ${baseNamesC[id % baseNamesC.length]} #${id}`;
  return `${a} #${id}`;
};

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
    image: `https://picsum.photos/seed/mobo/400/300`,
    favoriteCount: favoriteCountOf(id),
    reviewCount: reviewCountOf(id),
    rating: ratingOf(id),
    categoryId,
    writerId,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
};

/* ------------------------------- 원본 API 배열 ------------------------------- */
const baseContents: ContentApi[] = Array.from({ length: TOTAL_ITEMS }).map((_, idx) => {
  const id = idx + 1;
  const title = makeTitle(id);
  const categoryId = (idx % CATEGORY_COUNT) + 1; // 1 ~ CATEGORY_COUNT
  const writerId = (idx % 27) + 1; // 1 ~ 27
  return makeContent(id, title, categoryId, writerId);
});

/* --------------------------------- UI 변환본 --------------------------------- */
export const mockContents: ContentItem[] = baseContents.map(toContentItem);

/* ----------------------------- 커서 페이지네이션 ----------------------------- */
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

/* ------------------------------- 서버 시뮬레이션 ------------------------------ */
// 필터 + 정렬 + 커서 (테스트용 지연 포함)
export async function serverListContents(params: {
  category: number | null;
  keyword: string;
  order: ProductOrderKey;
  cursor: number | null;
  limit: number;
}): Promise<ContentListResponse> {
  const { category, keyword, order, cursor, limit } = params;

  // 1) 필터
  const filtered = filterContents(baseContents, { category, keyword });

  // 2) 정렬
  const sorted = sortContents(filtered, order);

  // 3) 커서 페이지네이션
  const start = cursor ?? 0;
  const end = Math.min(start + limit, sorted.length);
  const payload: ContentListResponse = {
    list: sorted.slice(start, end),
    nextCursor: end < sorted.length ? end : null,
  };

  // 4) 테스트 지연
  await new Promise((r) => setTimeout(r, 300));
  return payload;
}

/* ------------------------------ 초기 응답(샘플) ------------------------------ */
export const mockContentApiResponse: ContentListResponse = getMockContentApiResponse(0, 50);

/* -------------------------------- 리뷰어 목업 -------------------------------- */
export const mockReviewers = Array.from({ length: 40 }).map((_, i) => ({
  userId: i + 1,
  name: `리뷰어#${i + 1}`,
  profileImageUrl: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
  followers: 300 + Math.floor(rng() * 5000),
  review: 30 + Math.floor(rng() * 1200),
  rating: Number((3 + rng() * 2).toFixed(1)), // 3.0 ~ 5.0
}));
