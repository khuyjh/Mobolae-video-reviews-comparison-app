import Link, { LinkProps } from 'next/link';

import React from 'react';

import { Category } from '@/shared/types/CategoryTypes';

/**
 * HTML <a> 태그 속성 타입 (onClick, aria-*, data-* 등)
 */
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * 카테고리 아이템 Props 타입
 */
interface CategoryItemProps extends AnchorProps, Partial<LinkProps> {
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
 * CategoryItem 컴포넌트
 *
 * - 카테고리 이름을 버튼처럼 렌더링하며, <Link>를 사용해 이동 기능 제공
 * - 선택된 항목은 강조 스타일 적용
 * - 외부 컴포넌트(SheetClose 등)에서 전달하는 이벤트/속성들을 내부 <a>에 전달 가능
 */
const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  href,
  className,
  ...rest // SheetClose가 주입하는 onClick, data-*, aria-* 등
}) => (
  <Link
    href={href}
    className={`${BASE_STYLE} ${
      isSelected ? VARIANT_STYLE.selected : VARIANT_STYLE.default
    } ${className ?? ''}`}
    // TODO: 탭 이동 허용 여부 재검토 (tabIndex={-1} 제거 여부)
    tabIndex={-1} // ArrowList에서 ↑/↓로 포커스 이동
    aria-current={isSelected ? 'true' : undefined}
    {...rest} // 외부에서 전달된 추가 속성 주입
  >
    {category.name}
  </Link>
);

export default CategoryItem;
