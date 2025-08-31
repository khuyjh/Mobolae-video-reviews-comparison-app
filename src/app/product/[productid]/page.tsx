'use client';

import { Fragment } from 'react';

import { mockContents, mockReviewers } from '@/features/mainPage/mock/contents';
import ProductCard from '@/features/product/components/productCard/productCard';
import ReviewCard from '@/features/product/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/product/components/reviewSortDropdown';
import Statistics from '@/features/product/components/statisticsCard';
import { useInfiniteList } from '@/shared/hooks/useInfiniteList';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

const MAIN_LAYOUT =
  'mx-auto px-[20px] pt-[30px] pb-[223px] md:max-w-[684px] md:px-[30px] md:pt-[40px] md:pb-[147px] xl:max-w-[940px] xl:pt-[60px] xl:pb-[120px]';
const SUBSECTION_GAP = 'flex flex-col gap-[30px]';
const SECTION_TITLE = 'text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white';

interface Review {
  id: number;
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

const allMockReviews: Review[] = [
  // ... (Mock 데이터 배열)
  {
    id: 1,
    reviewContent:
      '영화리뷰 남기는 설명칸영화리뷰 남기는 설명칸영화리뷰 남기는 설명칸영화리뷰 남기는 설명칸영화리뷰 남기는 설명칸인데.',
    Images: [],
    likeCount: 5,
    isLiked: true,
    showActions: false,
    createdAt: '2025.08.30',
    name: mockReviewers[0].name,
    avatarSrc: mockReviewers[0].profileImageUrl,
    rating: 5,
  },
  {
    id: 2,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 3,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 4,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 5,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 6,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 7,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 8,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 9,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
  {
    id: 10,
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: ['https://picsum.photos/id/1020/400/300', 'https://picsum.photos/id/1033/400/300'],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: mockReviewers[1].name,
    avatarSrc: mockReviewers[1].profileImageUrl,
    rating: 4,
  },
];
const PAGE_SIZE = 3;

const fetchMockReviews = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<{ list: Review[]; nextCursor: number | null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = pageParam;
      const endIndex = pageParam + PAGE_SIZE;
      const list = allMockReviews.slice(startIndex, endIndex);
      const nextCursor = list.length === PAGE_SIZE ? endIndex : null;
      resolve({ list, nextCursor });
    }, 500);
  });
};

const ProductDetailsPage = () => {
  const productData = mockContents[0];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, isLoading, error } =
    useInfiniteList<Review>({
      queryKey: ['mockReviews'],
      queryFn: fetchMockReviews,
      initialPageParam: 0,
    });

  const loadMoreRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleLikeClick = (reviewId: number) => {
    // 좋아요 기능은 API가 필요합니다.
  };

  /* ProductCard에 전달할 props를 명시적으로 정의 */
  const productCardProps = {
    imageSrc: productData.contentImage,
    category: { id: 1, name: '오징어 게임' }, // Mock 카테고리
    title: productData.title,
    views: 5125, // Mock 조회수
    description:
      '오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음.',
    isEditable: true,
  };

  /* Statistics에 전달할 props를 명시적으로 정의 */
  const statisticsProps = {
    favoriteCount: productData.favoriteCount,
    rating: productData.rating,
    reviewCount: productData.reviewCount,
    favoriteComparison: 20, // Mock 비교 값
    ratingComparison: 0.5, // Mock 비교 값
    reviewComparison: 15, // Mock 비교 값
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error.message}</div>;

  const isEmpty = data?.pages.every((page) => page.list.length === 0);
  if (isEmpty) {
    return (
      <main className={MAIN_LAYOUT}>
        <div className='flex flex-col gap-[60px] xl:gap-[80px]'>
          <ProductCard {...productCardProps} />
          <div className={SUBSECTION_GAP}>
            <div className={SECTION_TITLE}>콘텐츠 통계</div>
            <Statistics {...statisticsProps} />
          </div>
          <div className={SUBSECTION_GAP}>
            <div className='flex items-center justify-between'>
              <span className={SECTION_TITLE}>콘텐츠 리뷰</span>
              <ReviewSortDropdown />
            </div>
            <div>데이터가 없습니다.</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={MAIN_LAYOUT}>
      <div className='flex flex-col gap-[60px] xl:gap-[80px]'>
        <ProductCard {...productCardProps} />
        <div className={SUBSECTION_GAP}>
          <div className={SECTION_TITLE}>콘텐츠 통계</div>
          <Statistics {...statisticsProps} />
        </div>

        <div className={SUBSECTION_GAP}>
          <div className='flex items-center justify-between'>
            <span className={SECTION_TITLE}>콘텐츠 리뷰</span>
            <ReviewSortDropdown />
          </div>

          {data?.pages.map((page) => (
            <Fragment key={page.list[0]?.id}>
              {page.list.map((review) => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  onLikeClick={() => handleLikeClick(review.id)}
                />
              ))}
            </Fragment>
          ))}

          <div ref={loadMoreRef} style={{ height: '10px' }}>
            {isFetchingNextPage && <div>추가 데이터 로딩 중...</div>}
          </div>

          {!hasNextPage && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>마지막 페이지입니다.</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
