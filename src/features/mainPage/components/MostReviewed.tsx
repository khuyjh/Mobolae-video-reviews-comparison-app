import { ContentItem } from '@/shared/types/content';

import ContentGrid from './ContentGrid';

/**
 * MostReviewed 컴포넌트 Props
 *
 * @property {ContentItem[]} items - 보여줄 콘텐츠 아이템 배열
 */
type MostReviewedProps = {
  /** 보여줄 콘텐츠 아이템 배열 */
  items: ContentItem[];
};

/**
 * MostReviewed 컴포넌트
 * - "리뷰 많은 상품" 섹션을 표시
 * - 전달받은 콘텐츠 아이템 배열을 ContentGrid로 렌더링
 */
const MostReviewed = ({ items }: MostReviewedProps) => {
  return (
    <section className='mb-[60px]'>
      <div className='mb-[30px] flex justify-between'>
        <h2 className='text-xl-semibold text-white'>
          지금 핫한 콘텐츠 <span className='text-main'>TOP 6</span>
        </h2>
        <div id='mobile-category-slot' className='md:hidden' />
      </div>

      <ContentGrid items={items} />
    </section>
  );
};

export default MostReviewed;
