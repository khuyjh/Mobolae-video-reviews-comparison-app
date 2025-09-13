'use client';

import { CATEGORIES } from '@/shared/constants/constants';
import { Category } from '@/shared/types/categoryTypes';

import ArrowList from './ArrowList';
import CategoryItem from './CategoryItem';
import { useCategoryParams } from '../hooks/useCategoryParams';
import { buildCategoryHref } from '../services/buildCategoryHref';

/**
 * CategorySidebar
 *
 * - md 이상에서만 표시되는 카테고리 메뉴
 * - 선택된 상태를 URL에서 파생해 강조 처리
 * - buildCategoryHref를 사용해 링크 계산 (cursor, order 초기화 포함)
 * - sticky 적용으로 스크롤 내려도 따라옴
 */
const CategorySidebar = () => {
  const { selectedId, searchParamsForLinks } = useCategoryParams();

  return (
    <aside className='bg-black-900 sticky top-28 mr-5 h-fit max-h-[calc(100vh-80px)] w-full max-w-[220px] min-w-[180px] self-start overflow-auto px-[10px] py-[45px] xl:min-w-[220px]'>
      <h3 className='text-md-regular xl:text-base-regular mb-5 px-5 text-white'>카테고리</h3>
      <nav aria-label='카테고리 메뉴'>
        <ArrowList>
          {CATEGORIES.map((category: Category) => {
            const active = selectedId === Number(category.id);
            const href = buildCategoryHref(
              searchParamsForLinks,
              active ? null : Number(category.id),
            );
            return (
              <CategoryItem
                key={category.id}
                category={category}
                isSelected={active}
                href={href}
                className='mb-2 last:mb-0'
              />
            );
          })}
        </ArrowList>
      </nav>
    </aside>
  );
};

export default CategorySidebar;
