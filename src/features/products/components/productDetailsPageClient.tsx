'use client';

import { useMemo } from 'react';

import ProductCard from '@/features/products/components/productCard/productCard';
import ReviewCard from '@/features/products/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/products/components/reviewSortDropdown';
import Statistics from '@/features/products/components/statisticsCard';
import { InfinityScroll } from '@/shared/components/infinityScroll';
import { TEAM_ID } from '@/shared/constants/constants';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

import {
  useListReviews,
  useLikeReview,
  useUnlikeReview,
} from '../../../../openapi/queries/queries';

import type { ProductDetailType, Review } from '../../../../openapi/requests/types.gen';

const MAIN_LAYOUT =
  'mx-auto px-[20px] pt-[30px] pb-[223px] md:max-w-[684px] md:px-[30px] md:pt-[40px] md:pb-[147px] xl:max-w-[940px] xl:pt-[60px] xl:pb-[120px]';

const SUBSECTION_GAP = 'flex flex-col gap-[30px]';
const SECTION_TITLE = 'text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white';

interface ProductDetailsPageClientProps {
  product: ProductDetailType;
}

/**
 * 콘텐츠 상세 페이지 클라이언트 컴포넌트
 *
 * SSR에서 받은 콘텐츠 기본 정보를 표시하고
 * CSR로 리뷰 목록과 인터랙션 기능을 처리.
 *
 * 주요 기능:
 * - 콘텐츠 정보 표시 (ProductCard, Statistics)
 * - 리뷰 목록 조회 및 무한 스크롤 (useListReviews)
 * - 리뷰 좋아요/취소 (useLikeReview, useUnlikeReview)
 */
export default function ProductDetailsPageClient({ product }: ProductDetailsPageClientProps) {
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

  const { data: reviewData } = useListReviews(
    { path: { teamId: TEAM_ID!, productId: product.id } },
    [],
    { enabled: !!TEAM_ID },
  );

  const reviews = useMemo(() => reviewData?.list ?? [], [reviewData]);

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
            favoriteComparison={20}
            ratingComparison={0.5}
            reviewComparison={15}
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
            renderItem={(review, index) => {
              const imageUrls = review.reviewImages?.map((ri) => ri.source) ?? [];

              return (
                <div
                  key={String(review.id)}
                  style={{ marginBottom: index === reviews.length - 1 ? 0 : itemSpacing }}
                >
                  <ReviewCard
                    reviewContent={review.content} // 리뷰 본문
                    Images={imageUrls}
                    likeCount={review.likeCount}
                    isLiked={review.isLiked}
                    showActions={true}
                    createdAt={review.createdAt}
                    name={review.user?.nickname ?? '익명'} // 서비스 탈퇴 시 익명 처리 (임시)
                    avatarSrc={review.user?.image ?? ''} // TODO: 기본 이미지 예정
                    rating={review.rating}
                    onLikeClick={() => onLikeClick(review.id, review.isLiked)}
                    data-index={index}
                  />
                </div>
              );
            }}
            hasNextPage={!!reviewData?.nextCursor}
            fetchNextPage={() => {
              /* TODO: 무한 스크롤 구현
               * 현재는 useListReviews가 단일 페이지만 지원
               * useListReviewsInfinite 훅 사용 시 이 부분 연결 예정
               */
            }}
            isLoading={false}
            itemHeightEstimate={itemHeightEstimate}
            scrollKey='product-reviews'
            maxItems={500}
          />
        </div>
      </div>
    </main>
  );
}
