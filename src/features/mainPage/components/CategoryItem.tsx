import React from 'react';

import { Category } from '@/shared/types/CategoryTypes';

/**
 * 카테고리 아이템 Props 타입
 */
interface CategoryItemProps {
  /** 카테고리 데이터 */
  category: Category;
  /** 선택 여부 */
  isSelected: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
  /** ↑/↓ 네비게이션 대상 지정을 위해 외부에서 클래스 주입 */
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
 * 개별 카테고리 버튼 컴포넌트
 *
 * 책임:
 * - 카테고리 버튼 UI 렌더링
 * - 카테고리 이름 표시
 * - 선택 상태에 따른 스타일 적용
 * - 클릭 이벤트 처리
 *
 * @param category - 표시할 카테고리 데이터
 * @param isSelected - 현재 선택된 상태인지 여부
 * @param onClick - 클릭 시 실행할 함수
 */
const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onClick,
  className,
}) => (
  <button
    type='button'
    onClick={onClick}
    className={`${BASE_STYLE} ${
      isSelected ? VARIANT_STYLE.selected : VARIANT_STYLE.default
    } ${className ?? ''}`}
    tabIndex={-1} // ArrowList에서 ↑/↓로 포커스 이동
    role='option'
    aria-selected={isSelected}
  >
    {category.name}
  </button>
);

export default CategoryItem;
