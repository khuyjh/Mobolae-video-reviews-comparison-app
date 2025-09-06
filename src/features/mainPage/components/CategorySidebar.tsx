import React from 'react';

import CategoryItem from '@/features/mainPage/components/CategoryItem';
import { Category } from '@/shared/types/categoryTypes';

import ArrowList from './ArrowList';
import { buildCategoryHref } from '../services/buildCategoryHref';

/**
 * PC/태블릿용 사이드바 카테고리 메뉴 Props 타입
 */
interface CategorySidebarProps {
  /** 카테고리 목록 */
  categories: Category[];
  /** 현재 선택된 카테고리 값 */
  selectedCategoryId: number | null;
  /**
   * 현재 페이지의 질의문자열
   * - 서버 단계와 클라이언트 단계 모두에서 하이퍼링크 목적지를 계산하기 위해 사용
   */
  searchParams: URLSearchParams;
}

/**
 * 데스크톱/태블릿용 사이드바 카테고리 메뉴
 * - 시맨틱 마크업: <aside> + <nav>
 * - 항목은 항상 하이퍼링크로 렌더링(검색 엔진 최적화, 최초 콘텐츠 페인트 이득)
 */
const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategoryId,
  searchParams,
}) => (
  <aside
    aria-labelledby='category-heading'
    className='bg-black-900 h-fit w-full min-w-[180px] px-[10px] py-[45px] md:max-w-[220px] xl:min-w-[220px]'
  >
    <h3 id='category-heading' className='text-md-regular xl:text-base-regular mb-5 px-5 text-white'>
      카테고리
    </h3>
    <nav role='navigation' aria-label='카테고리 메뉴'>
      <ArrowList>
        {categories.map((category) => {
          const active = selectedCategoryId === Number(category.id);
          const nextId = active ? null : Number(category.id);
          const href = buildCategoryHref(searchParams, nextId);

          return (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={active}
              href={href}
              className='mb-2 last:mb-0'
              role='option'
            />
          );
        })}
      </ArrowList>
    </nav>
  </aside>
);

export default CategorySidebar;
