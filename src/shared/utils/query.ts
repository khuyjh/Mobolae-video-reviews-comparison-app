import { ReadonlyURLSearchParams } from 'next/navigation';

import { ProductOrderKey } from '../types/SortDropdownTypes';

// 허용되는 정렬 기준 값 목록
const ORDER_VALUES: ProductOrderKey[] = ['recent', 'rating', 'reviewCount'];

/**
 * 문자열이 ProductOrderKey에 해당하는지 확인하는 타입 가드
 */
const isProductOrderKey = (value: string | null): value is ProductOrderKey =>
  !!value && ORDER_VALUES.includes(value as ProductOrderKey);

/**
 * URL 쿼리(category, keyword, order)를 읽어 안전하게 변환하는 함수
 * - category: 숫자로 변환, 잘못된 값은 null
 * - keyword: 없으면 빈 문자열
 * - order: 허용된 값만 인정, 기본값 'recent'
 */
export const readQuery = (searchParams: ReadonlyURLSearchParams) => {
  const rawCategory = searchParams.get('category');
  const keyword = searchParams.get('keyword') ?? '';
  const order = isProductOrderKey(searchParams.get('order'))
    ? (searchParams.get('order') as ProductOrderKey)
    : 'recent';

  // 숫자 변환 실패(NaN) 대비
  const category = rawCategory ? Number(rawCategory) : null;

  return {
    category: Number.isNaN(category) ? null : category,
    keyword,
    order,
  };
};
