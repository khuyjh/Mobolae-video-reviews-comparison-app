import ReviewCard from '@/features/product/ReviewCard';
import ReviewDescription from '@/features/product/ReviewDescription';
import ReviewMeta from '@/features/product/ReviewMeta';

// 더미 데이터 정의
const dummyReviewWithImage = {
  reviewContent:
    '음질이 정말 좋습니다. 앱 연동으로 설정 모드를 바꿀 수 있어 좋네요. 서라운드와 베이스가 모두 훌륭합니다.',
  reviewImages: ['', ''],
  viewCount: 132,
  likeCount: 57,
  isLiked: true,
  showActions: true,
  createdAt: '2024-01-29',
};

const dummyReviewWithoutImage = {
  reviewContent:
    '노이즈 캔슬링 기능이 정말 뛰어나요. 1000XM2보다 더 발전한 느낌입니다. 착용감도 편안하고 만족스러워요.',
  viewCount: 7,
  likeCount: 2,
  isLiked: false,
  showActions: false,
  createdAt: '2024-01-28',
};

// 임시 헤더 컴포넌트
const TempHeader = () => (
  <div className='flex items-center space-x-2'>
    <div className='h-10 w-10 rounded-full bg-gray-600'></div>
    <div className='flex flex-col'>
      <span className='text-base font-semibold'>더미 닉네임</span>
      <span className='text-sm'>⭐️⭐️⭐️⭐️⭐️</span>
    </div>
  </div>
);

const ReviewPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center bg-gray-950 p-6'>
      <h1 className='mb-8 text-3xl font-bold text-white'>리뷰 카드 컴포넌트 테스트</h1>
      <div className='w-full max-w-4xl space-y-6'>
        <ReviewCard {...dummyReviewWithImage} header={<TempHeader />} />
        <ReviewCard {...dummyReviewWithoutImage} header={<TempHeader />} />
      </div>
    </div>
  );
};

export default ReviewPage;
