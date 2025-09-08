'use client';

import { useMemo } from 'react';

import ProductCard from '@/features/products/components/productCard/productCard';
import ReviewCard from '@/features/products/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/products/components/reviewSortDropdown';
import Statistics from '@/features/products/components/statisticsCard';
import { InfinityScroll } from '@/shared/components/infinityScroll';
import { TEAM_ID } from '@/shared/constants/constants';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

import { useInfiniteApi } from '../../../../openapi/queries/infiniteQueries';
import { useLikeReview, useUnlikeReview } from '../../../../openapi/queries/queries';

import type {
  ProductDetailType,
  Review,
  ListReviewsResponse,
} from '../../../../openapi/requests/types.gen';

const MAIN_LAYOUT =
  'mx-auto px-[20px] pt-[30px] pb-[223px] md:max-w-[684px] md:px-[30px] md:pt-[40px] md:pb-[147px] xl:max-w-[940px] xl:pt-[60px] xl:pb-[120px]';

const SUBSECTION_GAP = 'flex flex-col gap-[30px]';
const SECTION_TITLE = 'text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white';

interface ProductDetailsPageClientProps {
  product: ProductDetailType;
  initialReviews: ListReviewsResponse;
}

export default function ProductDetailsPageClient({
  product,
  initialReviews,
}: ProductDetailsPageClientProps) {
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');
  const isPC = useMediaQuery('(min-width: 1280px)');

  let itemHeightEstimate;
  let itemSpacing;

  if (isPC) {
    itemHeightEstimate = 225;
    itemSpacing = 20;
  } else if (isTablet) {
    itemHeightEstimate = 175;
    itemSpacing = 15;
  } else {
    itemHeightEstimate = 250;
    itemSpacing = 15;
  }

  /*  CSR 무한스크롤 훅 (SSR 첫 페이지 주입) */
  const {
    data: reviewData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteApi<Review>(
    ['reviews', product.id],
    '/{teamId}/products/{productId}/reviews',
    {
      path: { teamId: TEAM_ID!, productId: product.id },
      query: { order: 'recent' },
    },
    initialReviews, // SSR 첫 페이지
  );

  const reviews = useMemo(() => reviewData?.items ?? [], [reviewData]);

  /* 좋아요 | 좋아요 취소 mutation 훅 */
  const likeMutation = useLikeReview();
  const unlikeMutation = useUnlikeReview();

  const onLikeClick = (reviewId: number, isLiked: boolean) => {
    if (isLiked) {
      unlikeMutation.mutate({ path: { teamId: TEAM_ID!, reviewId } });
    } else {
      likeMutation.mutate({ path: { teamId: TEAM_ID!, reviewId } });
    }
  };

  return (
    <main className={MAIN_LAYOUT}>
      <div className='flex flex-col gap-[60px] xl:gap-[80px]'>
        {/* 상세 섹션 */}
        <ProductCard
          imageSrc={product.image}
          category={{ id: product.category.id, name: product.category.name }}
          title={product.name}
          description={product.description}
          isEditable={true}
          productId={product.id}
          isFavorite={product.isFavorite}
        />

        {/* 통계 섹션 */}
        <section className={SUBSECTION_GAP}>
          <h2 className={SECTION_TITLE}>콘텐츠 통계</h2>
          <Statistics
            favoriteCount={product.favoriteCount}
            rating={product.rating}
            reviewCount={product.reviewCount}
            favoriteComparison={
              product.categoryMetric
                ? product.favoriteCount - product.categoryMetric.favoriteCount
                : null
            }
            ratingComparison={
              product.categoryMetric ? product.rating - product.categoryMetric.rating : null
            }
            reviewComparison={
              product.categoryMetric
                ? product.reviewCount - product.categoryMetric.reviewCount
                : null
            }
          />
        </section>

        {/* 리뷰 섹션 */}
        <div className={SUBSECTION_GAP}>
          <section className='flex items-center justify-between'>
            <h2 className={SECTION_TITLE}>콘텐츠 리뷰</h2>
            <ReviewSortDropdown />
          </section>

          {/* 무한 스크롤 리뷰 리스트 */}
          <InfinityScroll<Review>
            items={reviews}
            renderItem={(review, index) => (
              <div
                key={String(review.id)}
                style={{ marginBottom: index === reviews.length - 1 ? 0 : itemSpacing }}
              >
                <ReviewCard
                  review={review}
                  showActions={true}
                  data-index={index}
                  onLikeClick={onLikeClick}
                />
              </div>
            )}
            hasNextPage={!!hasNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isFetchingNextPage}
            itemHeightEstimate={itemHeightEstimate}
            scrollKey='product-reviews'
            maxItems={500}
          />
        </div>
      </div>
    </main>
  );
}
