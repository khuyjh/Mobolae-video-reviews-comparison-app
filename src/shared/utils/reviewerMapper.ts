import type { UserRanking } from '../../../openapi/requests';
import type { Reviewer } from '@/shared/types/reviewer';

export const mapUserRankingToReviewer = (item: UserRanking): Reviewer => ({
  userId: item.id,
  name: item.nickname,
  profileImageUrl: item.image ?? '',
  followers: item.followersCount,
  review: item.reviewCount,
});
