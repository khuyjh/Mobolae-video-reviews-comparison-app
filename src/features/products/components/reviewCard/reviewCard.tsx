'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import DeleteConfirmModal from '@/shared/components/deleteConfirmModal';
import { TEAM_ID } from '@/shared/constants/constants';

import ReviewDescription from './reviewDescription';
import ReviewMeta from './reviewMeta';
import ReviewUser from './reviewUser';
import { useDeleteReview } from '../../../../../openapi/queries';
import ReviewModal from '../productModal/reviewModal';

import type { Review } from '../../../../../openapi/requests';

interface ReviewCardProps {
  review: Review;
  showActions: boolean;
  onLikeClick: (reviewId: number, isLiked: boolean) => Promise<void> | void;
  productName: string;
  productCategory: { id: number; name: string };
}

const ReviewCard = ({
  review,
  showActions,
  onLikeClick,
  productName,
  productCategory,
}: ReviewCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* Optimistic UI */
  const [localIsLiked, setLocalIsLiked] = useState(review.isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(review.likeCount);

  /*좋아요 클릭 핸들러 추가*/
  const handleLikeClick = async () => {
    const prevIsLiked = localIsLiked;
    const prevCount = localLikeCount;

    /* 즉시 반영 */
    if (localIsLiked) {
      setLocalIsLiked(false);
      setLocalLikeCount((c) => Math.max(0, c - 1));
    } else {
      setLocalIsLiked(true);
      setLocalLikeCount((c) => c + 1);
    }

    try {
      await onLikeClick(review.id, prevIsLiked);
    } catch (err) {
      setLocalIsLiked(prevIsLiked);
      setLocalLikeCount(prevCount);
      console.error('리뷰 좋아요 실패:', err);
    }
  };

  /* 리뷰 삭제 */
  const queryClient = useQueryClient();
  const deleteReviewMutation = useDeleteReview(undefined, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', review.productId] });
      setIsDeleteOpen(false);
    },
    onError: (err) => {
      console.error('리뷰 삭제 실패:', err);
      alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleDeleteConfirm = () => {
    deleteReviewMutation.mutate({
      path: { teamId: TEAM_ID!, reviewId: review.id },
    });
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
              likeCount={localLikeCount}
              isLiked={localIsLiked}
              showActions={showActions}
              createdAt={review.createdAt}
              onLikeClick={handleLikeClick}
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
        productId={review.productId}
        productName={productName}
        productCategory={productCategory}
        review={{
          id: review.id,
          content: review.content,
          rating: review.rating,
          images:
            review.reviewImages?.map((ri) => ({
              id: ri.id,
              url: ri.source,
            })) ?? [],
        }}
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
