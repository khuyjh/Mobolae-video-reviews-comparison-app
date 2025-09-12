'use client';

import { Chip } from '@/shared/components/chip';
import MobileBottomSheet from '@/shared/components/MobileBottomSheet';
import { SheetClose } from '@/shared/components/ui/sheet';
import { CATEGORIES } from '@/shared/constants/constants';
import { Category } from '@/shared/types/categoryTypes';

import ArrowList from './ArrowList';
import CategoryItem from './CategoryItem';
import { useCategoryParams } from '../hooks/useCategoryParams';
import { buildCategoryHref } from '../services/buildCategoryHref';

/**
 * MobileCategorySheet
 *
 * - 모바일 전용 카테고리 선택 시트
 * - 트리거 버튼: 현재 카테고리명 (없으면 "카테고리")
 * - 항목 클릭 시 buildCategoryHref로 링크 계산
 */
const MobileCategorySheet = () => {
  const { selectedId, searchParamsForLinks } = useCategoryParams();

  const label =
    CATEGORIES.find((category: Category) => Number(category.id) === selectedId)?.name ?? '카테고리';

  return (
    <MobileBottomSheet
      trigger={
        <Chip variant='filter' size='filter' clickable>
          {label}
        </Chip>
      }
      title='카테고리'
    >
      <ArrowList>
        {CATEGORIES.map((category: Category) => {
          const active = selectedId === Number(category.id);
          const href = buildCategoryHref(searchParamsForLinks, active ? null : Number(category.id));
          return (
            <SheetClose asChild key={category.id}>
              <CategoryItem
                category={category}
                isSelected={active}
                href={href}
                className='mb-2 last:mb-0'
              />
            </SheetClose>
          );
        })}
      </ArrowList>
    </MobileBottomSheet>
  );
};

export default MobileCategorySheet;
