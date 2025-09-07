'use client';

import Image from 'next/image';

import React, { useState } from 'react';

import RedirectModal from '@/features/auth/components/RedirectModal';
import CompareModal, { CompareModalType } from '@/features/products/components/productModal';

import ProductButtons from './productButtons';
import ProductDescription from './productDescription';
import ProductHeader from './productHeader';
import EditDeleteModal from '../productModal/editDeleteModal';
import ReviewModal from '../productModal/reviewModal';

interface ProductCardProps {
  imageSrc: string; // 상품 이미지
  category: { id: number; name: string }; // 카테고리 정보
  title: string; // 상품명
  description: string; // 상품 설명
  isEditable: boolean; // 편집 가능 여부 (작성자 = 현재 사용자)
  productId: number; // 상품 ID (찜/리뷰 API에 필요)
  isFavorite: boolean; // SSR 초기 찜 여부
  favoriteCount?: number; // SSR 초기 찜 수
}

const IMAGE_CONTAINER_STYLES =
  'relative aspect-[335/236] w-full bg-gray-300 md:h-[197px] md:w-[280px] xl:h-[250px] xl:w-[335px] rounded-[8px]';

const ProductCard = ({
  imageSrc,
  category,
  title,
  description,
  isEditable,
  productId,
  isFavorite,
  favoriteCount = 0,
}: ProductCardProps) => {
  /** 모달 상태들 */
  const [isReviewAddModalOpen, setIsReviewAddModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false);

  const [userRating, setUserRating] = useState<number>(4); //TODO: 리뷰 작성 모달 API 연동 후 삭제

  // TODO: 실제 로그인 상태 체크 훅으로 교체
  const isAuthenticated = true;

  /** 비교 모달 상태 */
  const [compareModalType, setCompareModalType] = useState<CompareModalType | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // TODO: 추후 "비교 담기" 로직이 API로 연결되면 교체
  const mockCompareItems = [1, 2]; // 현재는 테스트용 mock
  const compareCount = mockCompareItems.length;

  /** 리뷰 작성 버튼 클릭 시 */
  const handleReviewButtonClick = () => {
    if (isAuthenticated) {
      setIsReviewAddModalOpen(true);
    } else {
      setIsRedirectModalOpen(true);
    }
  };

  /** 비교 버튼 클릭 시 */
  const handleCompareClick = () => {
    if (compareCount === 0) setCompareModalType('added');
    else if (compareCount === 1) setCompareModalType('ready');
    else setCompareModalType('replaceSelect');
    setIsCompareModalOpen(true);
  };

  /** 편집/삭제 버튼 클릭 */
  const handleEditDeleteClick = () => {
    setIsEditDeleteModalOpen(true);
    // TODO: 편집/삭제 API 연결
  };

  return (
    <>
      <div className='flex flex-col md:flex-row md:gap-5'>
        {/* 이미지 섹션 */}
        <div className={IMAGE_CONTAINER_STYLES}>
          <Image src={imageSrc} alt={title} fill className='object-cover' priority />
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
          />

          {/* 설명 */}
          <ProductDescription description={description} className='mt-[20px]' />

          {/* 버튼들 (리뷰 작성, 비교, 편집/삭제 등) */}
          <ProductButtons
            isEditable={isEditable}
            className='mt-[40px] md:mt-[60px]'
            onReviewButtonClick={handleReviewButtonClick}
            onEditButtonClick={() => setIsEditDeleteModalOpen(true)}
            onCompareButtonClick={handleCompareClick}
          />
        </div>
      </div>

      {/* 리뷰 작성 모달 */}
      <ReviewModal
        isOpen={isReviewAddModalOpen}
        onClose={() => setIsReviewAddModalOpen(false)}
        rating={userRating}
        mode='add'
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
        />
      )}

      {/* 편집/삭제 모달 */}
      <EditDeleteModal
        isOpen={isEditDeleteModalOpen}
        onClose={() => setIsEditDeleteModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
