'use client';

import ReviewDescription from './ReviewDescription';
import ReviewMeta from './ReviewMeta';
import ReviewUser from './ReviewUser';

/*
 * reviewContent: 리뷰 본문 내용
 * Images?: 리뷰에 첨부된 이미지 URL(임시)
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
}

const ReviewCard = ({
  reviewContent,
  Images,
  likeCount,
  isLiked,
  showActions,
  createdAt,
}: ReviewCardProps) => {
  return (
    <div className='bg-black-800 w-full rounded-[12px] p-5'>
      <div className='flex flex-col md:flex-row'>
        <div className='mb-[40px] flex-shrink-0'>
          <ReviewUser />
        </div>
        <div className='mb-[20px] flex flex-1 flex-col'>
          <ReviewDescription reviewContent={reviewContent} Images={Images} />
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
