'use client';

import Script from 'next/script';

import { ChartColumn, MessageSquareText } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

import ProductCard from '@/features/products/components/productCard/productCard';
import ReviewCard from '@/features/products/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/products/components/reviewSortDropdown';
import Statistics from '@/features/products/components/statisticsCard';
import { TEAM_ID } from '@/shared/constants/constants';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import { cn } from '@/shared/lib/cn';
import { useUserStore } from '@/shared/stores/userStore';

import { VirtualizedInfinityScroll } from './virtualizedInfinityScroll';
import { useInfiniteApi } from '../../../../openapi/queries/infiniteQueries';
import { useLikeReview, useUnlikeReview } from '../../../../openapi/queries/queries';

import type {
  ProductDetailType,
  Review,
  ListReviewsResponse,
} from '../../../../openapi/requests/types.gen';

const MAIN_LAYOUT =
  'mx-auto px-[20px] pt-[30px] pb-[158px] md:max-w-[684px] md:px-[30px] md:pt-[40px] md:pb-[147px] xl:max-w-[940px] xl:pt-[60px] xl:pb-[120px]';

const SUBSECTION_GAP = 'flex flex-col gap-[30px]';
const SECTION_TITLE = 'text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white';

interface ProductDetailsPageClientProps {
  product: ProductDetailType;
  initialReviews: Record<'recent' | 'ratingDesc' | 'ratingAsc' | 'likeCount', ListReviewsResponse>;
}

export default function ProductDetailsPageClient({
  product,
  initialReviews,
}: ProductDetailsPageClientProps) {
  useEffect(() => {
    // 브라우저 스크롤 복원 비활성화
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 페이지 로드 시 최상단으로
    window.scrollTo(0, 0);
  }, []);

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

  type SortType = 'recent' | 'ratingDesc' | 'ratingAsc' | 'likeCount';

  /* 정렬 상태 관리 */
  const [sortValue, setSortValue] = useState<SortType>('recent');

  const [localFavoriteCount, setLocalFavoriteCount] = useState(product.favoriteCount);
  const [localIsFavorite, setLocalIsFavorite] = useState(product.isFavorite);

  const { user } = useUserStore();

  const isEditable = user?.id === product.writerId;

  /*  CSR 무한스크롤 훅 (SSR 첫 페이지 주입) */
  const {
    data: reviewData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteApi<Review>(
    ['reviews', product.id, sortValue],
    '/{teamId}/products/{productId}/reviews',
    {
      path: { teamId: TEAM_ID!, productId: product.id },
      query: { order: sortValue },
    },
    initialReviews[sortValue], // SSR 첫 페이지
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

  const handleFavoriteChange = (newIsFavorite: boolean) => {
    setLocalIsFavorite(newIsFavorite);
    setLocalFavoriteCount((prev) => (newIsFavorite ? prev + 1 : Math.max(0, prev - 1)));
  };

  return (
    <main className={MAIN_LAYOUT}>
      <Script src='https://developers.kakao.com/sdk/js/kakao.js' strategy='afterInteractive' />

      <div className='flex flex-col gap-[60px] xl:gap-[80px]'>
        {/* 상세 섹션 */}
        <ProductCard
          imageSrc={product.image}
          category={{ id: product.category.id, name: product.category.name }}
          title={product.name}
          description={product.description}
          isEditable={isEditable}
          productId={product.id}
          isFavorite={localIsFavorite}
          onFavoriteChange={handleFavoriteChange}
        />

        {/* 통계 섹션 */}
        <section className={SUBSECTION_GAP}>
          <h2 className={cn(SECTION_TITLE, 'flex items-center gap-x-2')}>
            <ChartColumn className='size-4 md:size-5 xl:size-6' />
            <span>콘텐츠 통계</span>
          </h2>
          <Statistics
            favoriteCount={localFavoriteCount}
            rating={product.rating}
            reviewCount={product.reviewCount}
            favoriteComparison={
              product.categoryMetric
                ? localFavoriteCount - product.categoryMetric.favoriteCount
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
            <h2 className={cn(SECTION_TITLE, 'flex items-center gap-x-2')}>
              <MessageSquareText className='size-4 md:size-5 xl:size-6' />
              <span>콘텐츠 리뷰</span>
            </h2>
            <ReviewSortDropdown value={sortValue} onChange={setSortValue} />
          </section>

          {/* 리뷰가 없을 때 안내 문구 */}
          {reviews.length === 0 ? (
            <p className='text-xl-regular py-20 text-center text-gray-400'>
              첫 리뷰를 작성해보세요!
            </p>
          ) : (
            <VirtualizedInfinityScroll<Review>
              items={reviews}
              renderItem={(review, index) => (
                <div
                  style={{
                    marginBottom: index === reviews.length - 1 ? 0 : itemSpacing,
                  }}
                >
                  <ReviewCard
                    review={review}
                    onLikeClick={onLikeClick}
                    productName={product.name}
                    productCategory={product.category}
                  />
                </div>
              )}
              hasNextPage={!!hasNextPage}
              fetchNextPage={fetchNextPage}
              isLoading={isFetchingNextPage}
              itemHeightEstimate={itemHeightEstimate}
              maxItems={500}
              overscan={5}
              loadingText='loading...'
              loadMoreText=''
            />
          )}
        </div>
      </div>
    </main>
  );
}
