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
  onCategorySelect: (value: string) => void;
}

/**
 * PC/태블릿용 사이드바 카테고리 메뉴
 *
 * 특징:
 * - <aside> 태그 사용으로 시맨틱한 마크업
 * - 세로로 정렬된 카테고리 목록
 * - 항상 화면에 표시됨
 * - 고정 너비 (md: 180px, xl: 260px)
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
  <aside className='bg-black-900 w-[180px] px-[10px] py-[45px] xl:w-[260px]'>
    <h3 className='text-md-regular xl:text-base-regular mb-5 px-5 text-white'>카테고리</h3>
    <nav role='navigation' aria-label='카테고리 네비게이션'>
      <ArrowList>
        <div className='space-y-2'>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.value}
              onClick={() => onCategorySelect(category.value)}
            />
          ))}
        </div>
      </ArrowList>
    </nav>
  </aside>
);

export default CategorySidebar;
