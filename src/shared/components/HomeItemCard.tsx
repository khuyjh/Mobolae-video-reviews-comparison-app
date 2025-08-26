//홈 페이지 아이템 카드 컴포넌트
import Image from 'next/image';
import Link from 'next/link';

import { Star } from 'lucide-react';
import React from 'react';

import SafeImage from '@/shared/components/SafeImage';

/* props 사용 설명입니다.
 * title: 콘텐츠 제목
 * contentImage: api상 이미지
 * favoriteCount: 찜 개수
 * reviewCount: 리뷰 개수
 * rating: 별점 개수
 * contentId: 콘텐츠 고유 id 번호
 */

interface HomeItemCardProps {
  title: string;
  contentImage: string;
  favoriteCount: number;
  reviewCount: number;
  rating: number;
  contentId: number;
}

// 카드 내부 스타일 정리
const CARD_BASE_STYLE =
  'block relative no-underline text-inherit cursor-pointer border border-black-700 bg-black-800 rounded-lg p-[10px] w-[160px] md:w-[247px] xl:w-[300px] h-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/60 transition hover:shadow-lg hover:border-gray-400';
const REVIEW_FAVORITE_TEXT_STYLE =
  'text-sm-regular md:text-md-regular xl:text-base-regular flex items-center gap-1 text-gray-600';
const STAR_CONTAINER_STYLE =
  'order-last flex shrink-0 basis-full items-center gap-1 md:order-none md:ml-auto md:basis-auto';

const HomeItemCard = ({
  title,
  contentImage,
  favoriteCount,
  reviewCount,
  rating,
  contentId,
}: HomeItemCardProps) => {
  return (
    // 가장 바깥 컨테이너 - width값을 가장 바깥인 부모 컨테이너에만 적용 고정값으로 처리하기로 함 Link 태그로 변경됨
    <Link href={`/product/${contentId}`} className={CARD_BASE_STYLE}>
      {/* 아이템 요소 컨테이너 */}
      <div className='flex w-full flex-col gap-[10px]'>
        {/* 이미지 컨테이너 - api 이미지 비율이 다를 경우 깨질 수 있어 고정 값 대신 해당 사항 적용 + 최소 너비 min-w 추가 */}
        <div className='relative aspect-[14/9] w-full min-w-[140px]'>
          <SafeImage src={contentImage} alt={title} fill className='object-cover' />
        </div>
        {/* 제목 및 값 섹션 */}
        <div className='w-full'>
          {/* 제목 - 너무 길어지면 truncate로 ...처리 */}
          <div>
            <h3 className='text-md-medium md:text-base-medium xl:text-lg-medium truncate text-white'>
              {title}
            </h3>
          </div>
          {/* 리뷰, 찜, 별점 컨테이너 */}
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 md:flex-nowrap md:gap-y-0'>
            {/* 리뷰 */}
            <div className={REVIEW_FAVORITE_TEXT_STYLE}>
              <span>리뷰</span>
              {/* 리뷰 개수 */}
              <span>{reviewCount}</span>
            </div>
            {/* 찜(favorite) */}
            <div className={REVIEW_FAVORITE_TEXT_STYLE}>
              <span>찜</span>
              {/* 찜 개수 */}
              <span>{favoriteCount}</span>
            </div>
            {/* 별점 컨테이너 - 모바일은 다음 줄로 이동, 태블릿 이상에선 오른쪽 정렬*/}
            <div className={STAR_CONTAINER_STYLE}>
              {/* 별 아이콘 lucide 사용 */}
              <Star className='aria-hidden="true" h-auto w-[12px] fill-yellow-400 stroke-yellow-400 md:w-[15px] xl:w-[16px]' />
              {/* 별점 */}
              <span className='text-sm-regular md:text-md-regular xl:text-base-regular text-gray-400'>
                {rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomeItemCard;
