import { ContentItem } from '@/shared/types/content';

import ContentGrid from './ContentGrid';

/**
 * TopRated 컴포넌트 Props
 *
 * @property {ContentItem[]} items - 보여줄 콘텐츠 아이템 배열
 */
type TopRatedProps = {
  /** 보여줄 콘텐츠 아이템 배열 */
  items: ContentItem[];
};

/**
 * TopShowcase 컴포넌트
 *
 * - 상단에 "Top 6" 제목과 모바일 전용 카테고리 슬롯을 표시
 * - 전달받은 콘텐츠 아이템 배열을 ContentGrid를 통해 렌더링
 */
const TopRated = ({ items }: TopRatedProps) => {
  return (
    <section className='mb-[60px]'>
      <h2 className='text-xl-semibold mb-[30px] text-white'>
        별점 높은 콘텐츠 <span className='text-main'>TOP 6</span>
      </h2>
      <ContentGrid items={items} />
    </section>
  );
};

export default TopRated;
