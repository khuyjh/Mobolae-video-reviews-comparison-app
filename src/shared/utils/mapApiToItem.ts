// src/features/content/utils/mapApiToItem.ts
import { ContentApi, ContentItem } from '@/shared/types/content';

export const toContentItem = (content: ContentApi): ContentItem => ({
  contentId: content.id,
  title: content.name,
  contentImage: content.image,
  favoriteCount: content.favoriteCount,
  reviewCount: content.reviewCount,
  rating: content.rating,
});
