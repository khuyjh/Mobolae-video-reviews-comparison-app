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
 * - 데스크톱/태블릿 전용 카테고리 메뉴
 * - 선택된 상태를 URL에서 파생해 강조 처리
 * - buildCategoryHref를 사용해 링크 계산 (cursor 초기화 포함)
 */
const CategorySidebar = () => {
  const { selectedId, searchParamsForLinks } = useCategoryParams();

  return (
    <aside className='bg-black-900 h-fit w-full min-w-[180px] px-[10px] py-[45px] md:max-w-[220px] xl:min-w-[220px]'>
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
