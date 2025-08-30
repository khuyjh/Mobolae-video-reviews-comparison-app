'use client';

import ReviewDescription from './reviewDescription';
import ReviewMeta from './reviewMeta';
import ReviewUser from './reviewUser';

/*
 * reviewContent: 리뷰 본문 내용
 * Images?: 리뷰에 첨부된 이미지 URL
 * likeCount: 리뷰 좋아요 수
 * isLiked: boolean: 좋아요
 * showActions: 리뷰 수정 및 삭제 버튼
 * createdAt: 리뷰 작성 날짜
 */
export interface ReviewCardProps {
  reviewContent: string;
  Images?: string[];
  likeCount: number;
  isLiked: boolean;
  showActions: boolean;
  createdAt: string;
  name: string;
  avatarSrc: string;
  rating: number;
}

const ReviewCard = ({
  reviewContent,
  Images,
  likeCount,
  isLiked,
  showActions,
  createdAt,
  name,
  avatarSrc,
  rating,
}: ReviewCardProps) => {
  return (
    <div className='bg-black-800 w-full rounded-[12px] p-5 xl:p-7.5'>
      <div className='flex flex-col md:flex-row md:gap-[30px] xl:gap-[80px]'>
        <div className='mb-[30px] flex-shrink-0'>
          <ReviewUser name={name} avatarSrc={avatarSrc} rating={rating} />
        </div>
        <div className='flex flex-1 flex-col'>
          <div className='mb-[20px]'>
            <ReviewDescription reviewContent={reviewContent} Images={Images} />
          </div>
          <div>
            <ReviewMeta
              likeCount={likeCount}
              isLiked={isLiked}
              showActions={showActions}
              createdAt={createdAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
