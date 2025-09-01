// src/shared/types/content.ts
export type Order = 'recent' | 'rating' | 'reviewCount';

//  API 응답 타입 (Swagger 스펙)
export type ContentApi = {
  id: number;
  name: string;
  image: string;
  rating: number; // 0~5
  reviewCount: number; // 정수
  favoriteCount: number; // 정수
  categoryId: number;
  writerId: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type ContentListResponse = {
  nextCursor: number | null;
  list: ContentApi[];
};

// UI 전용 타입 (그리드/카드가 보는 모델)
export interface ContentItem {
  contentId: number;
  title: string;
  contentImage: string;
  favoriteCount: number;
  reviewCount: number;
  rating: number;
}
