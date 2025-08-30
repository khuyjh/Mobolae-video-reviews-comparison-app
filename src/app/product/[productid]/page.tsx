'use client';

import { useState } from 'react';

import { mockContents, mockReviewers } from '@/features/mainPage/mock/contents';
import ProductCard from '@/features/product/components/productCard/productCard';
import ReviewCard from '@/features/product/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/product/components/reviewSortDropdown';
import Statistics from '@/features/product/components/statisticsCard';

const MAIN_LAYOUT =
  'mx-auto px-[20px] pt-[30px] pb-[223px] md:max-w-[684px] md:px-[30px] md:pt-[40px] md:pb-[147px] xl:max-w-[940px] xl:pt-[60px] xl:pb-[120px]';

const SUBSECTION_GAP = 'flex flex-col gap-[30px]';

const SECTION_TITLE = 'text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white';

/* ----------------------------Mock/TODO: API 연결 후 삭제------------------------------------ */
const initialReviews = [
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
];

const ProductDetialsPage = () => {
  const productData = mockContents[0];
  const [reviews, setReviews] = useState(initialReviews);

  const handleLikeClick = (reviewId: number) => {
    /* UI 즉시 변경 */
    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id === reviewId) {
          const newIsLiked = !review.isLiked;
          return {
            ...review,
            isLiked: newIsLiked,
            likeCount: newIsLiked ? review.likeCount + 1 : review.likeCount - 1,
          };
        }
        return review;
      }),
    );
    // TODO: API 호출 로직 추가
  };

  /* 콘텐츠 상세 카드 */
  const productCardProps = {
    imageSrc: productData.contentImage,
    category: { id: 1, name: '오징어 게임' },
    title: productData.title,
    views: 5125,
    description:
      ' 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음.',
    isEditable: true,
  };
  /* 콘텐츠 통계 카드 */
  const statisticsProps = {
    favoriteCount: productData.favoriteCount,
    rating: productData.rating,
    reviewCount: productData.reviewCount,
    favoriteComparison: 20,
    ratingComparison: 0.5,
    reviewComparison: 15,
  };

  return (
    <main className={MAIN_LAYOUT}>
      <div className='flex flex-col gap-[60px] xl:gap-[80px]'>
        {/* 콘텐츠 상세 카드 */}
        <ProductCard {...productCardProps} />
        {/* 콘텐츠 통계 카드 */}
        <div className={SUBSECTION_GAP}>
          <div className={SECTION_TITLE}>콘텐츠 통계</div>
          <Statistics {...statisticsProps} />
        </div>

        {/* 콘텐츠 리뷰 + 정렬 드롭다운 */}
        <div className={SUBSECTION_GAP}>
          <div className='flex items-center justify-between'>
            <span className={SECTION_TITLE}>콘텐츠 리뷰</span>
            <ReviewSortDropdown />
          </div>

          {/* 콘텐츠 리뷰 목록*/}
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              {...review}
              onLikeClick={() => handleLikeClick(review.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductDetialsPage;
