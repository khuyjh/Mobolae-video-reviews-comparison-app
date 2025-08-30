import React from 'react';

import CategoryItem from '@/features/mainPage/components/CategoryItem';
import { Category } from '@/shared/types/CategoryTypes';

import ArrowList from './ArrowList';

/**
 * PC/태블릿용 사이드바 카테고리 메뉴 Props 타입
 */
interface CategorySidebarProps {
  /** 카테고리 목록 */
  categories: Category[];
  /** 현재 선택된 카테고리 값 */
  selectedCategory: string | null;
  /** 카테고리 선택 시 호출되는 함수 */
  onCategorySelect: (value: string | null) => void;
}

/**
 * PC/태블릿용 사이드바 카테고리 메뉴
 *
 * 특징:
 * - <aside> 태그 사용으로 시맨틱한 마크업
 * - 세로로 정렬된 카테고리 목록
 * - 항상 화면에 표시됨
 *
 * @param categories - 표시할 카테고리 목록
 * @param selectedCategory - 현재 선택된 카테고리 값
 * @param onCategorySelect - 카테고리 선택 시 호출할 함수
 */
const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => (
  <aside
    aria-labelledby='category-heading'
    className='bg-black-900 h-fit px-[10px] py-[45px] md:max-w-[220px] xl:min-w-[220px]'
  >
    <h3 id='category-heading' className='text-md-regular xl:text-base-regular mb-5 px-5 text-white'>
      카테고리
    </h3>
    <nav role='navigation' aria-label='카테고리 메뉴'>
      <ArrowList>
        <div className='space-y-2'>
          {categories.map((category) => {
            const active = selectedCategory === category.value;
            const next = active ? null : category.value; // 재클릭 = 해제
            return (
              <CategoryItem
                key={category.id}
                category={category}
                isSelected={active}
                onClick={() => onCategorySelect(next)}
              />
            );
          })}
        </div>
      </ArrowList>
    </nav>
  </aside>
);

export default CategorySidebar;
