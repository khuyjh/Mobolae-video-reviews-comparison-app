import { mockContents, mockReviewers } from '@/features/mainPage/mock/contents'; //TODO: Mock 삭제
import ProductCard from '@/features/product/components/productCard/productCard';
import ReviewCard from '@/features/product/components/reviewCard/reviewCard';
import ReviewSortDropdown from '@/features/product/components/reviewSortDropdown';
import Statistics from '@/features/product/components/statisticsCard';

/* ----------------------------Mock/TODO: API 연결 후 삭제------------------------------------ */
const ProductDetialsPage = () => {
  const productData = mockContents[0];
  const reviewerData = mockReviewers[0];
  const secondReviewerData = mockReviewers[1];

  /* 콘텐츠 상세 카드 */
  const productCardProps = {
    imageSrc: productData.contentImage,
    category: { id: 1, name: '오징어 게임' },
    title: productData.title,
    views: 125,
    description:
      '오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음.오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음. 오징어 게임 1은 재밌는데 2부터 뭔가 싶고 3은 재미없음.',
    isEditable: false,
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
  /* 첫 번째 리뷰 카드 데이터 */
  const reviewCardProps = {
    reviewContent: '정말 좋아요! 피부에 잘 맞아서 계속 사용하고 싶어요.',
    Images: [],
    likeCount: 5,
    isLiked: true,
    showActions: false,
    createdAt: '2025.08.30',
    name: reviewerData.name,
    avatarSrc: reviewerData.profileImageUrl,
    rating: 5,
  };

  /* 두 번째 리뷰 카드 데이터를 별도로 정의합니다. */
  const secondReviewCardData = {
    reviewContent: '기대했던 것보다 훨씬 좋네요! 재구매 의사 있습니다.',
    Images: [
      'https://picsum.photos/id/1020/400/300',
      'https://picsum.photos/id/1033/400/300',
      'https://picsum.photos/id/1033/400/300',
    ],
    likeCount: 3,
    isLiked: false,
    showActions: false,
    createdAt: '2025.08.29',
    name: secondReviewerData.name,
    avatarSrc: secondReviewerData.profileImageUrl,
    rating: 4,
  };

  /* 두 리뷰 데이터를 배열에 담습니다. */
  const DUMMY_REVIEWS = [reviewCardProps, secondReviewCardData];

  /* ---------------------------------------------------------------- */
  return (
    <main className='px-5 pt-27 md:pt-[250px] xl:pt-45'>
      <div className='flex flex-col gap-[30px] xl:gap-[80px]'>
        {/* ... 다른 컴포넌트들은 그대로 유지 ... */}
        <ProductCard {...productCardProps} />
        <div className='flex flex-col md:gap-[30px] xl:gap-[80px]'>
          <div className='text-lg-regular md:text-xl-regular xl:text-2xl-regular text-white'>
            통계
          </div>
          <Statistics {...statisticsProps} />
        </div>

        {/* 콘텐츠 리뷰 + 정렬 드롭다운 */}
        <div className='flex flex-col gap-[30px] xl:gap-[80px]'>
          <div className='flex items-center justify-between'>
            <span className='text-lg-regular md:text-xl-regular xl:text-2xl-regular text-white'>
              리뷰
            </span>
            <ReviewSortDropdown />
          </div>

          {/* DUMMY_REVIEWS 배열을 map()으로 렌더링합니다. */}
          {DUMMY_REVIEWS.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductDetialsPage;
