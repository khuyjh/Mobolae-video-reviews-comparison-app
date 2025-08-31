'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { mockContents, mockReviewers } from '@/features/mainPage/mock/contents';
import ProductCard from '@/features/product/components/productCard/productCard';
import ReviewCard from '@/features/product/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/product/components/reviewSortDropdown';
import Statistics from '@/features/product/components/statisticsCard';
import { InfinityScroll } from '@/shared/components/infinityScroll';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

const MAIN_LAYOUT =
  'mx-auto px-[20px] pt-[30px] pb-[223px] md:max-w-[684px] md:px-[30px] md:pt-[40px] md:pb-[147px] xl:max-w-[940px] xl:pt-[60px] xl:pb-[120px]';

const SUBSECTION_GAP = 'flex flex-col gap-[30px]';

const SECTION_TITLE = 'text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white';

interface ReviewItem {
  id: string;
  reviewContent: string;
  Images: string[];
  likeCount: number;
  isLiked: boolean;
  showActions: boolean;
  createdAt: string;
  name: string;
  avatarSrc: string;
  rating: number;
}

interface ApiResponse {
  list: ReviewItem[];
  nextCursor?: number;
}

interface InfiniteQueryData {
  pages: ApiResponse[];
  pageParams: (number | undefined)[];
}
/*---------------------------Mock----------------------------------------- */
const mockApi = async ({ pageParam }: { pageParam?: number }): Promise<ApiResponse> => {
  const pageSize = 5;
  const start = pageParam ?? 0;
  const end = start + pageSize;
  const mockReviewData = Array.from({ length: 50 }, (_, i) => ({
    id: `review-${i}`,
    reviewContent:
      i % 2 === 0
        ? '짧은 리뷰 내용'
        : '이것은 매우 긴 리뷰 내용입니다. 이미지도 추가될 수 있어요.높이가 불규칙한 상황이 일어날 수 있습니다. 이 카드는 이미지의 유무와 텍스트가 몇 줄이냐에 따라 높이가 다 달라지거든요. 그래서 무한스크롤 구현하는데 빡셌어요.',
    Images: i % 3 === 0 ? ['https://picsum.photos/400/300'] : [],
    likeCount: Math.floor(Math.random() * 20),
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.30',
    name: mockReviewers[i % mockReviewers.length].name,
    avatarSrc: mockReviewers[i % mockReviewers.length].profileImageUrl,
    rating: Math.floor(Math.random() * 5) + 1,
  }));

  const data = mockReviewData.slice(start, end);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    list: data,
    nextCursor: end < mockReviewData.length ? end : undefined,
  };
};

const initialSSRData: ApiResponse = {
  list: Array.from({ length: 10 }, (_, i) => ({
    id: `review-${i}`,
    reviewContent: i % 2 === 0 ? '짧은 리뷰 내용' : '이것은 매우 긴 리뷰 내용입니다.',
    Images: i % 3 === 0 ? ['https://picsum.photos/400/300'] : [],
    likeCount: Math.floor(Math.random() * 20),
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.30',
    name: mockReviewers[i % mockReviewers.length].name,
    avatarSrc: mockReviewers[i % mockReviewers.length].profileImageUrl,
    rating: Math.floor(Math.random() * 5) + 1,
  })),
  nextCursor: 10,
};

/* -------------------------------------------------------- */

const ProductDetailsPage = () => {
  const productData = mockContents[0];

  const queryClient = useQueryClient();

  /* 무한 스크롤 쿼리 설정 */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['reviews'],
    queryFn: mockApi,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,

    initialData: {
      pages: [initialSSRData],
      pageParams: [initialSSRData.nextCursor],
    },
  });

  const allReviews = useMemo(() => data?.pages.flatMap((page) => page.list) ?? [], [data]);

  /* 반응형 화면 크기 감지 */
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');
  const isPC = useMediaQuery('(min-width: 1280px)');

  /* 화면 크기별 아이템 높이 설정 */
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

  /* 좋아요 클릭 핸들러 */
  const onLikeClick = (reviewId: string) => {
    console.log(`Liked review: ${reviewId}`);

    queryClient.setQueryData<InfiniteQueryData>(['reviews'], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          list: page.list.map((review) => {
            if (review.id === reviewId) {
              return {
                ...review,
                isLiked: !review.isLiked,
                likeCount: review.isLiked ? review.likeCount - 1 : review.likeCount + 1,
              };
            }
            return review;
          }),
        })),
      };
    });
  };

  return (
    <main className={MAIN_LAYOUT}>
      <div className='flex flex-col gap-[60px] xl:gap-[80px]'>
        {/* 상세 섹션*/}
        <ProductCard
          imageSrc={productData.contentImage}
          category={{ id: 1, name: '오징어 게임' }}
          title={productData.title}
          views={5125}
          description=' 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음.'
          isEditable={true}
        />

        {/* 통계 섹션 */}
        <section className={SUBSECTION_GAP}>
          <h2 className={SECTION_TITLE}>콘텐츠 통계</h2>
          <Statistics
            {...{
              favoriteCount: productData.favoriteCount,
              rating: productData.rating,
              reviewCount: productData.reviewCount,
              favoriteComparison: 20,
              ratingComparison: 0.5,
              reviewComparison: 15,
            }}
          />
        </section>

        {/* 리뷰 섹션 */}
        <div className={SUBSECTION_GAP}>
          <section className='flex items-center justify-between'>
            <h2 className={SECTION_TITLE}>콘텐츠 리뷰</h2>
            <ReviewSortDropdown />
          </section>

          {/* 무한 스크롤 리뷰 리스트 */}
          <InfinityScroll
            items={allReviews}
            renderItem={(review, index) => (
              <div key={review.id} style={{ marginBottom: `${itemSpacing}px` }}>
                <ReviewCard
                  {...review}
                  data-index={index}
                  onLikeClick={() => onLikeClick(review.id)}
                />
              </div>
            )}
            hasNextPage={hasNextPage ?? false}
            fetchNextPage={fetchNextPage}
            isLoading={isFetchingNextPage}
            itemHeightEstimate={itemHeightEstimate}
            itemSpacing={itemSpacing}
            scrollKey='product-reviews'
            maxItems={500}
            initialSSRItems={initialSSRData.list}
          />
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
