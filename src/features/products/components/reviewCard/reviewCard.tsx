'use client';

import { useState } from 'react';

import DeleteConfirmModal from '@/shared/components/deleteConfirmModal';

import ReviewDescription from './reviewDescription';
import ReviewMeta from './reviewMeta';
import ReviewUser from './reviewUser';
import ReviewModal from '../productModal/reviewModal';

import type { Review } from '../../../../../openapi/requests';

interface ReviewCardProps {
  review: Review;
  showActions: boolean;
  onLikeClick: () => void;
}

const ReviewCard = ({ review, showActions, onLikeClick }: ReviewCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteConfirm = () => {
    console.log(`삭제 API 호출: reviewId=${review.id}`);
    setIsDeleteOpen(false);
  };

  return (
    <div className='bg-black-800 w-full rounded-[12px] p-5 xl:p-7.5'>
      <div className='flex flex-col md:flex-row md:gap-[30px] xl:gap-[80px]'>
        <div className='mb-[30px] flex-shrink-0'>
          <ReviewUser
            name={review.user.nickname}
            avatarSrc={review.user.image ?? ''}
            rating={review.rating}
          />
        </div>
        <div className='flex flex-1 flex-col'>
          <div className='mb-[20px]'>
            <ReviewDescription
              reviewContent={review.content}
              Images={review.reviewImages?.map((ri) => ri.source)}
            />
          </div>
          <div>
            <ReviewMeta
              likeCount={review.likeCount}
              isLiked={review.isLiked}
              showActions={showActions}
              createdAt={review.createdAt}
              onLikeClick={onLikeClick}
              onEditClick={() => setIsEditOpen(true)}
              onDeleteClick={() => setIsDeleteOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* 수정 모달 */}
      <ReviewModal
        mode='edit'
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        rating={review.rating}
        // review={review}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ReviewCard;
