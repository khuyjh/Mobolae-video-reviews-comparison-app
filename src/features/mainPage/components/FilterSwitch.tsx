'use client';

import { useSearchParams } from 'next/navigation'; // 현재 URL의 쿼리스트링을 읽기 위한 훅

import ContentList from '@/features/mainPage/components/ContentList';

/**
 * FilterSwitch
 * - URL 쿼리(category, keyword)를 확인해서
 *   - 검색/카테고리 필터가 있으면 ContentList를 CSR로 렌더
 *   - 없으면 서버가 ISR/SSG로 렌더한 children을 그대로 보여줌
 * - 목적: 홈을 기본적으로는 정적 페이지로 유지하면서,
 *   검색/필터 시에는 CSR로 동적으로 전환
 */
const FilterSwitch = ({ children }: { children: React.ReactNode }) => {
  // 현재 URL의 쿼리스트링 접근 (예: /?category=MOVIE&keyword=테스트)
  const sp = useSearchParams();

  // category 값 추출 (없으면 undefined)
  const category = sp.get('category') ?? undefined;

  // keyword 값 추출 (없으면 undefined)
  const keyword = sp.get('keyword') ?? undefined;

  // category나 keyword 중 하나라도 있으면 true
  const hasFilter = Boolean(category || (keyword && keyword.trim()));

  // 필터가 있다면 → CSR로 ContentList 컴포넌트 렌더
  if (hasFilter) return <ContentList />;

  // 필터가 없다면 → 서버에서 미리 렌더된 children 노출
  return <>{children}</>;
};

export default FilterSwitch;
