'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import React, { useMemo, useCallback } from 'react';

import SortDropdown from '@/shared/components/SortDropdown';
import { CATEGORIES } from '@/shared/constants/constants';
import { PRODUCT_ORDER_OPTIONS, type ProductOrderKey } from '@/shared/types/SortDropdownTypes';
import { filterContents } from '@/shared/utils/filterContents';
import { toContentItem } from '@/shared/utils/mapApiToItem';
import { readQuery } from '@/shared/utils/query';
import sortContents from '@/shared/utils/sortContents';

import ContentGrid from './ContentGrid';
import { mockContentApiResponse } from '../mock/mockContents';

/**
 * 콘텐츠 리스트 컴포넌트
 * 쿼리 파싱 → 필터/정렬 → 카드 변환 → 렌더링
 */
const ContentList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * URL 쿼리(category, keyword, order)를 읽어 내부에서 안전하게 사용할 값으로 변환
   * 기본값: category(null), keyword(''), order('recent')
   */
  const { category, keyword, order } = useMemo(() => readQuery(searchParams), [searchParams]);

  /**
   * 검색, 카테고리 선택에 따라 리스트 상단 제목을 결정
   */
  const title = useMemo(() => {
    if (keyword && keyword.trim()) {
      return `‘${keyword}’로 검색한 콘텐츠`;
    }
    if (category !== null) {
      const found = CATEGORIES.find((c) => Number(c.id) === category);
      return found ? `${found.name}의 모든 콘텐츠` : `카테고리 ${category}의 모든 콘텐츠`;
    }
    return null;
  }, [keyword, category]);

  /**
   * 데이터 파생 단계:
   * 1. 필터링: category와 keyword 조건을 적용
   * 2. 정렬: order 기준으로 정렬
   * 3. 카드 모델 변환: 리스트 아이템을 그리드에 맞는 형태로 변환
   *
   */
  const filtered = useMemo(
    () => filterContents(mockContentApiResponse.list, { category, keyword }),
    [category, keyword],
  );
  const sorted = useMemo(() => sortContents(filtered, order), [filtered, order]);
  const items = useMemo(() => sorted.map(toContentItem), [sorted]);

  /**
   * 정렬 옵션 변경 핸들러
   * - URLSearchParams의 `order` 값을 갱신
   * - 페이지네이션을 재시작하기 위해 `cursor` 제거
   * - 스크롤 위치 유지
   */
  const handleChangeOrder = useCallback(
    (nextOrder: ProductOrderKey) => {
      const next = new URLSearchParams(searchParams);
      next.set('order', nextOrder);
      next.delete('cursor'); // 페이지네이션 초기화
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <section className='mx-auto w-full'>
      <div className='mb-[15px] flex w-full flex-col justify-between space-y-[30px] md:mb-[30px] md:flex-row md:space-y-0'>
        {title && <h2 className='text-xl-semibold text-white'>{title}</h2>}
        <div className='flex w-full items-center justify-between md:w-fit'>
          {/* 모바일 카테고리 시트를 포털로 주입받는 슬롯 */}
          <div id='mobile-category-slot' className='md:hidden' />
          {/* 정렬 드롭다운 */}
          <SortDropdown
            options={PRODUCT_ORDER_OPTIONS}
            value={order}
            onChange={handleChangeOrder}
          />
        </div>
      </div>
      {/* 콘텐츠 */}
      <ContentGrid items={items} />
    </section>
  );
};

export default ContentList;
