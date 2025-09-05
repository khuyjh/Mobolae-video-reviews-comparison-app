'use client';

import { useState } from 'react';

import DeleteConfirmModal from '@/shared/components/deleteConfirmModal';

import ReviewDescription from './reviewDescription';
import ReviewMeta from './reviewMeta';
import ReviewUser from './reviewUser';
import ReviewModal from '../productModal/reviewModal';

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
  onLikeClick: () => void;
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
  onLikeClick,
}: ReviewCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* Mock 리뷰 데이터 */
  const review = {
    id: 1,
    content: reviewContent,
    rating,
    images: Images?.map((url, idx) => ({ id: idx + 1, url })) || [],
  };

  const handleDeleteConfirm = () => {
    console.log('삭제 API 호출');
    setIsDeleteOpen(false);
  };

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
        rating={rating}
        review={review}
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
