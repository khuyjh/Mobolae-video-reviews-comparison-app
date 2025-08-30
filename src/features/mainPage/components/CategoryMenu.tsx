'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import CategorySidebar from '@/features/mainPage/components/CategorySidebar';
import MobileCategorySheet from '@/features/mainPage/components/MobileCategorySheet';
import { CATEGORIES } from '@/shared/constants/constants';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

/**
 * 카테고리 메뉴
 * - PC/Tablet: 사이드바 슬롯에 렌더
 * - Mobile: 시트 트리거 슬롯에 렌더
 */
const CategoryMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isDesktopUp = useMediaQuery('(min-width: 768px)');

  // 마운트 확인 (SSR/CSR 불일치 방지)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 현재 렌더링할 슬롯 결정
  const target = useMemo(() => {
    if (!mounted) return null;
    const id = isDesktopUp ? 'desktop-category-slot' : 'mobile-category-slot';
    return document.getElementById(id);
  }, [mounted, isDesktopUp]);

  const handleCategorySelect = (value: string | null) => {
    setSelectedCategory(value);
    // TODO: 카테고리 선택 로직 추가
  };

  if (!mounted || !target) return null;

  return createPortal(
    isDesktopUp ? (
      <CategorySidebar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
    ) : (
      <MobileCategorySheet
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
    ),
    target,
  );
};

export default CategoryMenu;
