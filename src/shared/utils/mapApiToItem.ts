import { ContentApi, ContentItem } from '@/shared/types/content';

/**
 *  API 응답을 UI에서 쓰기 쉬운 형태로 바꾸는 함수
 *  ContentApi → ContentItem 변환
 */
export const toContentItem = (content: ContentApi): ContentItem => ({
  contentId: content.id,
  title: content.name,
  contentImage: content.image,
  favoriteCount: content.favoriteCount,
  reviewCount: content.reviewCount,
  rating: content.rating,
});
