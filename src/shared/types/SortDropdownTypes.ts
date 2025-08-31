// 정렬 드롭다운에 쓰이는 타입 정의
export interface OrderOption<K extends string = string> {
  id: string; // 고유 식별자(쿼리 키 등)
  label: string; // UI 표시 텍스트
  value: K; // API에 그대로 넘길 값
}

export type ProductOrderKey = 'recent' | 'rating' | 'reviewCount';
export type ReviewOrderKey = 'recent' | 'ratingDesc' | 'ratingAsc' | 'likeCount';

/* --------------------------------- 상수값 --------------------------------- */
// 상품 목록 정렬 옵션
export const PRODUCT_ORDER_OPTIONS: OrderOption<ProductOrderKey>[] = [
  { id: 'recent', label: '최신순', value: 'recent' },
  { id: 'rating', label: '별점 높은순', value: 'rating' },
  { id: 'reviewCount', label: '리뷰 많은순', value: 'reviewCount' },
];

// 상품의 리뷰 정렬 옵션
export const REVIEW_ORDER_OPTIONS: OrderOption<ReviewOrderKey>[] = [
  { id: 'recent', label: '최신순', value: 'recent' },
  { id: 'ratingDesc', label: '별점 높은순', value: 'ratingDesc' },
  { id: 'ratingAsc', label: '별점 낮은순', value: 'ratingAsc' },
  { id: 'likeCount', label: '좋아요순', value: 'likeCount' },
];
