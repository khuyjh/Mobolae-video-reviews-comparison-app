'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { PATH_OPTION } from '@/shared/constants/constants';
import { cn } from '@/shared/lib/cn';
import { shareToKakao } from '@/shared/lib/kakaoShare';
import { useUserStore } from '@/shared/stores/userStore';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

import { useFavorite, useUnfavorite } from '../../../../../openapi/queries/queries';
import KakaotalkIcon from '../../../../../public/icons/kakaotalk.svg';
import ShareIcon from '../../../../../public/icons/share.svg';
import { Chip } from '../../../../shared/components/chip';

const ICON_BUTTON_STYLES =
  'cursor-pointer rounded-[6px] p-[5px] hover:scale-105 hover:brightness-125';
const ICON_STYLE = 'h-[14px] w-[14px] xl:h-[18px] xl:w-[18px] text-black';
const HEART_ICON_STYLE = 'h-6 w-6 xl:h-7 xl:w-7 hover:scale-105 hover:brightness-125';

interface ProductHeaderProps {
  category: { id: number; name: string };
  title: string;
  productId: number;
  isFavorite: boolean;
  favoriteCount?: number;
  onFavoriteChange?: (newIsFavorite: boolean) => void;
  onRequireLogin?: () => void;
}

const ProductHeader = ({
  category,
  title,
  productId,
  isFavorite,
  favoriteCount = 0,
  onFavoriteChange,
  onRequireLogin,
}: ProductHeaderProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(isFavorite);
  const [localFavoriteCount, setLocalFavoriteCount] = useState<number>(favoriteCount);

  useEffect(() => {
    setIsLiked(isFavorite);
    setLocalFavoriteCount(favoriteCount);
  }, [isFavorite, favoriteCount]);

  const favoriteMut = useFavorite();
  const unfavoriteMut = useUnfavorite();
  const queryClient = useQueryClient();

  const { isLoggedIn } = useUserStore();

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }

    const prevIsLiked = isLiked;
    const prevCount = localFavoriteCount;

    if (isLiked) {
      /* 찜 취소 */
      setIsLiked(false);
      setLocalFavoriteCount((c) => Math.max(0, c - 1));
      onFavoriteChange?.(false);

      unfavoriteMut.mutate(
        { ...PATH_OPTION, path: { ...PATH_OPTION.path, productId } },
        {
          onError: () => {
            /* 실패 시 롤백 */
            setIsLiked(prevIsLiked);
            setLocalFavoriteCount(prevCount);
            onFavoriteChange?.(prevIsLiked);
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['product', productId] }); // 특정 콘텐츠 상세 정보 갱신
            queryClient.invalidateQueries({ queryKey: ['productList'] }); // 콘텐츠 목록 화면 갱신
            queryClient.invalidateQueries({ queryKey: ['productReviews', productId] }); // 리뷰 리스트 화면 갱신
          },
        },
      );
    } else {
      // 찜 추가
      setIsLiked(true);
      setLocalFavoriteCount((c) => c + 1);
      onFavoriteChange?.(true);

      favoriteMut.mutate(
        { ...PATH_OPTION, path: { ...PATH_OPTION.path, productId } },
        {
          onError: () => {
            setIsLiked(prevIsLiked);
            setLocalFavoriteCount(prevCount);
            onFavoriteChange?.(prevIsLiked);
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

  const handleKakaoShare = () => {
    try {
      shareToKakao({
        title,
        description: '콘텐츠를 확인해보세요',
        imageUrl: `${window.location.origin}/default-thumbnail.png`,
        url: `${window.location.origin}/products/${productId}`,
      });
    } catch (err) {
      console.error('카카오톡 공유 실패:', err);
      toast.warning('카카오톡 공유가 원활하지 않아 페이지로 돌아왔습니다.', {
        toastId: 'kakao_share_error',
      });
      window.location.href = `${window.location.origin}/products/${productId}`;
    }
  };

  /* 클립보드 복사 */
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/products/${productId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('클립보드에 복사되었습니다.', { toastId: 'copy_link_success' });
    } catch (err) {
      console.error('링크 복사 실패:', err);
      toast.error('클립보드 복사에 실패했습니다.', { toastId: 'copy_link_error' });
    }
  };

  const heartIconColor = isLiked ? 'text-red' : 'text-gray-600';

  return (
    <div className='flex w-full flex-col'>
      {/* 모바일 -> 칩 + 공유버튼 | 태블릿/PC -> 칩 */}
      <div className='flex w-full items-center justify-between md:block'>
        <Chip {...toCategoryChip(category)} />
        <div className='flex gap-[10px] md:hidden'>
          <button
            onClick={handleKakaoShare}
            className={cn(ICON_BUTTON_STYLES, 'bg-[#f8f004]')}
            aria-label='카카오톡으로 공유하기'
          >
            <KakaotalkIcon className={ICON_STYLE} />
          </button>

          <button
            onClick={handleCopyLink}
            className={cn(ICON_BUTTON_STYLES, 'bg-main')}
            aria-label='클립보드 복사'
          >
            <ShareIcon className={ICON_STYLE} />
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
              <Heart
                className={cn(HEART_ICON_STYLE, heartIconColor)}
                fill={isLiked ? 'red' : 'none'}
              />
            </button>
          </div>
        </div>

        {/* 태블릿/PC 공유 버튼 */}
        <div className='hidden md:flex md:gap-[10px]'>
          {/* 카카오톡 공유 버튼 */}
          <button
            onClick={handleKakaoShare}
            className={cn(ICON_BUTTON_STYLES, 'bg-[#f8f004]')}
            aria-label='카카오톡으로 공유하기'
          >
            <KakaotalkIcon className={ICON_STYLE} />
          </button>
          {/* 클립보드 복사/공유 버튼 */}
          <button
            onClick={handleCopyLink}
            className={cn(ICON_BUTTON_STYLES, 'bg-main')}
            aria-label='클립보드 복사'
          >
            <ShareIcon className={ICON_STYLE} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
