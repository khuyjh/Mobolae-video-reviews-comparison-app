'use client';

import { useSearchParams } from 'next/navigation';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { CATEGORIES } from '@/shared/constants/constants';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

import CategorySidebar from './CategorySidebar';
import MobileCategorySheet from './MobileCategorySheet';

/**
 * 카테고리 메뉴 (포털 인계 컨트롤러)
 * - 데스크톱 또는 태블릿 화면: 데스크톱용 슬롯에 사이드바를 렌더링
 * - 모바일 화면: 모바일용 슬롯에 바텀 시트를 렌더링
 * - 선택 상태는 인터넷 주소의 질의 문자열에서만 파생
 * - 이 컴포넌트는 상태를 조작하지 않고 포털로 주입만 수행
 */
const CategoryMenu = () => {
  const searchParamsInClient = useSearchParams();
  const isDesktopUp = useMediaQuery('(min-width: 768px)');

  /** 마운트 여부 확인 (SSR/CSR 초기 불일치 방지) */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /** 현재 선택된 카테고리 값 (URL에서만 파생) */
  const selectedCategory = searchParamsInClient.get('category') ?? null;

  /** 하이퍼링크 목적지 계산을 위해 URLSearchParams 인스턴스 생성 */
  const searchParamsForLinks = useMemo(
    () => new URLSearchParams(searchParamsInClient.toString()),
    [searchParamsInClient],
  );

  /** 현재 뷰포트에 따라 렌더링할 슬롯 DOM 결정 */
  const target = useMemo(() => {
    if (!mounted) return null;
    const id = isDesktopUp ? 'desktop-category-slot' : 'mobile-category-slot';
    return document.getElementById(id);
  }, [mounted, isDesktopUp]);

  if (!mounted || !target) return null;

  return createPortal(
    isDesktopUp ? (
      <CategorySidebar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        searchParams={searchParamsForLinks}
      />
    ) : (
      <MobileCategorySheet categories={CATEGORIES} selectedCategory={selectedCategory} />
    ),
    target,
  );
};

export default CategoryMenu;
