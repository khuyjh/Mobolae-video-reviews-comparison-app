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
  imageSrc: string;
  category: { id: number; name: string };
  title: string;
  description: string;
  isEditable: boolean;
}

const IMAGE_CONTAINER_STYLES =
  'relative aspect-[335/236] w-full bg-gray-300 md:h-[197px] md:w-[280px] xl:h-[250px] xl:w-[335px] rounded-[8px]';

const ProductCard = ({ imageSrc, category, title, description, isEditable }: ProductCardProps) => {
  const [isReviewAddModalOpen, setIsReviewAddModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isEditDeleteModalOpen, setIsEditDeleteModalOpen] = useState(false);

  // 임시로 rating 상태를 추가/ TODO: API 연결
  const [userRating, setUserRating] = useState<number>(4);

  // TODO: 실제 로그인 상태를 가져오는 훅으로 교체
  const isAuthenticated = true; // true: 로그인 / false: 비로그인

  const [compareModalType, setCompareModalType] = useState<CompareModalType | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const mockCompareItems = [1, 2]; // Mock 테스트: 비교 상품 [] 0개 / [1] 1개 [1,2] 2개
  const compareCount = mockCompareItems.length;

  const handleReviewButtonClick = () => {
    if (isAuthenticated) {
      setIsReviewAddModalOpen(true);
    } else {
      setIsRedirectModalOpen(true);
    }
  };

  const handleCompareClick = () => {
    if (compareCount === 0) setCompareModalType('added');
    else if (compareCount === 1) setCompareModalType('ready');
    else setCompareModalType('replaceSelect');
    setIsCompareModalOpen(true);
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
          <ProductHeader category={category} title={title} />
          {/* 설명 */}
          <ProductDescription description={description} className='mt-[20px]' />
          <ProductButtons
            isEditable={isEditable}
            className='mt-[40px] md:mt-[60px]'
            onReviewButtonClick={handleReviewButtonClick}
            onEditButtonClick={() => setIsEditDeleteModalOpen(true)}
            onCompareButtonClick={handleCompareClick}
          />
        </div>
      </div>

      {/* 리뷰 작성 */}
      <ReviewModal
        isOpen={isReviewAddModalOpen}
        onClose={() => setIsReviewAddModalOpen(false)}
        rating={userRating}
        mode='add'
      />

      {/* 로그인 화면 이동 모달 */}
      <RedirectModal isOpen={isRedirectModalOpen} onClose={() => setIsRedirectModalOpen(false)} />

      {/* 비교 모달  */}
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
