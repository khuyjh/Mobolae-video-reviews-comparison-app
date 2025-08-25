'use client';

import { ShapesIcon } from 'lucide-react';
import React from 'react';

import CategoryItem from '@/features/mainPage/components/CategoryItem';
import { Chip } from '@/shared/components/chip';
import MobileBottomSheet from '@/shared/components/MobileBottomSheet';
import { SheetClose } from '@/shared/components/ui/sheet';
import { Category } from '@/shared/types/CategoryTypes';

interface MobileCategorySheetProps {
  /** 카테고리 목록 */
  categories: Category[];
  /** 현재 선택된 카테고리 값 */
  selectedCategory: string | null;
  /** 카테고리 선택/해제 시 실행되는 콜백 */
  onCategorySelect: (value: string | null) => void;
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
  onCategorySelect,
}) => {
  // 현재 선택된 카테고리 라벨(없으면 "카테고리")
  const selectedLabel =
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
          className='border-black-700 bg-black-900 text-md-regular hover:bg-black-800 gap-2 border text-white'
        >
          <ShapesIcon className='size-[18px] text-gray-400' />
          <span className={selectedCategory ? 'text-gray-400' : 'text-gray-600'}>
            {selectedCategory ? selectedLabel : '카테고리'}
          </span>
        </Chip>
      }
      title='카테고리'
    >
      <ul className='space-y-2' role='list'>
        {categories.map((category: Category) => {
          const active = selectedCategory === category.value;
          const next = active ? null : category.value;

          return (
            <li key={category.id}>
              <SheetClose asChild>
                <div aria-current={active ? 'true' : undefined}>
                  <CategoryItem
                    category={category}
                    isSelected={active}
                    onClick={() => onCategorySelect(next)}
                  />
                </div>
              </SheetClose>
            </li>
          );
        })}
      </ul>
    </MobileBottomSheet>
  );
};

export default MobileCategorySheet;
