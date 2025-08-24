'use client';

import ProductCard from '@/shared/components/card/productCard/productCard';

const TestPage = () => {
  const dummyData = {
    imageSrc:
      'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=904&hei=840&fmt=jpeg&qlt=90&.v=YnlWZDdpMFo0bUpJZnBpZjhKM2M3VGhTSEZFNjlmT2xUUDNBTjljV1BxWVk4UDMvOWNCVUEyZk1VN2FtQlpZWXZvdUZlR0V0VUdJSjBWaDVNVG95Yk15Y0c3T3Y4UWZwZExHUFdTUC9lN28',
    chipLabel: '노트북',
    title: 'MacBook Pro',
    views: 12345,
    description:
      '무시무시한 속도와 성능으로 무장한 M4. 일상 작업들을 쏜살같이 해치우고, 여러 앱과 영상 통화 화면을 자유자재로 오가며 멀티태스킹하고, 프로용 앱과 게임에 담긴 복잡한 콘텐츠들을 능수능란하게 다루고 즐길 수 있도록 해줍니다. 게다가 더 빨라진 Neural Engine이 각종 앱에 탑재된 AI 기능들에 날개를 달아주죠.',
    isEditable: true,
  };

  return (
    <div className='bg-gray-100 p-8'>
      <ProductCard {...dummyData} />
    </div>
  );
};

export default TestPage;
