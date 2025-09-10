'use client';

import Image from 'next/image';

import React, { useState } from 'react';

import RedirectModal from '@/features/auth/components/RedirectModal';
import { CompareCandidate } from '@/features/compare/types/compareTypes';
import CompareModal, { CompareModalType } from '@/features/products/components/productModal';
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
  const [imgSrc, setImgSrc] = useState(imageSrc || fallbackImg.src);

  const [isReviewAddModalOpen, setIsReviewAddModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false);

  // TODO: 실제 로그인 상태 체크 훅으로 교체
  const isAuthenticated = true;

  const [compareModalType, setCompareModalType] = useState<CompareModalType | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [compareTarget, setCompareTarget] = useState<CompareCandidate | null>(null);

  const handleReviewButtonClick = () => {
    if (isAuthenticated) {
      setIsReviewAddModalOpen(true);
    } else {
      setIsRedirectModalOpen(true);
    }
  };

  return (
    <>
      <div className='flex flex-col md:flex-row md:gap-5'>
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

        <div className='mt-5 flex flex-1 flex-col md:mt-0 md:py-0 xl:px-[40px]'>
          <ProductHeader
            category={category}
            title={title}
            productId={productId}
            isFavorite={isFavorite}
            favoriteCount={favoriteCount}
            onFavoriteChange={onFavoriteChange}
          />

          <ProductDescription description={description} className='mt-[20px]' />

          <ProductButtons
            isEditable={isEditable}
            className='mt-[40px] md:mt-[60px]'
            onReviewButtonClick={handleReviewButtonClick}
            onEditButtonClick={() => setIsEditDeleteModalOpen(true)}
            onCompareButtonClick={() =>
              handleCompareClick({
                productId,
                title,
                imageSrc,
                categoryId: category.id,
                setCompareTarget,
                setCompareModalType,
                setIsCompareModalOpen,
              })
            }
          />
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewAddModalOpen}
        onClose={() => setIsReviewAddModalOpen(false)}
        mode='add'
        productId={productId}
        productName={title}
        productCategory={category}
        rating={0}
      />

      <RedirectModal isOpen={isRedirectModalOpen} onClose={() => setIsRedirectModalOpen(false)} />

      {compareModalType && (
        <CompareModal
          type={compareModalType}
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          onChangeType={(type) => setCompareModalType(type)}
          product={compareTarget ?? undefined}
        />
      )}

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
