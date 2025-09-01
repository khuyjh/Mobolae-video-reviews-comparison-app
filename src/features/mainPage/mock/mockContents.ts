import { ContentApi, ContentListResponse, ContentItem } from '@/shared/types/content';
import { toContentItem } from '@/shared/utils/mapApiToItem';

// 샘플 생성기 (seed 이미지 + 날짜 분포)
const makeContent = (
  id: number,
  name: string,
  favoriteCount: number,
  reviewCount: number,
  rating: number,
  categoryId: number,
  writerId: number,
): ContentApi => {
  const now = Date.now();
  const createdAt = new Date(now - id * 24 * 60 * 60 * 1000).toISOString(); // id일 전
  return {
    id,
    name,
    image: `https://picsum.photos/seed/content_${id}/400/300`,
    favoriteCount,
    reviewCount,
    rating,
    categoryId,
    writerId,
    createdAt,
    updatedAt: createdAt,
  };
};

// 샘플 타이틀 (50개)
const titles = [
  '오징어 게임',
  '더 글로리',
  'DP 시즌2',
  '킹덤',
  '스위트홈',
  '마이 네임',
  '나의 해방일지',
  '이상한 변호사 우영우',
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
  '응답하라 1988',
  '구르미 그린 달빛',
  '동백꽃 필 무렵',
  '비밀의 숲2',
  '악의 마음을 읽는 자들',
  '괴물',
  '빈센조',
  '스타트업',
  '더 킹: 영원의 군주',
  '의사 요한',
  '로스쿨',
  '인사이더',
  '자백',
  '빅마우스',
  '수리남',
  '도깨비',
  '낭만닥터 김사부',
  '닥터 차정숙',
  '검사내전',
  '법쩐',
  '트레이서',
  '송곳',
  '머니게임',
  '라이프',
  '비밀의 남자',
  '아무도 모른다',
  '메모리스트',
  '모범택시',
  '미남당',
  '너의 목소리가 들려',
  '피노키오',
];

// API 타입 배열 (categoryId: 1~7)
const baseContents: ContentApi[] = titles.map((title, idx) => {
  const id = idx + 1;
  return makeContent(
    id,
    title,
    1000 + Math.floor(Math.random() * 7000), // favoriteCount
    500 + Math.floor(Math.random() * 5000), // reviewCount
    Number((3 + Math.random() * 2).toFixed(1)), // rating 3.0~5.0
    (idx % 7) + 1, // 1~7 (CATEGORIES와 일치)
    (idx % 10) + 1, // writerId 1~10
  );
});

//  페이지/카드용(UI) 배열
export const mockContents: ContentItem[] = baseContents.map(toContentItem);

//  API 응답 모사
export const mockContentApiResponse: ContentListResponse = {
  nextCursor: null,
  list: baseContents,
};

// (옵션) 리뷰어 목데이터
export const mockReviewers = [
  {
    userId: 1,
    name: '무비덕',
    profileImageUrl: 'https://i.pravatar.cc/40?img=1',
    followers: 1520,
    review: 340,
    rating: 4.8,
  },
  {
    userId: 2,
    name: '더라마요정',
    profileImageUrl: 'https://i.pravatar.cc/40?img=2',
    followers: 980,
    review: 210,
    rating: 4.6,
  },
  {
    userId: 3,
    name: '시네필',
    profileImageUrl: 'https://i.pravatar.cc/40?img=3',
    followers: 1870,
    review: 420,
    rating: 4.9,
  },
  {
    userId: 4,
    name: '빙의장인',
    profileImageUrl: 'https://i.pravatar.cc/40?img=4',
    followers: 740,
    review: 180,
    rating: 4.3,
  },
  {
    userId: 5,
    name: '감성장전',
    profileImageUrl: 'https://i.pravatar.cc/40?img=5',
    followers: 1230,
    review: 260,
    rating: 4.5,
  },
];
