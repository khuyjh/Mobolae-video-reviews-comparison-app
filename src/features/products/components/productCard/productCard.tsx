'use client';

import Image from 'next/image';

import React, { useState } from 'react';

import RedirectModal from '@/features/auth/components/RedirectModal';
import { CompareCandidate } from '@/features/compare/types/compareTypes';
import CompareModal, { CompareModalType } from '@/features/products/components/productModal';
import { useUserStore } from '@/shared/stores/userStore';
import { handleCompareClick } from '@/shared/utils/compareModalUtils';

import ProductButtons from './productButtons';
import ProductDescription from './productDescription';
import ProductHeader from './productHeader';
import fallbackImg from '../../../../../public/images/FallbackImg.png';
import EditDeleteModal from '../productModal/editDeleteModal';
import ReviewModal from '../productModal/reviewModal';

interface ProductCardProps {
  imageSrc: string;
  category: { id: number; name: string };
  title: string;
  description: string;
  isEditable: boolean;
  productId: number;
  isFavorite: boolean;
  favoriteCount?: number;
  onFavoriteChange?: (newIsFavorite: boolean) => void;
}

const IMAGE_CONTAINER_STYLES =
  'relative aspect-[335/236] w-full bg-black-900 md:h-[197px] md:w-[280px] xl:h-[250px] xl:w-[335px] rounded-[8px]';

const ProductCard = ({
  imageSrc,
  category,
  title,
  description,
  isEditable,
  productId,
  isFavorite,
  favoriteCount = 0,
  onFavoriteChange,
}: ProductCardProps) => {
  /* fallback 이미지 상태 */
  const [imgSrc, setImgSrc] = useState(imageSrc || fallbackImg.src);

  /** 모달 상태들 */
  const [isReviewAddModalOpen, setIsReviewAddModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false);

  const { isLoggedIn } = useUserStore();

  /** 비교 모달 상태 */
  const [compareModalType, setCompareModalType] = useState<CompareModalType | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  /* 현재 비교 대상 product */
  const [compareTarget, setCompareTarget] = useState<CompareCandidate | null>(null);

  /** 리뷰 작성 버튼 클릭 시 */
  const handleReviewButtonClick = () => {
    if (isLoggedIn) {
      setIsReviewAddModalOpen(true);
    } else {
      setIsRedirectModalOpen(true);
    }
  };

  /** 비교하기 버튼 클릭 시 */
  const handleCompareButtonClick = () => {
    if (isLoggedIn) {
      handleCompareClick({
        productId,
        title,
        categoryId: category.id,
        setCompareTarget,
        setCompareModalType,
        setIsCompareModalOpen,
      });
    } else {
      setIsRedirectModalOpen(true);
    }
  };

  return (
    <>
      <div className='flex flex-col md:flex-row md:gap-5'>
        {/* 이미지 섹션 */}
        <div className={IMAGE_CONTAINER_STYLES}>
          <Image
            src={imgSrc}
            alt={title}
            fill
            className='object-cover'
            priority
            onError={() => setImgSrc(fallbackImg.src)}
          />
        </div>
        {/* 콘텐츠 섹션 */}
        <div className='mt-5 flex flex-1 flex-col md:mt-0 md:py-0 xl:px-[40px]'>
          {/* 상단 헤더 (카테고리, 제목, 찜) */}
          <ProductHeader
            category={category}
            title={title}
            productId={productId}
            isFavorite={isFavorite}
            favoriteCount={favoriteCount}
            onFavoriteChange={onFavoriteChange}
          />
          {/* 설명 */}
          <ProductDescription description={description} className='mt-[20px]' />
          {/* 버튼들 (리뷰 작성, 비교, 편집/삭제 등) */}
          <ProductButtons
            isEditable={isEditable}
            className='mt-[40px] md:mt-[60px]'
            onReviewButtonClick={handleReviewButtonClick}
            onEditButtonClick={() => setIsEditDeleteModalOpen(true)}
            onCompareButtonClick={handleCompareButtonClick}
          />
        </div>
      </div>
      {/* 리뷰 작성 모달 */}
      <ReviewModal
        isOpen={isReviewAddModalOpen}
        onClose={() => setIsReviewAddModalOpen(false)}
        mode='add'
        productId={productId}
        productName={title}
        productCategory={category}
        rating={0}
      />
      {/* 비로그인 사용자 리다이렉트 모달 */}
      <RedirectModal isOpen={isRedirectModalOpen} onClose={() => setIsRedirectModalOpen(false)} />
      {/* 비교 모달 */}
      {compareModalType && (
        <CompareModal
          type={compareModalType}
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          onChangeType={(type) => setCompareModalType(type)}
          product={compareTarget ?? undefined}
        />
      )}
      {/* 편집/삭제 모달 */}
      <EditDeleteModal
        isOpen={isEditDeleteModalOpen}
        onClose={() => setIsEditDeleteModalOpen(false)}
        productId={productId}
        name={title}
        category={category}
        description={description}
        imageUrl={imageSrc}
      />
    </>
  );
};

export default ProductCard;
