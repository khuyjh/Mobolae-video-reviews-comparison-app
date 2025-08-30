import Link from 'next/link';

import React from 'react';

import { Category } from '@/shared/types/CategoryTypes';

/**
 * 카테고리 아이템 Props 타입
 */
interface CategoryItemProps {
  /** 카테고리 항목 */
  category: Category;
  /** 선택 여부 */
  isSelected: boolean;
  /** 이동할 하이퍼링크 목적지 */
  href: string;
  /** 선택적 추가 클래스 */
  className?: string;
}

/** 공통 기본 스타일 */
const BASE_STYLE =
  'nav-item text-md-medium xl:text-base-medium w-full cursor-pointer rounded-lg border px-5 py-[15px] text-left transition-all duration-200';

/** 상태별 스타일 */
const VARIANT_STYLE = {
  selected: 'bg-black-800 border-black-700 text-white',
  default: 'border-black-900 bg-black-900 text-gray-600 hover:bg-black-800 hover:text-gray-400',
};

/**
 * 카테고리 아이템 컴포넌트
 *
 * 역할:
 * - 카테고리 이름 렌더링
 * - 선택 여부에 따라 스타일 적용
 * - 지정된 하이퍼링크로 이동
 *
 * Props:
 * - category: 표시할 카테고리 정보
 * - isSelected: 선택 상태 여부
 * - href: 이동할 URL
 * - className: (선택) 외부에서 전달되는 추가 클래스
 */

const CategoryItem: React.FC<CategoryItemProps> = ({ category, isSelected, href, className }) => (
  <Link
    href={href}
    className={`${BASE_STYLE} ${
      isSelected ? VARIANT_STYLE.selected : VARIANT_STYLE.default
    } ${className ?? ''}`}
    tabIndex={-1} // ArrowList에서 ↑/↓로 포커스 이동
    aria-current={isSelected ? 'true' : undefined}
  >
    {category.name}
  </Link>
);

export default CategoryItem;
