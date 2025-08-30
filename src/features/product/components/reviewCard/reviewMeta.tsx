'use client';

import { useState } from 'react';

import { Chip } from '@/shared/components/chip';
import { formatDate } from '@/shared/utils/formatDate';

/*
 * likeCount: number - 리뷰의 좋아요 수
 * isLiked: boolean - 현재 사용자가 좋아요를 눌렀는지 여부
 * showActions: boolean - 수정/삭제 버튼을 보여줄지 여부
 * createdAt: string - 리뷰 작성 날짜
 * onLikeClick: () => void - 좋아요 버튼 클릭 시 부모에게 알리는 함수
 */
interface ReviewMetaProps {
  likeCount: number;
  isLiked: boolean;
  showActions: boolean;
  createdAt: string;
  onLikeClick: () => void;
}

const META_CONTAINER_STYLE = 'flex items-center justify-between';
const DATE_ACTIONS_WRAPPER_STYLE = 'flex items-center space-x-[15px] md:space-x-[20px]';
const DATE_STYLE = 'text-xs-regular xl:text-md-regular text-gray-600';
const ACTIONS_STYLE = 'text-xs-light xl:text-md-light flex items-center space-x-[10px]';
const ACTION_BUTTON_STYLE = 'text-gray-400 hover:text-gray-300';

const ReviewMeta = ({
  likeCount,
  isLiked,
  showActions,
  createdAt,
  onLikeClick,
}: ReviewMetaProps) => {
  return (
    <div className={META_CONTAINER_STYLE}>
      <div className={DATE_ACTIONS_WRAPPER_STYLE}>
        <span className={DATE_STYLE}>{formatDate(createdAt)}</span>
        {showActions && (
          <div className={ACTIONS_STYLE}>
            <button className={ACTION_BUTTON_STYLE} aria-label='리뷰 수정하기'>
              수정
            </button>
            <button className={ACTION_BUTTON_STYLE} aria-label='리뷰 삭제하기'>
              삭제
            </button>
          </div>
        )}
      </div>
      <Chip
        variant='thumbs'
        isToggled={isLiked}
        clickable
        onClick={onLikeClick}
        aria-label={`리뷰 좋아요 ${isLiked ? '취소' : '추가'}`}
        aria-pressed={isLiked}
      >
        {likeCount}
      </Chip>
    </div>
  );
};

export default ReviewMeta;
