'use client';

import { ReactNode } from 'react';

import ReviewDescription from './ReviewDescription';
import ReviewMeta from './ReviewMeta';

export interface ReviewCardProps {
  header: ReactNode; // 헤더 컴포넌트를 children으로 받습니다.
  reviewContent: string;
  reviewImages?: string[];
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  showActions: boolean;
  createdAt: string;
}

const ReviewCard = ({
  header,
  reviewContent,
  reviewImages,
  viewCount,
  likeCount,
  isLiked,
  showActions,
  createdAt,
}: ReviewCardProps) => {
  return (
    <div className='w-full max-w-4xl rounded-lg border border-gray-700 bg-gray-900 p-4 text-white'>
      <div className='flex flex-col md:flex-row'>
        {/* 헤더 자리 (팀원 컴포넌트) */}
        <div className='mb-4 md:mr-6 md:mb-0'>{header}</div>

        {/* 메인 & 푸터 영역 */}
        <div className='flex flex-1 flex-col'>
          <ReviewDescription reviewContent={reviewContent} reviewImages={reviewImages} />
          <div className='mt-4'>
            <ReviewMeta
              viewCount={viewCount}
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
