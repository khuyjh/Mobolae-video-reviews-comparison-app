/**
 * 카테고리 아이템 타입
 */
export interface Category {
  id: number;
  name: string;
  value: string;
}

/**
 * 카테고리 메뉴 Props 타입
 */
export interface CategoryMenuProps {
  /** 선택된 카테고리 값이 변경될 때 호출되는 콜백 */
  onCategoryChange: (value: number | null) => void;
  /** 초기 선택된 카테고리 값 */
  initialValue?: string | null;
}
