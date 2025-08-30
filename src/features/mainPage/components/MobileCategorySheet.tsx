'use client';

import { useSearchParams } from 'next/navigation';

import React from 'react';

import CategoryItem from '@/features/mainPage/components/CategoryItem';
import { Chip } from '@/shared/components/chip';
import MobileBottomSheet from '@/shared/components/MobileBottomSheet';
import { SheetClose } from '@/shared/components/ui/sheet';
import { Category } from '@/shared/types/CategoryTypes';

import ArrowList from './ArrowList';
import { buildCategoryHref } from '../services/buildCategoryHref';

interface MobileCategorySheetProps {
  /** 카테고리 목록 */
  categories: Category[];
  /** 현재 선택된 카테고리 값 */
  selectedCategory: string | null;
}

/**
 * 모바일 전용 카테고리 선택 시트
 *
 * - 트리거 버튼: 필터 아이콘 + 선택된 카테고리 이름(없으면 "카테고리")
 * - 시트 안에서 카테고리 목록 표시
 * - 항목 클릭 시 해당 카테고리 선택/해제 후 시트 닫힘
 */
const MobileCategorySheet: React.FC<MobileCategorySheetProps> = ({
  categories,
  selectedCategory,
}) => {
  // 현재 URLSearchParams를 가져와 복제 (불변성 유지)
  const searchParamsFromHook = useSearchParams();
  const currentSearchParams = new URLSearchParams(searchParamsFromHook.toString());

  // 현재 선택된 카테고리의 label (없으면 "카테고리")
  const selectedCategoryLabel =
    categories.find((category) => category.value === selectedCategory)?.name ?? '카테고리';

  return (
    <MobileBottomSheet
      trigger={
        <Chip
          variant='filter'
          size='filter'
          clickable
          role='button'
          aria-label='카테고리 바텀시트 열기'
        >
          {selectedCategory ? selectedCategoryLabel : '카테고리'}
        </Chip>
      }
      title='카테고리'
    >
      <ArrowList>
        <ul className='space-y-2' role='list'>
          {categories.map((category: Category) => {
            const isSelected = selectedCategory === category.value;
            const nextCategoryValue = isSelected ? null : category.value;
            //새로운 쿼리스트링 생성
            const categoryHref = buildCategoryHref(currentSearchParams, nextCategoryValue);

            return (
              <li key={category.id}>
                <SheetClose asChild>
                  <CategoryItem category={category} isSelected={isSelected} href={categoryHref} />
                </SheetClose>
              </li>
            );
          })}
        </ul>
      </ArrowList>
    </MobileBottomSheet>
  );
};

export default MobileCategorySheet;
