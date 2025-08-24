'use client';

import React, { useState, useEffect } from 'react';

import CategorySidebar from '@/features/mainPage/components/CategorySidebar';
import { CATEGORIES } from '@/shared/constants/constants';
import { CategoryMenuProps } from '@/shared/types/CategoryTypes';

/**
 * 홈화면 카테고리 메뉴 메인 컴포넌트
 *
 * 역할:
 * - 선택 상태 관리 (단일 선택 + 재클릭 해제)
 * - 반응형 UI (데스크탑 사이드바 / TODO: 모바일 시트)
 *
 * @param onCategoryChange - 카테고리 변경 시 부모에게 알릴 콜백
 */
const CategoryMenu: React.FC<CategoryMenuProps> = ({ onCategoryChange }) => {
  // ==================== 상태 관리 ====================
  /** 현재 선택된 카테고리 값: 항상 null에서 시작 */
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  /** 모바일 기기 여부 (768px 미만) */
  const [isMobile, setIsMobile] = useState(false);

  // ==================== 화면 크기 감지 ====================
  /**
   * 브라우저 화면 크기에 따라 모바일/데스크탑 모드를 결정
   * 768px를 기준으로 분기처리하며, 리사이즈 이벤트를 감지
   *
   * TODO(UX): resize -> matchMedia로 변경 예정
   * 이유: 성능 최적화 및 불필요한 리렌더링 방지
   */
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 설정
    checkIsMobile();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // ==================== 이벤트 핸들러 ====================
  /**
   * 카테고리 선택/해제 토글 처리
   * 같은 카테고리를 다시 클릭하면 선택 해제됩니다.
   *
   * @param value - 선택할 카테고리 값
   */
  const handleCategorySelect = (value: string) => {
    const newValue = selectedCategory === value ? null : value;
    setSelectedCategory(newValue);
    onCategoryChange(newValue);
  };

  // ==================== 렌더링 ====================
  return (
    <>
      {/* PC/태블릿용 사이드바 */}
      {!isMobile && (
        <CategorySidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      )}

      {/* TODO: 모바일 시트 */}
    </>
  );
};

export default CategoryMenu;
