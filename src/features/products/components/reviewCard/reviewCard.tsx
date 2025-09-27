'use client';

import dynamic from 'next/dynamic';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

//import RedirectModal from '@/features/auth/components/RedirectModal';
import DeleteConfirmModal from '@/shared/components/deleteConfirmModal';
import { TEAM_ID } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import ReviewDescription from './reviewDescription';
import ReviewMeta from './reviewMeta';
import ReviewUser from './reviewUser';
import { useDeleteReview, useLikeReview, useUnlikeReview } from '../../../../../openapi/queries';
//import ReviewModal from '../productModal/reviewModal';

import type { Review } from '../../../../../openapi/requests';

const ReviewModal = dynamic(() => import('../productModal/reviewModal'), {
  loading: () => null,
  ssr: false,
});

const RedirectModal = dynamic(() => import('@/features/auth/components/RedirectModal'), {
  loading: () => null,
  ssr: false,
});

interface ReviewCardProps {
  review: Review;
  onLikeClick: (reviewId: number, isLiked: boolean) => Promise<void> | void;
  productName: string;
  productCategory: { id: number; name: string };
}

const ReviewCard = ({ review, onLikeClick, productName, productCategory }: ReviewCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);

  const { user, isLoggedIn } = useUserStore();
  const isMyReview = Boolean(
    isLoggedIn && user && Number(user.id) === Number(review.user?.id ?? review.userId),
  );

  /* Optimistic UI */
  const [localIsLiked, setLocalIsLiked] = useState(review.isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(review.likeCount);

  const likeReviewMut = useLikeReview();
  const unlikeReviewMut = useUnlikeReview();

  /*좋아요 클릭 핸들러 추가*/
  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      setIsRedirectModalOpen(true);
      return;
    }

    const prevIsLiked = localIsLiked;
    const prevCount = localLikeCount;

    /* 즉시 반영 */
    setLocalIsLiked(!localIsLiked);
    setLocalLikeCount(localIsLiked ? Math.max(0, localLikeCount - 1) : localLikeCount + 1);

    try {
      if (prevIsLiked) {
        await unlikeReviewMut.mutateAsync({
          path: { teamId: TEAM_ID!, reviewId: review.id },
        });
      } else {
        await likeReviewMut.mutateAsync({
          path: { teamId: TEAM_ID!, reviewId: review.id },
        });
      }
      queryClient.invalidateQueries({ queryKey: ['reviews', review.productId] });
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
    <div className='bg-black-800 border-black-700 w-full rounded-[12px] border p-5 xl:p-7.5'>
      <div className='flex flex-col md:flex-row md:gap-[30px] xl:gap-[80px]'>
        <div className='mb-[30px] flex-shrink-0'>
          <ReviewUser
            userId={Number(review.user?.id ?? review.userId)}
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
              showActions={isMyReview}
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
      {/* 리다이렉트 모달 */}
      <RedirectModal isOpen={isRedirectModalOpen} onClose={() => setIsRedirectModalOpen(false)} />
    </div>
  );
};

export default ReviewCard;
