'use client';

import { useState } from 'react';

import { Chip } from '@/shared/components/chip';

/*
 * likeCount: number - 리뷰의 좋아요 수 (초기값으로 사용)
 * @param isLiked: boolean - 현재 사용자가 좋아요를 눌렀는지 여부 (초기값으로 사용)
 * @param showActions: boolean - 수정/삭제 버튼을 보여줄지 여부
 * @param createdAt: string - 리뷰 작성 날짜
 */
interface ReviewMetaProps {
  likeCount: number;
  isLiked: boolean;
  showActions: boolean;
  createdAt: string;
}

const ReviewMeta = ({ likeCount, isLiked, showActions, createdAt }: ReviewMetaProps) => {
  // 좋아요 상태와 좋아요 수를 관리
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = () => {
    setLocalIsLiked(!localIsLiked);

    // 좋아요 수 증감 로직
    if (localIsLiked) {
      setLocalLikeCount(localLikeCount - 1);
    } else {
      setLocalLikeCount(localLikeCount + 1);
    }
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='text-xs-regular flex items-center space-x-[15px] text-gray-600'>
        <span>{createdAt}</span>
        {showActions && (
          <div className='flex items-center space-x-[10px]'>
            <button className='text-gray-400 hover:text-gray-300'>수정</button>
            <button className='text-gray-400 hover:text-gray-300'>삭제</button>
          </div>
        )}
      </div>
      <div className='flex items-center'>
        <Chip variant='thumbs' isToggled={localIsLiked} clickable onClick={handleLikeClick}>
          {localLikeCount}
        </Chip>
      </div>
    </div>
  );
};

export default ReviewMeta;
