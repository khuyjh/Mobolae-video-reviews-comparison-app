'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';

import { TEAM_ID } from '@/shared/constants/constants';
import { cn } from '@/shared/lib/cn';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

import { useFavorite, useUnfavorite } from '../../../../../openapi/queries/queries';
import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';
import { Chip } from '../../../../shared/components/chip';

const ICON_BUTTON_STYLES = 'bg-black-800 cursor-pointer rounded-[6px] p-[5px]';
const ICON_SIZE = 'h-6 w-6 xl:h-7 xl:w-7';

interface ProductHeaderProps {
  category: { id: number; name: string };
  title: string;
  productId: number; // ✅ API 호출에 필요
  isFavorite: boolean; // ✅ SSR 초기 찜 여부
  favoriteCount?: number; // ✅ SSR 초기 찜 수 (옵션)
}

const ProductHeader = ({
  category,
  title,
  productId,
  isFavorite,
  favoriteCount = 0,
}: ProductHeaderProps) => {
  // ✅ 초기 상태: SSR에서 받은 값
  const [isLiked, setIsLiked] = useState<boolean>(isFavorite);
  const [localFavoriteCount, setLocalFavoriteCount] = useState<number>(favoriteCount);

  const favoriteMut = useFavorite();
  const unfavoriteMut = useUnfavorite();
  const queryClient = useQueryClient();

  const handleLikeClick = () => {
    const prevIsLiked = isLiked;
    const prevCount = localFavoriteCount;

    if (isLiked) {
      // 찜 취소
      setIsLiked(false);
      setLocalFavoriteCount((c) => Math.max(0, c - 1));

      unfavoriteMut.mutate(
        { path: { teamId: TEAM_ID!, productId } },
        {
          onError: () => {
            // 실패 시 롤백
            setIsLiked(prevIsLiked);
            setLocalFavoriteCount(prevCount);
          },
          onSettled: () => {
            // ✅ React Query v5 방식 (객체로 queryKey 전달)
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            queryClient.invalidateQueries({ queryKey: ['productList'] });
            queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
          },
        },
      );
    } else {
      // 찜 추가
      setIsLiked(true);
      setLocalFavoriteCount((c) => c + 1);

      favoriteMut.mutate(
        { path: { teamId: TEAM_ID!, productId } },
        {
          onError: () => {
            setIsLiked(prevIsLiked);
            setLocalFavoriteCount(prevCount);
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['product', productId] });
            queryClient.invalidateQueries({ queryKey: ['productList'] });
            queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
          },
        },
      );
    }
  };

  const heartIconColor = isLiked ? 'text-red' : 'text-gray-600';

  return (
    <div className='flex w-full flex-col'>
      {/* 모바일 -> 칩 + 공유버튼 | 태블릿/PC -> 칩 */}
      <div className='flex w-full items-center justify-between md:block'>
        <Chip {...toCategoryChip(category)} />
        <div className='flex gap-[10px] md:hidden'>
          <button className={ICON_BUTTON_STYLES} aria-label='카카오톡으로 공유하기'>
            <KakaotalkIcon className={ICON_SIZE} />
          </button>
          <button className={ICON_BUTTON_STYLES} aria-label='링크 복사 및 공유하기'>
            <ShareIcon className={ICON_SIZE} />
          </button>
        </div>
      </div>

      {/* 모바일 -> 제목+찜 | 태블릿/PC -> 제목+찜+공유버튼 */}
      <div className='mt-[10px] flex w-full items-center justify-between'>
        <div className='flex w-full items-center justify-between md:w-auto md:justify-start md:gap-[15px]'>
          <h2 className='text-xl-semibold xl:text-2xl-semibold text-white'>{title}</h2>

          {/* 찜 버튼 + 찜 수 */}
          <div className='flex items-center gap-2'>
            <button
              onClick={handleLikeClick}
              className='flex-shrink-0 cursor-pointer'
              aria-label={isLiked ? '찜하기 취소' : '찜하기'}
              aria-pressed={isLiked}
            >
              <Heart className={cn(ICON_SIZE, heartIconColor)} fill={isLiked ? 'red' : 'none'} />
            </button>
            <span className='text-sm text-gray-400'>{localFavoriteCount}</span>
          </div>
        </div>

        {/* 태블릿/PC 공유 버튼 */}
        <div className='hidden md:flex md:gap-[10px]'>
          <button className={ICON_BUTTON_STYLES} aria-label='카카오톡으로 공유하기'>
            <KakaotalkIcon className={ICON_SIZE} />
          </button>
          <button className={ICON_BUTTON_STYLES} aria-label='링크 복사 및 공유하기'>
            <ShareIcon className={ICON_SIZE} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
