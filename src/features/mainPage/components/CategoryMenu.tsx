'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { CATEGORIES } from '@/shared/constants/constants';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

import CategorySidebar from './CategorySidebar';
import MobileCategorySheet from './MobileCategorySheet';

/**
 * 카테고리 메뉴
 *
 * - PC/Tablet: 사이드바 슬롯(#desktop-category-slot)에 렌더링
 * - Mobile: 바텀시트 슬롯(#mobile-category-slot)에 렌더링
 * - 선택 상태는 로컬 state가 아니라 URL 쿼리 파라미터(category)를 단일 소스로 관리
 */
const CategoryMenu = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktopUp = useMediaQuery('(min-width: 768px)');

  /** 마운트 여부 확인 (SSR/CSR 초기 불일치 방지) */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /** 현재 선택된 카테고리 값 (URL에서만 파생) */
  const selectedCategory = searchParams.get('category') ?? null;

  /** 현재 뷰포트에 따라 렌더링할 슬롯 DOM 결정 */
  const target = useMemo(() => {
    if (!mounted) return null;
    const id = isDesktopUp ? 'desktop-category-slot' : 'mobile-category-slot';
    return document.getElementById(id);
  }, [mounted, isDesktopUp]);

  /**
   * 카테고리 선택/해제 핸들러
   *
   * - 클릭 시 URL 쿼리 파라미터를 갱신
   * - 같은 카테고리를 다시 누르면 해제(null)
   * - 상품 리스트 무한스크롤 초기화를 위해 cursor는 항상 제거
   * - router.replace() 사용 → 히스토리에 필터 상태가 쌓이지 않도록
   */
  const handleCategorySelect = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) params.delete('category');
    else params.set('category', value);

    params.delete('cursor'); // 페이지네이션 리셋
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (!mounted || !target) return null;

  const viewProps = {
    categories: CATEGORIES,
    selectedCategory,
    onCategorySelect: handleCategorySelect,
  };

  return createPortal(
    isDesktopUp ? <CategorySidebar {...viewProps} /> : <MobileCategorySheet {...viewProps} />,
    target,
  );
};

export default CategoryMenu;
