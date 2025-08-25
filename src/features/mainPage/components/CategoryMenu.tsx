'use client';

import { useState } from 'react';

import CategorySidebar from '@/features/mainPage/components/CategorySidebar';
import { CATEGORIES } from '@/shared/constants/constants';

import MobileCategorySheet from './MobileCategorySheet';

/**
 * 홈 카테고리 메뉴
 * - 내부에서 선택 상태 관리
 * - 반응형 분기는 CSS 클래스(md:hidden / md:block)로 처리
 */
export default function CategoryMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelect = (value: string | null) => {
    setSelectedCategory(value);
    // 필요 시 여기에서 클라이언트 동작 수행 (검색 필터링, router.push 등)
  };

  return (
    <>
      {/* 데스크탑/태블릿 */}
      <div className='hidden md:block'>
        <CategorySidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategorySelect={(v) => handleSelect(v)}
        />
      </div>

      {/* 모바일 */}
      <div className='md:hidden'>
        <MobileCategorySheet
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategorySelect={handleSelect}
        />
      </div>
    </>
  );
}
